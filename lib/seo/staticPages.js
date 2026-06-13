import { PAGE_DEFINITIONS } from "@/lib/legacyPageManifest";
import { absoluteUrl } from "@/lib/seo/site";

/** @typedef {{ title: string; description: string; path: string; changeFrequency: import('next').MetadataRoute.Sitemap[number]['changeFrequency']; priority: number; url?: string }} StaticPageSeo */

/** @type {Record<string, StaticPageSeo>} */
const STATIC_PAGE_OVERRIDES = {
  home: {
    title: "Web Affino | Growth That Drives Revenue",
    description:
      "Partner with Web Affino for performance marketing, SEO, lead generation, and digital strategies built to scale revenue.",
    path: "/",
    changeFrequency: "weekly",
    priority: 1
  },
  aboutcompany: {
    title: "About Web Affino | Digital Growth Agency",
    description:
      "Learn about Web Affino, our mission, and how we help brands grow through data-driven marketing and partnerships.",
    path: "/about-company",
    changeFrequency: "monthly",
    priority: 0.8
  },
  contactus: {
    title: "Contact Web Affino | Get In Touch",
    description:
      "Contact Web Affino for partnerships, media inquiries, and growth strategy consultations. Our team responds within 24 hours.",
    path: "/contact-us",
    changeFrequency: "monthly",
    priority: 0.8
  },
  digitalmarketing: {
    title: "Digital Marketing Services | Web Affino",
    description:
      "Holistic digital marketing strategies from Web Affino to improve user journeys, engagement, and revenue.",
    path: "/digital-marketing",
    changeFrequency: "monthly",
    priority: 0.9
  },
  leadgeneration: {
    title: "Lead Generation Services | Web Affino",
    description:
      "End-to-end lead generation strategies from Web Affino to acquire qualified leads and grow your pipeline.",
    path: "/lead-generation",
    changeFrequency: "monthly",
    priority: 0.9
  },
  performancemarketing: {
    title: "Performance Marketing | Web Affino",
    description:
      "Performance marketing campaigns across search, social, and display focused on measurable ROI and revenue.",
    path: "/performance-marketing",
    changeFrequency: "monthly",
    priority: 0.9
  },
  seocontentstratergy: {
    title: "SEO & Content Strategy | Web Affino",
    description:
      "Search-optimized content and SEO strategy from Web Affino that attracts high-intent traffic and builds authority.",
    path: "/seo-content-strategy",
    changeFrequency: "monthly",
    priority: 0.9
  },
  siteoptimisation: {
    title: "Site Optimization Services | Web Affino",
    description:
      "Improve site speed, UX, and conversion performance with Web Affino site optimization services.",
    path: "/site-optimisation",
    changeFrequency: "monthly",
    priority: 0.9
  },
  ourmediaproperties: {
    title: "Our Media Properties | Web Affino",
    description:
      "Explore Web Affino media properties and partnership opportunities across high-intent vertical audiences.",
    path: "/our-media-properties",
    changeFrequency: "monthly",
    priority: 0.7
  }
};

/** @type {StaticPageSeo} */
export const BLOGS_INDEX_SEO = {
  title: "Growth Journal | Web Affino Blog",
  description:
    "Insights on SEO, performance marketing, affiliate growth, and digital strategies from the Web Affino team.",
  path: "/blogs",
  changeFrequency: "daily",
  priority: 0.9
};

/** @type {StaticPageSeo} */
export const ADVERTISE_SEO = {
  title: "Advertise With Us | Web Affino",
  description:
    "Advertise with Web Affino through banner ads, featured placements, product promotions, and strategic collaborations.",
  path: "/advertise",
  changeFrequency: "monthly",
  priority: 0.7
};

/**
 * @returns {StaticPageSeo[]}
 */
export function getStaticSitemapEntries() {
  const entries = Object.entries(PAGE_DEFINITIONS)
    .filter(([key]) => !["header", "footer"].includes(key))
    .map(([key, definition]) => {
      const override = STATIC_PAGE_OVERRIDES[key];
      const primarySlug = definition.slugs[0];
      const path = override?.path || (primarySlug ? `/${primarySlug}` : "/");

      return {
        title: override?.title || definition.fallbackTitle,
        description: override?.description || DEFAULT_DESCRIPTION_FALLBACK(definition.fallbackTitle),
        path,
        changeFrequency: override?.changeFrequency || "monthly",
        priority: override?.priority || 0.7
      };
    });

  entries.push(BLOGS_INDEX_SEO, ADVERTISE_SEO);

  return entries.map((entry) => ({
    ...entry,
    url: absoluteUrl(entry.path)
  }));
}

/**
 * @param {string} key
 * @returns {StaticPageSeo | null}
 */
export function getStaticPageSeo(key) {
  if (key === "blogs") {
    return BLOGS_INDEX_SEO;
  }
  if (key === "advertise") {
    return ADVERTISE_SEO;
  }

  const definition = PAGE_DEFINITIONS[key];
  if (!definition) {
    return null;
  }

  const override = STATIC_PAGE_OVERRIDES[key];
  const primarySlug = definition.slugs[0];
  const path = override?.path || (primarySlug ? `/${primarySlug}` : "/");

  return {
    title: override?.title || definition.fallbackTitle,
    description: override?.description || DEFAULT_DESCRIPTION_FALLBACK(definition.fallbackTitle),
    path,
    changeFrequency: override?.changeFrequency || "monthly",
    priority: override?.priority || 0.7
  };
}

/**
 * @param {string} slugPath
 * @returns {StaticPageSeo | null}
 */
export function getStaticPageSeoByPath(slugPath) {
  const normalized = slugPath.replace(/^\/+|\/+$/g, "");

  if (!normalized) {
    return getStaticPageSeo("home");
  }

  if (normalized === "blogs") {
    return BLOGS_INDEX_SEO;
  }

  if (normalized === "advertise") {
    return ADVERTISE_SEO;
  }

  for (const [key, definition] of Object.entries(PAGE_DEFINITIONS)) {
    if (definition.slugs.includes(normalized)) {
      return getStaticPageSeo(key);
    }
  }

  return null;
}

/**
 * @param {string} title
 * @returns {string}
 */
function DEFAULT_DESCRIPTION_FALLBACK(title) {
  return `${title.replace(/\s*-\s*Web Affino\s*$/i, "")} — Web Affino helps brands grow through performance marketing and digital strategy.`;
}
