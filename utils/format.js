/**
 * Formats a number as IDR (Indonesian Rupiah) currency.
 * E.g. 1500000 => "Rp 1.500.000"
 */
export function formatPrice(price) {
  if (typeof price !== 'number') return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats a date string to a human-readable format.
 * E.g. "2026-08-25" => "Tuesday, 25 Aug 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  } catch (e) {
    return dateStr;
  }
}

/**
 * Helper to combine classNames conditionally
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
