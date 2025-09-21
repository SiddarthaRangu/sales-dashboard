/**
 * Formats a number as a US Dollar currency string.
 * @param {number} value - The number to format.
 * @returns {string} The formatted currency string (e.g., "$1,234.56").
 */
export const formatCurrencyUSD = (value) => {
  if (typeof value !== 'number') {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};