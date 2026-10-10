import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-5 h-5' }) => {
  const icons: Record<string, string> = {
    warehouse: '📦',
    cold: '❄️',
    map: '🗺️',
    location: '📍',
    crop: '🌱',
    scale: '⚖️',
    calendar: '📅',
    search: '🔍',
  };

  return <span className={className}>{icons[name] || '📌'}</span>;
};