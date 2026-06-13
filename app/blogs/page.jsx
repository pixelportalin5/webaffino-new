import SiteShell from "@/components/SiteShell";
import BlogsPageContent from "@/components/blog/BlogsPageContent";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { BLOGS_INDEX_SEO } from "@/lib/seo/staticPages";
import { fetchWordPressPosts } from "@/lib/wordpress";

export const metadata = buildPageMetadata({
  title: BLOGS_INDEX_SEO.title,
  description: BLOGS_INDEX_SEO.description,
  path: BLOGS_INDEX_SEO.path
});

export const revalidate = 300;

export default async function BlogsPage() {
  const posts = await fetchWordPressPosts();

  console.log("BlogsPage render", { postCount: posts.length });

  return (
    <SiteShell>
      <BlogsPageContent initialPosts={posts} />
    </SiteShell>
  );
}
