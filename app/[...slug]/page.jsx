import { notFound } from "next/navigation";
import LegacyHtmlPage from "@/components/LegacyHtmlPage";
import SiteOptimisationEnhancements from "@/components/SiteOptimisationEnhancements";
import SiteShell from "@/components/SiteShell";
import JsonLd from "@/components/seo/JsonLd";
import { getFaqItemsForPath } from "@/lib/seo/faqContent";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getStaticPageSeoByPath } from "@/lib/seo/staticPages";
import { buildFaqPageSchema } from "@/lib/seo/schema";
import { getPageBySlug, isFragmentOnlyPage } from "@/lib/legacyPages";

export const dynamicParams = true;

/**
 * @param {{ params: Promise<{ slug?: string[] }> }} props
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugPath = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug.join("/") : "";
  const page = getPageBySlug(resolvedParams?.slug);
  const staticSeo = getStaticPageSeoByPath(slugPath);

  if (!page || !staticSeo) {
    return {};
  }

  return buildPageMetadata({
    title: staticSeo.title,
    description: staticSeo.description,
    path: staticSeo.path,
    noIndex: isFragmentOnlyPage(page.key)
  });
}

/**
 * @param {{ params: Promise<{ slug?: string[] }> }} props
 */
export default async function Page({ params }) {
  const resolvedParams = await params;
  const slugPath = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug.join("/") : "";
  const page = getPageBySlug(resolvedParams?.slug);
  const faqItems = getFaqItemsForPath(slugPath);
  const faqSchema = buildFaqPageSchema(faqItems);

  if (!page) {
    notFound();
  }

  if (isFragmentOnlyPage(page.key)) {
    return <LegacyHtmlPage page={page} />;
  }

  return (
    <SiteShell>
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      <LegacyHtmlPage page={page} />
      {page.key === "siteoptimisation" ? <SiteOptimisationEnhancements /> : null}
    </SiteShell>
  );
}
