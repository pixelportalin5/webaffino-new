import SiteShell from "@/components/SiteShell";
import AdvertisePage from "@/components/pages/AdvertisePage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ADVERTISE_SEO } from "@/lib/seo/staticPages";

export const metadata = buildPageMetadata({
  title: ADVERTISE_SEO.title,
  description: ADVERTISE_SEO.description,
  path: ADVERTISE_SEO.path
});

export default function AdvertiseRoutePage() {
  return (
    <SiteShell>
      <AdvertisePage />
    </SiteShell>
  );
}
