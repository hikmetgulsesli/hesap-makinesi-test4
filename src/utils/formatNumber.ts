export type NumberFormat = 'tr' | 'en' | 'de';

interface FormatConfig {
  decimal: string;
  thousands: string;
}

const FORMAT_CONFIG: Record<NumberFormat, FormatConfig> = {
  tr: { decimal: ',', thousands: '.' },
  en: { decimal: '.', thousands: ',' },
  de: { decimal: ',', thousands: '.' },
};

export function formatNumber(
  value: number | string,
  format: NumberFormat = 'tr',
  maxDecimals: number = 10
): string {
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

export function parseFormattedNumber(
  value: string,
  format: NumberFormat = 'tr'
): number | null {
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

export function formatDisplayValue(
  value: string,
  format: NumberFormat = 'tr'
): string {
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

export function truncateDecimal(value: number, decimals: number = 10): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function isValidInput(value: string): boolean {
  // Allow digits, one decimal point, and one minus sign at the start
  const sanitized = value.replace(/[^\d.-]/g, '');
  if (sanitized !== value) return false;
  
  const decimalCount = (value.match(/\./g) || []).length;
  const minusCount = (value.match(/-/g) || []).length;
  
  return decimalCount <= 1 && minusCount <= 1 && (minusCount === 0 || value.startsWith('-'));
}
