import { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../data/languages';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setCurrentLanguage(langCode);
    localStorage.setItem('punyakoti_lang', langCode);
  };

  useEffect(() => {
    const storedLang = localStorage.getItem('punyakoti_lang');
    if (storedLang && storedLang !== currentLanguage) {
      changeLanguage(storedLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
