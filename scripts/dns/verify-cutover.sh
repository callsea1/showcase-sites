#!/usr/bin/env bash
set -euo pipefail

DOMAINS=("seanpcallahan.net" "3ninjallc.com" "janicacallahan.com")

for d in "${DOMAINS[@]}"; do
  echo "=== $d ==="
  echo "MX (must match backup):"
  dig MX "$d" +short
  echo "HTTP:"
  curl -sI "https://$d" 2>/dev/null | head -3 || echo "(not yet live)"
  echo ""
done
