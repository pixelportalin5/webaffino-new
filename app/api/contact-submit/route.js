import { sendContactNotification } from "@/lib/contactNotifications";
import {
  getContactStorageConfig,
  storeContactSubmission
} from "@/lib/contactStorage";
import { validateContactPayload } from "@/lib/contactValidation";

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function POST(request) {
  try {
    const input = await request.json();
    const validation = validateContactPayload(input);

    if (!validation.ok) {
      return Response.json(
        {
          success: false,
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    const payload = validation.data;
    const storageConfig = getContactStorageConfig();

    console.info("[contact-submit] storing submission", {
      formId: storageConfig.formId ?? storageConfig.mode,
      fields: payload,
      endpoint:
        storageConfig.mode === "forminator"
          ? "https://webaffino.com/wp-admin/admin-ajax.php"
          : storageConfig.endpoint
    });

    const storage = await storeContactSubmission(payload);

    console.info("[contact-submit] storage result", {
      stored: storage.stored,
      channel: storage.channel,
      entryId: storage.entryId,
      error: storage.error
    });

    if (!storage.stored) {
      console.error("[contact-submit] WordPress storage failed", {
        channel: storage.channel,
        error: storage.error,
        config: storageConfig
      });

      return Response.json(
        {
          success: false,
          message:
            "Your message could not be saved right now. Please try again shortly."
        },
        { status: 502 }
      );
    }

    const notification = await sendContactNotification(payload);

    if (!notification.delivered) {
      console.warn("[contact-submit] notification failed after storage", {
        channel: notification.channel,
        storageChannel: storage.channel,
        entryId: storage.entryId
      });
    }

    return Response.json(
      {
        success: true,
        message: "Thank you. Your message has been sent successfully."
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unable to process your submission. Please try again."
      },
      { status: 500 }
    );
  }
}
