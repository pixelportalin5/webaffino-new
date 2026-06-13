import { fetchWordPressPostBySlug } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

/**
 * @param {{ params: Promise<{ slug: string }> }} context
 */
export async function GET(_request, { params }) {
  const { slug } = await params;

  const post = await fetchWordPressPostBySlug(slug);

  if (!post) {
    return Response.json({ error: "Post not found." }, { status: 404 });
  }

  return Response.json({ post });
}
