# 🎨 Figma-to-Code Workflow Guide

> **The definitive guide for translating Figma designs into accurate, responsive code using our design system.**

---

## 🎯 Workflow Overview

This workflow ensures 100% accuracy between Figma specifications and final code implementation through systematic token mapping and validation.

### Core Principles
1. **Token-First Approach**: Always use design system tokens, never hardcoded values
2. **Responsive by Default**: All typography and spacing must scale across breakpoints  
3. **Figma Spec Validation**: Every component must match its Figma specification exactly
4. **Systematic Process**: Follow the workflow steps in order for consistent results

---

## 📋 Step-by-Step Workflow

### Step 1: Figma Analysis
**Extract precise specifications from Figma component**

```bash
# Use Figma MCP to get component details
node scripts/extract-figma-component-details.ts <FIGMA_NODE_ID>
```

**Key Information to Capture:**
- **Typography Style**: (e.g., `title/title-xs/medium`)
- **Font Size**: Exact pixel values across breakpoints
- **Font Weight**: Numerical value (400, 500, 600, etc.)
- **Line Height**: Pixel values for responsive scaling
- **Colors**: Surface, text, border values
- **Spacing**: Padding, margins, gaps
- **Component States**: Default, hover, selected, disabled

### Step 2: Token Mapping
**Map Figma values to design system tokens**

#### 📝 Typography Mapping Reference

| Figma Style | Font Size | CSS Token | Line Height Token |
|-------------|-----------|-----------|-------------------|
| `title/title-xs/regular` | 18px→24px | `var(--font-size-title-xs)` | `var(--line-height-title-xs)` |
| `title/title-xs/medium` | 18px→24px | `var(--font-size-title-xs)` | `var(--line-height-title-xs)` |
| `title/title-sm/medium` | 20px | `var(--font-size-title-sm)` | `var(--line-height-title-sm)` |
| `title/title-md/medium` | 24px→36px | `var(--font-size-title-md)` | `var(--line-height-title-md)` |
| `body/body-sm/regular` | 12px | `var(--font-size-body-sm)` | `var(--line-height-body-sm)` |
| `body/body-md/regular` | 14px | `var(--font-size-body-md)` | `var(--line-height-body-md)` |

#### 🎨 Color Mapping Reference

| Figma Variable | CSS Token | Usage |
|----------------|-----------|--------|
| `Surface/Primary/default` | `var(--surface-primary-default)` | Primary buttons, highlights |
| `Surface/Neutral/card` | `var(--surface-neutral-card)` | Card backgrounds |
| `Text/Neutral/heading` | `var(--text-neutral-heading)` | Headings, important text |
| `Text/Neutral/body` | `var(--text-neutral-body)` | Body text, descriptions |

#### 📏 Spacing Mapping Reference

| Figma Value | CSS Token | Usage |
|-------------|-----------|--------|
| 4px | `var(--spacing-xs)` | Tight spacing |
| 8px | `var(--spacing-sm)` | Small gaps |
| 16px | `var(--spacing-md)` | Standard spacing |
| 24px | `var(--spacing-lg)` | Large gaps |
| 48px | `var(--spacing-xl)` | Section spacing |

### Step 3: Implementation
**Write code using mapped tokens**

#### ✅ Correct Implementation Example
```css
.menu-item {
  /* Typography - Responsive tokens */
  font-family: var(--font-title);
  font-size: var(--font-size-title-xs);    /* 18px mobile → 24px desktop */
  line-height: var(--line-height-title-xs); /* 24px mobile → 32px desktop */
  font-weight: 500;
  
  /* Colors - Semantic tokens */
  color: var(--text-neutral-heading);
  background: var(--surface-neutral-card);
  
  /* Spacing - System tokens */
  padding: var(--spacing-sm) var(--spacing-md);
  
  /* States */
  &:hover {
    background: var(--surface-primary-hover);
  }
}
```

#### ❌ Incorrect Implementation (Never Do This)
```css
.menu-item {
  font-size: 24px;                    /* ❌ Hardcoded - not responsive */
  line-height: 32px;                  /* ❌ Hardcoded - not responsive */
  color: #3e4040;                     /* ❌ Hardcoded color */
  padding: 8px 16px;                  /* ❌ Hardcoded spacing */
}
```

### Step 4: Validation
**Ensure implementation matches Figma specifications**

```bash
# Run automated validation
node scripts/audit-and-fix-typography.js

# Check specific component
node scripts/validate-figma-implementation.js <COMPONENT_PATH> <FIGMA_NODE_ID>
```

