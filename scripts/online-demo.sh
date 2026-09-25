#!/usr/bin/env bash
# online-demo.sh — keep Meridian CRM reachable from the internet while running
# on this machine.
#
# Architecture of the public demo:
#   - Frontend: Vercel (permanent)  https://meridian-crm-xi.vercel.app
#   - Database: Neon PostgreSQL (hosted, persistent)
#   - Backend + Redis: THIS machine (backend on :4000, Redis container)
#   - Backend is exposed via a Cloudflare quick tunnel; Vercel rewrites
#     /api/* to <tunnel-url>/api/v1/*
#
# Quick tunnels get a NEW random URL each time they restart, so `start`
# re-points the Vercel env var and redeploys the frontend (~3 min).
#
# The public backend dies when this machine sleeps/shuts down.
#
# Usage:
#   scripts/online-demo.sh start     # start backend + redis + tunnel, repoint Vercel, redeploy
#   scripts/online-demo.sh stop      # stop tunnel + backend (+ redis)
#   scripts/online-demo.sh status    # health of each piece
#   scripts/online-demo.sh url       # print current public backend URL

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_ENV="$ROOT/.ai/runtime.env"
LOG_DIR="${TMPDIR:-/tmp}/meridian-live"
BACKEND_LOG="$LOG_DIR/backend.log"
TUNNEL_LOG="$LOG_DIR/cloudflared.log"
mkdir -p "$LOG_DIR"

redis_up()    { docker ps --format '{{.Names}}' 2>/dev/null | grep -qx crm-redis-live; }
backend_up()  { curl -sf -m 5 http://localhost:4000/api/v1/health/liveness >/dev/null 2>&1; }
tunnel_url()  { grep -oE 'https://[a-z0-9.-]+\.trycloudflare\.com' "$TUNNEL_LOG" 2>/dev/null | head -1; }

start() {
  echo "→ Redis…"
  redis_up || docker run -d --name crm-redis-live -p 6379:6379 \
    redis:7-alpine redis-server --requirepass redis_password >/dev/null

  echo "→ Backend…"
  if ! backend_up; then
    [ -f "$ROOT/backend/dist/src/main.js" ] || (cd "$ROOT/backend" && npm run build)
    (cd "$ROOT/backend" && set -a && source "$RUNTIME_ENV" && set +a \
      && setsid nohup node dist/src/main.js > "$BACKEND_LOG" 2>&1 &)
    for _ in $(seq 1 45); do backend_up && break; sleep 2; done
    backend_up || { echo "✗ backend failed to boot — see $BACKEND_LOG"; exit 1; }
  fi
  echo "  backend OK (http://localhost:4000/api/v1)"

  echo "→ Cloudflare tunnel…"
  pkill -f 'cloudflared tunnel --url' 2>/dev/null || true
  sleep 1
  setsid nohup cloudflared tunnel --url http://localhost:4000 --no-autoupdate \
    > "$TUNNEL_LOG" 2>&1 &
  local url=""
  for _ in $(seq 1 20); do url="$(tunnel_url || true)"; [ -n "$url" ] && break; sleep 1; done
  [ -n "$url" ] || { echo "✗ tunnel failed — see $TUNNEL_LOG"; exit 1; }
  curl -sf -m 20 "$url/api/v1/health/liveness" >/dev/null \
    || { echo "✗ tunnel up but backend unreachable through it"; exit 1; }
  echo "  tunnel OK → $url"

  echo "→ Repointing Vercel + redeploying frontend (≈3 min)…"
  (cd "$ROOT/frontend" \
    && (vercel env rm NEXT_PUBLIC_API_URL_INTERNAL production -y >/dev/null 2>&1 || true) \
    && printf '%s/api/v1' "$url" | vercel env add NEXT_PUBLIC_API_URL_INTERNAL production >/dev/null \
    && vercel --prod --yes >/dev/null)
  echo "  frontend OK → https://meridian-crm-xi.vercel.app"
  echo "✅ online-demo is live"
}

stop() {
  pkill -f 'cloudflared tunnel --url' 2>/dev/null && echo "tunnel stopped" || echo "tunnel not running"
  pkill -f 'node dist/src/main.js' 2>/dev/null && echo "backend stopped" || echo "backend not running"
  docker rm -f crm-redis-live >/dev/null 2>&1 && echo "redis stopped" || echo "redis not running"
}

status() {
  local url="$(tunnel_url || true)"
  printf '%-10s %s\n' "redis:"   "$(redis_up && echo running || echo down)"
  printf '%-10s %s\n' "backend:" "$(backend_up && echo 'healthy (:4000)' || echo down)"
  printf '%-10s %s\n' "tunnel:"  "${url:-down}"
  if [ -n "$url" ]; then
    printf '%-10s %s\n' "via-tunnel:" "$(curl -sf -m 10 "$url/api/v1/health/liveness" >/dev/null && echo ok || echo FAIL)"
  fi
}

case "${1:-}" in
  start)  start ;;
  stop)   stop ;;
  status) status ;;
  url)    tunnel_url || { echo "no tunnel"; exit 1; } ;;
  *) echo "usage: $0 {start|stop|status|url}"; exit 1 ;;
esac
