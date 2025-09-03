# Complete Design System

## Generated from Figma Tokens

This design system was automatically generated from your Figma design tokens.

### Files Generated:
- complete-design-system.css - Complete CSS with semantic tokens and components  
- test-buttons.html - Button component test page
- test-cards.html - Card component test page

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
