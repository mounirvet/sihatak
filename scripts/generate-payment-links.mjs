#!/usr/bin/env node
/**
 * scripts/generate-payment-links.mjs
 *
 * LOCAL-ONLY tool. Never runs on the server or in the static build.
 * Reads content/products/*.md, and for each product that doesn't already have a
 * Stripe Payment Link, it:
 *   1. creates a Stripe Product + Price (in SAR),
 *   2. creates a Payment Link for that price (with shipping-address collection),
 *   3. writes the resulting URL back into the product's `stripe_payment_link` field.
 *
 * SAFETY / DESIGN:
 * - Your Stripe secret key is read from the STRIPE_SECRET_KEY env var only.
 *   It is never written to any file, never committed, never printed.
 * - Idempotent: a product that already has a non-empty stripe_payment_link is
 *   SKIPPED, so re-running never creates duplicates.
 * - Dry-run by default is OFF; pass --dry-run to preview without calling Stripe.
 * - Test vs live is decided entirely by which key you export (sk_test_ / sk_live_).
 *
 * USAGE (from repo root):
 *   npm install stripe            # one-time, dev tool only
 *   export STRIPE_SECRET_KEY=sk_test_xxx
 *   node scripts/generate-payment-links.mjs --dry-run   # preview
 *   node scripts/generate-payment-links.mjs             # do it
 *
 * Flags:
 *   --dry-run     Show what would happen; make no Stripe calls, write nothing.
 *   --force       Recreate links even for products that already have one.
 *   --only=slug   Process a single product by slug.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// --- config -----------------------------------------------------------------
const PRODUCTS_DIR = path.join(process.cwd(), 'content', 'products');
const CURRENCY = 'sar'; // Stripe wants lowercase ISO currency
// Stripe amounts are in the smallest unit. SAR uses 2 decimal places (halalas),
// so 89 SAR -> 8900. Adjust ONLY if you change currency.
const MINOR_UNITS = 100;

// --- args -------------------------------------------------------------------
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');
const onlyArg = args.find((a) => a.startsWith('--only='));
const ONLY_SLUG = onlyArg ? onlyArg.split('=')[1] : null;

// --- key handling -----------------------------------------------------------
const KEY = process.env.STRIPE_SECRET_KEY;
if (!DRY_RUN && !KEY) {
  console.error(
    '\n✖ STRIPE_SECRET_KEY is not set.\n' +
      '  Run:  export STRIPE_SECRET_KEY=sk_test_xxxxx\n' +
      '  (use your TEST key first). Then re-run this script.\n'
  );
  process.exit(1);
}
const MODE = KEY?.startsWith('sk_live_')
  ? 'LIVE'
  : KEY?.startsWith('sk_test_')
    ? 'TEST'
    : 'UNKNOWN';

// Guard: refuse to run in LIVE unless explicitly confirmed, to avoid accidents.
if (!DRY_RUN && MODE === 'LIVE' && !args.includes('--i-understand-live')) {
  console.error(
    '\n⚠ You are using a LIVE key (sk_live_...). This creates REAL, chargeable links.\n' +
      '  If that is intended, re-run with the extra flag: --i-understand-live\n'
  );
  process.exit(1);
}

// --- helpers ----------------------------------------------------------------
function listProductFiles() {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];
  return fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(PRODUCTS_DIR, f));
}

function writeBackLink(filePath, raw, url) {
  // Re-parse, set the field, re-serialize with gray-matter to preserve body.
  const parsed = matter(raw);
  parsed.data.stripe_payment_link = url;
  const out = matter.stringify(parsed.content, parsed.data);
  fs.writeFileSync(filePath, out, 'utf8');
}

async function main() {
  console.log(`\nStripe Payment Link generator — mode: ${DRY_RUN ? 'DRY-RUN' : MODE}`);

  let stripe = null;
  if (!DRY_RUN) {
    const Stripe = (await import('stripe')).default;
    stripe = new Stripe(KEY, { apiVersion: '2024-06-20' });
  }

  const files = listProductFiles();
  if (files.length === 0) {
    console.log('No product files found in content/products/. Nothing to do.');
    return;
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(raw);
    const slug = data.slug || path.basename(filePath, '.md');

    if (ONLY_SLUG && slug !== ONLY_SLUG) continue;

    // Skip products that already have a link (unless --force).
    if (!FORCE && data.stripe_payment_link) {
      console.log(`  ↷ skip   ${slug} (already has a link)`);
      skipped++;
      continue;
    }

    // Basic validation before touching Stripe.
    if (!data.title_ar || typeof data.price !== 'number') {
      console.log(`  ✖ invalid ${slug} (needs title_ar and numeric price) — skipped`);
      failed++;
      continue;
    }

    const amount = Math.round(data.price * MINOR_UNITS);
    const label = `${slug} — ${data.title_ar} — ${data.price} SAR`;

    if (DRY_RUN) {
      console.log(`  • would create link: ${label}`);
      created++;
      continue;
    }

    try {
      // 1) Product
      const product = await stripe.products.create({
        name: data.title_ar,
        metadata: { slug, sku: data.sku || slug },
      });

      // 2) Price (one-off, SAR)
      const price = await stripe.prices.create({
        product: product.id,
        currency: CURRENCY,
        unit_amount: amount,
      });

      // 3) Payment Link with shipping-address collection for GCC countries.
      const link = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        shipping_address_collection: {
          allowed_countries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
        },
        metadata: { slug },
      });

      writeBackLink(filePath, raw, link.url);
      console.log(`  ✓ created ${label}`);
      console.log(`           ${link.url}`);
      created++;
    } catch (err) {
      console.log(`  ✖ FAILED ${slug}: ${err.message}`);
      failed++;
    }
  }

  console.log(
    `\nDone. created/updated: ${created}  skipped: ${skipped}  failed: ${failed}\n`
  );
  if (!DRY_RUN && created > 0) {
    console.log('Next: review the updated product .md files, then rebuild + commit + push.\n');
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
