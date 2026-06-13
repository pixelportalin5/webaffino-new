export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webaffino.com";
export const SITE_NAME = "Web Affino";
export const SITE_TAGLINE = "Growth That Drives Revenue";
export const DEFAULT_DESCRIPTION =
  "Web Affino delivers performance marketing, SEO, lead generation, and digital growth strategies that drive measurable revenue.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/web-affino-new-logo.png`;
export const TWITTER_HANDLE = "@webaffino";
export const ORGANIZATION_LOGO = `${SITE_URL}/assets/web-affino-new-logo.png`;

const BLOCKED_HOSTS = ["admin.webaffino.com", "www.admin.webaffino.com"];

/**
 * @param {string} path
 * @returns {string}
 */
export function absoluteUrl(path = "/") {
  if (!path) {
    return SITE_URL;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const url = new URL(path);
      if (BLOCKED_HOSTS.includes(url.hostname)) {
        return SITE_URL;
      }
      return url.toString().replace(/\/$/, "") || SITE_URL;
    } catch {
      return SITE_URL;
    }
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function blogCanonicalUrl(slug) {
  return absoluteUrl(`/blogs/${slug}`);
}

/**
 * Strip WordPress/admin canonical URLs and always return frontend canonical.
 * @param {string | undefined | null} url
 * @param {string} fallbackPath
 * @returns {string}
 */
export function sanitizeCanonical(url, fallbackPath) {
  if (!url) {
    return absoluteUrl(fallbackPath);
  }

  try {
    const parsed = new URL(url);
    if (BLOCKED_HOSTS.includes(parsed.hostname)) {
      return absoluteUrl(fallbackPath);
    }
    if (parsed.hostname.replace(/^www\./, "") === "webaffino.com") {
      return `${SITE_URL}${parsed.pathname}`.replace(/\/$/, "") || SITE_URL;
    }
  } catch {
    // fall through
  }

  return absoluteUrl(fallbackPath);
}

/**
 * @param {string | undefined | null} url
 * @returns {string | undefined}
 */
export function sanitizeOgImage(url) {
  if (!url) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    if (BLOCKED_HOSTS.includes(parsed.hostname)) {
      return undefined;
    }
    return url;
  } catch {
    return undefined;
  }
}
