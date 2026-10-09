import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../i18n/LanguageContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Le menu mobile se referme à chaque navigation et avec Échap
  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    // Menu plein écran : la page dessous ne défile plus
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: '/app', label: t("L'app", 'The app') },
    { href: '/reco-src', label: 'ASV' },
    { href: '/faq', label: 'FAQ' },
    { href: '/partenaires', label: t('Partenaires', 'Partners') },
    { href: '/contact', label: 'Contact' },
  ];

  // Sur mobile, le menu a la place d'afficher aussi les pages secondaires
  const mobileLinks = [
    ...navLinks.slice(0, 2),
    { href: '/about', label: t('À propos', 'About') },
    ...navLinks.slice(2),
    { href: '/press', label: t('Presse', 'Press') },
  ];

  const isActive = (path: string) => location.pathname === path;
  const themeLabel = theme === 'dark' ? t('Passer en mode clair', 'Switch to light mode') : t('Passer en mode sombre', 'Switch to dark mode');

  return (
    <header
      className={`sticky top-0 z-40 glass border-b transition-[border-color,box-shadow] duration-300 ${
        scrolled ? 'border-aw' : 'border-transparent'
      }`}
      style={scrolled ? { boxShadow: 'var(--aw-shadow-sm)' } : undefined}
    >
      <div className="max-w-7xl mx-auto container-px h-16 flex items-center justify-between gap-6">
        <Link to="/" aria-label={t('Accueil ActuWorld', 'ActuWorld home')} className="rounded-lg">
          <Logo size={34} withText glow={false} textClassName="text-lg md:text-xl text-aw-text" />
        </Link>

        {/* Navigation bureau */}
        <nav className="hidden lg:flex items-center gap-1" aria-label={t('Navigation principale', 'Main navigation')}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative px-3 py-2 rounded-lg text-[15px] font-medium ${
                isActive(link.href) ? 'text-aw-text' : 'text-aw-muted hover:text-aw-text'
              }`}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="navbar-indicator"
                  className="absolute left-3 right-3 -bottom-[13px] h-[2px] bg-aw-primary"
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center rounded-[10px] border border-aw p-0.5" role="group" aria-label={t('Langue', 'Language')}>
            {(['fr', 'en'] as const).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setLanguage(lng)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                  language === lng ? 'bg-aw-surface text-aw-text' : 'text-aw-muted hover:text-aw-text'
                }`}
                aria-pressed={language === lng}
                lang={lng}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-[10px] border border-aw flex items-center justify-center text-aw-muted hover:text-aw-text hover:border-aw-strong"
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" aria-hidden="true" /> : <Moon className="w-[18px] h-[18px]" aria-hidden="true" />}
          </button>

          <Link to="/#rejoindre" className="btn-primary btn-sm ml-1">
            {t('Être prévenu', 'Get notified')}
          </Link>
        </div>

        {/* Commandes mobiles */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center text-aw-text rounded-lg"
            aria-label={themeLabel}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="h-10 px-2 text-xs font-semibold rounded-lg text-aw-muted"
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            aria-label={t('Passer en anglais', 'Switch to French')}
          >
            {language === 'fr' ? 'EN' : 'FR'}
          </button>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-aw-text rounded-lg"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? t('Fermer le menu', 'Close menu') : t('Ouvrir le menu', 'Open menu')}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-aw bg-aw-bg h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain"
          >
            <nav className="max-w-7xl mx-auto container-px py-4 flex flex-col" aria-label={t('Navigation mobile', 'Mobile navigation')}>
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`py-3.5 text-lg font-medium border-b border-aw last:border-0 ${
                    isActive(link.href) ? 'text-aw-primary' : 'text-aw-text'
                  }`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/#rejoindre" className="btn-primary mt-4">
                {t('Être prévenu', 'Get notified')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
