const { CURRENCY } = require('../config/constants');

/**
 * Formats a numeric amount into the standard currency string format.
 * Example: 12500 -> "HTG 12,500.00"
 * @param {number|string} amount 
 * @returns {string}
 */
function formatMoney(amount) {
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    return `${CURRENCY} 0.00`;
  }
  const formattedNumber = numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${CURRENCY} ${formattedNumber}`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

module.exports = {
  formatMoney,
  formatDate
};