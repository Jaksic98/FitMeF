# PLAN.md — Plan implementacije (Pilates frontend)

Prati izgradnju frontenda komponentu-po-komponentu. Izvor istine za izgled je `DESIGN.md` + `tailwind.config.js`; prototip (`FitMe_Pilates__standalone_.html`) je **samo vizuelna referenca**. Domen i poslovna pravila: backend `SPEC.md`. Ažurirati status kako se stavka završava.

Status legenda: `[ ]` nije početo, `[~]` u toku, `[x]` završeno.

**Redosled je bitan:** Modul 0 (skafold) → Modul 1–2 (UI primitivi iz `DESIGN.md` kataloga) → tek onda feature ekrani (Modul 3+), jer svaki ekran komponuje primitivе. Ne raditi sve odjednom — jedna komponenta, provera prema `DESIGN.md`, pa sledeća.

## Modul 0 — Skafold i temelji

- [x] Vite + React + TypeScript projekat (`npm create vite@latest -- --template react-ts`).
- [x] Tailwind CSS **v3** + ubaciti postojeći `tailwind.config.js` (v3-stil `module.exports`) 1:1. Proveriti da `content` glob pokriva `./index.html` i `./src/**/*.{ts,tsx}`.
- [x] Učitati fontove: **Archivo** (400–900) i **JetBrains Mono** (400/500/700) — npr. `@fontsource`; mapirati na `font-sans`/`font-mono`.
- [x] Globalni CSS: `bg-canvas` na `body`, base `text-ink`/`font-sans`, definisati keyframes za `fade`/`up`/`toast`/`pop` (vrednosti iz `DESIGN.md` → Animacije).
- [x] ESLint + Prettier + `typecheck` skripta; strict mode u `tsconfig`.
- [x] React Router skelet + TanStack Query provider + (kasnije) `AuthContext`.
- [x] `api/` wrapper: `credentials: 'include'`, raspakuje `SuccessResponseDTO<T>` → `data`, baca tipovan error (code+message) iz `ErrorResponseDTO`. Centralno 401→login redirect, 403→friendly poruka.
- [x] `types/` skelet: domen tipovi koji preslikavaju backend DTO-e (User, Pilates, Termin, Appointment, Status, Role).
- [x] `lib/status.ts`: mapiranje `Status`/`Appointment.status` → badge/slot varijante (po `DESIGN.md` → Mapiranje na domen). Jedno mesto, ne razbacano.

## Modul 1 — UI primitivi: forme i akcije

Iz `DESIGN.md` → Komponente. Svaka: varijante + stanja + tokeni tačno kako su katalogizovani.

- [ ] `Button` — varijante `primary`/`accent`/`secondary`/`ghost`/`danger-outline`/`success-outline`/`icon`/`pill`; stanja default/hover/disabled/active; **dodati `loading`** (spinner, dugme disabled — ne postoji u prototipu, predlog iz `DESIGN.md`).
- [ ] `Input` (text/email/password) — **dodati vidljiv focus prsten** `focus:ring-2 focus:ring-primary` (a11y, prototip ga nema); `error` stanje (`border-danger` + helper `text-danger`).
- [ ] `Select` / `Dropdown` — native `<select>`, vizual kao input.
- [ ] `DateInput` — native `<input type="date">` sa `min`/`max`; koristi se u FilterBar (admin Termini).
- [ ] `Toggle` / `Switch` — on (`bg-primary`) / off (`bg-switch-off`), knob transition; keyboard + `aria` (a11y delta).

## Modul 2 — UI primitivi: prikaz i feedback

- [ ] `Card` — varijante `content`/`list`, `stat`/dark, `info`, `empty-state`.
- [ ] `Badge` / `StatusPill` — `success`/`danger`/`neutral`, mono `text-micro`. Vezati za `lib/status.ts`.
- [ ] `Avatar` — krug, inicijali, veličine 34/52px.
- [ ] `Modal` (Success/Confirm) — `animate-pop` ulaz, `scrim` + `backdrop-blur-scrim` backdrop; focus-trap + `Esc` + `aria` (a11y delta).
- [ ] `Toast` — tamni, dole-centar, `animate-toast`, auto-dismiss ~2.6s. Provider za globalno pozivanje.
- [ ] `Alert` / `Banner` — `danger`/`warning`/`error` varijante (koristi se za no-credits, pomeranje termina, validaciju).
- [ ] `SegmentedControl` — role-switch (track `bg-track`, `rounded-pill`) i booking-variation switch.

## Modul 3 — Layout i navigacija (app shell)

- [ ] `Header` / `AppBar` — sticky, `bg-header-bg` + `backdrop-blur-header`, visina 66px, `max-w-content`. Sadrži NavTabs + CreditsPill + Avatar + role-switch.
- [ ] `NavTabs` — admin (Sprave/Termini/Rezervacije/Korisnici) i klijent (Rezervacija/Moji termini/Profil); active/inactive/hover.
- [ ] `CreditsPill` — crvena tačka + mono broj kredita; klik → Profil. Vezati za `User.remainingAppointments`.
- [ ] Route guards: `ADMIN` vs `CLIENT` (UX sloj — backend `@PreAuthorize` je prava brana); 401→login, 403→friendly.
- [ ] App layout: shell + `<Outlet/>`, responsive (`flex-wrap` slaganje panela na mobile, dvopanelno na `lg`).

