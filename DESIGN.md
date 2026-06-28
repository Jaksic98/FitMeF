# DESIGN.md — Dizajn sistem (Pilates rezervacije, frontend)

Izvučeno 1:1 iz prototipa `FitMe Pilates.dc.html`. Ovo je destilacija postojećeg izgleda u tokene i komponente — **bez izmena vizuala**; sve vrednosti (hex / px) su tačne onako kako stoje u kodu. Prati ga `tailwind.config.js` (isti tokeni u `theme.extend`).

Namenjeno handoff-u u zaseban Vite + React + TypeScript + Tailwind projekat. Imena tokena su **semantička i platformski-neutralna** (`surface`, `ink`, `primary`, `muted`…), tako da isti tokeni mogu da rade i u **NativeWind / React Native** kasnije.

Konvencija imena: `surface*` = pozadine, `ink`/`primary` = naglašene površine i tekst, `text` skala = `secondary`/`muted`/`disabled`/`on-dark`, `border`/`line` = ivice, feedback = `success`/`danger`/`warning`/`neutral` (svaki sa `-subtle` fill varijantom).

---

## Tokeni — Boje

Primarni tekst koristi `ink` (`text-ink`, isti hex kao `text`). Sve klase pretpostavljaju mapiranje iz `tailwind.config.js`.

### Canvas & površine

| Token | Hex | Klasa | Upotreba |
|---|---|---|---|
| `canvas` | `#F4F2EF` | `bg-canvas` | Pozadina cele aplikacije (`body`) |
| `surface` | `#FFFFFF` | `bg-surface` | Kartice, inputi, header, modal |
| `surface-subtle` | `#FAF8F5` | `bg-surface-subtle` | Table-header trake, otvoreni red slota, info-box |
| `surface-muted` | `#F3F0EA` | `bg-surface-muted` | Pozicija-čip, neutralni badge fill |
| `surface-sunken` | `#F6F4F1` | `bg-surface-sunken` | Disabled/prošli slot, neaktivna kartica |
| `surface-disabled` | `#EBE7E1` | `bg-surface-disabled` | Pozadina disabled dugmeta |

### Brand & ink

| Token | Hex | Klasa | Upotreba |
|---|---|---|---|
| `primary` | `#E11414` | `bg-primary` / `text-primary` | Brand crvena, primarni CTA, akcenti, status-tačka |
| `primary-hover` | `#B50F0F` | `hover:bg-primary-hover` | Hover za crvene akcije (Sačuvaj, Aktiviraj) |
| `primary-emphasis` | `#F01616` | `hover:bg-primary-emphasis` | Svetliji crveni hover (CTA na tamnom panelu) |
| `ink` | `#121110` | `bg-ink` / `text-ink` | Primarni tekst, tamna dugmad, tamni paneli, avatar |
| `ink-hover` | `#000000` | `hover:bg-ink-hover` | Hover za tamna dugmad |
| `ink-line` | `#2A2724` | `border-ink-line` | Dekorativni krugovi na tamnom panelu |

### Tekst

| Token | Hex | Klasa | Upotreba |
|---|---|---|---|
| `ink` | `#121110` | `text-ink` | Primarni tekst, naslovi |
| `secondary` | `#6F6B66` | `text-secondary` | Sekundarni tekst, opisi |
| `muted` | `#9C968F` | `text-muted` | Prigušeni tekst, labele, meta |
| `disabled` | `#BBB4AB` | `text-disabled` | Disabled tekst, placeholder |
| `on-dark` | `#A8A39D` | `text-on-dark` | Prigušeni tekst na tamnoj površini |

### Ivice

