# robotics-home

A configurable landing page for a VEX robotics programme, shipped as a single
Docker image. **All content, branding and theme come from environment
variables** - there is nothing team-specific in the image and no external
runtime dependencies (no CDN, no remote config, no web fonts). Logos and card
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
| `LOGO_URL`, `LOGO_ALT`, `LOGO_HREF` | _(none)_ | Header logo; `LOGO_HREF` makes it a link |
| `LOGO_WHITE_BG` | `true` | White pill behind the logo |
| `FAVICON_URL` | logo | Favicon |
| `FOOTER_TEXT` | `© <year> <SITE_TITLE>` | Footer left |
| `FOOTER_SECONDARY_TEXT` | `VEX Robotics Competition` | Footer right |
| `ACCENT_COLOR` / `BACKGROUND_COLOR` / `PANEL_COLOR` | `#cbb58c` / `#111c2e` / `#142137` | Theme (6-digit hex) |
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
(`image` optional; `color` tints the card). Cards also accept `modalData`.

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
