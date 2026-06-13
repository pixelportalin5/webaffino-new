import SiteShell from "@/components/SiteShell";
import HomePage from "@/components/pages/HomePage";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getStaticPageSeo } from "@/lib/seo/staticPages";
import { buildHomeSchema } from "@/lib/seo/schema";

const homeSeo = getStaticPageSeo("home");

export const metadata = buildPageMetadata({
  title: homeSeo?.title || "Web Affino | Growth That Drives Revenue",
  description: homeSeo?.description,
  path: "/"
});

export default function Page() {
  return (
    <SiteShell>
      <JsonLd data={buildHomeSchema()} />
      <HomePage />
    </SiteShell>
  );
}
