# Auth Alignment — Development Plan (Stellar Gate)

> **Completed and archived (2026-06-13).** All phases passed (API curl, browser smoke, forgot-password stub, documentation cleanup). For ongoing auth guidance, see [auth.md](../../../infinity/documentation/auth.md) and [AGENTS.md](../../AGENTS.md).

```yaml
date: 2026-06-13
archived: 2026-06-13
author: Roro LeSage
model: Composer
status: completed
sources:
  - ../infinity/stellar-gate-api.md
  - ../../../documentation/TO-BE-FIXED.md
  - ../../../infinity/documentation/auth.md
  - src/services/authService.ts
  - src/services/api.ts
  - src/stores/authStore.ts
  - src/components/auth/
  - AGENTS.md
  - ../../../infinity/documentation/auth-alignment-development-plan.md
```

## Overview

This plan closed **TO-BE-FIXED §1** on the Stellar Gate client side. The client was built for the **target** cookie contract in [stellar-gate-api.md](../infinity/stellar-gate-api.md). The Infinity server completed its alignment work — see [auth.md](../../../infinity/documentation/auth.md) and the completed [server plan](../../../infinity/documentation/auth-alignment-development-plan.md).

**Goal:** Verify and harden the existing client so register, login, session restore, logout, and forgot-password stub work end-to-end without storing JWT in JavaScript.

**Status:** **Complete** (2026-06-13). Client verified against aligned server; documentation updated.

**Definition of done:** Phase 0 curl check passes, Phase 1 smoke tests 1–7 pass in the browser, Phase 3 forgot-password verified against the server stub, Phase 4 updates `AGENTS.md` and resolves TO-BE-FIXED §1.

---

## Current implementation

| Area | Status | Notes |
|------|--------|-------|
| Axios `baseURL` | **Done** | `/infinity/auth` |
| `withCredentials: true` | **Done** | `api.ts` |
| `authService` shapes | **Done** | Expects `{ user }` on login/register; flat `User` on `/me` |
| `authStore` | **Done** | `restoreSession()` → `GET /me`; no token in state |
| `AuthBootstrap` | **Done** | Calls `restoreSession()` on app load |
| Login redirect | **OK** | Redirects only after `login()` resolves; errors stay on form |
| Register success screen | **OK** | Shown only after successful `register()` |
| Forgot password UI | **Done** | Verified against server stub ([auth.md](../../../infinity/documentation/auth.md)) |
| Automated tests | **None** | No test runner configured ([AGENTS.md](../../AGENTS.md)) |

**Do not** read `access_token` from JSON or use `localStorage`. The server no longer returns tokens in the body.

---

## Dependency

| Prerequisite | Owner | Status |
|--------------|-------|--------|
| Cookie auth, `/me`, response shapes, `409`, forgot-password stub | Infinity server | **Complete** — [auth.md](../../../infinity/documentation/auth.md) |

---

## Migration phases

| Phase | Scope | Deliverable | Result |
|-------|--------|-------------|--------|
| **0 — Preconditions** | Environment | Databases + server + Stellar Gate dev stack running; curl check passes | **Pass** |
| **1 — Smoke test** | Manual QA | Full auth flow against aligned server | **Pass** |
| **2 — Hardening** | Code | Minor UX/error tweaks if gaps found | **Skipped** — no gaps found |
| **3 — Forgot password** | Manual QA | Verify UI against server stub | **Pass** |
| **4 — Docs** | Docs | Update AGENTS.md status; strike TO-BE-FIXED §1 | **Done** |

No new auth architecture was planned — existing layering (`services` → `stores` → `components`) was kept.

---

## Phase 0 — Preconditions

Start from monorepo root ([../../../AGENTS.md](../../../AGENTS.md)):

| Step | Command / check |
|------|-----------------|
| Databases | `deployment/dev/scripts/start-databases.ps1` |
| Server | `cd infinity && npm run start:dev` (port `4000`) |
| Stellar Gate | `cd stellar-gate && npm run dev` (port `3001`, proxies `/infinity/*`) |
| Optional same-origin | Caddy on port `80` — same behavior as Vite proxy for cookies ([auth.md](../../../infinity/documentation/auth.md)) |

**Canonical smoke-test URL:** `http://localhost:3001/stellar-gate/` (Vite proxy). Caddy `http://localhost/` or `http://infinity-dev.home.rh/` is equivalent when running.

Confirm server auth alignment before client work (quick check):

```bash
curl -i -X POST http://localhost:4000/infinity/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"secret12"}' \
  -c cookies.txt
# Must return 201, Set-Cookie: infinity_token=..., body { "user": { ... } }
```

Full API sequence (mirrors smoke tests 1–6 at HTTP level):

```bash
# Register → session restore → logout → session gone
curl -i -X POST http://localhost:4000/infinity/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"smokeuser","password":"secret12"}' \
  -c cookies.txt

curl -i http://localhost:4000/infinity/auth/me -b cookies.txt
# Expect: 200, flat { id, username, email }

curl -i -X POST http://localhost:4000/infinity/auth/logout -b cookies.txt
# Expect: 200, Set-Cookie clears infinity_token

curl -i http://localhost:4000/infinity/auth/me -b cookies.txt
# Expect: 401

# Invalid login
curl -i -X POST http://localhost:4000/infinity/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"smokeuser","password":"wrongpass"}'
# Expect: 401

# Duplicate register
curl -i -X POST http://localhost:4000/infinity/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"smokeuser","password":"secret12"}'
# Expect: 409, message "Username already taken"
```

