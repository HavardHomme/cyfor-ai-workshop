# Forsvaret Design System — Implementation Guide

Reference for applying the Forsvaret brand identity to this booking/resource management application.

---

## Color Palette

The Forsvaret brand is built on dark military greens, near-black, and off-white. No pastels, no rounded consumer-app colours.

| Token name          | Hex       | Usage                                              |
|---------------------|-----------|----------------------------------------------------|
| `fors-green`        | `#253722` | Primary — header backgrounds, primary buttons      |
| `fors-green-dark`   | `#0D1F0D` | Near-black green — footer, hover states, deep bg   |
| `fors-green-mid`    | `#3A5C34` | Secondary green — hover overlays, accents          |
| `fors-sand`         | `#F5F2EC` | Off-white/parchment — page background, input bg    |
| `fors-khaki`        | `#DDD8CC` | Muted khaki — borders, dividers, disabled states   |
| `fors-text`         | `#1A1A14` | Near-black — all body text                         |
| `fors-muted`        | `#5A5A4A` | Olive muted — secondary/meta text, labels          |
| `fors-danger`       | `#8B1A1A` | Deep red — error messages, destructive actions     |
| Black               | `#000000` | Icon stroke colour (native in SVG assets)          |
| White               | `#FFFFFF` | Text on dark green surfaces; white logo variant    |

### Tailwind v4 — wiring custom colors

This project uses Tailwind v4 via `@tailwindcss/vite`. Add color tokens to the `@theme` block in `web/src/index.css`:

```css
@theme {
  --color-fors-green:      #253722;
  --color-fors-green-dark: #0D1F0D;
  --color-fors-green-mid:  #3A5C34;
  --color-fors-sand:       #F5F2EC;
  --color-fors-khaki:      #DDD8CC;
  --color-fors-text:       #1A1A14;
  --color-fors-muted:      #5A5A4A;
  --color-fors-danger:     #8B1A1A;
}
```

Then use as `bg-fors-green`, `text-fors-muted`, `border-fors-khaki`, etc.  
Alternatively use arbitrary values directly: `bg-[#253722]`.

---

## Typography

Four weights are available. Font files live in `web/public/fonts/`.

| File            | Weight | Tailwind class          | Use case                                    |
|-----------------|--------|-------------------------|---------------------------------------------|
| `FORSLGT.ttf`   | 300    | `font-light`            | Large display text, quotes                  |
| `FORSARR.ttf`   | 400    | `font-normal`           | Body text, form labels, descriptions        |
| `FORSMED.ttf`   | 500    | `font-medium`           | Section labels, nav items, button text      |
| `FORSBLD.ttf`   | 700    | `font-bold`             | Page titles, headers, strong emphasis       |

### Loading fonts

Declared in `web/src/index.css` via `@font-face`. The `Forsvaret` family is set as `--font-sans` in the `@theme` block and applied to `:root`, so all text inherits it automatically.

```css
@font-face {
  font-family: "Forsvaret";
  src: url("/fonts/FORSLGT.ttf") format("truetype");
  font-weight: 300;
  font-display: swap;
}
/* … repeat for each weight … */
```

### Style rules

- **Headings**: bold (`700`), uppercase, wide letter-spacing (`tracking-wide` or `tracking-widest`)
- **Section labels / caps labels**: medium (`500`), `text-xs tracking-widest uppercase`
- **Body**: regular (`400`), normal case, comfortable line-height
- **No italic** — Forsvaret brand guidelines avoid italics for official copy
- Letter-spacing baseline: `0.01em` on `:root`

---

## Logo Usage

Two variants are provided in `web/public/`:

| File                      | Background   | When to use                              |
|---------------------------|--------------|------------------------------------------|
| `forsvaret-logo-hvit.png` | White/light  | **Header on dark green** — always prefer this on `bg-[#253722]` or darker |
| `forsvaret-logo.png`      | Transparent  | Light backgrounds, print, documents      |

### Rules

- Minimum height: `h-8` (32 px) on screen — never smaller
- Preferred header size: `h-10` (40 px)
- Always preserve the aspect ratio (`w-auto`)
- Clear space: maintain at least half the logo's height as padding on all sides
- Do not colorise, rotate, stretch, or add drop shadows to the logo

---

## Icons

Source: `design-system/NEDLASTING/IKONER/SVG sort/`  
A selection of relevant icons is copied to `web/public/icons/`.

### Characteristics

- 120×120 viewBox
- Clean line-art, `stroke="#000"`, `fill="none"`, `stroke-width="3.6"`
- No fill, no gradients — pure stroke icons

### Usage on light backgrounds

Use as `<img>` tags directly — black strokes read well on `#F5F2EC` and white:

