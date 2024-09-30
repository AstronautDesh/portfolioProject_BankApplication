/**
 * Generates a cryptographically secure random PIN.
 *
 * @returns {string} A 4-digit PIN.
 */
const generatePin = () => {
  return Array(4)
    .fill(null)
    .map(() => Math.floor(Math.random() * 10).toString())
    .join('');
};

/**
 * Generates a cryptographically secure random account number.
 *
 * @returns {string} A 10-digit account number.
 */
const generateAccountNumber = () => {
  return Array(10)
    .fill(null)
    .map(() => Math.floor(Math.random() * 10).toString())
    .join('');
};

module.exports = {
  generatePin,
  generateAccountNumber,
};