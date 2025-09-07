# 🛡️ Design System Rules Enforcement

This document explains the automated enforcement system that ensures all code follows the design system rules defined in `.cursor/rules/`.

## 📋 Overview

The enforcement system prevents hardcoded values and ensures consistent use of design system tokens across the entire codebase.

## 🚫 Violations Detected

### 1. Hardcoded Colors
❌ **Wrong**: `color: #1234AB;`  
✅ **Correct**: `color: var(--surface-primary-default);`

### 2. Hardcoded Spacing
❌ **Wrong**: `padding: 16px;`  
✅ **Correct**: `padding: var(--spacing-md);`

### 3. Hardcoded Typography
❌ **Wrong**: `font-size: 24px;`  
✅ **Correct**: `font-size: var(--font-title-md);`

### 4. Hardcoded Borders
❌ **Wrong**: `border-radius: 8px;`  
✅ **Correct**: `border-radius: var(--radius-md);`

## 🔧 Tools Available

### 1. Enforcement Script
Scans files for violations:
```bash
node scripts/enforce-design-system.js design-system/
```

### 2. Auto-fix Script  
Automatically fixes common violations:
```bash
node scripts/auto-fix-tokens.js design-system/pages/homepage.html
```

### 3. NPM Scripts
```bash
cd scripts/
npm run lint:design-system    # Check for violations
npm run fix:design-system     # Auto-fix violations  
npm run check:compliance      # Full compliance check
```

## 🔒 Enforcement Points

### 1. Pre-commit Hook
- **Location**: `.git/hooks/pre-commit`
- **Triggers**: Before each git commit
- **Action**: Blocks commits with design system violations

### 2. CI/CD Integration (Recommended)
Add to your CI/CD pipeline:
```yaml
- name: Check Design System Compliance
  run: |
    cd scripts
    npm install
    npm run check:compliance
```

### 3. Editor Integration
The `.cursor/rules/` files provide real-time guidance in compatible editors.

## 🎯 Available Design System Tokens

### Colors
```css
/* Surface tokens */
var(--surface-primary-default)
var(--surface-neutral-card)
var(--surface-warning-subtle)

/* Text tokens */  
var(--text-neutral-heading)
var(--text-neutral-body)
var(--text-neutral-disabled)

/* Border tokens */
var(--border-neutral-dark)
var(--border-neutral-default)
```

### Typography
```css
/* Font families */
var(--font-display)         /* Behind The Nineties */
var(--font-title)          /* Overused Grotesk */
var(--font-body)           /* Overused Grotesk */

/* Font sizes */
var(--font-display-display)  /* Large display text */
var(--font-heading-H1)       /* Main headings */
var(--font-title-xl)         /* Extra large titles */
var(--font-title-lg)         /* Large titles */
var(--font-title-md)         /* Medium titles */
var(--font-body-xl)          /* Large body text */
var(--font-body-md)          /* Medium body text */
```

### Spacing
```css
var(--spacing-sm)    /* 12px */
var(--spacing-md)    /* 24px */  
var(--spacing-lg)    /* 48px */
var(--spacing-xl)    /* 64px */
var(--spacing-2xl)   /* 96px */
```

### Responsive Spacing
```css
/* Automatically adapts across breakpoints */
var(--spacing-sm-mobile)   /* 8px on mobile */
var(--spacing-lg-tablet)   /* 32px on tablet */
```

### Border Radius
```css
var(--radius-sm)     /* 4px */
var(--radius-md)     /* 8px */
```

## 📊 Compliance Report

After running the enforcement script, you'll get a detailed report:

```
📊 DESIGN SYSTEM COMPLIANCE REPORT
================================================================================
📁 Files scanned: 1
🚫 Total violations: 25

📋 VIOLATIONS BY FILE:
🔴 design-system/pages/homepage.html (25 violations)
   Line 46: font-size: 128px
   🚫 Hardcoded font-size found. Use design system typography classes or tokens

📈 VIOLATIONS BY RULE TYPE:
   hardcodedSpacing: 22
   hardcodedFontSize: 1
   hardcodedBorder: 2
```

## 🚀 Quick Fixes

### Common Auto-fixes Applied:
- `font-size: 24px` → `font-size: var(--font-title-md)`  
- `padding: 16px` → `padding: var(--spacing-md)`
- `border-radius: 8px` → `border-radius: var(--radius-md)`
- `#252626` → `var(--border-neutral-dark)`

## 🎯 Workflow Integration

### For Developers:
1. Write code using design system tokens
2. Pre-commit hook catches violations automatically  
3. Fix violations using auto-fix script or manually
4. Commit passes once compliant

### For CI/CD:
1. Pull request triggers compliance check
2. Build fails if violations found
3. Developer fixes violations
4. Build passes once compliant

## 📚 Rules Reference

All rules are documented in `.cursor/rules/`:
- `no-hardcoding.mdc` - Core hardcoding prevention
- `design-system.mdc` - Token usage guidelines  
- `tokens-rules.mdc` - Semantic token requirements
- `typography-rules.mdc` - Typography standards
- `responsive-rules.mdc` - Responsive design patterns

## 🆘 Troubleshooting

### Build Failing Due to Violations?
1. Run: `node scripts/enforce-design-system.js design-system/`
2. Review violations in the output
3. Run: `node scripts/auto-fix-tokens.js <file-path>` 
4. Manually fix remaining violations
5. Test and commit

### Pre-commit Hook Not Working?
1. Check if hook is executable: `ls -la .git/hooks/pre-commit`
2. Make executable: `chmod +x .git/hooks/pre-commit`
3. Test manually: `.git/hooks/pre-commit`

### Need to Add New Tokens?
1. Add tokens to `design-system/src/complete-design-system.css`
2. Update `scripts/auto-fix-tokens.js` with new mappings
3. Update this documentation

## ✅ Success Metrics

With this enforcement system:
- **0 hardcoded values** in production code
- **100% design system token usage** 
- **Consistent visual design** across all components
- **Automatic compliance** through automation
- **Developer productivity** through auto-fixing

This system ensures the design system rules are **always followed** and **automatically enforced**! 🎉