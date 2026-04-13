import { useState, useCallback, useEffect, useRef } from 'react';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

interface ButtonProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'equal' | 'clear';
  className?: string;
}

const Button = ({ label, onClick, variant = 'default', className = '' }: ButtonProps) => {
  const baseClasses = 'p-6 rounded-xl font-bold text-xl transition-all duration-100 active:scale-95';
  
  const variantClasses = {
    default: 'bg-surface-variant text-on-surface hover:bg-white/10',
    operator: 'bg-secondary-container text-on-secondary-container hover:brightness-110',
    equal: 'bg-tertiary-container text-on-tertiary-container hover:brightness-110',
    clear: 'text-primary hover:bg-surface-container-low'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={typeof label === 'string' ? label : undefined}
    >
      {label}
    </button>
  );
};

// Load history from localStorage
const loadHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('calculator-history');
  if (saved) {
    try {
      return JSON.parse(saved) as HistoryItem[];
    } catch {
      return [];
    }
  }
  return [];
};

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);
  const [showHistory, setShowHistory] = useState(true);

  // Use ref for calculate function to avoid dependency issues
  const calculateRef = useRef<(firstValue: number, secondValue: number, op: string | null) => number>((firstValue, secondValue, op) => {
    switch (op) {
      case '+':
        return firstValue + secondValue;
      case '−':
      case '-':
        return firstValue - secondValue;
      case '×':
      case '*':
        return firstValue * secondValue;
      case '÷':
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculator-history', JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((expr: string, result: string) => {
    setHistory(prev => {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression: expr,
        result: result
      };
      const updated = [newItem, ...prev].slice(0, 5);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
  }, []);

  const inputDigit = useCallback((digit: string) => {
    setDisplay(prev => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return digit;
      }
      return prev === '0' ? digit : prev + digit;
    });
  }, [waitingForOperand]);

  const inputDecimal = useCallback(() => {
    setDisplay(prev => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return '0.';
      }
      if (prev.indexOf('.') === -1) {
        return prev + '.';
      }
      return prev;
    });
  }, [waitingForOperand]);

  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setExpression(`${display} ${nextOperator}`);
    } else {
      const currentValue = previousValue || 0;
      const newValue = calculateRef.current(currentValue, inputValue, operator);

      setPreviousValue(newValue);
      setDisplay(String(newValue));
      setExpression(`${newValue} ${nextOperator}`);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  }, [display, operator, previousValue]);

  const performCalculation = useCallback(() => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operator) {
      const newValue = calculateRef.current(previousValue, inputValue, operator);
      const expr = `${previousValue} ${operator} ${inputValue}`;
      const result = String(newValue);
      
      addToHistory(expr, result);
      setDisplay(result);
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      setExpression('');
    }
  }, [display, operator, previousValue, addToHistory]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;

    if (/^[0-9]$/.test(key)) {
      inputDigit(key);
    } else if (key === '.') {
      inputDecimal();
    } else if (key === '+' || key === '-') {
      performOperation(key === '+' ? '+' : '−');
    } else if (key === '*') {
      performOperation('×');
    } else if (key === '/') {
      event.preventDefault();
      performOperation('÷');
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      performCalculation();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      clearAll();
    }
  }, [inputDigit, inputDecimal, performOperation, performCalculation, clearAll]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-6 py-4 bg-surface-container-lowest shadow-none">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-on-surface font-[family-name:var(--font-headline)] tracking-tight">
            Hesap Makinesi
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={clearAll}
            className="text-primary font-[family-name:var(--font-headline)] text-lg font-bold tracking-tight hover:bg-surface-container-low transition-colors active:scale-95 duration-100 px-3 py-1 rounded-lg"
          >
            Temizle
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95 duration-100 p-2 rounded-lg"
            aria-label="Geçmiş"
          >
            <span className="material-symbols-outlined">history</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 flex overflow-hidden">
        {/* Calculator Area */}
        <div className="flex-grow flex flex-col p-8 bg-surface-container-lowest">
          {/* Display */}
          <div className="mt-auto text-right space-y-2">
            <div className="text-outline font-[family-name:var(--font-headline)] text-2xl opacity-60">
              {expression || '\u00A0'}
            </div>
            <div className="text-on-surface font-[family-name:var(--font-headline)] text-7xl font-bold tracking-tighter">
              {display}
            </div>
          </div>

          {/* Keypad */}
          <div className="mt-12 grid grid-cols-4 gap-4 max-w-md ml-auto">
            <Button label="7" onClick={() => inputDigit('7')} />
            <Button label="8" onClick={() => inputDigit('8')} />
            <Button label="9" onClick={() => inputDigit('9')} />
            <Button label="÷" onClick={() => performOperation('÷')} variant="operator" />
            
            <Button label="4" onClick={() => inputDigit('4')} />
            <Button label="5" onClick={() => inputDigit('5')} />
            <Button label="6" onClick={() => inputDigit('6')} />
            <Button label="×" onClick={() => performOperation('×')} variant="operator" />
            
            <Button label="1" onClick={() => inputDigit('1')} />
            <Button label="2" onClick={() => inputDigit('2')} />
            <Button label="3" onClick={() => inputDigit('3')} />
            <Button label="−" onClick={() => performOperation('−')} variant="operator" />
            
            <Button label="0" onClick={() => inputDigit('0')} />
            <Button label="." onClick={inputDecimal} />
            <Button label="=" onClick={performCalculation} variant="equal" />
            <Button label="+" onClick={() => performOperation('+')} variant="operator" />
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <aside className="bg-surface-bright/80 backdrop-blur-xl fixed right-0 h-full w-80 shadow-[-20px_0_40px_rgba(7,14,29,0.4)] flex flex-col p-6 z-50">
            <div className="flex flex-col mb-8">
              <h2 className="text-lg font-bold text-on-surface font-[family-name:var(--font-body)]">
                Geçmiş
              </h2>
              <p className="text-sm text-on-surface-variant font-[family-name:var(--font-body)]">
                Son İşlemler
              </p>
            </div>
            
            <div className="flex-grow space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-center text-on-surface-variant py-8">
                  Henüz işlem yok
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="group p-4 rounded-xl transition-all duration-300 ease-in-out hover:bg-white/10 cursor-pointer"
                    onClick={() => {
                      setDisplay(item.result);
                      setWaitingForOperand(true);
                    }}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-primary font-medium">İşlem</span>
                      <span className="text-on-surface-variant text-sm font-[family-name:var(--font-body)]">
                        {item.expression}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-on-surface font-[family-name:var(--font-headline)] text-xl font-bold">
                        {item.result}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-auto pt-6 border-t border-white/5">
              <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer text-on-surface-variant w-full">
                <span className="material-symbols-outlined text-primary">settings</span>
                <span className="text-sm font-medium">Ayarlar</span>
              </button>
            </div>
          </aside>
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="fixed bottom-6 left-6 z-10 md:hidden">
        <div className="flex gap-2 p-2 bg-surface-container-high/90 backdrop-blur-md rounded-full shadow-lg">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-container/20 text-primary">
            <span className="material-symbols-outlined">calculate</span>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`w-12 h-12 flex items-center justify-center rounded-full ${showHistory ? 'text-on-surface' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined">history</span>
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
