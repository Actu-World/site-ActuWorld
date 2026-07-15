import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X, Link2 } from 'lucide-react';
import type { JournalBlock, JournalSource } from '../../types/journal';
import { journalImageUrl } from '../../lib/studio/images';
import { hostFromUrl } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Aperçu « comme dans l'app » : miroir fidèle d'ArticleRenderer + de l'en-tête
// de la page article mobile (components/journal/ArticleRenderer.tsx) — mêmes
// tailles, mêmes espacements : titre 22/28, chapeau 15/22, paragraphes 15/24
// marge 12, lettrine sur le 1er paragraphe, citation avec barre primaire,
// image latérale 150px, gras inline **…**.

interface ArticlePreviewProps {
  title: string;
  dek: string;
  coverPath: string | null;
  blocks: JournalBlock[];
  sources: JournalSource[];
  onClose: () => void;
}

/** Rendu du gras inline **texte** (miroir de renderInlineBold de l'app). */
function renderInlineBold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

const headingSizePx = (level?: 1 | 2 | 3) => (level === 3 ? 18 : level === 2 ? 22 : 26);

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
  const firstParaIndex = blocks.findIndex(
    (b) => b.type === 'paragraph' && b.text.trim().length > 0
  );

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

          {/* En-tête article : paddingHorizontal 20, titre 22/28, chapeau 15/22 */}
          <div className="px-5 pt-4">
            <h1 className="text-[22px] leading-7 font-bold">
              {title.trim() || t('(Sans titre)', '(Untitled)')}
            </h1>
            {dek.trim() && (
              <p className="text-aw-muted text-[15px] leading-[22px] mt-2">{dek}</p>
            )}
          </div>

          {/* Corps : container paddingHorizontal 12, paddingVertical 10 */}
          <div className="px-3 py-2.5 mt-2">
            {blocks.map((block, index) => {
              switch (block.type) {
                case 'heading':
                  return (
                    <h2
                      key={index}
                      className="font-semibold mt-2 mb-1.5 tracking-[0.2px]"
                      style={{ fontSize: headingSizePx(block.level) }}
                    >
                      {block.text}
                    </h2>
                  );
                case 'paragraph': {
                  if (!block.text.trim()) return null;
                  // Lettrine sur le premier paragraphe, comme l'app
                  if (index === firstParaIndex) {
                    return (
                      <p key={index} className="text-[15px] leading-6 mb-3 whitespace-pre-line">
                        <span className="text-[28px] leading-7 font-bold">{block.text.slice(0, 1)}</span>
                        {renderInlineBold(block.text.slice(1))}
                      </p>
                    );
                  }
                  return (
                    <p key={index} className="text-[15px] leading-6 mb-3 whitespace-pre-line">
                      {renderInlineBold(block.text)}
                    </p>
                  );
                }
                case 'quote':
                  return block.text.trim() ? (
                    <div key={index} className="my-4 px-3.5 py-3 border-l-[3px] border-aw-primary rounded-lg bg-aw-surface">
                      <p className="leading-6">"{block.text}"</p>
                      {block.author && <p className="text-aw-muted text-xs mt-1.5">— {block.author}</p>}
                    </div>
                  ) : null;
                case 'divider':
                  return <hr key={index} className="border-aw my-3.5" />;
                case 'image':
                  return (
                    <figure key={index} className="my-3">
                      <img
                        src={journalImageUrl(block.uri)}
                        alt={block.caption ?? ''}
                        className="w-full aspect-video object-cover rounded-xl border border-aw"
                      />
                      {block.caption && (
                        <figcaption className="text-aw-muted text-xs italic mt-1.5">{block.caption}</figcaption>
                      )}
                    </figure>
                  );
                case 'image_text':
                  return (
                    <div
                      key={index}
                      className={`flex gap-3 items-start my-3 ${(block.align ?? 'left') === 'right' ? 'flex-row-reverse' : ''}`}
                    >
                      <img
                        src={journalImageUrl(block.uri)}
                        alt=""
                        className="w-[150px] aspect-[3/4] object-cover rounded-[10px] border border-aw shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        {block.text && (
                          <p className="text-[15px] leading-6 whitespace-pre-line">{renderInlineBold(block.text)}</p>
                        )}
                        {block.caption && (
                          <p className="text-aw-muted text-xs italic mt-1">{block.caption}</p>
                        )}
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })}

            {filledSources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-aw">
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
