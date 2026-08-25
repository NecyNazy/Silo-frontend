# Silo-frontend

Loans and savings contribution platform. React 19 + TypeScript SPA implementing
the Phase 1 MVP described in
[`docs/frontend-architecture-design.md`](docs/frontend-architecture-design.md):
auth, member profile/KYC, contributions (manual + Paystack), the full loan
lifecycle (request → guarantor → approval → schedule), repayments, a polled
officer dashboard, and notifications. Dark mode shipped early too, ahead of
its original Phase 3 slot.

## Getting started

```bash
npm install
cp .env.example .env   # adjust VITE_BACKEND_ORIGIN if the backend isn't on :8080
npm run dev
```

This normally needs the Silo backend (Spring Boot, see the companion technical
documentation referenced at the top of the architecture doc) running locally
at `http://localhost:8080` (or wherever `VITE_BACKEND_ORIGIN` points). `/api/*`
requests are proxied by Vite's dev server to `VITE_BACKEND_ORIGIN`
(`vite.config.ts`) rather than requiring the backend to send CORS headers,
since it currently doesn't.

A handful of officer list/detail screens also run against endpoints the real
backend doesn't expose yet: no GET for member list, loan-request list/detail,
or loan list. [MSW](https://mswjs.io) fills in just those
(`tests/mocks/handlers/gaps.ts`), seeded with fixture data disconnected from
whatever's actually in the backend's database. Those screens carry a visible
amber banner saying so. See [`docs/deployment.md`](docs/deployment.md) for
exactly what's real vs. mocked today, and for production deployment
(CORS/proxy, build-time env, static hosting).

## Scripts

- `npm run dev`: start the dev server (with the backend proxy)
- `npm run build`: type-check and build for production
- `npm run preview`: preview the production build. Empirically this
  *also* applies `vite.config.ts`'s dev proxy
- `npm run lint`: ESLint
- `npm run format`: Prettier
- `npm test` / `npm run test:watch`: Vitest (unit + component)
- `npm run test:e2e`: Playwright (builds and serves the app first; stubs
  the real endpoints it touches directly, or seeds an authenticated
  session directly for tests that don't need to exercise login, see §15
  of the architecture doc, including the proxy caveat above)

## Project structure

See §5 of the architecture doc. Feature folders under `src/features/*`
mirror the backend's module boundaries, with shared UI/api/lib code under
`src/shared/`. MSW's `tests/mocks/` only fills the backend's genuine gaps
(§14 of the architecture doc has the full list), not a full mock backend;
Playwright specs are in `tests/e2e/`.

## Docs

- [`docs/frontend-architecture-design.md`](docs/frontend-architecture-design.md):
  the full design doc, kept up to date against the real backend's
  behavior (see its status note at the top).
- [`docs/deployment.md`](docs/deployment.md): running against a real
  backend locally and in production.
