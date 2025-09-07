# 🏠 Home Page Documentation

This document explains how the **Home Page** is structured and how it should be implemented using the **Bendy BethC Design System**.

---

## 📐 Layout Structure
The Home Page follows a consistent structure:

1. **Hero Section (Page Title)**  
   - Displays the main headline of the website.  
   - Background: `--surface-neutral-inverse`  
   - Text: `--text-neutral-inverse`  
   - Typography: `Behind The Nineties`, 128px, line-height 136px  
   - Padding: 64px top/bottom, 96px left/right  

2. **Animated Copy Block**  
   - Rotating lines of text introducing the message/mission.  
   - Example lines from old site:  
     - "This isn’t content."  
     - "It’s proof of what it really takes to get answers."  
     - "What it means to keep going when no one believes you."  
   - Uses motion/animation, but text styling comes from typography tokens (e.g. `text-body-lg`).

3. **Image Gallery**  
   - Simple responsive image grid.  
   - Use `container` + responsive grid utilities:  
     - `grid-mobile-4`, `grid-tablet-8`, `grid-desktop-12`  
   - Each image should respect border radius tokens (`--radius-md`).

4. **Feature Cards Section**  
   - Grid of cards linking to deeper site sections (About, Blog, Contact).  
   - Cards use:
     - Background: `--surface-neutral-card`
     - Typography: `text-heading-h3`, `text-body-md`
     - Padding: `--spacing-lg`
     - Border radius: `--radius-md`

5. **Footer**  
   - Background: `--surface-neutral-inverse`  
   - Text: `--text-neutral-inverse`  
   - Includes navigation + copyright.

---

## 🧩 Component Mapping
| Section              | Component            | Tokens/Utilities |
|----------------------|----------------------|------------------|
| Hero (Page Title)    | `<PageTitle />`      | `font-displayregular`, `text-[128px]`, `leading-[136px]`, bg/text inverse colors |
| Copy Block           | `<AnimatedCopyBlock />` | `text-body-lg`, spacing tokens |
| Image Gallery        | `<SimpleImageGallery />` | `grid-*` utilities, `--radius-md` |
| Features             | `<FeatureCardGrid />` | `bg-surface-neutral-card`, typography tokens, spacing tokens |
| Footer               | `<Footer />`         | bg/text inverse colors, `btn-link` for links |

---

## 🚫 Migration Notes (from old repo)
- ❌ Do not use `mx-auto`, `px-6`, `rounded-lg`, or hardcoded `px` sizes.  
- ❌ Do not use raw hex colors (e.g. `#252626`, `#F9FAFA`).  
- ✅ Replace all with design system tokens and Tailwind utilities.  

---

## ✅ Implementation Example (Hero Section)
```tsx
<section className="bg-surface-neutral-inverse text-text-neutral-inverse py-[64px] px-[96px]">
  <h1 className="font-displayregular text-[128px] leading-[136px]">
    Hello Bendy Friends!
  </h1>
  <p className="font-bodybody-lgregular mt-[var(--spacing-md)]">
    Welcome to my creative space ✨
  </p>
</section>
