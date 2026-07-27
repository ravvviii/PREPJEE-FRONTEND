export function getStoredItem(key) {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
}

export function setStoredItem(key, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
}

export function removeStoredItem(key) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}
