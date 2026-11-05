// Money utility functions

/**
 * Converts a monetary value from cents to a formatted string
 * @param {number} cents - Amount in smallest currency unit (e.g., 1050 for €10.50)
 * @param {string} [currency='€'] - Currency symbol
 * @param {string} [locale='en-EU'] - Locale for formatting
 * @returns {string} Formatted monetary string
 */
export const formatMoney = (
  cents: number,
  currency = "€",
  locale = "en-EU"
) => {
  // Convert cents to decimal
  const amount = cents / 100;

  // Use Intl.NumberFormat for proper localization and currency formatting
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency === "€" ? "EUR" : currency,
  }).format(amount);
};

/**
 * Converts a monetary string to cents
 * @param {string} amount - Monetary string (e.g., '€10.50' or '10.50')
 * @returns {number} Amount in cents
 */
export const parseMoney = (amount: string) => {
  // Remove currency symbol and any commas
  const cleanAmount = amount.replace(/[€$£,]/g, "");

  // Parse to float and convert to cents
  return Math.round(parseFloat(cleanAmount) * 100);
};

// Example usage
// Logger.log(formatMoney(1050)); // €10.50
// Logger.log(formatMoney(100)); // €1.00
// Logger.log(parseMoney("€10.50")); // 1050
// Logger.log(parseMoney("10.50")); // 1050
