// Matches the backend's phone validation: /^\+[1-9]\d{7,14}$/
const E164_REGEX = /^\+[1-9]\d{7,14}$/;

export function isValidE164(phone) {
  return E164_REGEX.test(phone);
}

// Normalizes a raw user-typed number into E.164, defaulting to India's
// country code when the user didn't type one themselves.
export function toE164(rawInput, defaultCountryCode = '+91') {
  const trimmed = rawInput.trim().replace(/[\s-]/g, '');
  if (trimmed.startsWith('+')) return trimmed;
  const digitsOnly = trimmed.replace(/\D/g, '');
  return `${defaultCountryCode}${digitsOnly}`;
}
