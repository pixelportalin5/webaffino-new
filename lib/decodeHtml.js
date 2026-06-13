const NAMED_ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&apos;": "'",
  "&nbsp;": " "
};

/**
 * @param {string} value
 * @returns {string}
 */
export function decodeHtmlEntities(value) {
  if (!value) {
    return "";
  }

  let decoded = value;

  for (const [entity, character] of Object.entries(NAMED_ENTITIES)) {
    decoded = decoded.split(entity).join(character);
  }

  decoded = decoded.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(Number.parseInt(code, 10))
  );
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
    String.fromCharCode(Number.parseInt(code, 16))
  );

  return decoded;
}

/**
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

/**
 * @param {string} text
 * @param {number} [maxLength=140]
 * @returns {string}
 */
export function truncateText(text, maxLength = 140) {
  if (!text || text.length <= maxLength) {
    return text || "";
  }

  const trimmed = text.slice(0, maxLength).trimEnd();
  const lastSpace = trimmed.lastIndexOf(" ");

  const base = lastSpace > maxLength * 0.6 ? trimmed.slice(0, lastSpace) : trimmed;
  return `${base}…`;
}
