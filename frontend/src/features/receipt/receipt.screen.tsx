import React from 'react';
import { Stepper } from '../../components/Stepper';
import { Button } from '../../components/Button';

interface ReceiptScreenProps {
  store: any;
  onHome: () => void;
}

export const ReceiptScreen: React.FC<ReceiptScreenProps> = ({ store, onHome }) => {
  return (
    <div className="px-4 flex flex-col gap-4 py-3">
      <Stepper step={2} />
      <div className="bg-[#0f2d1e] rounded-xl border border-emerald-900 overflow-hidden">
        <div className="bg-[#133d27] px-4 py-2.5 flex justify-between items-center border-b border-emerald-800">
          <span className="text-xs font-bold text-emerald-100">Warehouse receipt</span>
          <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">✓ Active</span>
        </div>
        <div className="p-4 flex flex-col gap-3 text-xs">
          <div className="flex justify-between border-b border-emerald-900/50 pb-2">
            <span className="text-slate-400">{store.name}</span>
            <span className="font-semibold text-emerald-100">Guntur</span>
          </div>
          <div className="flex justify-between border-b border-emerald-900/50 pb-2">
            <span className="text-slate-400">Crop</span>
            <span className="font-semibold text-emerald-100">Dry chilli (20 q)</span>
          </div>
          <div className="flex justify-between border-b border-emerald-900/50 pb-2">
            <span className="text-slate-400">Insurance</span>
            <span className="font-semibold text-emerald-100">₹80,000/t</span>
          </div>
          <div className="flex justify-between border-b border-emerald-900/50 pb-2">
            <span className="text-slate-400">Advance paid</span>
            <span className="font-semibold text-emerald-100">₹{Math.round((store.total || 2280) * 0.1)}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-slate-400">Receipt No.</span>
            <span className="font-mono font-bold text-emerald-300">GDM-2026-0418</span>
          </div>
        </div>
      </div>
      <Button variant="secondary" onClick={onHome}>Book another slot</Button>
    </div>
  );
};