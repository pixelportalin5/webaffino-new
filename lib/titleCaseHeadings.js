import { toTitleCaseText } from "@/lib/toTitleCase";

const VOID_ELEMENTS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

const SKIP_ANCESTOR_SELECTORS = "button, input, textarea, select, label, pre, code, [data-skip-title-case]";

export const HEADING_SELECTORS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  '[role="heading"]',
  ".h-hero",
  ".h-section",
  ".h-card",
  ".growth-journal-card__title",
  "header .dropdown-menu .title",
  ".blog-article-content h1",
  ".blog-article-content h2",
  ".blog-article-content h3",
  ".blog-article-content h4",
  ".blog-article-content h5",
  ".blog-article-content h6"
].join(", ");

const TITLE_CASE_ATTR = "data-title-case";

/**
 * @param {string} html
 * @returns {string}
 */
function titleCaseHtmlChunk(html) {
  let output = "";
  let index = 0;

  while (index < html.length) {
    const nextTag = html.indexOf("<", index);

    if (nextTag === -1) {
      output += toTitleCaseText(html.slice(index));
      break;
    }

    if (nextTag > index) {
      output += toTitleCaseText(html.slice(index, nextTag));
    }

    const tagClose = html.indexOf(">", nextTag);

    if (tagClose === -1) {
      output += html.slice(nextTag);
      break;
    }

    const tagString = html.slice(nextTag, tagClose + 1);
    output += tagString;

    const tagNameMatch = tagString.match(/^<\/?\s*([a-z][a-z0-9]*)/i);
    const tagName = tagNameMatch?.[1]?.toLowerCase();
    const isClosingTag = /^<\//.test(tagString);
    const isSelfClosing = /\/>\s*$/.test(tagString) || VOID_ELEMENTS.has(tagName || "");

    if (!tagName || isClosingTag || isSelfClosing) {
      index = tagClose + 1;
      continue;
    }

    const closePattern = new RegExp(`</${tagName}\\b[^>]*>`, "i");
    const remainder = html.slice(tagClose + 1);
    const closeMatch = closePattern.exec(remainder);

    if (!closeMatch) {
      index = tagClose + 1;
      continue;
    }

    const inner = remainder.slice(0, closeMatch.index);
    output += titleCaseHtmlChunk(inner);
    output += closeMatch[0];
    index = tagClose + 1 + closeMatch.index + closeMatch[0].length;
  }

  return output;
}

/**
 * @param {string} html
 * @returns {string}
 */
function transformHeadingTagsInHtml(html) {
  return html.replace(/<(h[1-6])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (match, tag, attrs = "", inner) => {
    return `<${tag}${attrs}>${titleCaseHtmlChunk(inner)}</${tag}>`;
  });
}

/**
 * @param {string} html
 * @returns {string}
 */
function transformDropdownTitlesInHtml(html) {
  return html.replace(
    /<span(\s[^>]*\bclass=(?:"[^"]*\btitle\b[^"]*"|'[^']*\btitle\b[^']*')[^>]*)>([\s\S]*?)<\/span>/gi,
    (match, attrs, inner) => `<span${attrs}>${titleCaseHtmlChunk(inner)}</span>`
  );
}

/**
 * Apply Title Case to headings inside an HTML string.
 * @param {string} html
 * @returns {string}
 */
export function applyTitleCaseToHtml(html) {
  if (!html) {
    return "";
  }

  return transformDropdownTitlesInHtml(transformHeadingTagsInHtml(html));
}

/**
 * @param {Element} element
 * @returns {boolean}
 */
function shouldSkipElement(element) {
  if (!(element instanceof Element)) {
    return true;
  }

  if (element.closest(SKIP_ANCESTOR_SELECTORS)) {
    return true;
  }

  const tagName = element.tagName.toLowerCase();

  if (["button", "input", "textarea", "select", "label", "pre", "code", "a"].includes(tagName)) {
    return true;
  }

  if (element.classList.contains("desc")) {
    return true;
  }

  return false;
}

/**
 * @param {Node} node
 */
function applyTitleCaseToTextNodes(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = toTitleCaseText(node.textContent || "");
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const element = /** @type {Element} */ (node);

  if (["script", "style", "code", "pre"].includes(element.tagName.toLowerCase())) {
    return;
  }

  for (const child of Array.from(element.childNodes)) {
    applyTitleCaseToTextNodes(child);
  }
}

/**
 * @param {Element} element
 */
export function applyTitleCaseToElement(element) {
  if (shouldSkipElement(element) || element.hasAttribute(TITLE_CASE_ATTR)) {
    return;
  }

  applyTitleCaseToTextNodes(element);
  element.setAttribute(TITLE_CASE_ATTR, "true");
}

/**
 * @param {ParentNode} [root]
 */
export function applyTitleCaseToHeadings(root = document) {
  if (typeof document === "undefined" || !root?.querySelectorAll) {
    return;
  }

  root.querySelectorAll(HEADING_SELECTORS).forEach((element) => {
    applyTitleCaseToElement(element);
  });
}
