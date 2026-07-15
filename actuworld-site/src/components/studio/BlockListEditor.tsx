import { ArrowDown, ArrowUp, Heading2, Minus, Pilcrow, Quote, Trash2, Image as ImageIcon } from 'lucide-react';
import type { JournalBlock } from '../../types/journal';
import { useLanguage } from '../../i18n/LanguageContext';

interface BlockListEditorProps {
  blocks: JournalBlock[];
  onChange: (blocks: JournalBlock[]) => void;
}

const inputClass =
  'w-full rounded-xl border border-aw bg-aw-bg px-4 py-3 text-aw-text placeholder:text-aw-muted focus:outline-none focus:ring-2 focus:ring-aw-primary';

export function BlockListEditor({ blocks, onChange }: BlockListEditorProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const replaceAt = (index: number, block: JournalBlock) =>
    onChange(blocks.map((current, i) => (i === index ? block : current)));

  const removeAt = (index: number) => onChange(blocks.filter((_, i) => i !== index));

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const append = (block: JournalBlock) => onChange([...blocks, block]);

  const blockLabel = (block: JournalBlock): string => {
    switch (block.type) {
      case 'heading': return t('Titre de section', 'Section heading');
      case 'paragraph': return t('Paragraphe', 'Paragraph');
      case 'quote': return t('Citation', 'Quote');
      case 'divider': return t('Séparateur', 'Divider');
      default: return t('Image (éditable dans l’app)', 'Image (editable in the app)');
    }
  };

  return (
    <div className="space-y-4">
      {blocks.length === 0 && (
        <p className="text-aw-muted text-sm">
          {t('Ajoute un premier bloc pour commencer à écrire.', 'Add a first block to start writing.')}
        </p>
      )}

      {blocks.map((block, index) => (
        <div key={index} className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-aw-muted text-xs uppercase tracking-wide">{blockLabel(block)}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0}
                className="p-1.5 rounded-lg text-aw-muted hover:text-aw-primary disabled:opacity-30"
                aria-label={t('Monter le bloc', 'Move block up')}>
                <ArrowUp className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}
                className="p-1.5 rounded-lg text-aw-muted hover:text-aw-primary disabled:opacity-30"
                aria-label={t('Descendre le bloc', 'Move block down')}>
                <ArrowDown className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => removeAt(index)}
                className="p-1.5 rounded-lg text-aw-muted hover:text-red-500"
                aria-label={t('Supprimer le bloc', 'Delete block')}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {block.type === 'heading' && (
            <div className="flex gap-3">
              <input
                type="text"
                value={block.text}
                onChange={(e) => replaceAt(index, { ...block, text: e.target.value })}
                placeholder={t('Titre de section…', 'Section heading…')}
                className={`${inputClass} font-semibold`}
              />
              <select
                value={block.level ?? 2}
                onChange={(e) => replaceAt(index, { ...block, level: Number(e.target.value) as 1 | 2 | 3 })}
                className="rounded-xl border border-aw bg-aw-bg px-3 text-aw-text"
                aria-label={t('Niveau du titre', 'Heading level')}
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
              </select>
            </div>
          )}

          {block.type === 'paragraph' && (
            <textarea
              value={block.text}
              onChange={(e) => replaceAt(index, { ...block, text: e.target.value })}
              placeholder={t('Écris ton paragraphe…', 'Write your paragraph…')}
              rows={Math.max(3, Math.ceil(block.text.length / 90))}
              className={inputClass}
            />
          )}

          {block.type === 'quote' && (
            <div className="space-y-3">
              <textarea
                value={block.text}
                onChange={(e) => replaceAt(index, { ...block, text: e.target.value })}
                placeholder={t('Texte de la citation…', 'Quote text…')}
                rows={2}
                className={`${inputClass} italic`}
              />
              <input
                type="text"
                value={block.author ?? ''}
                onChange={(e) => replaceAt(index, { ...block, author: e.target.value || undefined })}
                placeholder={t('Auteur de la citation (optionnel)', 'Quote author (optional)')}
                className={inputClass}
              />
            </div>
          )}

          {block.type === 'divider' && <hr className="border-aw" />}

          {(block.type === 'image' || block.type === 'image_text') && (
            <div className="flex items-center gap-2 text-aw-muted text-sm">
              <ImageIcon className="w-4 h-4 shrink-0" />
              {t(
                'Bloc image conservé tel quel — les images se gèrent dans l’app pour l’instant.',
                'Image block kept as is — images are managed in the app for now.'
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-outline inline-flex items-center text-sm"
          onClick={() => append({ type: 'paragraph', text: '' })}>
          <Pilcrow className="w-4 h-4 mr-1.5" /> {t('Paragraphe', 'Paragraph')}
        </button>
        <button type="button" className="btn-outline inline-flex items-center text-sm"
          onClick={() => append({ type: 'heading', text: '', level: 2 })}>
          <Heading2 className="w-4 h-4 mr-1.5" /> {t('Titre de section', 'Section heading')}
        </button>
        <button type="button" className="btn-outline inline-flex items-center text-sm"
          onClick={() => append({ type: 'quote', text: '' })}>
          <Quote className="w-4 h-4 mr-1.5" /> {t('Citation', 'Quote')}
        </button>
        <button type="button" className="btn-outline inline-flex items-center text-sm"
          onClick={() => append({ type: 'divider' })}>
          <Minus className="w-4 h-4 mr-1.5" /> {t('Séparateur', 'Divider')}
        </button>
      </div>
    </div>
  );
}
