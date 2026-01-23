export function validateMaxLen(value, maxLen) {
  const s = String(value ?? "");
  if (s.length <= maxLen) {
    return true;
  }
  return false;
}

// isNull, isEmpty

export function validateMessagesArray(messages, { count, maxLenEach }) {
  const errors = [];

  if (!Array.isArray(messages)) {
    errors.push("messages must be an array.");
    return errors;
  }
  if (messages.length !== count) {
    errors.push(`messages must have exactly ${count} items.`);
  }
  messages.forEach((m, i) => {
    const s = String(m ?? "");
    if (s.length > maxLenEach) {
      errors.push(`message[${i + 1}] too long (max ${maxLenEach}).`);
    }
  });

  return errors;
}