| Token | Hex | Klasa | Upotreba |
|---|---|---|---|
| `border` | `#E2DED8` | `border-border` | Inputi, selecti, kontrole |
| `border-card` | `#E7E3DD` | `border-border-card` | Kartice, paneli, liste |
| `line` | `#F0ECE5` | `border-line` | Divider između redova u listi |
| `border-dashed` | `#DDD8D1` | `border-border-dashed` | Empty-state isprekidana ivica |
| `border-header` | `#E8E4DE` | `border-border-header` | Donja ivica sticky headera |
| *(hover)* | `#121110` | `hover:border-ink` | Naglašena ivica na hover (secondary dugme, input) |

### Feedback

| Token | Hex | Klasa | Upotreba |
|---|---|---|---|
| `success` | `#178A4E` | `text-success` | ACTIVE status, "Slobodno", potvrde |
| `success-subtle` | `#E7F5EC` | `bg-success-subtle` | Fill success badge-a |
| `danger` | `#C23232` | `text-danger` | LOCKED/CANCELLED, "Otkaži", "Zauzeto" |
| `danger-subtle` | `#FBEAEA` | `bg-danger-subtle` | Fill danger badge-a, alert pozadina |
| `danger-border` | `#ECD0D0` | `border-danger-border` | Ivica danger-outline dugmeta |
| `danger-emphasis` | `#9A1414` | `text-danger-emphasis` | Jak tekst u error/alert banneru |
| `warning` | `#B08A1E` | `text-warning` | Lock-label (zaključan termin) |
| `warning-text` | `#6F5A1E` | `text-warning-text` | Tekst no-credits bannera |
| `warning-border` | `#F0D28A` | `border-warning-border` | Ivica no-credits bannera |
| `neutral` | `#8A8378` | `text-neutral` | INACTIVE/DELETED status |
| `neutral-subtle` | `#F3F0EA` | `bg-neutral-subtle` | Fill neutral badge-a |

### Utility

| Token | Vrednost | Klasa | Upotreba |
|---|---|---|---|
| `track` | `#F1EDE7` | `bg-track` | Track segmented-kontrole (Klijent/Admin) |
| `switch-off` | `#D8D3CC` | `bg-switch-off` | OFF stanje toggle prekidača |
| `scrim` | `rgba(18,17,16,0.5)` | `bg-scrim` | Backdrop modala (uz `backdrop-blur-scrim`) |
| `header-bg` | `rgba(255,255,255,0.88)` | `bg-header-bg` | Sticky header (uz `backdrop-blur-header`) |

---

## Tokeni — Tipografija

Dve familije: **Archivo** (`font-sans`) za UI/tekst, **JetBrains Mono** (`font-mono`) za brojeve, vremena, labele i kodove. Archivo se učitava sa težinama 400/500/600/700/800/900; JetBrains Mono 400/500/700.

| Token | Klasa | Veličina | Line-height | Weight | Letter-spacing | Upotreba |
|---|---|---|---|---|---|---|
| `display` | `text-display` | 52px¹ | 1.04 | 800 | -0.025em | Login hero naslov |
| `h1` | `text-h1` | 34px¹ | 1.1 | 800 | -0.025em | Naslov stranice |
| `h2` | `text-h2` | 30px | 1.15 | 800 | -0.02em | Naslov forme (login/register) |
| `h3` | `text-h3` | 23px | 1.2 | 800 | -0.02em | Naslov modala |
| `h4` | `text-h4` | 18px | 1.3 | 800 | -0.01em | Ime na profilu, podnaslov |
| `lg` | `text-lg` | 16px | 1.6 | 400 | — | Lead paragraf |
| `md` | `text-md` | 15px | 1.6 | 400 | — | Body, vrednost inputa |
| `base` | `text-base` | 14px | 1.6 | 400/700² | — | Body default, naslov reda |
| `sm` | `text-sm` | 13px | 1.5 | 500 | — | Sekundarni tekst |
| `caption` | `text-caption` | 12px | 1.4 | 500 | — | Caption, meta, paginacija-info |
| `label` | `text-label` | 11px | 1.3 | 700 | 0.05em | UPPERCASE labela polja |
| `micro` | `text-micro` | 10px | 1 | 700 | 0.06em | Mono status badge |
| `mono-lg` | `text-mono-lg font-mono` | 22px | 1 | 700 | — | Vreme/broj (mono) |
| `stat` | `text-stat font-mono` | 64px | 1 | 700 | -0.03em | Veliki kredit-broj |

