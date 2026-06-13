export const FRAGMENT_ONLY_PAGE_KEYS = new Set(["header", "footer"]);

/** @type {Record<string, { sourceFile: string; fallbackTitle: string; slugs: string[] }>} */
export const PAGE_DEFINITIONS = {
  home: {
    sourceFile: "home.html",
    fallbackTitle: "Web Affino - Growth That Drives Revenue",
    slugs: []
  },
  aboutcompany: {
    sourceFile: "aboutcompany.html",
    fallbackTitle: "About Company - Web Affino",
    slugs: ["about-company", "aboutcompany"]
  },
  contactus: {
    sourceFile: "contactus.html",
    fallbackTitle: "Contact Us - Web Affino",
    slugs: ["contact-us", "contactus"]
  },
  digitalmarketing: {
    sourceFile: "digitalmarketing.html",
    fallbackTitle: "Digital Marketing - Web Affino",
    slugs: ["digital-marketing", "digital-marketing-2", "digitalmarketing"]
  },
  leadgeneration: {
    sourceFile: "leadgeneration.html",
    fallbackTitle: "Lead Generation - Web Affino",
    slugs: ["lead-generation", "leads-generation", "leadgeneration"]
  },
  ourmediaproperties: {
    sourceFile: "ourmediaproperties.html",
    fallbackTitle: "Our Media Properties - Web Affino",
    slugs: ["our-media-properties", "ourmediaproperties"]
  },
  performancemarketing: {
    sourceFile: "performancemarketing.html",
    fallbackTitle: "Performance Marketing - Web Affino",
    slugs: ["performance-marketing", "performance-marketingv1", "performancemarketing"]
  },
  seocontentstratergy: {
    sourceFile: "seocontentstratergy.html",
    fallbackTitle: "SEO Content Strategy - Web Affino",
    slugs: ["seo-content-strategy", "seocontentstratergy"]
  },
  siteoptimisation: {
    sourceFile: "siteoptimisation.html",
    fallbackTitle: "Site Optimisation - Web Affino",
    slugs: ["site-optimisation", "siteoptimisation"]
  },
  header: {
    sourceFile: "header.html",
    fallbackTitle: "Header - Web Affino",
    slugs: ["header"]
  },
  footer: {
    sourceFile: "footer.html",
    fallbackTitle: "Footer - Web Affino",
    slugs: ["footer"]
  }
};

export const INTERNAL_HREFS = {
  "": "/",
  "/": "/",
  "about-company": "/about-company",
  "blogs": "/blogs",
  "contact-us": "/contact-us",
  "digital-marketing": "/digital-marketing",
  "digital-marketing-2": "/digital-marketing-2",
  "lead-generation": "/lead-generation",
  "leads-generation": "/leads-generation",
  "our-media-properties": "/our-media-properties",
  "performance-marketing": "/performance-marketing",
  "performance-marketingv1": "/performance-marketingv1",
  "seo-content-strategy": "/seo-content-strategy",
  "site-optimisation": "/site-optimisation",
  advertise: "/advertise"
};

export const ASSET_URLS = {
  "https://webaffino.com/wp-content/uploads/2025/11/web-affino-new-logo.png": "/assets/web-affino-new-logo.png",
  "https://webaffino.com/wp-content/uploads/2020/09/Generated20image2020-3-e1763372401271.webp": "/assets/footer-logo.webp",
  "https://webaffino.com/wp-content/uploads/2025/11/140578-775389242.mp4": "/assets/hero-video.mp4",
  "https://webaffino.com/wp-content/uploads/2025/11/12-1024x1024-1.png": "/assets/brand-12.png",
  "https://webaffino.com/wp-content/uploads/2025/11/9-1-1024x1024-1.png": "/assets/brand-9.png",
  "https://webaffino.com/wp-content/uploads/2025/11/8-1-1024x1024-1.png": "/assets/brand-8.png",
  "https://webaffino.com/wp-content/uploads/2025/11/6-1-1024x1024-1.png": "/assets/brand-6.png",
  "https://webaffino.com/wp-content/uploads/2025/11/5-1-1024x1024-1.png": "/assets/brand-5.png",
  "https://webaffino.com/wp-content/uploads/2025/11/3-1-1024x1024-1.png": "/assets/brand-3.png",
  "https://webaffino.com/wp-content/uploads/2025/11/13-1024x1024-1.png": "/assets/brand-13.png",
  "https://webaffino.com/wp-content/uploads/2025/11/14-1024x1024-1.png": "/assets/brand-14.png",
  "https://webaffino.com/wp-content/uploads/2025/11/15-1024x1024-1.png": "/assets/brand-15.png",
  "https://webaffino.com/wp-content/uploads/2025/11/Amazon-Logo-2000-scaled.png": "/assets/amazon-logo.png",
  "https://webaffino.com/wp-content/uploads/2025/11/dhgate-logo-png_seeklogo-335536-1.png": "/assets/dhgate-logo.png",
  "https://webaffino.com/wp-content/uploads/2025/11/Temu_logo_icon.svg.png": "/assets/temu-logo.png",
  "https://webaffino.com/wp-content/uploads/2025/11/OOJO_meta_image.jpg": "/assets/oojo-meta.jpg",
  "https://webaffino.com/wp-content/uploads/2025/11/Hostinger_Logo.png": "/assets/hostinger-logo.png",
  "https://webaffino.com/wp-content/uploads/2025/11/Preply_Logo.png": "/assets/preply-logo.png",
  "https://webaffino.com/wp-content/uploads/2025/11/Godaddy-logo-scaled.png": "/assets/godaddy-logo.png",
  "https://webaffino.com/wp-content/uploads/2025/11/20943526-scaled.jpg": "/assets/transparent-traffic.jpg",
  "https://webaffino.com/wp-content/uploads/2025/11/Wavy_Bus-34_Single-11-scaled.jpg": "/assets/compliant-promotions.jpg",
  "https://webaffino.com/wp-content/uploads/2025/11/2136912-e1764168630211.jpg": "/assets/roi-focused-execution.jpg",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop": "/assets/team-collaboration.jpg",
  "https://webaffino.com/wp-content/uploads/2025/11/Gemini_Generated_Image_32nq8m32nq8m32nq-removebg-preview-e1764337765365.png": "/assets/sportsresso-logo.png",
  "https://webaffino.com/wp-content/uploads/2025/11/Untitled20Image.webp": "/assets/content-delight-logo.webp",
  "https://sassystrides.com/wp-content/uploads/2026/03/cropped-Maha-Utsav-Instagram-Post-3.png": "/assets/sassy-strides-logo.png"
};
