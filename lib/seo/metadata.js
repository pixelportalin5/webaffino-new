import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  absoluteUrl,
  blogCanonicalUrl,
  sanitizeCanonical,
  sanitizeOgImage
} from "@/lib/seo/site";

/**
 * @param {{
 *   title: string;
 *   description?: string;
 *   path: string;
 *   image?: string | null;
 *   type?: "website" | "article";
 *   publishedTime?: string;
 *   modifiedTime?: string;
 *   authors?: string[];
 *   noIndex?: boolean;
 * }} options
 * @returns {import('next').Metadata}
 */
export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false
}) {
  const canonical = absoluteUrl(path);
  const ogImage = sanitizeOgImage(image) || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [{ url: ogImage, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {})
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      ...(TWITTER_HANDLE ? { site: TWITTER_HANDLE } : {})
    },
    ...(authors?.length ? { authors: authors.map((name) => ({ name })) } : {})
  };
}

/**
 * @param {import('@/types/wordpress').BlogPostDetail} post
 * @returns {import('next').Metadata}
 */
export function buildBlogPostMetadata(post) {
  const canonical = blogCanonicalUrl(post.slug);
  const title = post.seoTitle || `${post.title} | ${SITE_NAME}`;
  const description = post.seoDescription || post.excerpt || DEFAULT_DESCRIPTION;
  const image = sanitizeOgImage(post.featuredImage) || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: sanitizeCanonical(post.wordpressCanonical, `/blogs/${post.slug}`)
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: post.ogTitle || title,
      description: post.ogDescription || description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modifiedDate || post.date,
      authors: post.author ? [post.author] : undefined,
      images: [{ url: image, alt: post.featuredAlt || post.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: post.twitterTitle || title,
      description: post.twitterDescription || description,
      images: [image],
      ...(TWITTER_HANDLE ? { site: TWITTER_HANDLE } : {})
    },
    ...(post.author ? { authors: [{ name: post.author }] } : {})
  };
}
