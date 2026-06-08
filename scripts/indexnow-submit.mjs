// IndexNow submit script for asnanik.com
// Reads the live sitemap, extracts every URL, and notifies IndexNow (Bing/ChatGPT
// index) so they re-crawl within minutes instead of days.
//
// USAGE (after a deploy is live):
//   node scripts/indexnow-submit.mjs            -> submits ALL URLs from the sitemap
//   node scripts/indexnow-submit.mjs <url> ...  -> submits only the URLs you list
//
// Requires Node 18+ (built-in fetch). No npm install needed.

const KEY = '6ff49a8204f28e7cfd494d4d47208115';
const HOST = 'asnanik.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap.xml`;

async function getUrlsFromSitemap() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`Could not fetch sitemap: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
}

async function submit(urls) {
  if (!urls.length) { console.log('No URLs to submit.'); return; }
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls };
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  // IndexNow returns 200 or 202 on success.
  console.log(`Submitted ${urls.length} URL(s) -> IndexNow responded ${res.status} ${res.statusText}`);
  if (res.status !== 200 && res.status !== 202) {
    console.log('Response body:', await res.text());
  }
}

const args = process.argv.slice(2);
const urls = args.length ? args : await getUrlsFromSitemap();
console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);
await submit(urls);
