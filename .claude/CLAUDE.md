# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Figma-generated design system** that converts design tokens from Figma into a complete CSS/Tailwind-based design system. The project focuses on automated token generation and semantic design patterns rather than traditional build processes.

## Architecture

### Core Structure
- `/variables/` - 13 JSON token files exported from Figma containing primitives, semantic mappings, breakpoints, and component specifications
- `/design-system/src/` - Generated CSS design system (1,139 lines in `complete-design-system.css`)
- `/design-system/js/tailwind-plugin.js` - Custom Tailwind plugin with semantic utilities
- `/design-system/examples/` - 5 HTML demo pages for testing components
- `/public/` - Static assets (fonts, images, videos, logos)

### Token System
The design system uses a sophisticated token architecture:
- **Responsive breakpoints**: Mobile (390px), Tablet (810px), Desktop (1440px)
- **Semantic color tokens**: surface, text, border variants with state variations (hover, disabled, focus)
- **Component sizing**: SM, MD, LG, XL variants across all components
- **Typography system**: 3 font families with semantic classes (`.text-display`, `.text-heading-h1`, `.text-body-*`)

## Development Commands

### Design System Generation
```bash
npm run build-design-system
```
Regenerates the design system from Figma tokens (requires Figma API access configured in `.env`)

### Local Development
This project has no traditional build system. To work with examples:
```bash
# Serve the design-system directory statically
python -m http.server 8000
# Or use any static file server
npx serve design-system
```

Navigate to `/examples/index.html` for the demo navigation hub.

## Key Files

### Core System Files
- `design-system/src/complete-design-system.css` - Main generated CSS with all semantic tokens
- `design-system/src/tailwind.config.js` - Comprehensive Tailwind configuration
- `design-system/js/tailwind-plugin.js` - Custom utilities for typography and semantic classes
- `design-system/src/globals.css` - Global styles and utilities

### Configuration & Documentation
- `design-system/rules/component-rules.md` - Component creation guidelines
- `variables/*.json` - Figma-exported design tokens (do not edit manually)
- `.env` - Contains Figma API keys and other service configurations

## Design System Patterns

### Token Structure
- **Semantic Tokens**: 4 categories loaded from Figma
- **Component Specs**: 4 sizes (SM/MD/LG/XL) loaded
- **CSS Custom Properties**: Use `var(--surface-primary-default)` syntax

### Component Usage Examples

#### Buttons
```html
<button class="btn-md" style="background: var(--surface-primary-default);">Button</button>
<button class="btn-icon-lg" style="background: var(--surface-success-default);">⚡</button>
```

#### Cards
```html
<div class="feature-card">
    <h3 class="card-title font-titletitle-xsmedium">Title</h3>
    <p class="card-description font-bodybody-smregular">Description</p>
</div>
```

### Responsive Design
All components use a 3-breakpoint system with CSS custom properties that adapt across mobile/tablet/desktop. Typography and spacing scale automatically.

### Semantic Naming
The system uses semantic rather than literal names:
- Colors: `surface-primary`, `text-secondary`, `border-default`
- Typography: `text-display`, `text-heading-*`, `text-body-*`
- Components: Size variants (SM/MD/LG/XL) with consistent spacing ratios

### Component Architecture
Components are specified in `/design-system/rules/` with detailed guidelines for:
- Size variants and spacing
- State variations (default, hover, disabled, focus)
- Typography and color usage
- Responsive behavior

## Important Notes

- This is a **generated system** - do not manually edit CSS files in `/design-system/src/`
- Token changes should be made in Figma and regenerated, not edited directly in JSON files
- The system has no traditional package.json scripts or build tools
- All examples use static HTML and can be viewed by serving the `/design-system/` directory
- Repository uses Firebase for hosting (configured in `public/index.html`)

## API Integrations

The project integrates with multiple APIs (configured in `.env`):
- **Figma API** - Token extraction and component inspection
- **Firebase** - Hosting and potential backend services
- **Notion API** - Multiple databases for tracking
- Various other APIs for extended functionality