import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_BLOG_IMAGE } from "@/lib/wordpress";
import { toTitleCaseText } from "@/lib/toTitleCase";

const IMAGE_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

/**
 * @param {{
 *   post: import('@/types/wordpress').BlogPost;
 * }} props
 */
function BlogCard({ post }) {
  const imageSrc = post.featuredImage || PLACEHOLDER_BLOG_IMAGE;

  console.log("BlogCard render", post.id);

  return (
    <article className="growth-journal-card group flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white transition-transform duration-300 ease-in-out hover:-translate-y-[6px]">
      <div className="growth-journal-card__image relative overflow-hidden rounded-t-[12px] bg-neutral-100">
        <Image
          src={imageSrc}
          alt={post.featuredAlt}
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />

        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#3E6B3D] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {post.category}
        </span>
      </div>

      <div className="growth-journal-card__body p-4">
        <h2 className="growth-journal-card__title mb-1.5 text-[18px] font-semibold leading-snug text-black">
          {toTitleCaseText(post.title)}
        </h2>

        <p className="growth-journal-card__excerpt mb-3 text-[14px] leading-relaxed text-[#6B7280]">
          {post.excerpt}
        </p>

        <Link
          href={`/blogs/${post.slug}`}
          className="mt-auto inline-flex w-fit shrink-0 items-center justify-center rounded-full bg-[#6D4AFF] px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#5A3DE0]"
        >
          Read Article
        </Link>
      </div>
    </article>
  );
}

export default memo(BlogCard);
