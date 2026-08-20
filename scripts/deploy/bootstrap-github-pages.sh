#!/usr/bin/env bash
# Bootstrap GitHub Pages deployment for showcase-sites monorepo
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== 1. Git init + commit ==="
if [[ ! -d .git ]]; then
  git init
  git branch -M main
fi
git add -A
if git diff --cached --quiet; then
  echo "Nothing to commit"
else
  git commit -m "$(cat <<'EOF'
Launch showcase sites with 3D CRT landing and office game.

Personal and company SvelteKit apps with GitHub Pages deploy workflows,
Namecheap DNS cutover scripts, and interactive portfolio experiences.
EOF
)"
fi

echo ""
echo "=== 2. Create/push monorepo ==="
if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create callsea1/showcase-sites --public --source=. --remote=origin --push
else
  git push -u origin main
fi

echo ""
echo "=== 3. Create deploy repos (if missing) ==="
for repo in seanpcallahan.net 3ninjallc.com janicacallahan.com; do
  if ! gh repo view "callsea1/$repo" >/dev/null 2>&1; then
    gh repo create "callsea1/$repo" --public --description "GitHub Pages deploy for $repo"
  else
    echo "  callsea1/$repo already exists"
  fi
done

echo ""
echo "=== 4. GH_PAGES_TOKEN secret ==="
if [[ -z "${GH_PAGES_TOKEN:-}" ]]; then
  echo "  Set GH_PAGES_TOKEN env var to a PAT with repo scope, then re-run:"
  echo "  GH_PAGES_TOKEN=ghp_... $0"
else
  gh secret set GH_PAGES_TOKEN --repo callsea1/showcase-sites --body "$GH_PAGES_TOKEN"
  echo "  Secret GH_PAGES_TOKEN set on callsea1/showcase-sites"
fi

echo ""
echo "=== 5. Trigger deploy workflows ==="
gh workflow run deploy-personal.yml --repo callsea1/showcase-sites
gh workflow run deploy-company.yml --repo callsea1/showcase-sites
gh workflow run deploy-janica.yml --repo callsea1/showcase-sites
echo "  Workflows dispatched. Monitor: https://github.com/callsea1/showcase-sites/actions"

echo ""
echo "=== 6. Pages custom domains (manual in GitHub UI if needed) ==="
echo "  seanpcallahan.net repo → Settings → Pages → custom domain: www.seanpcallahan.net"
echo "  3ninjallc.com repo     → Settings → Pages → custom domain: www.3ninjallc.com"
echo "  janicacallahan.com repo → Settings → Pages → custom domain: www.janicacallahan.com"
echo ""
echo "=== 7. DNS cutover ==="
echo "  namecheap auth login"
echo "  ./scripts/dns/backup-and-plan.sh"
echo "  ./scripts/dns/cutover-github-pages.sh"
