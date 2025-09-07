# Favicon Component

## Overview
This component was generated from Figma design specifications and uses only design system tokens.

## Figma Source
- **Node ID**: 1534:1697
- **Name**: Favicon
- **Type**: COMPONENT

## Design System Compliance
✅ **Token-Only Styling**: All styles use design system tokens
✅ **No Hardcoded Values**: No hex colors, pixel values, or font names
✅ **Accessibility**: Focus states, contrast ratios, ARIA labels
✅ **Responsive**: Uses responsive typography tokens
✅ **States**: Default, hover, active, focus, disabled

## Token Mapping

### Colors
- **Background**: var(--surface-primary-default)
- **Text**: var(--text-neutral-body)
- **Hover**: var(--surface-primary-hover)
- **Active**: var(--surface-primary-pressed)
- **Disabled**: surface-primary-disabled

### Typography
- **Font Family**: font-body
- **Font Size**: var(--font-body-sm-mobile)
- **Font Weight**: var(--font-weight-medium)
- **Line Height**: 1.5

### Spacing
- **Padding**: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) var(--spacing-md)
- **Gap**: var(--spacing-sm)

### Borders
- **Radius**: var(--radius-md)

## Usage

```html
<button class="favicon">
    Favicon
</button>
```

## Variants

```html
<button class="favicon favicon--primary">Primary</button>
<button class="favicon favicon--secondary">Secondary</button>
```

## Sizes

```html
<button class="favicon favicon--sm">Small</button>
<button class="favicon favicon--md">Medium</button>
<button class="favicon favicon--lg">Large</button>
<button class="favicon favicon--xl">Extra Large</button>
```

## Accessibility Features
- Focus states with visible outline
- Proper contrast ratios (WCAG 2.1 AA)
- Semantic HTML structure
- ARIA labels for icon-only buttons
- Keyboard navigation support

## Generated Files
- `favicon-demo.html` - Interactive demo
- `favicon.css` - Component styles
- `favicon-test.html` - Test file
- `favicon-docs.md` - This documentation

## Safety Notes
- ✅ No core design system files were modified
- ✅ All files generated in /examples/ directory
- ✅ Uses existing design system tokens only
- ✅ No hardcoded values or new token creation