```tsx
<img src="/icons/kalender.svg" alt="Kalender" className="h-6 w-6" />
```

### Usage on dark backgrounds

The SVG `stroke` is hardcoded to `#000`. To invert for dark backgrounds, apply a CSS filter:

```css
.icon-white {
  filter: invert(1);
}
```

Or inline the SVG and change `stroke="#000"` to `stroke="#fff"` (or `stroke="currentColor"` and set `color: white`).

### Recommended icons for this app

| File                                | Icon       | Use case              |
|-------------------------------------|------------|-----------------------|
| `kalender.svg`                      | Calendar   | Booking/date actions  |
| `soldat.svg`                        | Soldier    | Personnel/user marker |
| `telefon.svg`                       | Phone      | Contact info          |

---

## Tailwind Config Snippet

For Tailwind v4 (`@tailwindcss/vite`), all config lives in `web/src/index.css`:

```css
@import "tailwindcss";

@theme {
  /* Font */
  --font-sans: "Forsvaret", "Inter", ui-sans-serif, system-ui, sans-serif;

  /* Colors */
  --color-fors-green:      #253722;
  --color-fors-green-dark: #0D1F0D;
  --color-fors-green-mid:  #3A5C34;
  --color-fors-sand:       #F5F2EC;
  --color-fors-khaki:      #DDD8CC;
  --color-fors-text:       #1A1A14;
  --color-fors-muted:      #5A5A4A;
  --color-fors-danger:     #8B1A1A;
}
```

---

## Component Patterns

### Button — primary

```tsx
<button className="bg-[#253722] px-4 py-2 text-sm font-medium tracking-widest uppercase text-white hover:bg-[#0D1F0D] transition-colors disabled:bg-[#DDD8CC] disabled:text-[#9A9A8A] disabled:cursor-not-allowed">
  Legg til ressurs
</button>
```

- No border-radius (`rounded-none` is default when no `rounded-*` is applied)
- Uppercase tracking-widest labels
- Hover goes darker, not lighter

### Button — ghost/secondary

```tsx
<button className="border border-[#DDD8CC] px-3 py-1 text-sm text-[#5A5A4A] hover:border-[#253722] hover:text-[#253722] transition-colors">
  Rediger
</button>
```

### Button — destructive

```tsx
<button className="border border-[#DDD8CC] px-3 py-1 text-sm text-[#5A5A4A] hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors">
  Fjern
</button>
```

### Input

```tsx
<input
  className="border border-[#DDD8CC] bg-[#F5F2EC] px-3 py-2 text-base outline-none focus:border-[#253722] focus:bg-white transition-colors placeholder:text-[#9A9A8A]"
/>
```

- No border-radius
- Sand background at rest, white on focus
- Border turns military green on focus — no glow/ring

### Card / panel

```tsx
<div className="border border-[#DDD8CC] bg-white shadow-sm p-5">
  {/* content */}
</div>
```

- Flat, no rounded corners
- Thin khaki border
- White surface over sand page background

### Section header / list header

```tsx
<div className="bg-[#253722] px-5 py-3 border-b border-[#DDD8CC]">
  <h2 className="text-xs font-medium tracking-widest uppercase text-white">
    Alle ressurser
  </h2>
</div>
```

- Dark green background, white caps label
- Acts as a visual anchor for the section below

### Page header bar

```tsx
<header className="bg-[#253722] px-6 py-3 flex items-center gap-4 shadow-md">
  <img src="/forsvaret-logo-hvit.png" alt="Forsvaret" className="h-10 w-auto" />
  <div className="border-l border-[#3A5C34] pl-4 ml-4">
    <p className="text-white text-xs tracking-widest uppercase opacity-70">Ressursforvaltning</p>
    <p className="text-white text-sm font-medium">Cyfor — Ressursbooking</p>
  </div>
</header>
```

### Error / alert

```tsx
<p className="text-sm text-[#8B1A1A] border border-[#8B1A1A] bg-[#8B1A1A]/5 px-3 py-2">
  Feilmelding her
</p>
```

---

## Visual Design Principles

1. **No rounded corners** — the Forsvaret aesthetic is sharp and institutional
2. **Uppercase caps labels** — use `text-xs tracking-widest uppercase` for section headers, button text, and metadata tags
3. **Dark green dominates** — headers, primary actions, and section labels use `#253722`/`#0D1F0D`
4. **Sand page background** — `#F5F2EC` instead of pure white; white is reserved for card surfaces
5. **Muted olive for secondary text** — `#5A5A4A`, not grey
6. **Borders instead of shadows** — prefer `border border-[#DDD8CC]` over `shadow-*` for panels
7. **Serious, structured layouts** — strong left-border accents (`border-l-4 border-[#253722]`) for page titles; never decorative gradients or animations
