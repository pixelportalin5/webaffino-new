import { LegacyFragment } from "@/components/LegacyHtmlPage";
import { getPageByKey } from "@/lib/legacyPages";

export default function Footer() {
  return <LegacyFragment page={getPageByKey("footer")} />;
}
