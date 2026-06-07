import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getArticle, getArticleSlugs } from '../../../lib/content';
import { SITE, PILLARS } from '../../../lib/site';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = SITE.name;

// Load Arabic fonts so titles render correctly (default font lacks Arabic glyphs).
const fontRegular = readFileSync(join(process.cwd(), 'public/fonts/Tajawal-Regular.ttf'));
const fontBold = readFileSync(join(process.cwd(), 'public/fonts/Tajawal-Bold.ttf'));

// Pre-generate an OG image for every article slug (static export).
export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

// Per-article social share card: article title + pillar label on brand background.
export default async function OGImage({ params }) {
  let title = SITE.name;
  let pillarTitle = '';
  try {
    const { meta } = await getArticle(params.slug);
    title = meta.title || title;
    const pillar = PILLARS.find((p) => p.slug === meta.pillar);
    pillarTitle = pillar ? pillar.title : '';
  } catch {
    // fall back to site name
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FBF9F4',
          padding: '70px 80px',
          fontFamily: 'Tajawal',
        }}
      >
        {/* top: pillar label */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {pillarTitle ? (
            <div
              style={{
                fontSize: 34,
                color: '#0E5C63',
                background: '#D9EBE9',
                padding: '12px 30px',
                borderRadius: 999,
              }}
            >
              {pillarTitle}
            </div>
          ) : (
            <div />
          )}
        </div>

        {/* middle: title */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: '#0B2027',
            lineHeight: 1.3,
            maxWidth: 1040,
            display: 'flex',
          }}
        >
          {title}
        </div>

        {/* bottom: brand bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: '#0E5C63' }}>{SITE.name}</div>
          <div style={{ fontSize: 28, color: '#0E5C63' }}>يراجعه أطباء مختصون</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Tajawal', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Tajawal', data: fontBold, weight: 700, style: 'normal' },
      ],
    }
  );
}
