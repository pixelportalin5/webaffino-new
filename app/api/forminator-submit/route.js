const WORDPRESS_SITE =
  process.env.WORDPRESS_SITE_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
  "https://webaffino.com";

const FORMINATOR_AJAX_URL = `${WORDPRESS_SITE}/wp-admin/admin-ajax.php`;

/**
 * Proxies Forminator submissions to WordPress admin-ajax.php so embedded forms
 * on the Next.js origin can submit without cross-origin restrictions.
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function POST(request) {
  try {
    const body = await request.text();
    const contentType =
      request.headers.get("content-type") || "application/x-www-form-urlencoded";

    const response = await fetch(FORMINATOR_AJAX_URL, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Accept: "application/json, text/plain, */*",
        "User-Agent": "WebAffino-Next/1.0",
        Referer: `${WORDPRESS_SITE}/contact-us/`
      },
      body,
      cache: "no-store"
    });

    const responseBody = await response.text();
    const responseType =
      response.headers.get("content-type") || "application/json; charset=utf-8";

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": responseType,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: "Unable to reach the form submission service. Please try again."
      },
      { status: 502 }
    );
  }
}
