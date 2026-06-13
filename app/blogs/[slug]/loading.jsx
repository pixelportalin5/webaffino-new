export default function BlogPostLoading() {
  return (
    <section className="blog-post-section relative min-h-screen bg-black pb-32 pt-20">
      <div className="relative z-10 mx-auto w-full max-w-[1150px] px-4 md:px-8">
        <div className="blog-listing-state" role="status" aria-live="polite">
          <div className="blog-listing-spinner" aria-hidden="true" />
          <p className="font-body text-center text-gray-400">Loading article...</p>
        </div>
      </div>
    </section>
  );
}
