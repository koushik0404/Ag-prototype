import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = 'w-full py-2.5 rounded-xl font-semibold text-xs transition-all shadow';
  const variants = {
    primary: 'bg-[#1b5237] hover:bg-[#206342] text-white border border-emerald-600/40',
    secondary: 'bg-[#153b28] hover:bg-[#1a4732] text-emerald-200 border border-emerald-700/50',
    outline: 'bg-transparent border border-emerald-800 text-emerald-300 hover:bg-emerald-950',
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};