import { useEffect } from 'react';
import { X, Link2 } from 'lucide-react';
import type { JournalBlock, JournalSource } from '../../types/journal';
import { journalImageUrl } from '../../lib/studio/images';
import { hostFromUrl } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Aperçu « comme dans l'app » : rendu de l'article dans un cadre à largeur de
// téléphone (~390px), pour vérifier le rythme visuel avant l'envoi.

interface ArticlePreviewProps {
  title: string;
  dek: string;
  coverPath: string | null;
  blocks: JournalBlock[];
  sources: JournalSource[];
  onClose: () => void;
}

export function ArticlePreview({ title, dek, coverPath, blocks, sources, onClose }: ArticlePreviewProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const filledSources = sources.filter((s) => s.url.trim());

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      role="dialog"
      aria-label={t("Aperçu de l'article", 'Article preview')}
      onClick={onClose}
    >
      <div
        className="bg-aw-bg text-aw-text rounded-3xl shadow-2xl w-full max-w-[400px] max-h-[90vh] flex flex-col overflow-hidden border border-aw"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-aw shrink-0">
          <p className="text-aw-muted text-xs uppercase tracking-wide">
            {t('Aperçu mobile', 'Mobile preview')}
          </p>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-aw-muted hover:text-aw-text"
            aria-label={t('Fermer', 'Close')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {coverPath && (
            <img src={journalImageUrl(coverPath)} alt="" className="w-full aspect-[3/2] object-cover" />
          )}
          <div className="p-5">
            <h1 className="text-2xl font-bold leading-tight">
              {title.trim() || t('(Sans titre)', '(Untitled)')}
            </h1>
            {dek.trim() && <p className="text-aw-muted mt-2">{dek}</p>}

            <div className="mt-5 space-y-4">
              {blocks.map((block, index) => {
                switch (block.type) {
                  case 'heading':
                    return (
                      <h2 key={index} className={`font-semibold ${block.level === 3 ? 'text-lg' : block.level === 1 ? 'text-2xl' : 'text-xl'}`}>
                        {block.text}
                      </h2>
                    );
                  case 'paragraph':
                    return block.text.trim()
                      ? <p key={index} className="leading-relaxed whitespace-pre-line">{block.text}</p>
                      : null;
                  case 'quote':
                    return block.text.trim() ? (
                      <blockquote key={index} className="border-l-4 border-aw-primary pl-4 italic text-aw-muted">
                        {block.text}
                      </blockquote>
                    ) : null;
                  case 'divider':
                    return <hr key={index} className="border-aw" />;
                  case 'image':
                    return (
                      <figure key={index}>
                        <img src={journalImageUrl(block.uri)} alt={block.caption ?? ''} className="w-full rounded-xl" />
                        {block.caption && <figcaption className="text-aw-muted text-xs mt-1.5">{block.caption}</figcaption>}
                      </figure>
                    );
                  case 'image_text':
                    return (
                      <div key={index} className={`flex gap-3 items-start ${(block.align ?? 'left') === 'right' ? 'flex-row-reverse' : ''}`}>
                        <figure className="w-28 shrink-0">
                          <img src={journalImageUrl(block.uri)} alt={block.caption ?? ''} className="w-28 aspect-[3/4] object-cover rounded-lg" />
                          {block.caption && <figcaption className="text-aw-muted text-[10px] mt-1">{block.caption}</figcaption>}
                        </figure>
                        <p className="leading-relaxed text-sm whitespace-pre-line flex-1">{block.text}</p>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>

            {filledSources.length > 0 && (
              <div className="mt-6 pt-4 border-t border-aw">
                <p className="text-xs uppercase tracking-wide text-aw-muted mb-2">{t('Sources', 'Sources')}</p>
                <ul className="space-y-1.5">
                  {filledSources.map((source, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Link2 className="w-3.5 h-3.5 text-aw-primary shrink-0 mt-0.5" />
                      <span className="min-w-0">
                        <span className="block truncate">{source.title?.trim() || source.url}</span>
                        <span className="text-aw-muted text-xs">{hostFromUrl(source.url)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
