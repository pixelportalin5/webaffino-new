"use client";

import { useId, useState } from "react";
import { getForminatorStorageConfig } from "@/lib/contactForminatorStorage";

const FIELD_LABELS = {
  name: "Full Name",
  email: "Email Address",
  phone: "Phone Number",
  message: "Message"
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * @param {{ name: string; email: string; phone: string; message: string }} payload
 * @returns {Record<string, string>}
 */
function validatePayload(payload) {
  /** @type {Record<string, string>} */
  const errors = {};

  if (!payload.name) {
    errors.name = "Full Name is required.";
  } else if (payload.name.length < 2) {
    errors.name = "Full Name must be at least 2 characters.";
  }

  if (!payload.email) {
    errors.email = "Email Address is required.";
  } else if (!EMAIL_PATTERN.test(payload.email)) {
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

export default function ContactForm() {
  const statusId = useId();
  const { formId } = getForminatorStorageConfig();
  const formDomId = `forminator-module-${formId}`;

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const clearStatus = () => setStatus({ type: "", message: "" });

  const handleChange = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    clearStatus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearStatus();

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim()
    };

    const validationErrors = validatePayload(payload);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors) {
          setErrors(result.errors);
        }

        setStatus({
          type: "error",
          message: result.message || "Unable to send your message. Please try again."
        });
        return;
      }

      setValues({ name: "", email: "", phone: "", message: "" });
      setErrors({});
      setStatus({
        type: "success",
        message: result.message || "Thank you. Your message has been sent successfully."
      });
    } catch {
      setStatus({
        type: "error",
        message: "Unable to send your message. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-section__form-root">
      <div
        className="forminator-ui forminator-custom-form"
        data-form-id={formId}
        data-forminator-render="0"
      >
        <form
          id={formDomId}
          className="forminator-custom-form forminator-ajax-form"
          method="post"
          data-form-id={formId}
          noValidate
          onSubmit={handleSubmit}
        >
          {(["name", "email", "phone"] ).map((field) => {
            const inputId = `forminator-field-${field}-${formId}`;
            const inputType = field === "email" ? "email" : field === "phone" ? "tel" : "text";
            const autoComplete =
              field === "name" ? "name" : field === "email" ? "email" : "tel";

            return (
              <div className="forminator-row" key={field}>
                <div className="forminator-col forminator-col-12">
                  <div className={`forminator-field forminator-field-text ${field}`}>
                    <label htmlFor={inputId} className="forminator-label">
                      {FIELD_LABELS[field]} <span className="forminator-required">*</span>
                    </label>
                    <input
                      id={inputId}
                      type={inputType}
                      name={field}
                      className={`forminator-input${errors[field] ? " is-invalid" : ""}`}
                      required
                      autoComplete={autoComplete}
                      minLength={field === "name" ? 2 : undefined}
                      value={values[field]}
                      onChange={handleChange(field)}
                    />
                    {errors[field] ? (
                      <p className="contact-form-error">{errors[field]}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="forminator-row">
            <div className="forminator-col forminator-col-12">
              <div className="forminator-field forminator-field-textarea message">
                <label htmlFor={`forminator-field-message-${formId}`} className="forminator-label">
                  {FIELD_LABELS.message} <span className="forminator-required">*</span>
                </label>
                <textarea
                  id={`forminator-field-message-${formId}`}
                  name="message"
                  className={`forminator-textarea${errors.message ? " is-invalid" : ""}`}
                  required
                  value={values.message}
                  onChange={handleChange("message")}
                />
                {errors.message ? (
                  <p className="contact-form-error">{errors.message}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="forminator-row forminator-row-last">
            <div className="forminator-col forminator-col-12">
              <button
                type="submit"
                className="forminator-button forminator-button-submit"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
              {status.message ? (
                <p
                  id={statusId}
                  className={`contact-form-status is-visible ${
                    status.type === "success" ? "is-success" : "is-error"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {status.message}
                </p>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
