import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Bandeau au-dessus du menu, sur toutes les pages du site vitrine : la date du
 * lancement public, visible dès l'arrivée. Il défile avec la page (le menu, lui,
 * reste collé en haut). Masqué sur la liste d'attente, où la date est déjà le titre.
 * À retirer ou à reformuler le 1er décembre.
 */
export function LaunchBanner() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const { pathname } = useLocation();
  if (pathname === '/liste-attente' || pathname === '/waitlist') return null;

  return (
    <div className="text-white text-sm" style={{ background: '#1B3528' }}>
      <div className="max-w-7xl mx-auto container-px py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-center">
        <p>
          <strong className="font-semibold">{t('Lancement officiel le 1er décembre', 'Official launch on December 1')}</strong>
          {t(" sur l'App Store et Google Play", ' on the App Store and Google Play')}
        </p>
        <Link
          to="/liste-attente"
          className="inline-flex items-center gap-1 rounded-lg underline underline-offset-2 decoration-white/40 hover:decoration-white"
        >
          {t('Être prévenu le jour J', 'Get notified on launch day')}
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
