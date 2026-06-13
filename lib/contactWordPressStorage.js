const WORDPRESS_SITE =
  process.env.WORDPRESS_SITE_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
  "https://webaffino.com";

const WORDPRESS_CONTACT_STORAGE_URL =
  process.env.WORDPRESS_CONTACT_STORAGE_URL ||
  `${WORDPRESS_SITE}/wp-json/webaffino/v1/contact-submissions`;

const WORDPRESS_CONTACT_STORAGE_SECRET =
  process.env.WORDPRESS_CONTACT_STORAGE_SECRET || "";

/**
 * @param {{ name: string; email: string; phone: string; message: string }} payload
 * @returns {Promise<{
 *   stored: boolean;
 *   channel: "wordpress-table";
 *   entryId: string | null;
 *   error: string | null;
 * }>}
 */
export async function storeContactSubmissionInWordPressTable(payload) {
  if (!WORDPRESS_CONTACT_STORAGE_SECRET) {
    return {
      stored: false,
      channel: "wordpress-table",
      entryId: null,
      error: "WORDPRESS_CONTACT_STORAGE_SECRET is not configured."
    };
  }

  try {
    const response = await fetch(WORDPRESS_CONTACT_STORAGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-WebAffino-Secret": WORDPRESS_CONTACT_STORAGE_SECRET,
        "User-Agent": "WebAffino-Next/1.0"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        stored: false,
        channel: "wordpress-table",
        entryId: null,
        error: result?.message || "WordPress custom storage rejected the submission."
      };
    }

    return {
      stored: true,
      channel: "wordpress-table",
      entryId: result?.entry_id ? String(result.entry_id) : null,
      error: null
    };
  } catch (error) {
    return {
      stored: false,
      channel: "wordpress-table",
      entryId: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to reach WordPress custom storage."
    };
  }
}
