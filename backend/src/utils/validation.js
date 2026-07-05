export function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

export function missingFields(body, fields) {
  return fields.filter((field) => isBlank(body[field]));
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function isValidPhone(phone) {
  const cleaned = String(phone).trim().replace(/\s/g, "");
  // Tanzanian formats:
  // Local: 07xxxxxxxx or 06xxxxxxxx (10 digits)
  // International: +2557xxxxxxxx or +2556xxxxxxxx (+ followed by 12 digits)
  return /^(0[67]\d{8}|\+255[67]\d{8})$/.test(cleaned);
}

export function normalizePhone(phone) {
  const cleaned = String(phone).trim().replace(/\s/g, "");
  if (cleaned.startsWith("0")) {
    return "+255" + cleaned.slice(1);
  }
  return cleaned;
}

export function isStrongEnoughPassword(password) {
  if (typeof password !== "string" || password.length < 8) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return hasUpper && hasLower && hasNumber && hasSpecial;
}

export function getPasswordValidationErrors(password) {
  const errors = [];
  if (typeof password !== "string" || password.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
  if (!/\d/.test(password)) errors.push("one number");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push("one special character");
  return errors;
}

export function isPositiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

export function isOptionalCoordinate(value) {
  if (isBlank(value)) return true;
  const coordinate = Number(value);
  return Number.isFinite(coordinate);
}

export function isAllowedValue(value, allowedValues) {
  return allowedValues.includes(value);
}
