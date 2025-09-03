# Complete Design System

## Generated from Figma Tokens

This design system was automatically generated from your Figma design tokens.

## 📁 Folder Structure

- **`src/`** → Core system files (import these in projects)
  - `complete-design-system.css` - Complete CSS with semantic tokens and components
  - `globals.css` - Global styles and utilities
  - `tailwind.config.js` - Tailwind configuration
  - `preset.cjs` - Tailwind preset
  - `fonts/` - Font files and typography assets

- **`examples/`** → Demo and test pages
  - `test-buttons.html` - Button component test page
  - `test-cards.html` - Card component test page
  - `examples.html` - General examples
  - `examples-icon-button.html` - Icon button examples

- **`docs/`** → Documentation and guides

- **`rules/`** → Component rules and specifications

### Token Structure:
- **Semantic Tokens**: 4 categories loaded
- **Component Specs**: 4 sizes loaded  

### Usage:

#### Buttons:
```html
<button class="btn-md" style="background: var(--surface-primary-default);">Button</button>
<button class="btn-icon-lg" style="background: var(--surface-success-default);">⚡</button>
```

#### Cards:
```html
<div class="feature-card">
    <h3 class="card-title font-titletitle-xsmedium">Title</h3>
    <p class="card-description font-bodybody-smregular">Description</p>
</div>
```

### To Regenerate:
```bash
npm run build-design-system
```
