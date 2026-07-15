import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, LogOut, PenLine, Send, Smartphone } from 'lucide-react';
import { Section } from '../../components/Section';
import { H2 } from '../../components/H2';
import { PageMeta } from '../../components/PageMeta';
import { BlockListEditor } from '../../components/studio/BlockListEditor';
import { SourceListEditor } from '../../components/studio/SourceListEditor';
import { DraftList } from '../../components/studio/DraftList';
import { useLanguage } from '../../i18n/LanguageContext';
import { supabase } from '../../lib/studio/supabase';
import { studioApi } from '../../lib/studio/api';
import { useStudioSession } from '../../hooks/useStudioSession';
import { STUDIO_THEMES } from '../../lib/studio/themes';
import {
  cleanBlocks, cleanSources, createDraft, deleteDraft, isValidSourceUrl, listMyDrafts, updateDraft,
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

const inputClass =
  'w-full rounded-xl border border-aw bg-aw-bg px-4 py-3 text-aw-text placeholder:text-aw-muted focus:outline-none focus:ring-2 focus:ring-aw-primary';

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

  // ── État de l'éditeur ──
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [dek, setDek] = useState('');
  const [primaryTheme, setPrimaryTheme] = useState('');
  const [blocks, setBlocks] = useState<JournalBlock[]>([{ type: 'paragraph', text: '' }]);
  const [sources, setSources] = useState<JournalSource[]>([
    { url: '', title: '', publisher: '', published_at: null },
  ]);
  const [restoredNotice, setRestoredNotice] = useState(false);

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
    "Impossible de joindre le serveur ActuWorld (l'accès depuis le site est peut-être en cours d'activation). Ton texte est sauvegardé dans ce navigateur — réessaie plus tard.",
    'Cannot reach the ActuWorld server (access from the website may still be rolling out). Your text is saved in this browser — try again later.'
  );

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
      local.title.trim() || local.dek.trim() ||
      local.blocks.some((b) => b.type !== 'divider' && 'text' in b && b.text.trim()) ||
      local.sources.some((s) => s.url.trim());
    if (!hasContent) return;
    setEditingDraftId(local.editingDraftId);
    setTitle(local.title);
    setDek(local.dek);
    setPrimaryTheme(local.primaryTheme);
    setBlocks(local.blocks.length > 0 ? local.blocks : [{ type: 'paragraph', text: '' }]);
    setSources(local.sources.length > 0 ? local.sources : [{ url: '', title: '', publisher: '', published_at: null }]);
    setRestoredNotice(true);
  }, [userId]);

  // Autosauvegarde locale (debounce)
  useEffect(() => {
    if (!userId || sentDraftTitle) return;
    const timer = setTimeout(() => {
      saveLocalDraft(userId, { editingDraftId, title, dek, primaryTheme, blocks, sources });
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [userId, editingDraftId, title, dek, primaryTheme, blocks, sources, sentDraftTitle]);

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
    setBlocks([{ type: 'paragraph', text: '' }]);
    setSources([{ url: '', title: '', publisher: '', published_at: null }]);
    setSendError('');
    setSentDraftTitle(null);
    setRestoredNotice(false);
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
    setBlocks(draft.blocks && draft.blocks.length > 0 ? draft.blocks : [{ type: 'paragraph', text: '' }]);
    setSources(draft.sources && draft.sources.length > 0 ? draft.sources : [{ url: '', title: '', publisher: '', published_at: null }]);
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
            <div className="card p-4 flex items-center justify-between gap-4 mb-10">
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
              /* ── Éditeur ── */
              <>
                <H2 kicker="Studio" as="h1">
                  {editingDraftId
                    ? t('Reprendre le brouillon', 'Resume draft')
                    : t('Écrire un article', 'Write an article')}
                </H2>

                {restoredNotice && (
                  <p className="text-aw-muted text-sm mt-3" role="status">
                    {t(
                      'Ton texte en cours a été restauré depuis ce navigateur.',
                      'Your work in progress was restored from this browser.'
                    )}
                  </p>
                )}

                <div className="space-y-8 mt-8">
                  {/* Infos générales */}
                  <div className="card p-6 space-y-4">
                    <div>
                      <label htmlFor="studio-title" className="body-semi block mb-2">
                        {t('Titre', 'Title')} <span className="text-aw-primary">*</span>
                      </label>
                      <input id="studio-title" type="text" value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t("Le titre de ton article", 'Your article title')}
                        className={`${inputClass} text-lg font-semibold`} />
                    </div>
                    <div>
                      <label htmlFor="studio-dek" className="body-semi block mb-2">
                        {t('Chapeau (sous-titre)', 'Dek (subtitle)')}
                      </label>
                      <textarea id="studio-dek" value={dek} onChange={(e) => setDek(e.target.value)}
                        placeholder={t('Résumé en une ou deux phrases (optionnel)', 'One or two sentence summary (optional)')}
                        rows={2} className={inputClass} />
                    </div>
                    <div className="sm:w-2/3">
                      <label htmlFor="studio-theme" className="body-semi block mb-2">
                        {t('Thème principal', 'Main theme')}
                      </label>
                      <select id="studio-theme" value={primaryTheme}
                        onChange={(e) => setPrimaryTheme(e.target.value)}
                        className={inputClass}>
                        <option value="">{t('— Choisir un thème —', '— Pick a theme —')}</option>
                        {STUDIO_THEMES.map((theme) => (
                          <option key={theme.key} value={theme.key}>
                            {isEnglish ? theme.en : theme.fr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div>
                    <h2 className="body-semi text-lg mb-4">{t('Contenu', 'Content')}</h2>
                    <BlockListEditor blocks={blocks} onChange={setBlocks} />
                  </div>

                  {/* Sources */}
                  <div>
                    <h2 className="body-semi text-lg mb-4">{t('Sources', 'Sources')}</h2>
                    <SourceListEditor sources={sources} onChange={setSources} />
                  </div>

                  {/* Envoi */}
                  <div className="card p-6">
                    {sendError && (
                      <p className="text-red-500 text-sm mb-4" role="alert">{sendError}</p>
                    )}
                    <button type="button" onClick={() => void handleSend()} disabled={isSending}
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
                <div className="mt-14">
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
