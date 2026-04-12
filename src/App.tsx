import { useState, useCallback, useEffect, useReducer } from 'react';
import type { HistoryItem } from './utils/history';
import type { CalculatorState, Operator } from './utils/calculator';
import {
  initialState,
  inputDigit,
  inputDecimal,
  inputOperator,
  performCalculation,
  clearAll,
  clearEntry,
  backspace,
  percentage
} from './utils/calculator';
import {
  loadHistory,
  addToHistory,
  clearHistory,
  getDisplayDate,
  getDisplayTime
} from './utils/history';
import { getActionFromKey, isMobileViewport } from './utils';

interface ButtonProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'equal' | 'clear' | 'function';
  className?: string;
  ariaLabel?: string;
}

const Button = ({ label, onClick, variant = 'default', className = '', ariaLabel }: ButtonProps) => {
  const baseClasses = 'h-16 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-100 active:scale-95 select-none';
  
  const variantClasses = {
    default: 'bg-surface-container-highest text-on-surface hover:bg-white/5',
    operator: 'bg-secondary-container text-on-secondary-container hover:brightness-110 text-2xl',
    equal: 'bg-tertiary-container text-white hover:brightness-110 text-2xl shadow-lg shadow-tertiary-container/20',
    clear: 'bg-error-container text-on-error-container hover:brightness-110',
    function: 'bg-surface-container-highest text-on-surface hover:bg-white/5'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
    >
      {label}
    </button>
  );
};

