import ContactSection from "@/components/ContactSection";
import SiteShell from "@/components/SiteShell";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getStaticPageSeo } from "@/lib/seo/staticPages";
import { buildLocalBusinessSchema } from "@/lib/seo/schema";

const contactSeo = getStaticPageSeo("contactus");

export const metadata = buildPageMetadata({
  title: contactSeo?.title || "Contact Web Affino | Get In Touch",
  description: contactSeo?.description,
  path: "/contact-us"
});

export default function ContactUsPage() {
  return (
    <SiteShell>
      <JsonLd data={buildLocalBusinessSchema()} />
      <ContactSection />
    </SiteShell>
  );
}
