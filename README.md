# Showcase Sites

Two Awwwards-caliber showcase sites for **seanpcallahan.net** (top-down executive office game) and **3ninjallc.com** (ninja platformer + studio shell).

## Stack

- **Monorepo:** pnpm workspaces
- **Apps:** SvelteKit 5 + adapter-static
- **Personal:** Canvas top-down office adventure (zelda-js-style grid) + GSAP
- **Company:** KAPLAY ninja platformer
- **Shared:** `@showcase/content`, `@showcase/ai-proof`, `@showcase/ui`
- **Hosting:** GitHub Pages (`callsea1`)

## Development

```bash
pnpm install
pnpm dev:personal   # http://localhost:5173
pnpm dev:company    # http://localhost:5173
pnpm build          # build both apps
```

## Structure

```
apps/personal/     → seanpcallahan.net
apps/company/      → 3ninjallc.com
packages/content/  → resume, zones, case studies
packages/ai-proof/ → AI workflows, framework diagrams, evidence
packages/ui/       → shared Svelte components
```

## Deployment

### Quick launch (after prerequisites)

```bash
# 1. Accept Xcode license (required for git on macOS)
sudo xcodebuild -license accept

# 2. Re-authenticate GitHub CLI
gh auth login -h github.com

# 3. Bootstrap repos, secret, and deploy workflows
GH_PAGES_TOKEN=ghp_your_pat ./scripts/deploy/bootstrap-github-pages.sh

# 4. DNS cutover (preserves email MX)
export NAMECHEAP_API_USER=... NAMECHEAP_API_KEY=... NAMECHEAP_USERNAME=...
./scripts/dns/backup-and-plan.sh
./scripts/dns/cutover-github-pages.sh
```

See [`scripts/deploy/bootstrap-github-pages.sh`](scripts/deploy/bootstrap-github-pages.sh) and [`scripts/dns/README.md`](scripts/dns/README.md) for details.

### Manual setup

1. Push this repo to `callsea1/showcase-sites` on GitHub
2. Create empty repos: `callsea1/seanpcallahan.net`, `callsea1/3ninjallc.com`
3. Add repo secret `GH_PAGES_TOKEN` (PAT with repo scope)
4. Enable GitHub Pages on each deploy repo: **Source → Deploy from branch `gh-pages`**
5. Set custom domains in each repo's Pages settings
6. Run DNS cutover — see `scripts/dns/README.md`

## AI positioning

Both sites demonstrate AI as an engineering force multiplier with:
- Evidence-backed resume content
- Representative framework diagrams (anonymized for confidentiality)
- Interactive AI Command Center (personal) and AI Dojo (company)

## Experience notes

### 3ninjallc.com

The company site is a monochrome, code-driven “Cloud Dojo OS.” Its original canvas platformer has four authored levels, camera-following movement, checkpoints, enemies, hazards, collectibles, score, lives, pause/retry, level completion, and a final victory state. Collectibles unlock evidence-labeled engineering stories.

The game uses original procedural/vector art and does not reuse Nintendo-owned assets, sounds, names, levels, or branding. The Mario repository is used only as a reference for loop ordering, entity data, collision bounds, camera behavior, and explicit game states.

### seanpcallahan.net

The personal site opens with an original CRT/terminal entrance inspired by the supplied retro-WebGL reference. **Enter the Office** launches a top-down canvas adventure: walk the Chicago high-rise suite, inspect resume zones (desk, window, trophies, AI whiteboard), fight “tech debt” bugs, and open the AI Command Center. `/fallback` remains available for reduced-motion visitors.

The office game uses an original map layout and does not reuse Nintendo-owned assets, sounds, names, or branding. [zelda-js](https://github.com/Matthew-SA/zelda-js) is used only as a reference for grid collision, minimap, health, and top-down exploration patterns.
