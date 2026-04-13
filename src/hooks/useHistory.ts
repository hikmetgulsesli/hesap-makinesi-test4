import { useState, useEffect, useCallback } from 'react';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp?: number;
}

export interface UseHistoryReturn {
  history: HistoryItem[];
  addToHistory: (expression: string, result: string) => void;
  clearHistory: () => void;
  loadHistoryItem: (item: HistoryItem) => string;
}

const STORAGE_KEY = 'calculator-history';
const MAX_HISTORY_ITEMS = 5;

function loadHistoryFromStorage(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as HistoryItem[];
    } catch {
      return [];
    }
  }
  return [];
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>(loadHistoryFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((expression: string, result: string) => {
    setHistory((prev) => {
      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        expression,
        result,
        timestamp: Date.now(),
      };
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const loadHistoryItem = useCallback((item: HistoryItem): string => {
    return item.result;
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    loadHistoryItem,
  };
}
