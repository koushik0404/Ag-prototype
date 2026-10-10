import React from 'react';
import { LanguageSwitch } from './LanguageSwitch';

interface HeaderProps {
  lang: string;
  setLang: (l: string) => void;
  onVoiceToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, onVoiceToggle }) => {
  return (
    <div className="bg-[#05110b] px-4 py-3 flex items-center justify-between border-b border-emerald-900/40">
      <div className="flex items-center gap-2">
        <button className="text-slate-300 hover:text-white p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="text-center">
        <h1 className="text-base font-bold tracking-wide text-emerald-100">Storage & Godowns</h1>
        <p className="text-[10px] text-emerald-400 font-medium">Book · Hold</p>
      </div>
      <div className="flex items-center gap-2">
        {onVoiceToggle && (
          <button onClick={onVoiceToggle} className="bg-emerald-900/60 p-1.5 rounded-full border border-emerald-700 text-xs">
            🎙️
          </button>
        )}
        <LanguageSwitch lang={lang} setLang={setLang} />
      </div>
    </div>
  );
};