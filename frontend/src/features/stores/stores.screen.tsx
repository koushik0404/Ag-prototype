import React from 'react';
import { StoreCard } from '../../components/StoreCard';

interface StoresScreenProps {
  stores: any[];
  onSelectStore: (store: any) => void;
}

export const StoresScreen: React.FC<StoresScreenProps> = ({ stores, onSelectStore }) => {
  return (
    <div className="px-4 flex flex-col gap-3 py-3">
      <div className="relative w-full h-56 bg-[#143825] rounded-2xl border border-emerald-800 overflow-hidden flex items-center justify-center shadow-inner">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-10 left-14 bg-emerald-600 text-white p-2 rounded-full text-xs">📍</div>
        <div className="absolute bottom-12 right-16 bg-cyan-600 text-white p-2 rounded-full text-xs">❄️</div>
      </div>
      <p className="text-xs font-medium text-slate-400">Map view - Stores near you</p>
      <div className="flex flex-col gap-3">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} onReserve={() => onSelectStore(store)} />
        ))}
      </div>
    </div>
  );
};