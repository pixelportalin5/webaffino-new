/** @type {Record<string, { question: string; answer: string }[]>} */
export const FAQ_CONTENT_BY_PAGE = {
  "about-company": [
    {
      question: "What does Web Affino offer?",
      answer:
        "A performance-driven platform that connects brands with high-intent users through content, SEO, and targeted campaigns."
    },
    {
      question: "How do you generate traffic?",
      answer:
        "Through SEO, editorial content, and organic + paid channels targeting users actively researching."
    },
    {
      question: "Do you use incentivized traffic?",
      answer:
        "No. We strictly avoid it along with any misleading or manipulative practices. Our focus is entirely on genuine, high-quality user engagement."
    },
    {
      question: "How do you ensure compliance?",
      answer:
        "By following strict internal guidelines and continuously aligning with industry standards and partner requirements to guarantee a brand-safe environment."
    }
  ],
  "lead-generation": [
    {
      question: "What's the minimum budget I should commit?",
      answer:
        "For meaningful statistical signal, $5K–10K/month in media spend (per channel) is the practical floor. Below that, you can't run enough variants to actually learn what works. Our service fee sits on top of media — typically $3K–8K/month depending on channel count and volume."
    },
    {
      question: "How fast will I see leads?",
      answer:
        "First leads in week 3. Predictable daily volume by week 6. Profitable unit economics typically by month 3 once we've optimized creative and audience. Lead-gen is faster than SEO but slower than turning on a faucet — anyone promising \"leads tomorrow\" is selling list scraping."
    },
    {
      question: "Do you guarantee a number of leads?",
      answer:
        "We can guarantee CPL targets after a learning phase, but only because we've done diligence on your offer first. Anyone promising guaranteed lead volume on day one is either lying or planning to deliver junk leads to hit a number. We'd rather be honest than oversold."
    },
    {
      question: "What if my leads are low quality?",
      answer:
        "Quality is our job, not yours. Every lead is automatically scored against your ICP. Sub-threshold leads are flagged before they ever hit your CRM. If a quality issue persists, we tighten audience targeting, raise form friction, or pause the channel — all before you have to ask."
    },
    {
      question: "Which channel should I start with?",
      answer:
        "Depends on your ICP. B2B SaaS with $20K+ ACV: LinkedIn + Google Search. D2C consumer brand: Meta + TikTok. High-AOV finance/health: Native + our owned properties. We'll tell you exactly where to start in the first call — and where not to waste money."
    }
  ]
};

/**
 * @param {string} slugPath
 * @returns {{ question: string; answer: string }[]}
 */
export function getFaqItemsForPath(slugPath) {
  const normalized = slugPath.replace(/^\/+|\/+$/g, "");
  return FAQ_CONTENT_BY_PAGE[normalized] || [];
}
