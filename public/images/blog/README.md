# Blog Images Directory

Export blog-related images from Figma here.

## Directory Structure:
- `featured/` - Blog post featured images
- `thumbnails/` - Blog post card thumbnails  
- `authors/` - Author profile images

## Expected Files:
- `featured/blog-post-01.png`
- `thumbnails/blog-thumbnail-01.png`
- `authors/author-profile.png`

## Usage in Code:
```tsx
import Image from 'next/image';

// Featured image
<Image 
  src="/images/blog/featured/blog-post-01.png"
  alt="Blog Post Featured Image"
  width={800}
  height={400}
/>

// Author image
<Image 
  src="/images/blog/authors/author-profile.png"
  alt="Author Name"
  width={100}
  height={100}
/>
``` 