# Component Refactor Plan – bendy-bethc-new-design-system

This guide explains how to refactor all components in `app/components/ui/` to use the new **token-driven design system**.  
Goal: **remove raw Tailwind utilities (`px-4`, `text-2xl`) and inline CSS**, and replace with **semantic token utilities** (`button-md`, `text-heading-h1`, `bg-primary`).

---

## 1. Principles
- **Tokens only**: All sizes, spacing, and colors must reference tokens (`var(--ds-...)`) via Tailwind utilities.
- **Tailwind bridge**: Use the utilities provided in `tailwind-plugin.js` and `tailwind.config.js`.
- **No raw px**: Replace `p-4`, `mt-8`, `text-3xl`, etc. with token classes.
- **No hardcoded colors**: Replace `bg-white`, `text-gray-600`, `bg-black` with semantic classes (`bg-surface-card`, `text-subtle`, `bg-surface-page`).
- **Accessibility preserved**: Keep aria-labels, focus styles, and roles.

---

## 2. Refactor Strategy

### Typography
- Replace Tailwind defaults:
  - ❌ `text-2xl` → ✅ `text-heading-h2`
  - ❌ `text-lg` → ✅ `text-body-lg`
  - ❌ `text-sm` → ✅ `text-body-sm`
- Use semantic text colors:
  - ❌ `text-gray-600` → ✅ `text-subtle`
  - ❌ `text-white` → ✅ `text-display`

### Spacing
- Replace fixed spacing with tokens:
  - ❌ `p-4` → ✅ `p-spacing-md`
  - ❌ `mt-8` → ✅ `m-spacing-lg`
  - ❌ `gap-6` → ✅ `gap-spacing-md`

### Colors
- Replace raw Tailwind colors:
  - ❌ `bg-blue-500` → ✅ `bg-primary`
  - ❌ `bg-gray-100` → ✅ `bg-surface-card`
  - ❌ `bg-black` → ✅ `bg-surface-page`

### Components
- **Button**:
  - Use `.button-sm`, `.button-md`, `.button-lg`, `.button-xl` for sizing.
  - Use variant classes: `bg-primary`, `bg-secondary`, `bg-error`, `bg-tertiary`, `bg-surface-card`.
  - Typography: `text-body-md` or `text-body-sm`.
  - Remove `<style jsx>` blocks – all handled via tokens.

- **Input**:
  - Use `p-spacing-sm`, `border-neutral`, `text-body-md`.
  - Replace raw border radius with `rounded-md` (maps to token).

- **Copy Blocks** (`ComingSoonCopyBlock`, `CopyBlock1`):
  - Replace `p-8` → `p-spacing-xl`.
  - Replace `text-3xl` → `text-heading-h2`.
  - Replace `text-gray-600` → `text-subtle`.

- **Footer/Header**:
  - Use `bg-surface-page`, `text-body-md`.
  - Replace spacing: `py-12` → `p-spacing-xl`, `gap-8` → `gap-spacing-lg`.

- **Hero/SocialPreview/ImageGallery**:
  - All typography → design system text utilities.
  - All spacing → spacing token utilities.
  - All background/text colors → semantic tokens.

---

## 3. Example: Button Refactor

**Before:**
```tsx
<button className="px-4 py-2 text-lg bg-blue-500 rounded-lg">
  Click Me
</button>
```

**After:**
```tsx
<button className="button-md bg-primary text-body-md rounded-md">
  Click Me
</button>
```

---

## 4. Example: Copy Block Refactor

**Before:**
```tsx
<div className="p-8 bg-white">
  <h2 className="text-3xl">Coming Soon</h2>
  <p className="text-gray-600 text-base">Stay tuned...</p>
</div>
```

**After:**
```tsx
<div className="p-spacing-xl bg-surface-card">
  <h2 className="text-heading-h2">Coming Soon</h2>
  <p className="text-body-md text-subtle">Stay tuned...</p>
</div>
```

---

## 5. Migration Steps for Cursor AI Agent
1. Scan each component in `app/components/ui/`.
2. Identify raw Tailwind utilities (`px-4`, `text-2xl`, `bg-black`, etc.).
3. Replace them with token utilities from `tailwind-plugin.js` and `tailwind.config.js`.
4. Remove inline `<style jsx>` or raw CSS in `.module.css` if it duplicates design tokens.
5. Ensure responsive scaling works by relying on token utilities (e.g., `text-heading-h1` auto-scales via `responsive.css`).
6. Run `node scripts/auto-fix-tokens.js` on any `.css` file that still has raw px/hex values.
7. Commit once all components use token-driven utilities.

---

## ✅ Summary
- All components should use **token utilities** (`text-heading-h1`, `p-spacing-md`, `bg-primary`) instead of raw values.
- Buttons, Inputs, CopyBlocks, and layout components must map **only** to your design system classes.
- This ensures consistency, responsiveness, and passes pre-commit enforcement.
