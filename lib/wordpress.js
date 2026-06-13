import { decodeHtmlEntities, stripHtml, truncateText } from "@/lib/decodeHtml";
import { toTitleCaseText } from "@/lib/toTitleCase";
import { applyTitleCaseToHtml } from "@/lib/titleCaseHeadings";
import { buildProbeResult } from "@/lib/wordpressDebug";

/** @typedef {import('@/types/wordpress').WordPressPost} WordPressPost */
/** @typedef {import('@/types/wordpress').BlogPost} BlogPost */
/** @typedef {import('@/types/wordpress').BlogPostDetail} BlogPostDetail */
/** @typedef {import('@/lib/wordpressDebug').WordPressProbeResult} WordPressProbeResult */

const EXCERPT_MAX_LENGTH = 140;
const WP_API_PAGE_SIZE = 100;
const LISTING_REVALIDATE_SECONDS = 300;

export const PLACEHOLDER_BLOG_IMAGE = "/placeholder-blog.jpg";

/**
 * @returns {string}
 */
export function getWordPressApiBase() {
  return (
    process.env.WORDPRESS_API_BASE ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_BASE ||
    "https://webaffino.com/wp-json/wp/v2"
  );
}

const WORDPRESS_API_BASE = getWordPressApiBase();

/**
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<{ response: Response; body: string; probe: WordPressProbeResult }>}
 */
export async function probeWordPressUrl(url, options = {}) {
  const wpBase = getWordPressApiBase();

  console.log("[WordPress API] WP BASE:", wpBase);
  console.log("[WordPress API] WP URL:", url);
  console.log("[WordPress API] env WORDPRESS_API_BASE:", process.env.WORDPRESS_API_BASE ?? "(unset)");
  console.log(
    "[WordPress API] env NEXT_PUBLIC_WORDPRESS_API_BASE:",
    process.env.NEXT_PUBLIC_WORDPRESS_API_BASE ?? "(unset)"
  );

  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "WebAffino-Next/1.0",
      ...options.headers
    }
  });

  const body = await response.text();
  const probe = buildProbeResult(response, body, wpBase, url);

  console.log("[WordPress API] response.status:", response.status);
  console.log("[WordPress API] response.statusText:", response.statusText);
  console.log("[WordPress API] response.headers:", probe.headers);
  console.log("[WordPress API] response.bodyPreview:", probe.bodyPreview);
  console.log("[WordPress API] response.type:", probe.responseType);
  console.log("[WordPress API] jsonParseSuccess:", probe.jsonParseSuccess);

  return { response, body, probe };
}

/**
 * @param {string} url
 * @param {RequestInit} [options]
 * @param {number} [retries=2]
 * @returns {Promise<Response>}
 */
async function fetchWordPressApi(url, options = {}, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    console.log("[WordPress API] fetch attempt:", attempt + 1, "of", retries + 1);

    const { response, body, probe } = await probeWordPressUrl(url, options);

    if (response.ok) {
      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }

    if (response.status === 502 && attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 1000));
      continue;
    }

    const detail = `${probe.responseType} body="${probe.bodyPreview.replace(/\s+/g, " ").trim()}"`;
    const error = new Error(`WordPress API request failed (${response.status}): ${detail}`);
    error.cause = probe;
    throw error;
  }

  throw new Error("WordPress API request failed");
}

/**
 * Cached listing fetch used for paginated blog loads.
 * @param {string} url
 * @param {number} [retries=2]
 * @returns {Promise<Response>}
 */
async function fetchWordPressListing(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, {
      next: { revalidate: LISTING_REVALIDATE_SECONDS },
      headers: {
        Accept: "application/json",
        "User-Agent": "WebAffino-Next/1.0"
      }
    });

    if (response.ok) {
      return response;
    }

    if (response.status === 502 && attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 1000));
      continue;
    }

    throw new Error(`WordPress API request failed (${response.status})`);
  }

  throw new Error("WordPress API request failed");
}

/**
 * @param {number} page
 * @param {boolean} embed
 * @returns {string}
 */
function buildPostsPageUrl(page, embed) {
  const wpBase = getWordPressApiBase();
  const embedParam = embed ? "_embed&" : "";
  return `${wpBase}/posts?${embedParam}per_page=${WP_API_PAGE_SIZE}&page=${page}&status=publish`;
}

/**
 * @param {number} page
 * @param {boolean} [embed=true]
 * @returns {Promise<{ posts: WordPressPost[]; totalPages: number }>}
 */
