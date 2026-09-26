#!/usr/bin/env bash
#
# Pull the latest main branch on the server and reload nginx.
#
# First time on the server:
#   sudo bash /var/www/bansal-international-school/deploy/deploy.sh
#
# Every update after that:
#   ssh user@your-server 'sudo bash /var/www/bansal-international-school/deploy/deploy.sh'
#
set -euo pipefail

SITE_DIR="${SITE_DIR:-/var/www/bansal-international-school}"
BRANCH="${BRANCH:-main}"
WEB_USER="${WEB_USER:-www-data}"

if [ ! -d "$SITE_DIR/.git" ]; then
  echo "error: $SITE_DIR is not a git checkout." >&2
  echo "Clone the repo there first, or set SITE_DIR=/path/to/checkout." >&2
  exit 1
fi

cd "$SITE_DIR"

echo "==> fetching origin/$BRANCH"
git fetch --prune origin "$BRANCH"

echo "==> hard-resetting working tree to origin/$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> fixing ownership ($WEB_USER) and permissions"
chown -R "$WEB_USER":"$WEB_USER" "$SITE_DIR"
find "$SITE_DIR" -type d -exec chmod 755 {} \;
find "$SITE_DIR" -type f -exec chmod 644 {} \;

if command -v nginx >/dev/null 2>&1; then
  echo "==> validating nginx config"
  nginx -t
  echo "==> reloading nginx"
  systemctl reload nginx
else
  echo "!! nginx not found — skipping web server reload"
fi

echo
echo "deployed: $(git rev-parse --short HEAD)  ($(git log -1 --pretty=%s))"
echo "site dir: $SITE_DIR"
