# E2E tests (Cypress)

Run the frontend dev server and ensure the API (Laravel) is available, then:

- **Headless:** `npm run test:e2e`
- **Interactive:** `npm run cypress:open`

Tests expect `baseUrl` http://localhost:3000. The blog tests require the Laravel API to be up (e.g. via docker-compose) so `/api/posts` and `/api/posts/1` respond.

**Running inside the frontend Docker container** (e.g. `dce frontend npx cypress run`): The frontend image includes Xvfb and the Linux dependencies Cypress needs. Rebuild after changing the Dockerfile: `docker compose build frontend`.
