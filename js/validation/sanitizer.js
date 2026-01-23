export function sanitizeString(value, fallback, maxLen) {
  const s = String(value ?? "")
    .trim()
    .slice(0, maxLen);
  return s === "" ? fallback : s;
}

export function sanitizeMessages(
  messages,
  { count, emptyFallback, maxLenEach },
  defaults,
) {
  const base =
    Array.isArray(messages) && messages.length == count ? messages : defaults;

  return base.map((m) => sanitizeString(m, emptyFallback, maxLenEach));
}
