export function sanitizeString(value, fallback, maxLen) {
  const s = String(value ?? "")
    .trim()
    .slice(0, maxLen);
  return s === "" ? fallback : s;
}

export function sanitizeMessagesArray(messages, { maxLenEach, emptyFallback }) {
  return messages.map((m) => {
    const s = String(m ?? "")
      .trim()
      .slice(0, maxLenEach);
    return s === "" ? emptyFallback : s;
  });
}
