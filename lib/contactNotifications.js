import { buildContactNotificationBody } from "@/lib/contactValidation";

const CONTACT_NOTIFICATION_EMAIL =
  process.env.CONTACT_NOTIFICATION_EMAIL || "affiliate@webaffino.com";

const CONTACT_NOTIFICATION_FROM =
  process.env.CONTACT_NOTIFICATION_FROM || "Web Affino <onboarding@resend.dev>";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const CONTACT_WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL || "";

/**
 * @param {{ name: string; email: string; phone: string; message: string }} payload
 * @returns {Promise<{ channel: string; delivered: boolean }>}
 */
export async function sendContactNotification(payload) {
  const body = buildContactNotificationBody(payload);
  const jsonPayload = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    message: payload.message
  };

  if (CONTACT_WEBHOOK_URL) {
    const response = await fetch(CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(jsonPayload),
      cache: "no-store"
    });

    return {
      channel: "webhook",
      delivered: response.ok
    };
  }

  if (RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: CONTACT_NOTIFICATION_FROM,
        to: [CONTACT_NOTIFICATION_EMAIL],
        reply_to: payload.email,
        subject: "New Contact Form Submission",
        text: body
      }),
      cache: "no-store"
    });

    return {
      channel: "resend",
      delivered: response.ok
    };
  }

  console.info("[contact-submit] notification skipped (no webhook or Resend configured)", {
    recipient: CONTACT_NOTIFICATION_EMAIL,
    payload: jsonPayload
  });

  return {
    channel: "log",
    delivered: true
  };
}
