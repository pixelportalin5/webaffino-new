export interface WordPressRenderedField {
  rendered: string;
}

export interface WordPressFeaturedMedia {
  source_url?: string;
  alt_text?: string;
  code?: string;
  guid?: { rendered?: string };
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, { source_url?: string; width?: number; height?: number }>;
  };
}

export interface WordPressTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WordPressYoastHeadJson {
  title?: string;
  description?: string;
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_image?: Array<{ url?: string }>;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  author?: string;
}

export interface WordPressAuthor {
  name?: string;
  slug?: string;
}

export interface WordPressPost {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  link: string;
  title: WordPressRenderedField;
  excerpt: WordPressRenderedField;
  content: WordPressRenderedField;
  yoast_head_json?: WordPressYoastHeadJson;
  _embedded?: {
    author?: WordPressAuthor[];
    "wp:featuredmedia"?: WordPressFeaturedMedia[];
    "wp:term"?: WordPressTerm[][];
  };
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  modifiedDate?: string;
  link: string;
  category: string;
  author?: string;
  featuredImage: string | null;
  featuredAlt: string;
  featuredImageWidth?: number;
  featuredImageHeight?: number;
  seoTitle?: string;
  seoDescription?: string;
  wordpressCanonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export interface BlogPostDetail extends BlogPost {
  contentHtml: string;
}
