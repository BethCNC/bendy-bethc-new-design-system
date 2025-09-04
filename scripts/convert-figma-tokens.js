#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read all the Figma token files
const primitives = JSON.parse(fs.readFileSync('./variables/Primitives-Light.json', 'utf8'));
const aliases = JSON.parse(fs.readFileSync('./variables/Alias.json', 'utf8'));
const mapped = JSON.parse(fs.readFileSync('./variables/Mapped.json', 'utf8'));
const responsiveMobile = JSON.parse(fs.readFileSync('./variables/Responsive-mobile.json', 'utf8'));
const responsiveTablet = JSON.parse(fs.readFileSync('./variables/Responsive-tablet.json', 'utf8'));
const responsiveDesktop = JSON.parse(fs.readFileSync('./variables/Responsive-desktop.json', 'utf8'));

console.log('🎯 Converting Figma Design Tokens to CSS...\n');

// Convert primitives to CSS custom properties
function generatePrimitivesCSS() {
  let css = `/**
 * PRIMITIVE TOKENS
 * Raw values from Figma Token Studio
 */

:root {
  /* === COLORS === */
`;

  // Colors
  Object.entries(primitives.color).forEach(([colorName, colorValues]) => {
    if (typeof colorValues === 'object' && colorValues !== null) {
      Object.entries(colorValues).forEach(([shade, value]) => {
        if (typeof value === 'string' && value.startsWith('#')) {
          css += `  --color-${colorName.toLowerCase()}-${shade}: ${value};\n`;
        }
      });
    }
  });

  // Spacing
  css += `\n  /* === SPACING === */\n`;
  Object.entries(primitives.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value}px;\n`;
  });

  // Radius
  css += `\n  /* === RADIUS === */\n`;
  Object.entries(primitives.radius).forEach(([key, value]) => {
    css += `  --radius-${key.toLowerCase()}: ${value}px;\n`;
  });

  // Typography
  css += `\n  /* === TYPOGRAPHY === */\n`;
  Object.entries(primitives.type['font-size']).forEach(([key, value]) => {
    css += `  --font-size-${key}: ${value}px;\n`;
  });
  
  Object.entries(primitives.type['line-height']).forEach(([key, value]) => {
    css += `  --line-height-${key}: ${value}px;\n`;
  });

  Object.entries(primitives.type['font-weight']).forEach(([key, value]) => {
    css += `  --font-weight-${key}: ${value};\n`;
  });

  css += '}\n';
  return css;
}

// Convert semantic tokens (mapped) to CSS
function generateSemanticCSS() {
  let css = `/**
 * SEMANTIC TOKENS  
 * Semantic color mappings from Figma
 */

:root {
  /* === SURFACE TOKENS === */
`;

  // Surface tokens
  Object.entries(mapped.Surface).forEach(([category, colors]) => {
    Object.entries(colors).forEach(([state, value]) => {
      const tokenName = `--surface-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
      css += `  ${tokenName}: ${value};\n`;
    });
  });

  // Text tokens
  css += `\n  /* === TEXT TOKENS === */\n`;
  Object.entries(mapped.Text).forEach(([category, colors]) => {
    Object.entries(colors).forEach(([state, value]) => {
      const tokenName = `--text-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
      css += `  ${tokenName}: ${value};\n`;
    });
  });

  // Border tokens
  css += `\n  /* === BORDER TOKENS === */\n`;
  Object.entries(mapped.Border).forEach(([category, colors]) => {
    if (typeof colors === 'object' && colors !== null) {
      Object.entries(colors).forEach(([state, value]) => {
        const tokenName = `--border-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
        css += `  ${tokenName}: ${value};\n`;
      });
    }
  });

  css += '}\n';
  return css;
}

// Generate responsive typography CSS
function generateResponsiveTypography() {
  let css = `/**
 * RESPONSIVE TYPOGRAPHY
 * Mobile-first responsive font scaling
 */

/* === MOBILE (390px+) === */
:root {
`;

  // Mobile typography
  Object.entries(responsiveMobile.fontsize).forEach(([category, sizes]) => {
    Object.entries(sizes).forEach(([size, value]) => {
      css += `  --font-mobile-${category}-${size}: ${value}px;\n`;
    });
  });

  Object.entries(responsiveMobile.lineheight).forEach(([category, heights]) => {
    Object.entries(heights).forEach(([size, value]) => {
      css += `  --line-height-mobile-${category}-${size}: ${value}px;\n`;
    });
  });

  css += '}\n\n';

  // Tablet typography
  css += `/* === TABLET (810px+) === */
@media (min-width: 810px) {
  :root {
`;

  Object.entries(responsiveTablet.fontsize).forEach(([category, sizes]) => {
    Object.entries(sizes).forEach(([size, value]) => {
      css += `    --font-tablet-${category}-${size}: ${value}px;\n`;
    });
  });

  Object.entries(responsiveTablet.lineheight).forEach(([category, heights]) => {
    Object.entries(heights).forEach(([size, value]) => {
      css += `    --line-height-tablet-${category}-${size}: ${value}px;\n`;
    });
  });

  css += '  }\n}\n\n';

  // Desktop typography
  css += `/* === DESKTOP (1440px+) === */
@media (min-width: 1440px) {
  :root {
`;

  Object.entries(responsiveDesktop.fontsize).forEach(([category, sizes]) => {
    Object.entries(sizes).forEach(([size, value]) => {
      css += `    --font-desktop-${category}-${size}: ${value}px;\n`;
    });
  });

  Object.entries(responsiveDesktop.lineheight).forEach(([category, heights]) => {
    Object.entries(heights).forEach(([size, value]) => {
      css += `    --line-height-desktop-${category}-${size}: ${value}px;\n`;
    });
  });

  css += '  }\n}\n';
  return css;
}

