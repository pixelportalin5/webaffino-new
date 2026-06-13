"use client";

import { useEffect } from "react";
import { applyTitleCaseToHeadings } from "@/lib/titleCaseHeadings";

export default function TitleCaseHeadings() {
  useEffect(() => {
    applyTitleCaseToHeadings(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) {
            return;
          }

          applyTitleCaseToHeadings(node);
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const handleContentReady = () => {
      applyTitleCaseToHeadings(document);
    };

    window.addEventListener("lenis:content-ready", handleContentReady);

    return () => {
      observer.disconnect();
      window.removeEventListener("lenis:content-ready", handleContentReady);
    };
  }, []);

  return null;
}
