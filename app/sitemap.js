import { SITE, PILLARS } from '../lib/site';
import { getArticleSlugs } from '../lib/content';
import { getGlossarySlugs } from '../lib/glossary';
import { getInsightSlugs } from '../lib/insights';
import { getToolSlugs, getProductSlugs } from '../lib/tools';

export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  const staticPages = ['', '/mahawir', '/maqalat', '/jadeed', '/mustalahat', '/bahth', '/adawat', '/man-nahnu', '/man-nahnu/al-fariq-al-tibbi', '/man-nahnu/siyasat-al-tahrir', '/man-nahnu/al-masadir', '/man-nahnu/siyasat-al-khususiyya', '/man-nahnu/shurut-al-istikhdam', '/man-nahnu/ittasil-bina', '/man-nahnu/ikhla-al-masuliyya', '/man-nahnu/al-ifsah'];
  const pages = staticPages.map((p) => ({
    url: `${SITE.url}${p}/`,
    lastModified: now,
  }));
  const pillarPages = PILLARS.map((p) => ({
    url: `${SITE.url}/mahawir/${p.slug}/`,
    lastModified: now,
  }));
  const articlePages = getArticleSlugs().map((slug) => ({
    url: `${SITE.url}/maqalat/${slug}/`,
    lastModified: now,
  }));
  const glossaryPages = getGlossarySlugs().map((slug) => ({
    url: `${SITE.url}/mustalahat/${slug}/`,
    lastModified: now,
  }));
  const insightPages = getInsightSlugs().map((slug) => ({
    url: `${SITE.url}/jadeed/${slug}/`,
    lastModified: now,
  }));
  const toolCategoryPages = getToolSlugs().map((slug) => ({
    url: `${SITE.url}/adawat/${slug}/`,
    lastModified: now,
  }));
  const productPages = getProductSlugs().map((slug) => ({
    url: `${SITE.url}/adawat/muntaj/${slug}/`,
    lastModified: now,
  }));
  return [
    ...pages,
    ...pillarPages,
    ...articlePages,
    ...glossaryPages,
    ...insightPages,
    ...toolCategoryPages,
    ...productPages,
  ];
}
