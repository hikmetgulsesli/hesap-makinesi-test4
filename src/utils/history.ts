/**
 * History Management Module
 * Handles saving, loading, and managing calculation history
 */

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

const STORAGE_KEY = 'calculator-history';
const MAX_HISTORY_ITEMS = 5;

/**
 * Generates a unique ID for history items
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Loads history from localStorage
 */
export function loadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as HistoryItem[];
      // Validate the structure
      if (Array.isArray(parsed)) {
        return parsed.filter(item => 
          item && 
          typeof item.id === 'string' && 
          typeof item.expression === 'string' && 
          typeof item.result === 'string'
        );
      }
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }
  
  return [];
}

/**
 * Saves history to localStorage
 */
export function saveHistory(history: HistoryItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

/**
 * Adds a new item to history
 */
export function addToHistory(
  history: HistoryItem[], 
  expression: string, 
  result: string
): HistoryItem[] {
  const newItem: HistoryItem = {
    id: generateId(),
    expression,
    result,
    timestamp: Date.now()
  };
  
  // Add to beginning and limit to max items
  const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  
  // Save to localStorage
  saveHistory(updated);
  
  return updated;
}

/**
 * Removes a specific item from history
 */
export function removeFromHistory(history: HistoryItem[], id: string): HistoryItem[] {
  const updated = history.filter(item => item.id !== id);
  saveHistory(updated);
  return updated;
}

/**
 * Clears all history
 */
export function clearHistory(): HistoryItem[] {
  saveHistory([]);
  return [];
}

/**
 * Formats a timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  // Turkish locale formatting
  if (diffMins < 1) {
    return 'Az önce';
  } else if (diffMins < 60) {
    return `${diffMins} dk önce`;
  } else if (diffHours < 24) {
    return `${diffHours} saat önce`;
  } else if (diffDays < 7) {
    return `${diffDays} gün önce`;
  } else {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

/**
 * Gets the display date for a history item
 */
export function getDisplayDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Gets the display time for a history item
 */
export function getDisplayTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}