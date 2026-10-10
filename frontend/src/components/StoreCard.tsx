import React from 'react';

interface StoreCardProps {
  store: { name: string; location: string; rate: number; tag: string };
  onReserve: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onReserve }) => {
  return (
    <div className="bg-[#0f2d1e] p-3.5 rounded-xl border border-emerald-900 flex flex-col gap-2.5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-emerald-100">{store.name}</h3>
          <p className="text-[11px] text-slate-400">{store.location}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-extrabold text-emerald-200">₹{store.rate}</span>
          <p className="text-[9px] text-slate-400">per quintal</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-emerald-900/50">
        <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-900/50 text-emerald-300">{store.tag}</span>
        <button onClick={onReserve} className="bg-[#1b5237] hover:bg-[#226845] text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow">
          Reserve
        </button>
      </div>
    </div>
  );
};