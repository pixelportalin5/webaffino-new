import {
  getForminatorStorageConfig,
  storeContactSubmissionInForminator
} from "@/lib/contactForminatorStorage";
import { storeContactSubmissionInWordPressTable } from "@/lib/contactWordPressStorage";

const CONTACT_STORAGE_MODE =
  process.env.CONTACT_STORAGE_MODE || "forminator";

/**
 * @param {{ name: string; email: string; phone: string; message: string }} payload
 * @returns {Promise<{
 *   stored: boolean;
 *   channel: string;
 *   formId?: string;
 *   entryId: string | null;
 *   error: string | null;
 * }>}
 */
export async function storeContactSubmission(payload) {
  if (CONTACT_STORAGE_MODE === "wordpress-table") {
    return storeContactSubmissionInWordPressTable(payload);
  }

  return storeContactSubmissionInForminator(payload);
}

export function getContactStorageMode() {
  return CONTACT_STORAGE_MODE;
}

export function getContactStorageConfig() {
  if (CONTACT_STORAGE_MODE === "wordpress-table") {
    return {
      mode: "wordpress-table",
      endpoint:
        process.env.WORDPRESS_CONTACT_STORAGE_URL ||
        "https://webaffino.com/wp-json/webaffino/v1/contact-submissions"
    };
  }

  return {
    mode: "forminator",
    ...getForminatorStorageConfig()
  };
}
