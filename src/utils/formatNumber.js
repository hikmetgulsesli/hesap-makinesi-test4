/**
 * @typedef {'tr'|'en'|'de'} NumberFormat
 */

/** @type {Record<NumberFormat, {decimal: string, thousands: string}>} */
const FORMAT_CONFIG = {
  tr: { decimal: ',', thousands: '.' },
  en: { decimal: '.', thousands: ',' },
  de: { decimal: ',', thousands: '.' },
};

/**
 * Format number for display according to locale
 * @param {number|string} value - Value to format
 * @param {NumberFormat} [format='tr'] - Number format
 * @param {number} [maxDecimals=10] - Maximum decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(value, format = 'tr', maxDecimals = 10) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue) || !isFinite(numValue)) {
    return '0';
  }

  const config = FORMAT_CONFIG[format];
  
  // Handle very large or very small numbers
  if (Math.abs(numValue) > 1e15) {
    return numValue.toExponential(6).replace('.', config.decimal);
  }

  // Format the number
  let formatted;
  
  // Check if it's an integer
  if (Number.isInteger(numValue)) {
    formatted = numValue.toLocaleString('en-US').replace(/,/g, config.thousands);
  } else {
    // Round to maxDecimals to avoid floating point issues
    const factor = Math.pow(10, maxDecimals);
    const rounded = Math.round(numValue * factor) / factor;
    
    // Split into integer and decimal parts
    const parts = rounded.toString().split('.');
    const integerPart = parseInt(parts[0], 10).toLocaleString('en-US').replace(/,/g, config.thousands);
    const decimalPart = parts[1] ? parts[1].padEnd(1, '0') : '';
    
    formatted = decimalPart ? `${integerPart}${config.decimal}${decimalPart}` : integerPart;
  }

  return formatted;
}

/**
 * Parse formatted number string back to number
 * @param {string} value - Formatted string
 * @param {NumberFormat} [format='tr'] - Number format
 * @returns {number|null} Parsed number or null
 */
export function parseFormattedNumber(value, format = 'tr') {
  if (!value || value.trim() === '') {
    return null;
  }

  const config = FORMAT_CONFIG[format];
  
  // Remove thousands separators and replace decimal separator
  const normalized = value
    .replace(new RegExp(`\\${config.thousands}`, 'g'), '')
    .replace(config.decimal, '.');

  const parsed = parseFloat(normalized);
  
  return isNaN(parsed) || !isFinite(parsed) ? null : parsed;
}

/**
 * Format display value with proper separators
 * @param {string} value - Raw value string
 * @param {NumberFormat} [format='tr'] - Number format
 * @returns {string} Formatted display value
 */
export function formatDisplayValue(value, format = 'tr') {
  // Handle empty or invalid input
  if (!value || value === '0') {
    return '0';
  }

  // Handle negative numbers
  const isNegative = value.startsWith('-');
  const absoluteValue = isNegative ? value.slice(1) : value;

  // Split by decimal separator
  const config = FORMAT_CONFIG[format];
  const parts = absoluteValue.split('.');
  
  let integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Remove leading zeros from integer part
  integerPart = integerPart.replace(/^0+/, '') || '0';

  // Add thousands separators
  const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US').replace(/,/g, config.thousands);

  // Reconstruct the number
  let result = formattedInteger;
  if (decimalPart) {
    result += config.decimal + decimalPart;
  }

  return isNegative ? `-${result}` : result;
}

/**
 * Truncate decimal to specified places
 * @param {number} value - Number to truncate
 * @param {number} [decimals=10] - Decimal places
 * @returns {number} Truncated number
 */
export function truncateDecimal(value, decimals = 10) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Check if input is valid number format
 * @param {string} value - Input value
 * @returns {boolean} True if valid
 */
export function isValidInput(value) {
  // Allow digits, one decimal point, and one minus sign at the start
  const sanitized = value.replace(/[^\d.-]/g, '');
  if (sanitized !== value) return false;
  
  const decimalCount = (value.match(/\./g) || []).length;
  const minusCount = (value.match(/-/g) || []).length;
  
  return decimalCount <= 1 && minusCount <= 1 && (minusCount === 0 || value.startsWith('-'));
}
