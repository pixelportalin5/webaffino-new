import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LENIS_EASING = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/** @type {ScrollTrigger[]} */
let activeTriggers = [];

/** @type {gsap.core.Tween[]} */
let activeTweens = [];

/** @type {import('lenis').default | null} */
let activeLenis = null;

function killAllAnimations() {
  activeTriggers.forEach((trigger) => trigger.kill());
  activeTriggers = [];
  activeTweens.forEach((tween) => tween.kill());
  activeTweens = [];
}

export function destroyScrollAnimations() {
  killAllAnimations();
  activeLenis = null;

  if (typeof ScrollTrigger?.scrollerProxy === "function") {
    ScrollTrigger.scrollerProxy(document.documentElement, {});
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasActiveCssAnimation(element) {
  const style = window.getComputedStyle(element);
  const name = style.animationName;

  return Boolean(name && name !== "none");
}

function shouldSkipReveal(element) {
  if (!element || element.closest("header, footer, nav")) {
    return true;
  }

  if (element.closest('[data-legacy-page="contactus"], [data-contact-section]')) {
    return true;
  }

  if (element.closest(".growth-journal-section")) {
    return true;
  }

  if (element.closest(".blog-layout") || element.querySelector(".blog-layout")) {
    return true;
  }

  if (element.classList.contains("blog-article") || element.classList.contains("blog-post-section")) {
    return true;
  }

  if (
    element.classList.contains("animate-fade-up") ||
    element.classList.contains("reveal-on-scroll") ||
    element.classList.contains("hyper-card") ||
    element.classList.contains("blog-listing-spinner") ||
    element.classList.contains("growth-journal-card") ||
    element.classList.contains("growth-journal-section")
  ) {
    return true;
  }

  if (hasActiveCssAnimation(element)) {
    return true;
  }

  return false;
}

function collectRevealTargets() {
  const selectors = [
    ".legacy-page-root > section",
    "#site-main > section",
    ".blog-article",
    ".blog-listing-state",
    "section.py-24",
    "section.py-32"
  ];

  const seen = new Set();
  /** @type {HTMLElement[]} */
  const targets = [];

  for (const selector of selectors) {
    document.querySelectorAll(selector).forEach((node) => {
      if (!(node instanceof HTMLElement) || seen.has(node) || shouldSkipReveal(node)) {
        return;
      }

      seen.add(node);
      targets.push(node);
    });
  }

  return targets;
}

function collectStaggerTargets() {
  /** @type {HTMLElement[]} */
  const containers = [];

  document.querySelectorAll(".blog-listing-grid").forEach((node) => {
    if (!(node instanceof HTMLElement) || node.closest("header, footer, .growth-journal-section")) {
      return;
    }

    if (node.children.length < 2) {
      return;
    }

    containers.push(node);
  });

  return containers;
}

function collectParallaxTargets() {
  /** @type {HTMLElement[]} */
  const targets = [];

  document
    .querySelectorAll(
      '.legacy-page-root section .absolute[class*="blur"], #site-main .absolute[class*="blur"]'
    )
    .forEach((node) => {
      if (!(node instanceof HTMLElement) || node.closest("header, footer")) {
        return;
      }

      if (targets.length > 24) {
        return;
      }

      targets.push(node);
    });

  return targets;
}

function setupFadeUpReveals() {
  const targets = collectRevealTargets();
  const firstLegacySection = document.querySelector(".legacy-page-root > section");

  targets.forEach((target) => {
    if (target === firstLegacySection || target.classList.contains("growth-journal-section")) {
      return;
    }

    const rect = target.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      gsap.set(target, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(target, { opacity: 0, y: 48 });

    const tween = gsap.to(target, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: LENIS_EASING,
      scrollTrigger: {
        trigger: target,
        start: "top 88%",
        end: "top 55%",
        toggleActions: "play none none reverse"
      }
    });

    activeTweens.push(tween);
    if (tween.scrollTrigger) {
      activeTriggers.push(tween.scrollTrigger);
    }
  });
}

function setupStaggerReveals() {
  collectStaggerTargets().forEach((container) => {
    const children = Array.from(container.children).filter(
      (child) => child instanceof HTMLElement && !shouldSkipReveal(child)
    );

    if (children.length < 2) {
      return;
    }

    gsap.set(children, { opacity: 0, y: 36 });

    const tween = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      stagger: 0.1,
      ease: LENIS_EASING,
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    activeTweens.push(tween);
    if (tween.scrollTrigger) {
      activeTriggers.push(tween.scrollTrigger);
    }
  });
}

function setupParallax() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    return;
  }

  collectParallaxTargets().forEach((target) => {
    const tween = gsap.to(target, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: target.parentElement || target,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6
      }
    });

    activeTweens.push(tween);
    if (tween.scrollTrigger) {
      activeTriggers.push(tween.scrollTrigger);
    }
  });
}

function setupHeaderTransition() {
  const header = document.querySelector("header");

  if (!header) {
    return;
  }

  const trigger = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      header.classList.toggle("site-header-scrolled", self.scroll() > 48);
    }
  });

  activeTriggers.push(trigger);
}

/**
 * @param {import('lenis').default | null} lenis
 */
export function setupScrollAnimations(lenis) {
  if (prefersReducedMotion()) {
    return killAllAnimations;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (lenis) {
    activeLenis = lenis;
  }

  if (activeLenis) {
    lenis = activeLenis;
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }

        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    });

    ScrollTrigger.defaults({ scroller: document.documentElement });
  }

  setupFadeUpReveals();
  setupStaggerReveals();
  setupParallax();
  setupHeaderTransition();

  ScrollTrigger.refresh();

  return killAllAnimations;
}

export function refreshScrollAnimations() {
  if (prefersReducedMotion()) {
    return;
  }

  killAllAnimations();
  setupScrollAnimations(activeLenis);
}
