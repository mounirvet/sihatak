import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SITE } from '../lib/site';

export const dynamic = 'force-static';
export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const fontRegular = readFileSync(join(process.cwd(), 'public/fonts/Tajawal-Regular.ttf'));
const fontBold = readFileSync(join(process.cwd(), 'public/fonts/Tajawal-Bold.ttf'));

// Site-wide default social share image (homepage and pages without their own).
export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0E5C63 0%, #093E43 100%)',
          color: '#FBF9F4',
          fontFamily: 'Tajawal',
          padding: '80px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 700, marginBottom: 20 }}>{SITE.name}</div>
        <div style={{ fontSize: 40, color: '#D9EBE9', maxWidth: 900 }}>
          مرجع موثوق لصحة الأسنان والفم — يراجعه أطباء مختصون
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
