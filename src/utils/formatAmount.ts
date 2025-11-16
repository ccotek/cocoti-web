/**
 * Format a number with spaces as thousand separators (French format)
 * Example: 1020000 -> "1 020 000"
 * 
 * @param amount - The number to format
 * @returns Formatted string with spaces as thousand separators
 */
export function formatAmount(amount: number | string): string {
  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid numbers
  if (isNaN(numAmount)) {
    return '0';
  }
  
  // Convert to integer (remove decimals for display)
  const integerAmount = Math.floor(numAmount);
  
  // Convert to string and reverse for easier processing
  const amountStr = integerAmount.toString();
  const reversed = amountStr.split('').reverse();
  
  // Add space every 3 digits
  const formatted: string[] = [];
  for (let i = 0; i < reversed.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formatted.push(' ');
    }
    formatted.push(reversed[i]);
  }
  
  // Reverse back and join
  return formatted.reverse().join('');
}

/**
 * Format currency with amount
 * 
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., 'XOF', 'EUR', 'USD')
 * @returns Formatted string with amount and currency
 */
export function formatCurrency(amount: number | string, currency: string): string {
  const formattedAmount = formatAmount(amount);
  
  if (currency === 'XOF') {
    return `${formattedAmount} FCFA`;
  }
  
  return `${formattedAmount} ${currency}`;
}

