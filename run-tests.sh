#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo "=== Laravel (laravel_monolith) ==="
docker compose exec laravel_monolith php artisan test

echo ""
echo "=== Nest (nest_app) ==="
docker compose exec nest_app npm test

echo ""
echo "=== Frontend E2E (frontend) ==="
docker compose exec frontend npm run test:e2e

echo ""
echo "All tests passed."
