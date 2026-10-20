// Display helpers. The API stores plain numbers (SEC-003); records saved before
// the migration may still hold text such as "31 Inches", which shows as-is.
const hasValue = (value) =>
  value !== undefined && value !== null && value !== "";

export function inches(value) {
  if (!hasValue(value)) return "";
  return typeof value === "number" ? `${value} Inches` : String(value);
}

export function rupees(value) {
  if (!hasValue(value)) return "";
  return typeof value === "number" ? `${value} Rs` : String(value);
}

// Total = price per suit × number of suits; empty when either is unknown.
export function orderTotal(price, suits) {
  const total = parseFloat(price) * parseFloat(suits);
  return Number.isFinite(total) ? rupees(total) : "";
}
