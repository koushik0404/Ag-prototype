import React, { useState } from 'react';
import { Button } from '../../components/Button';

interface PinScreenProps {
  onSuccess: () => void;
}

export const PinScreen: React.FC<PinScreenProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');

  return (
    <div className="px-4 flex flex-col items-center justify-center gap-6 py-12">
      <div className="text-center">
        <h2 className="text-sm font-bold text-emerald-100 mb-1">Enter UPI PIN</h2>
        <p className="text-xs text-slate-400">Secure payment authorization</p>
      </div>
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-10 h-10 rounded-xl border border-emerald-700 flex items-center justify-center text-lg ${pin.length >= i ? 'bg-emerald-900 text-white' : 'bg-[#0f2d1e]'}`}>
            {pin.length >= i ? '•' : ''}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((val) => (
          <button
            key={val}
            onClick={() => {
              if (val === 'C') setPin('');
              else if (val === '✓') onSuccess();
              else if (pin.length < 4) setPin(pin + val);
            }}
            className="bg-[#0f2d1e] hover:bg-emerald-950 text-emerald-200 py-3 rounded-xl font-bold border border-emerald-900 text-sm"
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};