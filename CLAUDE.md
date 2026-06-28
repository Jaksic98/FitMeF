# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

FitMe frontend: a Vite + React 18 + TypeScript + Tailwind CSS single-page app for the pilates-class booking domain. Built output is served as a static SPA from the backend Spring Boot jar (`FrontendConfig` forwards any path without a `.` to `/index.html`), so the production app and the API share one origin. In dev, Vite runs on `http://localhost:5173` — the backend's CORS is locked to exactly that origin (`SecurityConfig.corsConfigurationSource`), so don't change the dev port without updating the backend too.

This is the client for the backend specified in the sibling repo's `SPEC.md` (domain: User/Auth + Pilates sprave, Termini, Appointments). Two roles: `ADMIN` (full CRUD over sprave/termini/rezervacije/korisnici) and `CLIENT` (registracija/aktivacija, booking, moji termini, profil).

## Source of truth — read before building any UI

There is a strict hierarchy. Higher wins on conflict:

1. **`DESIGN.md`** — the design system: tokens (colors, type scale, spacing, radius, shadows, breakpoints, animations) and the component catalog (variants, states, tokens per component). **This is the single source of truth for how things look.** Build components from the token names here, never from raw hex/px values typed inline.
2. **`tailwind.config.js`** — the same tokens as `DESIGN.md`, encoded in `theme.extend`. This is the *mechanical* source of truth: every color/size/radius in `DESIGN.md` exists here as a named class (`bg-surface`, `text-muted`, `rounded-card`, `font-mono`…). **Always style with these semantic classes, never arbitrary values** (`bg-[#FFFFFF]` is a bug — use `bg-surface`).
3. **`FitMe Pilates (standalone).html`** (the prototype) — **visual reference only.** Use it to check layout, proportions, and spacing that prose can't fully capture. **Do not copy its inline styles or hardcoded values into React** — those values already live as tokens in (1) and (2). The prototype is a picture to match, not code to port.
4. **`PLAN.md`** — the component-by-component build checklist. Work through it in module order; update status as you go.

