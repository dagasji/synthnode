export function formatDate(iso: string, locale = "es"): string {
  const dateLocale = locale === "en" ? "en-US" : "es-ES";
  return new Date(iso).toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function relativeTime(iso: string, locale = "es"): string {
  const date = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - date);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) {
    return locale === "en" ? `${mins}m ago` : `hace ${mins}m`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return locale === "en" ? `${hours}h ago` : `hace ${hours}h`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return locale === "en" ? `${days}d ago` : `hace ${days}d`;
  }
  return formatDate(iso, locale);
}

export function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
