# 🎨 Design Token Mapping Reference

*Auto-generated reference for mapping Figma variables to design system tokens*

---

## 📝 Typography Mapping

### Complete Typography Token Reference

| Figma Style | Font Size | Font Size Token | Line Height Token | Weight | Usage |
|-------------|-----------|-----------------|-------------------|--------|-------|
| `title/title-xs/regular` | 18px mobile → 24px desktop | `var(--font-size-title-xs)` | `var(--line-height-title-xs)` | 400 | Small titles, large body text |
| `title/title-xs/medium` | 18px mobile → 24px desktop | `var(--font-size-title-xs)` | `var(--line-height-title-xs)` | 500 | Menu items, emphasized titles |
| `title/title-sm/medium` | 20px | `var(--font-size-title-sm)` | `var(--line-height-title-sm)` | 500 | Medium titles, section headers |
| `title/title-md/medium` | 24px mobile → 36px desktop | `var(--font-size-title-md)` | `var(--line-height-title-md)` | 500 | Large titles, page headers |
| `body/body-sm/regular` | 12px | `var(--font-size-body-sm)` | `var(--line-height-body-sm)` | 400 | Small text, captions |
| `body/body-md/regular` | 14px | `var(--font-size-body-md)` | `var(--line-height-body-md)` | 400 | Standard body text |


### Font Family Mapping
| Figma Font Family | CSS Token | Usage Context |
|------------------|-----------|---------------|
| "Overused Grotesk" (Body) | `var(--font-body)` | Body text, small titles |
| "Overused Grotesk" (Title) | `var(--font-title)` | Titles, headings, menu items |
| "Behind The Nineties" | `var(--font-heading)` | Large headings, display text |

### Font Weight Mapping
| Figma Weight | Numeric Value | CSS Usage |
|-------------|---------------|-----------|
| Regular | 400 | Standard body text |
| Medium | 500 | Emphasized text, menu items |
| Semibold | 600 | Important headings |
| Bold | 700 | Strong emphasis |

---

## 🎨 Color Mapping

| Figma Variable | Hex Value | CSS Token | Usage |
|----------------|-----------|-----------|-------|
| `Surface/Primary/default` | #f0f081 | `var(--surface-primary-default)` | Primary buttons, highlights |
| `Surface/Neutral/card` | #f1f2f2 | `var(--surface-neutral-card)` | Card backgrounds, menu items |
| `Text/Neutral/heading` | #252626 | `var(--text-neutral-heading)` | Headings, menu text |
| `Text/Neutral/body` | #3e4040 | `var(--text-neutral-body)` | Body text, descriptions |
| `Border/Neutral/dark` | #252626 | `var(--border-neutral-dark)` | Component borders |


---

## 📏 Spacing & Layout Mapping

| Figma Value | CSS Token | Usage |
|-------------|-----------|-------|
| 4px | `var(--spacing-xs)` | Tight spacing, small gaps |
| 8px | `var(--spacing-sm)` | Small padding, minor gaps |
| 16px | `var(--spacing-md)` | Standard spacing, component padding |
| 24px | `var(--spacing-lg)` | Large gaps, section spacing |
| 48px | `var(--spacing-xl)` | Major section spacing |
| 1px | `var(--border-width-sm)` | Thin borders |
| 2px | `var(--border-width-md)` | Standard borders |
| 4px | `var(--border-width-lg)` | Thick borders |


---

## 📱 Responsive Token Mapping

| Breakpoint | Width | Font Scale | Spacing Scale |
|------------|-------|------------|---------------|
| Mobile | 390px+ | Base sizes | Base spacing |
| Tablet | 810px+ | +0px (same) | +0px (same) |
| Desktop | 1440px+ | +6px average | +0px (same) |

### Responsive Typography Examples
| Token | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `--font-size-title-xs` | 18px | 18px | 24px |
| `--line-height-title-xs` | 24px | 24px | 32px |
| `--font-size-title-md` | 24px | 30px | 36px |
| `--line-height-title-md` | 32px | 32px | 44px |

---

## 🔧 Implementation Examples

### Example 1: Menu Item (Figma: title/title-xs/medium)
```css
.menu-item {
  /* Typography */
  font-family: var(--font-title);
  font-size: var(--font-size-title-xs);      /* 18px mobile → 24px desktop */
  line-height: var(--line-height-title-xs);  /* 24px mobile → 32px desktop */
  font-weight: 500;                          /* medium */
  
  /* Colors */
  color: var(--text-neutral-heading);
  background: var(--surface-neutral-card);
  
  /* Spacing */
  padding: var(--spacing-sm) var(--spacing-md);
  
  /* States */
  &:hover {
    background: var(--surface-primary-hover);
  }
}
```

### Example 2: Body Text (Figma: body/body-md/regular)
```css
.body-text {
  font-family: var(--font-body);
  font-size: var(--font-size-body-md);
  line-height: var(--line-height-body-md);
  font-weight: 400;
  color: var(--text-neutral-body);
}
```

---

## ⚡ Quick Reference Commands

```bash
# Validate component against Figma spec
node scripts/validate-figma-implementation.js <component-path> <figma-node-id>

# Audit and fix typography issues
node scripts/audit-and-fix-typography.js

# Regenerate this mapping guide
node scripts/generate-token-mapping-guide.js
```

---

*Last generated: 2025-09-05T21:45:38.018Z*
*Source: Figma variables and design system tokens*