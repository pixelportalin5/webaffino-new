const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhoneNumber(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * @param {Record<string, unknown>} input
 * @returns {{
 *   ok: true;
 *   data: { name: string; email: string; phone: string; message: string };
 * } | {
 *   ok: false;
 *   errors: Record<string, string>;
 * }}
 */
export function validateContactPayload(input) {
  const name = normalizeString(input?.name);
  const email = normalizeString(input?.email);
  const phone = normalizeString(input?.phone);
  const message = normalizeString(input?.message);
  const errors = {};

  if (!name) {
    errors.name = "Full Name is required.";
  } else if (name.length < 2) {
    errors.name = "Full Name must be at least 2 characters.";
  }

  if (!email) {
    errors.email = "Email Address is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Phone Number is required.";
  } else if (!isValidPhoneNumber(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!message) {
    errors.message = "Message is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: { name, email, phone, message }
  };
}

/**
 * @param {{ name: string; email: string; phone: string; message: string }} payload
 * @returns {string}
 */
export function buildContactNotificationBody(payload) {
  return [
    "Name:",
    payload.name,
    "",
    "Email:",
    payload.email,
    "",
    "Phone:",
    payload.phone,
    "",
    "Message:",
    payload.message
  ].join("\n");
}
