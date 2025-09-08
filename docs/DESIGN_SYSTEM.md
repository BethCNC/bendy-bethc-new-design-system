# Bendy BethC Design System

This document defines the **one and only design system** used across the site.  
It explains how tokens, CSS variables, Tailwind, and components fit together.

---

## 🎯 Principles
- **Single Source of Truth**: All raw values (px, hex, rem) live in JSON token files under `variables/` and `tokens/`.
- **No Raw Values in Code**: Never use `px`, `rem`, hex colors, or default Tailwind utilities like `text-3xl`, `p-4`, `bg-gray-200`.
- **Tailwind Is the Only Interface**: Developers only use Tailwind utilities that map to tokens.
- **CSS Vars Are Internal**: CSS custom properties (`--ds-*`) are generated from tokens but should not be used directly in components.

---

## 🔑 System Structure

### 1. Tokens (JSON)
- Found in `variables/` and `tokens/`
- Define all design primitives (colors, spacing, typography, radii, responsive values).

Example (`Responsive-mobile.json`):
```json
"H1": {
  "fontSize": 48,
  "lineHeight": 60
}
```

### 2. CSS Variables (responsive.css)
- Tokens are transformed into CSS variables with responsive overrides.

Example (`design-system/css/responsive.css`):
```css
:root {
  --font-size-heading-h1: var(--ds-heading-h1-mobile);
}

@media (min-width: 810px) {
  :root {
    --font-size-heading-h1: var(--ds-heading-h1-tablet);
  }
}
```

### 3. Tailwind Config (tailwind.config.js)
- Maps CSS variables into Tailwind theme utilities.

```js
fontSize: {
  "heading-h1": ["var(--font-size-heading-h1)", { lineHeight: "var(--line-height-heading-h1)" }],
},
colors: {
  primary: "var(--ds-primary)",
  surface: {
    card: "var(--ds-surface-card)",
    page: "var(--ds-surface-page)",
  },
}
```

### 4. Tailwind Plugin (design-system/tailwind-plugin.js)
- Adds semantic component-level utilities (buttons, chips, fields).

```js
".button-md": {
  padding: "var(--button-padding-v) var(--button-padding-h)",
  borderRadius: "var(--button-radius)",
  fontSize: "var(--font-size-body-md)",
}
```

### 5. Components (React)
- Use only Tailwind utilities that map to tokens.
- Never use raw CSS, inline styles, or Tailwind defaults that bypass tokens.

Example (Header.tsx):
```tsx
<header className="bg-surface-page px-spacing-3xl py-spacing-xl border-b-2 border-neutral flex items-center justify-between">
  <Logo className="text-heading" />
  <nav className="flex gap-spacing-lg">
    <a className="text-body-md text-heading hover:text-primary">Home</a>
    <a className="text-body-md text-heading hover:text-primary">About</a>
    <a className="text-body-md text-heading hover:text-primary">Contact</a>
  </nav>
</header>
```

---

## ✅ Do / ❌ Don’t

### Typography
- ✅ `text-heading-h1`, `text-body-md`
- ❌ `text-4xl`, `text-lg`

### Spacing
- ✅ `p-spacing-md`, `gap-spacing-lg`
- ❌ `p-4`, `gap-8`

### Colors
- ✅ `bg-primary`, `bg-surface-card`, `text-subtle`
- ❌ `bg-blue-500`, `text-gray-600`, `bg-black`

### Components
- ✅ `<button className="button-md bg-primary text-body-md">Click</button>`
- ❌ `<button className="px-4 py-2 text-lg bg-blue-500">Click</button>`

---

## 🔍 Enforcement
- Pre-commit hooks check for violations (px, hex, raw Tailwind).
- `scripts/auto-fix-tokens.js` replaces raw values with token references.
- Commits will fail if non-tokenized values are used.

---

## 🚀 Workflow
1. Update design values only in JSON tokens (`variables/`, `tokens/`).
2. Run build/auto-fix → updates CSS variables in `responsive.css`.
3. Tailwind config + plugin expose tokens as utilities.
4. Components consume only Tailwind utilities.
5. Pre-commit check ensures token purity.

---

## ✅ Summary
- **Tokens (JSON)** → define values.  
- **CSS Vars (`responsive.css`)** → store responsive overrides.  
- **Tailwind Config + Plugin** → expose token utilities.  
- **Components** → use only Tailwind utilities.  

> **The final and only system is Tailwind extended with our tokens.**
