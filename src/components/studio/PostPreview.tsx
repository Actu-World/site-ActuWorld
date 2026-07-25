import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BatteryFull, ChevronLeft, ChevronRight, Images, MessageCircle, Share2, Signal, Tag, Wifi, X,
} from 'lucide-react';
import type { PostDraftImage } from '../../types/post';
import { hostFromUrl } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Aperçu « comme dans l'app » : miroir de VisualFeedCard (feed mobile) — pour
// chaque carte, une page cover (image + dégradé, titre 22/28, excerpt) puis une
// page info (image floutée assombrie, description longue, sources, barre de
// vote). Navigation horizontale par swipe/scroll, points de pagination.

const MINT = '#A8D5BA';

interface PostPreviewProps {
  cards: PostDraftImage[];
  tags: string[];
  authorName: string;
  /** Expertise du profil — fallback « Correspondant » comme dans l'app. */
  authorExpertise?: string | null;
  avatarSrc: string | null;
  onClose: () => void;
}

const initials = (name: string) =>
  name.split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

export function PostPreview({ cards, tags, authorName, authorExpertise, avatarSrc, onClose }: PostPreviewProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = cards.length * 2;

  // Navigation au clic (façon stories) : moitié gauche/droite de l'écran du
  // mockup, flèches ←/→ au clavier — en plus du scroll horizontal.
  const scrollerRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(0);
  currentPageRef.current = currentPage;
  const goToPage = useCallback((page: number) => {
    const el = scrollerRef.current;
    if (!el || page < 0 || page >= totalPages) return;
    el.scrollTo({ left: page * el.clientWidth, behavior: 'smooth' });
  }, [totalPages]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') goToPage(currentPageRef.current + 1);
      else if (event.key === 'ArrowLeft') goToPage(currentPageRef.current - 1);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, goToPage]);
  const postTags = tags.slice(0, 3);

  const byline = (avatarSize: string, nameSize: string) => (
    <div className="flex items-center gap-2 min-w-0">
      {avatarSrc ? (
        <img src={avatarSrc} alt="" className={`${avatarSize} rounded-full object-cover shrink-0`} />
      ) : (
        <div className={`${avatarSize} rounded-full bg-aw-primary flex items-center justify-center shrink-0`}>
          <span className="text-white text-[10px] font-semibold">{initials(authorName)}</span>
        </div>
      )}
      <div className="min-w-0">
        <p className={`text-white ${nameSize} font-bold tracking-[0.6px] truncate`}>{authorName.toUpperCase()}</p>
        <p className="text-white/55 text-[9.5px] font-semibold tracking-[0.4px]">
          {authorExpertise?.trim() || t('Correspondant', 'Correspondent')} · {t("à l'instant", 'just now')}
        </p>
      </div>
    </div>
  );

  /* ── Recto : image pleine carte, dégradé, titre + excerpt en bas ── */
  const renderCover = (card: PostDraftImage, idx: number) => (
    <div key={`cover-${idx}`} className="relative w-full shrink-0 snap-center overflow-hidden bg-black">
      {card.image_url && (
        <img src={card.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 22%, transparent 50%, rgba(0,0,0,0.9) 100%)' }}
      />
      {/* Filet de confiance (jauge de votes) — neutre en aperçu */}
      <div className="absolute left-0 inset-y-0 w-[5px] bg-white/15 flex flex-col justify-end">
        <div className="h-1/2 w-full bg-white/30 rounded-t-sm" />
      </div>

      {/* Haut : score, compteur d'images, tags (carte 1) */}
      <div className="absolute top-3 left-3 right-14 flex items-center gap-1.5 flex-wrap">
        <span className="min-w-[26px] h-6 px-1.5 rounded-lg bg-black/50 text-white/80 text-xs font-black flex items-center justify-center">50</span>
        {cards.length > 1 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/45 text-white text-[11px] font-bold">
            <Images className="w-3 h-3 text-white/80" /> {cards.length}
          </span>
        )}
        {idx === 0 && postTags.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/55 text-white text-[9.5px] font-extrabold uppercase tracking-[0.8px] max-w-[120px]">
            <Tag className="w-2.5 h-2.5 shrink-0" /> <span className="truncate">{tag}</span>
          </span>
        ))}
      </div>

      {/* Bas : titre, excerpt, signature */}
      <div className="absolute bottom-0 inset-x-0 px-[22px] pb-[22px] pt-6">
        <h2 className="text-white text-[22px] leading-7 font-black [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] line-clamp-3">
          {card.subject?.trim() || t('(Sans titre)', '(Untitled)')}
        </h2>
        {!!card.description?.trim() && card.description.trim() !== card.subject?.trim() && (
          <p className="text-white/[0.88] text-sm leading-5 mt-1.5 font-medium [text-shadow:0_1px_5px_rgba(0,0,0,0.5)] line-clamp-2">
            {card.description}
          </p>
        )}
        {idx === 0 && (
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/20">
            {byline('w-8 h-8', 'text-[11px]')}
          </div>
        )}
      </div>

      <ChevronLeft className="absolute right-2 top-1/2 -mt-2 w-3.5 h-3.5 text-white/50" />

      {/* Clic moitié gauche/droite = page précédente/suivante (façon stories) */}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => goToPage(idx * 2 - 1)}
        className="absolute inset-y-0 left-0 w-1/2"
        aria-label={t('Page précédente', 'Previous page')}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => goToPage(idx * 2 + 1)}
        className="absolute inset-y-0 right-0 w-1/2"
        aria-label={t('Page suivante', 'Next page')}
      />
    </div>
  );

  /* ── Verso : image floutée assombrie, description longue, source, vote ── */
  const renderInfo = (card: PostDraftImage, idx: number) => {
    const sourceUrl = card.source?.url?.trim() || '';
    return (
      <div key={`info-${idx}`} className="relative w-full shrink-0 snap-center overflow-hidden bg-black">
        {card.image_url && (
          <img src={card.image_url} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110" />
        )}
        <div className="absolute inset-0 bg-black/[0.82]" />
        <div className="absolute left-0 inset-y-0 w-[5px] bg-white/15 flex flex-col justify-end">
          <div className="h-1/2 w-full bg-white/30 rounded-t-sm" />
        </div>

        <div className="relative h-full flex flex-col px-[22px] pt-11 pb-3.5">
          <div className="flex-1 overflow-y-auto space-y-2.5">
            <h3 className="text-white text-[19px] leading-[25px] font-extrabold">
              {card.subject?.trim() || t('(Sans titre)', '(Untitled)')}
            </h3>
            {(card.back_description?.trim() || card.description?.trim()) && (
              <p className="text-white/70 text-[15px] leading-[23px] whitespace-pre-line">
                {card.back_description?.trim() || card.description}
              </p>
            )}

            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between">
              {sourceUrl ? (
                <span className="flex items-center gap-1.5 py-2 text-xs font-bold" style={{ color: MINT }}>
                  1 {t('source', 'source')}
                </span>
              ) : (
                <span className="py-2 text-xs font-bold text-white/40">
                  {t('Aucune source', 'No source')} *
                </span>
              )}
              <span className="px-2 py-1 rounded-lg bg-black/50 text-white/60 text-[10px] font-bold">ASV</span>
            </div>
            {sourceUrl && (
              <div className="flex items-center gap-2 py-1 pl-1">
                <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ backgroundColor: MINT }} />
                <span className="text-white text-[12.5px] font-semibold truncate">
                  {card.source?.title?.trim() || hostFromUrl(sourceUrl) || sourceUrl}
                </span>
                <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ backgroundColor: MINT }} />
              </div>
            )}

            {/* Barre de vote (décorative en aperçu) */}
            <div className="flex items-center gap-2.5 py-1">
              <span className="text-white/60 text-[10px] font-semibold shrink-0">
                {t('Cette info te paraît...', 'This info seems...')}
              </span>
              <div className="flex items-center flex-1 h-[34px] rounded-[10px] bg-white/[0.06] border border-white/10 overflow-hidden">
                <span className="flex-1 h-full flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.3px] text-red-500">
                  {t('Douteuse', 'Doubtful')}
                </span>
                <span className="w-px h-[18px] bg-white/10" />
                <span className="flex-1 h-full flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.3px]" style={{ color: MINT }}>
                  {t('Fiable', 'Reliable')}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-between pt-2.5 border-t border-white/10">
            {byline('w-7 h-7', 'text-[10.5px]')}
            <div className="flex items-center gap-1 text-white">
              <span className="w-9 h-9 flex items-center justify-center"><MessageCircle className="w-[17px] h-[17px]" /></span>
              <span className="w-9 h-9 flex items-center justify-center"><Share2 className="w-[17px] h-[17px]" /></span>
            </div>
          </div>
        </div>

        <ChevronRight className="absolute left-2 top-1/2 -mt-2 w-3.5 h-3.5 text-white/50" />

        {/* Bandes de clic sur les bords (le centre reste scrollable verticalement) :
            gauche = revenir à la cover, droite = carte suivante */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => goToPage(idx * 2)}
          className="absolute left-0 top-0 bottom-20 w-9"
          aria-label={t('Page précédente', 'Previous page')}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => goToPage(idx * 2 + 2)}
          className="absolute right-0 top-0 bottom-20 w-9"
          aria-label={t('Page suivante', 'Next page')}
        />
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      role="dialog"
      aria-label={t('Aperçu de la dépêche', 'Dispatch preview')}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label={t('Fermer', 'Close')}
      >
        <X className="w-6 h-6" />
      </button>

      {/* ── Mockup téléphone : châssis + écran (même gabarit que l'aperçu article) ── */}
      <div
        className="rounded-[52px] bg-neutral-900 p-[10px] shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-aw-bg text-aw-text rounded-[42px] overflow-hidden w-[375px] max-w-[calc(100vw-4rem)] h-[min(85vh,780px)] flex flex-col">
          {/* Barre de statut + Dynamic Island */}
          <div className="relative shrink-0 flex items-center justify-between px-8 pt-3 pb-1">
            <span className="text-[13px] font-semibold tabular-nums">9:41</span>
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[110px] h-[26px] rounded-full bg-black" />
            <span className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-4 h-4" />
              <BatteryFull className="w-5 h-5" />
            </span>
          </div>

          {/* La carte, comme dans le feed : marges 16, coins 22 */}
          <div className="flex-1 min-h-0 px-4 py-2.5">
            <div className="relative h-full rounded-[22px] overflow-hidden bg-black shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
              <div
                ref={scrollerRef}
                className="flex h-full overflow-x-auto snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none' }}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  const page = Math.round(el.scrollLeft / el.clientWidth);
                  if (page !== currentPage && page >= 0 && page < totalPages) setCurrentPage(page);
                }}
              >
                {cards.map((card, idx) => [renderCover(card, idx), renderInfo(card, idx)])}
              </div>

              {totalPages > 2 && (
                <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-[5px]">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i === currentPage
                          ? 'w-[18px] h-[5px] rounded-[3px] bg-white'
                          : `w-1.5 h-1.5 bg-white/30 ${i % 2 === 1 ? 'rounded-[2px]' : 'rounded-full'}`
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Barre home */}
          <div className="shrink-0 flex justify-center py-2">
            <div className="w-32 h-1 rounded-full bg-aw-text/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
