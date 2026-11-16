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

const THEME_COLORS = new Set(['iq', 'v5', 'accent', 'link', 'ok', 'red', 'blue', 'muted']);

/**
 * A card colour -> a CSS colour with alpha. Accepts "#rrggbb" or a theme colour name
 * (iq, v5, accent, link, ok, red, blue, muted), so card colours can follow the brand palette.
 * Falls back to slate for anything else.
 */
export function withAlpha(color, alpha) {
  if (THEME_COLORS.has(color)) return `rgb(var(--${color}) / ${alpha})`;
  const m = /^#?([0-9a-f]{6})$/i.exec(color || '');
  if (!m) return `rgb(var(--s-500) / ${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${alpha})`;
}

/**
 * Desktop grid for n cards: 1 -> 1x1, 2 -> two side by side, 3 -> 2x2 where the last card takes the whole right
 * half (see .cards in index.css), 4 -> 2x2, more -> a near-square grid. On small screens the cards just stack.
 */
export function gridFor(n) {
  if (n <= 1) return { cols: 1, rows: 1 };
  if (n === 2) return { cols: 2, rows: 1 };
  if (n <= 4) return { cols: 2, rows: 2 };
  const cols = Math.ceil(Math.sqrt(n));
  return { cols, rows: Math.ceil(n / cols) };
}
