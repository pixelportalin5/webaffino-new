import { SITE_TYPOGRAPHY_CSS } from "@/lib/siteTypography";

export default function SiteOverrides() {
  return <style data-site-overrides="" dangerouslySetInnerHTML={{ __html: SITE_TYPOGRAPHY_CSS }} />;
}
