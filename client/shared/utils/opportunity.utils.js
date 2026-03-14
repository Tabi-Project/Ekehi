const formatterCache = new Map();

function getFormatter(currency) {
  if (!formatterCache.has(currency)) {
    formatterCache.set(
      currency,
      new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    );
  }
  return formatterCache.get(currency);
}

export function formatAmount(min, max, currency) {
  if (min == null && max == null) return "—";
  const fmt = (n) => getFormatter(currency ?? "USD").format(n);
  return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
}

/** Accepts a Date object or date string. Callers can pre-parse to avoid repeated parsing. */
export function daysUntil(dateInput) {
  if (!dateInput) return null;
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const diff = Math.ceil((date - Date.now()) / 86_400_000);
  if (diff < 0) return "Closed";
  if (diff === 0) return "Closes today";
  return `${diff} days left`;
}

export function humanize(str) {
  return (str ?? "").replace(/_/g, " ");
}

export function formatDate(dateInput) {
  if (!dateInput) return "—";
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function buildQueryString(params) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null),
  );
  const str = query.toString();
  return str ? `?${str}` : "";
}