// Action types for reducer
type CalculatorAction =
  | { type: 'DIGIT'; payload: string }
  | { type: 'DECIMAL' }
  | { type: 'OPERATOR'; payload: Operator }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ENTRY' }
  | { type: 'BACKSPACE' }
  | { type: 'PERCENTAGE' }
  | { type: 'SET_STATE'; payload: CalculatorState };

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'DIGIT':
      return inputDigit(state, action.payload);
    case 'DECIMAL':
      return inputDecimal(state);
    case 'OPERATOR':
      return inputOperator(state, action.payload);
    case 'EQUALS': {
      const result = performCalculation(state);
      return result ? result.state : state;
    }
    case 'CLEAR':
      return clearAll();
    case 'CLEAR_ENTRY':
      return clearEntry(state);
    case 'BACKSPACE':
      return backspace(state);
    case 'PERCENTAGE':
      return percentage(state);
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Initialize history from localStorage using lazy state initialization
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());
  const [showHistory, setShowHistory] = useState(true);
  const [isMobile, setIsMobile] = useState(() => isMobileViewport());
  
  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileViewport());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle equals with history
  const handleEquals = useCallback(() => {
    const result = performCalculation(state);
    if (result) {
      dispatch({ type: 'SET_STATE', payload: result.state });
      const newHistory = addToHistory(history, result.expression, result.result);
      setHistory(newHistory);
    }
  }, [state, history]);

  // Keyboard support
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const action = getActionFromKey(event.key);
    
    if (!action) return;
    
    event.preventDefault();
    
    switch (action) {
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        dispatch({ type: 'DIGIT', payload: action });
        break;
      case 'decimal':
        dispatch({ type: 'DECIMAL' });
        break;
      case '+':
        dispatch({ type: 'OPERATOR', payload: '+' });
        break;
      case '−':
        dispatch({ type: 'OPERATOR', payload: '−' });
        break;
      case '×':
        dispatch({ type: 'OPERATOR', payload: '×' });
        break;
      case '÷':
        dispatch({ type: 'OPERATOR', payload: '÷' });
        break;
      case '=':
        handleEquals();
        break;
      case 'clear':
        dispatch({ type: 'CLEAR' });
        break;
      case 'backspace':
        dispatch({ type: 'BACKSPACE' });
        break;
      case '%':
        dispatch({ type: 'PERCENTAGE' });
        break;
    }
  }, [handleEquals]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleClearHistory = useCallback(() => {
    setHistory(clearHistory());
  }, []);

  const handleHistoryItemClick = useCallback((item: HistoryItem) => {
    dispatch({ 
      type: 'SET_STATE', 
      payload: { 
        ...state, 
        display: item.result, 
        waitingForOperand: true,
        expression: ''
      } 
    });
  }, [state]);

  const { display, expression } = state;

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden">
      {/* Header */}
      <header className="bg-[#0c1322] flex justify-between items-center w-full px-6 py-4 z-20">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-slate-100 font-[family-name:var(--font-headline)]">
            Hesap Makinesi
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => dispatch({ type: 'CLEAR' })}
            className="text-blue-600 dark:text-blue-500 hover:bg-[#141b2b] transition-colors active:scale-95 duration-100 px-3 py-1 rounded-lg text-sm font-bold"
          >
            Temizle
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-slate-400 hover:bg-[#141b2b] transition-colors active:scale-95 duration-100 p-2 rounded-full"
            aria-label="Geçmiş"
          >
            <span className="material-symbols-outlined">history</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 relative overflow-hidden">
        {/* Calculator Area */}
        <div className={`flex-1 flex flex-col items-center justify-center p-6 transition-all duration-300 ${showHistory && !isMobile ? 'md:pr-80' : ''}`}>
          <div className="w-full max-w-md flex flex-col gap-6">
            {/* Display Area */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 flex flex-col items-end justify-end shadow-inner h-48 border border-white/5">
              <span className="text-outline font-[family-name:var(--font-headline)] text-lg tracking-wider mb-2 opacity-60">
                {expression || '\u00A0'}
              </span>
              <h1 className="text-on-surface font-[family-name:var(--font-headline)] text-6xl font-bold tracking-tight">
                {display}
              </h1>
            </div>

            {/* Keypad Area */}
            <div className="bg-surface-container-low p-4 rounded-[2rem] grid grid-cols-4 gap-4">
              {/* Row 1 */}
              <Button 
                label="C" 
                onClick={() => dispatch({ type: 'CLEAR_ENTRY' })} 
                variant="clear"
                ariaLabel="Temizle"
              />
              <Button 
                label={<span className="material-symbols-outlined">backspace</span>} 
                onClick={() => dispatch({ type: 'BACKSPACE' })} 
                variant="clear"
                ariaLabel="Geri Al"
              />
              <Button 
                label="%" 
                onClick={() => dispatch({ type: 'PERCENTAGE' })} 
                variant="function"
                ariaLabel="Yüzde"
              />
              <Button 
                label="÷" 
                onClick={() => dispatch({ type: 'OPERATOR', payload: '÷' })} 
                variant="operator"
                ariaLabel="Bölme"
              />

              {/* Row 2 */}
              <Button label="7" onClick={() => dispatch({ type: 'DIGIT', payload: '7' })} />
              <Button label="8" onClick={() => dispatch({ type: 'DIGIT', payload: '8' })} />
              <Button label="9" onClick={() => dispatch({ type: 'DIGIT', payload: '9' })} />
              <Button 
                label="×" 
                onClick={() => dispatch({ type: 'OPERATOR', payload: '×' })} 
                variant="operator"
                ariaLabel="Çarpma"
              />

              {/* Row 3 */}
              <Button label="4" onClick={() => dispatch({ type: 'DIGIT', payload: '4' })} />
              <Button label="5" onClick={() => dispatch({ type: 'DIGIT', payload: '5' })} />
              <Button label="6" onClick={() => dispatch({ type: 'DIGIT', payload: '6' })} />
              <Button 
                label="−" 
                onClick={() => dispatch({ type: 'OPERATOR', payload: '−' })} 
                variant="operator"
                ariaLabel="Çıkarma"
              />

              {/* Row 4 */}
              <Button label="1" onClick={() => dispatch({ type: 'DIGIT', payload: '1' })} />
              <Button label="2" onClick={() => dispatch({ type: 'DIGIT', payload: '2' })} />
              <Button label="3" onClick={() => dispatch({ type: 'DIGIT', payload: '3' })} />
              <Button 
                label="+" 
                onClick={() => dispatch({ type: 'OPERATOR', payload: '+' })} 
                variant="operator"
                ariaLabel="Toplama"
              />

              {/* Row 5 */}
              <Button 
                label="0" 
                onClick={() => dispatch({ type: 'DIGIT', payload: '0' })} 
                className="col-span-2"
              />
              <Button 
                label="," 
                onClick={() => dispatch({ type: 'DECIMAL' })} 
                ariaLabel="Ondalık"
              />
              <Button 
                label="=" 
                onClick={handleEquals} 
                variant="equal"
                ariaLabel="Hesapla"
              />
            </div>

            {/* Mode Switcher */}
            <div className="flex justify-center gap-8 mt-4">
              <button className="text-outline hover:text-primary transition-colors flex flex-col items-center gap-1">
                <span className="material-symbols-outlined">calculate</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Temel</span>
              </button>
              <button className="text-outline hover:text-primary transition-colors flex flex-col items-center gap-1">
                <span className="material-symbols-outlined">functions</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Bilimsel</span>
              </button>
              <button className="text-outline hover:text-primary transition-colors flex flex-col items-center gap-1">
                <span className="material-symbols-outlined">currency_exchange</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Birim</span>
              </button>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <aside className="hidden md:flex bg-[#323949]/80 backdrop-blur-xl fixed right-0 h-full w-80 flex-col p-6 shadow-[-20px_0_40px_rgba(7,14,29,0.4)] border-l border-white/5 z-10 transition-all duration-300 ease-in-out">
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white font-[family-name:var(--font-headline)]">Geçmiş</h2>
              <p className="text-sm text-slate-400">Son İşlemler</p>
            </div>
            
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  Henüz işlem yok
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col items-end p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => handleHistoryItemClick(item)}
                  >
                    <span className="text-xs text-outline mb-1">
                      {getDisplayDate(item.timestamp)}, {getDisplayTime(item.timestamp)}
                    </span>
                    <span className="text-slate-400 text-sm">{item.expression}</span>
                    <span className="text-white font-bold text-lg">= {item.result}</span>
                  </div>
                ))
              )}
            </div>
            
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="mt-4 text-sm text-error hover:text-error/80 transition-colors"
              >
                Geçmişi Temizle
              </button>
            )}
            
            <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-2">
              <button className="flex items-center gap-3 text-slate-300 hover:bg-white/10 p-3 rounded-xl transition-all">
                <span className="material-symbols-outlined">settings</span>
                <span className="text-sm font-medium">Ayarlar</span>
              </button>
            </div>
          </aside>
        )}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden flex justify-around items-center bg-[#070e1d] py-4 border-t border-white/5">
        <button className="flex flex-col items-center gap-1 text-blue-500">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calculate</span>
          <span className="text-[10px] font-bold">Hesapla</span>
        </button>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={`flex flex-col items-center gap-1 ${showHistory ? 'text-blue-500' : 'text-slate-400'}`}
        >
          <span className="material-symbols-outlined">history</span>
          <span className="text-[10px] font-bold">Geçmiş</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold">Ayarlar</span>
        </button>
      </nav>
    </div>
  );
}

export default App;