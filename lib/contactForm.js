import { getForminatorStorageConfig } from "@/lib/contactForminatorStorage";

const CONTACT_SUBMIT_URL = "/api/contact-submit";

const WORDPRESS_SITE =
  process.env.WORDPRESS_SITE_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
  "https://webaffino.com";

const WORDPRESS_CONTACT_URL = `${WORDPRESS_SITE}/contact-us/`;
const FORMINATOR_AJAX_URL = `${WORDPRESS_SITE}/wp-admin/admin-ajax.php`;

const FORM_EMBED_STYLES = `
.contact-form-embed-root,
.contact-form-embed-root * {
  box-sizing: border-box !important;
}

#contact-section .contact-form,
#contact-section .forminator-custom-form,
#contact-section form,
#contact-section .forminator-field,
#contact-section .contact-form-field {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

#contact-section .contact-form,
#contact-section .forminator-custom-form,
#contact-section .forminator-ui {
  text-align: left !important;
}

#contact-section .forminator-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-bottom: 0.5rem !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

#contact-section .forminator-col {
  padding-left: 0 !important;
  padding-right: 0 !important;
  flex: 0 0 100% !important;
  max-width: 100% !important;
}

#contact-section .forminator-field,
#contact-section .contact-form-field {
  margin-bottom: 0.5rem !important;
}

#contact-section .forminator-required {
  color: #f87171 !important;
}

#contact-section .forminator-label,
#contact-section .contact-form-label {
  color: #ffffff !important;
  font-size: 0.95rem !important;
  font-weight: 500 !important;
  margin-bottom: 0.35rem !important;
  font-family: Inter, sans-serif !important;
  display: block !important;
}

#contact-section .forminator-input,
#contact-section .forminator-textarea,
#contact-section .contact-form-input,
#contact-section .contact-form-textarea {
  font-size: 1rem !important;
  padding: 10px 14px !important;
  background-color: #111111 !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 12px !important;
  color: #ffffff !important;
  font-family: Inter, sans-serif !important;
  transition: all 0.3s ease !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  display: block !important;
}

#contact-section .forminator-textarea,
#contact-section .contact-form-textarea {
  min-height: 120px !important;
  max-height: 160px !important;
  height: 120px !important;
  resize: vertical !important;
  line-height: 1.45 !important;
}

#contact-section .forminator-input:focus,
#contact-section .forminator-textarea:focus,
#contact-section .contact-form-input:focus,
#contact-section .contact-form-textarea:focus {
  border-color: #60a5fa !important;
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.2) !important;
  outline: none !important;
  background-color: rgba(255, 255, 255, 0.08) !important;
}

#contact-section .forminator-input.is-invalid,
#contact-section .forminator-textarea.is-invalid,
#contact-section .contact-form-input.is-invalid,
#contact-section .contact-form-textarea.is-invalid {
  border-color: #f87171 !important;
}

#contact-section .contact-form-error {
  color: #fca5a5 !important;
  font-size: 0.8rem !important;
  margin-top: 0.25rem !important;
  font-family: Inter, sans-serif !important;
}

#contact-section .contact-form-status {
  margin-top: 0.75rem !important;
  padding: 0.75rem 1rem !important;
  border-radius: 12px !important;
  font-size: 0.9rem !important;
  font-family: Inter, sans-serif !important;
  display: none;
}

#contact-section .contact-form-status.is-visible {
  display: block !important;
}

#contact-section .contact-form-status.is-success {
  background: rgba(34, 197, 94, 0.12) !important;
  border: 1px solid rgba(34, 197, 94, 0.25) !important;
  color: #86efac !important;
}

#contact-section .contact-form-status.is-error {
  background: rgba(248, 113, 113, 0.12) !important;
  border: 1px solid rgba(248, 113, 113, 0.25) !important;
  color: #fca5a5 !important;
}

#contact-section .forminator-button,
#contact-section .forminator-button,
#contact-section .forminator-button-submit,
#contact-section .contact-form-submit {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  z-index: 2 !important;
  background: linear-gradient(90deg, #60a5fa 0%, #c084fc 100%) !important;
  color: #ffffff !important;
  font-family: Montserrat, sans-serif !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
  padding: 12px 24px !important;
  border-radius: 9999px !important;
  border: none !important;
  box-shadow: 0 10px 25px rgba(192, 132, 252, 0.3) !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  margin-top: 1rem !important;
  cursor: pointer !important;
  text-transform: none !important;
}

#contact-section .forminator-button:hover,
#contact-section .forminator-button-submit:hover,
#contact-section .contact-form-submit:hover {
  transform: translateY(-4px) scale(1.02) !important;
  box-shadow: 0 15px 35px rgba(96, 165, 250, 0.5) !important;
}

#contact-section .forminator-button:disabled,
#contact-section .forminator-button-submit:disabled,
#contact-section .contact-form-submit:disabled {
  opacity: 0.7 !important;
  cursor: not-allowed !important;
  transform: none !important;
}

#contact-section .contact-form-actions {
  margin-top: 1rem !important;
  padding-bottom: 1rem !important;
  flex-shrink: 0 !important;
}
`;

