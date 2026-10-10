import React from 'react';
import { StoreCard } from '../../components/StoreCard';

interface HomeScreenProps {
  stores: any[];
  onSearch: () => void;
  onSelectStore: (store: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ stores, onSelectStore }) => {
  return (
    <div className="px-4 flex flex-col gap-3 py-3">
      <div className="bg-[#0f2d1e] p-3 rounded-xl border border-emerald-900 flex flex-col gap-3 shadow-inner">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <div>
              <p className="text-[10px] text-slate-400">Nearby</p>
              <p className="text-xs font-semibold text-emerald-100">Guntur, Andhra Pradesh</p>
            </div>
          </div>
          <span className="bg-emerald-800 text-emerald-200 text-[10px] px-2 py-1 rounded-md font-medium">Near me</span>
        </div>
        <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-2">
          <span>🌱</span>
          <div>
            <p className="text-[10px] text-slate-400">Crop</p>
            <p className="text-xs font-semibold text-emerald-100">Dry chilli</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-2">
          <span>⚖️</span>
          <div>
            <p className="text-[10px] text-slate-400">Quantity (quintals)</p>
            <p className="text-xs font-semibold text-emerald-100">20</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>📅</span>
          <div>
            <p className="text-[10px] text-slate-400">Period</p>
            <p className="text-xs font-semibold text-emerald-100">3 months</p>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs font-medium text-slate-400 mb-2">Stores near you</p>
        <div className="flex flex-col gap-3">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onReserve={() => onSelectStore(store)} />
          ))}
        </div>
      </div>
    </div>
  );
};