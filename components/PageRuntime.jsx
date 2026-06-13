"use client";

import { useEffect } from "react";
import { runLegacyScripts, whenLucideReady } from "@/lib/legacyRuntime";

export default function PageRuntime({ bodyClassName = "", htmlStyle = "", scripts = [] }) {
  useEffect(() => {
    const previousBodyClassName = document.body.className;
    const previousHtmlStyle = document.documentElement.getAttribute("style") || "";

    document.body.className = bodyClassName;

    if (htmlStyle) {
      document.documentElement.setAttribute("style", htmlStyle);
    }

    runLegacyScripts(scripts);
    const stopWaitingForLucide = whenLucideReady(() => {});

    return () => {
      stopWaitingForLucide();
      document.body.className = previousBodyClassName;
      document.documentElement.setAttribute("style", previousHtmlStyle);
    };
  }, [bodyClassName, htmlStyle, scripts]);

  return null;
}
