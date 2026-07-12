// components/ShopIcons.js
// Premium line-icon set for the shop/product experience — replaces EVERY emoji.
// currentColor + 1.6 stroke, inherits size/color via Tailwind className.
// One clean glyph per concept; named by MEANING so copy data can reference by key.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function S({ children, className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      {children}
    </svg>
  );
}

/* ---------- Trust / commerce ---------- */
export const IcLock = (p) => (
  <S {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></S>
);
export const IcReturn = (p) => (
  <S {...p}><path d="M4 8h11a5 5 0 0 1 0 10H9" /><path d="m7 5-3 3 3 3" /></S>
);
export const IcVerified = (p) => (
  <S {...p}><path d="m12 3 2.1 1.5 2.6-.2 1 2.4 2.2 1.4-.7 2.5.7 2.5-2.2 1.4-1 2.4-2.6-.2L12 21l-2.1-1.5-2.6.2-1-2.4L4.1 16l.7-2.5L4.1 11l2.2-1.4 1-2.4 2.6.2Z" /><path d="m9 12 2 2 4-4" /></S>
);
export const IcShip = (p) => (
  <S {...p}><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></S>
);
export const IcShield = (p) => (
  <S {...p}><path d="M12 3 5 6v5c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></S>
);
export const IcStar = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.9l1-5.8L3.5 9.2l5.9-.9L12 3Z" />
  </svg>
);
export const IcSpark = (p) => (
  <S {...p}><path d="M12 3c.5 3.5 1.5 4.5 5 5-3.5.5-4.5 1.5-5 5-.5-3.5-1.5-4.5-5-5 3.5-.5 4.5-1.5 5-5Z" /><path d="M18 14c.3 1.7.8 2.2 2.5 2.5-1.7.3-2.2.8-2.5 2.5-.3-1.7-.8-2.2-2.5-2.5 1.7-.3 2.2-.8 2.5-2.5Z" /></S>
);
export const IcCart = (p) => (
  <S {...p}><path d="M3 4h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.2L21 8H6" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></S>
);
export const IcArrowLeft = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true"><path d="M19 12H5m6-7-7 7 7 7" /></svg>
);
export const IcChevron = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);
export const IcCheck = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

