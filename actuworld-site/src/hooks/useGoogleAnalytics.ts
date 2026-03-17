import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook pour initialiser et tracker avec Google Analytics
 * 
 * Configuration:
 * 1. Ajouter en variable d'environnement: VITE_GA_ID=G-YOUR_ID
 * 2. Le hook s'initialise automatiquement au premier chargement
 * 3. Tracking de pages automatique à chaque changement de route
 */
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const useGoogleAnalytics = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Initialiser GA au premier chargement uniquement
    const gaId = import.meta.env.VITE_GA_ID;
    
    if (!gaId) {
      console.warn('⚠️ VITE_GA_ID not configured - Google Analytics disabled');
      return;
    }

    // Script GA (code dédupliqué)
    if (!window.gtag) {
      // Initialiser dataLayer
      window.dataLayer = window.dataLayer || [];
      
      // Fonction gtag
      function gtag(...args: any[]) {
        window.dataLayer?.push(arguments);
      }
      
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', gaId, { 
        'page_path': pathname,
        'anonymize_ip': true 
      });

      // Charger le script GA
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      console.log('✅ Google Analytics initialized:', gaId);
    }
  }, []);

  // Tracker chaque changement de page
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_title: document.title,
      });
      console.log('✅ Page tracked:', pathname);
    }
  }, [pathname]);
};
