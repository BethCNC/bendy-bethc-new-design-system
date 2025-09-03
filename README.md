# 🌸 Bendy_BethC Website

A poetic, personal, and professional digital space by **Beth Cartrette** — designer, advocate, and chronically ill creative.  
This **Next.js 14** website is both a storytelling platform and a portfolio, built to showcase design system mastery, UI/UX, and frontend craft.

---

## 🎯 Project Purpose

### Core Mission
- **Reclaim narrative** — Honest, unfiltered documentation of Beth’s health journey.
- **Educate and empower** — Raise awareness about EDS, POTS, MCAS, autism, and chronic illness.
- **Showcase design leadership** — Demonstrate expertise in design systems, visual identity, and frontend development.

### Emotional Tone
- Poetic, personal, rooted in lived experience.
- Creative, clever, and visually intentional.
- Compassionate, honest, empowering.

---

## 🏗️ Technical Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router) with MD/MDX support
- **Styling**: Token-based CSS utilities from the custom design system (`tokens/index.css`)
- **Language**: TypeScript
- **Icons**: Lucide React
- **Content**: Notion (CMS) with Markdown/MDX fallback
- **Deployment**: Vercel

### Design System
- **Entry point**: `tokens/index.css`
- **Tokens**: Primitives → Aliases → Semantic → Utilities
- **Strict Token Usage**: All layout, color, spacing, and typography must use semantic tokens
- **Responsive**: Mobile-first, grid utilities from `tokens/grid.css`
- **Light/Dark Mode**: Theme switching via `data-theme` attribute
- **Typography**: Overused Grotesk + Behind The Nineties
- **Components**: Button, chips, cards, menu, footer, CTA, blog

---

## 📁 Project Structure

```
beth_health_journey_app/
├── app/                 # Next.js app router
│   ├── components/      # UI, layout, blog, and page-specific components
│   ├── api/             # API routes
│   ├── ...              # Pages (about, blog, resources, contact, etc.)
├── tokens/              # Design system (entry: index.css)
│   ├── primitives.css
│   ├── alias.css
│   ├── semantic.css
│   ├── utilities.css
│   ├── typography.css
│   ├── grid.css
│   ├── dark-mode.css
│   └── effects.css
├── styles/              # Base resets
├── content/             # MD/MDX content (fallback if Notion unavailable)
├── public/              # Static assets (images, fonts, videos)
└── ...
```

---

## 🎨 Design System Overview

- **CSS Custom Properties** for all tokens
- **Utility-first classes** (`btn btn-primary btn-md`, `text-heading-h2`, `bg-surface-neutral-card`)
- **Responsive utilities** via `grid.css` and responsive tokens
- **Accessibility-first**: semantic colors, focus management, WCAG contrast
- **Performance**: lean, tree-shakable CSS

### Example Usage
```jsx
<Button variant="primary" size="md">Primary Action</Button>

<div className="bg-surface-neutral-card p-18">
  <h3 className="text-heading-h3">Card Title</h3>
  <p className="text-body-md-regular">Card content goes here.</p>
</div>
```

### Typography
```jsx
<h1 className="text-display">Hero Title</h1>
<h1 className="text-heading-h1">Page Title</h1>
<p className="text-body-md-regular">Paragraph text</p>
```

### Layout & Grid
```jsx
<div className="container">
  <div className="grid grid-desktop-12">
    <div className="col-span-desktop-8">Main</div>
    <div className="col-span-desktop-4">Sidebar</div>
  </div>
</div>
```

---

## 🛠️ Development Guidelines

- **TypeScript**: strict typing for all components
- **Token-first**: no hardcoded colors, spacing, or font sizes
- **Minimal CSS-in-JS**: allowed only for special motion/cursor effects
- **Responsive**: use `grid.css` + responsive tokens
- **Accessible**: semantic roles, focus-visible, aria-labels
- **Performance**: optimized for Core Web Vitals

### Scripts
- `dev`: local dev
- `build`, `start`: production
- `lint`: linting
- `lint:css`: CSS token linter
- `validate:design-system`: design system enforcement (precommit)

---

## 🚀 Deployment

- **Platform**: Vercel  
- **Domain**: www.bendybethc.com  
- **SSL**: Automatic HTTPS  

---

## 🌟 Project Philosophy

This site is a living example of **design system rigor, creative vulnerability, and technical clarity**.  
Every component, style, and interaction is token-driven, accessible, and expressive — serving both as a beacon for the chronic illness community and a showcase of multidisciplinary design skill.

*Built with ❤️ by Beth Cartrette*