async function fetchWordPressPostsPage(page, embed = true) {
  const response = await fetchWordPressListing(buildPostsPageUrl(page, embed));
  const totalPages = Number.parseInt(response.headers.get("x-wp-totalpages") || "1", 10);
  /** @type {WordPressPost[]} */
  const posts = await response.json();

  return { posts, totalPages };
}

/**
 * @param {boolean} [embed=true]
 * @returns {Promise<WordPressPost[]>}
 */
async function fetchAllWordPressPostsRaw(embed = true) {
  const firstPage = await fetchWordPressPostsPage(1, embed);

  if (firstPage.totalPages <= 1) {
    return firstPage.posts;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      fetchWordPressPostsPage(index + 2, embed)
    )
  );

  return [firstPage.posts, ...remainingPages.map((page) => page.posts)].flat();
}

/**
 * Featured image from embedded media only (per WordPress post).
 * @param {WordPressPost} post
 * @returns {string | null}
 */
export function getEmbeddedFeaturedImageUrl(post) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  if (!media || media.code) {
    return null;
  }

  return media.source_url || null;
}

/**
 * @param {string} html
 * @returns {string | null}
 */
function extractFirstImageFromHtml(html) {
  if (!html) {
    return null;
  }

  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/i,
    /<img[^>]+data-src=["']([^"']+)["']/i,
    /srcset=["']([^"'\s,]+)/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1] && !match[1].includes("data:image")) {
      return match[1].replace(/&amp;/g, "&");
    }
  }

  return null;
}

/**
 * @param {WordPressPost} post
 * @returns {string | null}
 */
function getListingFeaturedImageUrl(post) {
  const embedded = getEmbeddedFeaturedImageUrl(post);
  if (embedded) {
    return embedded;
  }

  return (
    extractFirstImageFromHtml(post.content?.rendered || "") ||
    extractFirstImageFromHtml(post.excerpt?.rendered || "") ||
    null
  );
}

/**
 * @param {WordPressPost} post
 * @returns {{
 *   seoTitle?: string;
 *   seoDescription?: string;
 *   wordpressCanonical?: string;
 *   ogTitle?: string;
 *   ogDescription?: string;
 *   twitterTitle?: string;
 *   twitterDescription?: string;
 * }}
 */
function extractPostSeoFields(post) {
  const yoast = post.yoast_head_json;

  if (!yoast) {
    return {};
  }

  return {
    seoTitle: yoast.title || undefined,
    seoDescription: yoast.description || undefined,
    wordpressCanonical: yoast.canonical || undefined,
    ogTitle: yoast.og_title || undefined,
    ogDescription: yoast.og_description || undefined,
    twitterTitle: yoast.twitter_title || undefined,
    twitterDescription: yoast.twitter_description || undefined
  };
}

/**
 * @param {WordPressPost} post
 * @returns {string | undefined}
 */
function getPostAuthor(post) {
  const embeddedAuthor = post._embedded?.author?.[0]?.name;
  if (embeddedAuthor) {
    return decodeHtmlEntities(embeddedAuthor);
  }

  const yoastAuthor = post.yoast_head_json?.author;
  return yoastAuthor ? decodeHtmlEntities(yoastAuthor) : undefined;
}

/**
 * @param {WordPressFeaturedMedia | undefined} media
 * @returns {{ width?: number; height?: number }}
 */
function getFeaturedImageDimensions(media) {
  const width = media?.media_details?.width;
  const height = media?.media_details?.height;

  return {
    ...(typeof width === "number" ? { width } : {}),
    ...(typeof height === "number" ? { height } : {})
  };
}

/**
 * @param {WordPressPost} post
 * @returns {string}
 */
function getPostCategory(post) {
  const termGroups = post._embedded?.["wp:term"] || [];

  for (const group of termGroups) {
    const category = group.find((term) => term.taxonomy === "category");
    if (category?.name) {
      return decodeHtmlEntities(category.name);
    }
  }

  return "Uncategorized";
}

/**
 * @param {WordPressPost} post
 * @returns {string}
 */
function buildExcerpt(post) {
  const excerptText = stripHtml(post.excerpt?.rendered || "");
  const contentText = stripHtml(post.content?.rendered || "");

  const source =
    excerptText && excerptText.length < contentText.length * 0.75
      ? excerptText
      : contentText || excerptText;

  return truncateText(source, EXCERPT_MAX_LENGTH);
}

/**
 * @param {WordPressPost} post
 * @returns {BlogPost}
 */
