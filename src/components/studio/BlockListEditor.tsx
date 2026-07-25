import { useRef, useState } from 'react';
import type { ClipboardEvent, DragEvent } from 'react';
import {
  AlignLeft, AlignRight, ArrowDown, ArrowUp, GripVertical, Image as ImageIcon,
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

  const uploadAsBlock = async (file: File, kind: 'image' | 'image_text') => {
    if (isUploading) return;
    setIsUploading(true);
    try {
      const path = await uploadJournalImage(file);
      if (kind === 'image') {
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

  const handleFileSelected = (file: File | undefined) => {
    if (file) void uploadAsBlock(file, pendingImageKind.current);
  };

  // ── Coller / glisser une image n'importe où dans la zone des blocs ──
  const handlePasteImage = (event: ClipboardEvent<HTMLDivElement>) => {
    const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith('image/'));
    if (!file) return; // collage de texte : comportement normal
    event.preventDefault();
    void uploadAsBlock(file, 'image');
  };

  // ── Réordonnancement des blocs par glisser-déposer (poignée) ──
  const dragBlockIndex = useRef<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const handleDropFile = (event: DragEvent<HTMLDivElement>) => {
    setIsDragOver(false);
    if (dragBlockIndex.current !== null) return; // réordonnancement interne, pas un fichier
    const file = Array.from(event.dataTransfer?.files ?? []).find((f) => f.type.startsWith('image/'));
    if (!file) return;
    event.preventDefault();
    void uploadAsBlock(file, 'image');
  };

  const handleBlockDrop = (targetIndex: number) => {
    const from = dragBlockIndex.current;
    dragBlockIndex.current = null;
    setDropTarget(null);
    if (from === null || from === targetIndex) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
  };

  // ── Collage intelligent : un texte multi-paragraphes devient plusieurs blocs ──
  const handleParagraphPaste = (
    index: number,
    block: Extract<JournalBlock, { type: 'paragraph' }>,
    event: ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const text = event.clipboardData.getData('text/plain');
    if (!/\n\s*\n/.test(text)) return; // un seul paragraphe : collage natif
    event.preventDefault();

    // Budget global restant (y compris ce champ) pour ne pas dépasser BODY_MAX.
    let remaining = Math.max(0, budgetFor(block.text.length) - block.text.length);
    const parts = text
      .split(/\n\s*\n+/)
      .map((part) => part.replace(/\s+\n/g, '\n').trim())
      .filter(Boolean)
      .map((part) => {
        const kept = part.slice(0, remaining);
        remaining -= kept.length;
        return kept;
      })
      .filter(Boolean);
    if (parts.length === 0) return;

    const el = event.currentTarget;
    const before = block.text.slice(0, el.selectionStart ?? block.text.length);
    const after = block.text.slice(el.selectionEnd ?? block.text.length);

    const firstText = (before + parts[0]).trimStart();
    const middle = parts.slice(1, -1).map((part): JournalBlock => ({ type: 'paragraph', text: part }));
    const lastText = parts.length > 1 ? parts[parts.length - 1] + after : null;

    const next = [...blocks];
    next[index] = { type: 'paragraph', text: lastText === null ? firstText + after : firstText };
    const tail: JournalBlock[] = lastText === null ? middle : [...middle, { type: 'paragraph', text: lastText }];
    next.splice(index + 1, 0, ...tail);
    onChange(next);
  };

  return (
    <div
      className={`space-y-3 rounded-xl transition-colors ${isDragOver ? 'ring-2 ring-aw-primary/50' : ''}`}
      onPaste={handlePasteImage}
      onDragOver={(e) => {
        if (dragBlockIndex.current === null && e.dataTransfer?.types.includes('Files')) {
          e.preventDefault();
          setIsDragOver(true);
        }
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDropFile}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
      />

      {blocks.map((block, index) => (
        <div
          key={index}
          onDragOver={(e) => {
            if (dragBlockIndex.current !== null) {
              e.preventDefault();
              setDropTarget(index);
            }
          }}
          onDrop={(e) => {
            if (dragBlockIndex.current !== null) {
              e.preventDefault();
              e.stopPropagation();
              handleBlockDrop(index);
            }
          }}
          className={dropTarget === index && dragBlockIndex.current !== null ? 'border-t-2 border-aw-primary' : ''}
        >
          {/* Mini-toolbar du bloc : poignée de glisser, monter, descendre, supprimer */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              draggable
              onDragStart={(e) => {
                dragBlockIndex.current = index;
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragEnd={() => { dragBlockIndex.current = null; setDropTarget(null); }}
              className="p-1.5 rounded-lg bg-aw-surface text-aw-muted cursor-grab active:cursor-grabbing"
              aria-label={t('Glisser pour réordonner', 'Drag to reorder')}
            >
              <GripVertical className="w-4 h-4" />
            </span>
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
              onPaste={(e) => handleParagraphPaste(index, block, e)}
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
