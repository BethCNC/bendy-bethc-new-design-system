# Component Images Directory

Export component-specific images from Figma here.

## Directory Structure:
- `avatars/` - User avatar/profile images
- `feature-cards/` - Feature card images
- `about-me/` - About me section images
- `ui/` - UI element images (if any)

## Expected Files:
- `avatars/user-avatar.png`
- `feature-cards/feature-01.png`
- `about-me/profile-photo.png`

## Usage in Code:
```tsx
import Image from 'next/image';

// Avatar
<Image 
  src="/images/components/avatars/user-avatar.png"
  alt="User Avatar"
  width={50}
  height={50}
/>

// Feature card
<Image 
  src="/images/components/feature-cards/feature-01.png"
  alt="Feature Description"
  width={300}
  height={200}
/>
``` 