const WORDPRESS_SITE =
  process.env.WORDPRESS_SITE_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
  "https://webaffino.com";

const FORMINATOR_AJAX_URL = `${WORDPRESS_SITE}/wp-admin/admin-ajax.php`;
const WORDPRESS_CONTACT_URL = `${WORDPRESS_SITE}/contact-us/`;

const FORMINATOR_FORM_ID =
  process.env.WORDPRESS_FORMINATOR_FORM_ID || "6427";

const FORMINATOR_FIELD_MAP = {
  name: process.env.FORMINATOR_FIELD_NAME || "name-1",
  email: process.env.FORMINATOR_FIELD_EMAIL || "email-1",
  phone: process.env.FORMINATOR_FIELD_PHONE || "phone-1",
  message: process.env.FORMINATOR_FIELD_MESSAGE || "textarea-1"
};

/**
 * @returns {Promise<string>}
 */
async function getForminatorNonce() {
  const body = new URLSearchParams({
    action: "forminator_get_nonce",
    form_id: FORMINATOR_FORM_ID
  });

  const response = await fetch(FORMINATOR_AJAX_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json, text/plain, */*",
      "User-Agent": "WebAffino-Next/1.0",
      Referer: WORDPRESS_CONTACT_URL
    },
    body: body.toString(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Forminator nonce request failed (${response.status}).`);
  }

  const payload = await response.json();

  if (!payload?.success || typeof payload.data !== "string" || !payload.data) {
    throw new Error("Forminator nonce was not returned.");
  }

  return payload.data;
}

/**
 * @param {{ name: string; email: string; phone: string; message: string }} contact
 * @returns {URLSearchParams}
 */
function buildForminatorSubmissionBody(contact, nonce) {
  const body = new URLSearchParams({
    action: "forminator_submit_form_custom-forms",
    form_id: FORMINATOR_FORM_ID,
    forminator_nonce: nonce,
    current_url: WORDPRESS_CONTACT_URL,
    referer_url: WORDPRESS_CONTACT_URL
  });

  body.set(FORMINATOR_FIELD_MAP.name, contact.name);
  body.set(FORMINATOR_FIELD_MAP.email, contact.email);
  body.set(FORMINATOR_FIELD_MAP.phone, contact.phone);
  body.set(FORMINATOR_FIELD_MAP.message, contact.message);

  return body;
}

/**
 * @param {{ name: string; email: string; phone: string; message: string }} payload
 * @returns {Promise<{
 *   stored: boolean;
 *   channel: "forminator";
 *   formId: string;
 *   entryId: string | null;
 *   error: string | null;
 * }>}
 */
export async function storeContactSubmissionInForminator(payload) {
  try {
    const nonce = await getForminatorNonce();
    const body = buildForminatorSubmissionBody(payload, nonce);
    const fields = Object.fromEntries(
      [...body.entries()].filter(
        ([key]) =>
          !["action", "form_id", "forminator_nonce", "current_url", "referer_url"].includes(
            key
          )
      )
    );

    console.info("[forminator-storage] submitting", {
      formId: FORMINATOR_FORM_ID,
      fields,
      endpoint: FORMINATOR_AJAX_URL
    });

    const response = await fetch(FORMINATOR_AJAX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*",
        "User-Agent": "WebAffino-Next/1.0",
        Referer: WORDPRESS_CONTACT_URL
      },
      body: body.toString(),
      cache: "no-store"
    });

    const responseText = await response.text();
    let result = null;

    try {
      result = JSON.parse(responseText);
    } catch {
      console.error("[forminator-storage] invalid JSON response", {
        httpStatus: response.status,
        responseBody: responseText.slice(0, 1000)
      });

      return {
        stored: false,
        channel: "forminator",
        formId: FORMINATOR_FORM_ID,
        entryId: null,
        error: "WordPress returned an invalid Forminator response."
      };
    }

    console.info("[forminator-storage] response", {
      httpStatus: response.status,
      success: result?.success ?? false,
      responseBody: result,
      forminatorErrors:
        result?.success === false
          ? result?.data?.errors || result?.data?.message || result?.data
          : null
    });

    if (!response.ok || !result?.success) {
      const errorMessage =
        typeof result?.data === "string"
          ? result.data
          : result?.data?.message ||
            "Forminator rejected the submission.";

      return {
        stored: false,
        channel: "forminator",
        formId: FORMINATOR_FORM_ID,
        entryId: null,
        error: errorMessage
      };
    }

    const entryId =
      result?.data?.entry_id ||
      result?.data?.entryId ||
      result?.data?.id ||
      null;

    return {
      stored: true,
      channel: "forminator",
      formId: FORMINATOR_FORM_ID,
      entryId: entryId ? String(entryId) : null,
      error: null
    };
  } catch (error) {
    return {
      stored: false,
      channel: "forminator",
      formId: FORMINATOR_FORM_ID,
      entryId: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to store the submission in WordPress."
    };
  }
}

export function getForminatorStorageConfig() {
  return {
    formId: FORMINATOR_FORM_ID,
    fieldMap: FORMINATOR_FIELD_MAP
  };
}
