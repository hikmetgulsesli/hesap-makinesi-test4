import { formatNumber } from './formatNumber';

export type Operator = string | null;

export interface CalculationResult {
  value: number;
  expression: string;
}

export function calculate(
  firstValue: number,
  secondValue: number,
  operator: Operator
): number {
  switch (operator) {
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
}

export function calculateExpression(
  firstValue: number,
  secondValue: number,
  operator: Operator
): CalculationResult {
  const value = calculate(firstValue, secondValue, operator);
  const operatorSymbol = getOperatorSymbol(operator);
  const expression = `${formatNumber(firstValue)} ${operatorSymbol} ${formatNumber(secondValue)}`;
  
  return {
    value,
    expression,
  };
}

export function getOperatorSymbol(operator: Operator): string {
  switch (operator) {
    case '+':
      return '+';
    case '−':
    case '-':
      return '−';
    case '×':
    case '*':
      return '×';
    case '÷':
    case '/':
      return '÷';
    default:
      return '';
  }
}

export function isValidNumber(value: string): boolean {
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
}

export function safeParseFloat(value: string): number | null {
  const parsed = parseFloat(value);
  return isNaN(parsed) || !isFinite(parsed) ? null : parsed;
}
