import { useState, useCallback, useRef } from 'react';

export interface UseCalculatorReturn {
  display: string;
  previousValue: number | null;
  operator: string | null;
  waitingForOperand: boolean;
  expression: string;
  inputDigit: (digit: string) => void;
  inputDecimal: () => void;
  performOperation: (nextOperator: string) => void;
  performCalculation: () => number | null;
  clearAll: () => void;
  setDisplay: (value: string | ((prev: string) => string)) => void;
  setWaitingForOperand: (value: boolean) => void;
}

export function useCalculator(
  onCalculate?: (expression: string, result: string) => void
): UseCalculatorReturn {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');

  const calculateRef = useRef((firstValue: number, secondValue: number, op: string | null) => {
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

  const clearAll = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
  }, []);

  const inputDigit = useCallback((digit: string) => {
    setDisplay((prev) => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return digit;
      }
      return prev === '0' ? digit : prev + digit;
    });
  }, [waitingForOperand]);

  const inputDecimal = useCallback(() => {
    setDisplay((prev) => {
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

  const performCalculation = useCallback((): number | null => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operator) {
      const newValue = calculateRef.current(previousValue, inputValue, operator);
      const expr = `${previousValue} ${operator} ${inputValue}`;
      const result = String(newValue);
      
      if (onCalculate) {
        onCalculate(expr, result);
      }
      
      setDisplay(result);
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      setExpression('');
      
      return newValue;
    }
    
    return null;
  }, [display, operator, previousValue, onCalculate]);

  return {
    display,
    previousValue,
    operator,
    waitingForOperand,
    expression,
    inputDigit,
    inputDecimal,
    performOperation,
    performCalculation,
    clearAll,
    setDisplay,
    setWaitingForOperand,
  };
}
