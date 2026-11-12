// The server injects `window.__SITE_CONFIG__` (built from environment
// variables) into the page. These defaults are only used by `npm run dev`.
const defaults = {
  title: 'Robotics',
  heading: 'Welcome to Robotics',
  tagline: '',
  logo: null,
  navLinks: [],
  cards: [],
  footer: { text: `© ${new Date().getFullYear()} Robotics`, secondary: 'VEX Robotics Competition' },
};

export const siteConfig = { ...defaults, ...(typeof window !== 'undefined' ? window.__SITE_CONFIG__ : {}) };

/** "#rrggbb" + alpha -> "rgb(r g b / a)". Falls back to slate for anything else. */
export function withAlpha(color, alpha) {
  const m = /^#?([0-9a-f]{6})$/i.exec(color || '');
  if (!m) return `rgb(100 116 139 / ${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${alpha})`;
}
