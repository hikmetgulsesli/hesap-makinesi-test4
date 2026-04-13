import { useHistory } from '../hooks/useHistory';
import { HistoryItem } from './HistoryItem';

export function HistoryPanel({ onHistoryItemClick, onClearHistory }) {
  const { history, clearHistory } = useHistory();

  const handleClear = () => {
    clearHistory();
    onClearHistory?.();
  };

  const handleItemClick = (result) => {
    onHistoryItemClick?.(result);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <aside className="hidden md:flex bg-surface-bright/80 backdrop-blur-xl fixed right-0 h-full w-80 flex-col p-6 shadow-[-20px_0_40px_rgba(7,14,29,0.4)] border-l border-white/5 z-10 transition-all duration-300 ease-in-out">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white font-[family-name:var(--font-headline)]">
          Geçmiş
        </h2>
        <p className="text-sm text-slate-400">Son İşlemler</p>
      </div>
      
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-outline text-5xl opacity-40">
                history_toggle_off
              </span>
            </div>
            <h3 className="text-on-surface text-base font-bold mb-2">
              Henüz işlem yapılmadı
            </h3>
            <p className="text-outline text-sm leading-relaxed">
              Yaptığınız hesaplamalar burada listelenecektir.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <HistoryItem
              key={item.id}
              expression={item.expression}
              result={item.result}
              date={formatDate(item.timestamp)}
              onClick={() => handleItemClick(item.result)}
            />
          ))
        )}
      </div>
      
      <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-2">
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-3 text-slate-300 hover:bg-white/10 p-3 rounded-xl transition-all w-full"
          >
            <span className="material-symbols-outlined text-error">delete</span>
            <span className="text-sm font-medium">Geçmişi Temizle</span>
          </button>
        )}
        <button className="flex items-center gap-3 text-slate-300 hover:bg-white/10 p-3 rounded-xl transition-all w-full">
          <span className="material-symbols-outlined text-primary">settings</span>
          <span className="text-sm font-medium">Ayarlar</span>
        </button>
      </div>
    </aside>
  );
}
