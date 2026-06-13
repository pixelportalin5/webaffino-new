export default function BlogCardSkeleton() {
  return (
    <article
      className="growth-journal-card flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white"
      aria-hidden="true"
    >
      <div className="growth-journal-card__image relative overflow-hidden rounded-t-[12px] bg-[#E5E7EB]">
        <div className="blog-skeleton-shimmer absolute inset-0" />
        <span className="absolute left-3 top-3 z-10 h-5 w-28 rounded-full bg-[#D1D5DB]" />
      </div>

      <div className="growth-journal-card__body p-4">
        <div className="mb-1.5 space-y-2">
          <div className="blog-skeleton-shimmer h-4 w-full rounded bg-[#E5E7EB]" />
          <div className="blog-skeleton-shimmer h-4 w-4/5 rounded bg-[#E5E7EB]" />
        </div>

        <div className="mb-3">
          <div className="blog-skeleton-shimmer h-3 w-full rounded bg-[#F3F4F6]" />
        </div>

        <div className="blog-skeleton-shimmer mt-auto h-8 w-28 shrink-0 rounded-full bg-[#E5E7EB]" />
      </div>
    </article>
  );
}
