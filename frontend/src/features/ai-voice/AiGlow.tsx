import React from 'react';

export const AiGlow: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center p-6">
      <div className="absolute w-28 h-28 bg-emerald-500/20 rounded-full animate-ping"></div>
      <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-emerald-400">
        🎙️
      </div>
    </div>
  );
};