"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function normalizePath(path) {
  if (!path) {
    return "/";
  }

  const cleaned = path.replace(/\/+$/, "") || "/";
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}

export default function NavActiveState() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) {
      return undefined;
    }

    const currentPath = normalizePath(pathname);

    header.querySelectorAll("nav a[href]").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href === "#" || href.startsWith("mailto:")) {
        return;
      }

      let linkPath;

      try {
        linkPath = normalizePath(new URL(href, window.location.origin).pathname);
      } catch {
        return;
      }

      const isActive = linkPath === currentPath;

      if (isActive) {
        link.setAttribute("aria-current", "page");
        link.classList.add("nav-active");
      } else {
        link.removeAttribute("aria-current");
        link.classList.remove("nav-active");
      }
    });
  }, [pathname]);

  return null;
}
