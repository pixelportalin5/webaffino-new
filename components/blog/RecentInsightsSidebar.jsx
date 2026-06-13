"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PLACEHOLDER_BLOG_IMAGE } from "@/lib/wordpress";
import { toTitleCaseText } from "@/lib/toTitleCase";

const RECENT_COUNT = 4;

/**
 * @param {{ currentSlug: string }} props
 */
export default function RecentInsightsSidebar({ currentSlug }) {
  /** @type {[import('@/types/wordpress').BlogPost[], boolean]} */
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRecentPosts() {
      try {
        const response = await fetch("/api/blogs", {
          headers: { Accept: "application/json" }
        });
        const payload = await response.json();
        const recent = (payload.posts || [])
          .filter((post) => post.slug !== currentSlug)
          .slice(0, RECENT_COUNT);

        if (!cancelled) {
          setPosts(recent);
        }
      } catch (err) {
        console.error("[RecentInsightsSidebar] fetch failed:", err);
        if (!cancelled) {
          setPosts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecentPosts();

    return () => {
      cancelled = true;
    };
  }, [currentSlug]);

  if (!loading && posts.length === 0) {
    return null;
  }

  return (
    <div className="blog-sidebar-track">
      <aside className="blog-sidebar" aria-label="Recent Insights">
        <div className="recent-insights__card">
          <div className="recent-insights__header">
            <span className="recent-insights__icon" aria-hidden="true" />
            <h2 className="recent-insights__title">Recent Insights</h2>
          </div>

          {loading ? (
            <div className="recent-insights__list" role="status" aria-live="polite">
              {Array.from({ length: RECENT_COUNT }, (_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="recent-insights__item recent-insights__item--skeleton"
                >
                  <div className="recent-insights__thumb recent-insights__thumb--skeleton" />
                  <div className="recent-insights__meta">
                    <div className="recent-insights__line recent-insights__line--title" />
                    <div className="recent-insights__line recent-insights__line--date" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="recent-insights__list">
              {posts.map((post) => {
                const formattedDate = new Date(post.date)
                  .toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })
                  .toUpperCase();

                return (
                  <li key={post.id}>
                    <Link href={`/blogs/${post.slug}`} className="recent-insights__item">
                      <div className="recent-insights__thumb">
                        <Image
                          src={post.featuredImage || PLACEHOLDER_BLOG_IMAGE}
                          alt={post.featuredAlt}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="recent-insights__meta">
                        <span className="recent-insights__post-title">
                          {toTitleCaseText(post.title)}
                        </span>
                        <time className="recent-insights__date" dateTime={post.date}>
                          {formattedDate}
                        </time>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
