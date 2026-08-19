#!/usr/bin/env bash
# Cut over web DNS to GitHub Pages — preserves MX/TXT/SPF/DKIM
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Pre-cutover MX snapshot ==="
for d in seanpcallahan.net 3ninjallc.com; do
  echo "$d:"
  dig MX "$d" +short
done
echo ""

if [[ -n "${NAMECHEAP_API_USER:-}" && -n "${NAMECHEAP_API_KEY:-}" ]]; then
  node scripts/dns/cutover-api.mjs
else
  echo "Namecheap API credentials not set."
  echo "Export NAMECHEAP_API_USER, NAMECHEAP_API_KEY, NAMECHEAP_USERNAME then re-run."
  echo ""
  echo "Or use the broken CLI path (when fixed):"
  NC="${NAMECHEAP_CMD:-namecheap}"
  echo "  $NC dns set ..."
  exit 1
fi

"$(dirname "$0")/verify-cutover.sh"
