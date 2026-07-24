#!/usr/bin/env node
/**
 * secret-scan.js — PreToolUse guard for ActuWorld API.
 *
 * Blocks writing or committing Supabase service_role keys, raw .env secrets,
 * and other high-risk credentials. Self-contained: no ECC / plugin dependency.
 *
 * Claude Code calls this with a PreToolUse JSON payload on stdin:
 *   { tool_name, tool_input: { ... } }
 * Exit 0 = allow. Exit 2 = block (stderr is shown back to the agent).
 *
 * Wired up in .claude/settings.json for matchers: Write|Edit|MultiEdit and Bash.
 */
'use strict';

const { execSync } = require('child_process');

function readStdin() {
  try {
    return require('fs').readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function block(reason) {
  process.stderr.write(
    `\n[secret-scan] BLOCKED: ${reason}\n` +
      `Ne commit/écris jamais de secret en clair. Utilise une variable d'env (.env non suivi) ` +
      `et, si une clé a fuité, fais-la TOURNER côté Supabase.\n`
  );
  process.exit(2);
}

// --- Detectors -------------------------------------------------------------

// A Supabase service_role key is a JWT whose payload has "role":"service_role".
// An anon key is also a JWT but with "role":"anon" — that one is public, do NOT block.
function jwtIsServiceRole(content) {
  const jwtRe = /eyJ[A-Za-z0-9_-]+\.(eyJ[A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+/g;
  let m;
  while ((m = jwtRe.exec(content)) !== null) {
    try {
      const payload = Buffer.from(m[1], 'base64').toString('utf8');
      const obj = JSON.parse(payload);
      if (obj && obj.role === 'service_role') return true;
    } catch {
      /* not a decodable JWT payload — ignore */
    }
  }
  return false;
}

// Returns a reason string if content contains a real secret, else null.
function scan(content, label) {
  if (!content) return null;

  if (jwtIsServiceRole(content)) {
    return `Supabase service_role JWT détecté dans ${label}`;
  }

  // New-style Supabase secret keys: sb_secret_...
  if (/\bsb_secret_[A-Za-z0-9]{8,}/.test(content)) {
    return `clé secrète Supabase (sb_secret_*) détectée dans ${label}`;
  }

  // SUPABASE_SERVICE_ROLE_KEY assigned a non-placeholder value.
  const svc = content.match(
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["']?([^"'\s]+)/i
  );
  if (svc) {
    const v = svc[1];
    const placeholder = /^(your|xxx|<|\$\{|changeme|placeholder|todo|eyJyourkey)/i.test(v);
    if (!placeholder && v.length > 12) {
      return `SUPABASE_SERVICE_ROLE_KEY avec valeur réelle dans ${label}`;
    }
  }

  return null;
}

// --- Main ------------------------------------------------------------------

let payload;
try {
  payload = JSON.parse(readStdin() || '{}');
} catch {
  process.exit(0); // malformed input → fail open, don't block legit work
}

const tool = payload.tool_name || '';
const input = payload.tool_input || {};

// 1) Write / Edit / MultiEdit — scan the content about to land on disk.
if (tool === 'Write') {
  const r = scan(String(input.content || ''), `Write ${input.file_path || ''}`);
  if (r) block(r);
}
if (tool === 'Edit') {
  const r = scan(String(input.new_string || ''), `Edit ${input.file_path || ''}`);
  if (r) block(r);
}
if (tool === 'MultiEdit' && Array.isArray(input.edits)) {
  for (const e of input.edits) {
    const r = scan(String(e.new_string || ''), `MultiEdit ${input.file_path || ''}`);
    if (r) block(r);
  }
}

// 2) Bash — scan inline command, and staged diff on git add/commit.
if (tool === 'Bash') {
  const cmd = String(input.command || '');

  const inline = scan(cmd, 'commande Bash');
  if (inline) block(inline);

  if (/\bgit\s+(add|commit)\b/.test(cmd)) {
    // Block committing a real .env (but allow .env.example / .env.sample).
    if (/\bgit\s+add\b[^\n]*\.env(\s|$)/.test(cmd) && !/\.env\.(example|sample|template)/.test(cmd)) {
      block('tentative de `git add` d\'un fichier .env (secrets)');
    }
    try {
      const staged = execSync('git diff --cached --no-color', {
        encoding: 'utf8',
        maxBuffer: 20 * 1024 * 1024,
      });
      const r = scan(staged, 'contenu indexé (git diff --cached)');
      if (r) block(r);
    } catch {
      /* not a git repo / git unavailable → don't block */
    }
  }
}

process.exit(0);
