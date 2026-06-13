import SiteShell from "@/components/SiteShell";
import BlogPostView from "@/components/blog/BlogPostView";
import BlogPostJsonLd from "@/components/seo/BlogPostJsonLd";
import { buildBlogPostMetadata } from "@/lib/seo/metadata";
import { fetchWordPressPostBySlug } from "@/lib/wordpress";

export const revalidate = 300;

/**
 * @param {{ params: Promise<{ slug: string }> }} props
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await fetchWordPressPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Web Affino",
      robots: { index: false, follow: false }
    };
  }

  return buildBlogPostMetadata(post);
}

/**
 * @param {{ params: Promise<{ slug: string }> }} props
 */
export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  return (
    <SiteShell>
      <BlogPostJsonLd slug={slug} />
      <section className="blog-post-section relative min-h-screen bg-black pb-32 pt-20">
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[400px] w-full max-w-4xl -translate-x-1/2 rounded-full bg-blue-900/20 blur-[120px]" />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 md:px-8">
          <BlogPostView slug={slug} />
        </div>
      </section>
    </SiteShell>
  );
}