/* ---------- Benefit concepts (referenced by copy keys) ---------- */
export const IcGlow = (p) => ( // whitening result / brightness
  <S {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.5 1.5M16.5 16.5 18 18M18 6l-1.5 1.5M7.5 16.5 6 18" /></S>
);
export const IcMoon = (p) => ( // short evening routine
  <S {...p}><path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10Z" /></S>
);
export const IcHeart = (p) => ( // gentle / comfortable
  <S {...p}><path d="M12 20s-7-4.4-7-9.5A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.5C19 15.6 12 20 12 20Z" /></S>
);
export const IcGem = (p) => ( // clinic-clean feel
  <S {...p}><path d="M6 4h12l3 5-9 11L3 9Z" /><path d="M6 4 9 9h6l3-5M3 9h18M12 20 9 9m3 11 3-11" /></S>
);
export const IcTimer = (p) => (
  <S {...p}><circle cx="12" cy="13" r="8" /><path d="M12 13V9M9 2h6" /></S>
);
export const IcBattery = (p) => (
  <S {...p}><rect x="3" y="8" width="15" height="8" rx="2" /><path d="M21 11v2" /><path d="M6 11v2M9 11v2M12 11v2" /></S>
);
export const IcDrop = (p) => (
  <S {...p}><path d="M12 3s6 6.4 6 10.5A6 6 0 0 1 6 13.5C6 9.4 12 3 12 3Z" /></S>
);
export const IcToothLine = (p) => (
  <S {...p}><path d="M7.5 3.5C5.5 3.5 4 5 4 7.3c0 1.7.6 2.8.9 4.3.3 1.4.2 2.6.6 4.3.3 1.3.6 3.6 1.6 3.6 1.2 0 1-2.3 1.6-3.7.3-.8.7-1.3 1.3-1.3s1 .5 1.3 1.3c.6 1.4.4 3.7 1.6 3.7 1 0 1.3-2.3 1.6-3.6.4-1.7.3-2.9.6-4.3.3-1.5.9-2.6.9-4.3C20 5 18.5 3.5 16.5 3.5c-1.6 0-2.6 1-4.5 1s-2.9-1-4.5-1Z" /></S>
);
export const IcPlane = (p) => (
  <S {...p}><path d="M10 14 3 12l1-2 6 .6 4-4.6a1.6 1.6 0 0 1 2.4 2.2L12 13l.6 6-2 1-2-7Z" /></S>
);
export const IcBolt = (p) => (
  <S {...p}><path d="M13 3 5 13h5l-1 8 8-11h-5l1-7Z" /></S>
);
export const IcLeaf = (p) => (
  <S {...p}><path d="M4 20c0-7 4-12 11-12.5C15 14.5 11 19 4 20Z" /><path d="M4 20c2.5-4 5.5-6.5 9-8" /></S>
);
export const IcWind = (p) => (
  <S {...p}><path d="M3 9h11a3 3 0 1 0-3-3M3 15h14a3 3 0 1 1-3 3M3 12h8" /></S>
);
export const IcBag = (p) => (
  <S {...p}><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></S>
);
export const IcTarget = (p) => (
  <S {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></S>
);
export const IcRecycle = (p) => (
  <S {...p}><path d="M7 8 4.5 12l2.5.5M17 8l2.5 4-2.5.5M9.5 19 12 15l-2 -1.5M12 5l2 3.5" /><path d="M4.5 12H3M21 12h-1.5M9.5 19h5" /></S>
);
export const IcFlask = (p) => (
  <S {...p}><path d="M9 3h6M10 3v6l-4.5 8A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3L14 9V3" /><path d="M8 14h8" /></S>
);
export const IcWave = (p) => (
  <S {...p}><path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /></S>
);
export const IcWrench = (p) => (
  <S {...p}><path d="M15 6a4 4 0 0 0-5.2 5.2l-6 6L6 20l6-6A4 4 0 0 0 18 9l-2 2-2-2 2-2Z" /></S>
);
export const IcHands = (p) => (
  <S {...p}><path d="M7 11V7a1.5 1.5 0 0 1 3 0v3M10 10V6a1.5 1.5 0 0 1 3 0v4M13 10.5V8a1.5 1.5 0 0 1 3 0v5a5 5 0 0 1-5 5H9l-4-4a1.6 1.6 0 0 1 2.3-2.2L9 11" /></S>
);
export const IcBalloon = (p) => (
  <S {...p}><path d="M12 3a5 5 0 0 1 5 5c0 3.3-2.5 6-5 6S7 11.3 7 8a5 5 0 0 1 5-5Z" /><path d="M12 14v2m0 0-1.5 1.5M12 16l1.5 1.5" /></S>
);
export const IcSmile = (p) => (
  <S {...p}><circle cx="12" cy="12" r="9" /><path d="M8 14a4 4 0 0 0 8 0" /><path d="M9 9h.01M15 9h.01" /></S>
);
export const IcFamily = (p) => (
  <S {...p}><circle cx="7" cy="7" r="2.2" /><circle cx="16" cy="7" r="2.2" /><path d="M3.5 19v-3a3.5 3.5 0 0 1 7 0v3M13.5 19v-3a3.5 3.5 0 0 1 7 0v3" /></S>
);
export const IcCircleCheck = (p) => (
  <S {...p}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></S>
);
export const IcBrushLine = (p) => (
  <S {...p}><path d="M4 20 13 11m0 0 1.5-1.5m-1.5 1.5-2-2 1.5-1.5 2 2m1-3L20 5a1.5 1.5 0 0 1 2 2l-4 4.5" /><path d="M6 16l3 3" /></S>
);
export const IcInfo = (p) => (
  <S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></S>
);

/* ---------- Box-content icons ("ما الذي ستحصل عليه") ---------- */
export const IcBox = (p) => (
  <S {...p}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></S>
);
export const IcCable = (p) => (
  <S {...p}><path d="M7 4v4a3 3 0 0 0 3 3h4a3 3 0 0 1 3 3v6" /><path d="M5 4h4M15 18h4" /></S>
);
export const IcTip = (p) => ( // replacement head / jet tip
  <S {...p}><path d="M12 3c1.2 2 2 3.6 2 5a2 2 0 0 1-4 0c0-1.4.8-3 2-5Z" /><path d="M11 10h2v6h-2z" /><rect x="9.5" y="16" width="5" height="5" rx="1.5" /></S>
);
export const IcTablet = (p) => (
  <S {...p}><circle cx="9" cy="10" r="5" /><circle cx="15.5" cy="15" r="5" /></S>
);
export const IcBottle = (p) => (
  <S {...p}><path d="M10 3h4v3l1.5 2.5A3 3 0 0 1 16 10v8a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-8a3 3 0 0 1 .5-1.5L10 6V3Z" /><path d="M8 13h8" /></S>
);
export const IcCase = (p) => ( // travel case / storage
  <S {...p}><rect x="3" y="7" width="18" height="12" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18" /></S>
);
export const IcManual = (p) => ( // guide / instructions
  <S {...p}><path d="M5 4h9a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" /><path d="M16 6h3v14h-3" /><path d="M8 8h5M8 11h5" /></S>
);
export const IcGel = (p) => ( // gel pen / syringe
  <S {...p}><path d="M5 19l3-3M9 15l6-6a2 2 0 0 1 3 3l-6 6-4 1 1-4Z" /><path d="M14 8l2 2" /></S>
);
export const IcMouthpiece = (p) => ( // LED tray / U-shape
  <S {...p}><path d="M4 8a8 6 0 0 0 16 0" /><path d="M4 8c0-2 2-3 8-3s8 1 8 3" /><path d="M7 12.5a5 4 0 0 0 10 0" /></S>
);
export const IcFloss = (p) => (
  <S {...p}><circle cx="12" cy="9" r="5" /><circle cx="12" cy="9" r="1.5" /><path d="M8 13.5 6 21M16 13.5 18 21" /></S>
);
export const IcCharger = (p) => (
  <S {...p}><rect x="6" y="3" width="12" height="14" rx="3" /><path d="M12 17v4M9 21h6M12 7v4" /></S>
);
export const IcSachet = (p) => (
  <S {...p}><path d="M6 5h12l-1 15H7L6 5Z" /><path d="M6 5V4h12v1M9 9h6" /></S>
);

/* Named lookup so markdown/copy can reference an icon by string key */
export const SHOP_ICON = {
  glow: IcGlow, moon: IcMoon, heart: IcHeart, gem: IcGem, timer: IcTimer,
  battery: IcBattery, drop: IcDrop, tooth: IcToothLine, plane: IcPlane, bolt: IcBolt,
  leaf: IcLeaf, wind: IcWind, bag: IcBag, target: IcTarget, recycle: IcRecycle,
  flask: IcFlask, wave: IcWave, wrench: IcWrench, hands: IcHands, balloon: IcBalloon,
  smile: IcSmile, family: IcFamily, check: IcCircleCheck, brush: IcBrushLine,
  spark: IcSpark, shield: IcShield, verified: IcVerified, star: IcStar, info: IcInfo,
  // box-content keys
  box: IcBox, cable: IcCable, tip: IcTip, tablet: IcTablet, bottle: IcBottle,
  case: IcCase, manual: IcManual, gel: IcGel, mouthpiece: IcMouthpiece,
  floss: IcFloss, charger: IcCharger, sachet: IcSachet,
};

export function ShopIcon({ name, className }) {
  const C = SHOP_ICON[name] || IcSpark;
  return <C className={className} />;
}
