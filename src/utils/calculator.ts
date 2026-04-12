/**
 * Calculator Logic Module
 * Handles all mathematical operations and calculator state management
 */

export type Operator = '+' | '−' | '×' | '÷' | null;

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operator: Operator;
  waitingForOperand: boolean;
  expression: string;
}

export const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  expression: ''
};

/**
 * Performs the calculation between two values with an operator
 */
export function calculate(firstValue: number, secondValue: number, op: Operator): number {
  switch (op) {
    case '+':
      return firstValue + secondValue;
    case '−':
      return firstValue - secondValue;
    case '×':
      return firstValue * secondValue;
    case '÷':
      return secondValue !== 0 ? firstValue / secondValue : 0;
    default:
      return secondValue;
  }
}

/**
 * Formats a number for display with Turkish locale
 */
export function formatNumber(num: number): string {
  if (!isFinite(num)) return 'Hata';
  if (num === 0) return '0';
  
  // Handle very large or very small numbers
  if (Math.abs(num) > 999999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
    return num.toExponential(6).replace('.', ',');
  }
  
  // Format with Turkish decimal separator (comma)
  const formatted = num.toLocaleString('tr-TR', {
    maximumFractionDigits: 10,
    useGrouping: true
  });
  
  return formatted;
}

/**
 * Parses a display string to a number (handles Turkish formatting)
 */
export function parseDisplayValue(display: string): number {
  // Remove thousand separators and convert decimal comma to dot
  const normalized = display.replace(/\./g, '').replace(',', '.');
  return parseFloat(normalized) || 0;
}

/**
 * Handles digit input
 */
export function inputDigit(currentState: CalculatorState, digit: string): CalculatorState {
  const { display, waitingForOperand } = currentState;
  
  if (waitingForOperand) {
    return {
      ...currentState,
      display: digit,
      waitingForOperand: false
    };
  }
  
  // Prevent multiple leading zeros
  if (display === '0') {
    return {
      ...currentState,
      display: digit
    };
  }
  
  // Limit display length
  if (display.replace(/[.,]/g, '').length >= 15) {
    return currentState;
  }
  
  return {
    ...currentState,
    display: display + digit
  };
}

/**
 * Handles decimal point input
 */
export function inputDecimal(currentState: CalculatorState): CalculatorState {
  const { display, waitingForOperand } = currentState;
  
  if (waitingForOperand) {
    return {
      ...currentState,
      display: '0,',
      waitingForOperand: false
    };
  }
  
  // Check if already has decimal
  if (display.includes(',') || display.includes('.')) {
    return currentState;
  }
  
  return {
    ...currentState,
    display: display + ','
  };
}

/**
 * Handles operator input
 */
export function inputOperator(currentState: CalculatorState, nextOperator: Operator): CalculatorState {
  const { display, previousValue, operator } = currentState;
  const inputValue = parseDisplayValue(display);
  
  if (previousValue === null) {
    return {
      ...currentState,
      previousValue: inputValue,
      operator: nextOperator,
      waitingForOperand: true,
      expression: `${display} ${nextOperator}`
    };
  }
  
  // If we're waiting for operand, just update the operator
  if (currentState.waitingForOperand) {
    return {
      ...currentState,
      operator: nextOperator,
      expression: `${formatNumber(previousValue)} ${nextOperator}`
    };
  }
  
  // Calculate the result of the previous operation
  const newValue = calculate(previousValue, inputValue, operator);
  const formattedResult = formatNumber(newValue);
  
  return {
    ...currentState,
    display: formattedResult,
    previousValue: newValue,
    operator: nextOperator,
    waitingForOperand: true,
    expression: `${formattedResult} ${nextOperator}`
  };
}

/**
 * Handles equals/calculation
 */
export function performCalculation(currentState: CalculatorState): { state: CalculatorState; expression: string; result: string } | null {
  const { display, previousValue, operator } = currentState;
  const inputValue = parseDisplayValue(display);
  
  if (previousValue === null || !operator) {
    return null;
  }
  
  const newValue = calculate(previousValue, inputValue, operator);
  const expr = `${formatNumber(previousValue)} ${operator} ${formatNumber(inputValue)}`;
  const result = formatNumber(newValue);
  
  const newState: CalculatorState = {
    ...currentState,
    display: result,
    previousValue: null,
    operator: null,
    waitingForOperand: true,
    expression: ''
  };
  
  return { state: newState, expression: expr, result };
}

/**
 * Clears all state
 */
export function clearAll(): CalculatorState {
  return { ...initialState };
}

/**
 * Clears the current entry (CE)
 */
export function clearEntry(currentState: CalculatorState): CalculatorState {
  return {
    ...currentState,
    display: '0'
  };
}

/**
 * Handles backspace
 */
export function backspace(currentState: CalculatorState): CalculatorState {
  const { display, waitingForOperand } = currentState;
  
  if (waitingForOperand) {
    return currentState;
  }
  
  if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
    return {
      ...currentState,
      display: '0'
    };
  }
  
  return {
    ...currentState,
    display: display.slice(0, -1)
  };
}

/**
 * Handles percentage calculation
 */
export function percentage(currentState: CalculatorState): CalculatorState {
  const { display, previousValue, operator, waitingForOperand } = currentState;
  const inputValue = parseDisplayValue(display);
  
  if (previousValue !== null && operator && !waitingForOperand) {
    // Calculate percentage of the previous value
    const percentValue = (previousValue * inputValue) / 100;
    return {
      ...currentState,
      display: formatNumber(percentValue),
      waitingForOperand: true
    };
  }
  
  // Simple percentage (divide by 100)
  const newValue = inputValue / 100;
  return {
    ...currentState,
    display: formatNumber(newValue),
    waitingForOperand: true
  };
}

/**
 * Toggles the sign of the current display value
 */
export function toggleSign(currentState: CalculatorState): CalculatorState {
  const { display, waitingForOperand } = currentState;
  
  if (waitingForOperand) {
    return currentState;
  }
  
  const value = parseDisplayValue(display);
  const newValue = -value;
  
  return {
    ...currentState,
    display: formatNumber(newValue)
  };
}