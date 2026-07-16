import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowDown, ArrowUp, CheckCircle2, Cloud, CloudOff, Eye, FileImage, FilePlus2, ImagePlus,
  Info, Link2, Loader2, PenLine, Redo2, Send, Smartphone, Trash2, Undo2,
} from 'lucide-react';
import { Section } from '../../components/Section';
import { PageMeta } from '../../components/PageMeta';
import { TagsInput } from '../../components/studio/TagsInput';
import { StudioTabs } from '../../components/studio/StudioTabs';
import { PaperSheet } from '../../components/studio/PaperSheet';
import { PostPreview } from '../../components/studio/PostPreview';
import { PostHelpModal } from '../../components/studio/PostHelpModal';
import { StudioByline } from '../../components/studio/StudioByline';
import { useLanguage } from '../../i18n/LanguageContext';
import { studioApi } from '../../lib/studio/api';
import { useStudioSession } from '../../hooks/useStudioSession';
import { STUDIO_THEMES } from '../../lib/studio/themes';
import { resolveAvatarUrl, uploadPostImage } from '../../lib/studio/images';
import { isValidSourceUrl } from '../../lib/studio/journal';
import {
  MAX_POST_IMAGES, POST_BACK_DESC_MAX, POST_DESC_MAX, POST_SOURCE_TITLE_MAX,
  POST_SOURCE_URL_MAX, POST_SUBJECT_MAX,
  createPostDraft, deletePostDraft, listMyPostDrafts, postDraftTitle, updatePostDraft,
} from '../../lib/studio/posts';
import type { PostDraftImage, PostDraftRow } from '../../types/post';

type StudioProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  avatar_updated_at?: string | null;
} | null;

const AUTOSAVE_DELAY_MS = 2500;

// Carte vide : comme dans l'app, une carte existe AVANT son image — tous les
// champs sont visibles d'emblée, la zone image sert de bouton d'upload.
const EMPTY_CARD: PostDraftImage = {
  image_url: '', subject: '', description: '', back_description: '', source: { url: '', title: '' },
};

const cardHasContent = (card: PostDraftImage): boolean =>
  !!card.image_url || !!card.subject?.trim() || !!card.description?.trim() ||
  !!card.back_description?.trim() || !!card.source?.url?.trim();

const inputClass =
  'w-full rounded-lg border border-aw bg-aw-bg px-3 py-2.5 text-aw-text text-sm placeholder:text-aw-muted focus:outline-none focus:ring-2 focus:ring-aw-primary';

/** Échec réseau pur (API injoignable ou CORS refusé). */
function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError;
}

