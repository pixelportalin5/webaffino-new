import { fetchWordPressPosts } from "@/lib/wordpress";
import { getStaticSitemapEntries } from "@/lib/seo/staticPages";
import { blogCanonicalUrl } from "@/lib/seo/site";

export const revalidate = 300;

/** @returns {Promise<import('next').MetadataRoute.Sitemap>} */
export default async function sitemap() {
  const staticEntries = getStaticSitemapEntries();
  const posts = await fetchWordPressPosts();

  /** @type {import('next').MetadataRoute.Sitemap} */
  const routes = staticEntries.map((entry) => ({
    url: entry.url,
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority
  }));

  for (const post of posts) {
    routes.push({
      url: blogCanonicalUrl(post.slug),
      lastModified: post.modifiedDate ? new Date(post.modifiedDate) : new Date(post.date),
      changeFrequency: "weekly",
      priority: 0.7
    });
  }

  const seen = new Set();
  return routes.filter((route) => {
    if (seen.has(route.url) || route.url.includes("admin.webaffino")) {
      return false;
    }
    seen.add(route.url);
    return true;
  });
}
