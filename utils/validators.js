function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  if (!phone) return true; // optional field
  const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
  return phoneRegex.test(phone);
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

module.exports = {
  isValidEmail,
  isValidPhone,
  sanitizeString
};