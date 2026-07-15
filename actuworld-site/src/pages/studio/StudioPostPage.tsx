import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowDown, ArrowUp, CheckCircle2, Cloud, CloudOff, FileImage, ImagePlus,
  Link2, Loader2, LogOut, PenLine, Send, Smartphone, Trash2,
} from 'lucide-react';
import { Section } from '../../components/Section';
import { PageMeta } from '../../components/PageMeta';
import { TagsInput } from '../../components/studio/TagsInput';
import { StudioTabs } from '../../components/studio/StudioTabs';
import { useLanguage } from '../../i18n/LanguageContext';
import { supabase } from '../../lib/studio/supabase';
import { studioApi } from '../../lib/studio/api';
import { useStudioSession } from '../../hooks/useStudioSession';
import { STUDIO_THEMES } from '../../lib/studio/themes';
import { initialsFromName, resolveAvatarUrl, uploadPostImage } from '../../lib/studio/images';
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
  const [cards, setCards] = useState<PostDraftImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const buildPayload = () => ({
    primary_theme: primaryTheme || null,
    tags: tags.length > 0 ? tags : undefined,
    images: cards,
  });

  // Sauvegarde serveur continue dès qu'il y a au moins une carte.
  useEffect(() => {
    if (!userId || sentTitle || isSending || cards.length === 0) return;
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
    setCards([]);
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

  const removeCard = (index: number) => setCards((prev) => prev.filter((_, i) => i !== index));

  const handleFileSelected = async (file: File | undefined) => {
    if (!file || isUploading || cards.length >= MAX_POST_IMAGES) return;
    setIsUploading(true);
    setSendError('');
    try {
      const url = await uploadPostImage(file);
      setCards((prev) => [...prev, { image_url: url, subject: '', description: '', back_description: '', source: { url: '', title: '' } }]);
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

    if (cards.length === 0) {
      setSendError(t('Ajoute au moins une image — un post rapide est un empilement de cartes visuelles.', 'Add at least one image — a quick post is a stack of visual cards.'));
      return;
    }
    if (!cards[0].subject?.trim()) {
      setSendError(t('Donne un sujet à la première carte : c\'est le titre du post.', 'Give the first card a subject: it is the post title.'));
      return;
    }
    const badSource = cards.some((c) => c.source?.url?.trim() && !isValidSourceUrl(c.source.url));
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
      setSentTitle(cards[0].subject?.trim() || t('(Sans titre)', '(Untitled)'));
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

  const handleResume = (draft: PostDraftRow) => {
    setEditingDraftId(draft.id);
    setPrimaryTheme(draft.payload.primary_theme ?? '');
    setTags(draft.payload.tags ?? []);
    setCards(draft.payload.images ?? []);
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
        title={t('Studio — Post rapide', 'Studio — Quick post')}
        description={t("Compose un post rapide (cartes visuelles sourcées) et envoie-le en brouillon dans l'app.", 'Compose a quick post (sourced visual cards) and send it as a draft to the app.')}
        path="/studio/post"
      />

      <Section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Barre de session */}
            <div className="card p-4 flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3 min-w-0">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 bg-aw-surface" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-aw-primary flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-semibold">{initialsFromName(displayName)}</span>
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

            <StudioTabs active="post" />

            {sentTitle ? (
              <div className="card p-10 text-center" role="status">
                <CheckCircle2 className="w-10 h-10 text-aw-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">{t('Brouillon envoyé !', 'Draft sent!')}</h1>
                <p className="text-aw-muted max-w-md mx-auto mb-2">
                  {t(`« ${sentTitle} » t'attend dans le composer de posts de l'app.`, `“${sentTitle}” is waiting in the app's post composer.`)}
                </p>
                <p className="text-aw-muted text-sm max-w-md mx-auto mb-8 inline-flex items-center justify-center">
                  <Smartphone className="w-4 h-4 mr-1.5 shrink-0" />
                  {t('Relis-le sur ton téléphone puis publie — la vérification ASV se lance à ce moment-là.', 'Review it on your phone then publish — ASV verification runs at that moment.')}
                </p>
                <button type="button" onClick={resetEditor} className="btn-primary">
                  {t('Composer un autre post', 'Compose another post')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <div>
                    <h1 className="text-xl font-bold text-aw-primary inline-flex items-center gap-2">
                      <PenLine className="w-5 h-5" /> {t('Nouveau post rapide', 'New quick post')}
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
                </div>

                <p className="text-aw-muted text-sm mb-5">
                  {t(
                    `Un post rapide = 1 à ${MAX_POST_IMAGES} cartes visuelles. La carte 1 porte le titre du post ; chaque carte doit avoir sa source pour être publiée.`,
                    `A quick post = 1 to ${MAX_POST_IMAGES} visual cards. Card 1 carries the post title; each card needs its source to be published.`
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

                  {/* Cartes */}
                  {cards.map((card, index) => (
                    <div key={index} className="card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-aw-muted text-xs uppercase tracking-wide inline-flex items-center gap-1.5">
                          <FileImage className="w-3.5 h-3.5" />
                          {t('Carte', 'Card')} {index + 1}{index === 0 ? ` — ${t('titre du post', 'post title')}` : ''}
                        </span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => moveCard(index, -1)} disabled={index === 0}
                            className="p-1.5 rounded-lg bg-aw-surface text-aw-muted hover:text-aw-primary disabled:opacity-30"
                            aria-label={t('Monter la carte', 'Move card up')}><ArrowUp className="w-4 h-4" /></button>
                          <button type="button" onClick={() => moveCard(index, 1)} disabled={index === cards.length - 1}
                            className="p-1.5 rounded-lg bg-aw-surface text-aw-muted hover:text-aw-primary disabled:opacity-30"
                            aria-label={t('Descendre la carte', 'Move card down')}><ArrowDown className="w-4 h-4" /></button>
                          <button type="button" onClick={() => removeCard(index)}
                            className="p-1.5 rounded-lg bg-aw-surface text-red-500 hover:text-red-600"
                            aria-label={t('Supprimer la carte', 'Delete card')}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <img src={card.image_url} alt="" className="w-full sm:w-44 aspect-[3/4] object-cover rounded-xl border border-aw shrink-0" />
                        <div className="flex-1 space-y-2.5 min-w-0">
                          <input type="text" value={card.subject ?? ''} maxLength={POST_SUBJECT_MAX}
                            onChange={(e) => replaceCard(index, { ...card, subject: e.target.value })}
                            placeholder={index === 0 ? t('Sujet — titre du post', 'Subject — post title') : t('Sujet de la carte', 'Card subject')}
                            className={`${inputClass} font-semibold`} />
                          <textarea value={card.description ?? ''} maxLength={POST_DESC_MAX} rows={2}
                            onChange={(e) => replaceCard(index, { ...card, description: e.target.value })}
                            placeholder={t('Excerpt court (affiché sur la carte)', 'Short excerpt (shown on the card)')}
                            className={inputClass} />
                          <textarea value={card.back_description ?? ''} maxLength={POST_BACK_DESC_MAX} rows={3}
                            onChange={(e) => replaceCard(index, { ...card, back_description: e.target.value })}
                            placeholder={t('Description longue (dos de la carte)', 'Long description (back of the card)')}
                            className={inputClass} />
                          <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-start">
                            <div className="space-y-2">
                              <div className="relative">
                                <Link2 className="w-3.5 h-3.5 text-aw-primary absolute left-3 top-3" />
                                <input type="url" value={card.source?.url ?? ''} maxLength={POST_SOURCE_URL_MAX}
                                  onChange={(e) => replaceCard(index, { ...card, source: { url: e.target.value, title: card.source?.title ?? '' } })}
                                  placeholder={t('Source de cette carte — https://…', 'Source for this card — https://…')}
                                  className={`${inputClass} pl-9 ${card.source?.url?.trim() && !isValidSourceUrl(card.source.url) ? 'border-red-500' : ''}`} />
                              </div>
                              <input type="text" value={card.source?.title ?? ''} maxLength={POST_SOURCE_TITLE_MAX}
                                onChange={(e) => replaceCard(index, { ...card, source: { url: card.source?.url ?? '', title: e.target.value } })}
                                placeholder={t('Titre de la source (optionnel)', 'Source title (optional)')}
                                className={inputClass} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Ajouter une carte */}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => void handleFileSelected(e.target.files?.[0])} />
                  {cards.length < MAX_POST_IMAGES && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}
                      className="w-full h-32 rounded-xl border border-dashed border-aw text-aw-muted hover:text-aw-primary hover:border-aw-primary flex items-center justify-center gap-2 disabled:opacity-50">
                      <ImagePlus className="w-5 h-5" />
                      {isUploading ? t('Upload en cours…', 'Uploading…')
                        : t(`Ajouter une carte (${cards.length}/${MAX_POST_IMAGES})`, `Add a card (${cards.length}/${MAX_POST_IMAGES})`)}
                    </button>
                  )}

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
                  <h2 className="body-semi text-lg mb-4">{t('Mes brouillons de posts', 'My post drafts')}</h2>
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
              </>
            )}
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
