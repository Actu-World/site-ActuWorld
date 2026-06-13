import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'fr' | 'en';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  isEnglish: boolean;
};

const STORAGE_KEY = 'actuworld-language';

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem(STORAGE_KEY);
      if (storedLanguage === 'fr' || storedLanguage === 'en') {
        return storedLanguage;
      }
    }

    // Site francophone (.fr) : français par défaut.
    // L'anglais reste disponible via le sélecteur FR/EN.
    return 'fr';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: setLanguageState,
    toggleLanguage: () => setLanguageState((current) => (current === 'fr' ? 'en' : 'fr')),
    isEnglish: language === 'en',
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
