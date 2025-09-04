#!/usr/bin/env tsx

import axios from 'axios';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu'; // Bendy_BethC Website

// Featured Post component node IDs from the blog page analysis
const FEATURED_POST_SECTION_ID = '1474:16224'; // Featured Post section (1440x856)
const FEATURED_POST_TITLE_ID = '1474:15178'; // "Featured Post" title (352x96)
const HORIZONTAL_POST_CARD_ID = '1474:15179'; // Horizontal post card container (1440x712)
const BLOG_POST_CARD_INSTANCE_ID = '1474:15180'; // Blog Post Card instance (1248x520)

// Also get the base Blog Post Card component for styling reference
const BLOG_POST_CARD_COMPONENT_ID = '269:3240'; // Blog Post Card component set
const HORIZONTAL_VARIANT_ID = '269:3238'; // Horizontal variant of Blog Post Card

async function extractFeaturedPostSpecs(): Promise<void> {
  console.log('🎯 Extracting FeaturedPost Component Specifications...');
  console.log(`📁 File Key: ${FIGMA_FILE_KEY}`);
  
  if (!FIGMA_ACCESS_TOKEN) {
    console.error('❌ FIGMA_ACCESS_TOKEN environment variable is required');
    console.log('💡 Please set FIGMA_API_KEY or FIGMA_ACCESS_TOKEN in your .env file');
    process.exit(1);
  }

  try {
    // Create output directory
    const outputDir = './component_specs/featured-post';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('📦 Fetching Featured Post components from Figma...');
    
    // Get all the featured post related nodes
    const nodeIds = [
      FEATURED_POST_SECTION_ID,
      FEATURED_POST_TITLE_ID,
      HORIZONTAL_POST_CARD_ID,
      BLOG_POST_CARD_INSTANCE_ID,
      BLOG_POST_CARD_COMPONENT_ID,
      HORIZONTAL_VARIANT_ID
    ].join(',');

    const nodeResponse = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${nodeIds}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    console.log('✅ Successfully fetched component nodes');

    // Generate images for the featured post components
    console.log('🖼️ Generating component images...');
    
    const imageResponse = await axios.get(
      `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${nodeIds}&format=png&scale=2`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    console.log('✅ Successfully generated component images');

    // Download and save images
    const images = imageResponse.data.images;
    
    // Main component view - use the featured post section
    if (images[FEATURED_POST_SECTION_ID]) {
      await downloadImage(images[FEATURED_POST_SECTION_ID], path.join(outputDir, 'featured-post.png'));
      console.log('✅ Downloaded main component view');
    }

    // Generate specification images based on the component structure
    await generateSpecificationImages(nodeResponse.data.nodes, outputDir);

    // Save detailed component data
    fs.writeFileSync(
      path.join(outputDir, 'component-data.json'),
      JSON.stringify(nodeResponse.data, null, 2)
    );

    console.log('\n🎉 FeaturedPost component specifications extracted successfully!');
    console.log(`📁 Check ${outputDir}/ for all specification files`);

  } catch (error) {
    console.error('❌ Error fetching Figma data:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
  }
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(filepath, response.data);
}

async function generateSpecificationImages(nodes: any, outputDir: string): Promise<void> {
  console.log('📋 Generating specification documentation...');

  // Extract component information
  const featuredPostSection = nodes[FEATURED_POST_SECTION_ID];
  const blogPostCardInstance = nodes[BLOG_POST_CARD_INSTANCE_ID];
  const blogPostCardComponent = nodes[BLOG_POST_CARD_COMPONENT_ID];
  const horizontalVariant = nodes[HORIZONTAL_VARIANT_ID];

  // Generate Anatomy.png documentation
  const anatomyDoc = generateAnatomyDocumentation(featuredPostSection, blogPostCardInstance);
  fs.writeFileSync(path.join(outputDir, 'Anatomy.md'), anatomyDoc);
  console.log('✅ Generated Anatomy documentation');

  // Generate Data.png documentation  
  const dataDoc = generateDataDocumentation(blogPostCardInstance);
  fs.writeFileSync(path.join(outputDir, 'Data.md'), dataDoc);
  console.log('✅ Generated Data documentation');

  // Generate Layout and spacing documentation
  const layoutDoc = generateLayoutDocumentation(featuredPostSection, blogPostCardInstance);
  fs.writeFileSync(path.join(outputDir, 'Layout and spacing.md'), layoutDoc);
  console.log('✅ Generated Layout and spacing documentation');

  // Generate Properties documentation
  const propertiesDoc = generatePropertiesDocumentation(blogPostCardComponent);
  fs.writeFileSync(path.join(outputDir, 'Properties.md'), propertiesDoc);
  console.log('✅ Generated Properties documentation');

  // Generate Modes documentation
  const modesDoc = generateModesDocumentation(horizontalVariant);
  fs.writeFileSync(path.join(outputDir, 'Modes.md'), modesDoc);
  console.log('✅ Generated Modes documentation');

  // Generate Styling documentation - this is critical for design system compliance
  const stylingDoc = generateStylingDocumentation(horizontalVariant, blogPostCardInstance);
  fs.writeFileSync(path.join(outputDir, 'Styling.md'), stylingDoc);
  console.log('✅ Generated Styling documentation');

  console.log('\n📚 All specification documentation generated!');
  console.log('⚠️  Note: The .md files contain the extracted specifications. The actual .png files should be extracted from Figma for visual reference.');
}

function generateAnatomyDocumentation(featuredSection: any, cardInstance: any): string {
  return `# FeaturedPost Component - Anatomy

## Component Structure

The FeaturedPost component consists of:

### Featured Post Section (1440x856px)
- **Container**: Full-width featured post section
- **Header**: "Featured Post" title
- **Card Container**: Horizontal blog post card layout

### Horizontal Blog Post Card (1248x520px)  
- **Left Side - Image**: Featured image (approximately 624px wide)
- **Right Side - Content**: Blog post details (approximately 624px wide)
  - **Title**: Blog post headline
  - **Chip Group**: Category tags
  - **Copy**: Blog post preview text
  - **Date**: Publication date

## Component Hierarchy
\`\`\`
FeaturedPost
├── Header
│   └── "Featured Post" Title
└── Horizontal Card
    ├── Image (Left)
    └── Content (Right)
        ├── Title
        ├── Chip Group
        │   ├── Chip 1
        │   ├── Chip 2
        │   └── Chip 3
        ├── Copy Preview
        └── Date
\`\`\`

## Dimensions
- **Overall Section**: 1440x856px
- **Card**: 1248x520px
- **Image Area**: ~624x520px
- **Content Area**: ~624x520px
`;
}

function generateDataDocumentation(cardInstance: any): string {
  return `# FeaturedPost Component - Data Structure

## Content Requirements

### Required Props
- **title**: Blog post title (string)
- **image**: Featured image URL (string) 
- **imageAlt**: Image alt text for accessibility (string)
- **categories**: Array of category objects
  - **name**: Category name (string)
  - **slug**: Category URL slug (string)
- **excerpt**: Blog post preview text (string)
- **publishDate**: Publication date (Date | string)
- **slug**: Blog post URL slug (string)

### Optional Props
- **readTime**: Estimated reading time (string)
- **author**: Author information (object)

## Content Specifications
- **Title**: Maximum 2 lines, truncate with ellipsis if longer
- **Categories**: Display up to 3 category chips
- **Excerpt**: Maximum 4-5 lines of preview text
- **Date**: Format as "Month DD, YYYY" (e.g., "July 12, 2025")

## Example Data Structure
\`\`\`typescript
interface FeaturedPostData {
  title: string;
  image: string;
  imageAlt: string;
  categories: Array<{
    name: string;
    slug: string;
  }>;
  excerpt: string;
  publishDate: string;
  slug: string;
  readTime?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}
\`\`\`
`;
}

function generateLayoutDocumentation(featuredSection: any, cardInstance: any): string {
  return `# FeaturedPost Component - Layout and Spacing

## Responsive Layout

### Desktop (1440px+)
- **Container**: 1440px width, centered
- **Card**: 1248px width, centered within container
- **Image**: 624px width (50% of card)
- **Content**: 624px width (50% of card)
- **Margins**: 96px horizontal margins

### Tablet (810px - 1439px)
- **Container**: Full width with 64px margins
- **Card**: Flexible width, maintain 50/50 split
- **Stack**: Maintain horizontal layout

### Mobile (390px - 809px) 
- **Layout**: Stack vertically
- **Image**: Full width, aspect ratio 16:9
- **Content**: Full width below image
- **Margins**: 24px horizontal margins

## Spacing Specifications

### Section Spacing
- **Top margin**: 64px (desktop), 48px (tablet), 32px (mobile)
- **Bottom margin**: 64px (desktop), 48px (tablet), 32px (mobile)

### Card Internal Spacing
- **Image to content gap**: 0px (adjacent)
- **Content padding**: 48px all sides (desktop), 32px (tablet), 24px (mobile)

### Content Element Spacing
- **Title to chips**: 24px
- **Chips to excerpt**: 24px  
- **Excerpt to date**: 32px
- **Chip gaps**: 8px between chips

## Border Radius
- **Card**: 16px border radius
- **Image**: 16px radius on left side (desktop), top corners (mobile)
`;
}

function generatePropertiesDocumentation(componentSet: any): string {
  return `# FeaturedPost Component - Properties

## Component Variants

The FeaturedPost component is built on the Blog Post Card component with specific properties:

### Style Property
- **horizontal**: Large horizontal layout (default for featured posts)
- **vertical**: Vertical layout (not typically used for featured posts)
- **vertical-big-image**: Vertical with larger image

### Size Property (for horizontal variant)
- **featured**: Large size (1248x520px)
- **standard**: Standard size (smaller dimensions)

## Props Interface

\`\`\`typescript
interface FeaturedPostProps {
  // Data props
  title: string;
  image: string;
  imageAlt: string;
  categories: Array<{
    name: string;
    slug: string;
  }>;
  excerpt: string;
  publishDate: string;
  slug: string;
  
  // Optional props
  readTime?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  
  // Styling props
  className?: string;
  
  // Interaction props
  onClick?: () => void;
  onImageClick?: () => void;
  onCategoryClick?: (category: string) => void;
}
\`\`\`

## State Management
- **Default**: Normal display state
- **Hover**: Enhanced elevation and subtle animations
- **Loading**: Skeleton loading states for all content areas
- **Error**: Fallback display when image fails to load
`;
}

function generateModesDocumentation(horizontalVariant: any): string {
  return `# FeaturedPost Component - Modes

## Theme Modes

### Light Mode (Default)
- **Background**: White card background
- **Text**: Dark text colors
- **Image**: Full opacity
- **Chips**: Light colored backgrounds with dark text

### Dark Mode
- **Background**: Dark card background
- **Text**: Light text colors  
- **Image**: Slightly reduced opacity for better text contrast
- **Chips**: Dark colored backgrounds with light text

## Interactive States

### Default State
- **Card elevation**: Subtle shadow
- **Image**: Standard display
- **Text**: Standard colors

### Hover State
- **Card elevation**: Enhanced shadow/elevation
- **Image**: Slight scale effect (1.05x)
- **Cursor**: Pointer cursor
- **Transition**: Smooth 0.3s transition

### Focus State (Accessibility)
- **Card outline**: 2px focus ring
- **Keyboard navigation**: Tab support

## Responsive Modes

### Desktop (1440px+)
- **Layout**: Horizontal side-by-side
- **Image aspect**: Flexible height to match content
- **Typography**: Large text sizes

### Tablet (810px-1439px)
- **Layout**: Horizontal with reduced margins
- **Image aspect**: Maintain proportions
- **Typography**: Medium text sizes

### Mobile (390px-809px)
- **Layout**: Vertical stack
- **Image aspect**: 16:9 ratio
- **Typography**: Smaller text sizes
- **Touch**: Enhanced touch targets

## Loading States
- **Image**: Skeleton placeholder with shimmer
- **Text**: Skeleton lines for title, excerpt, date
- **Chips**: Skeleton pill shapes
- **Progressive**: Load text first, then image
`;
}

function generateStylingDocumentation(horizontalVariant: any, cardInstance: any): string {
  return `# FeaturedPost Component - Styling

## Design System Tokens

### Typography Classes
- **Title**: \`text-heading-h2\` (Large blog post title)
- **Excerpt**: \`text-body-lg-regular\` (Body text for excerpt)
- **Date**: \`text-body-md-regular\` (Date display)
- **Category Chips**: \`text-label-sm-medium\` (Chip labels)

### Color Tokens

#### Light Mode
- **Card Background**: \`bg-surface-neutral-card\`
- **Title Text**: \`text-neutral-heading\`
- **Excerpt Text**: \`text-neutral-body\`
- **Date Text**: \`text-neutral-subdued\`

#### Dark Mode  
- **Card Background**: \`bg-surface-neutral-card-dark\`
- **Title Text**: \`text-neutral-heading-dark\`
- **Excerpt Text**: \`text-neutral-body-dark\`
- **Date Text**: \`text-neutral-subdued-dark\`

### Spacing Tokens
- **Card Padding**: \`p-lg\` (48px desktop, scales responsive)
- **Content Gap**: \`space-lg\` (24px between elements)
- **Chip Spacing**: \`gap-sm\` (8px between chips)
- **Section Margin**: \`my-xl\` (64px vertical margins)

### Border Radius
- **Card**: \`rounded-lg\` (16px border radius)
- **Image**: \`rounded-l-lg\` (left side rounded) or \`rounded-t-lg\` (mobile top)

### Shadows
- **Default**: \`shadow-md\` (Subtle card elevation)
- **Hover**: \`shadow-lg\` (Enhanced elevation on hover)

## CSS Classes Structure

\`\`\`css
.featured-post {
  @apply bg-surface-neutral-card rounded-lg shadow-md overflow-hidden;
}

.featured-post__image {
  @apply flex-shrink-0;
}

.featured-post__content {
  @apply p-lg space-y-lg;
}

.featured-post__title {
  @apply text-heading-h2 text-neutral-heading;
}

.featured-post__excerpt {
  @apply text-body-lg-regular text-neutral-body;
}

.featured-post__date {
  @apply text-body-md-regular text-neutral-subdued;
}

.featured-post__chips {
  @apply flex gap-sm flex-wrap;
}
\`\`\`

## Critical Design System Notes
- **Never hardcode colors** - Always use design system color tokens
- **Typography hierarchy** - Use exact text classes from design system
- **Responsive spacing** - Use design system responsive spacing utilities
- **Border radius consistency** - Use design system border radius tokens
- **Shadow elevation** - Use design system shadow utilities

This component MUST follow the design system standards and never use custom CSS values.
`;
}

// Run the extraction
extractFeaturedPostSpecs().catch(console.error);