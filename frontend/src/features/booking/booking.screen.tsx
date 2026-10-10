import React from 'react';
import { Stepper } from '../../components/Stepper';
import { Button } from '../../components/Button';

interface BookingScreenProps {
  store: any;
  onPay: () => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({ store, onPay }) => {
  const total = store.total || 2280;
  const advance = Math.round(total * 0.1);

  return (
    <div className="px-4 flex flex-col gap-4 py-3">
      <Stepper step={1} />
      <div className="bg-[#0f2d1e] p-4 rounded-xl border border-emerald-900 flex flex-col gap-3">
        <div className="flex items-center gap-3 border-b border-emerald-900 pb-3">
          <span className="text-xl">❄️</span>
          <div>
            <h3 className="text-xs font-bold text-emerald-100">{store.name}</h3>
            <p className="text-[10px] text-slate-400">Guntur</p>
          </div>
        </div>
        <div className="flex justify-between text-xs py-1 border-b border-emerald-900/40">
          <span className="text-slate-400">Crop</span>
          <span className="font-semibold text-emerald-100">Dry chilli</span>
        </div>
        <div className="flex justify-between text-xs py-1 border-b border-emerald-900/40">
          <span className="text-slate-400">Quantity</span>
          <span className="font-semibold text-emerald-100">20 quintals</span>
        </div>
        <div className="flex justify-between text-xs py-1 border-b border-emerald-900/40">
          <span className="text-slate-400">Storage fee</span>
          <span className="font-semibold text-emerald-100">₹{total}</span>
        </div>
        <div className="flex justify-between text-xs py-2 font-bold text-emerald-300">
          <span>Pay now to hold slot (10%)</span>
          <span>₹{advance}</span>
        </div>
      </div>
      <Button onClick={onPay}>Pay with UPI · ₹{advance}</Button>
    </div>
  );
};