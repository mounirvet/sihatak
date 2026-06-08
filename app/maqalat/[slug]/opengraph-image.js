import { ImageResponse } from 'next/og';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getArticle, getArticleSlugs } from '../../../lib/content';
import { getPillarImage } from '../../../lib/pillarImages';
import { SITE, PILLARS } from '../../../lib/site';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = SITE.name;

const fontRegular = readFileSync(join(process.cwd(), 'public/fonts/Tajawal-Regular.ttf'));
const fontBold = readFileSync(join(process.cwd(), 'public/fonts/Tajawal-Bold.ttf'));

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

function pillarPhotoDataUri(pillarSlug) {
  const rel = getPillarImage(pillarSlug);
  if (!rel) return null;
  const abs = join(process.cwd(), 'public', rel.replace(/^\//, ''));
  if (!existsSync(abs)) return null;
  const ext = abs.split('.').pop().toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  const data = readFileSync(abs).toString('base64');
  return `data:${mime};base64,${data}`;
}

export default async function OGImage({ params }) {
  let title = SITE.name;
  let pillarTitle = '';
  let photo = null;
  try {
    const { meta } = await getArticle(params.slug);
    title = meta.title || title;
    const pillar = PILLARS.find((p) => p.slug === meta.pillar);
    pillarTitle = pillar ? pillar.title : '';
    photo = pillarPhotoDataUri(meta.pillar);
  } catch {}

  const fontOptions = {
    ...size,
    fonts: [
      { name: 'Tajawal', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'Tajawal', data: fontBold, weight: 700, style: 'normal' },
    ],
  };

  if (photo) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', fontFamily: 'Tajawal' }}>
          <img src={photo} width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(0deg, rgba(11,32,39,0.92) 0%, rgba(11,32,39,0.55) 45%, rgba(11,32,39,0.15) 100%)' }} />
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '70px 80px' }}>
            {pillarTitle && (
              <div style={{ fontSize: 32, color: '#0B2027', background: '#D9EBE9', padding: '10px 28px', borderRadius: 999, marginBottom: 24, alignSelf: 'flex-end' }}>{pillarTitle}</div>
            )}
            <div style={{ fontSize: 64, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3, width: '100%', direction: 'rtl', textAlign: 'right', marginBottom: 28 }}>{title}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl', width: '100%' }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: '#FFFFFF' }}>{SITE.name}</div>
              <div style={{ fontSize: 26, color: '#D9EBE9' }}>يراجعه أطباء مختصون</div>
            </div>
          </div>
        </div>
      ),
      fontOptions
    );
  }

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#FBF9F4', padding: '70px 80px', fontFamily: 'Tajawal' }}>
        <div style={{ display: 'flex', alignItems: 'center', direction: 'rtl' }}>
          {pillarTitle ? (
            <div style={{ fontSize: 34, color: '#0E5C63', background: '#D9EBE9', padding: '12px 30px', borderRadius: 999 }}>{pillarTitle}</div>
          ) : (<div />)}
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, color: '#0B2027', lineHeight: 1.3, width: '100%', direction: 'rtl', textAlign: 'right' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl', width: '100%' }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: '#0E5C63' }}>{SITE.name}</div>
          <div style={{ fontSize: 28, color: '#0E5C63' }}>يراجعه أطباء مختصون</div>
        </div>
      </div>
    ),
    fontOptions
  );
}