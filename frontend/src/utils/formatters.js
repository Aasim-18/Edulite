export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

export function getErrorMessage(error) {
  if (error.message === 'Network Error') {
    return 'Cannot reach the server. Make sure the backend is running on port 8080, then refresh.';
  }
  return error.response?.data?.message || error.message || 'Unable to load data.';
}
