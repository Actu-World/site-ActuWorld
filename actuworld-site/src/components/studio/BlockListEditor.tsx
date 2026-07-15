import { useRef, useState } from 'react';
import {
  AlignLeft, AlignRight, ArrowDown, ArrowUp, Image as ImageIcon,
  LayoutPanelLeft, Minus, Pilcrow, Quote, Trash2, Type,
} from 'lucide-react';
import type { JournalBlock } from '../../types/journal';
import { journalImageUrl, uploadJournalImage } from '../../lib/studio/images';
import { useLanguage } from '../../i18n/LanguageContext';

// Blocs strictement alignés sur le composer mobile (journal/compose.tsx) :
// paragraphe, titre (niveau 2), image + légende, img+texte (align g/d),
// citation (sans auteur), séparateur. Pas de gras/italique.

interface BlockListEditorProps {
  blocks: JournalBlock[];
  onChange: (blocks: JournalBlock[]) => void;
  /** Budget de corps partagé (BODY_MAX) : maxLength d'un champ = budgetFor(longueur actuelle). */
  budgetFor: (currentLen: number) => number;
  onUploadError: (message: string) => void;
}

const inputClass =
  'w-full rounded-lg border border-aw bg-aw-bg px-3 py-2.5 text-aw-text placeholder:text-aw-muted focus:outline-none focus:ring-2 focus:ring-aw-primary';

const headingSize = (level?: 1 | 2 | 3) =>
  level === 3 ? 'text-lg' : level === 1 ? 'text-2xl' : 'text-xl';

