# Silo-frontend

Loans and savings contribution platform. React 19 + TypeScript SPA implementing
the Phase 1 MVP described in
[`docs/frontend-architecture-design.md`](docs/frontend-architecture-design.md):
auth, member profile/KYC, contributions (manual + Paystack), the full loan
lifecycle (request → guarantor → approval → schedule), repayments, a polled
officer dashboard, and notifications.

## Getting started

```bash
npm install
npm run dev
```

No backend is required to explore the app — [MSW](https://mswjs.io) mocks every
endpoint in-browser by default (`VITE_ENABLE_MOCKS=true`). Sign in with any of
the seeded demo accounts (any non-empty password):

| Email | Role | Notes |
|---|---|---|
| `member@silo.dev` | Member | Active, KYC verified, has an active loan and contribution history |
| `officer@silo.dev` | Officer | Full admin console access |
| `guarantor@silo.dev` | Member | Already an accepted guarantor on `member@silo.dev`'s loan request |
| `femi@silo.dev` | Member | Has a pending guarantor invite to accept/decline |
| `pending@silo.dev` | Member | KYC still pending — demonstrates the gated-contribution state |

To point the app at a real backend instead, copy `.env.example` to `.env`, set
`VITE_API_BASE_URL` to the API origin, and set `VITE_ENABLE_MOCKS=false`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm test` / `npm run test:watch` — Vitest (unit + component)
- `npm run test:e2e` — Playwright (builds and serves the app first)

## Project structure

See §5 of the architecture doc — feature folders under `src/features/*`
mirror the backend's module boundaries, with shared UI/api/lib code under
`src/shared/`. MSW handlers and fixtures live in `tests/mocks/`, Playwright
specs in `tests/e2e/`.