**Validation Checklist:**
- [ ] Typography uses responsive tokens (not hardcoded px values)
- [ ] Colors match Figma semantic tokens
- [ ] Spacing uses system tokens
- [ ] Component states are implemented
- [ ] Responsive behavior works across breakpoints
- [ ] No hardcoded values in final code

---

## 🔍 Common Mapping Patterns

### Pattern 1: Typography Components
**For any text element in Figma:**

1. **Identify Style**: `title/title-xs/medium`
2. **Map Font Size**: `var(--font-size-title-xs)` 
3. **Map Line Height**: `var(--line-height-title-xs)`
4. **Map Weight**: `500` (medium)
5. **Map Family**: `var(--font-title)` for titles, `var(--font-body)` for body

### Pattern 2: Interactive Components  
**For buttons, links, menu items:**

1. **Base State**: Default colors and spacing
2. **Hover State**: `*-hover` token variants
3. **Active/Selected**: `*-pressed` or `*-selected` variants
4. **Disabled State**: `*-disabled` token variants

### Pattern 3: Layout Components
**For containers, cards, sections:**

1. **Background**: Use `surface-*` tokens
2. **Borders**: Use `border-*` tokens  
3. **Spacing**: Use `spacing-*` tokens
4. **Responsive**: Reference breakpoint-specific tokens

---

## 🛠 Automated Tools

### Design System Matcher (Fixed)
**Location**: `scripts/modules/design-system-matcher.js`

**Key Functions:**
- `findMatchingFontSizeToken(fontSize)` - Maps px values to tokens
- `findMatchingLineHeightToken(lineHeight)` - Maps line heights
- `matchTypography(figmaData)` - Complete typography mapping

### Typography Auditor
**Location**: `scripts/audit-and-fix-typography.js`

**Features:**
- Scans all components for hardcoded values
- Automatically fixes common issues
- Validates against Figma specifications
- Generates detailed reports

### Component Generator (Enhanced)
**Location**: `scripts/modules/component-generator.js`

**Ensures:**
- All components use tokens by default
- Responsive implementation
- State variant support
- Figma specification compliance

---

## 📊 Quality Gates

### Pre-Development Checklist
- [ ] Figma component analyzed with MCP tools
- [ ] All typography styles identified and mapped
- [ ] Color tokens identified from Figma variables
- [ ] Spacing values mapped to system tokens
- [ ] Component states documented

### Pre-Commit Validation
- [ ] `node scripts/audit-and-fix-typography.js` passes
- [ ] No hardcoded px, hex, or rem values
- [ ] All tokens exist in design system  
- [ ] Responsive behavior verified
- [ ] Figma specification match confirmed

### Post-Implementation Review
- [ ] Visual comparison with Figma
- [ ] Cross-browser responsive testing
- [ ] All component states functional
- [ ] Performance impact assessed
- [ ] Documentation updated

---

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: Wrong Font Size Token
**Issue**: Using `var(--font-title-md)` (36px) for menu items
**Solution**: Use `var(--font-size-title-xs)` (18px→24px responsive)

### Pitfall 2: Hardcoded Line Heights
**Issue**: `line-height: 1.33` or `line-height: 32px`
**Solution**: Use `var(--line-height-title-xs)` for responsive scaling

### Pitfall 3: Non-Responsive Classes
**Issue**: `.font-title-xs-medium { font-size: 24px; }`
**Solution**: `.font-title-xs-medium { font-size: var(--font-size-title-xs); }`

### Pitfall 4: Color Mismatches
**Issue**: Using `#f0f081` instead of semantic tokens
**Solution**: Use `var(--surface-primary-default)` for context-aware theming

---

## 📚 Reference Files

### Token Source Files
- `variables/textStyles.json` - Figma typography specifications
- `design-system/css/responsive.css` - Responsive token definitions
- `design-system/src/complete-design-system.css` - All design tokens

### Workflow Scripts
- `scripts/modules/design-system-matcher.js` - Token mapping logic
- `scripts/audit-and-fix-typography.js` - Component validation
- `scripts/figma-component-automation.js` - End-to-end automation

### Component Examples
- `design-system/examples/menu-item-complete.html` - Correct implementation
- `design-system/pages/homepage.html` - Real usage example

---

## 🎯 Success Metrics

**100% Figma Accuracy**: Every component matches its Figma specification exactly

**0 Hardcoded Values**: All implementations use design system tokens

**Responsive by Default**: All typography scales properly across breakpoints

**Automated Validation**: Quality gates prevent specification drift

**Developer Efficiency**: Clear workflow reduces implementation time

---

*This workflow ensures consistent, accurate, and maintainable code that perfectly reflects your Figma designs.*