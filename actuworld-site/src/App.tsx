import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { StudioNavbar } from './components/studio/StudioNavbar';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { BackToTop } from './components/ui/BackToTop';
import { CookieBanner } from './components/ui/CookieBanner';
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';

const HomePage = lazy(() => import('./pages/HomePage'));
const AppPage = lazy(() => import('./pages/AppPage'));
const RecoSrcPage = lazy(() => import('./pages/RecoSrcPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PressPage = lazy(() => import('./pages/PressPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LegalNoticePage = lazy(() => import('./pages/LegalNoticePage'));
const PartnersPage = lazy(() => import('./pages/PartnersPage'));
const AccountDeletionPage = lazy(() => import('./pages/AccountDeletionPage'));
const ChildSafetyPage = lazy(() => import('./pages/ChildSafetyPage'));
const OpenInAppPage = lazy(() => import('./pages/OpenInAppPage'));
const StudioLoginPage = lazy(() => import('./pages/studio/StudioLoginPage'));
const StudioEditorPage = lazy(() => import('./pages/studio/StudioEditorPage'));
const StudioPostPage = lazy(() => import('./pages/studio/StudioPostPage'));
const StudioRedactionPage = lazy(() => import('./pages/studio/StudioRedactionPage'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Ancre (ex. /#rejoindre) : on attend que la page lazy soit montée
      let tries = 0;
      const id = window.setInterval(() => {
        const el = document.getElementById(hash.slice(1));
        if (el || ++tries > 20) {
          window.clearInterval(id);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      return () => window.clearInterval(id);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const location = useLocation();

  // Environnement Studio : navbar dédiée, pas de footer ni d'habillage
  // « site vitrine » (barre de progression, retour en haut).
  const isStudio = location.pathname === '/studio' || location.pathname.startsWith('/studio/');

  // Initialize Google Analytics
  useGoogleAnalytics();

  return (
    <MotionConfig reducedMotion="user">
      {!isStudio && (
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
      )}
      {!isStudio && <ScrollProgress />}
      <ScrollToTop />
      {isStudio ? <StudioNavbar /> : <Navbar />}
      <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
        <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/reco-src" element={<RecoSrcPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/mentions-legales" element={<LegalNoticePage />} />
            <Route path="/suppression-compte" element={<AccountDeletionPage />} />
            <Route path="/securite-enfants" element={<ChildSafetyPage />} />
            <Route path="/child-safety" element={<ChildSafetyPage />} />
            <Route path="/partenaires" element={<PartnersPage />} />
            {/* Atterrissage des liens partagés depuis l'app (deep links actuworld.fr). */}
            <Route path="/post/:id" element={<OpenInAppPage kind="post" />} />
            <Route path="/journal/:id" element={<OpenInAppPage kind="journal" />} />
            <Route path="/messages/:id" element={<OpenInAppPage kind="messages" />} />
            <Route path="/u/:username" element={<OpenInAppPage kind="user" />} />
            <Route path="/tag/:slug" element={<OpenInAppPage kind="tag" />} />
            <Route path="/studio" element={<StudioLoginPage />} />
            <Route path="/studio/editeur" element={<StudioEditorPage />} />
            <Route path="/studio/post" element={<StudioPostPage />} />
            <Route path="/studio/redaction" element={<StudioRedactionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
        </Suspense>
      </main>
      {!isStudio && <Footer />}
      {!isStudio && <BackToTop />}
      <CookieBanner />
    </MotionConfig>
  );
}
