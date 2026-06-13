"use client";

import { useEffect } from "react";
import { runLucideIcons, whenLucideReady } from "@/lib/legacyRuntime";

const LUCIDE_SRC = "https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js";

export default function LucideLoader() {
  useEffect(() => {
    if (window.lucide?.createIcons) {
      runLucideIcons();
      window.dispatchEvent(new Event("lucide:ready"));
      return whenLucideReady(() => {});
    }

    let script = document.querySelector('script[data-lucide-loader="true"]');

    if (!script) {
      script = document.createElement("script");
      script.src = LUCIDE_SRC;
      script.async = true;
      script.dataset.lucideLoader = "true";
      document.body.appendChild(script);
    }

    const handleLoad = () => {
      runLucideIcons();
      window.dispatchEvent(new Event("lucide:ready"));
    };

    script.addEventListener("load", handleLoad);

    if (window.lucide?.createIcons) {
      handleLoad();
    }

    return () => {
      script?.removeEventListener("load", handleLoad);
    };
  }, []);

  return null;
}
