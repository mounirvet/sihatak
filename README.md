# صحتك — Sihatak Dental Health Authority

مرجع تثقيفي عربي مستقل لصحة الأسنان والفم، مُحسَّن لمحركات البحث التقليدية ومحركات الذكاء الاصطناعي.

An Arabic-first, GEO + SEO optimized educational dental health site for the GCC.

---

## التشغيل محلياً / Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # generates static site in /out
```

## النشر / Deploy (recommended: Vercel)

1. Push this folder to a GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Vercel auto-detects Next.js. Click Deploy. Done — free tier.
   (Cloudflare Pages also works: framework preset = Next.js static export.)

## قبل النشر / Before going live — REQUIRED

1. **Domain**: edit `lib/site.js` → set `SITE.url` to your real domain.
2. **Reviewers**: edit `lib/reviewers.js` → replace placeholders with REAL,
   credentialed dentists. This is the single biggest health-ranking signal.
   Never fake a medical reviewer.
3. **Search consoles**: after deploy, add the site to
   - Google Search Console (search.google.com/search-console)
   - Bing Webmaster Tools (bing.com/webmasters) — Bing feeds ChatGPT search
   and submit `/sitemap.xml` in both.

---

## كتابة مقال جديد / Writing a new article

Create a file in `content/articles/your-slug.md`:

```markdown
---
title: "العنوان كسؤال يطرحه الناس"
pillar: "amrad-al-litha"        # one of the 6 pillar slugs in lib/site.js
reviewer: "dr-placeholder"       # an id from lib/reviewers.js
date: "2026-06-06"
updated: "2026-06-06"
excerpt: "ملخص في سطر أو سطرين."
answer: "الإجابة المختصرة المباشرة في 2-3 جمل — هذا ما تقتبسه محركات الذكاء الاصطناعي."
faq:
  - q: "سؤال شائع؟"
    a: "إجابة واضحة."
sources:
  - title: "اسم المصدر"
    publisher: "الجهة"
    url: "https://..."
---

نص المقال هنا بصيغة ماركداون.

## عنوان فرعي (سؤال)

فقرات قصيرة، جمل واضحة...
```

The site rebuilds the article page, schema, sitemap, and internal links automatically.

## البنية / Architecture

```
app/                  pages (homepage, pillars, articles, trust pages)
components/            Header, Footer, ArticleSchema, ArticleParts, Cards
content/articles/      ← your markdown articles live here
lib/site.js            site name, url, the 6 pillars, nav
lib/reviewers.js       medical review board
lib/content.js         markdown loader
```

## لماذا هذا الهيكل قاتل لمنافسيك / Why this wins

- **Static HTML** = perfectly crawlable by AI bots and Google.
- **Answer block** at the top of every article = what ChatGPT/Perplexity quote.
- **MedicalWebPage + FAQPage + reviewedBy schema** = machine-readable trust.
- **Topic clusters** (pillar ↔ articles) = topical authority graph.
- **Trust pages + named reviewers** = E-E-A-T for health (YMYL) content.
- **robots.txt** explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, Google-Extended.
# sihatak
