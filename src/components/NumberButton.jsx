export interface NumberButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  className?: string;
}

export function NumberButton({ label, onClick, className = '' }: NumberButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-surface-container-highest text-on-surface h-16 rounded-xl flex items-center justify-center font-bold text-xl hover:bg-white/5 active:scale-95 transition-all ${className}`}
      aria-label={typeof label === 'string' ? label : undefined}
    >
      {label}
    </button>
  );
}

import type { ReactNode } from 'react';
