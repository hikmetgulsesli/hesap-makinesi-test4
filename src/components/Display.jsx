import { useState, useCallback, useEffect, useRef } from 'react';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

export interface DisplayProps {
  value: string;
  expression?: string;
  error?: boolean;
}

export function Display({ value, expression = '', error = false }: DisplayProps) {
  return (
    <div className={`bg-surface-container-lowest rounded-3xl p-8 flex flex-col items-end justify-end shadow-inner h-48 border border-white/5 ${error ? 'border-error/30' : ''}`}>
      <span className="text-outline font-[family-name:var(--font-headline)] text-lg tracking-wider mb-2 opacity-60">
        {expression || '\u00A0'}
      </span>
      <h1 className={`font-[family-name:var(--font-headline)] text-6xl font-bold tracking-tight ${error ? 'text-error' : 'text-on-surface'}`}>
        {value}
      </h1>
      {error && (
        <div className="mt-4 px-3 py-1 bg-error-container text-on-error-container text-xs font-bold rounded-full uppercase tracking-widest">
          Hata Durumu
        </div>
      )}
    </div>
  );
}
