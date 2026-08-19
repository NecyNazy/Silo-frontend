# Running against a real backend

## Local development

1. Copy `.env.example` to `.env` and adjust if the backend isn't on the
   default `http://localhost:8080`:

   ```
   VITE_API_BASE_URL=/api
   VITE_BACKEND_ORIGIN=http://localhost:8080
   VITE_PAYSTACK_PUBLIC_KEY=
   VITE_ENABLE_MOCKS=true
   ```

2. `npm run dev`. Requests to `/api/*` are same-origin from the browser's
   point of view, Vite's dev server proxies them server-side to
   `VITE_BACKEND_ORIGIN` (see `vite.config.ts`). This is deliberate: the
   backend doesn't currently send CORS headers, so a proxy sidesteps that
   entirely instead of requiring a backend change.

3. Leave `VITE_ENABLE_MOCKS=true`. MSW still runs, but only intercepts the
   handful of endpoints the real backend doesn't expose yet (see
   `tests/mocks/handlers/gaps.ts` and the amber banners in the UI on the
   affected screens). Every other request passes through to the real API.
   Set it to `false` only if you want those screens to fail honestly
   instead of showing seed data.

## What's real vs. mocked right now

Confirmed against the backend's own `/v3/api-docs` (2026-08-16):

| Works against the real backend | Still gap-filled by MSW |
|---|---|
| Auth (login, register, refresh), member profile/status/KYC, loan request submit/approve/reject/guarantors, guarantor accept/decline, contributions (record + per-member history/summary), repayments, single loan/member lookup, reports dashboard/summary | `GET /members` (list), `GET /loan-requests` (list + single), `GET /loans` (list), and reading a loan request's guarantors (no real endpoint returns them) |

The gap-fill data lives in `tests/mocks/db.ts` and is **not connected to the
real database**, a loan request submitted for real won't appear in the
mocked officer queue, and vice versa. That's a backend gap, not a frontend
bug; once the backend adds those list/detail endpoints, delete
`tests/mocks/handlers/gaps.ts` and drop `VITE_ENABLE_MOCKS` (or set it
`false`) and everything routes to the real API unchanged, since the mocked
shapes already match the real response envelope.

## Production

**1. CORS or same-origin, pick one, don't half-do both.**
The dev proxy only exists in `vite.config.ts`'s dev server; it doesn't
run in a production static build. You need one of:

- **Same-origin (recommended):** serve the built frontend and the API
  behind one reverse proxy/domain, e.g. Nginx/Caddy routing `/api/*` to
  the Spring Boot app and everything else to the static `dist/` build
  (with SPA fallback, see below). No CORS configuration needed at all,
  same mechanism as the dev proxy.
- **Cross-origin:** if the frontend and backend are on different domains,
  the backend must send `Access-Control-Allow-Origin` for the frontend's
  production origin (and handle preflight `OPTIONS`). This is a backend
  change, not a frontend one.

**2. Build-time environment.** Vite bakes `VITE_*` variables into the
bundle at build time, they are not runtime-configurable. Set these before
`npm run build`, typically via `.env.production` or CI-injected env vars:

```
VITE_API_BASE_URL=/api          # same-origin reverse proxy
VITE_BACKEND_ORIGIN=            # unused in prod (dev-proxy only)
VITE_PAYSTACK_PUBLIC_KEY=pk_live_...
VITE_ENABLE_MOCKS=false
```

`VITE_ENABLE_MOCKS=false` at build time lets Vite dead-code-eliminate the
MSW import entirely (confirmed: it's a dynamic `import()` gated on that
exact env check in `src/main.tsx`), so the ~150KB MSW bundle never ships
to production. Decide first whether the gap-filled screens should go live
showing "backed by seed data" banners, or whether to hide/disable those
specific screens for a production release until the backend catches up,
right now they'd render mock data in prod if mocks stay enabled.

**3. Static hosting + SPA fallback.** `npm run build` produces static files
in `dist/`. Any static host works (Nginx, Caddy, S3+CloudFront, Netlify,
Vercel), but since routing is client-side (React Router), the host must
serve `index.html` for any path that isn't a real file, otherwise a
hard refresh on `/loans/123` 404s. Nginx example:

```nginx
location / {
  try_files $uri /index.html;
}
location /api/ {
  proxy_pass http://backend-service:8080;
}
```

**4. HTTPS everywhere.** Tokens live in `sessionStorage`, not cookies, so
there's no cookie-security flag to set, but the access/refresh tokens
still travel over the wire on every request, terminate TLS in front of
both the frontend and the API.

**5. Paystack.** Swap `VITE_PAYSTACK_PUBLIC_KEY` for the live publishable
key, and coordinate with whoever owns the Paystack dashboard to point the
webhook URL at the production backend's `/api/webhooks/paystack`. That
side is entirely backend-owned; the frontend only ever uses the public key
client-side.
