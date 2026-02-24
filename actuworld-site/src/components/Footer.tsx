import { Link } from 'react-router-dom';
import { Globe2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { isEnglish } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 border-t border-aw bg-aw-surface">
      <div className="max-w-7xl mx-auto container-px">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-aw-primary">
              <Globe2 className="w-4 h-4 text-white" />
            </span>
            <span className="body-semi">ActuWorld</span>
            <span className="caption text-aw-muted">© {year}</span>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-aw-muted hover:text-aw-primary transition-colors">{isEnglish ? 'Home' : 'Accueil'}</Link>
            <Link to="/app" className="text-aw-muted hover:text-aw-primary transition-colors">{isEnglish ? 'App' : "L'App"}</Link>
            <Link to="/reco-src" className="text-aw-muted hover:text-aw-primary transition-colors">ASV</Link>
            <Link to="/pricing" className="text-aw-muted hover:text-aw-primary transition-colors">{isEnglish ? 'Pricing' : 'Tarifs'}</Link>
            <Link to="/faq" className="text-aw-muted hover:text-aw-primary transition-colors">FAQ</Link>
            <Link to="/contact" className="text-aw-muted hover:text-aw-primary transition-colors">{isEnglish ? 'Contact' : 'Contact'}</Link>
          </nav>

          <div className="flex items-center gap-4 caption text-aw-muted">
            <a href="#" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Privacy' : 'Confidentialité'}</a>
            <a href="#" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Terms' : 'Conditions'}</a>
            <a href="#" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Press' : 'Presse'}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
