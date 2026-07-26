import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (ar: string | undefined, en: string | undefined) => string;
  dir: 'rtl' | 'ltr';
  fontFamily: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  isRTL: true,
  t: (ar) => ar || '',
  dir: 'rtl',
  fontFamily: 'Tajawal, sans-serif',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return localStorage.getItem('sa_language') || 'ar';
    } catch {
      return 'ar';
    }
  });

  const rtlLanguages = ['ar', 'ur', 'fa', 'he', 'ps', 'ug', 'sd'];
  const isRTL = rtlLanguages.includes(language);
  const dir = isRTL ? 'rtl' : 'ltr';
  const fontFamily = isRTL ? 'Tajawal, Cairo, sans-serif' : 'Inter, sans-serif';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sa_language', lang);
    } catch {}
    document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.style.fontFamily = lang === 'ar' ? 'Tajawal, Cairo, sans-serif' : 'Inter, sans-serif';
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.body.style.fontFamily = fontFamily;
  }, [language, isRTL, fontFamily]);

  const t = (ar: string | undefined, en: string | undefined) => {
    if (rtlLanguages.includes(language)) return ar || en || '';
    return en || ar || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t, dir, fontFamily }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