const FORM_FIELD_LABELS = {
  name: "Full Name",
  email: "Email Address",
  phone: "Phone Number",
  message: "Message"
};

/**
 * @param {string} formId
 * @param {Record<string, string>} fieldMap
 * @returns {string}
 */
function buildForminatorFormCardHtml(formId, fieldMap) {
  const formSelector = `forminator-module-${formId}`;

  const fieldBlock = (key, type, inputAttrs = "") => {
    const slug = fieldMap[key];
    const label = FORM_FIELD_LABELS[key];
    const inputId = `forminator-field-${slug}-${formId}`;

    if (type === "textarea") {
      return `
    <div class="forminator-row">
      <div class="forminator-col forminator-col-12">
        <div class="forminator-field forminator-field-textarea ${slug}">
          <label for="${inputId}" class="forminator-label">${label} <span class="forminator-required">*</span></label>
          <textarea id="${inputId}" name="${slug}" class="forminator-textarea" required ${inputAttrs}></textarea>
          <p class="contact-form-error" data-error-for="${key}" hidden></p>
        </div>
      </div>
    </div>`;
    }

    return `
    <div class="forminator-row">
      <div class="forminator-col forminator-col-12">
        <div class="forminator-field forminator-field-text ${slug}">
          <label for="${inputId}" class="forminator-label">${label} <span class="forminator-required">*</span></label>
          <input id="${inputId}" type="${type}" name="${slug}" class="forminator-input" required ${inputAttrs} />
          <p class="contact-form-error" data-error-for="${key}" hidden></p>
        </div>
      </div>
    </div>`;
  };

  return `<div class="w-full relative z-10">
  <div class="forminator-ui forminator-custom-form" data-form-id="${formId}" data-forminator-render="0">
    <form
      id="${formSelector}"
      class="forminator-custom-form forminator-ajax-form"
      method="post"
      data-form-id="${formId}"
      novalidate
    >
      ${fieldBlock("name", "text", 'autocomplete="name" minlength="2"')}
      ${fieldBlock("email", "email", 'autocomplete="email"')}
      ${fieldBlock("phone", "tel", 'autocomplete="tel"')}
      ${fieldBlock("message", "textarea", "")}
      <div class="forminator-row forminator-row-last">
        <div class="forminator-col forminator-col-12">
          <button type="submit" class="forminator-button forminator-button-submit">Send Message</button>
          <p id="contact-form-status" class="contact-form-status" role="status" aria-live="polite"></p>
        </div>
      </div>
    </form>
  </div>
</div>`;
}

/**
 * @param {string} formId
 * @returns {string}
 */