export default function StudioPostPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const { session, isLoading } = useStudioSession();
  const [profile, setProfile] = useState<StudioProfile>(null);

  // ── État du post (miroir du composer mobile : 1-4 cartes image) ──
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [primaryTheme, setPrimaryTheme] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [cards, setCards] = useState<PostDraftImage[]>([EMPTY_CARD]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Index de la carte qui recevra le fichier choisi
  const pendingCardIndexRef = useRef(0);

  // ── Sauvegarde continue / envoi ──
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const lastSavedSnapshotRef = useRef<string | null>(null);
  const isAutosavingRef = useRef(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sentTitle, setSentTitle] = useState<string | null>(null);

  // ── Brouillons ──
  const [drafts, setDrafts] = useState<PostDraftRow[]>([]);
  const [draftsError, setDraftsError] = useState<string | null>(null);
  const [busyDraftId, setBusyDraftId] = useState<string | null>(null);

  // ── Aperçu mobile ──
  const [showPreview, setShowPreview] = useState(false);

  // ── Aide à l'écriture (checklist + conseils, derrière l'icône info) ──
  const [showHelp, setShowHelp] = useState(false);

  // ── Historique annuler/rétablir (même mécanique que l'éditeur d'articles) ──
  type PostSnapshot = {
    editingDraftId: string | null;
    primaryTheme: string;
    tags: string[];
    cards: PostDraftImage[];
  };
  const historyRef = useRef<PostSnapshot[]>([]);
  const redoStackRef = useRef<PostSnapshot[]>([]);
  const skipHistoryRef = useRef(false);
  const HISTORY_MAX = 60;

  const userId = session?.user.id;

  const apiUnreachableMsg = t(
    'Impossible de joindre le serveur ActuWorld — réessaie plus tard.',
    'Cannot reach the ActuWorld server — try again later.'
  );

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    studioApi
      .get<StudioProfile>(`/profiles/id/${userId}`)
      .then((data) => { if (isMounted) setProfile(data); })
      .catch(() => { /* non bloquant */ });
    return () => { isMounted = false; };
  }, [userId]);

  const refreshDrafts = useCallback(async () => {
    setDraftsError(null);
    try {
      setDrafts(await listMyPostDrafts());
    } catch (err: unknown) {
      setDraftsError(isNetworkError(err) ? apiUnreachableMsg : t('Le chargement des brouillons a échoué.', 'Loading drafts failed.'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnglish]);

  useEffect(() => {
    if (userId) void refreshDrafts();
  }, [userId, refreshDrafts]);

  // ── Annuler / rétablir ──
  const makeSnapshot = (): PostSnapshot => ({ editingDraftId, primaryTheme, tags, cards });
  const applySnapshot = (snap: PostSnapshot) => {
    skipHistoryRef.current = true;
    setEditingDraftId(snap.editingDraftId);
    setPrimaryTheme(snap.primaryTheme);
    setTags(snap.tags);
    setCards(snap.cards);
  };

  // Enregistrement de l'historique (coalescé à 400 ms de silence)
  useEffect(() => {
    if (sentTitle) return;
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
  }, [editingDraftId, primaryTheme, tags, cards, sentTitle]);

  const undo = () => {
    if (sentTitle) return;
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
    if (sentTitle) return;
    const snap = redoStackRef.current.pop();
    if (!snap) return;
    historyRef.current.push(makeSnapshot());
    if (historyRef.current.length > HISTORY_MAX) historyRef.current.shift();
    applySnapshot(snap);
  };

  const buildPayload = () => ({
    primary_theme: primaryTheme || null,
    tags: tags.length > 0 ? tags : undefined,
    // Les cartes entièrement vides ne sont pas enregistrées.
    images: cards.filter(cardHasContent),
  });

  const hasAnyContent = cards.some(cardHasContent);

  // Sauvegarde serveur continue dès qu'il y a du contenu réel.
  useEffect(() => {
    if (!userId || sentTitle || isSending || !hasAnyContent) return;
    const payload = buildPayload();
    const snapshot = JSON.stringify(payload);
    if (snapshot === lastSavedSnapshotRef.current) return;

    const timer = setTimeout(async () => {
      if (isAutosavingRef.current) return;
      isAutosavingRef.current = true;
      setSaveState('saving');
      try {
        if (editingDraftId) {
          await updatePostDraft(editingDraftId, payload);
        } else {
          const { id } = await createPostDraft(payload);
          setEditingDraftId(id);
          void refreshDrafts();
        }
        lastSavedSnapshotRef.current = snapshot;
        setSaveState('saved');
        setLastSavedAt(new Date().toLocaleTimeString(isEnglish ? 'en-GB' : 'fr-FR', { hour: '2-digit', minute: '2-digit' }));
      } catch {
        setSaveState('error');
      } finally {
        isAutosavingRef.current = false;
      }
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, editingDraftId, primaryTheme, tags, cards, sentTitle, isSending]);

  const resetEditor = () => {
    setEditingDraftId(null);
    setPrimaryTheme('');
    setTags([]);
    setCards([EMPTY_CARD]);
    setSendError('');
    setSentTitle(null);
    setSaveState('idle');
    setLastSavedAt(null);
    lastSavedSnapshotRef.current = null;
  };

  const replaceCard = (index: number, card: PostDraftImage) =>
    setCards((prev) => prev.map((c, i) => (i === index ? card : c)));

  const moveCard = (index: number, direction: -1 | 1) => {
    setCards((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeCard = (index: number) =>
    setCards((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [EMPTY_CARD]; // toujours au moins une carte
    });

  const pickImageFor = (index: number) => {
    pendingCardIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (file: File | undefined) => {
    if (!file || isUploading) return;
    setIsUploading(true);
    setSendError('');
    try {
      const url = await uploadPostImage(file);
      const target = pendingCardIndexRef.current;
      setCards((prev) => prev.map((c, i) => (i === target ? { ...c, image_url: url } : c)));
    } catch (err: unknown) {
      setSendError(isNetworkError(err) ? apiUnreachableMsg
        : err instanceof Error ? err.message : t("L'upload de l'image a échoué.", 'Image upload failed.'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (isSending || !userId || sentTitle) return;
    setSendError('');

    const filledCards = cards.filter(cardHasContent);
    if (filledCards.length === 0) {
      setSendError(t('Ajoute au moins une carte avec une image — une dépêche est un empilement de cartes visuelles.', 'Add at least one card with an image — a dispatch is a stack of visual cards.'));
      return;
    }
    if (filledCards.some((c) => !c.image_url)) {
      setSendError(t('Chaque carte doit avoir son image.', 'Each card needs its image.'));
      return;
    }
    if (!filledCards[0].subject?.trim()) {
      setSendError(t('Donne un sujet à la première carte : c\'est le titre de la dépêche.', 'Give the first card a subject: it is the dispatch title.'));
      return;
    }
    const badSource = filledCards.some((c) => c.source?.url?.trim() && !isValidSourceUrl(c.source.url));
    if (badSource) {
      setSendError(t('Une des sources a une URL invalide (http:// ou https:// requis).', 'One of the sources has an invalid URL (http:// or https:// required).'));
      return;
    }

    setIsSending(true);
    try {
      const payload = buildPayload();
      if (editingDraftId) {
        await updatePostDraft(editingDraftId, payload);
      } else {
        await createPostDraft(payload);
      }
      setSentTitle(filledCards[0].subject?.trim() || t('(Sans titre)', '(Untitled)'));
      lastSavedSnapshotRef.current = null;
      setSaveState('idle');
      setLastSavedAt(null);
      void refreshDrafts();
    } catch (err: unknown) {
      setSendError(isNetworkError(err) ? apiUnreachableMsg
        : err instanceof Error ? err.message : t("L'envoi a échoué.", 'Sending failed.'));
    } finally {
      setIsSending(false);
    }
  };

  // « Nouveau » : met de côté le post en cours (sauvegarde serveur immédiate,
  // il rejoint « Mes brouillons de posts ») puis ouvre un composer vierge —
  // permet de travailler plusieurs posts en parallèle sans passer par l'envoi.
  const handleNewPost = async () => {
    if (isSending || isUploading || isAutosavingRef.current) return;
    if (!hasAnyContent) {
      resetEditor();
      return;
    }
    isAutosavingRef.current = true; // bloque l'autosave pendant la mise de côté
    setSaveState('saving');
    try {
      const payload = buildPayload();
      if (editingDraftId) {
        await updatePostDraft(editingDraftId, payload);
      } else {
        await createPostDraft(payload);
      }
      resetEditor();
      void refreshDrafts();
    } catch (err: unknown) {
      setSaveState('error');
      setSendError(isNetworkError(err) ? apiUnreachableMsg
        : err instanceof Error ? err.message : t('La mise de côté a échoué.', 'Setting the draft aside failed.'));
    } finally {
      isAutosavingRef.current = false;
    }
  };

  const handleResume = (draft: PostDraftRow) => {
    setEditingDraftId(draft.id);
    setPrimaryTheme(draft.payload.primary_theme ?? '');
    setTags(draft.payload.tags ?? []);
    setCards(draft.payload.images?.length ? draft.payload.images : [EMPTY_CARD]);
    setSentTitle(null);
    setSendError('');
    setSaveState('saved');
    setLastSavedAt(new Date(draft.updated_at).toLocaleTimeString(isEnglish ? 'en-GB' : 'fr-FR', { hour: '2-digit', minute: '2-digit' }));
    lastSavedSnapshotRef.current = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (draft: PostDraftRow) => {
    const title = postDraftTitle(draft.payload) || t('(sans titre)', '(untitled)');
    if (!window.confirm(t(`Supprimer définitivement le brouillon « ${title} » ?`, `Permanently delete the draft “${title}”?`))) return;
    setBusyDraftId(draft.id);
    try {
      await deletePostDraft(draft.id);
      if (editingDraftId === draft.id) resetEditor();
      await refreshDrafts();
    } catch (err: unknown) {
      setDraftsError(isNetworkError(err) ? apiUnreachableMsg : t('La suppression a échoué.', 'Deletion failed.'));
    } finally {
      setBusyDraftId(null);
    }
  };

  // Raccourcis clavier : Ctrl/Cmd+Entrée = envoyer, Ctrl/Cmd+Z = annuler,
  // Ctrl/Cmd+Maj+Z ou Ctrl/Cmd+Y = rétablir (l'aperçu gère son propre Échap).
  const keyActionsRef = useRef({ send: () => {}, undo: () => {}, redo: () => {} });
  keyActionsRef.current = { send: () => { void handleSend(); }, undo, redo };
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
  if (!session) return <Navigate to="/studio" replace />;

  const displayName = profile?.display_name || profile?.username ||
    (typeof session.user.user_metadata?.display_name === 'string' ? session.user.user_metadata.display_name : null) ||
    session.user.email || '';
  const avatarSrc = resolveAvatarUrl(profile?.avatar_url, profile?.avatar_updated_at);

  return (
    <div className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t('Studio — Dépêche', 'Studio — Dispatch')}
        description={t("Compose une dépêche (cartes visuelles sourcées) et envoie-la en brouillon dans l'app.", 'Compose a dispatch (sourced visual cards) and send it as a draft to the app.')}
        path="/studio/post"
      />

      <Section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Signature de session façon post */}
            <StudioByline displayName={displayName} username={profile?.username} avatarSrc={avatarSrc} />

            <StudioTabs active="post" />

            {sentTitle ? (
              <div className="card p-10 text-center" role="status">
                <CheckCircle2 className="w-10 h-10 text-aw-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">{t('Brouillon envoyé !', 'Draft sent!')}</h1>
                <p className="text-aw-muted max-w-md mx-auto mb-2">
                  {t(`« ${sentTitle} » t'attend dans le composer de dépêches de l'app.`, `“${sentTitle}” is waiting in the app's dispatch composer.`)}
                </p>
                <p className="text-aw-muted text-sm max-w-md mx-auto mb-8 inline-flex items-center justify-center">
                  <Smartphone className="w-4 h-4 mr-1.5 shrink-0" />
                  {t('Relis-le sur ton téléphone puis publie — la vérification ASV se lance à ce moment-là.', 'Review it on your phone then publish — ASV verification runs at that moment.')}
                </p>
                <button type="button" onClick={resetEditor} className="btn-primary">
                  {t('Composer une autre dépêche', 'Compose another dispatch')}
                </button>
              </div>
            ) : (
              /* ── Éditeur sur la feuille de journal partagée (PaperSheet),
                   même habillage presse que l'éditeur d'articles ── */
              <PaperSheet>
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap pt-1">
                  <div>
                    <h1 className="text-xl font-bold text-aw-primary inline-flex items-center gap-2">
                      <PenLine className="w-5 h-5" /> {t('Nouvelle dépêche', 'New dispatch')}
                    </h1>
                    <p className="text-xs mt-0.5 min-h-[1rem]" aria-live="polite">
                      {saveState === 'saving' && (
                        <span className="text-aw-muted inline-flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> {t('Enregistrement…', 'Saving…')}</span>
                      )}
                      {saveState === 'saved' && lastSavedAt && (
                        <span className="text-aw-muted inline-flex items-center gap-1"><Cloud className="w-3 h-3" /> {t(`Enregistré à ${lastSavedAt}`, `Saved at ${lastSavedAt}`)}</span>
                      )}
                      {saveState === 'error' && (
                        <span className="text-amber-500 inline-flex items-center gap-1"><CloudOff className="w-3 h-3" /> {t('Hors ligne — réessaie plus tard', 'Offline — retry later')}</span>
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
                    {hasAnyContent && (
                      <button
                        type="button"
                        onClick={() => void handleNewPost()}
                        disabled={isSending || isUploading}
                        className="btn-outline inline-flex items-center text-sm disabled:opacity-50"
                        title={t(
                          'Garder la dépêche en cours dans mes brouillons et en composer une nouvelle',
                          'Keep the current dispatch in my drafts and compose a new one'
                        )}
                      >
                        <FilePlus2 className="w-4 h-4 mr-1.5" /> {t('Nouveau', 'New')}
                      </button>
                    )}
                    {hasAnyContent && (
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

                <p className="text-aw-muted text-sm mb-5">
                  {t(
                    `Une dépêche = 1 à ${MAX_POST_IMAGES} cartes visuelles. La carte 1 porte le titre de la dépêche ; chaque carte doit avoir sa source pour être publiée.`,
                    `A dispatch = 1 to ${MAX_POST_IMAGES} visual cards. Card 1 carries the dispatch title; each card needs its source to be published.`
                  )}
                </p>

                <div className="space-y-5">
                  {/* Thème + tags */}
                  <div className="card p-4 space-y-3">
                    <div>
                      <label htmlFor="post-theme" className="text-aw-muted text-xs block mb-1.5">{t('Thème principal', 'Main theme')}</label>
                      <select id="post-theme" value={primaryTheme} onChange={(e) => setPrimaryTheme(e.target.value)} className={inputClass}>
                        <option value="">{t('— Choisir un thème —', '— Pick a theme —')}</option>
                        {STUDIO_THEMES.map((theme) => (
                          <option key={theme.key} value={theme.key}>{isEnglish ? theme.en : theme.fr}</option>
                        ))}
                      </select>
                    </div>
                    <TagsInput tags={tags} onChange={setTags} />
                  </div>

                  {/* Cartes — dans l'ordre de création de l'app : le visuel d'abord
                      (grand, centré, comme la cover de l'article), puis les champs */}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => void handleFileSelected(e.target.files?.[0])} />
                  <div className="space-y-5">
                    {cards.map((card, index) => (
                      <div key={index} className="card p-5">
                        {/* 1. Le visuel — prend l'espace */}
                        <div className="relative mx-auto w-full max-w-[340px]">
                          {card.image_url ? (
                            <img src={card.image_url} alt="" className="w-full aspect-[3/4] object-cover rounded-xl" />
                          ) : (
                            <button
                              type="button"
                              onClick={() => pickImageFor(index)}
                              disabled={isUploading}
                              className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-aw text-aw-muted
                                         hover:text-aw-primary hover:border-aw-primary flex flex-col items-center
                                         justify-center gap-2 disabled:opacity-50"
                            >
                              <ImagePlus className="w-8 h-8" />
                              <span className="text-sm px-2 text-center">
                                {isUploading ? t('Upload en cours…', 'Uploading…') : t("Choisir l'image *", 'Pick the image *')}
                              </span>
                            </button>
                          )}
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs">
                            {index + 1}{index === 0 ? ` · ${t('titre de la dépêche', 'dispatch title')}` : ''}
                          </span>
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button type="button" onClick={() => moveCard(index, -1)} disabled={index === 0}
                              className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 disabled:opacity-30"
                              aria-label={t('Reculer la carte', 'Move card back')}><ArrowUp className="w-3.5 h-3.5 -rotate-90" /></button>
                            <button type="button" onClick={() => moveCard(index, 1)} disabled={index === cards.length - 1}
                              className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 disabled:opacity-30"
                              aria-label={t('Avancer la carte', 'Move card forward')}><ArrowDown className="w-3.5 h-3.5 -rotate-90" /></button>
                            {card.image_url && (
                              <button type="button" onClick={() => pickImageFor(index)}
                                className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80"
                                aria-label={t("Changer l'image", 'Change image')}><ImagePlus className="w-3.5 h-3.5" /></button>
                            )}
                            <button type="button" onClick={() => removeCard(index)}
                              className="p-1.5 rounded-lg bg-black/60 text-red-400 hover:bg-black/80"
                              aria-label={t('Supprimer la carte', 'Delete card')}><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>

                        {/* 2. Les champs — à la suite, comme dans l'app */}
                        <div className="max-w-2xl mx-auto space-y-2.5 mt-4">
                          <input type="text" value={card.subject ?? ''} maxLength={POST_SUBJECT_MAX}
                            onChange={(e) => replaceCard(index, { ...card, subject: e.target.value })}
                            placeholder={index === 0 ? t('Sujet — titre de la dépêche *', 'Subject — dispatch title *') : t('Sujet de la carte *', 'Card subject *')}
                            className={`${inputClass} font-semibold`} />
                          <textarea value={card.description ?? ''} maxLength={POST_DESC_MAX} rows={2}
                            onChange={(e) => replaceCard(index, { ...card, description: e.target.value })}
                            placeholder={t('Excerpt court (sur la carte) *', 'Short excerpt (on the card) *')}
                            className={inputClass} />
                          <textarea value={card.back_description ?? ''} maxLength={POST_BACK_DESC_MAX} rows={3}
                            onChange={(e) => replaceCard(index, { ...card, back_description: e.target.value })}
                            placeholder={t('Description longue (dos de la carte)', 'Long description (back of the card)')}
                            className={inputClass} />
                          <div className="relative">
                            <Link2 className="w-3.5 h-3.5 text-aw-primary absolute left-3 top-3" />
                            <input type="url" value={card.source?.url ?? ''} maxLength={POST_SOURCE_URL_MAX}
                              onChange={(e) => replaceCard(index, { ...card, source: { url: e.target.value, title: card.source?.title ?? '' } })}
                              placeholder={t('Source de la carte — https://… *', 'Card source — https://… *')}
                              className={`${inputClass} pl-9 ${card.source?.url?.trim() && !isValidSourceUrl(card.source.url) ? 'border-red-500' : ''}`} />
                          </div>
                          <input type="text" value={card.source?.title ?? ''} maxLength={POST_SOURCE_TITLE_MAX}
                            onChange={(e) => replaceCard(index, { ...card, source: { url: card.source?.url ?? '', title: e.target.value } })}
                            placeholder={t('Titre de la source (optionnel)', 'Source title (optional)')}
                            className={inputClass} />
                        </div>
                      </div>
                    ))}

                    {/* Ajouter une carte : visible seulement quand toutes les cartes ont
                        leur image (sinon la carte vide en cours fait déjà office d'ajout) */}
                    {cards.length < MAX_POST_IMAGES && cards.every((c) => !!c.image_url) && (
                      <button type="button"
                        onClick={() => setCards((prev) => (prev.length < MAX_POST_IMAGES ? [...prev, EMPTY_CARD] : prev))}
                        className="w-full h-16 rounded-xl border-2 border-dashed border-aw text-aw-muted hover:text-aw-primary
                                   hover:border-aw-primary flex items-center justify-center gap-2">
                        <ImagePlus className="w-5 h-5" />
                        <span className="text-sm">
                          {t(`Ajouter une carte (${cards.length}/${MAX_POST_IMAGES})`, `Add a card (${cards.length}/${MAX_POST_IMAGES})`)}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Envoi */}
                  <div className="card p-5">
                    {sendError && <p className="text-red-500 text-sm mb-4" role="alert">{sendError}</p>}
                    <button type="button" onClick={() => void handleSend()} disabled={isSending || isUploading}
                      className="btn-primary w-full inline-flex items-center justify-center disabled:opacity-60">
                      <Send className="w-5 h-5 mr-2" />
                      {isSending ? t('Envoi en cours…', 'Sending…') : t("Envoyer vers l'app", 'Send to the app')}
                    </button>
                    <p className="text-aw-muted text-xs mt-3 text-center">
                      {t("Le brouillon reste privé : la publication et la vérification ASV se font depuis l'app.", 'The draft stays private: publishing and ASV verification happen from the app.')}
                    </p>
                  </div>
                </div>

                {/* Brouillons de posts */}
                <div className="mt-12">
                  <h2 className="body-semi text-lg mb-4">{t('Mes brouillons de dépêches', 'My dispatch drafts')}</h2>
                  {draftsError && <p className="text-aw-muted text-sm">{draftsError}</p>}
                  {!draftsError && drafts.length === 0 && (
                    <p className="text-aw-muted text-sm">{t('Aucun brouillon pour le moment.', 'No drafts yet.')}</p>
                  )}
                  <ul className="space-y-3">
                    {drafts.map((draft) => (
                      <li key={draft.id} className="card p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {draft.payload.images?.[0]?.image_url ? (
                            <img src={draft.payload.images[0].image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          ) : (
                            <FileImage className="w-5 h-5 text-aw-primary shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="body-semi truncate">{postDraftTitle(draft.payload) || t('(Sans titre)', '(Untitled)')}</p>
                            <p className="text-aw-muted text-xs">
                              {(draft.payload.images?.length ?? 0)} {t('carte(s)', 'card(s)')} · {new Date(draft.updated_at).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button type="button" onClick={() => handleResume(draft)} disabled={busyDraftId === draft.id}
                            className="btn-outline inline-flex items-center text-sm disabled:opacity-50">
                            {t('Reprendre', 'Resume')}
                          </button>
                          <button type="button" onClick={() => void handleDelete(draft)} disabled={busyDraftId === draft.id}
                            className="p-2 rounded-lg text-aw-muted hover:text-red-500 disabled:opacity-50"
                            aria-label={t('Supprimer le brouillon', 'Delete draft')}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Aperçu mobile (cartes recto/verso comme dans le feed) */}
                {showPreview && (
                  <PostPreview
                    cards={cards.filter(cardHasContent)}
                    tags={tags}
                    authorName={displayName}
                    avatarSrc={avatarSrc}
                    onClose={() => setShowPreview(false)}
                  />
                )}

                {/* Aide à l'écriture (checklist + conseils) */}
                {showHelp && (
                  <PostHelpModal
                    cards={cards}
                    primaryTheme={primaryTheme}
                    onClose={() => setShowHelp(false)}
                  />
                )}
              </PaperSheet>
            )}
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
