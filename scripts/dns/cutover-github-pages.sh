#!/usr/bin/env bash
# Cut over web DNS to GitHub Pages via namecheap CLI — preserves MX/TXT/SPF/DKIM
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

GITHUB_A=("185.199.108.153" "185.199.109.153" "185.199.110.153" "185.199.111.153")
GITHUB_WWW="callsea1.github.io"
DOMAINS=("seanpcallahan.net" "3ninjallc.com")

echo "=== Pre-cutover MX snapshot ==="
for d in "${DOMAINS[@]}"; do
  echo "$d:"
  dig MX "$d" +short
done
echo ""

namecheap auth status >/dev/null

cutover_domain() {
  local domain=$1
  echo "=== Updating $domain ==="

  while IFS= read -r line; do
    id=$(echo "$line" | awk -F'|' '{print $2}' | tr -d ' ')
    type=$(echo "$line" | awk -F'|' '{print $3}' | tr -d ' ')
    name=$(echo "$line" | awk -F'|' '{print $4}' | tr -d ' ')
    [[ -z "$id" || "$id" == "ID" ]] && continue
    if [[ "$type" == "URL" || "$type" == "FRAME" || "$type" == "URL301" ]]; then
      echo "  Removing $type $name ($id)"
      namecheap dns rm "$domain" "$id" --force
    fi
  done < <(namecheap dns list "$domain" | grep '^|' || true)

  local a_ids=()
  while IFS= read -r line; do
    id=$(echo "$line" | awk -F'|' '{print $2}' | tr -d ' ')
    type=$(echo "$line" | awk -F'|' '{print $3}' | tr -d ' ')
    name=$(echo "$line" | awk -F'|' '{print $4}' | tr -d ' ')
    [[ -z "$id" || "$id" == "ID" ]] && continue
    if [[ "$type" == "A" && "$name" == "@" ]]; then
      a_ids+=("$id")
    fi
  done < <(namecheap dns list "$domain" | grep '^|' || true)

  local idx=0
  for ip in "${GITHUB_A[@]}"; do
    idx=$((idx + 1))
    if ((${#a_ids[@]} >= idx)); then
      echo "  Setting A @ -> $ip (${a_ids[idx-1]})"
      namecheap dns set "$domain" "${a_ids[idx-1]}" --type A --name @ --value "$ip"
    else
      echo "  Adding A @ -> $ip"
      namecheap dns add "$domain" --type A --name @ --value "$ip"
    fi
  done

  local www_id=""
  while IFS= read -r line; do
    id=$(echo "$line" | awk -F'|' '{print $2}' | tr -d ' ')
    type=$(echo "$line" | awk -F'|' '{print $3}' | tr -d ' ')
    name=$(echo "$line" | awk -F'|' '{print $4}' | tr -d ' ')
    [[ -z "$id" || "$id" == "ID" ]] && continue
    if [[ "$type" == "CNAME" && "$name" == "www" ]]; then
      www_id=$id
    fi
  done < <(namecheap dns list "$domain" | grep '^|' || true)

  if [[ -n "$www_id" ]]; then
    echo "  Setting CNAME www -> $GITHUB_WWW ($www_id)"
    namecheap dns set "$domain" "$www_id" --type CNAME --name www --value "$GITHUB_WWW"
  else
    echo "  Adding CNAME www -> $GITHUB_WWW"
    namecheap dns add "$domain" --type CNAME --name www --value "$GITHUB_WWW"
  fi

  echo "  Current web records:"
  namecheap dns list "$domain" | grep -E 'A |CNAME |URL ' || true
  echo ""
}

for d in "${DOMAINS[@]}"; do
  cutover_domain "$d"
done

echo "=== Post-cutover MX (must match pre-cutover) ==="
for d in "${DOMAINS[@]}"; do
  echo "$d:"
  dig MX "$d" +short
done

"$(dirname "$0")/verify-cutover.sh"