If `DESIGN.md` and the prototype disagree, `DESIGN.md` wins (it's the deliberate distillation). If you need a value that isn't in `tailwind.config.js`, add it there as a named token first (and note it in `DESIGN.md`), rather than inlining an arbitrary value.

## Commands

```bash
# First-time setup (Modul 0 — no package.json exists yet, project not scaffolded):
npm create vite@latest . -- --template react-ts
npm install tailwindcss@3 postcss autoprefixer
# tailwind.config.js is already committed — restore it if the scaffold overwrites it

npm install
npm run dev          # Vite dev server on http://localhost:5173 (must match backend CORS)
npm run build        # type-check + production build into dist/
npm run preview      # serve the production build locally
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

To ship into the backend jar: `npm run build`, then copy `dist/` into the backend's static-resources path (the backend serves it via `FrontendConfig`). Keep that copy step documented wherever the backend build expects the assets.

## Architecture

**Tech stack**: Vite (build/dev), React 18 + TypeScript (strict), Tailwind CSS v3 (the committed `tailwind.config.js` is v3-style `module.exports` — stay on v3 unless deliberately migrating the config to v4 syntax), React Router for routing, TanStack Query for server state, React Hook Form for forms. Pick a single approach for each concern and keep it consistent.

**Folder structure** (target — create as you build):
```
src/
  components/        # reusable, domain-agnostic UI from DESIGN.md catalog
    ui/              # Button, Input, Select, Card, Badge, Modal, Toast, Toggle, ...
  features/          # domain features, one folder per area
    auth/            # login, register, activate
    pilates/         # admin sprave CRUD
    termini/         # admin termini CRUD
    appointments/    # booking, moji termini, admin rezervacije
    users/           # admin korisnici CRUD, profil
  api/               # typed API client (one module per backend controller)
  hooks/             # shared hooks
  lib/               # utils (date/time, formatting, status mapping)
  types/             # domain types mirroring backend DTOs
  routes/            # route definitions, guards
  App.tsx
  main.tsx
```

**Component layer (`components/ui`)** maps 1:1 to the component catalog in `DESIGN.md`. Each component takes a `variant` and `state`-driving props exactly as catalogued there (e.g. `Button` variants `primary`/`accent`/`secondary`/`ghost`/`danger-outline`/`success-outline`/`icon`/`pill`). These are presentational and domain-agnostic — no API calls, no business rules. Build these first (PLAN.md Modul 1–2) before any feature screen, because every feature composes them.

**Feature layer (`features/*`)** composes UI components into screens, wires them to the API client, and holds domain logic. A feature folder owns its screens, its feature-local hooks, and its slice of the API surface.

**API client (`api/*`)**: one typed module per backend controller (`authApi`, `usersApi`, `pilatesApi`, `terminiApi`, `appointmentsApi`), each returning typed responses that mirror the backend DTOs. The backend wraps every success in `SuccessResponseDTO<T>` (`{ data, message, path, ... }`) and every failure in `ErrorResponseDTO` (carries an error code + message). Centralize unwrapping in one place: a fetch/axios wrapper that returns `data` on success and throws a typed error (code + message) on failure, so screens never hand-parse the envelope. Surface the backend's `message` in toasts/banners.

**Auth model — mirror the backend exactly**: the backend issues a JWT in an **httpOnly cookie** (`fitme_cookie`), **not** an `Authorization` header. That means:
- The client cannot read the token from JS (by design). Send credentials with every request (`fetch` `credentials: 'include'` / axios `withCredentials: true`), and don't try to store or attach a bearer token.
- "Am I logged in / what's my role" comes from a `/me`-style call or the login response, held in app state (e.g. an `AuthContext` + TanStack Query) — not from decoding a token.
- Route guards (`ADMIN` vs `CLIENT`) are a UX convenience only; the backend enforces authorization via method-level `@PreAuthorize`. Expect and handle `401` (not authenticated → redirect to login) and `403` (authenticated but forbidden → friendly message), since the server is the real gate.

**Status & domain mapping**: the backend's `Status` enum (`ACTIVE`/`INACTIVE`/`LOCKED`/`DELETED`) and `Appointment.status` (`AVAILABLE`/`BOOKED`/`CANCELED`) drive UI state. Map them through the catalog in `DESIGN.md` → "Mapiranje na domen": `StatusPill` (ACTIVE→success, INACTIVE/DELETED→neutral, LOCKED→danger), `AppointmentSlot` (AVAILABLE→available/success, BOOKED→booked, CANCELED→danger). Keep this mapping in one helper (`lib/status.ts`), not scattered across components.

**Business rules live on the backend — reflect them, don't reimplement them**: rules like "12h-pre-termina cancel window", "remainingAppointments > 0 to book", "reschedule doesn't spend a credit" are enforced server-side (see backend `SPEC.md` §4). The frontend's job is to (a) reflect state (disable a cancel button when it's within 12h, show a no-credits banner when `remainingAppointments === 0`) for good UX, and (b) cleanly surface the backend's error when a rule is violated anyway. Never treat a client-side check as authoritative — always handle the server's rejection.

**Forms & validation**: use React Hook Form. Client-side validation is for fast feedback only; the backend re-validates and returns field/business errors via `ErrorResponseDTO` — display those (map to the offending field where possible). The prototype has **no visible focus ring** on inputs — for the React build, add `focus:ring-2 focus:ring-primary` for accessibility (noted in `DESIGN.md` → Input).

**Pagination**: backend paging is **1-indexed** (`page=1` is the first page), page-size 5 in the prototype lists. The `Pagination` component and any list query must send 1-indexed pages — don't 0-index.

## Conventions

- **Tokens only.** Style exclusively through the semantic Tailwind classes from `tailwind.config.js`. No arbitrary values (`-[#hex]`, `-[14px]`), no inline hex/px. If a value is missing, add a named token to the config + `DESIGN.md` first.
- **Component-by-component.** Follow `PLAN.md` in order. Build the `ui/` primitives before the feature screens that consume them. Update PLAN.md status (`[ ]`/`[~]`/`[x]`) as you complete each.
- **Match the prototype's look, not its code.** Reproduce layout/proportions visually; never paste its inline styles.
- **TypeScript strict.** Domain types in `types/` mirror backend DTOs; no `any` on API boundaries.
- **Serbian UI copy.** All user-facing text is in Serbian, matching the prototype and backend messages (e.g. "Sačuvaj", "Otkaži", "Zauzeto", "Slobodno", "Poništi filter"). Keep code identifiers in English.
- **Accessibility deltas from prototype.** The prototype optimizes for visual fidelity, not a11y — add focus rings, `aria-*` on interactive controls, and keyboard handling for modals/toggles even though the prototype omits them.

## Notes

- The committed `tailwind.config.js` is **v3 syntax**. If the scaffold pulls Tailwind v4, either pin v3 or migrate the config consciously — don't leave a v4 runtime reading a v3 config.
- Typography uses two families: **Archivo** (`font-sans`, weights 400–900) and **JetBrains Mono** (`font-mono`, 400/500/700, for times/numbers/labels). Load both (e.g. via `@fontsource` or a `<link>`), matching the weights `DESIGN.md` lists.
- Fluid type: `display`/`h1` are `clamp()` in the prototype; `tailwind.config.js` records the max. Reintroduce `clamp()` only if you want the fluid behavior back (noted in `DESIGN.md`).
- The prototype file on disk is `FitMe Pilates (standalone).html` (spaces, parentheses) — open it in a browser to check visual fidelity.
