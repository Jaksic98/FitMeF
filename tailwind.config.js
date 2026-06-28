/** @type {import('tailwindcss').Config} */

// FitMe Pilates — design tokeni izvučeni 1:1 iz prototipa `FitMe Pilates.dc.html`.
// Bez izmena izgleda: sve vrednosti su tačne (hex / px) onako kako postoje u kodu.
//
// Imena tokena su semantička i platformski-neutralna (surface, ink, primary, muted…),
// tako da isti tokeni mogu da rade i u NativeWind / React Native kasnije —
// nema web-specifičnih imena vezanih za konkretan property.

module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // — Canvas & površine —
        canvas: '#F4F2EF',              // pozadina aplikacije (body)
        surface: '#FFFFFF',             // kartice, inputi, header
        'surface-subtle': '#FAF8F5',    // table-header, otvoreni red, info-box
        'surface-muted': '#F3F0EA',     // pozicija-čip, neutralni badge fill
        'surface-sunken': '#F6F4F1',    // disabled fill kartice/slota
        'surface-disabled': '#EBE7E1',  // disabled dugme

        // — Brand & ink —
        primary: '#E11414',             // brand crvena, primarni CTA, akcenti, tačka
        'primary-hover': '#B50F0F',     // hover za crvene akcije
        'primary-emphasis': '#F01616',  // svetliji crveni hover (na tamnom panelu)
        ink: '#121110',                 // primarni tekst + tamna dugmad/paneli
        'ink-hover': '#000000',         // hover za tamna dugmad
        'ink-line': '#2A2724',          // dekorativni krugovi na tamnom panelu

        // — Tekst —
        secondary: '#6F6B66',           // sekundarni tekst
        muted: '#9C968F',               // prigušeni tekst / labela
        disabled: '#BBB4AB',            // disabled / placeholder tekst
        'on-dark': '#A8A39D',           // prigušeni tekst na tamnoj površini

        // — Ivice —
        border: '#E2DED8',              // input, kontrole
        'border-card': '#E7E3DD',       // kartice, paneli
        line: '#F0ECE5',                // divider između redova
        'border-dashed': '#DDD8D1',     // empty-state isprekidana ivica
        'border-header': '#E8E4DE',     // donja ivica headera

        // — Feedback —
        success: '#178A4E',
        'success-subtle': '#E7F5EC',
        danger: '#C23232',
        'danger-subtle': '#FBEAEA',
        'danger-border': '#ECD0D0',
        'success-border': '#CFE6D6', // success-outline dugme ivica
        'danger-emphasis': '#9A1414',   // jak tekst u alert/error banneru
        warning: '#B08A1E',
        'warning-text': '#6F5A1E',
        'warning-border': '#F0D28A',
        neutral: '#8A8378',
        'neutral-subtle': '#F3F0EA',

        // — Utility —
        track: '#F1EDE7',               // track segmented-kontrole (role)
        'switch-off': '#D8D3CC',        // OFF stanje toggle-a
        scrim: 'rgba(18,17,16,0.5)',    // modal backdrop
        'header-bg': 'rgba(255,255,255,0.88)', // sticky header (uz backdrop-blur)
      },

      fontFamily: {
        sans: ['Archivo', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      // [size, { lineHeight, letterSpacing, fontWeight }]
      fontSize: {
        micro:    ['10px', { lineHeight: '1',    letterSpacing: '0.06em',  fontWeight: '700' }], // mono badge
        label:    ['11px', { lineHeight: '1.3',  letterSpacing: '0.05em',  fontWeight: '700' }], // UPPERCASE labela
        caption:  ['12px', { lineHeight: '1.4',                            fontWeight: '500' }], // caption / meta
        sm:       ['13px', { lineHeight: '1.5',                            fontWeight: '500' }],
        base:     ['14px', { lineHeight: '1.6',                            fontWeight: '400' }], // body default
        md:       ['15px', { lineHeight: '1.6',                            fontWeight: '400' }], // body / input
        lg:       ['16px', { lineHeight: '1.6',                            fontWeight: '400' }], // lead paragraf
        h4:       ['18px', { lineHeight: '1.3',  letterSpacing: '-0.01em', fontWeight: '800' }],
        h3:       ['23px', { lineHeight: '1.2',  letterSpacing: '-0.02em', fontWeight: '800' }],
        h2:       ['30px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        h1:       ['34px', { lineHeight: '1.1',  letterSpacing: '-0.025em', fontWeight: '800' }], // u kodu clamp(26→34px)
        display:  ['52px', { lineHeight: '1.04', letterSpacing: '-0.025em', fontWeight: '800' }], // login hero, clamp(32→52px)
        'mono-lg':['22px', { lineHeight: '1',                              fontWeight: '700' }],  // mono vreme/broj
        stat:     ['64px', { lineHeight: '1',    letterSpacing: '-0.03em', fontWeight: '700' }],  // veliki kredit-broj
      },

      // ne-default vrednosti; ostalo je Tailwind default 4px skala
      spacing: {
        '4.5': '18px', // kompaktni card padding
        '5.5': '22px', // razmak između sekcija
        '13':  '52px', // veliki vertikalni razmak
        '1.25':  '5px', // badge py
        '2.25':  '9px', // badge px
        '2.75': '11px', // dugme default py
        '3.25': '13px', // dugme lg py
        '3.75': '15px', // dugme nav px
        '8.5':  '34px', // icon dugme / paginacija kvadrat
      },

      borderRadius: {
        badge: '6px',    // status badge, pozicija-čip
        DEFAULT: '8px',  // mali button, paginacija
        btn: '9px',      // input/select, admin dugme
        lg: '11px',      // primarno dugme, veliki input
        xl: '13px',      // čip, alert, slot kartica
        card: '16px',    // kartice / liste
        panel: '18px',   // veliki panel / stat kartica
        modal: '22px',   // modal
        pill: '9999px',  // pill, toggle, avatar (uz rounded-full)
      },

      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.10)',     // aktivni segment, blagi lift
        overlay: '0 12px 32px rgba(0,0,0,0.25)', // toast / plutajući element
        // napomena: modal NEMA shadow u prototipu — oslanja se na scrim + blur
      },

      backdropBlur: {
        header: '12px', // sticky header
        scrim: '3px',   // modal backdrop
      },

      maxWidth: {
        content: '1180px', // glavni kontejner (header + main)
      },

      // Original je fluidni layout (clamp + flex-wrap), bez media query-ja.
      // Ovo su preporučeni formalni breakpoint-ovi; xl=1180 prati content kontejner.
      screens: {
        sm: '640px',   // mobile → tablet
        md: '768px',   // tablet
        lg: '1024px',  // desktop
        xl: '1180px',  // wide / content max
      },

      keyframes: {
        fade: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        up:   { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } },
        toast:{ '0%': { opacity: '0', transform: 'translate(-50%,16px)' }, '100%': { opacity: '1', transform: 'translate(-50%,0)' } },
        pop:  { '0%': { opacity: '0', transform: 'scale(0.94)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        fade:  'fade 0.22s ease both',
        up:    'up 0.4s ease both',
        toast: 'toast 0.3s cubic-bezier(.2,.9,.3,1.1) both',
        pop:   'pop 0.3s cubic-bezier(.2,.9,.3,1.2) both',
      },
      transitionTimingFunction: {
        pop: 'cubic-bezier(.2,.9,.3,1.2)',
      },
    },
  },
  plugins: [],
};