¹ U prototipu fluidno: `display` = `clamp(32px,4.4vw,52px)`, `h1` = `clamp(26px,3.4vw,34px)`. Config beleži maksimum; po želji vratiti clamp preko `clamp()` util-a.
² Naslovi redova/ćelija su 14px ali `font-bold` (700).

---

## Tokeni — Spacing

Sistem je pretežno 2px-stepenovan; većina vrednosti se poklapa sa Tailwind default 4px skalom. Ispod su semantičke uloge; ne-default vrednosti (`4.5`/`5.5`/`13`) dodate su u `theme.extend.spacing`.

| px | Tailwind | Upotreba |
|---|---|---|
| 4 | `1` | Mikro razmaci |
| 6 | `1.5` | Gap ikona/teksta, tesni čipovi |
| 8 | `2` | Razmak između malih kontrola |
| 9 | `2.5`* | Gap day-stripa i liste slotova (*≈10px token) |
| 10 | `2.5` | Gap grupe dugmadi, grid gap |
| 12 | `3` | Standardni gap, mali padding |
| 14 | `3.5` | Vertikalni ritam reda, unutar kartice |
| 16 | `4` | Bazni padding |
| 18 | `4.5` | Kompaktni padding kartice |
| 20 | `5` | Horizontalni padding reda (15/20), padding kartice |
| 22 | `5.5` | Razmak između sekcija |
| 24 | `6` | Komforni padding kartice, gap sekcija |
| 28 | `7` | Veći padding panela |
| 32 | `8` | Gap sekcija |
| 36 | `9` | Padding stranice (maks. `clamp(20px,3vw,36px)`) |
| 48 | `12` | Empty-state padding |
| 80 | `20` | Donji padding `main`-a |

Kontejner: `max-w-content` (1180px), horizontalni padding `clamp(16px,3vw,28px)`. Header visina 66px.

---

## Tokeni — Border radius

| Token | px | Klasa | Upotreba |
|---|---|---|---|
| `badge` | 6 | `rounded-badge` | Status badge, pozicija-čip |
| *(default)* | 8 | `rounded` | Malo dugme, paginacija |
| `btn` | 9 | `rounded-btn` | Input/select, admin dugme |
| `lg` | 11 | `rounded-lg` | Primarno dugme, veliki input |
| `xl` | 13 | `rounded-xl` | Čip, alert, slot kartica, day-button |
| `card` | 16 | `rounded-card` | Kartice / liste |
| `panel` | 18 | `rounded-panel` | Veliki panel, stat kartica, empty-state |
| `modal` | 22 | `rounded-modal` | Modal |
| `pill` | 9999px | `rounded-pill` | Pill, toggle, credits-pill |
| *(krug)* | 50% | `rounded-full` | Avatar, status-tačka |

---

## Tokeni — Senke

| Token | Vrednost | Klasa | Upotreba |
|---|---|---|---|
| `sm` | `0 1px 3px rgba(0,0,0,0.10)` | `shadow-sm` | Aktivni segment u segmented-kontroli, blagi lift |
| `overlay` | `0 12px 32px rgba(0,0,0,0.25)` | `shadow-overlay` | Toast, plutajući element |

Modal u prototipu **nema** box-shadow — dubina se postiže `scrim` pozadinom + `backdrop-blur-scrim`. Header takođe bez senke (samo `border-header` + `backdrop-blur-header`).

---

## Tokeni — Breakpoints & layout

Original koristi **fluidni/intrinsic layout** (`flex-wrap` + `flex-basis` + `clamp()`), bez `@media` upita. Jedina tvrda vrednost je content kontejner **1180px**. Preporučeni formalni breakpoint-ovi za React build (u `theme.extend.screens`):

