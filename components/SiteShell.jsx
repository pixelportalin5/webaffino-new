import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NavActiveState from "@/components/NavActiveState";

export default function SiteShell({ children }) {
  return (
    <>
      <NavActiveState />
      <Header />
      <main id="site-main" style={{ minHeight: "50vh" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
