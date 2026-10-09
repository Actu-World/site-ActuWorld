import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Logo } from './Logo';
import { resetConsent } from '../hooks/useCookieConsent';

export const Footer: React.FC = () => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const year = new Date().getFullYear();

  const explore = [
    { to: '/app', label: t("L'app", 'The app') },
    { to: '/reco-src', label: 'ASV' },
    { to: '/about', label: t('À propos', 'About') },
    { to: '/faq', label: 'FAQ' },
    { to: '/partenaires', label: t('Partenaires', 'Partners') },
    { to: '/press', label: t('Presse', 'Press') },
    { to: '/contact', label: 'Contact' },
  ];

  const legal = [
    { to: '/privacy', label: t('Confidentialité', 'Privacy') },
    { to: '/terms', label: t("Conditions d'utilisation", 'Terms of use') },
    { to: '/mentions-legales', label: t('Mentions légales', 'Legal notice') },
    { to: '/securite-enfants', label: t('Sécurité des mineurs', 'Child safety') },
    { to: '/suppression-compte', label: t('Supprimer mon compte', 'Delete my account') },
  ];

  const linkCls = 'text-aw-muted hover:text-aw-text';

  return (
    <footer className="border-t border-aw bg-aw-surface">
      <div className="max-w-6xl mx-auto container-px py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo size={30} withText glow={false} textClassName="text-lg text-aw-text" />
            <p className="mt-4 text-[15px] text-aw-muted leading-relaxed">
              {t(
                "Le réseau de l'information où chaque source est visible.",
                'The information network where every source is visible.'
              )}
            </p>
            <a
              href="https://instagram.com/actuworld_fr"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-[15px] font-semibold text-aw-primary hover:underline underline-offset-4"
            >
              Instagram @actuworld_fr
            </a>
          </div>

          <nav aria-label={t('Explorer', 'Explore')}>
            <h2 className="text-sm font-semibold text-aw-text mb-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              {t('Explorer', 'Explore')}
            </h2>
            <ul className="space-y-2.5 text-[15px]">
              {explore.map((l) => (
                <li key={l.to}><Link to={l.to} className={linkCls}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('Informations légales', 'Legal')}>
            <h2 className="text-sm font-semibold text-aw-text mb-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              {t('Légal', 'Legal')}
            </h2>
            <ul className="space-y-2.5 text-[15px]">
              {legal.map((l) => (
                <li key={l.to}><Link to={l.to} className={linkCls}>{l.label}</Link></li>
              ))}
              <li>
                <button type="button" onClick={() => resetConsent()} className={linkCls}>
                  {t('Gérer les cookies', 'Cookie settings')}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-12 pt-6 border-t border-aw caption text-aw-muted">
          © {year} ActuWorld
        </p>
      </div>
    </footer>
  );
};
