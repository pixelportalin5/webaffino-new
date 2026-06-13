"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import RecentInsightsSidebar from "@/components/blog/RecentInsightsSidebar";
import { toTitleCaseText } from "@/lib/toTitleCase";

/**
 * @param {{ slug: string }} props
 */
export default function BlogPostView({ slug }) {
  /** @type {[import('@/types/wordpress').BlogPostDetail | null, Function]} */
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const loadPost = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotFound(false);
    setPost(null);

    try {
      const response = await fetch(`/api/blogs/${encodeURIComponent(slug)}`, {
        headers: { Accept: "application/json" },
        cache: "no-store"
      });

      const payload = await response.json();

      if (response.status === 404) {
        setNotFound(true);
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error || `Request failed (${response.status})`);
      }

      setPost(payload.post);
      window.dispatchEvent(new CustomEvent("lenis:content-ready"));
    } catch (err) {
      console.error("[BlogPostView] fetch failed:", err);
      setError("We could not load this article right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  if (loading) {
    return (
      <div className="blog-layout">
        <div className="blog-listing-state" role="status" aria-live="polite">
          <div className="blog-listing-spinner" aria-hidden="true" />
          <p className="font-body text-center text-gray-400" style={{ fontFamily: "var(--font-body)" }}>
            Loading article...
          </p>
        </div>
        <RecentInsightsSidebar currentSlug={slug} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="blog-listing-state blog-listing-error" role="alert">
        <p className="font-body mb-6 text-center text-gray-300" style={{ fontFamily: "var(--font-body)" }}>
          This article could not be found.
        </p>
        <Link
          href="/blogs"
          className="font-body inline-flex items-center justify-center rounded-full bg-[#2563eb] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-listing-state blog-listing-error" role="alert">
        <p className="font-body mb-6 text-center text-gray-300" style={{ fontFamily: "var(--font-body)" }}>
          {error}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={loadPost}
            className="font-body inline-flex items-center justify-center rounded-full bg-[#2563eb] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Try Again
          </button>
          <Link
            href="/blogs"
            className="font-body inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="blog-layout">
      <article className="blog-article">
        <Link
          href="/blogs"
          className="font-body mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          style={{ fontFamily: "var(--font-body)" }}
        >
          ← Back to Blogs
        </Link>

        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <Image
            src={post.featuredImage}
            alt={post.featuredAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
            className="object-cover"
            priority
          />
        </div>

        <span className="font-body mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-200">
          {post.category}
        </span>

        <h1
          className="font-heading mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {toTitleCaseText(post.title)}
        </h1>

        <time
          dateTime={post.date}
          className="font-body mb-8 block text-sm font-semibold uppercase tracking-wider text-gray-400"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {formattedDate}
        </time>

        <div
          className="blog-article-content font-body text-base leading-relaxed text-gray-300 md:text-lg"
          style={{ fontFamily: "var(--font-body)" }}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      <RecentInsightsSidebar currentSlug={slug} />
    </div>
  );
}
