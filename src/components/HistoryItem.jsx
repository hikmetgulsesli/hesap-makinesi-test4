export interface HistoryItemProps {
  expression: string;
  result: string;
  date?: string;
  onClick?: () => void;
  error?: boolean;
}

export function HistoryItem({ expression, result, date, onClick, error = false }: HistoryItemProps) {
  return (
    <div
      onClick={onClick}
      className={`group flex flex-col items-end p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${error ? 'border-r-2 border-error/50 bg-error/5' : ''}`}
    >
      {date && (
        <span className={`text-xs mb-1 ${error ? 'text-error' : 'text-outline'}`}>
          {date}
        </span>
      )}
      <span className={`text-sm ${error ? 'text-error' : 'text-slate-400'}`}>
        {expression}
      </span>
      <span className={`font-bold text-lg ${error ? 'text-error' : 'text-white'}`}>
        = {result}
      </span>
      {error && (
        <span className="material-symbols-outlined text-error text-sm mt-1">
          warning
        </span>
      )}
    </div>
  );
}
