# Namecheap CLI + DNS cutover

## Install

```bash
npm install -g @helgesverre/namecheap-cli
```

If the CLI crashes with `pkg.name and pkg.version required`, ensure the **current directory's** `package.json` has both `name` and `version` (the monorepo root includes `"version": "1.0.0"` for this reason).

On Node 25, you can also run from any directory with a valid package.json, or use:

```bash
cd /path/with/package.json  # must include "name" and "version"
namecheap domains list
```

## Authenticate

**Option A — API env vars (recommended; CLI is currently broken on Node 22/25):**

1. Namecheap → Profile → Tools → API Access → enable + whitelist your IP
2. Export credentials:

```bash
export NAMECHEAP_API_USER="your_api_user"
export NAMECHEAP_API_KEY="your_api_key"
export NAMECHEAP_USERNAME="your_namecheap_username"
```

**Option B — namecheap-cli (when fixed):**

```bash
npm install -g @helgesverre/namecheap-cli
namecheap auth login
```

## Backup & verify

```bash
chmod +x scripts/dns/*.sh
./scripts/dns/backup-and-plan.sh   # saves *.before.json, prints MX
# After GitHub Pages is live:
./scripts/dns/cutover-github-pages.sh
./scripts/dns/verify-cutover.sh
```

## GitHub Pages DNS (web only)

| Type  | Host  | Value |
| ----- | ----- | ----- |
| A     | `@`   | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| CNAME | `www` | `callsea1.github.io` |

**Never modify MX, TXT, SPF, or DKIM.**

`cutover-github-pages.sh` updates only A/CNAME web records and removes URL/FRAME redirects on `@`/`www`. Always diff MX against `*.before.json` before and after.

## Full launch runbook

1. Push `main` to `callsea1/showcase-sites` (triggers deploy workflows)
2. Confirm `gh-pages` branches in `callsea1/seanpcallahan.net` and `callsea1/3ninjallc.com`
3. Enable Pages on each deploy repo → branch `gh-pages`, set custom domain
4. `namecheap auth login`
5. `./scripts/dns/backup-and-plan.sh`
6. `./scripts/dns/cutover-github-pages.sh`
7. `./scripts/dns/verify-cutover.sh`
