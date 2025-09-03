# Component Design Rules

This document provides rules for creating components that match your Figma design system.

## Typography Rules

### Font Families
- **Display & Headings**: Behind The Nineties (serif)
- **Titles & Body**: Overused Grotesk (sans-serif)
- **Specifications**: Inter (sans-serif)

### Responsive Typography
Your typography scales across three breakpoints:
- **Mobile**: 390px
- **Tablet**: 810px  
- **Desktop**: 1440px

### Usage Examples
```html
<!-- Display text -->
<h1 class="text-display-display-mobile md:text-display-display-tablet lg:text-display-display-desktop">
  Large Display Text
</h1>

<!-- Heading text -->
<h2 class="text-heading-H1-mobile md:text-heading-H1-tablet lg:text-heading-H1-desktop">
  Main Heading
</h2>

<!-- Title text -->
<h3 class="text-title-xl-mobile md:text-title-xl-tablet lg:text-title-xl-desktop">
  Section Title
</h3>

<!-- Body text -->
<p class="text-body-md-mobile md:text-body-md-tablet lg:text-body-md-desktop">
  Body content
</p>
```

## Spacing Rules

### Responsive Spacing
```html
<!-- Small spacing -->
<div class="p-spacing-sm-mobile md:p-spacing-sm-tablet lg:p-spacing-sm-desktop">

<!-- Medium spacing -->
<div class="p-spacing-md-mobile md:p-spacing-md-tablet lg:p-spacing-md-desktop">

<!-- Large spacing -->
<div class="p-spacing-lg-mobile md:p-spacing-lg-tablet lg:p-spacing-lg-desktop">
```

## Component Rules

### Button Component
```html
<!-- Small Button -->
<button class="
  px-button-h-padding-sm 
  py-button-v-padding-sm 
  rounded-button-radius-sm
  bg-surface-primary-default
  text-text-neutral-display
">
  Button Text
</button>

<!-- Large Button -->
<button class="
  px-button-h-padding-lg 
  py-button-v-padding-lg 
  rounded-button-radius-lg
  bg-surface-primary-default
  text-text-neutral-display
">
  Button Text
</button>
```

### Chip Component
```html
<div class="
  px-chip-h-padding-md 
  py-chip-v-padding-md 
  rounded-chip-radius-md
  border-chip-border-width-md
  border-border-neutral-dark
">
  Chip Content
</div>
```

## Color Usage

### Semantic Colors
- `bg-surface-neutral-page` - Page background
- `bg-surface-neutral-card` - Card background
- `bg-surface-primary-default` - Primary surface
- `bg-surface-secondary-default` - Secondary surface
- `text-text-neutral-display` - Display text
- `text-text-neutral-heading` - Heading text
- `text-text-neutral-title` - Title text
- `border-border-neutral-dark` - Dark borders

## Figma MCP Integration

When using the Figma MCP server to inspect components:

1. **Get component data** from Figma
2. **Match typography** using responsive classes
3. **Apply spacing** using responsive spacing classes
4. **Use semantic colors** for consistent theming
5. **Reference component tokens** for specific measurements

## Best Practices

1. **Always use responsive classes** for typography and spacing
2. **Prefer semantic colors** over raw color values
3. **Use component utilities** for consistent component styling
4. **Test across all breakpoints** to ensure responsive behavior
5. **Reference this rules file** when creating new components
