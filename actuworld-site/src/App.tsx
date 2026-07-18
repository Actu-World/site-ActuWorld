import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { StudioNavbar } from './components/studio/StudioNavbar';
import { Footer } from './components/Footer';
import { PageLoader } from './components/ui/PageLoader';
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
const StudioLoginPage = lazy(() => import('./pages/studio/StudioLoginPage'));
const StudioEditorPage = lazy(() => import('./pages/studio/StudioEditorPage'));
const StudioPostPage = lazy(() => import('./pages/studio/StudioPostPage'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Environnement Studio : navbar dédiée, pas de footer ni d'habillage
  // « site vitrine » (barre de progression, retour en haut).
  const isStudio = location.pathname === '/studio' || location.pathname.startsWith('/studio/');

  // Initialize Google Analytics
  useGoogleAnalytics();

  // Initial page loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageLoader isLoading={isLoading} />
      {!isStudio && <ScrollProgress />}
      <ScrollToTop />
      {isStudio ? <StudioNavbar /> : <Navbar />}
      <main className="overflow-x-clip">
        <Suspense fallback={<PageLoader isLoading={true} />}>
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
            <Route path="/partenaires" element={<PartnersPage />} />
            <Route path="/studio" element={<StudioLoginPage />} />
            <Route path="/studio/editeur" element={<StudioEditorPage />} />
            <Route path="/studio/post" element={<StudioPostPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
        </Suspense>
      </main>
      {!isStudio && <Footer />}
      {!isStudio && <BackToTop />}
      <CookieBanner />
    </>
  );
}
