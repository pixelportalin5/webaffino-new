import { debugWordPressConnection } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const debug = await debugWordPressConnection();

    return Response.json(debug, {
      status: debug.status >= 400 ? debug.status : 200
    });
  } catch (error) {
    console.error("[API /api/debug-wordpress] probe failed:", error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Debug probe failed",
        wpBase: process.env.WORDPRESS_API_BASE || process.env.NEXT_PUBLIC_WORDPRESS_API_BASE || null
      },
      { status: 500 }
    );
  }
}
