# WordPress Admin SEO Blocking Guide

Apply these settings on **https://admin.webaffino.com** so the headless CMS never competes with the public Next.js frontend at **https://webaffino.com**.

## 1. WordPress Settings → Reading

- Ensure **“Discourage search engines from indexing this site”** is **checked** on the admin subdomain installation.

## 2. robots.txt (admin.webaffino.com)

Serve this at `https://admin.webaffino.com/robots.txt`:

```txt
User-agent: *
Disallow: /
```

If the admin host must remain reachable for editors, still disallow all crawlers.

## 3. Yoast SEO / Rank Math (if installed)

- **Search Appearance → General**: set “Show site in search results” to **Off** on admin.
- Disable XML sitemaps on admin, or restrict sitemap to `Disallow: /`.
- Never output canonical tags pointing to `admin.webaffino.com` in public feeds—the Next.js frontend overrides all public canonicals.

## 4. HTTP Headers (recommended on admin host)

Add via nginx/Apache/Cloudflare:

```http
X-Robots-Tag: noindex, nofollow, noarchive
```

## 5. WordPress REST API

- Keep API on admin for Next.js fetches only.
- Do **not** expose admin URLs in `link`, `guid.rendered`, or Yoast canonical fields to the frontend—Next.js strips these in `lib/seo/site.js`.

## 6. Environment variables (Next.js / Vercel)

```env
NEXT_PUBLIC_SITE_URL=https://webaffino.com
WORDPRESS_API_BASE=https://admin.webaffino.com/wp-json/wp/v2
```

The frontend always publishes:

- Canonical: `https://webaffino.com/blogs/[slug]`
- Sitemap: `https://webaffino.com/sitemap.xml`
- Robots: `https://webaffino.com/robots.txt`

## 7. Google Search Console

- Verify **only** `https://webaffino.com`.
- Submit `https://webaffino.com/sitemap.xml`.
- Do **not** verify or submit the admin subdomain property.

## 8. Optional hardening

- Password-protect admin host at CDN/WAF level for non-API routes.
- Block `/wp-admin` from crawlers via `robots.txt` and `X-Robots-Tag`.
- Use separate Google Analytics / GSC properties per host—track public site only.
