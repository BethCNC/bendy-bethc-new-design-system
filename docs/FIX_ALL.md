# Cursor AI Agent Prompt – Fix Design System & Components

You are working inside the repo **`bendy-bethc-new-design-system`**.  
Your task is to **bring the codebase into full compliance with the design system rules**.  

---

## 🎯 Goals
1. **Single Source of Truth**  
   - All raw values (px, rem, hex) live only in JSON token files under `variables/` and `tokens/`.
   - Everywhere else (CSS, Tailwind, components) must use token references only.

2. **Token Purity**  
   - Replace all raw px, rem, and hex values with `var(--ds-*)` references or token-based Tailwind utilities.
   - Never use default Tailwind values like `text-2xl`, `p-4`, `bg-gray-200`.

3. **Final System**  
   - Tokens (JSON) → CSS vars (`responsive.css`) → Tailwind config/plugin → Components.  
   - Developers only use **Tailwind utilities** that map to tokens.  
   - Pre-commit hook must pass with no violations.

---

## 🔍 Files to Fix

### 1. `design-system/css/responsive.css`
- Remove any raw px or rem values.  
- Replace them with `var(--ds-*)` references from JSON tokens.  
- Ensure mobile-first overrides (`mobile → tablet → desktop`).  
- Example:  
  - ❌ `--font-size-heading-h1: 48px;`  
  - ✅ `--font-size-heading-h1: var(--ds-heading-h1-mobile);`

### 2. `tailwind.config.js`
- Audit all theme values.  
- Replace raw values with token references.  
- Colors → `var(--ds-*)` (e.g., `bg-primary`, `bg-surface-card`).  
- Typography → `text-heading-h1`, `text-body-md` mapped to token vars.  
- Spacing → `p-spacing-md`, `gap-spacing-lg`.

### 3. `design-system/tailwind-plugin.js`
- Utilities must use only tokens, never px.  
- Example:  
  - ❌  
    ```css
    .button-md { padding: 8px 16px; font-size: 14px; }
    ```  
  - ✅  
    ```css
    .button-md { padding: var(--ds-button-padding); font-size: var(--ds-body-md); }
    ```

### 4. Components in `app/components/ui/`
- Replace all raw Tailwind classes with token utilities.  
- Replace `.module.css` rules that use px with token references.  
- Examples:  

**Button.tsx**  
- ❌ `<button className="px-4 py-2 text-lg bg-blue-500 rounded-lg">`  
- ✅ `<button className="button-md bg-primary text-body-md rounded-md">`

**Header.tsx**  
- ❌ `p-lg z-100 text-3xl`  
- ✅ `px-spacing-3xl py-spacing-xl z-overlay text-heading-h2`

**CopyBlock.module.css**  
- ❌ `margin: 24px; font-size: 16px;`  
- ✅ `margin: var(--ds-spacing-lg); font-size: var(--ds-body-md);`

---

## ✅ Rules to Enforce
- **Typography**  
  - Use `text-heading-h1`, `text-heading-h2`, `text-body-md`, etc.  
  - Never use `text-2xl`, `text-lg`, etc.

- **Spacing**  
  - Use `p-spacing-md`, `m-spacing-lg`, `gap-spacing-sm`.  
  - Never use `p-4`, `m-8`, `gap-6`.

- **Colors**  
  - Use `bg-primary`, `bg-surface-card`, `text-heading`, `text-subtle`.  
  - Never use `bg-black`, `bg-white`, `text-gray-600`.

- **Z-index**  
  - Define tokens (`z-overlay`, `z-behind`) and use them.  
  - Never use `z-100`.

---

## 🚀 Task
1. Go through each of these files:  
   - `design-system/css/responsive.css`  
   - `tailwind.config.js`  
   - `design-system/tailwind-plugin.js`  
   - Every file under `app/components/ui/`  

2. Fix them to use token-based utilities only.  
3. Remove all raw px/rem/hex values and disallowed Tailwind classes.  
4. Ensure pre-commit hook passes with **zero violations**.  
5. Keep accessibility and responsiveness intact.

---

## 🔒 Constraints
- Do not change tokens in `variables/` or `tokens/`.  
- Do not remove enforcement rules — they must remain strict.  
- The final codebase must be 100% token-driven and Tailwind-utility-based.  
