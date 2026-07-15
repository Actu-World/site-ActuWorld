import { Link } from 'react-router-dom';
import { Images, Newspaper } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// Bascule Article / Dépêche — même langage visuel que la barre d'onglets
// des composers de l'app : libellés centrés + fin soulignement coloré sous
// l'onglet actif (bleu ciel = article, vert = dépêche, comme dans l'app).
// L'onglet actif prend entièrement sa couleur d'accent (texte + icône + trait).

const ARTICLE_ACCENT = '#0EA5E9'; // bleu ciel journal (page de création de l'app)

export function StudioTabs({ active }: { active: 'article' | 'post' }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const label = (isActive: boolean) =>
    `flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm transition-colors ${
      isActive ? 'body-semi' : 'text-aw-muted hover:text-aw-text'
    }`;

  return (
    <nav className="flex justify-center mb-8" aria-label="Studio">
      <div className="relative w-[340px] max-w-full">
        <div className="flex">
          <Link
            to="/studio/editeur"
            className={label(active === 'article')}
            style={active === 'article' ? { color: ARTICLE_ACCENT } : undefined}
          >
            <Newspaper className="w-4 h-4" /> {t('Article', 'Article')}
          </Link>
          <Link
            to="/studio/post"
            className={label(active === 'post')}
            style={active === 'post' ? { color: 'var(--aw-primary)' } : undefined}
          >
            <Images className="w-4 h-4" /> {t('Dépêche', 'Dispatch')}
          </Link>
        </div>
        {/* ligne de fond + indicateur coloré sous l'onglet actif */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-aw-text/10" aria-hidden />
        <div
          aria-hidden
          className="absolute bottom-0 h-[2px] w-1/2 rounded-full transition-transform duration-300 ease-out"
          style={{
            transform: active === 'post' ? 'translateX(100%)' : 'translateX(0)',
            backgroundColor: active === 'article' ? ARTICLE_ACCENT : 'var(--aw-primary)',
          }}
        />
      </div>
    </nav>
  );
}
