import LucideLoader from "@/components/LucideLoader";
import SmoothScroll from "@/components/SmoothScroll";
import SiteOverrides from "@/components/SiteOverrides";
import TitleCaseHeadings from "@/components/TitleCaseHeadings";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE
} from "@/lib/seo/site";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s"
  },
  description: DEFAULT_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }]
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://admin.webaffino.com" />
        <link rel="dns-prefetch" href="https://admin.webaffino.com" />
        <link rel="preconnect" href="https://cdn.tailwindcss.com" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <script src="https://cdn.tailwindcss.com" />
      </head>
      <body suppressHydrationWarning>
        <SmoothScroll>
          <LucideLoader />
          <TitleCaseHeadings />
          {children}
          <SiteOverrides />
        </SmoothScroll>
      </body>
    </html>
  );
}
