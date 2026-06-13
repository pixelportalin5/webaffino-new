import {
  DEFAULT_DESCRIPTION,
  ORGANIZATION_LOGO,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  absoluteUrl,
  blogCanonicalUrl
} from "@/lib/seo/site";

/**
 * @param {Record<string, unknown> | Record<string, unknown>[]} schemas
 * @returns {Record<string, unknown>}
 */
export function toJsonLdGraph(schemas) {
  const graph = Array.isArray(schemas) ? schemas : [schemas];
  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: ORGANIZATION_LOGO
    },
    sameAs: [
      "https://www.linkedin.com/company/webaffino",
      "https://twitter.com/webaffino"
    ]
  };
}

export function buildWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blogs?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * @param {import('@/types/wordpress').BlogPostDetail} post
 * @returns {Record<string, unknown>}
 */
export function buildBlogPostingSchema(post) {
  const url = blogCanonicalUrl(post.slug);
  const image = post.featuredImage || `${SITE_URL}/placeholder-blog.jpg`;

  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [image],
    datePublished: post.date,
    dateModified: post.modifiedDate || post.date,
    author: {
      "@type": "Person",
      name: post.author || SITE_NAME
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION_LOGO
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    articleSection: post.category,
    url
  };
}

/**
 * @param {import('@/types/wordpress').BlogPostDetail} post
 * @returns {Record<string, unknown>}
 */
export function buildBlogBreadcrumbSchema(post) {
  const postUrl = blogCanonicalUrl(post.slug);

  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blogs",
        item: absoluteUrl("/blogs")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl
      }
    ]
  };
}

export function buildLocalBusinessSchema() {
  return {
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/contact-us#localbusiness`,
    name: SITE_NAME,
    url: absoluteUrl("/contact-us"),
    image: ORGANIZATION_LOGO,
    description: DEFAULT_DESCRIPTION,
    email: "affiliate@webaffino.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "111 NE 1st St, 8th Floor",
      addressLocality: "Miami",
      addressRegion: "FL",
      postalCode: "33132",
      addressCountry: "US"
    },
    areaServed: "Worldwide",
    priceRange: "$$"
  };
}

/**
 * @param {{ question: string; answer: string }[]} items
 * @returns {Record<string, unknown> | null}
 */
export function buildFaqPageSchema(items) {
  if (!items.length) {
    return null;
  }

  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildHomeSchema() {
  return toJsonLdGraph([buildOrganizationSchema(), buildWebsiteSchema()]);
}

/**
 * @param {import('@/types/wordpress').BlogPostDetail} post
 * @returns {Record<string, unknown>}
 */
export function buildBlogPostSchema(post) {
  return toJsonLdGraph([buildBlogPostingSchema(post), buildBlogBreadcrumbSchema(post)]);
}
