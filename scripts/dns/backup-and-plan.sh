#!/usr/bin/env bash
# Safe DNS cutover helper — preserves email records
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DOMAINS=("seanpcallahan.net" "3ninjallc.com")

echo "=== DNS baseline backup ==="
cd "$ROOT"

if namecheap auth status >/dev/null 2>&1; then
  echo "Using namecheap CLI (run from monorepo root for package.json version)..."
  for d in "${DOMAINS[@]}"; do
    namecheap dns list "$d" --json > "$ROOT/scripts/dns/${d}.before.json"
    echo "Saved scripts/dns/${d}.before.json"
  done
elif [[ -n "${NAMECHEAP_API_USER:-}" && -n "${NAMECHEAP_API_KEY:-}" ]]; then
  node "$ROOT/scripts/dns/backup-api.mjs"
else
  echo "Not authenticated — run: namecheap auth login"
  echo "Saving dig-only placeholders..."
  for d in "${DOMAINS[@]}"; do
    echo "{\"domain\":\"$d\",\"status\":\"pending_auth\",\"note\":\"Run namecheap auth login from repo root\"}" > "$ROOT/scripts/dns/${d}.before.json"
  done
fi

for d in "${DOMAINS[@]}"; do
  echo "MX records for $d:"
  dig MX "$d" +short
done

echo ""
echo "=== Next steps ==="
echo "  namecheap auth login   # if not authenticated"
echo "  ./scripts/dns/cutover-github-pages.sh"
