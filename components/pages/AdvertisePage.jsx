"use client";

import { useEffect, useRef } from "react";
import CopyEmailButton from "@/components/advertise/CopyEmailButton";
import OpportunityCard from "@/components/advertise/OpportunityCard";
import TitleCaseHeading from "@/components/TitleCaseHeading";
import { whenLucideReady } from "@/lib/legacyRuntime";

import "@/app/advertise/advertise.css";

const OPPORTUNITIES = [
  {
    icon: "layout-template",
    title: "Banner Ads",
    description:
      "Command attention with highly visible display placements strategically positioned to capture user intent.",
    theme: "blue",
    animationDelay: ""
  },
  {
    icon: "star",
    title: "Product Features",
    description:
      "Showcase your top products or exclusive services directly to a massive, conversion-ready audience.",
    theme: "purple",
    animationDelay: "delay-100"
  },
  {
    icon: "handshake",
    title: "Collaborations",
    description:
      "Partner with us on bespoke promotional campaigns and tailored affiliate growth strategies.",
    theme: "green",
    animationDelay: "delay-200"
  }
];

export default function AdvertisePage() {
  const pageRef = useRef(null);

  useEffect(() => {
    const stopWaitingForLucide = whenLucideReady(() => {
      const root = pageRef.current;
      if (root && window.lucide?.createIcons) {
        window.lucide.createIcons({ root });
      }
    });

    return stopWaitingForLucide;
  }, []);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target;
          target.style.opacity = "1";
          target.style.transform = "translateY(0)";
          observer.unobserve(target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.1
      }
    );

    root.querySelectorAll("[data-advertise-reveal]").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef} className="advertise-page relative min-h-screen overflow-x-hidden antialiased">
      <div className="pointer-events-none fixed left-1/2 top-0 z-0 h-[600px] w-full max-w-[1600px] -translate-x-1/2 rounded-full bg-blue-900/10 blur-[150px]" />
      <div className="bg-grid-pattern pointer-events-none fixed inset-0 z-0 opacity-[0.15]" />

      <section className="relative flex flex-col justify-center overflow-hidden border-b border-white/5 pb-16 pt-36">
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-12 xl:px-[50px]">
          <div
            className="animate-fade-up mx-auto max-w-4xl text-center"
            data-advertise-reveal=""
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#60A5FA] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#60A5FA]" />
              </span>
              <span className="eyebrow text-blue-300">Media & Partnerships</span>
            </div>

            <TitleCaseHeading as="h1" className="h-hero mb-6 text-white">
              Advertise With <span className="text-gradient">Us.</span>
            </TitleCaseHeading>

            <p className="body-lead mx-auto mb-4 max-w-3xl text-neutral-400">
              Interested in advertising with Web Affino? Reach a highly engaged audience ready to
              discover and connect with your brand.
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-[#050505] py-24">
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-12 xl:px-[50px]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {OPPORTUNITIES.map((opportunity) => (
              <OpportunityCard key={opportunity.title} {...opportunity} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/5 bg-black py-24">
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-12 xl:px-[50px]">
          <div className="animate-fade-up" data-advertise-reveal="">
            <div className="partnership-card-stage">
              <div className="partnership-card-glow" aria-hidden="true" />
              <div className="partnership-card">
                <div className="partnership-card__ambient" aria-hidden="true" />
                <div className="partnership-card__inner">
                  <TitleCaseHeading as="h2" className="partnership-card__heading h-section">
                    Let&apos;s build a partnership.
                  </TitleCaseHeading>
                  <p className="partnership-card__description body-lead">
                    For all inquiries, media kits, or custom promotion requests, please drop us an
                    email. Our partnerships team responds within 24 hours.
                  </p>

                  <div className="partnership-card__cta">
                    <CopyEmailButton />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="animate-fade-up delay-100 mt-20 text-center"
            data-advertise-reveal=""
          >
            <p className="body-text text-neutral-500">
              Thank you for supporting{" "}
              <strong className="font-semibold text-white">Web Affino!</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
