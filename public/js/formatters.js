const CURRENCY = "HTG";

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