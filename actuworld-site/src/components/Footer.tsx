import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Logo } from './Logo';
import { resetConsent } from '../hooks/useCookieConsent';

export const Footer: React.FC = () => {
  const { isEnglish } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 border-t border-aw bg-aw-surface">
      <div className="max-w-7xl mx-auto container-px">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Logo + © calés à gauche ; les liens se centrent dans l'espace restant */}
          <div className="flex flex-none items-center gap-2">
            <Logo size={28} withText textClassName="body-semi text-aw-text" glow={false} />
            <span className="caption text-aw-muted">© {year}</span>
          </div>

          <div className="flex-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
              <Link to="/" className="text-aw-muted hover:text-aw-primary transition-colors">{isEnglish ? 'Home' : 'Accueil'}</Link>
              <Link to="/about" className="text-aw-muted hover:text-aw-primary transition-colors">{isEnglish ? 'About' : 'À propos'}</Link>
              <Link to="/app" className="text-aw-muted hover:text-aw-primary transition-colors">{isEnglish ? 'App' : "L'App"}</Link>
              <Link to="/reco-src" className="text-aw-muted hover:text-aw-primary transition-colors">ASV</Link>
              <Link to="/faq" className="text-aw-muted hover:text-aw-primary transition-colors">FAQ</Link>
              <Link to="/partenaires" className="text-aw-muted hover:text-aw-primary transition-colors">{isEnglish ? 'Partners' : 'Partenaires'}</Link>
              <Link to="/contact" className="text-aw-muted hover:text-aw-primary transition-colors">{isEnglish ? 'Contact' : 'Contact'}</Link>
            </nav>

            <span
              aria-hidden="true"
              className="w-px h-5 rounded-full self-center"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--aw-primary) 60%, transparent), transparent)',
              }}
            />

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 caption text-aw-muted">
              <Link to="/privacy" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Privacy' : 'Confidentialité'}</Link>
              <Link to="/terms" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Terms' : 'Conditions'}</Link>
              <Link to="/mentions-legales" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Legal' : 'Mentions légales'}</Link>
              <Link to="/suppression-compte" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Delete account' : 'Suppression de compte'}</Link>
              <button onClick={() => resetConsent()} className="hover:text-aw-primary transition-colors">Cookies</button>
              <Link to="/press" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Press' : 'Presse'}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
