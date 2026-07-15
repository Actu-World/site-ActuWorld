import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle, AlertTriangle, CheckCircle2, FileText, LogOut, PenLine, Send, Smartphone, Trash2,
} from 'lucide-react';
import { Section } from '../../components/Section';
import { PageMeta } from '../../components/PageMeta';
import { BlockListEditor } from '../../components/studio/BlockListEditor';
import { SourceListEditor } from '../../components/studio/SourceListEditor';
import { TagsInput } from '../../components/studio/TagsInput';
import { DraftList } from '../../components/studio/DraftList';
import { useLanguage } from '../../i18n/LanguageContext';
import { supabase } from '../../lib/studio/supabase';
import { studioApi } from '../../lib/studio/api';
import { useStudioSession } from '../../hooks/useStudioSession';
import { STUDIO_THEMES } from '../../lib/studio/themes';
import { journalImageUrl, uploadJournalImage } from '../../lib/studio/images';
import {
  BODY_MAX, DEK_MAX, TITLE_MAX,
  blockBodyLen, cleanBlocks, cleanSources, createDraft, deleteDraft,
  isValidSourceUrl, listMyDrafts, updateDraft,
} from '../../lib/studio/journal';
import { clearLocalDraft, loadLocalDraft, saveLocalDraft } from '../../lib/studio/draftStorage';
import type { JournalBlock, JournalSource, StudioDraftRow } from '../../types/journal';

type StudioProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
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

  // ── Brouillons Supabase ──
  const [drafts, setDrafts] = useState<StudioDraftRow[]>([]);
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

  // Profil pour la barre de session
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    studioApi
      .get<StudioProfile>(`/profiles/id/${userId}`)
      .then((data) => { if (isMounted) setProfile(data); })
      .catch(() => { /* non bloquant */ });
    return () => { isMounted = false; };
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

  // Chargement des brouillons Supabase
  const refreshDrafts = useCallback(async () => {
    setDraftsLoading(true);
    setDraftsError(null);
    try {
      setDrafts(await listMyDrafts());
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
    if (userId) void refreshDrafts();
  }, [userId, refreshDrafts]);

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
  };

  // « Supprimer le brouillon » local — même geste que l'app (reset, le brouillon
  // serveur éventuellement chargé n'est pas supprimé).
  const hasDraftContent =
    title.trim().length > 0 || dek.trim().length > 0 || coverPath !== null ||
    primaryTheme !== '' || tags.length > 0 ||
    blocks.some((b) => (b.type === 'image' || b.type === 'image_text') ? !!b.uri : b.type !== 'divider' && b.text.trim().length > 0) ||
    sources.some((s) => !!s.url?.trim() || !!s.title?.trim());

  const handleResetDraft = () => {
    const confirmed = window.confirm(t(
      "Tout l'article en cours (titre, chapeau, image, blocs, sources) sera effacé. Action irréversible.",
      'The whole article in progress (title, dek, image, blocks, sources) will be cleared. This cannot be undone.'
    ));
    if (!confirmed) return;
    if (userId) clearLocalDraft(userId);
    resetEditor();
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
    if (isSending || !userId) return;
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
      const payload = {
        title: title.trim(),
        dek: dek.trim() || null,
        blocks: cleanBlocks(blocks),
        sources: cleanSources(sources),
        primary_theme: primaryTheme || null,
        tags: tags.length > 0 ? tags : undefined,
        cover_url: coverPath,
      };
      if (editingDraftId) {
        await updateDraft(editingDraftId, payload);
      } else {
        await createDraft(payload);
      }
      clearLocalDraft(userId);
      setSentDraftTitle(payload.title);
      void refreshDrafts();
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
      await refreshDrafts();
    } catch (err: unknown) {
      setDraftsError(isNetworkError(err) ? apiUnreachableMsg : t('La suppression a échoué.', 'Deletion failed.'));
    } finally {
      setBusyDraftId(null);
    }
  };

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

  const displayName = profile?.display_name || profile?.username || session.user.email || '';

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
            {/* Barre de session */}
            <div className="card p-4 flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3 min-w-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-aw-primary flex items-center justify-center shrink-0">
                    <PenLine className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="body-semi truncate">{t('Connecté en tant que', 'Signed in as')} {displayName}</p>
                  {profile?.username && <p className="text-aw-muted text-sm truncate">@{profile.username}</p>}
                </div>
              </div>
              <button type="button" onClick={() => void supabase.auth.signOut()}
                className="btn-outline inline-flex items-center shrink-0">
                <LogOut className="w-4 h-4 mr-2" /> {t('Se déconnecter', 'Sign out')}
              </button>
            </div>

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
              /* ── Éditeur (mise en page miroir du composer mobile) ── */
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold text-aw-primary">
                    {editingDraftId ? t('Brouillon', 'Draft') : t('Nouvel article', 'New article')}
                  </h1>
                  {hasDraftContent && (
                    <button
                      type="button"
                      onClick={handleResetDraft}
                      className="inline-flex items-center gap-1.5 text-sm text-red-500 border border-red-500/50 rounded-lg px-2.5 py-1.5 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" /> {t('Supprimer le brouillon', 'Delete draft')}
                    </button>
                  )}
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
                    <select
                      value={primaryTheme}
                      onChange={(e) => setPrimaryTheme(e.target.value)}
                      className="w-full rounded-lg border border-aw bg-aw-bg px-3 py-2.5 text-aw-text text-sm focus:outline-none focus:ring-2 focus:ring-aw-primary"
                      aria-label={t('Thème principal', 'Main theme')}
                    >
                      <option value="">{t('— Thème principal —', '— Main theme —')}</option>
                      {STUDIO_THEMES.map((theme) => (
                        <option key={theme.key} value={theme.key}>
                          {isEnglish ? theme.en : theme.fr}
                        </option>
                      ))}
                    </select>
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

                  {/* Compteur corps — budget ≈ 2 pages, comme l'app */}
                  <div className={`flex items-center justify-end gap-1.5 text-xs ${bodyCounterClass}`}>
                    {bodyAtLimit ? <AlertCircle className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    {bodyLength} / {BODY_MAX}
                  </div>

                  {/* Sources (min 1 pour publier, max 2) */}
                  <SourceListEditor sources={sources} onChange={setSources} />

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

                {/* Brouillons existants */}
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
              </>
            )}
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
