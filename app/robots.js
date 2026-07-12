import { SITE } from '../lib/site';

export const dynamic = 'force-static';

// Explicitly allow AI crawlers — being readable by them is prerequisite #1
// for appearing in AI answers (ChatGPT, Claude, Perplexity, Gemini).
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
    ],
    sitemap: [`${SITE.url}/sitemap.xml`, `${SITE.url}/image-sitemap.xml`],
  };
}