// Generate responsive spacing CSS
function generateResponsiveSpacing() {
  let css = `/**
 * RESPONSIVE SPACING
 * Consistent spacing system across breakpoints
 */

/* === MOBILE (390px+) === */
:root {
`;

  Object.entries(responsiveMobile.spacing).forEach(([size, value]) => {
    css += `  --spacing-mobile-${size}: ${value}px;\n`;
  });

  css += `  --margin-mobile: ${responsiveMobile.margins}px;\n`;
  css += `  --gutter-mobile: ${responsiveMobile.gutter}px;\n`;
  css += '}\n\n';

  // Tablet spacing
  css += `/* === TABLET (810px+) === */
@media (min-width: 810px) {
  :root {
`;

  Object.entries(responsiveTablet.spacing).forEach(([size, value]) => {
    css += `    --spacing-tablet-${size}: ${value}px;\n`;
  });

  css += `    --margin-tablet: ${responsiveTablet.margins}px;\n`;
  css += `    --gutter-tablet: ${responsiveTablet.gutter}px;\n`;
  css += '  }\n}\n\n';

  // Desktop spacing
  css += `/* === DESKTOP (1440px+) === */
@media (min-width: 1440px) {
  :root {
`;

  Object.entries(responsiveDesktop.spacing).forEach(([size, value]) => {
    css += `    --spacing-desktop-${size}: ${value}px;\n`;
  });

  css += `    --margin-desktop: ${responsiveDesktop.margins}px;\n`;
  css += `    --gutter-desktop: ${responsiveDesktop.gutter}px;\n`;
  css += '  }\n}\n';

  return css;
}

