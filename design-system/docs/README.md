# Complete Design System Documentation

This design system was generated from your Figma tokens and includes responsive typography, spacing, and component tokens.

## Structure

### Colors
- **Primitives**: Base color tokens with light/dark variants
- **Semantic**: Contextual colors (surface, text, border)
- **Alias**: Mapped color references

### Typography
- **Responsive**: Font sizes and line heights per breakpoint
- **Font Families**: Behind The Nineties, Overused Grotesk, Inter
- **Categories**: Display, Heading, Title, Body

### Spacing
- **Responsive**: Spacing values per breakpoint
- **Layout**: Margins, gutters, padding

### Components
- **Button**: H-Padding, V-Padding, Radius, Icon Size
- **Chip**: H-Padding, V-Padding, Radius, Border Width

## Breakpoints

- **Mobile**: 390px
- **Tablet**: 810px
- **Desktop**: 1440px

## Files

- `globals.css` - Typography utilities
- `css/design-system.css` - Color variables
- `css/responsive.css` - Responsive variables
- `js/tailwind-plugin.js` - Semantic utilities
- `tailwind.config.js` - Tailwind configuration
- `rules/component-rules.md` - Component creation rules

## Usage

1. Include CSS files in your project
2. Use Tailwind config for responsive design
3. Follow component rules for consistent styling
4. Use Figma MCP server for component inspection
