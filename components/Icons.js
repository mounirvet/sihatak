// Clean, premium line-icons (currentColor, 1.6 stroke) — replaces all emojis.
// Each takes an optional className for sizing/color via Tailwind.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconSearch({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function IconMenu({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconCheck({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconClock({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconLink({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M10 14a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 10a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}

export function IconShare({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2" />
    </svg>
  );
}

export function IconWhatsApp({ className = 'w-4 h-4' }) {
  // Simple, recognizable WhatsApp glyph (kept minimal/monochrome for premium look)
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4c0-.1-.6-1.5-.8-2s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3 5.3 5.3 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4.1c.6.3 1.1.4 1.5.6a3.6 3.6 0 0 0 1.6.1c.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3Z" />
    </svg>
  );
}

export function IconX({ className = 'w-4 h-4' }) {
  // X / Twitter glyph
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.2 2H21l-6.6 7.5L22 22h-6.1l-4.8-6.3L5.6 22H2.8l7-8L2 2h6.3l4.3 5.7L18.2 2Zm-2.1 18h1.7L7.9 3.8H6.1L16.1 20Z" />
    </svg>
  );
}

export function IconArrowL({ className = 'w-4 h-4' }) {
  // Arrow pointing left (forward in RTL reading)
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M19 12H5m6-7-7 7 7 7" />
    </svg>
  );
}

export function IconArrowUp({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M12 19V5m-7 7 7-7 7 7" />
    </svg>
  );
}

export function IconChevronDown({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ===== Pillar icons — clean line glyphs, one per content pillar =====
export function IconTooth({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M7.5 3.5C5.5 3.5 4 5 4 7.3c0 1.7.6 2.8.9 4.3.3 1.4.2 2.6.6 4.3.3 1.3.6 3.6 1.6 3.6 1.2 0 1-2.3 1.6-3.7.3-.8.7-1.3 1.3-1.3s1 .5 1.3 1.3c.6 1.4.4 3.7 1.6 3.7 1 0 1.3-2.3 1.6-3.6.4-1.7.3-2.9.6-4.3.3-1.5.9-2.6.9-4.3C20 5 18.5 3.5 16.5 3.5c-1.6 0-2.6 1-4.5 1s-2.9-1-4.5-1Z" />
    </svg>
  );
}

export function IconShield({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M12 3 5 6v5c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconChild({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="6" r="2.5" />
      <path d="M12 8.5v6m0-3H8m4 0h4m-4 6 -2.5 2.5M12 17.5l2.5 2.5" />
    </svg>
  );
}

export function IconSparkle({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M12 3c.5 3.5 1.5 4.5 5 5-3.5.5-4.5 1.5-5 5-.5-3.5-1.5-4.5-5-5 3.5-.5 4.5-1.5 5-5Z" />
      <path d="M18 14c.3 1.7.8 2.2 2.5 2.5-1.7.3-2.2.8-2.5 2.5-.3-1.7-.8-2.2-2.5-2.5 1.7-.3 2.2-.8 2.5-2.5Z" />
    </svg>
  );
}

export function IconBrush({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M3 20.5 12 11.5m0 0 2.5-2.5m-2.5 2.5-2-2 2.5-2.5 2 2L12 11.5Zm2.5-4.5L19 4a1.5 1.5 0 0 1 2 2l-4 4.5" />
      <path d="M5 16l3 3" />
    </svg>
  );
}

export function IconImplant({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      <path d="M12 3c2 0 3.5 1.5 3.5 3.5 0 1.3-.7 2-1 3H9.5c-.3-1-1-1.7-1-3C8.5 4.5 10 3 12 3Z" />
      <path d="M10 9.5h4M10.3 12h3.4M10.7 14.5h2.6M11.2 17h1.6M11.7 19.5h.6" />
    </svg>
  );
}

// Map pillar slug -> icon component, used by PillarCard.
export const PILLAR_ICONS = {
  'amrad-al-litha': IconTooth,
  'tasawwus-al-asnan': IconShield,
  'asnan-al-atfal': IconChild,
  'tabyid-al-asnan': IconSparkle,
  'al-inaya-al-yawmiyya': IconBrush,
  'ziraat-al-asnan': IconImplant,
};
