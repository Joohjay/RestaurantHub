export function formatCurrency(value) {
  return `Tsh ${Number(value || 0).toLocaleString()}`;
}

export function formatRating(rating) {
  return rating ? `${Number(rating).toFixed(1)}` : "Not rated";
}

export function formatPaymentMethod(value) {
  return value ? value.replace("_", " ") : "Not selected";
}

export function formatScheduled(date, time) {
  if (!date || !time) return "Not scheduled";
  const formattedDate = new Date(date).toLocaleDateString();
  return `${formattedDate} at ${time}`;
}