| Naziv | min-width | Uloga |
|---|---|---|
| *(base)* | 0 | Mobile (jedna kolona, `flex-wrap` slaže panele) |
| `sm` | 640px | Mobile → tablet |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop (dvopanelni booking, sticky desni panel) |
| `xl` | 1180px | Wide / `max-w-content` granica |

Tipične `flex-basis` granice iz koda (za reprodukciju kolona): kartice 260–300px min, booking paneli 280–360px, auth paneli 380px.

---

## Tokeni — Animacije

| Token | Klasa | Keyframes | Trajanje / easing | Upotreba |
|---|---|---|---|---|
| `fade` | `animate-fade` | opacity 0→1 | 0.22s ease | Pojava panela, otvaranje reda |
| `up` | `animate-up` | opacity+translateY(14px)→0 | 0.4s ease | Ulazak kartice/forme |
| `toast` | `animate-toast` | translate(-50%,16px)→0 | 0.3s `cubic-bezier(.2,.9,.3,1.1)` | Toast odozdo |
| `pop` | `animate-pop` | scale(.94)→1 | 0.3s `cubic-bezier(.2,.9,.3,1.2)` | Pojava modala |

Toggle/chevron koriste `transition` ~0.15s ease na `left`/`transform`.

---

## Komponente

Za svaku: **Varijante**, **Stanja**, **Tokeni**. Imena su predlog za React komponente.

### Button