function buildContactFormScript(formId) {
  const { fieldMap } = getForminatorStorageConfig();
  const formSelector = `forminator-module-${formId}`;

  return `<script>
(function () {
  var form = document.getElementById("${formSelector}");
  var statusEl = document.getElementById("contact-form-status");
  var submitUrl = "${CONTACT_SUBMIT_URL}";
  var emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  var fieldSlugs = ${JSON.stringify(fieldMap)};

  function notifyHeight() {
    var root = document.getElementById("contact-section");
    if (!root) {
      return;
    }

    var rootTop = root.getBoundingClientRect().top;
    var contentBottom = 0;
    var nodes = root.querySelectorAll(
      "form, .forminator-row, .forminator-button-submit, .contact-form-status.is-visible"
    );

    nodes.forEach(function (node) {
      var rect = node.getBoundingClientRect();
      if (rect.height > 0) {
        contentBottom = Math.max(contentBottom, rect.bottom - rootTop);
      }
    });

    if (!contentBottom && form) {
      var formRect = form.getBoundingClientRect();
      contentBottom = formRect.bottom - rootTop;
    }

    var height = Math.max(480, Math.ceil(contentBottom + 16));
    window.parent.postMessage({ type: "contact-form-height", height: height }, "*");
  }

  function scheduleHeightNotifications() {
    notifyHeight();
    [50, 150, 400, 800, 1500].forEach(function (delay) {
      window.setTimeout(notifyHeight, delay);
    });
  }

  function setFieldError(fieldName, message) {
    var slug = fieldSlugs[fieldName];
    var input = form.querySelector('[name="' + slug + '"]');
    var error = form.querySelector('[data-error-for="' + fieldName + '"]');

    if (input) {
      input.classList.toggle("is-invalid", Boolean(message));
    }

    if (error) {
      error.textContent = message || "";
      error.hidden = !message;
    }
  }

  function clearErrors() {
    ["name", "email", "phone", "message"].forEach(function (fieldName) {
      setFieldError(fieldName, "");
    });
  }

  function isValidPhone(phone) {
    var digits = String(phone || "").replace(/\\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }

  function validateClient(payload) {
    var errors = {};

    if (!payload.name) {
      errors.name = "Full Name is required.";
    } else if (payload.name.length < 2) {
      errors.name = "Full Name must be at least 2 characters.";
    }

    if (!payload.email) {
      errors.email = "Email Address is required.";
    } else if (!emailPattern.test(payload.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!payload.phone) {
      errors.phone = "Phone Number is required.";
    } else if (!isValidPhone(payload.phone)) {
      errors.phone = "Enter a valid phone number.";
    }

    if (!payload.message) {
      errors.message = "Message is required.";
    }

    return errors;
  }

  function setStatus(message, type) {
    if (!statusEl) {
      return;
    }

    statusEl.textContent = message || "";
    statusEl.className = "contact-form-status";
    if (!message) {
      return;
    }

    statusEl.classList.add("is-visible", type === "success" ? "is-success" : "is-error");
    notifyHeight();
  }

  function getPayload() {
    return {
      name: (form.querySelector('[name="' + fieldSlugs.name + '"]').value || "").trim(),
      email: (form.querySelector('[name="' + fieldSlugs.email + '"]').value || "").trim(),
      phone: (form.querySelector('[name="' + fieldSlugs.phone + '"]').value || "").trim(),
      message: (form.querySelector('[name="' + fieldSlugs.message + '"]').value || "").trim()
    };
  }

  if (!form) {
    return;
  }

  form.addEventListener("input", function () {
    clearErrors();
    setStatus("", "");
    notifyHeight();
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors();
    setStatus("", "");

    var payload = getPayload();
    var errors = validateClient(payload);
    var fieldNames = Object.keys(errors);

    if (fieldNames.length) {
      fieldNames.forEach(function (fieldName) {
        setFieldError(fieldName, errors[fieldName]);
      });
      notifyHeight();
      return;
    }

    var submitButton = form.querySelector('[type="submit"]');
    var defaultButtonLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    submitButton.setAttribute("aria-busy", "true");

    try {
      var response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      var result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors) {
          Object.keys(result.errors).forEach(function (fieldName) {
            setFieldError(fieldName, result.errors[fieldName]);
          });
        }

        setStatus(result.message || "Unable to send your message. Please try again.", "error");
        notifyHeight();
        return;
      }

      form.reset();
      setStatus(result.message || "Thank you. Your message has been sent successfully.", "success");
      notifyHeight();
    } catch (error) {
      setStatus("Unable to send your message. Please try again.", "error");
      notifyHeight();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonLabel;
      submitButton.removeAttribute("aria-busy");
      notifyHeight();
    }
  });

  window.addEventListener("load", scheduleHeightNotifications);
  window.addEventListener("resize", notifyHeight);

  if (typeof ResizeObserver !== "undefined") {
    var root = document.getElementById("contact-section");
    if (root) {
      new ResizeObserver(notifyHeight).observe(root);
    }
    if (form) {
      new ResizeObserver(notifyHeight).observe(form);
    }
  }

  scheduleHeightNotifications();
})();
</script>`;
}

