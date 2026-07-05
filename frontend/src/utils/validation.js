export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function isValidPhone(phone) {
  const cleaned = String(phone).trim().replace(/\s/g, "");
  return /^(0[67]\d{8}|\+255[67]\d{8})$/.test(cleaned);
}

export function normalizePhone(phone) {
  const cleaned = String(phone).trim().replace(/\s/g, "");
  if (cleaned.startsWith("0")) {
    return "+255" + cleaned.slice(1);
  }
  return cleaned;
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

export function isStrongEnoughPassword(password) {
  return getPasswordValidationErrors(password).length === 0;
}
