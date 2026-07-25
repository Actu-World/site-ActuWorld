import { Link } from 'react-router-dom';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../i18n/LanguageContext';
import { Logo } from '../Logo';

/**
 * En-tête de l'environnement Studio : remplace la Navbar du site sur les
 * routes /studio. Identité propre (logo + badge Studio), pas de navigation
 * marketing — juste la langue, le thème et un retour discret vers le site.
 */
export const StudioNavbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, isEnglish } = useLanguage();

  return (
    <header className="sticky top-0 z-40 glass border-b border-aw" role="banner">
      <div className="max-w-7xl mx-auto container-px h-16 flex items-center justify-between">
        <Link
          to="/studio/editeur"
          aria-label="ActuWorld Studio"
          className="inline-flex items-center gap-2.5 min-w-0"
        >
          <Logo size={32} withText textClassName="text-lg text-aw-text" />
          <span
            className="px-2 py-0.5 rounded-md text-[11px] font-bold tracking-[1.5px] uppercase bg-aw-primary text-on-primary shrink-0"
            style={{ fontFamily: '"Platypi", Georgia, serif' }}
          >
            Studio
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Retour discret vers le site vitrine */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-aw-muted hover:text-aw-primary transition-colors mr-1"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {isEnglish ? 'Back to the site' : 'Retour au site'}
          </Link>

          <div
            className="flex items-center gap-1 rounded-lg border border-aw p-1"
            role="group"
            aria-label={isEnglish ? 'Language selector' : 'Sélecteur de langue'}
          >
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${language === 'fr' ? 'bg-aw-primary text-on-primary' : 'text-aw-muted hover:text-aw-text'}`}
              aria-pressed={language === 'fr'}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${language === 'en' ? 'bg-aw-primary text-on-primary' : 'text-aw-muted hover:text-aw-text'}`}
              aria-pressed={language === 'en'}
            >
              EN
            </button>
          </div>

          <motion.button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-aw flex items-center justify-center hover:bg-aw-surface transition-colors"
            aria-label={theme === 'dark' ? (isEnglish ? 'Switch to light mode' : 'Passer en mode clair') : (isEnglish ? 'Switch to dark mode' : 'Passer en mode sombre')}
            title={theme === 'dark' ? (isEnglish ? 'Light mode' : 'Mode clair') : (isEnglish ? 'Dark mode' : 'Mode sombre')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
