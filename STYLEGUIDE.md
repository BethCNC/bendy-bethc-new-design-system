# 🎨 STYLEGUIDE: Figma → Code with bendy-bethc-new-design-system

This document is a quick reference for developers and AI agents building from **Figma designs** using the **design system tokens** and **rules** in the repo.

---

## 🎯 Core Principles
- **Tokens only**: Never hardcode px, rem, or hex values.
- **Responsive-first**: Use grid and spacing tokens from `variables/responsive.json`.
- **Typography strictness**: Always use tokenized classes (`text-heading-h2`, `text-body-md-regular`).
- **Accessibility**: Use `aria-label` for icon-only buttons, and apply focus rings via `--border-focus`.
- **Variants via props**: One component per pattern, with variants controlled by props.
- **Consistency**: Figma → Tokens → Code must match exactly.

---

## 📂 Repo Structure (Quick Reference)

```
variables/ # JSON token collections (primitives → semantic → component → responsive)
design-system/ # CSS output for tokens/utilities
.cursor/rules/ # AI agent rules (tokens, typography, responsive, states, etc.)
README.md # Project overview
CONTRIBUTING.md # Developer & AI contribution rules
```

---

## 🖋 Typography
Use semantic text classes from tokens:
- Headings: `text-heading-h1`, `text-heading-h2`, ... `text-heading-h6`
- Titles: `text-title-lg-semibold`, `text-title-md-regular`
- Body: `text-body-lg-regular`, `text-body-md-regular`, `text-body-sm-regular`
- Display: `text-display`, `text-displaymedium`

### Example
```html
<h1 class="text-heading-h1">Page Title</h1>
<p class="text-body-md-regular">Body copy goes here...</p>
```

---

## 🎨 Colors & Surfaces

**Surfaces:** `surface-card`, `surface-secondary`, `surface-neutral-strong`  
**Text:** `text-body`, `text-subtle`, `text-inverse`  
**Borders:** `border-border-subtle`, `border-border-strong`

**Example**
```html
<div class="surface-card border border-border-subtle rounded-lg p-16">
  <p class="text-body-md-regular">Card content</p>
</div>
```

---

## 📐 Layout & Spacing

- Container: `container`
- Grid: `grid grid-desktop-12`
- Column span: `col-span-desktop-8`, `col-span-desktop-4`
- Gaps/Padding: `p-16`, `gap-12`

**Example**
```html
<div class="container">
  <div class="grid grid-desktop-12 gap-16">
    <div class="col-span-desktop-8">Main</div>
    <div class="col-span-desktop-4">Sidebar</div>
  </div>
</div>
```

---

## 🔘 Buttons

Use component + state tokens:

- Variants: `btn-primary`, `btn-neutral`, `btn-outline`, `btn-error`
- Sizes: `btn-sm`, `btn-md`, `btn-lg`
- States: `hover:bg-surface-hover`, `focus:ring-2 ring-border-focus`

**Example**
```html
<button class="btn btn-primary btn-md">Click Me</button>
```

---

## 🗂 Components (Blog Card Example)

**Variants:** `vertical`, `verticalBigImage`, `horizontal`

**Usage**
```jsx
<BlogCard
  title="Breathing Techniques"
  image="/image.png"
  tags={["Life Hacks", "Breathing", "EDS"]}
  excerpt="In today's fast-paced world..."
  date="July 12, 2025"
  variant="vertical"
/>
```

- Title → `text-title-md-semibold`
- Chips → pill style with `bg-surface-neutral-strong text-body-xs-regular`
- Excerpt → `text-body-md-regular line-clamp-5`
- Date → `text-body-sm-regular text-text-subtle`

---

## 🔒 Accessibility

- All icon-only buttons → `aria-label="Descriptive text"`
- Focus rings → `focus:ring-2 ring-border-focus`
- Text contrast → follow semantic tokens (`text-subtle`, `text-inverse`)

---

## ✅ Workflow

1. Pull component from Figma MCP server (or plugin export).
2. Map Figma styles → semantic/component tokens.
3. Build component with props for variants & states.
4. Validate with `.cursor/rules/`:
   - `no-hardcoding.mdc`
   - `responsive-rules.mdc`
   - `typography-rules.mdc`
   - `tokens-rules.mdc`
5. Run:
   ```bash
   npm run lint
   npm run lint:css
   npm run validate:design-system
   ```

---

## 🚀 Takeaway

This repo is **design-system first**. Every style, layout, and interaction is driven by **tokens + rules**, not arbitrary values.  
Always align with **Figma → Tokens → Code** for perfect consistency.
