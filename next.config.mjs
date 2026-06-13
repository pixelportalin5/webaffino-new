/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ["gsap", "lenis"],
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/blogs",
        permanent: true
      },
      {
        source: "/blog/:slug",
        destination: "/blogs/:slug",
        permanent: true
      },
      {
        source: "/aboutcompany",
        destination: "/about-company",
        permanent: true
      },
      {
        source: "/contactus",
        destination: "/contact-us",
        permanent: true
      },
      {
        source: "/digitalmarketing",
        destination: "/digital-marketing",
        permanent: true
      },
      {
        source: "/digital-marketing-2",
        destination: "/digital-marketing",
        permanent: true
      },
      {
        source: "/leadgeneration",
        destination: "/lead-generation",
        permanent: true
      },
      {
        source: "/leads-generation",
        destination: "/lead-generation",
        permanent: true
      },
      {
        source: "/ourmediaproperties",
        destination: "/our-media-properties",
        permanent: true
      },
      {
        source: "/performancemarketing",
        destination: "/performance-marketing",
        permanent: true
      },
      {
        source: "/performance-marketingv1",
        destination: "/performance-marketing",
        permanent: true
      },
      {
        source: "/seocontentstratergy",
        destination: "/seo-content-strategy",
        permanent: true
      },
      {
        source: "/siteoptimisation",
        destination: "/site-optimisation",
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "webaffino.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "admin.webaffino.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "onum-wp.s3.amazonaws.com",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