/**
 * @param {string} formId
 * @returns {Promise<string | null>}
 */
async function fetchForminatorFormFromWordPress(formId) {
  try {
    const response = await fetch(FORMINATOR_AJAX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*",
        Referer: WORDPRESS_CONTACT_URL,
        "User-Agent": "WebAffino-Next/1.0"
      },
      body: new URLSearchParams({
        action: "forminator_load_form",
        form_id: formId,
        is_ajax_load: "true"
      }).toString(),
      cache: "no-store"
    });

    if (response.ok) {
      const payload = await response.json();

      if (payload?.success && typeof payload.data === "string" && payload.data.includes("forminator")) {
        return `<div class="w-full relative z-10">${payload.data}</div>`;
      }
    }
  } catch {
    // Fall through to page extraction.
  }

  try {
    const pageResponse = await fetch(WORDPRESS_CONTACT_URL, {
      headers: { "User-Agent": "WebAffino-Next/1.0" },
      cache: "no-store"
    });

    if (pageResponse.ok) {
      const html = await pageResponse.text();
      const pattern = new RegExp(
        `<form[^>]*id=["']forminator-module-${formId}["'][\\s\\S]*?</form>`,
        "i"
      );
      const match = html.match(pattern);

      if (match?.[0]) {
        return `<div class="w-full relative z-10">${match[0]}</div>`;
      }
    }
  } catch {
    // Fall through to local Forminator markup.
  }

  return null;
}

/**
 * @returns {Promise<{
 *   formCardHtml: string;
 *   forminatorScripts: string;
 *   source: "forminator-remote" | "forminator-local";
 *   formId: string;
 *   debug: {
 *     liveHtmlLength: number;
 *     apiHtmlLength: number;
 *     detectedFormId: string;
 *   };
 * }>}
 */
export async function fetchContactFormEmbedParts() {
  const { formId, fieldMap } = getForminatorStorageConfig();
  let source = "forminator-local";
  let liveHtmlLength = 0;

  let formCardHtml = await fetchForminatorFormFromWordPress(formId);

  if (formCardHtml) {
    source = "forminator-remote";
    liveHtmlLength = formCardHtml.length;
  } else {
    formCardHtml = buildForminatorFormCardHtml(formId, fieldMap);
  }

  return {
    formCardHtml,
    forminatorScripts: buildContactFormScript(formId),
    source,
    formId,
    debug: {
      liveHtmlLength,
      apiHtmlLength: formCardHtml.length,
      detectedFormId: formId
    }
  };
}

/**
 * @param {{
 *   formCardHtml: string;
 *   forminatorScripts: string;
 *   formId?: string;
 * }} parts
 * @returns {string}
 */
export function buildContactFormEmbedDocument(parts) {
  const { formCardHtml, forminatorScripts } = parts;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    html,
    body {
      margin: 0;
      padding: 0 0 8px;
      background: #0A0A0A;
      color: #ffffff;
      font-family: Inter, sans-serif;
      overflow-x: hidden;
      overflow-y: visible;
      height: auto !important;
      min-height: 0 !important;
    }

    #contact-section,
    .contact-form-embed-root {
      width: 100%;
      max-width: 100%;
      overflow: visible;
      padding-bottom: 8px;
      height: auto !important;
      min-height: 0 !important;
    }

    .contact-form-embed-root .w-full {
      width: 100% !important;
      max-width: 100% !important;
    }

    form[id^="forminator-module-"] {
      display: block !important;
    }

    ${FORM_EMBED_STYLES}
  </style>
</head>
<body>
  <div id="contact-section" class="contact-form-embed-root">
    ${formCardHtml}
  </div>
  ${forminatorScripts}
</body>
</html>`;
}

export function getWordPressContactUrl() {
  return "https://webaffino.com/contact-us/";
}
