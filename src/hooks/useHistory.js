import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'calculator-history';
const MAX_HISTORY_ITEMS = 5;

/**
 * Load history from localStorage
 * @returns {Array} Array of history items
 */
function loadHistoryFromStorage() {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Custom hook for managing calculator history
 * @returns {Object} History state and operations
 */
export function useHistory() {
  const [history, setHistory] = useState(loadHistoryFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((expression, result) => {
    setHistory((prev) => {
      const newItem = {
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

  const loadHistoryItem = useCallback((item) => {
    return item.result;
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    loadHistoryItem,
  };
}
