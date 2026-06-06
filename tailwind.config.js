/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Distinctive Arabic pairing: Tajawal (body, clean+warm) + Reem Kufi (display, authoritative)
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
      },
      colors: {
        // Clinical-trust palette: deep teal authority + warm accent, NOT generic medical blue
        ink: '#0B2027',        // near-black teal — text
        teal: {
          DEFAULT: '#0E5C63',  // primary brand — trust + medical
          dark: '#093E43',
          light: '#3D8A91',
        },
        sand: '#F7F3EC',       // warm off-white background — softer than sterile white
        cream: '#FBF9F4',
        coral: '#E07856',      // warm human accent — CTAs, highlights
        mint: '#D9EBE9',       // answer-block tint
        line: '#E4DDD1',       // borders
      },
      maxWidth: {
        prose: '46rem',
      },
      boxShadow: {
        soft: '0 2px 24px -8px rgba(11, 32, 39, 0.12)',
        card: '0 1px 3px rgba(11, 32, 39, 0.06), 0 8px 24px -12px rgba(11, 32, 39, 0.10)',
      },
    },
  },
  plugins: [],
};
