/**
 * Design Token Mapping
 * Maps Builder.io semantic class names to your design token system
 */

export const tokenMapping = {
  // Surface/Background Colors
  'bg-surface-neutral-page': 'bg-surface-neutral-page',
  'bg-surface-neutral-inverse': 'bg-surface-neutral-inverse',
  'bg-surface-primary-default': 'bg-surface-primary-default',
  'bg-color-opacity-pink-80': 'bg-surface-secondary-opacity-80',
  
  // Text Colors
  'text-text-neutral-display': 'text-neutral-display',
  'text-text-neutral-inverse': 'text-neutral-inverse',
  'text-text-default': 'text-neutral-display',
  'text-text-neutral-disabled': 'text-neutral-disabled',
  'text-text-neutral-subtle-inverse': 'text-neutral-subtle-inverse',
  'text-surface-neutral-inverse': 'text-neutral-inverse',
  
  // Borders
  'border-border-neutral-dark': 'border-neutral-dark',
  
  // Typography
  'font-heading': '',
  'font-title': '',
  
  // Font Weights
  'font-normal': '',
  'font-medium': '',
  'font-semibold': '',
  
  // Spacing
  'px-6': '',
  'py-12': '',
  'px-24': '',
  'py-24': '',
  'gap-6': '',
  'gap-8': '',
  'gap-12': '',
  
  // Radius
  'rounded-lg': '',
  'rounded-md': '',
} as const;

/**
 * Utility function to map Builder.io classes to your design tokens
 */
export function mapTokenClasses(builderClasses: string): string {
  return builderClasses
    .split(' ')
    .map(className => tokenMapping[className as keyof typeof tokenMapping] || className)
    .join(' ');
}

/**
 * Component style classes using your design tokens
 */
export const componentStyles = {
  // Layout
  pageContainer: 'bg-surface-neutral-page',
  section: '',
  
  // Navigation
  navContainer: '',
  navLink: '',
  navText: '',
  
  // Typography
  heroTitle: 'text-neutral-inverse',
  displayText: 'text-neutral-display',
  titleText: 'text-neutral-display',
  bodyText: 'text-neutral-display',
  
  // Cards
  featureCard: 'bg-surface-secondary-opacity-80',
  cardTitle: 'text-neutral-display',
  cardDescription: 'text-neutral-display',
  
  // Buttons
  primaryButton: 'btn btn-md btn-primary',
  
  // Images
  heroImage: '',
  galleryImage: '',
  
  // Grid Layouts
  featureGrid: '',
  imageGrid: '',
} as const;
