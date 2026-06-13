/**
 * Convert plain text to Title Case (capitalize the first letter of every word).
 * @param {string} text
 * @returns {string}
 */
export function toTitleCase(text) {
  if (!text) {
    return "";
  }

  return text.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

/**
 * @param {string} text
 * @returns {boolean}
 */
export function shouldSkipTextContent(text) {
  if (!text || !text.trim()) {
    return false;
  }

  const trimmed = text.trim();

  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) {
    return true;
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * @param {string} text
 * @returns {string}
 */
export function toTitleCaseText(text) {
  if (!text || shouldSkipTextContent(text)) {
    return text || "";
  }

  return toTitleCase(text);
}
