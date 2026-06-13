import BlogListing from "@/components/blog/BlogListing";
import TitleCaseHeading from "@/components/TitleCaseHeading";

/**
 * @param {{
 *   initialPosts?: import('@/types/wordpress').BlogPost[];
 * }} props
 */
export default function BlogsPageContent({ initialPosts = [] }) {
  return (
    <section className="growth-journal-section bg-[#050505] px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-12 text-center md:mb-14">
          <TitleCaseHeading
            as="h1"
            className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #6D4AFF, #9F7AEA)" }}
            >
              Growth
            </span>{" "}
            Journal
          </TitleCaseHeading>
          <p
            className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Deep dives into SEO, performance marketing, and strategies that actually drive revenue for
            your brand.
          </p>
        </div>

        <BlogListing initialPosts={initialPosts} />
      </div>
    </section>
  );
}
