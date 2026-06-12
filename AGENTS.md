# AGENTS.md — Stellar Gate

Authentication web client for **Infinity** (login, registration, forgot-password UI). React 18 + TypeScript + Vite SPA targeting **httpOnly cookie** sessions against the NestJS backend.

**Monorepo context:** [../AGENTS.md](../AGENTS.md) · **Known gaps:** [../documentation/TO-BE-FIXED.md](../documentation/TO-BE-FIXED.md)

---

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server → http://localhost:3001/stellar-gate/
npm run build        # Type-check (tsc) + production build → dist/
npm run preview      # Preview production build
npm run lint         # ESLint on .ts / .tsx
```

No test runner is configured yet. After changes, run `npm run build` and `npm run lint`.

**Local dev:** Start databases and the Infinity server first (see root [AGENTS.md](../AGENTS.md)). Vite proxies `/infinity/*` to `http://localhost:4000`. Optional: Caddy on port 80 for same-origin routing with Stellar Gate.

---

## Project structure

```
src/
├── components/auth/     # Forms and AuthLayout
├── pages/               # Route-level wrappers (thin — delegate to components)
├── stores/              # Zustand (authStore, uiStore)
├── services/            # api.ts (Axios) + authService.ts
├── types/               # auth.ts, api.ts
├── assets/
│   ├── theme.ts
│   └── styles/global.css
└── utils/               # helpers.ts
documentation/           # Architecture and API contract (French)
```

Path aliases: `@/`, `@components/`, `@pages/`, `@stores/`, `@services/`, `@types/`, `@utils/`.

---

## Implementation status (auth)

The client follows the **target** contract in `documentation/infinity/stellar-gate-api.md`. The server is **not fully aligned** yet — see [../documentation/TO-BE-FIXED.md §1](../documentation/TO-BE-FIXED.md).

| Area | Client | Server today |
|------|--------|--------------|
| Login / register | Expects `{ user }` + cookie | Returns `{ access_token }` only; no cookie |
| Session restore | `GET /infinity/auth/me` | Not implemented |
| Logout | `POST /infinity/auth/logout` | Not implemented |
| Forgot password | UI + `POST /infinity/auth/forgot-password` | Not implemented |

Do not “fix” this by storing JWT in JS or `localStorage`. Backend auth work belongs in `infinity/` per the contract doc.

---

## Architecture rules

### Authentication (target behavior)

- Sessions use **httpOnly cookies** set by the server. Never store tokens in `localStorage`, `sessionStorage`, or JS state beyond the user profile.
- All API calls go through `src/services/api.ts` with `withCredentials: true`.
- API base path: `/infinity/auth` (Vite dev proxy forwards `/infinity/*` to `:4000`).
- On app load, call `restoreSession()` → `GET /infinity/auth/me`.
- After successful login, redirect with `window.location.assign('/galaxy')` (separate SPA, not React Router).
- Internal auth routes use React Router with `basename="/stellar-gate"`.

### Layering

| Layer | Responsibility |
| ----- | -------------- |
| `pages/` | Route entry points only |
| `components/auth/` | UI + form logic |
| `stores/` | Auth state, loading, errors |
| `services/` | HTTP calls only — no UI logic |

### Forms

- **React Hook Form** + **Zod** schemas via `@hookform/resolvers/zod`.
- Define schemas colocated with the form component; infer types with `z.infer<typeof schema>`.
- Surface API errors through `useAuthStore` (`error`, `clearError`) and `getErrorMessage()` from `@utils/helpers`.

### UI

- **MUI v5** components and `sx` prop for styling.
- Dark theme defined in `src/assets/theme.ts` — extend there, don't hardcode one-off palette values.
- **Framer Motion** for layout transitions in `AuthLayout`.

---

## Document conventions

Shared monorepo standards: [../rules/documents.md](../rules/documents.md).

Project docs live in `documentation/` as Markdown (`.md`). Prose is in **French**; code, paths, and API identifiers stay in **English**. Do not create docs unless explicitly requested.

---

## Code style

- TypeScript strict mode — no `any` unless unavoidable; prefer explicit interfaces in `src/types/`.
- Named exports for components (`export const LoginForm`).
- Functional components and hooks only.
- Keep diffs minimal; match existing patterns before introducing new abstractions.
- UI copy and code identifiers are in **English**.

---

## API contract

Backend endpoints are documented in `documentation/infinity/stellar-gate-api.md` (summary in `documentation/needed-enpoint.md`):

| Method | Route | Auth | Server status |
| ------ | ----- | ---- | ------------- |
| POST | `/infinity/auth/register` | No | Partial — wrong response shape |
| POST | `/infinity/auth/login` | No | Partial — wrong response shape |
| POST | `/infinity/auth/logout` | Yes | Not implemented |
| GET | `/infinity/auth/me` | Yes | Not implemented |
| POST | `/infinity/auth/forgot-password` | No | Not implemented |

When adding or changing API calls, update `authService.ts` and keep types in `src/types/auth.ts` aligned with the contract.

---

## Do not touch

| Path | Reason |
| ---- | ------ |
| `dist/` | Generated build output |
| `node_modules/` | Dependencies |
| `package-lock.json` | Only change when adding/removing dependencies |

Do not commit secrets (`.env`, credentials). Do not create git commits unless explicitly asked.

---

## Open questions

Unresolved design decisions live in `documentation/to-be-defined.md` (cookie options, local dev proxy setup, Galaxy session handoff). Do not invent answers — flag gaps or follow existing patterns until documented.

---

## Reference docs

- `documentation/stellar-gate-setup.md` — Full setup, stack, and component examples
- `documentation/infinity/stellar-gate-api.md` — HTTP API contract (Infinity NestJS backend)
- `documentation/needed-enpoint.md` — Endpoint summary for the Stellar Gate client
- `documentation/to-be-defined.md` — Pending decisions
- `../documentation/TO-BE-FIXED.md` — Cross-project deferred fixes
- `README.md` — Quick start (French)

---

## Definition of done

1. `npm run build` passes with no TypeScript errors.
2. `npm run lint` passes (or no new lint issues in touched files).
3. Auth flows remain cookie-based in design — no token-in-JS workarounds.
4. New API usage matches `documentation/infinity/stellar-gate-api.md`.
5. Redirect to `/galaxy` remains a full page navigation, not a React Router link.