- **Varijante:** `primary` (bg `ink`, tekst bele), `accent` (bg `primary`), `secondary`/outline (bg `surface` + `border`), `ghost` (transparent, `text-secondary`), `danger-outline` (`border-danger-border`, `text-danger`), `success-outline` (border `#CFE6D6`, `text-success`), `icon`/paginacija (kvadrat 34px), `pill` (npr. „+1" kredit). Veličine: nav (8/15), default (11/20), large (puna širina, 13–15/—).
- **Stanja:** `default`; `hover` (potamni: `ink-hover` / `primary-hover`, ili `border-ink`); `disabled` (bg `surface-disabled`, `text-disabled`, `cursor-not-allowed`); `active`/selektovano (bg `ink`, belo). `loading` **ne postoji** u prototipu — predlog: spinner u `primary`/beloj, dugme `disabled`.
- **Tokeni:** `ink`, `ink-hover`, `primary`, `primary-hover`, `surface`, `border`, `danger`, `danger-subtle`, `danger-border`, `surface-disabled`, `disabled`, `rounded-lg`/`rounded-btn`, `text-md`/`text-sm`.

### Input (text / email / password)

- **Varijante:** jedna; podržava `type` text/email/password. Veličine: standard (11–14/13–16), veliki auth input (14/16).
- **Stanja:** `default` (`border`, `bg-surface`, `rounded-lg`); `focus` → `outline:none` (⚠ **nema vidljivog focus prstena** u prototipu — za React build dodati `focus:ring-2 focus:ring-primary` radi pristupačnosti); `placeholder` (`text-muted`); `disabled`/`error` nisu stilizovani — predlog: `error` = `border-danger` + helper `text-danger`.
- **Tokeni:** `surface`, `border`, `text-ink`, `muted`, `rounded-lg`.

### Select / Dropdown

- **Varijante:** native `<select>`; `rounded-btn`, `bg-surface`. Isti vizual kao input.
- **Stanja:** `default`, `focus` (outline none), `disabled`.
- **Tokeni:** `surface`, `border`, `text-ink`, `rounded-btn`.

### DateInput

- **Varijante:** native `<input type="date">` sa `min`/`max`; vizual kao Select.
- **Stanja:** `default`, `empty` (prikaz placeholder formata), `focus`.
- **Tokeni:** `surface`, `border`, `text-ink`, `rounded-btn`. Koristi se u FilterBar (admin Termini).

### Card

- **Varijante:** `content`/`list` (bg `surface`, `border-card`, `rounded-card`/`panel`, padding 18–24); `stat`/dark (bg `ink`, tekst beli/`on-dark`, `rounded-panel`, dekorativni `ink-line` krugovi, `accent` CTA); `info` (bg `surface-subtle`, `rounded-xl`); `empty-state` (`border-dashed`, `rounded-panel`, centriran sadržaj).
- **Stanja:** statična; interakcija ide kroz ugnježdene dugmiće.
- **Tokeni:** `surface`, `border-card`, `ink`, `line`, `surface-subtle`, `border-dashed`, `rounded-card`/`panel`.

### Badge / StatusPill

- **Varijante:** `success` (ACTIVE), `danger` (LOCKED/CANCELLED), `neutral` (INACTIVE/DELETED). Mono `text-micro`, `rounded-badge`, padding 5/9.
- **Stanja:** statično (vođeno `status` vrednošću).
- **Tokeni:** `success`+`success-subtle`, `danger`+`danger-subtle`, `neutral`+`neutral-subtle`, `font-mono`, `text-micro`, `rounded-badge`.

### Modal (Success / Confirm)

- **Varijante:** centralni dijalog sa rezime-boksom (`surface-subtle`).
- **Stanja:** `open`/`closed`; ulaz `animate-pop`, backdrop `animate-fade`.
- **Tokeni:** `scrim` + `backdrop-blur-scrim`, `surface`, `surface-subtle`, `line`, `primary` (ikona), `rounded-modal`.

### Toast

- **Varijante:** jedna (tamna, dole-centar).
- **Stanja:** pojava `animate-toast`, auto-dismiss ~2.6s.
- **Tokeni:** `ink`, `shadow-overlay`, `rounded-lg`.

### Header / AppBar

- **Varijante:** sticky, `bg-header-bg` + `backdrop-blur-header`, `border-b border-border-header`, visina 66px, `max-w-content`.
- **Stanja:** statično (sadrži NavTabs, CreditsPill, Avatar, role-switch).
- **Tokeni:** `header-bg`, `border-header`, `max-w-content`.

### NavTabs

- **Varijante:** horizontalni tabovi (admin: Sprave/Termini/Rezervacije/Korisnici; klijent: Rezervacija/Moji termini/Profil).
- **Stanja:** `active` (bg `ink`, belo), `inactive` (`text-secondary`), `hover`.
- **Tokeni:** `ink`, `secondary`, `rounded-btn`.

### SegmentedControl

- **Varijante:** role-switch (track `bg-track`, `rounded-pill`) i booking-variation switch (`bg-surface` + `border`, `rounded-xl`).
- **Stanja:** segment `active` (bg `ink` ili `surface` + `shadow-sm`), `inactive` (`text-muted`).
- **Tokeni:** `track`, `ink`, `surface`, `muted`, `shadow-sm`, `rounded-pill`.

### Toggle / Switch

- **Varijante:** prekidač 46×27, knob 21px.
- **Stanja:** `on` (track `bg-primary`), `off` (track `bg-switch-off`); knob `bg-surface`, `transition` na `left`.
- **Tokeni:** `primary`, `switch-off`, `surface`, `rounded-pill`.

### DaySelector (date strip)

- **Varijante:** horizontalna traka dugmadi-kolona (62px), mono `dnum` 22px.
- **Stanja:** `selected` (bg `ink`, belo, `border-ink`), `default` (`bg-surface`, `border`).
- **Tokeni:** `ink`, `surface`, `border`, `font-mono`, `rounded-xl`.

### AppointmentSlot (TimeSlot)

- **Varijante:** `A` — kartica (puna širina, `rounded-xl`, `border-card`); `B` — red u rasporedu (hover/open `bg-surface-subtle`).
- **Stanja:** `available`, `booked`/full (`text-danger` "Zauzeto/Popunjeno"), `past` (`bg-surface-sunken`, opacity, `cursor-not-allowed`), `open` (`border-ink`), `selected`.
- **Tokeni:** `surface`, `surface-subtle`, `surface-sunken`, `border-card`, `ink` (open border), `success`, `danger`, `muted`, `font-mono`, `rounded-xl`.

### MachineCard (izbor sprave)

- **Varijante:** `card` (`rounded-xl`) i `chip` (`rounded-lg`); mono oznaka pozicije.
- **Stanja:** `available` (`bg-surface-subtle`, `border`), `selected` (bg `ink`, belo), `disabled` (`bg-surface-sunken`, opacity, not-allowed).
- **Tokeni:** `surface-subtle`, `ink`, `surface-sunken`, `border`, `success`, `font-mono`, `rounded-xl`/`lg`.

### DataTable / ListRow

- **Varijante:** header-traka (`bg-surface-subtle`, `text-label` UPPERCASE `muted`) + redovi podataka (`border-t border-line`, padding 15/20). Koristi se u svim admin listama.
- **Stanja:** red `default`; admin Rezervacije red ima i `editing` (inline forma, `animate-fade`).
- **Tokeni:** `surface-subtle`, `line`, `muted`, `text-label`.

### Pagination

- **Varijante:** footer ispod liste — info tekst + prev/next + numerisane strane (kvadrat 34px). Page-size 5.
- **Stanja:** stranica `active` (bg `ink`, belo), `default` (`border`); `prev/next` `disabled` (`text-disabled`, not-allowed).
- **Tokeni:** `ink`, `surface`, `border`, `muted` (info), `disabled`, `rounded-btn`, `font-mono` (info).

### FilterBar (filter po datumu)

- **Varijante:** labela (`text-label`) + DateInput + „Poništi filter" (secondary dugme) + brojač (`text-caption font-mono muted`).
- **Stanja:** `inactive` (svi datumi), `active` (izabran datum → „Poništi" vidljiv); prazan rezultat → empty-state red.
- **Tokeni:** `border`, `surface`, `muted`, `secondary`, `rounded-btn`.

### Alert / Banner

- **Varijante:** `danger` (pomeranje termina — `bg-danger-subtle`, `border #F3C9C9`, `text-danger-emphasis`); `warning` (no-credits — `bg-surface`, `border-warning-border`, `text-warning-text`); `error` (termin-validacija — `bg-danger-subtle`, `text-danger-emphasis`).
- **Stanja:** prikaz/skrivanje (uslovno).
- **Tokeni:** `danger-subtle`, `danger-border`, `danger-emphasis`, `warning-border`, `warning-text`, `surface`, `rounded-xl`.

### Avatar

- **Varijante:** krug (`rounded-full`, bg `ink`, inicijali beli), veličine 34px (header) / 52px (profil).
- **Stanja:** statično.
- **Tokeni:** `ink`, `surface` (tekst), `rounded-full`.

### CreditsPill (header)

- **Varijante:** pill sa crvenom tačkom + mono brojem kredita.
- **Stanja:** `default`, `hover` (`border-ink`); klik vodi na Profil.
- **Tokeni:** `surface`, `border`, `primary` (tačka), `font-mono`, `rounded-pill`.

---

## Mapiranje na domen (vidi `SPEC.md`)

- **StatusPill** ↔ `Status` enum (User/Pilates/Termin): ACTIVE→`success`, INACTIVE/DELETED→`neutral`, LOCKED→`danger`.
- **AppointmentSlot** ↔ `Appointment.status`: AVAILABLE→`available`/`success`, BOOKED→`booked`, CANCELED→prikaz „Otkazana"/`danger`.
- **CreditsPill / stat kartica** ↔ `User.remainingAppointments`.
- **DataTable + Pagination + FilterBar** ↔ admin CRUD ekrani (Pilates, Termin, Appointment, User) iz Modula 2–5.
