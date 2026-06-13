import {
  buildContactFormEmbedDocument,
  fetchContactFormEmbedParts,
  getWordPressContactUrl
} from "@/lib/contactForm";

export const revalidate = 300;

/**
 * @returns {Promise<Response>}
 */
export async function GET(request) {
  try {
    const parts = await fetchContactFormEmbedParts();
    const html = buildContactFormEmbedDocument(parts);
    const debug = parts.debug ?? {};
    const showDebug = new URL(request.url).searchParams.get("debug") === "1";

    if (showDebug) {
      console.info("[contact-form-embed]", {
        formId: parts.formId,
        source: parts.source,
        formCardHtmlLength: parts.formCardHtml.length,
        detectedFormId: debug.detectedFormId,
        liveHtmlLength: debug.liveHtmlLength,
        apiHtmlLength: debug.apiHtmlLength
      });
    }

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Contact-Form-Source": parts.source,
        "X-Contact-Form-Html-Length": String(parts.formCardHtml.length)
      }
    });
  } catch (error) {
    const fallbackUrl = getWordPressContactUrl();

    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    html, body { margin: 0; padding: 0; background: #0a0a0a; }
    iframe { width: 100%; min-height: 720px; border: 0; }
  </style>
</head>
<body>
  <iframe
    title="Contact form"
    src="${fallbackUrl}"
    loading="lazy"
  ></iframe>
  <script>
    window.parent.postMessage({ type: "contact-form-height", height: 720 }, "*");
  </script>
</body>
</html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, s-maxage=60"
        }
      }
    );
  }
}