---

## Phase 1 — Smoke test (manual)

Run through each flow in the browser at `http://localhost:3001/stellar-gate/` (or via Caddy `http://localhost/`).

| # | Flow | Expected |
|---|------|----------|
| 0 | App bootstrap | Full-page spinner while `restoreSession()` runs; no flash of login form before it completes |
| 1 | Fresh register | Success screen; DevTools → Application → Cookies shows `infinity_token` (httpOnly, path `/infinity`) |
| 1b | Reload after register | Session restored; visiting `/login` shows “Welcome back, {username}” |
| 2 | Reload app (logged in) | `restoreSession()` sets `isAuthenticated`; login page shows “Welcome back” |
| 3 | Login | Valid credentials → redirect to `/galaxy` *(404 until Galaxy client exists — expected)* |
| 4 | Invalid login | Error message from server (`401`) |
| 5 | Duplicate register | `409` → readable error (“Username already taken”) via `getErrorMessage` |
| 6 | Logout | From `/login` (authenticated view) → Logout → cookie cleared; reload → not authenticated |
| 7 | Network tab | No `access_token` in response bodies; no token in JS memory beyond `User` profile |

**Session expiry:** JWT lifetime is 1 hour. Treat `401` from `/me` or any protected call as logged out — no special in-app UX required beyond existing behavior.

---

## Phase 2 — Hardening *(only if smoke test finds gaps)*

Not required — phase 1 found no client gaps.

| Candidate | File | Action |
|-----------|------|--------|
| Missing `user` guard | `authService.ts` | Throw if `response.data.user` is absent after login/register (fail fast during dev) |
| Login redirect safety | `LoginForm.tsx` | Redirect only when `useAuthStore.getState().isAuthenticated && user` after `login()` |
| Validation errors | `helpers.ts` | Already maps NestJS `message` array — verify `400` display |
| Session on protected route | `App.tsx` | No change expected — auth routes are public; `/galaxy` is external navigation |

---

## Phase 3 — Forgot password

Server stub verified ([auth.md](../../../infinity/documentation/auth.md)):

| Server state | Client action |
|--------------|---------------|
| Stub `POST /forgot-password` returns `{ success: true }` | `ForgotPasswordForm` shows success — verified |
| Real email flow (future) | Update copy and error handling when contract is defined; do not promise email delivery in UI until then |

---

## Phase 4 — Documentation cleanup

| Task | File | Status |
|------|------|--------|
| Update implementation status table | [AGENTS.md](../../AGENTS.md) | Done |
| Strike or resolve §1 | [TO-BE-FIXED.md](../../../documentation/TO-BE-FIXED.md) | Done |
| Re-audit contract checklist | [stellar-gate-api.md](../infinity/stellar-gate-api.md) | Done |

---

## Out of scope (this plan)

| Item | Tracked in |
|------|------------|
| Galaxy View client / `/galaxy` 404 after redirect | [TO-BE-FIXED.md](../../../documentation/TO-BE-FIXED.md) §3–§4 |
| Cosmos Governance admin auth | [TO-BE-FIXED.md](../../../documentation/TO-BE-FIXED.md) §10 |
| `POST /players/me/enter-game` after login | Future Galaxy / Terra integration — server spawn supports cookie JWT ([auth.md](../../../infinity/documentation/auth.md)) |
| Automated client tests | No runner today; add only if requested |

---

## Verification log

| Date | Phase | Result | Notes |
|------|-------|--------|-------|
| 2026-06-13 | **0 — API (direct `:4000`)** | **Pass** | Register `201` + `Set-Cookie` + `{ user }`; `/me` `200` flat user; logout clears cookie; `/me` → `401`; invalid login `401`; duplicate register `409`; forgot-password stub `200` |
| 2026-06-13 | **0 — API (Vite proxy `:3001`)** | **Pass** | Register + `/me` through proxy — cookie forwarded correctly |
| 2026-06-13 | **1 — Browser smoke** | **Pass** | Manual checklist at `http://localhost:3001/stellar-gate/` |
| 2026-06-13 | **3 — Forgot password** | **Pass** | Included in browser verification |
| 2026-06-13 | **4 — Docs** | **Done** | `AGENTS.md`, TO-BE-FIXED §1, contract checklist updated |

Server quirk noted: `POST /logout` returns `201` instead of contract `200` — harmless for the client (Axios accepts any 2xx).

---

## Related documents

| Document | Relevance |
|----------|-----------|
| [auth.md](../../../infinity/documentation/auth.md) | **Server auth guide** — cookie contract, session lifecycle, client requirements |
| [stellar-gate-api.md](../infinity/stellar-gate-api.md) | Target HTTP contract |
| [auth-alignment-development-plan.md](../../../infinity/documentation/auth-alignment-development-plan.md) | Server implementation plan (completed) |
| [TO-BE-FIXED.md](../../../documentation/TO-BE-FIXED.md) | Monorepo deferred issue §1 (resolved) |
| [AGENTS.md](../../AGENTS.md) | Client commands and auth rules |
| [stellar-gate-setup.md](../stellar-gate-setup.md) | Dev setup and architecture |
