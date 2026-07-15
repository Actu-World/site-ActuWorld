import { Link } from 'react-router-dom';
import { Images, Newspaper } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// Bascule entre les deux formats du Studio : article (journal) et post rapide.

export function StudioTabs({ active }: { active: 'article' | 'post' }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors';
  const on = 'bg-aw-primary text-white body-semi';
  const off = 'border border-aw text-aw-muted hover:text-aw-primary';

  return (
    <nav className="flex gap-2 mb-6" aria-label="Studio">
      <Link to="/studio/editeur" className={`${base} ${active === 'article' ? on : off}`}>
        <Newspaper className="w-4 h-4" /> {t('Article', 'Article')}
      </Link>
      <Link to="/studio/post" className={`${base} ${active === 'post' ? on : off}`}>
        <Images className="w-4 h-4" /> {t('Post rapide', 'Quick post')}
      </Link>
    </nav>
  );
}
