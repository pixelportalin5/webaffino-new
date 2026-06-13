export function runLucideIcons(root = document) {
  if (typeof window === "undefined" || !window.lucide?.createIcons) {
    return false;
  }

  if (root && root !== document) {
    window.lucide.createIcons({ root });
  } else {
    window.lucide.createIcons();
  }
  return true;
}

export function whenLucideReady(callback, attempts = 40) {
  if (runLucideIcons()) {
    callback();
    return () => {};
  }

  let cancelled = false;
  let tries = 0;

  const onReady = () => {
    if (!cancelled && runLucideIcons()) {
      callback();
    }
  };

  window.addEventListener("lucide:ready", onReady);

  const timer = window.setInterval(() => {
    tries += 1;
    if (cancelled) {
      return;
    }

    if (runLucideIcons()) {
      window.clearInterval(timer);
      callback();
      return;
    }

    if (tries >= attempts) {
      window.clearInterval(timer);
    }
  }, 100);

  return () => {
    cancelled = true;
    window.removeEventListener("lucide:ready", onReady);
    window.clearInterval(timer);
  };
}

export function dispatchLegacyDomReady() {
  if (typeof document === "undefined") {
    return;
  }

  const event = new Event("DOMContentLoaded", { bubbles: true, cancelable: true });
  document.dispatchEvent(event);
}

export function runLegacyScripts(scripts = []) {
  for (const script of scripts) {
    try {
      // eslint-disable-next-line no-new-func
      new Function(script).call(window);
    } catch (error) {
      console.error("Legacy page script failed:", error);
    }
  }

  dispatchLegacyDomReady();
}
