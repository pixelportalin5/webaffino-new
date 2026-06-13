import { SITE_URL } from "@/lib/seo/site";

/** @returns {Promise<import('next').MetadataRoute.Robots>} */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/header", "/footer", "/admin/"]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
