"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import {
  destroyScrollAnimations,
  refreshScrollAnimations,
  setupScrollAnimations
} from "@/lib/smoothScrollAnimations";

import "lenis/dist/lenis.css";

const LENIS_EASING = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

function isBlogArticlePath(pathname) {
  return /^\/blogs\/[^/]+$/.test(pathname ?? "");
}

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }) {
  const pathname = usePathname();
  const lenisRef = useRef(null);
  const tickerRef = useRef(null);
  const cleanupAnimationsRef = useRef(null);
  const refreshTimersRef = useRef([]);
  const [lenisInstance, setLenisInstance] = useState(null);

  const clearRefreshTimers = useCallback(() => {
    refreshTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    refreshTimersRef.current = [];
  }, []);

  const scheduleContentRefresh = useCallback(() => {
    clearRefreshTimers();

    const delays = pathname === "/blogs" ? [120] : [80, 350, 900];

    delays.forEach((delay) => {
      const timer = window.setTimeout(() => {
        const lenis = lenisRef.current;

        if (lenis) {
          ScrollTrigger.update();
          ScrollTrigger.refresh();
        }

        refreshScrollAnimations();
      }, delay);

      refreshTimersRef.current.push(timer);
    });
  }, [clearRefreshTimers, pathname]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shouldUseLenis = !reducedMotionQuery.matches && !isBlogArticlePath(pathname);

    const destroyLenis = () => {
      clearRefreshTimers();

      if (cleanupAnimationsRef.current) {
        cleanupAnimationsRef.current();
        cleanupAnimationsRef.current = null;
      }

      gsap.registerPlugin(ScrollTrigger);
      destroyScrollAnimations();

      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
        tickerRef.current = null;
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        setLenisInstance(null);
      }

      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };

    const initLenis = () => {
      if (!shouldUseLenis || lenisRef.current) {
        return undefined;
      }

      gsap.registerPlugin(ScrollTrigger);

      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      const lenis = new Lenis({
        duration: isMobile ? 1 : 1.2,
        easing: LENIS_EASING,
        smoothWheel: true,
        syncTouch: true,
        syncTouchLerp: isMobile ? 0.1 : 0.075,
        touchMultiplier: 1.15,
        wheelMultiplier: 1,
        autoRaf: false,
        anchors: {
          offset: -88,
          duration: 1.2,
          easing: LENIS_EASING
        },
        allowNestedScroll: true,
        stopInertiaOnNavigate: true
      });

      lenisRef.current = lenis;
      setLenisInstance(lenis);

      document.documentElement.classList.add("lenis", "lenis-smooth");

      lenis.on("scroll", ScrollTrigger.update);

      const tickerFn = (time) => {
        lenis.raf(time * 1000);
      };

      tickerRef.current = tickerFn;
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      cleanupAnimationsRef.current = setupScrollAnimations(lenis);
      scheduleContentRefresh();

      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      const onContentReady = () => {
        scheduleContentRefresh();
      };

      window.addEventListener("resize", handleResize, { passive: true });
      window.addEventListener("lenis:content-ready", onContentReady);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("lenis:content-ready", onContentReady);
        destroyLenis();
      };
    };

    destroyLenis();

    let teardown = initLenis();

    if (!shouldUseLenis) {
      gsap.registerPlugin(ScrollTrigger);
      cleanupAnimationsRef.current = setupScrollAnimations(null);
    }

    const onMotionPreferenceChange = () => {
      const useLenis =
        !reducedMotionQuery.matches && !isBlogArticlePath(pathname);

      if (!useLenis) {
        teardown?.();
        teardown = undefined;
        destroyLenis();

        if (!cleanupAnimationsRef.current) {
          gsap.registerPlugin(ScrollTrigger);
          cleanupAnimationsRef.current = setupScrollAnimations(null);
        }

        return;
      }

      if (!lenisRef.current) {
        teardown = initLenis();
      }
    };

    reducedMotionQuery.addEventListener("change", onMotionPreferenceChange);

    return () => {
      reducedMotionQuery.removeEventListener("change", onMotionPreferenceChange);
      teardown?.();
      destroyLenis();
    };
  }, [clearRefreshTimers, pathname, scheduleContentRefresh]);

  useEffect(() => {
    const lenis = lenisRef.current;

    if (!lenis) {
      return;
    }

    lenis.scrollTo(0, { immediate: true, force: true });
    scheduleContentRefresh();
  }, [pathname, scheduleContentRefresh]);

  return <LenisContext.Provider value={lenisInstance}>{children}</LenisContext.Provider>;
}
