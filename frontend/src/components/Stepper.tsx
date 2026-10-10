import React from 'react';

interface StepperProps {
  step: number;
}

export const Stepper: React.FC<StepperProps> = ({ step }) => {
  return (
    <div className="flex items-center justify-between px-6 py-2 bg-[#0f2d1e] rounded-xl border border-emerald-900 my-2">
      <div className="flex flex-col items-center">
        <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-900 text-emerald-400'}`}>
          {step > 1 ? '✓' : '1'}
        </span>
        <span className="text-[10px] text-emerald-300 mt-1">Book</span>
      </div>
      <div className={`flex-1 h-0.5 mx-2 ${step > 1 ? 'bg-emerald-600' : 'bg-emerald-700'}`}></div>
      <div className="flex flex-col items-center">
        <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-emerald-900 text-emerald-400 border border-emerald-600'}`}>
          {step > 2 ? '✓' : '2'}
        </span>
        <span className="text-[10px] text-slate-400 mt-1">Hold</span>
      </div>
    </div>
  );
};