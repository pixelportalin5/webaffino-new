"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import BlogCard from "@/components/blog/BlogCard";
import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";

const SKELETON_COUNT = 6;

/**
 * @param {{
 *   initialPosts?: import('@/types/wordpress').BlogPost[];
 * }} props
 */
function BlogListing({ initialPosts = [] }) {
  const hasServerPosts = initialPosts.length > 0;
  const fetchStartedRef = useRef(false);

  const [clientPosts, setClientPosts] = useState(null);
  const [loading, setLoading] = useState(!hasServerPosts);
  const [error, setError] = useState("");

  const posts = useMemo(
    () => (clientPosts !== null ? clientPosts : hasServerPosts ? initialPosts : []),
    [clientPosts, hasServerPosts, initialPosts]
  );

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/blogs", {
        headers: { Accept: "application/json" }
      });

      const payload = await response.json();
      const fetchedPosts = payload.posts || [];

      if (!response.ok || fetchedPosts.length === 0) {
        console.error("[BlogListing] fetch returned no posts:", {
          status: response.status,
          error: payload.error,
          debug: payload.debug
        });
        setClientPosts([]);
        setError(payload.error || "We could not load blog posts right now. Please try again in a moment.");
        return;
      }

      setClientPosts(fetchedPosts);
    } catch (err) {
      console.error("[BlogListing] fetch failed:", err);
      setClientPosts([]);
      setError("We could not load blog posts right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasServerPosts || fetchStartedRef.current) {
      return;
    }

    fetchStartedRef.current = true;
    loadPosts();
  }, [hasServerPosts, loadPosts]);

  useEffect(() => {
    console.log("BlogListing render", {
      postCount: posts.length,
      loading,
      hasServerPosts,
      source: clientPosts !== null ? "client" : hasServerPosts ? "server" : "empty"
    });
  });

  if (loading) {
    return (
      <div className="blog-listing-grid" role="status" aria-live="polite" aria-label="Loading blog posts">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <BlogCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-listing-state blog-listing-error" role="alert">
        <p className="font-body mb-4 text-center text-gray-300" style={{ fontFamily: "var(--font-body)" }}>
          {error}
        </p>
        <button
          type="button"
          onClick={loadPosts}
          className="font-body inline-flex items-center justify-center rounded-full bg-[#6D4AFF] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#5A3DE0]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="blog-listing-state" role="status">
        <p className="font-body text-center text-gray-400" style={{ fontFamily: "var(--font-body)" }}>
          No blog posts are available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="blog-listing-grid">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default memo(BlogListing);
