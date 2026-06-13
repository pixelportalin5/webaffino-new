"use client";

import { useEffect, useRef } from "react";

const MIN_HEIGHT = 400;
const MAX_HEIGHT = 720;
const DEFAULT_HEIGHT = 520;

/**
 * @param {{ className?: string; title?: string }} props
 */
export default function ContactFormEmbed({
  className = "contact-section__embed-frame",
  title = "Send us a message"
}) {
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return undefined;
    }

    let latestHeight = DEFAULT_HEIGHT;

    const resize = (height) => {
      if (!height || height < MIN_HEIGHT) {
        return;
      }

      latestHeight = Math.min(Math.ceil(height), MAX_HEIGHT);
      frame.style.height = `${latestHeight}px`;
    };

    const handleMessage = (event) => {
      if (!event.data || event.data.type !== "contact-form-height") {
        return;
      }

      resize(event.data.height);
    };

    const handleLoad = () => {
      resize(DEFAULT_HEIGHT);
    };

    window.addEventListener("message", handleMessage);
    frame.addEventListener("load", handleLoad);

    if (frame.contentDocument?.readyState === "complete") {
      resize(DEFAULT_HEIGHT);
    }

    return () => {
      window.removeEventListener("message", handleMessage);
      frame.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      title={title}
      src="/api/contact-form-embed"
      className={className}
      loading="lazy"
      scrolling="no"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
