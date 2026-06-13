import ContactSection from "@/components/ContactSection";
import LegacyHtmlPage from "@/components/LegacyHtmlPage";
import { getPageByKey } from "@/lib/legacyPages";

export default function HomePage() {
  const page = getPageByKey("home");

  return (
    <>
      <LegacyHtmlPage page={page} />
      <ContactSection />
    </>
  );
}
