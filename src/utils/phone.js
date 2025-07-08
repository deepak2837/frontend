export function normalizePhoneNumber(number) {
  if (!number) return "";
  return number.startsWith("+") ? number : "+" + number;
} 