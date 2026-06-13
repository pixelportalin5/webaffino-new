"use client";

import { useCallback, useState } from "react";

const SUPPORT_EMAIL = "affiliate@webaffino.com";

export default function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (event) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SUPPORT_EMAIL);
      }
    } catch {
      // Clipboard may be unavailable; mailto still works.
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="relative inline-block">
      <div
        className={`copy-alert absolute -top-12 left-1/2 z-20 whitespace-nowrap rounded-lg bg-white px-4 py-2 font-body text-sm font-bold text-black shadow-xl ${copied ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        Email Copied!
      </div>

      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        onClick={handleCopy}
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#60A5FA] to-[#C084FC] px-8 py-4 font-heading text-lg font-bold text-white shadow-[0_10px_30px_rgba(192,132,252,0.3)] transition-all hover:scale-105 hover:shadow-[0_15px_40px_rgba(96,165,250,0.5)] active:scale-95 md:px-10 md:py-5 md:text-xl"
      >
        <i
          data-lucide="mail"
          className="h-6 w-6 transition-transform group-hover:-rotate-12"
        />
        {SUPPORT_EMAIL}
      </a>
    </div>
  );
}
