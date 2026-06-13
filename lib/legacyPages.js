import { normalizeTypographyInCss } from "@/lib/siteTypography";
import { applyTitleCaseToHtml } from "@/lib/titleCaseHeadings";
import { LEGACY_PAGE_SOURCES } from "@/lib/legacyPageSources";
import {
  ASSET_URLS,
  FRAGMENT_ONLY_PAGE_KEYS,
  INTERNAL_HREFS,
  PAGE_DEFINITIONS
} from "@/lib/legacyPageManifest";

export { FRAGMENT_ONLY_PAGE_KEYS } from "@/lib/legacyPageManifest";

const slugToPageKey = new Map();
const pageCache = new Map();

for (const [key, definition] of Object.entries(PAGE_DEFINITIONS)) {
  for (const slug of definition.slugs) {
    slugToPageKey.set(normalizeSlug(slug), key);
  }
}

export function isFragmentOnlyPage(key) {
  return FRAGMENT_ONLY_PAGE_KEYS.has(key);
}

export function getRouteParams() {
  return Object.entries(PAGE_DEFINITIONS)
    .filter(([key]) => !isFragmentOnlyPage(key) && key !== "home")
    .flatMap(([, definition]) =>
      definition.slugs.map((slug) => ({
        slug: slug ? slug.split("/") : []
      }))
    );
}

export function getPageBySlug(slugSegments) {
  const slug = normalizeSlug(Array.isArray(slugSegments) ? slugSegments.join("/") : "");
  const key = slugToPageKey.get(slug);

  if (!key) {
    return null;
  }

  return getPageByKey(key);
}

export function getPageByKey(key) {
  if (process.env.NODE_ENV === "production" && pageCache.has(key)) {
    return pageCache.get(key);
  }

  const definition = PAGE_DEFINITIONS[key];

  if (!definition) {
    return null;
  }

  const source = LEGACY_PAGE_SOURCES[key];

  if (!source) {
    throw new Error(
      `Missing bundled legacy source for "${key}". Run: node scripts/bundle-legacy-html.mjs`
    );
  }

  const parsed = parseLegacyDocument(source);
  const page = {
    key,
    title: parsed.title || definition.fallbackTitle,
    ...definition,
    ...parsed,
    styles: parsed.styles.map((style) => normalizeTypographyInCss(rewriteAssetUrls(style))),
    html: applyTitleCaseToHtml(rewriteAssetUrls(rewriteInternalLinks(parsed.html)))
  };

  pageCache.set(key, page);
  return page;
}

export function getRouteList() {
  return Object.entries(PAGE_DEFINITIONS).map(([key, definition]) => ({
    key,
    routes: definition.slugs.map((slug) => `/${slug}`.replace(/\/$/, "") || "/")
  }));
}

function normalizeSlug(slug) {
  return String(slug || "")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
}

function parseLegacyDocument(source) {
  const title = source.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";
  const htmlAttributes = source.match(/<html\b([^>]*)>/i)?.[1] || "";
  const bodyMatch = source.match(/<body\b([^>]*)>([\s\S]*?)<\/body>/i);
  const bodyAttributes = bodyMatch?.[1] || "";
  const rawBody = bodyMatch ? bodyMatch[2] : source;

  const styles = Array.from(source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)).map(
    (match) => match[1]
  );

  const scripts = [];
  for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = match[1] || "";
    if (!/\bsrc\s*=/i.test(attributes) && match[2].trim()) {
      scripts.push(match[2]);
    }
  }

  const html = rawBody
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<meta\b[^>]*>/gi, "")
    .trim();

  return {
    title,
    bodyClassName: readAttribute(bodyAttributes, "class"),
    htmlStyle: readAttribute(htmlAttributes, "style"),
    styles,
    scripts,
    html
  };
}

function readAttribute(attributes, attributeName) {
  const pattern = new RegExp(`\\b${attributeName}\\s*=\\s*(["'])(.*?)\\1`, "i");
  return attributes.match(pattern)?.[2] || "";
}

function rewriteInternalLinks(html) {
  return html.replace(/href=(["'])https:\/\/webaffino\.com\/([^"']*)\1/gi, (match, quote, value) => {
    const cleanPath = normalizeSlug(value.split("#")[0].split("?")[0]);
    const suffix = value.slice(value.split("#")[0].split("?")[0].length);
    const localHref = INTERNAL_HREFS[cleanPath];

    if (!localHref) {
      return match;
    }

    return `href=${quote}${localHref}${suffix}${quote}`;
  });
}

function rewriteAssetUrls(content) {
  let rewritten = content;

  for (const [remoteUrl, localUrl] of Object.entries(ASSET_URLS)) {
    rewritten = rewritten.split(remoteUrl).join(localUrl);
  }

  return rewritten;
}
