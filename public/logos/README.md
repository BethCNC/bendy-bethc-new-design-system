# Logos Directory

Export your "bendy beth logo" components from Figma here.

## Logo Files:
- `bendy-beth-logo.svg` (main stacked horizontal logo for CTA)
- `bendy-beth-logo-horizontal.svg` (horizontal version)
- `bendy-beth-logo-monogram.svg` (monogram version)

## Social Icons:
- `social/facebook.svg`
- `social/github.svg`
- `social/instagram.svg`
- `social/pinterest.svg`
- `social/twitter.svg`
- `social/youtube.svg`

## Usage in Code:
```tsx
import Image from 'next/image';

// Main logo for CTA component
<Image 
  src="/logos/bendy-beth-logo.svg"
  alt="Bendy Beth Logo"
  width={170}
  height={100}
/>

// Social icons
<Image 
  src="/logos/social/instagram.svg"
  alt="Instagram"
  width={24}
  height={24}
/>
```

## Notes:
- All logos are SVG files that scale infinitely
- No need for multiple sizes since SVG scales automatically
- Main logo dimensions: 170x100px (viewBox)
- Social icons: 24x24px recommended 