import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for calculator logic
 * @param {Function} [onCalculate] - Callback when calculation is performed
 * @returns {Object} Calculator state and operations
 */
export function useCalculator(onCalculate) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');

  const calculateRef = useRef((firstValue, secondValue, op) => {
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

  const inputDigit = useCallback((digit) => {
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

  const performOperation = useCallback((nextOperator) => {
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
