# Showcase Sites

Two portfolio showcase sites for **seanpcallahan.net** (five-app interactive launcher), **3ninjallc.com** (Wex-first principal engineer studio), and **janicacallahan.com** (Paper Planes-inspired EA portfolio).

## Stack

- **Monorepo:** pnpm workspaces
- **Apps:** SvelteKit 5 + adapter-static
- **Personal:** Five pill-launched portfolio apps (market sim, office adventure, MFE lab, career orbit, coach board)
- **Company:** Wex L6-first proof site with optional compact platformer
- **Janica:** Paper Planes WebGL portfolio (pastel sky, globe, interactive planes) for executive assistant profile
- **Shared:** `@showcase/content`, `@showcase/ai-proof`, `@showcase/ui`, `@showcase/engine-game`, `@showcase/engine-paperplanes`
- **Hosting:** GitHub Pages (`callsea1`)

## Development

```bash
pnpm install
pnpm dev:personal   # http://localhost:5173
pnpm dev:company    # http://localhost:5174
pnpm dev:janica     # http://localhost:5175
pnpm build          # build all apps
pnpm check          # svelte-check all apps
```

## Structure

```
apps/personal/     → seanpcallahan.net
apps/company/      → 3ninjallc.com
apps/janica/       → janicacallahan.com
packages/content/  → resume, stats, zones, app launcher config, janica-resume
packages/ai-proof/ → AI workflows, framework diagrams, evidence
packages/ui/       → shared Svelte components
packages/engine-game/ → office adventure + platformer levels
packages/engine-paperplanes/ → Three.js sky, globe, paper planes
```

## Personal site (5173)

Opens with CRT hero, **“Engaged, but open to a chat”** status (orange dot), and four stats: YC exit, engineers trained (1,400+), Cameo seed/Series A funding, sites migrated.

Five pill buttons load apps below the hero with smooth scroll:

1. **Market** — Railbird-inspired trading terminal (demo data)
2. **Adventure** — Brighter Zelda-style top-down office game with resume zones
3. **MFE Lab** — Module Federation composition diagram (Wex platform)
4. **Orbit** — Parallax space scroll resume timeline
5. **Coach** — Interactive helmet sticker board (player-coach leadership)

Reduced-motion users get `/fallback` link. All views are mobile-first with touch controls for canvas games.

## Company site (5174)

Wex Principal L6 lead — $6B revenue fintech, company-wide MFE platform. **Efforts:** Wex, Railbird, Blisser. Optional compact platformer with **inline evidence cards** (no modal popups). Archive for earlier roles.

## Janica site (5175)

Paper Planes-inspired WebGL portfolio for **Janica Callahan** — Executive Assistant / Account Manager. Pastel sky shader, rotating globe with Chicago/Dubai/Bukidnon markers, click-to-launch paper planes with location stamps. Scrollable frosted-glass resume sections. Reduced-motion users get `/fallback`.

## Deployment

See [`scripts/deploy/bootstrap-github-pages.sh`](scripts/deploy/bootstrap-github-pages.sh) and [`scripts/dns/README.md`](scripts/dns/README.md).

Custom domains should use **`www.`** subdomain in GitHub Pages settings for TLS on both apex and www.

## AI positioning

Both sites demonstrate AI as an engineering force multiplier with evidence-backed content, representative framework diagrams, and interactive proof modules.
