import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('te') ? 'en' : 'te';
    i18n.changeLanguage(newLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="fixed top-6 right-6 z-[100] w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md border border-border-dusty/30 flex items-center justify-center text-primary font-bold hover:scale-105 transition-all text-sm uppercase tracking-wider"
      title="Switch Language"
    >
      {i18n.language.startsWith('te') ? 'EN' : 'TE'}
    </button>
  );
}
