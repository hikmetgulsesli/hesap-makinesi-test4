/**
 * @typedef {string|null} Operator
 */

/**
 * @typedef {Object} CalculationResult
 * @property {number} value - Calculated value
 * @property {string} expression - Formatted expression string
 */

/**
 * Perform calculation between two values
 * @param {number} firstValue - First operand
 * @param {number} secondValue - Second operand
 * @param {Operator} operator - Mathematical operator
 * @returns {number} Calculated result
 */
export function calculate(firstValue, secondValue, operator) {
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

/**
 * Calculate expression and return result with formatted expression
 * @param {number} firstValue - First operand
 * @param {number} secondValue - Second operand
 * @param {Operator} operator - Mathematical operator
 * @returns {CalculationResult} Calculation result object
 */
export function calculateExpression(firstValue, secondValue, operator) {
  const value = calculate(firstValue, secondValue, operator);
  const operatorSymbol = getOperatorSymbol(operator);
  const expression = `${formatNumber(firstValue)} ${operatorSymbol} ${formatNumber(secondValue)}`;
  
  return {
    value,
    expression,
  };
}

/**
 * Get display symbol for operator
 * @param {Operator} operator - Mathematical operator
 * @returns {string} Display symbol
 */
export function getOperatorSymbol(operator) {
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

/**
 * Check if value is a valid number
 * @param {string} value - Value to check
 * @returns {boolean} True if valid number
 */
export function isValidNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
}

/**
 * Safely parse float from string
 * @param {string} value - String value
 * @returns {number|null} Parsed number or null
 */
export function safeParseFloat(value) {
  const parsed = parseFloat(value);
  return isNaN(parsed) || !isFinite(parsed) ? null : parsed;
}

// Import formatNumber for calculateExpression
import { formatNumber } from './formatNumber';