export function BlockListEditor({ blocks, onChange, budgetFor, onUploadError }: BlockListEditorProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // Type de bloc image en attente de fichier : 'image' | 'image_text'
  const pendingImageKind = useRef<'image' | 'image_text'>('image');
  const [isUploading, setIsUploading] = useState(false);

  const replaceAt = (index: number, block: JournalBlock) =>
    onChange(blocks.map((current, i) => (i === index ? block : current)));
  const removeAt = (index: number) => onChange(blocks.filter((_, i) => i !== index));
  const append = (block: JournalBlock) => onChange([...blocks, block]);

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const pickImage = (kind: 'image' | 'image_text') => {
    pendingImageKind.current = kind;
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (file: File | undefined) => {
    if (!file || isUploading) return;
    setIsUploading(true);
    try {
      const path = await uploadJournalImage(file);
      if (pendingImageKind.current === 'image') {
        append({ type: 'image', uri: path, caption: '' });
      } else {
        append({ type: 'image_text', uri: path, text: '', caption: '', align: 'left' });
      }
    } catch (err: unknown) {
      onUploadError(err instanceof Error ? err.message : t("L'upload de l'image a échoué.", 'Image upload failed.'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFileSelected(e.target.files?.[0])}
      />

      {blocks.map((block, index) => (
        <div key={index}>
          {/* Mini-toolbar du bloc — même logique que l'app : monter, descendre, supprimer */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0}
              className="p-1.5 rounded-lg bg-aw-surface text-aw-muted hover:text-aw-primary disabled:opacity-30"
              aria-label={t('Monter le bloc', 'Move block up')}>
              <ArrowUp className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}
              className="p-1.5 rounded-lg bg-aw-surface text-aw-muted hover:text-aw-primary disabled:opacity-30"
              aria-label={t('Descendre le bloc', 'Move block down')}>
              <ArrowDown className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => removeAt(index)}
              className="p-1.5 rounded-lg bg-aw-surface text-red-500 hover:text-red-600"
              aria-label={t('Supprimer le bloc', 'Delete block')}>
              <Trash2 className="w-4 h-4" />
            </button>
            {block.type === 'image_text' && (
              <button
                type="button"
                onClick={() => replaceAt(index, { ...block, align: (block.align ?? 'left') === 'left' ? 'right' : 'left' })}
                className="p-1.5 rounded-lg bg-aw-surface text-aw-muted hover:text-aw-primary"
                aria-label={t("Basculer l'image gauche/droite", 'Toggle image left/right')}
              >
                {(block.align ?? 'left') === 'left'
                  ? <AlignLeft className="w-4 h-4" />
                  : <AlignRight className="w-4 h-4" />}
              </button>
            )}
          </div>

          {block.type === 'paragraph' && (
            <textarea
              value={block.text}
              onChange={(e) => replaceAt(index, { ...block, text: e.target.value })}
              placeholder={`${t('Paragraphe', 'Paragraph')}...`}
              maxLength={budgetFor(block.text.length)}
              rows={Math.max(3, Math.ceil(block.text.length / 90))}
              className={inputClass}
            />
          )}

          {block.type === 'heading' && (
            <input
              type="text"
              value={block.text}
              onChange={(e) => replaceAt(index, { ...block, text: e.target.value })}
              placeholder={`${t('Titre', 'Heading')} (${block.level ?? 2})`}
              maxLength={budgetFor(block.text.length)}
              className={`${inputClass} font-semibold ${headingSize(block.level)}`}
            />
          )}

          {block.type === 'quote' && (
            <textarea
              value={block.text}
              onChange={(e) => replaceAt(index, { ...block, text: e.target.value })}
              placeholder={`${t('Citation', 'Quote')}...`}
              maxLength={budgetFor(block.text.length)}
              rows={2}
              className={`${inputClass} italic`}
            />
          )}

          {block.type === 'divider' && <hr className="border-aw my-2" />}

          {block.type === 'image' && (
            <div>
              <img
                src={journalImageUrl(block.uri)}
                alt={block.caption ?? ''}
                className="w-full aspect-video object-cover rounded-lg"
              />
              <input
                type="text"
                value={block.caption ?? ''}
                onChange={(e) => replaceAt(index, { ...block, caption: e.target.value })}
                placeholder={t('Légende (optionnel)', 'Caption (optional)')}
                maxLength={budgetFor((block.caption ?? '').length)}
                className={`${inputClass} mt-2 text-sm`}
              />
            </div>
          )}

          {block.type === 'image_text' && (
            <div className={`flex gap-4 items-start ${(block.align ?? 'left') === 'right' ? 'flex-row-reverse' : ''}`}>
              <div className="w-36 shrink-0">
                <img
                  src={journalImageUrl(block.uri)}
                  alt={block.caption ?? ''}
                  className="w-36 aspect-[3/4] object-cover rounded-lg bg-aw-surface"
                />
                <input
                  type="text"
                  value={block.caption ?? ''}
                  onChange={(e) => replaceAt(index, { ...block, caption: e.target.value })}
                  placeholder={t('Légende (optionnel)', 'Caption (optional)')}
                  maxLength={budgetFor((block.caption ?? '').length)}
                  className={`${inputClass} mt-2 text-xs`}
                />
              </div>
              <textarea
                value={block.text}
                onChange={(e) => replaceAt(index, { ...block, text: e.target.value })}
                placeholder={`${t('Texte', 'Text')}...`}
                maxLength={budgetFor(block.text.length)}
                rows={6}
                className={`${inputClass} flex-1`}
              />
            </div>
          )}
        </div>
      ))}

      {/* Barre d'ajout — mêmes 6 types que l'app */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button type="button" className="btn-outline inline-flex items-center text-sm"
          onClick={() => append({ type: 'paragraph', text: '' })}>
          <Pilcrow className="w-4 h-4 mr-1.5" /> {t('Paragraphe', 'Paragraph')}
        </button>
        <button type="button" className="btn-outline inline-flex items-center text-sm"
          onClick={() => append({ type: 'heading', text: '', level: 2 })}>
          <Type className="w-4 h-4 mr-1.5" /> {t('Titre', 'Heading')}
        </button>
        <button type="button" disabled={isUploading} className="btn-outline inline-flex items-center text-sm disabled:opacity-50"
          onClick={() => pickImage('image')}>
          <ImageIcon className="w-4 h-4 mr-1.5" /> {isUploading ? t('Upload…', 'Uploading…') : t('Image', 'Image')}
        </button>
        <button type="button" disabled={isUploading} className="btn-outline inline-flex items-center text-sm disabled:opacity-50"
          onClick={() => pickImage('image_text')}>
          <LayoutPanelLeft className="w-4 h-4 mr-1.5" /> {t('Img + texte', 'Img + text')}
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
