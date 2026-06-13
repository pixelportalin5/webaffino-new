import { LegacyFragment } from "@/components/LegacyHtmlPage";
import { getPageByKey } from "@/lib/legacyPages";

export default function Header() {
  return <LegacyFragment page={getPageByKey("header")} />;
}