## Modul 4 — Auth ekrani (feature: auth)

Backend: `SPEC.md` §4.1 (registracija → INACTIVE, aktivacija → ACTIVE).

- [ ] Login ekran — hero (`text-display`), forma (`text-h2`), email+password, error banner iz backend poruke.
- [ ] Register ekran — username/email/password; po uspehu poruka "proveri mejl za aktivaciju".
- [ ] Activate ruta — `GET /api/auth/activate?token=...` flow (link iz mejla); success/expired stanje (idempotentno na backendu).
- [ ] Wire na `authApi` (login/register/activate/me); `AuthContext` drži korisnika+role.

## Modul 5 — Klijent: Rezervacija (feature: appointments — booking)

Backend: `SPEC.md` §4.3 booking, §4.2 pre-generisani slotovi.

- [ ] `DaySelector` (date strip) — horizontalna traka, mono `dnum`, selected/default.
- [ ] `MachineCard` (izbor sprave) — `card`/`chip`, available/selected/disabled.
- [ ] `AppointmentSlot` (TimeSlot) — varijante A (kartica) / B (red rasporeda); stanja available/booked/past/open/selected.
- [ ] Booking tok: izbor dan → sprava → slot → potvrda (Confirm `Modal`). Reflektovati `remainingAppointments > 0` (disable + no-credits `Alert` kad je 0). Surface backend grešku ("nema preostalih termina"/"slot nije dostupan").
- [ ] Booking-variation `SegmentedControl` ako prototip nudi varijacije prikaza.

## Modul 6 — Klijent: Moji termini + Profil (feature: appointments/users)

Backend: `SPEC.md` §4.4 cancel (12h pravilo), §4.5 reschedule, profil = `User`.

- [ ] "Moji termini" lista — `getByUserId`, prikaz preko `AppointmentSlot`/`Card`.
- [ ] Cancel akcija — `update` → AVAILABLE; **reflektovati 12h pravilo** (disable cancel unutar 12h, tooltip/lock-label), surface backend rejekciju ako se ipak pošalje.
- [ ] Reschedule tok — atomska zamena slota (stari→AVAILABLE, novi→BOOKED), bez novog kredita; `danger` banner "pomeranje termina" iz `DESIGN.md` → Alert.
- [ ] Profil ekran — Avatar 52px, `stat` kartica kredita (`text-stat` mono broj), telefon, toggle-i `emailNotifications`/`calendarNotifications` (flag-only u MVP-u, ali UI postoji).

## Modul 7 — Admin: liste i CRUD (feature: pilates/termini/appointments/users)

Backend: `SPEC.md` §3, §5; admin-only `@PreAuthorize`. Sve liste dele `DataTable` + `Pagination` + (gde treba) `FilterBar`.

- [ ] `DataTable` / `ListRow` — header-traka (`bg-surface-subtle`, UPPERCASE `text-label`) + redovi (`border-t border-line`); `editing` inline varijanta (admin Rezervacije).
- [ ] `Pagination` — info + prev/next + numerisane strane (34px), **1-indexed** prema backendu, page-size 5.
- [ ] `FilterBar` — labela + `DateInput` + "Poništi filter" + mono brojač; active/inactive/prazan-rezultat.
- [ ] Admin **Sprave** (Pilates) CRUD — lista + create/edit forma (`position`, `name`, `status`), `StatusPill`, soft-delete.
- [ ] Admin **Termini** CRUD — lista + `FilterBar` po datumu + create/edit (`date`/`startTime`/`endTime`), surface overlap/time-range backend grešku u `Alert`/error.
- [ ] Admin **Rezervacije** (Appointment) — lista + inline `editing` red; admin full CRUD (bez 12h/credit pravila).
- [ ] Admin **Korisnici** CRUD — lista + edit (uklj. `remainingAppointments` top-up preko `PUT`, vidi `SPEC.md` §3), `StatusPill` za status/lockout.

## Modul 8 — Polish i build

- [ ] Responsive prolaz: mobile (`flex-wrap`, jedna kolona) ↔ desktop (`lg` dvopanelno, sticky desni panel) prema `DESIGN.md` → Breakpoints.
- [ ] A11y prolaz: focus prstenovi, `aria-*`, keyboard za modale/toggle/tabove.
- [ ] Empty / loading / error stanja za svaku listu i tok (TanStack Query `isLoading`/`isError`).
- [ ] Vizuelna provera prema prototipu (proporcije/spacing), token-audit (nigde arbitrarne `-[#hex]`/`-[px]` vrednosti).
- [ ] `npm run build` → kopirati `dist/` u backend static-resources putanju (servira `FrontendConfig`); dokumentovati korak.

## Van scope-a za sada (buduće)

- [ ] Email/kalendar notifikacije UI (flagovi postoje na profilu, servis je backend Modul 7 — `SPEC.md` §6).
- [ ] React Native / Expo (NativeWind) mobilni klijent — tokeni su već platformski-neutralni; deljena logika kroz monorepo kad za to dođe vreme.

## Dokumentacija

- [ ] Referencirati `DESIGN.md` iz frontend `CLAUDE.md` (urađeno) i osigurati da skafold ne pregazi `tailwind.config.js`.
- [ ] Dodati u backend `CLAUDE.md` referencu na frontend (`DESIGN.md` kao izvor istine za UI), uz postojeći TODO iz backend `PLAN.md` → Dokumentacija.
