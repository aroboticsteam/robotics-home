# robotics-home

A configurable landing page for a VEX robotics programme, shipped as a single
Docker image. **All content, branding and theme come from environment
variables** - there is nothing team-specific in the image and no external
runtime dependencies (no CDN, no remote config; the one font is shipped in the image). Logos and card
images can be any URL you provide.

## Run

```bash
cp .env.example .env     # edit
docker compose up --build
# -> http://localhost:8080
```

Or without compose:

```bash
docker build -t robotics-home .
docker run --rm -p 8080:8080 -e SITE_TITLE="My Club" -e STATS_URL=https://stats.example.org robotics-home
```

## Configuration

| Variable | Default | Description |
|---|---|---|
| `SITE_TITLE` | `Robotics` | Page title / default heading |
| `WELCOME_HEADING` | `Welcome to <SITE_TITLE>` | Hero heading |
| `TAGLINE` | _(none)_ | Line under the heading |
| `LOGO_URL`, `LOGO_DARK_URL`, `LOGO_ALT`, `LOGO_HREF` | _(none)_ | Logo shown above the heading. `LOGO_URL` is for light backgrounds (dark text), `LOGO_DARK_URL` the inverted version used in dark mode; with only `LOGO_URL` it is shown as-is in both. Flat white/navy backgrounds are blended away, so no box is drawn. `LOGO_HREF` makes it a link. URLs can be `/media/<file>` |
| `FAVICON_URL` | logo | Favicon |
| `FOOTER_TEXT` | `© <year> <SITE_TITLE>` | Footer left |
| `FOOTER_SECONDARY_TEXT` | `VEX Robotics Competition` | Footer right |
| `THEME_MODE` | `auto` | `auto` (dark, light when the visitor's system prefers it), `dark` or `light` |
| `THEME_<TOKEN>` | QE brand (navy) | Dark palette, 6-digit hex. `<TOKEN>` is `BG` `BG2` `CARD` `RAISE` `LINE` `INK` `MUTED` `ACCENT` `LINK` `OK` `RED` `BLUE`, e.g. `THEME_BG=#000E23` |
| `THEME_LIGHT_<TOKEN>` | QE brand (light) | Same tokens for the light palette, e.g. `THEME_LIGHT_BG=#F2F4F7` |
| `IQ_COLOR`, `V5_COLOR` | `#0C7C9D`, `#9A2339` | Programme colours (VEX IQ, V5) |
| `FONT_HEADING`, `FONT_HEADING_URL` | `Space Grotesk`, `/fonts/space-grotesk.woff2` | Heading font and its woff2 (shipped in the image; set the URL to an empty value to use the system font) |
| `ACCENT_COLOR`, `BACKGROUND_COLOR`, `PANEL_COLOR` | _(unset)_ | Older names for `THEME_ACCENT`, `THEME_BG`, `THEME_CARD` (dark palette) |
| `STATS_URL` | _(none)_ | Base URL of a robotics-stats deployment; generates the default cards and nav links |
| `NAV_LINKS` | from `STATS_URL` | JSON array, see below |
| `CARDS` | from `STATS_URL` | JSON array, see below |
| `MEDIA_DIR` | `/media` | Directory served at `/media/` (mount a volume for local logos/images) |
| `PORT` | `8080` | Listen port |

**`NAV_LINKS`**: `[{"label":"About","href":"https://example.org"}]`. An item may
omit `href` and carry a `modalData` object instead to open a popup
(`badge`, `title`, `description`, `stats:[{label,val}]`, `points:[]`,
`features:[]`, `highlights:[{event,result}]`, `partners:[{name,role,desc,logo}]`).

**`CARDS`**: `[{"title":"VIQRC Teams","subtitle":"Junior","image":"/media/viqrc.jpg","href":"https://stats.example.org/viqrc","color":"#0e7490"}]`
(`image` optional; `color` tints the card: a hex colour, or a theme colour name - `iq`, `v5`, `accent`, `link`, `ok`, `red`, `blue` - so it follows the palette). Cards also accept `modalData`.

**Card layout** arranges itself from the number of cards. On desktop the grid fills exactly one viewport (header and footer included): 1 card fills it, 2 sit side by side, 3 make a 2x2 grid where the last card takes the whole right half, 4 make 2x2, and more make a near-square grid. On phones and short windows the cards stack vertically and the page scrolls.

## Scaling

The container is stateless (config is read from env at start-up), so run as many
replicas as you like behind any load balancer. `GET /healthz` is the health
check; the server drains on `SIGTERM`. Example:

```bash
docker compose -f docker-compose.scale.yml up --build --scale home=3
```

## Development

```bash
npm install
npm run dev                          # Vite dev server, default config
npm run build && SITE_TITLE=Demo npm start
```

## CI

`.github/workflows/docker.yml` builds amd64 and arm64 natively in a matrix (no emulation) on every push and PR, then merges them into one multi-arch tag. Pushes to `main` and `v*` tags publish to `ghcr.io/<owner>/<repo>` (`latest`, `sha-*`, and semver tags). Pull requests only verify the build. No secrets needed beyond the default `GITHUB_TOKEN`.