// Generate utility classes
function generateUtilityClasses() {
  let css = `/**
 * UTILITY CLASSES
 * Using the converted tokens above
 */

/* === SURFACE UTILITIES === */
.bg-surface-page { background-color: var(--surface-neutral-page); }
.bg-surface-card { background-color: var(--surface-neutral-card); }
.bg-surface-inverse { background-color: var(--surface-neutral-inverse); }
.bg-surface-primary-default { background-color: var(--surface-primary-default); }
.bg-surface-primary-hover { background-color: var(--surface-primary-hover); }
.bg-surface-secondary-default { background-color: var(--surface-secondary-default); }
.bg-surface-tertiary-default { background-color: var(--surface-tertiary-default); }

/* === TEXT UTILITIES === */
.text-heading { color: var(--text-neutral-heading); }
.text-body { color: var(--text-neutral-body); }
.text-inverse { color: var(--text-neutral-inverse); }
.text-display { color: var(--text-neutral-display); }
.text-primary { color: var(--text-primary-default); }

/* === BORDER UTILITIES === */
.border-default { border-color: var(--border-neutral-default); }
.border-dark { border-color: var(--border-neutral-dark); }

/* === LAYOUT UTILITIES === */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--margin-mobile);
  padding-right: var(--margin-mobile);
}

@media (min-width: 810px) {
  .container {
    padding-left: var(--margin-tablet);
    padding-right: var(--margin-tablet);
  }
}

@media (min-width: 1440px) {
  .container {
    max-width: 1440px;
    padding-left: var(--margin-desktop);
    padding-right: var(--margin-desktop);
  }
}

/* === TYPOGRAPHY UTILITIES === */
.font-heading { font-family: "Behind The Nineties", serif; }
.font-body { font-family: "Overused Grotesk", sans-serif; }

.text-mobile-display { 
  font-size: var(--font-mobile-display-display); 
  line-height: var(--line-height-mobile-display-display);
}

.text-desktop-display { 
  font-size: var(--font-desktop-display-display); 
  line-height: var(--line-height-desktop-display-display);
}

.text-mobile-heading-h1 { 
  font-size: var(--font-mobile-heading-h1); 
  line-height: var(--line-height-mobile-heading-h1);
}

.text-desktop-heading-h1 { 
  font-size: var(--font-desktop-heading-h1); 
  line-height: var(--line-height-desktop-heading-h1);
}

.text-mobile-heading-h2 { 
  font-size: var(--font-mobile-heading-h2); 
  line-height: var(--line-height-mobile-heading-h2);
}

.text-desktop-heading-h2 { 
  font-size: var(--font-desktop-heading-h2); 
  line-height: var(--line-height-desktop-heading-h2);
}

/* === SPACING UTILITIES === */
.space-mobile-sm { margin: var(--spacing-mobile-sm); }
.space-mobile-md { margin: var(--spacing-mobile-md); }
.space-mobile-lg { margin: var(--spacing-mobile-lg); }
.space-mobile-xl { margin: var(--spacing-mobile-xl); }

.p-mobile-sm { padding: var(--spacing-mobile-sm); }
.p-mobile-md { padding: var(--spacing-mobile-md); }
.p-mobile-lg { padding: var(--spacing-mobile-lg); }
.p-mobile-xl { padding: var(--spacing-mobile-xl); }

.py-mobile-sm { padding-top: var(--spacing-mobile-sm); padding-bottom: var(--spacing-mobile-sm); }
.py-mobile-md { padding-top: var(--spacing-mobile-md); padding-bottom: var(--spacing-mobile-md); }
.py-mobile-lg { padding-top: var(--spacing-mobile-lg); padding-bottom: var(--spacing-mobile-lg); }
.py-mobile-xl { padding-top: var(--spacing-mobile-xl); padding-bottom: var(--spacing-mobile-xl); }

@media (min-width: 810px) {
  .space-tablet-sm { margin: var(--spacing-tablet-sm); }
  .space-tablet-md { margin: var(--spacing-tablet-md); }
  .space-tablet-lg { margin: var(--spacing-tablet-lg); }
  .space-tablet-xl { margin: var(--spacing-tablet-xl); }

  .p-tablet-sm { padding: var(--spacing-tablet-sm); }
  .p-tablet-md { padding: var(--spacing-tablet-md); }
  .p-tablet-lg { padding: var(--spacing-tablet-lg); }
  .p-tablet-xl { padding: var(--spacing-tablet-xl); }

  .py-tablet-sm { padding-top: var(--spacing-tablet-sm); padding-bottom: var(--spacing-tablet-sm); }
  .py-tablet-md { padding-top: var(--spacing-tablet-md); padding-bottom: var(--spacing-tablet-md); }
  .py-tablet-lg { padding-top: var(--spacing-tablet-lg); padding-bottom: var(--spacing-tablet-lg); }
  .py-tablet-xl { padding-top: var(--spacing-tablet-xl); padding-bottom: var(--spacing-tablet-xl); }
}

@media (min-width: 1440px) {
  .space-desktop-sm { margin: var(--spacing-desktop-sm); }
  .space-desktop-md { margin: var(--spacing-desktop-md); }
  .space-desktop-lg { padding: var(--spacing-desktop-lg); }
  .space-desktop-xl { margin: var(--spacing-desktop-xl); }

  .p-desktop-sm { padding: var(--spacing-desktop-sm); }
  .p-desktop-md { padding: var(--spacing-desktop-md); }
  .p-desktop-lg { padding: var(--spacing-desktop-lg); }
  .p-desktop-xl { padding: var(--spacing-desktop-xl); }

  .py-desktop-sm { padding-top: var(--spacing-desktop-sm); padding-bottom: var(--spacing-desktop-sm); }
  .py-desktop-md { padding-top: var(--spacing-desktop-md); padding-bottom: var(--spacing-desktop-md); }
  .py-desktop-lg { padding-top: var(--spacing-desktop-lg); padding-bottom: var(--spacing-desktop-lg); }
  .py-desktop-xl { padding-top: var(--spacing-desktop-xl); padding-bottom: var(--spacing-desktop-xl); }
}
`;

  return css;
}

// Write all the CSS files
function writeCSS() {
  // Ensure tokens directory exists
  if (!fs.existsSync('./tokens-converted')) {
    fs.mkdirSync('./tokens-converted');
  }

  // Write primitives
  fs.writeFileSync('./tokens-converted/primitives.css', generatePrimitivesCSS());
  console.log('✅ Generated primitives.css');

  // Write semantic tokens
  fs.writeFileSync('./tokens-converted/semantic.css', generateSemanticCSS());
  console.log('✅ Generated semantic.css');

  // Write responsive typography
  fs.writeFileSync('./tokens-converted/typography.css', generateResponsiveTypography());
  console.log('✅ Generated typography.css');

  // Write responsive spacing
  fs.writeFileSync('./tokens-converted/spacing.css', generateResponsiveSpacing());
  console.log('✅ Generated spacing.css');

  // Write utilities
  fs.writeFileSync('./tokens-converted/utilities.css', generateUtilityClasses());
  console.log('✅ Generated utilities.css');

  // Write main index file
  const indexCSS = `/**
 * BENDY BETHC DESIGN SYSTEM
 * Generated from Figma Token Studio
 */

@import './primitives.css';
@import './semantic.css';
@import './typography.css';
@import './spacing.css';
@import './utilities.css';
`;

  fs.writeFileSync('./tokens-converted/index.css', indexCSS);
  console.log('✅ Generated index.css');

  console.log('\n🎉 Figma tokens successfully converted to CSS!');
  console.log('📁 Files created in ./tokens-converted/');
  console.log('\n📝 Next steps:');
  console.log('1. Review the generated CSS files');
  console.log('2. Replace your current tokens/ folder with tokens-converted/');
  console.log('3. Update your layout.tsx to import the new index.css');
}

// Run the conversion
writeCSS(); 