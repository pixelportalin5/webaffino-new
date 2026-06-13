"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ForminatorSignupModal({ open, onClose }) {
  const titleId = useId();
  const descriptionId = useId();
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(360);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleMessage = (event) => {
      if (!event.data || event.data.type !== "contact-form-height") {
        return;
      }

      const nextHeight = Number(event.data.height);
      if (!Number.isFinite(nextHeight) || nextHeight < 320) {
        return;
      }

      setIframeHeight(Math.ceil(nextHeight));
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [open]);

  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      className="forminator-signup-modal fixed inset-0 z-[10050] flex items-center justify-center p-4 sm:p-6"
      onClick={handleBackdropClick}
      aria-hidden={false}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="forminator-signup-modal__panel relative z-10 flex w-full max-w-[640px] max-h-[90vh] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[rgba(10,10,10,0.88)] shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close signup form"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-white/20 hover:bg-white/10"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto px-5 pb-5 pt-6 sm:px-7 sm:pb-7 sm:pt-8">
          <div className="pr-10 text-center sm:pr-12">
            <h2
              id={titleId}
              className="font-[Montserrat,sans-serif] text-[clamp(1.5rem,4vw,2rem)] font-bold leading-tight text-white"
            >
              Turn More Visitors Into Customers
            </h2>
            <p
              id={descriptionId}
              className="mx-auto mt-3 max-w-[34rem] font-[Inter,sans-serif] text-sm leading-relaxed text-neutral-400 sm:text-base"
            >
              Get a free conversion strategy consultation and discover how to
              increase CTA performance across your website.
            </p>
          </div>

          <div className="mt-5 w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/80 p-3 sm:p-4">
            <iframe
              ref={iframeRef}
              title="Sign up form"
              src="/api/contact-form-embed"
              className="block w-full max-w-full border-0 bg-transparent"
              style={{ height: `${iframeHeight}px`, minHeight: "360px" }}
              loading="lazy"
              scrolling="no"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
