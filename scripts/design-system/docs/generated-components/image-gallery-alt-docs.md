# Image Gallery Alt Component

## Overview
This component was generated from Figma design specifications and uses only design system tokens.

## Figma Source
- **Node ID**: 827:25127
- **Name**: Image Gallery
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
<button class="image-gallery-alt">
    Image Gallery Alt
</button>
```

## Variants

```html
<button class="image-gallery-alt image-gallery-alt--primary">Primary</button>
<button class="image-gallery-alt image-gallery-alt--secondary">Secondary</button>
```

## Sizes

```html
<button class="image-gallery-alt image-gallery-alt--sm">Small</button>
<button class="image-gallery-alt image-gallery-alt--md">Medium</button>
<button class="image-gallery-alt image-gallery-alt--lg">Large</button>
<button class="image-gallery-alt image-gallery-alt--xl">Extra Large</button>
```

## Accessibility Features
- Focus states with visible outline
- Proper contrast ratios (WCAG 2.1 AA)
- Semantic HTML structure
- ARIA labels for icon-only buttons
- Keyboard navigation support

## Generated Files
- `image gallery alt-demo.html` - Interactive demo
- `image gallery alt.css` - Component styles
- `image gallery alt-test.html` - Test file
- `image gallery alt-docs.md` - This documentation

## Safety Notes
- ✅ No core design system files were modified
- ✅ All files generated in /examples/ directory
- ✅ Uses existing design system tokens only
- ✅ No hardcoded values or new token creation
