import type { ReactNode } from 'react';

export interface OperationButtonProps {
  label: string | ReactNode;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'equal' | 'clear';
  className?: string;
  ariaLabel?: string;
}

export function OperationButton({ 
  label, 
  onClick, 
  variant = 'default', 
  className = '',
  ariaLabel 
}: OperationButtonProps) {
  const variantClasses = {
    default: 'bg-surface-container-highest text-on-surface hover:bg-white/5',
    operator: 'bg-secondary-container text-on-secondary-container hover:brightness-110',
    equal: 'bg-tertiary-container text-white hover:brightness-110 shadow-lg shadow-tertiary-container/20',
    clear: 'bg-error-container text-on-error-container hover:brightness-110',
  };

  return (
    <button
      onClick={onClick}
      className={`h-16 rounded-xl flex items-center justify-center font-bold text-xl active:scale-95 transition-all ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
    >
      {label}
    </button>
  );
}
