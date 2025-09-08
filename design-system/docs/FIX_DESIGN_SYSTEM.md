# Design System Fix Plan – bendy-bethc-new-design-system

This guide will bring the design system into full compliance with your enforcement rules.  
Goal: **no raw px or hex values** in CSS/JS, only tokens (`var(--ds-...)`).

## 1. Tokens = Single Source of Truth
- Tokens are defined in `tokens/` and `variables/` (`Primitives`, `Semantic`, `Responsive`, `Components`).
- These JSON files are the **only place** where raw values (like `60px`, `#1234AB`) are allowed.
- All other layers (`responsive.css`, `tailwind.config.js`, `tailwind-plugin.js`, and components) must reference these tokens.

## 2. Fix `design-system/css/responsive.css`
- Current file contains raw px values like:
  ```css
  --font-size-heading-h1-mobile: 48px;
  ```
- Must be replaced with token references:
  ```css
  --font-size-heading-h1-mobile: var(--ds-heading-h1-mobile);
  ```
- Do this for **all breakpoints** (mobile, tablet, desktop).
- Use `Responsive-mobile.json`, `Responsive-tablet.json`, and `Responsive-desktop.json` to find the correct token names.
- Command:
  ```bash
  node scripts/auto-fix-tokens.js design-system/css/responsive.css
  ```

## 3. Fix `tailwind.config.js`
- All theme values should reference tokens:
  - Colors:  
    ✅ `surface: { card: "var(--ds-surface-card)" }`  
    ❌ `surface: { card: "#FFFFFF" }`
  - Spacing:  
    ✅ `spacing: { md: "var(--ds-spacing-md)" }`  
    ❌ `spacing: { md: "16px" }`
  - Typography:  
    ✅ `"heading-h1": ["var(--ds-heading-h1)", { lineHeight: "var(--ds-heading-h1-line)" }]`  
    ❌ `"heading-h1": ["60px", { lineHeight: "72px" }]`
- Command:
  ```bash
  node scripts/auto-fix-tokens.js tailwind.config.js
  ```

## 4. Fix `design-system/tailwind-plugin.js`
- Utilities must map classes → tokens only.
- Example for buttons:
  - ✅
    ```css
    .button-md {
      padding: var(--ds-button-v) var(--ds-button-h);
      border-radius: var(--ds-button-radius);
      font-size: var(--ds-body-md);
    }
    ```
  - ❌
    ```css
    .button-md {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
    }
    ```
- Command:
  ```bash
  node scripts/auto-fix-tokens.js design-system/tailwind-plugin.js
  ```

## 5. Clean Component CSS
- Example: `app/components/ui/ComingSoonCopyBlock.module.css` still uses raw px values.
- Replace them:
  - ✅ `margin: var(--ds-spacing-lg);`  
  - ❌ `margin: 24px;`
- Command:
  ```bash
  node scripts/auto-fix-tokens.js app/components/ui/ComingSoonCopyBlock.module.css
  ```

## 6. Verify Enforcement
1. Stage and commit:
   ```bash
   git add .
   git commit -m "migrate design system to token-pure implementation"
   ```
2. If violations remain, the pre-commit logs will point to exact files/lines.
3. Fix manually or re-run auto-fix on those files.

## 7. Lock in Workflow
- **Never** write px/hex directly in CSS or JS.
- Always update tokens in `tokens/` → regenerate outputs.
- Utilities in Tailwind (`text-heading-h1`, `p-spacing-md`, `button-md`) are the **only classes** used in components.
- Add examples to `DESIGN_SYSTEM_ENFORCEMENT.md`:

  ```md
  ✅ Correct
  <h1 class="text-heading-h1">Hello</h1>
  <button class="button-md bg-primary">Click</button>

  ❌ Incorrect
  <h1 class="text-6xl">Hello</h1>
  <button style="padding: 16px">Click</button>
  ```

## ✅ Summary
1. Run auto-fix on `responsive.css`, `tailwind.config.js`, `tailwind-plugin.js`, and any flagged component CSS.  
2. Replace all px/hex with `var(--ds-...)`.  
3. Commit again.  
4. From now on: **tokens only** → enforcement passes → consistent design system.
