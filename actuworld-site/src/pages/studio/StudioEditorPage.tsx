import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle, AlertTriangle, CheckCircle2, Cloud, CloudOff, Eye, FilePlus2, FileText,
  Info, Loader2, Maximize2, Minimize2, Redo2, Send, Smartphone, Undo2,
} from 'lucide-react';
import { Section } from '../../components/Section';
import { PageMeta } from '../../components/PageMeta';
import { BlockListEditor } from '../../components/studio/BlockListEditor';
import { SourceListEditor } from '../../components/studio/SourceListEditor';
import { TagsInput } from '../../components/studio/TagsInput';
import { DraftList } from '../../components/studio/DraftList';
import { ArticlePreview } from '../../components/studio/ArticlePreview';
import { PublishedList } from '../../components/studio/PublishedList';
import { WritingHelpModal } from '../../components/studio/WritingHelpModal';
import { SourceLibrary } from '../../components/studio/SourceLibrary';
import { StudioTabs } from '../../components/studio/StudioTabs';
import { PaperSheet } from '../../components/studio/PaperSheet';
import { StudioByline } from '../../components/studio/StudioByline';
import { useLanguage } from '../../i18n/LanguageContext';
import { studioApi } from '../../lib/studio/api';
import { useStudioSession } from '../../hooks/useStudioSession';
import { STUDIO_THEMES } from '../../lib/studio/themes';
import { journalImageUrl, resolveAvatarUrl, uploadJournalImage } from '../../lib/studio/images';
import {
  BODY_MAX, DEK_MAX, MAX_SOURCES, TITLE_MAX,
  blockBodyLen, cleanBlocks, cleanSources, createDraft, deleteDraft,
  isValidSourceUrl, listMyJournal, updateDraft,
} from '../../lib/studio/journal';
import { clearLocalDraft, loadLocalDraft, saveLocalDraft } from '../../lib/studio/draftStorage';
import type { JournalBlock, JournalSource, StudioDraftRow } from '../../types/journal';

type StudioProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  avatar_updated_at?: string | null;
} | null;

const AUTOSAVE_DELAY_MS = 800;

const bareTitleClass =
  'w-full bg-transparent text-2xl font-bold text-aw-text placeholder:text-aw-muted focus:outline-none';
const bareDekClass =
  'w-full bg-transparent text-base text-aw-text placeholder:text-aw-muted focus:outline-none resize-none';

function readAuthErrorFromHash(): string | null {
  const hash = window.location.hash;
  if (!hash.includes('error')) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return params.get('error_description') ?? params.get('error');
}

/** Échec réseau pur (API injoignable ou CORS refusé) — à distinguer d'une erreur métier. */
function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError;
}

