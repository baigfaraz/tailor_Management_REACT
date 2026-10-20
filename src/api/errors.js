// Turns an API error into a message staff can act on (UX-003).
export const OFFLINE_MESSAGE =
  "Could not reach the shop computer. Check the Wi-Fi and try again.";

export function errorMessage(error, fallback) {
  if (!error?.response) return OFFLINE_MESSAGE;
  return error.response.data?.error || fallback;
}

export function isNotFound(error) {
  return error?.response?.status === 404;
}
