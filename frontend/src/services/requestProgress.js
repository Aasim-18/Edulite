let activeRequests = 0;
const listeners = new Set();

export function startRequest() {
  activeRequests += 1;
  emit();
}

export function endRequest() {
  activeRequests = Math.max(0, activeRequests - 1);
  emit();
}

export function hasPendingRequests() {
  return activeRequests > 0;
}

// LoadingBar subscribes here so it can show/hide the bar.
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  const loading = activeRequests > 0;
  listeners.forEach((listener) => listener(loading));
}