export default function StudioEditorPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const { session, isLoading } = useStudioSession();
  const [profile, setProfile] = useState<StudioProfile>(null);
  const authError = useMemo(readAuthErrorFromHash, []);

  // ── État de l'éditeur (parité composer mobile) ──
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [dek, setDek] = useState('');
  const [primaryTheme, setPrimaryTheme] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [coverPath, setCoverPath] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<JournalBlock[]>([{ type: 'paragraph', text: '' }]);
  const [sources, setSources] = useState<JournalSource[]>([{ url: '', title: '' }]);
  const [restoredNotice, setRestoredNotice] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // ── Envoi ──
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sentDraftTitle, setSentDraftTitle] = useState<string | null>(null);

  // ── Aperçu mobile ──
  const [showPreview, setShowPreview] = useState(false);

  // ── Mode focus (écriture plein écran) ──
  const [focusMode, setFocusMode] = useState(false);

  // ── Aide à l'écriture (checklist + conseils, derrière l'icône info) ──
  const [showHelp, setShowHelp] = useState(false);

  // ── Historique annuler/rétablir (structure + texte, granularité ~400 ms) ──
  type EditorSnapshot = {
    editingDraftId: string | null;
    title: string; dek: string; primaryTheme: string;
    tags: string[]; coverPath: string | null;
    blocks: JournalBlock[]; sources: JournalSource[];
  };
  const historyRef = useRef<EditorSnapshot[]>([]);
  const redoStackRef = useRef<EditorSnapshot[]>([]);
  const skipHistoryRef = useRef(false);
  const HISTORY_MAX = 60;

  // ── Sauvegarde serveur continue ──
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const lastSavedSnapshotRef = useRef<string | null>(null);
  const isAutosavingRef = useRef(false);

  // ── Brouillons + publiés Supabase ──
  const [drafts, setDrafts] = useState<StudioDraftRow[]>([]);
  const [published, setPublished] = useState<StudioDraftRow[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [draftsError, setDraftsError] = useState<string | null>(null);
  const [busyDraftId, setBusyDraftId] = useState<string | null>(null);

  const userId = session?.user.id;
  const restoredForUser = useRef<string | null>(null);

  const apiUnreachableMsg = t(
    "Impossible de joindre le serveur ActuWorld. Ton texte est sauvegardé dans ce navigateur — réessaie plus tard.",
    'Cannot reach the ActuWorld server. Your text is saved in this browser — try again later.'
  );

  // ── Budget de corps (BODY_MAX, comme l'app) ──
  const bodyLength = blocks.reduce((sum, block) => sum + blockBodyLen(block), 0);
  const budgetFor = (currentLen: number) => currentLen + Math.max(0, BODY_MAX - bodyLength);
  const bodyAtLimit = bodyLength >= BODY_MAX;
  const bodyCounterClass = bodyAtLimit
    ? 'text-red-500'
    : bodyLength > BODY_MAX * 0.9
      ? 'text-amber-500'
      : 'text-aw-muted';

  // ── Compteur de mots + temps de lecture (~200 mots/min) ──
  const wordCount = blocks.reduce((count, block) => {
    const text =
      block.type === 'heading' || block.type === 'paragraph' || block.type === 'quote' || block.type === 'image_text'
        ? block.text
        : '';
    return count + (text.trim() ? text.trim().split(/\s+/).length : 0);
  }, 0);
  const readMinutes = Math.max(1, Math.round(wordCount / 200));

  // ── Annuler / rétablir ──
  const makeSnapshot = (): EditorSnapshot => ({
    editingDraftId, title, dek, primaryTheme, tags, coverPath, blocks, sources,
  });
  const applySnapshot = (snap: EditorSnapshot) => {
    skipHistoryRef.current = true;
    setEditingDraftId(snap.editingDraftId);
    setTitle(snap.title);
    setDek(snap.dek);
    setPrimaryTheme(snap.primaryTheme);
    setTags(snap.tags);
    setCoverPath(snap.coverPath);
    setBlocks(snap.blocks);
    setSources(snap.sources);
  };

  // Enregistrement de l'historique (coalescé à 400 ms de silence)
  useEffect(() => {
    if (sentDraftTitle) return;
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const snap = makeSnapshot();
      const last = historyRef.current[historyRef.current.length - 1];
      if (last && JSON.stringify(last) === JSON.stringify(snap)) return;
      historyRef.current.push(snap);
      if (historyRef.current.length > HISTORY_MAX) historyRef.current.shift();
      redoStackRef.current = [];
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingDraftId, title, dek, primaryTheme, tags, coverPath, blocks, sources, sentDraftTitle]);

  const undo = () => {
    if (sentDraftTitle) return;
    const history = historyRef.current;
    if (history.length === 0) return;
    const current = makeSnapshot();
    const currentJson = JSON.stringify(current);
    let target = history[history.length - 1];
    if (JSON.stringify(target) === currentJson) {
      if (history.length < 2) return;
      history.pop();
      target = history[history.length - 1];
    }
    redoStackRef.current.push(current);
    applySnapshot(target);
  };

  const redo = () => {
    if (sentDraftTitle) return;
    const snap = redoStackRef.current.pop();
    if (!snap) return;
    historyRef.current.push(makeSnapshot());
    if (historyRef.current.length > HISTORY_MAX) historyRef.current.shift();
    applySnapshot(snap);
  };

  // Profil pour la barre de session (1 retry : le premier appel peut tomber
  // pendant le refresh de session au retour du magic link)
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const load = (attempt: number) => {
      studioApi
        .get<StudioProfile>(`/profiles/id/${userId}`)
        .then((data) => { if (isMounted) setProfile(data); })
        .catch(() => {
          if (isMounted && attempt === 0) retryTimer = setTimeout(() => load(1), 2000);
        });
    };
    load(0);
    return () => { isMounted = false; clearTimeout(retryTimer); };
  }, [userId]);

  // Restauration du brouillon local (une fois par utilisateur)
  useEffect(() => {
    if (!userId || restoredForUser.current === userId) return;
    restoredForUser.current = userId;
    const local = loadLocalDraft(userId);
    if (!local) return;
    const hasContent =
      local.title.trim() || local.dek.trim() || local.coverPath ||
      (local.tags ?? []).length > 0 ||
      local.blocks.some((b) => b.type !== 'divider' && ('text' in b ? b.text.trim() : true)) ||
      local.sources.some((s) => s.url.trim());
    if (!hasContent) return;
    setEditingDraftId(local.editingDraftId);
    setTitle(local.title);
    setDek(local.dek);
    setPrimaryTheme(local.primaryTheme);
    setTags(local.tags ?? []);
    setCoverPath(local.coverPath ?? null);
    setBlocks(local.blocks.length > 0 ? local.blocks : [{ type: 'paragraph', text: '' }]);
    setSources(local.sources.length > 0 ? local.sources : [{ url: '', title: '' }]);
    setRestoredNotice(true);
  }, [userId]);

  // Autosauvegarde locale (debounce)
  useEffect(() => {
    if (!userId || sentDraftTitle) return;
    const timer = setTimeout(() => {
      saveLocalDraft(userId, { editingDraftId, title, dek, primaryTheme, tags, coverPath, blocks, sources });
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [userId, editingDraftId, title, dek, primaryTheme, tags, coverPath, blocks, sources, sentDraftTitle]);

  // Chargement des brouillons + publiés Supabase
  const refreshJournal = useCallback(async () => {
    setDraftsError(null);
    try {
      const rows = await listMyJournal();
      setDrafts(rows.filter((row) => row.status === 'draft'));
      setPublished(rows.filter((row) => row.status === 'published').slice(0, 5));
    } catch (err: unknown) {
      setDraftsError(isNetworkError(err) ? apiUnreachableMsg : t(
        'Le chargement des brouillons a échoué.', 'Loading drafts failed.'
      ));
    } finally {
      setDraftsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnglish]);

  useEffect(() => {
    if (userId) void refreshJournal();
  }, [userId, refreshJournal]);

  // ── Payload partagé autosave / envoi ──
  const buildPayload = () => ({
    title: title.trim(),
    dek: dek.trim() || null,
    blocks: cleanBlocks(blocks),
    sources: cleanSources(sources),
    primary_theme: primaryTheme || null,
    tags: tags.length > 0 ? tags : undefined,
    cover_url: coverPath,
  });

  // ── Sauvegarde serveur continue : dès qu'il y a un titre, le brouillon vit
  // sur Supabase (création puis PUT silencieux ~2,5 s après la dernière frappe).
  // L'autosauvegarde locale reste le filet quand l'API est injoignable. ──
  useEffect(() => {
    if (!userId || sentDraftTitle || isSending || !title.trim()) return;
    const payload = buildPayload();
    const snapshot = JSON.stringify(payload);
    if (snapshot === lastSavedSnapshotRef.current) return;

    const timer = setTimeout(async () => {
      if (isAutosavingRef.current) return; // un save à la fois — le prochain changement relancera
      isAutosavingRef.current = true;
      setSaveState('saving');
      try {
        if (editingDraftId) {
          await updateDraft(editingDraftId, payload);
        } else {
          const { id } = await createDraft(payload);
          setEditingDraftId(id);
          void refreshJournal();
        }
        lastSavedSnapshotRef.current = snapshot;
        setSaveState('saved');
        setLastSavedAt(new Date().toLocaleTimeString(isEnglish ? 'en-GB' : 'fr-FR', {
          hour: '2-digit', minute: '2-digit',
        }));
      } catch {
        setSaveState('error');
      } finally {
        isAutosavingRef.current = false;
      }
    }, 2500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, editingDraftId, title, dek, primaryTheme, tags, coverPath, blocks, sources, sentDraftTitle, isSending]);

  const resetEditor = () => {
    setEditingDraftId(null);
    setTitle('');
    setDek('');
    setPrimaryTheme('');
    setTags([]);
    setCoverPath(null);
    setBlocks([{ type: 'paragraph', text: '' }]);
    setSources([{ url: '', title: '' }]);
    setSendError('');
    setSentDraftTitle(null);
    setRestoredNotice(false);
    setSaveState('idle');
    setLastSavedAt(null);
    lastSavedSnapshotRef.current = null;
  };

  const hasDraftContent =
    title.trim().length > 0 || dek.trim().length > 0 || coverPath !== null ||
    primaryTheme !== '' || tags.length > 0 ||
    blocks.some((b) => (b.type === 'image' || b.type === 'image_text') ? !!b.uri : b.type !== 'divider' && b.text.trim().length > 0) ||
    sources.some((s) => !!s.url?.trim() || !!s.title?.trim());

  // « Nouveau » : met de côté l'article en cours (sauvegarde serveur immédiate,
  // il rejoint « Mes brouillons ») puis ouvre un éditeur vierge — permet de
  // travailler plusieurs articles en parallèle sans passer par l'envoi.
  const handleNewArticle = async () => {
    if (isSending || isAutosavingRef.current) return;
    if (!hasDraftContent) {
      resetEditor();
      return;
    }
    if (!title.trim()) {
      setSendError(t(
        "Ajoute un titre à l'article en cours pour le garder en brouillon avant d'en commencer un nouveau.",
        'Add a title to the current article to keep it as a draft before starting a new one.'
      ));
      return;
    }
    isAutosavingRef.current = true; // bloque l'autosave pendant la mise de côté
    setSaveState('saving');
    try {
      const payload = buildPayload();
      if (editingDraftId) {
        await updateDraft(editingDraftId, payload);
      } else {
        await createDraft(payload);
      }
      if (userId) clearLocalDraft(userId);
      resetEditor();
      void refreshJournal();
    } catch (err: unknown) {
      setSaveState('error');
      setSendError(isNetworkError(err) ? apiUnreachableMsg
        : err instanceof Error ? err.message : t('La mise de côté a échoué.', 'Setting the draft aside failed.'));
    } finally {
      isAutosavingRef.current = false;
    }
  };

  const handlePickCover = () => coverInputRef.current?.click();

  const handleCoverSelected = async (file: File | undefined) => {
    if (!file || isCoverUploading) return;
    setIsCoverUploading(true);
    setSendError('');
    try {
      setCoverPath(await uploadJournalImage(file));
    } catch (err: unknown) {
      setSendError(isNetworkError(err) ? apiUnreachableMsg
        : err instanceof Error ? err.message : t("L'upload de la cover a échoué.", 'Cover upload failed.'));
    } finally {
      setIsCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (isSending || !userId || sentDraftTitle) return;
    setSendError('');

    if (!title.trim()) {
      setSendError(t('Un titre est requis pour envoyer le brouillon.', 'A title is required to send the draft.'));
      return;
    }
    const invalidSource = sources.some((s) => s.url.trim() && !isValidSourceUrl(s.url));
    if (invalidSource) {
      setSendError(t(
        'Une des sources a une URL invalide (elle doit commencer par http:// ou https://).',
        'One of the sources has an invalid URL (it must start with http:// or https://).'
      ));
      return;
    }

    setIsSending(true);
    try {
      const payload = buildPayload();
      if (editingDraftId) {
        await updateDraft(editingDraftId, payload);
      } else {
        await createDraft(payload);
      }
      clearLocalDraft(userId);
      setSentDraftTitle(payload.title);
      setSaveState('idle');
      setLastSavedAt(null);
      lastSavedSnapshotRef.current = null;
      void refreshJournal();
    } catch (err: unknown) {
      setSendError(isNetworkError(err) ? apiUnreachableMsg
        : err instanceof Error ? err.message
        : t("L'envoi a échoué.", 'Sending failed.'));
    } finally {
      setIsSending(false);
    }
  };

  const handleResume = (draft: StudioDraftRow) => {
    setEditingDraftId(draft.id);
    setTitle(draft.title ?? '');
    setDek(draft.dek ?? '');
    setPrimaryTheme(draft.primary_theme ?? '');
    setTags(draft.tags ?? []);
    setCoverPath(draft.cover_url ?? null);
    setBlocks(draft.blocks && draft.blocks.length > 0 ? draft.blocks : [{ type: 'paragraph', text: '' }]);
    setSources(draft.sources && draft.sources.length > 0 ? draft.sources.slice(0, 2) : [{ url: '', title: '' }]);
    setSentDraftTitle(null);
    setSendError('');
    setRestoredNotice(false);
    // Le brouillon repris est déjà sauvegardé : indicateur « enregistré » et
    // snapshot vide (la première frappe déclenchera un PUT, sans doublon).
    setSaveState('saved');
    setLastSavedAt(new Date(draft.updated_at).toLocaleTimeString(isEnglish ? 'en-GB' : 'fr-FR', {
      hour: '2-digit', minute: '2-digit',
    }));
    lastSavedSnapshotRef.current = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (draft: StudioDraftRow) => {
    const confirmed = window.confirm(t(
      `Supprimer définitivement le brouillon « ${draft.title || '(sans titre)'} » ?`,
      `Permanently delete the draft “${draft.title || '(untitled)'}”?`
    ));
    if (!confirmed) return;
    setBusyDraftId(draft.id);
    try {
      await deleteDraft(draft.id);
      if (editingDraftId === draft.id) resetEditor();
      await refreshJournal();
    } catch (err: unknown) {
      setDraftsError(isNetworkError(err) ? apiUnreachableMsg : t('La suppression a échoué.', 'Deletion failed.'));
    } finally {
      setBusyDraftId(null);
    }
  };

  // Réutiliser une source de la bibliothèque : remplit la première ligne vide,
  // sinon ajoute une ligne (dans la limite MAX_SOURCES).
  const canAddLibrarySource =
    sources.some((s) => !s.url.trim()) || sources.length < MAX_SOURCES;
  const addLibrarySource = (source: JournalSource) => {
    setSources((prev) => {
      const emptyIndex = prev.findIndex((s) => !s.url.trim());
      if (emptyIndex !== -1) return prev.map((s, i) => (i === emptyIndex ? source : s));
      if (prev.length < MAX_SOURCES) return [...prev, source];
      return prev;
    });
  };

  // Raccourcis clavier : Ctrl/Cmd+Entrée = envoyer, Ctrl/Cmd+Z = annuler,
  // Ctrl/Cmd+Maj+Z ou Ctrl/Cmd+Y = rétablir, Échap = quitter le mode focus
  // (l'aperçu gère son propre Échap).
  const keyActionsRef = useRef({
    send: () => {}, undo: () => {}, redo: () => {}, escape: () => {},
  });
  keyActionsRef.current = {
    send: () => { void handleSend(); },
    undo,
    redo,
    escape: () => {
      // L'aperçu et l'aide gèrent leur propre Échap ; ici : sortir du focus.
      if (!showPreview && !showHelp && focusMode) setFocusMode(false);
    },
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const actions = keyActionsRef.current;
      const mod = event.ctrlKey || event.metaKey;
      if (mod && event.key === 'Enter') {
        event.preventDefault();
        actions.send();
      } else if (mod && !event.shiftKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        actions.undo();
      } else if (mod && (event.key.toLowerCase() === 'y' || (event.shiftKey && event.key.toLowerCase() === 'z'))) {
        event.preventDefault();
        actions.redo();
      } else if (event.key === 'Escape') {
        actions.escape();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-aw-bg flex items-center justify-center">
        <p className="text-aw-muted">{t('Connexion…', 'Signing in…')}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-aw-bg">
        <Section className="pt-24 pb-16">
          <div className="max-w-lg mx-auto text-center">
            {authError ? (
              <div className="card p-8" role="alert">
                <AlertTriangle className="w-8 h-8 text-aw-primary mx-auto mb-4" />
                <h2 className="body-semi text-lg mb-2">{t('Lien invalide ou expiré', 'Invalid or expired link')}</h2>
                <p className="text-aw-muted text-sm mb-6">
                  {t(
                    'Ton lien de connexion a déjà été utilisé ou a expiré. Demande-en un nouveau.',
                    'Your sign-in link was already used or has expired. Request a new one.'
                  )}
                </p>
                <Link to="/studio" className="btn-primary inline-flex">
                  {t('Recevoir un nouveau lien', 'Get a new link')}
                </Link>
              </div>
            ) : (
              <Navigate to="/studio" replace />
            )}
          </div>
        </Section>
      </div>
    );
  }

  // Nom affiché : profil API, sinon métadonnées de session (le JWT contient
  // display_name), l'email en tout dernier recours.
  const metadataName = typeof session.user.user_metadata?.display_name === 'string'
    ? session.user.user_metadata.display_name
    : null;
  const displayName = profile?.display_name || profile?.username || metadataName || session.user.email || '';
  const avatarSrc = resolveAvatarUrl(profile?.avatar_url, profile?.avatar_updated_at);

  return (
    <div className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t('Studio — Éditeur', 'Studio — Editor')}
        description={t(
          "Éditeur web ActuWorld : écris ton article et envoie-le comme brouillon dans l'app.",
          'ActuWorld web editor: write your article and send it as a draft to the app.'
        )}
        path="/studio/editeur"
      />

      <Section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Signature de session façon post (masquée en mode focus) */}
            {!focusMode && (
              <StudioByline displayName={displayName} username={profile?.username} avatarSrc={avatarSrc} />
            )}

            {!focusMode && <StudioTabs active="article" />}

            {sentDraftTitle ? (
              /* ── Confirmation d'envoi ── */
              <div className="card p-10 text-center" role="status">
                <CheckCircle2 className="w-10 h-10 text-aw-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">{t('Brouillon envoyé !', 'Draft sent!')}</h1>
                <p className="text-aw-muted max-w-md mx-auto mb-2">
                  {t(
                    `« ${sentDraftTitle} » t'attend dans l'app ActuWorld, section Brouillons de la page de création.`,
                    `“${sentDraftTitle}” is waiting for you in the ActuWorld app, in the Drafts section of the compose page.`
                  )}
                </p>
                <p className="text-aw-muted text-sm max-w-md mx-auto mb-8 inline-flex items-center justify-center">
                  <Smartphone className="w-4 h-4 mr-1.5 shrink-0" />
                  {t(
                    'Relis-le sur ton téléphone puis appuie sur Publier — la vérification des sources (ASV) se lance à ce moment-là.',
                    'Review it on your phone then tap Publish — source verification (ASV) runs at that moment.'
                  )}
                </p>
                <div>
                  <button type="button" onClick={resetEditor} className="btn-primary">
                    {t('Écrire un autre article', 'Write another article')}
                  </button>
                </div>
              </div>
            ) : (
              /* ── Éditeur (mise en page miroir du composer mobile) sur la
                   feuille de journal partagée (PaperSheet) ── */
              <div className={focusMode ? 'fixed inset-0 z-40 overflow-y-auto bg-aw-bg py-8 px-4' : ''}>
              <PaperSheet className={focusMode ? 'max-w-3xl mx-auto' : ''}>
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap pt-1">
                  <div>
                    <h1 className="text-xl font-bold text-aw-primary">
                      {editingDraftId ? t('Brouillon', 'Draft') : t('Nouvel article', 'New article')}
                    </h1>
                    {/* Indicateur de sauvegarde continue */}
                    <p className="text-xs mt-0.5 min-h-[1rem]" aria-live="polite">
                      {saveState === 'saving' && (
                        <span className="text-aw-muted inline-flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> {t('Enregistrement…', 'Saving…')}
                        </span>
                      )}
                      {saveState === 'saved' && lastSavedAt && (
                        <span className="text-aw-muted inline-flex items-center gap-1">
                          <Cloud className="w-3 h-3" /> {t(`Enregistré à ${lastSavedAt}`, `Saved at ${lastSavedAt}`)}
                        </span>
                      )}
                      {saveState === 'error' && (
                        <span className="text-amber-500 inline-flex items-center gap-1">
                          <CloudOff className="w-3 h-3" />
                          {t('Hors ligne — sauvegardé dans ce navigateur', 'Offline — saved in this browser')}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowHelp(true)}
                      className="p-2 rounded-lg border border-aw text-aw-muted hover:text-aw-primary"
                      aria-label={t("Aide à l'écriture", 'Writing help')}
                      title={t("Aide à l'écriture", 'Writing help')}
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={undo}
                      className="p-2 rounded-lg border border-aw text-aw-muted hover:text-aw-primary"
                      aria-label={t('Annuler (Ctrl+Z)', 'Undo (Ctrl+Z)')}
                      title={t('Annuler (Ctrl+Z)', 'Undo (Ctrl+Z)')}
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={redo}
                      className="p-2 rounded-lg border border-aw text-aw-muted hover:text-aw-primary"
                      aria-label={t('Rétablir (Ctrl+Maj+Z)', 'Redo (Ctrl+Shift+Z)')}
                      title={t('Rétablir (Ctrl+Maj+Z)', 'Redo (Ctrl+Shift+Z)')}
                    >
                      <Redo2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFocusMode((f) => !f)}
                      className="p-2 rounded-lg border border-aw text-aw-muted hover:text-aw-primary"
                      aria-label={focusMode ? t('Quitter le mode focus (Échap)', 'Exit focus mode (Esc)') : t('Mode focus', 'Focus mode')}
                      title={focusMode ? t('Quitter le mode focus (Échap)', 'Exit focus mode (Esc)') : t('Mode focus', 'Focus mode')}
                    >
                      {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    {hasDraftContent && (
                      <button
                        type="button"
                        onClick={() => void handleNewArticle()}
                        disabled={isSending}
                        className="btn-outline inline-flex items-center text-sm disabled:opacity-50"
                        title={t(
                          "Garder l'article en cours dans mes brouillons et en commencer un nouveau",
                          'Keep the current article in my drafts and start a new one'
                        )}
                      >
                        <FilePlus2 className="w-4 h-4 mr-1.5" /> {t('Nouveau', 'New')}
                      </button>
                    )}
                    {hasDraftContent && (
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="btn-outline inline-flex items-center text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1.5" /> {t('Aperçu', 'Preview')}
                      </button>
                    )}
                  </div>
                </div>

                {restoredNotice && (
                  <p className="text-aw-muted text-sm mb-4" role="status">
                    {t(
                      'Ton texte en cours a été restauré depuis ce navigateur.',
                      'Your work in progress was restored from this browser.'
                    )}
                  </p>
                )}

                <div className="space-y-5">
                  {/* Thème + tags — pendant du ThemeTagsField de l'app */}
                  <div className="card p-4 space-y-3">
                    <div>
                      <label htmlFor="studio-theme" className="text-aw-muted text-xs block mb-1.5">
                        {t('Thème principal', 'Main theme')}
                      </label>
                      <select
                        id="studio-theme"
                        value={primaryTheme}
                        onChange={(e) => setPrimaryTheme(e.target.value)}
                        className="w-full rounded-lg border border-aw bg-aw-bg px-3 py-2.5 text-aw-text text-sm focus:outline-none focus:ring-2 focus:ring-aw-primary"
                      >
                        <option value="">{t('— Choisir un thème —', '— Pick a theme —')}</option>
                        {STUDIO_THEMES.map((theme) => (
                          <option key={theme.key} value={theme.key}>
                            {isEnglish ? theme.en : theme.fr}
                          </option>
                        ))}
                      </select>
                    </div>
                    <TagsInput tags={tags} onChange={setTags} />
                  </div>

                  {/* Cover — même geste que l'app (clic pour choisir) */}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => void handleCoverSelected(e.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={handlePickCover}
                    disabled={isCoverUploading}
                    className="w-full h-72 rounded-xl border border-aw bg-aw-surface overflow-hidden flex items-center justify-center disabled:opacity-60"
                  >
                    {coverPath ? (
                      <img src={journalImageUrl(coverPath)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-aw-muted text-sm">
                        {isCoverUploading
                          ? t('Upload en cours…', 'Uploading…')
                          : t('Ajouter une image de couverture', 'Add a cover image')}
                      </span>
                    )}
                  </button>

                  {/* Titre + chapeau — champs nus comme l'app */}
                  <div className="px-1 space-y-2">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("Titre de l'article", 'Article title')}
                      maxLength={TITLE_MAX}
                      className={bareTitleClass}
                    />
                    <textarea
                      value={dek}
                      onChange={(e) => setDek(e.target.value)}
                      placeholder={t('Chapeau (optionnel)', 'Dek (optional)')}
                      maxLength={DEK_MAX}
                      rows={2}
                      className={bareDekClass}
                    />
                  </div>

                  {/* Blocs + barre d'ajout */}
                  <BlockListEditor
                    blocks={blocks}
                    onChange={setBlocks}
                    budgetFor={budgetFor}
                    onUploadError={(message) => setSendError(message)}
                  />

                  {/* Compteurs : mots · temps de lecture · budget caractères */}
                  <div className={`flex items-center justify-end gap-1.5 text-xs ${bodyCounterClass}`}>
                    {bodyAtLimit ? <AlertCircle className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    {wordCount > 0 && (
                      <span>
                        {wordCount} {t('mots', 'words')} · ~{readMinutes} {t('min de lecture', 'min read')} ·{' '}
                      </span>
                    )}
                    {bodyLength} / {BODY_MAX}
                  </div>

                  {/* Sources (min 1 pour publier, max 2) + bibliothèque personnelle */}
                  <div>
                    <SourceListEditor sources={sources} onChange={setSources} />
                    <SourceLibrary
                      rows={[...drafts, ...published]}
                      currentSources={sources}
                      canAdd={canAddLibrarySource}
                      onPick={addLibrarySource}
                    />
                  </div>

                  {/* Envoi */}
                  <div className="card p-5">
                    {sendError && (
                      <p className="text-red-500 text-sm mb-4" role="alert">{sendError}</p>
                    )}
                    <button type="button" onClick={() => void handleSend()} disabled={isSending || isCoverUploading}
                      className="btn-primary w-full inline-flex items-center justify-center disabled:opacity-60">
                      <Send className="w-5 h-5 mr-2" />
                      {isSending
                        ? t('Envoi en cours…', 'Sending…')
                        : editingDraftId
                          ? t('Mettre à jour le brouillon', 'Update the draft')
                          : t("Envoyer vers l'app", 'Send to the app')}
                    </button>
                    <p className="text-aw-muted text-xs mt-3 text-center">
                      {t(
                        "Le brouillon reste privé : la publication et la vérification ASV se font depuis l'app.",
                        'The draft stays private: publishing and ASV verification happen from the app.'
                      )}
                    </p>
                  </div>
                </div>

                {/* Brouillons + publiés (masqués en mode focus) */}
                {!focusMode && (
                  <>
                    <div className="mt-12">
                      <h2 className="body-semi text-lg mb-4">{t('Mes brouillons', 'My drafts')}</h2>
                      <DraftList
                        drafts={drafts}
                        isLoading={draftsLoading}
                        loadError={draftsError}
                        busyDraftId={busyDraftId}
                        onResume={handleResume}
                        onDelete={(draft) => void handleDelete(draft)}
                      />
                    </div>

                    {/* Boucle de retour ASV (lecture seule) */}
                    <PublishedList articles={published} />
                  </>
                )}

                {/* Aperçu mobile */}
                {showPreview && (
                  <ArticlePreview
                    title={title}
                    dek={dek}
                    coverPath={coverPath}
                    blocks={blocks}
                    sources={sources}
                    onClose={() => setShowPreview(false)}
                  />
                )}

                {/* Aide à l'écriture (checklist + conseils) */}
                {showHelp && (
                  <WritingHelpModal
                    title={title}
                    bodyLength={bodyLength}
                    primaryTheme={primaryTheme}
                    sources={sources}
                    onClose={() => setShowHelp(false)}
                  />
                )}
              </PaperSheet>
              </div>
            )}
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
