import { useEffect } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { NumberButton } from './NumberButton';
import { OperationButton } from './OperationButton';

export function Keypad({ onCalculate, onDisplayChange, onExpressionChange }) {
  const {
    display,
    expression,
    inputDigit,
    inputDecimal,
    performOperation,
    performCalculation,
    clearAll,
  } = useCalculator(onCalculate);

  // Notify parent of display/expression changes
  useEffect(() => {
    onDisplayChange?.(display);
  }, [display, onDisplayChange]);

  useEffect(() => {
    onExpressionChange?.(expression);
  }, [expression, onExpressionChange]);

  const handleBackspace = () => {
    if (display.length > 1) {
      const newValue = display.slice(0, -1);
      // Use setDisplay from hook via a custom clear and re-input approach
      clearAll();
      // Re-input all but last digit
      for (const char of newValue) {
        if (char >= '0' && char <= '9') {
          inputDigit(char);
        } else if (char === '.') {
          inputDecimal();
        }
      }
    } else {
      clearAll();
    }
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    if (!isNaN(value)) {
      const result = value / 100;
      clearAll();
      const resultStr = result.toString();
      for (const char of resultStr) {
        if (char >= '0' && char <= '9') {
          inputDigit(char);
        } else if (char === '.') {
          inputDecimal();
        }
      }
    }
  };

  return (
    <div className="bg-surface-container-low p-4 rounded-[2rem] grid grid-cols-4 gap-4">
      {/* Row 1 */}
      <OperationButton label="C" onClick={clearAll} variant="clear" />
      <OperationButton 
        label={<span className="material-symbols-outlined">backspace</span>} 
        onClick={handleBackspace} 
        variant="clear" 
        ariaLabel="Geri Al"
      />
      <OperationButton label="%" onClick={handlePercent} variant="default" />
      <OperationButton label="÷" onClick={() => performOperation('÷')} variant="operator" />
      
      {/* Row 2 */}
      <NumberButton label="7" onClick={() => inputDigit('7')} />
      <NumberButton label="8" onClick={() => inputDigit('8')} />
      <NumberButton label="9" onClick={() => inputDigit('9')} />
      <OperationButton label="×" onClick={() => performOperation('×')} variant="operator" />
      
      {/* Row 3 */}
      <NumberButton label="4" onClick={() => inputDigit('4')} />
      <NumberButton label="5" onClick={() => inputDigit('5')} />
      <NumberButton label="6" onClick={() => inputDigit('6')} />
      <OperationButton label="−" onClick={() => performOperation('−')} variant="operator" />
      
      {/* Row 4 */}
      <NumberButton label="1" onClick={() => inputDigit('1')} />
      <NumberButton label="2" onClick={() => inputDigit('2')} />
      <NumberButton label="3" onClick={() => inputDigit('3')} />
      <OperationButton label="+" onClick={() => performOperation('+')} variant="operator" />
      
      {/* Row 5 */}
      <NumberButton label="0" onClick={() => inputDigit('0')} className="col-span-2" />
      <NumberButton label="," onClick={inputDecimal} />
      <OperationButton label="=" onClick={performCalculation} variant="equal" />
    </div>
  );
}