export function mapWordPressPost(post) {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const featuredImage = getListingFeaturedImageUrl(post);
  const featuredAlt =
    featuredMedia?.alt_text ||
    decodeHtmlEntities(post.title?.rendered || "Blog post");
  const imageDimensions = getFeaturedImageDimensions(featuredMedia);

  return {
    id: post.id,
    slug: post.slug || "",
    title: toTitleCaseText(decodeHtmlEntities(post.title?.rendered || "")),
    excerpt: buildExcerpt(post),
    date: post.date,
    modifiedDate: post.modified || post.date,
    link: post.link,
    category: getPostCategory(post),
    author: getPostAuthor(post),
    featuredImage,
    featuredAlt,
    ...imageDimensions,
    ...extractPostSeoFields(post)
  };
}

/**
 * @param {WordPressPost} post
 * @returns {BlogPostDetail}
 */
export function mapWordPressPostDetail(post) {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const embeddedImage = getEmbeddedFeaturedImageUrl(post);
  const featuredImage = embeddedImage || PLACEHOLDER_BLOG_IMAGE;
  const featuredAlt =
    featuredMedia?.alt_text ||
    decodeHtmlEntities(post.title?.rendered || "Blog post");

  const base = mapWordPressPost(post);

  return {
    ...base,
    featuredImage,
    featuredAlt,
    contentHtml: applyTitleCaseToHtml(post.content?.rendered || "")
  };
}

/**
 * @param {string} url
 * @returns {Promise<WordPressPost[]>}
 */
async function fetchWordPressPostsPayload(url) {
  const response = await fetchWordPressApi(url);
  /** @type {WordPressPost[]} */
  return response.json();
}

/**
 * @returns {Promise<WordPressProbeResult>}
 */
export async function debugWordPressConnection() {
  const wpBase = getWordPressApiBase();
  const requestUrl = `${wpBase}/posts?_embed&per_page=6&page=1`;
  const { probe } = await probeWordPressUrl(requestUrl);

  return {
    ...probe,
    env: {
      WORDPRESS_API_BASE: process.env.WORDPRESS_API_BASE ?? null,
      NEXT_PUBLIC_WORDPRESS_API_BASE: process.env.NEXT_PUBLIC_WORDPRESS_API_BASE ?? null
    },
    urlChecks: {
      hasDoubleWpJson: /\/wp-json\/wp\/v2\/wp-json/i.test(requestUrl),
      wpBaseEndsCorrectly: wpBase.endsWith("/wp-json/wp/v2"),
      requestUrl
    }
  };
}

/**
 * Fetch every published WordPress post across all API pages.
 * @returns {Promise<BlogPost[]>}
 */
export async function fetchWordPressPosts() {
  let posts = [];

  try {
    posts = await fetchAllWordPressPostsRaw(true);
  } catch (embeddedError) {
    console.warn("[WordPress API] embedded paginated fetch failed, retrying without _embed:", embeddedError);

    try {
      posts = await fetchAllWordPressPostsRaw(false);
    } catch (lightweightError) {
      console.error("[WordPress API] lightweight paginated fetch also failed:", lightweightError);
      return [];
    }
  }

  console.log("[WordPress API] posts received:", posts.length);

  const mapped = posts.map(mapWordPressPost);

  return mapped.map((post) => ({
    ...post,
    featuredImage: post.featuredImage || PLACEHOLDER_BLOG_IMAGE
  }));
}

/**
 * @param {string} slug
 * @returns {Promise<BlogPostDetail | null>}
 */
export async function fetchWordPressPostBySlug(slug) {
  const wpBase = getWordPressApiBase();
  const slugQuery = encodeURIComponent(slug);
  const embeddedUrl = `${wpBase}/posts?slug=${slugQuery}&_embed&per_page=1&context=view`;
  const lightweightUrl = `${wpBase}/posts?slug=${slugQuery}&per_page=1`;

  let posts = [];

  try {
    posts = await fetchWordPressPostsPayload(embeddedUrl);
  } catch (embeddedError) {
    console.warn("[WordPress API] embedded slug fetch failed, retrying without _embed:", embeddedError);

    try {
      posts = await fetchWordPressPostsPayload(lightweightUrl);
    } catch (lightweightError) {
      console.error("[WordPress API] lightweight slug fetch also failed:", lightweightError);
      return null;
    }
  }

  if (!posts.length) {
    return null;
  }

  return mapWordPressPostDetail(posts[0]);
}

export const WORDPRESS_POSTS_URL = `${WORDPRESS_API_BASE}/posts?_embed&per_page=${WP_API_PAGE_SIZE}&page=1&status=publish`;
