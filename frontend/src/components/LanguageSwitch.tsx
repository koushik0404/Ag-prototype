import React from 'react';

interface LanguageSwitchProps {
  lang: string;
  setLang: (l: string) => void;
}

export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ lang, setLang }) => {
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
      className="flex items-center gap-1 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800 text-xs font-bold text-emerald-300"
    >
      {lang === 'en' ? 'EN' : 'తె'}
    </button>
  );
};