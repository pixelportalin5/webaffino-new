import { debugWordPressConnection, fetchWordPressPosts } from "@/lib/wordpress";

export const revalidate = 300;

export async function GET() {
  const posts = await fetchWordPressPosts();

  if (posts.length > 0) {
    return Response.json({ posts });
  }

  const debug = await debugWordPressConnection();

  return Response.json(
    {
      posts: [],
      error: "We could not load blog posts right now. Please try again in a moment.",
      debug: {
        wpBase: debug.wpBase,
        requestUrl: debug.requestUrl,
        status: debug.status,
        responseType: debug.responseType,
        bodyPreview: debug.bodyPreview
      }
    },
    { status: debug.status >= 400 ? 502 : 200 }
  );
}
