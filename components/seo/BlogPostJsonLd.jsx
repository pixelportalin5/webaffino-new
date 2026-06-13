import JsonLd from "@/components/seo/JsonLd";
import { fetchWordPressPostBySlug } from "@/lib/wordpress";
import { buildBlogPostSchema } from "@/lib/seo/schema";

/**
 * Server-rendered JSON-LD for blog articles.
 * @param {{ slug: string }} props
 */
export default async function BlogPostJsonLd({ slug }) {
  const post = await fetchWordPressPostBySlug(slug);

  if (!post) {
    return null;
  }

  return <JsonLd data={buildBlogPostSchema(post)} />;
}
