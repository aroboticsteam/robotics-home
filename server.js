// Zero-dependency production server for robotics-home.
// Serves the built SPA from ./dist and injects configuration taken from
// environment variables into the HTML at startup. See README.md for the
// full list of variables.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { themeCss, themeColor, colorScheme } from './theme.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const env = process.env;

// ---------------------------------------------------------------- helpers
const fail = (msg) => {
  console.error(`[config] ${msg}`);
  process.exit(1);
};
const str = (name, fallback = '') => (env[name] !== undefined && env[name] !== '' ? env[name] : fallback);
const bool = (name, fallback) => {
  const v = str(name);
  return v === '' ? fallback : /^(1|true|yes|on)$/i.test(v);
};
const json = (name) => {
  const v = str(name);
  if (!v) return undefined;
  try {
    return JSON.parse(v);
  } catch (e) {
    return fail(`${name} is not valid JSON: ${e.message}`);
  }
};

// ----------------------------------------------------------------- config
const year = new Date().getFullYear();
const title = str('SITE_TITLE', 'Robotics');
const statsUrl = str('STATS_URL').replace(/\/+$/, '');

let navLinks = json('NAV_LINKS');
if (!navLinks && statsUrl) {
  navLinks = [
    { label: 'VIQRC Current Season', href: `${statsUrl}/viqrc/curr` },
    { label: 'VIQRC Previous Performance', href: `${statsUrl}/viqrc/all` },
    { label: 'V5RC Current Season', href: `${statsUrl}/v5rc/curr` },
    { label: 'V5RC Previous Performance', href: `${statsUrl}/v5rc/all` },
  ];
}

let cards = json('CARDS');
if (!cards && statsUrl) {
  cards = [
    { title: 'VIQRC Teams', subtitle: 'VEX IQ Robotics Competition', href: `${statsUrl}/viqrc`, color: 'iq' },
    { title: 'V5RC Teams', subtitle: 'VEX V5 Robotics Competition', href: `${statsUrl}/v5rc`, color: 'v5' },
  ];
}
for (const [name, v] of [['NAV_LINKS', navLinks], ['CARDS', cards]]) {
  if (v !== undefined && !Array.isArray(v)) fail(`${name} must be a JSON array`);
}


const siteConfig = {
  title,
  heading: str('WELCOME_HEADING', `Welcome to ${title}`),
  tagline: str('TAGLINE'),
  logo: str('LOGO_URL')
    ? { src: str('LOGO_URL'), darkSrc: str('LOGO_DARK_URL'), alt: str('LOGO_ALT', `${title} logo`), href: str('LOGO_HREF') }
    : null,
  navLinks: navLinks || [],
  cards: cards || [],
  footer: {
    text: str('FOOTER_TEXT', `© ${year} ${title}`),
    secondary: str('FOOTER_SECONDARY_TEXT', 'VEX Robotics Competition'),
  },
};


const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const inlineJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

const favicon = str('FAVICON_URL') || (siteConfig.logo ? siteConfig.logo.src : '');
const runtimeHead = [
  `<title>${esc(title)}</title>`,
  `<meta name="color-scheme" content="${colorScheme}" />`,
  `<meta name="theme-color" content="${themeColor}" />`,
  favicon ? `<link rel="icon" href="${esc(favicon)}" />` : '',
  `<style>${themeCss}</style>`,
  `<script>window.__SITE_CONFIG__=${inlineJson(siteConfig)};</script>`,
].join('\n    ');

// ----------------------------------------------------------------- server
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};

const indexTemplate = fs.existsSync(path.join(DIST, 'index.html'))
  ? fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  : fail('dist/index.html not found - run "npm run build" first');
const indexHtml = indexTemplate.replace('<!--RUNTIME_HEAD-->', runtimeHead);

// Optional directory (e.g. a mounted volume) served at /media/ for logos/images.
const MEDIA_DIR = path.resolve(str('MEDIA_DIR', '/media'));

const baseHeaders = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' };

function sendFile(res, req, file, cache) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return notFound(res);
    res.writeHead(200, {
      ...baseHeaders,
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': cache,
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

function notFound(res) {
  res.writeHead(404, { ...baseHeaders, 'Content-Type': 'text/plain' });
  res.end('Not found');
}

function sendIndex(req, res) {
  res.writeHead(200, { ...baseHeaders, 'Content-Type': MIME['.html'], 'Cache-Control': 'no-cache' });
  res.end(req.method === 'HEAD' ? undefined : indexHtml);
}

function resolveWithin(dir, rel) {
  const file = path.join(dir, rel);
  return file === dir || file.startsWith(dir + path.sep) ? file : null;
}

const server = http
  .createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    } catch {
      return notFound(res);
    }

    if (pathname === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end('ok');
    }
    if (pathname === '/' || pathname === '/index.html') return sendIndex(req, res);

    if (pathname.startsWith('/media/')) {
      const file = resolveWithin(MEDIA_DIR, pathname.slice('/media/'.length));
      return file ? sendFile(res, req, file, 'public, max-age=3600') : notFound(res);
    }

    const file = resolveWithin(DIST, pathname.slice(1));
    if (!file) return notFound(res);
    const immutable = pathname.startsWith('/assets/');
    if (path.extname(pathname)) return sendFile(res, req, file, immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600');
    return sendIndex(req, res); // SPA fallback
  })
  .listen(Number(str('PORT', '8080')), '0.0.0.0', () => {
    console.log(`robotics-home listening on :${str('PORT', '8080')}`);
  });

// Graceful shutdown so rolling updates / scale-down don't drop requests.
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10000).unref();
  });
}
