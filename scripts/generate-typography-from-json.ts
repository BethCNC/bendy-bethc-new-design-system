#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface TextStyle {
  name: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  letterSpacing: {
    unit: string;
    value: number;
  };
  textCase?: string;
  lineHeight?: number;
}

interface TextStylesData {
  fileName: string;
  textStyles: TextStyle[];
}

function convertFontWeight(weight: string): number {
  const weightMap: Record<string, number> = {
    'Thin': 100,
    'ExtraLight': 200,
    'Light': 300,
    'Regular': 400,
    'Medium': 500,
    'SemiBold': 600,
    'Bold': 700,
    'ExtraBold': 800,
    'Black': 900,
  };
  return weightMap[weight] || 400;
}

function sanitizeClassName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateTypographyCSS(): void {
  console.log('🎨 Generating typography CSS from textStyles.json...\n');

  // Read the textStyles.json file
  const textStylesPath = './variables/textStyles.json';
  if (!fs.existsSync(textStylesPath)) {
    console.error('❌ textStyles.json not found at', textStylesPath);
    process.exit(1);
  }

  const textStylesData: TextStylesData = JSON.parse(fs.readFileSync(textStylesPath, 'utf8'));
  console.log(`📝 Found ${textStylesData.textStyles.length} text styles`);

  // Generate CSS content
  const css = `/**
 * TYPOGRAPHY SYSTEM
 * Generated from ${textStylesData.fileName}
 * ${textStylesData.textStyles.length} text styles extracted from textStyles.json
 */

/* === INDIVIDUAL TEXT STYLES === */
${textStylesData.textStyles.map(style => {
  const className = sanitizeClassName(style.name);
  const fontWeight = convertFontWeight(style.fontWeight);
  const letterSpacing = style.letterSpacing.unit === 'PERCENT' 
    ? `${(style.letterSpacing.value / 100) * style.fontSize}px`
    : `${style.letterSpacing.value}px`;
  const lineHeight = style.lineHeight || Math.round(style.fontSize * 1.2);

  return `
/* ${style.name} */
.text-${className} {
  font-family: "${style.fontFamily}", ${style.fontFamily.includes('Behind') ? 'serif' : 'sans-serif'};
  font-weight: ${fontWeight};
  font-size: ${style.fontSize}px;
  line-height: ${lineHeight}px;
  letter-spacing: ${letterSpacing};${style.textCase && style.textCase !== 'ORIGINAL' ? `\n  text-transform: ${style.textCase.toLowerCase()};` : ''}
}`;
}).join('\n')}

/* === SEMANTIC TYPOGRAPHY TOKENS === */
:root {
  /* Display */
  --font-size-display: 128px;
  --line-height-display: 154px;
  --font-family-display: "Behind The Nineties", serif;
  --font-weight-display: 400;

  /* Headings */
  --font-size-heading-h1: 96px;
  --line-height-heading-h1: 115px;
  --font-size-heading-h2: 72px;
  --line-height-heading-h2: 86px;
  --font-size-heading-h3: 60px;
  --line-height-heading-h3: 72px;
  --font-size-heading-h4: 48px;
  --line-height-heading-h4: 58px;
  --font-size-heading-h5: 36px;
  --line-height-heading-h5: 43px;
  --font-size-heading-h6: 30px;
  --line-height-heading-h6: 36px;
  --font-family-heading: "Behind The Nineties", serif;
  --font-weight-heading: 400;

  /* Titles */
  --font-size-title-xl: 24px;
  --line-height-title-xl: 32px;
  --font-size-title-lg: 20px;
  --line-height-title-lg: 30px;
  --font-size-title-md: 18px;
  --line-height-title-md: 28px;
  --font-size-title-sm: 16px;
  --line-height-title-sm: 24px;
  --font-size-title-xs: 14px;
  --line-height-title-xs: 20px;
  --font-family-title: "Overused Grotesk", sans-serif;
  --font-weight-title: 400;

  /* Body text */
  --font-size-body-xl: 20px;
  --line-height-body-xl: 30px;
  --font-size-body-lg: 18px;
  --line-height-body-lg: 28px;
  --font-size-body-md: 16px;
  --line-height-body-md: 24px;
  --font-size-body-sm: 14px;
  --line-height-body-sm: 20px;
  --font-size-body-xs: 12px;
  --line-height-body-xs: 16px;
  --font-family-body: "Overused Grotesk", sans-serif;
  --font-weight-body-regular: 400;
  --font-weight-body-medium: 500;
  --font-weight-body-semibold: 600;
  --font-weight-body-bold: 700;

  /* Font families */
  --font-family-overused-grotesk: "Overused Grotesk", sans-serif;
  --font-family-behind-the-nineties: "Behind The Nineties", serif;
}

/* === UTILITY CLASSES === */
.text-display {
  font-family: var(--font-family-display);
  font-size: var(--font-size-display);
  line-height: var(--line-height-display);
  font-weight: var(--font-weight-display);
}

.text-heading-h1 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-heading-h1);
  line-height: var(--line-height-heading-h1);
  font-weight: var(--font-weight-heading);
}

.text-heading-h2 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-heading-h2);
  line-height: var(--line-height-heading-h2);
  font-weight: var(--font-weight-heading);
}

.text-heading-h3 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-heading-h3);
  line-height: var(--line-height-heading-h3);
  font-weight: var(--font-weight-heading);
}

.text-title-xl {
  font-family: var(--font-family-title);
  font-size: var(--font-size-title-xl);
  line-height: var(--line-height-title-xl);
  font-weight: var(--font-weight-title);
}

.text-title-lg {
  font-family: var(--font-family-title);
  font-size: var(--font-size-title-lg);
  line-height: var(--line-height-title-lg);
  font-weight: var(--font-weight-title);
}

.text-body-lg {
  font-family: var(--font-family-body);
  font-size: var(--font-size-body-lg);
  line-height: var(--line-height-body-lg);
  font-weight: var(--font-weight-body-regular);
}

.text-body-md {
  font-family: var(--font-family-body);
  font-size: var(--font-size-body-md);
  line-height: var(--line-height-body-md);
  font-weight: var(--font-weight-body-regular);
}

.text-body-md-regular {
  font-family: var(--font-family-body);
  font-size: var(--font-size-body-md);
  line-height: var(--line-height-body-md);
  font-weight: var(--font-weight-body-regular);
}

.text-body-md-medium {
  font-family: var(--font-family-body);
  font-size: var(--font-size-body-md);
  line-height: var(--line-height-body-md);
  font-weight: var(--font-weight-body-medium);
}

.text-body-sm {
  font-family: var(--font-family-body);
  font-size: var(--font-size-body-sm);
  line-height: var(--line-height-body-sm);
  font-weight: var(--font-weight-body-regular);
}

/* === RESPONSIVE TYPOGRAPHY === */
@media (max-width: 809px) {
  :root {
    /* Mobile adjustments */
    --font-size-display: 72px;
    --line-height-display: 86px;
    --font-size-heading-h1: 48px;
    --line-height-heading-h1: 58px;
    --font-size-heading-h2: 36px;
    --line-height-heading-h2: 43px;
    --font-size-heading-h3: 30px;
    --line-height-heading-h3: 36px;
  }
}

@media (min-width: 810px) and (max-width: 1439px) {
  :root {
    /* Tablet adjustments */
    --font-size-display: 96px;
    --line-height-display: 115px;
    --font-size-heading-h1: 72px;
    --line-height-heading-h1: 86px;
    --font-size-heading-h2: 60px;
    --line-height-heading-h2: 72px;
  }
}

@media (min-width: 1440px) {
  :root {
    /* Desktop - use default values */
  }
}
`;

  // Write the CSS file
  const outputPath = './tokens/typography.css';
  fs.writeFileSync(outputPath, css);
  console.log(`✅ Generated typography CSS: ${outputPath}`);

  // Generate a summary report
  const report = `# Typography Generation Report

**Source:** ${textStylesData.fileName}
**Generated:** ${new Date().toISOString()}
**Text Styles:** ${textStylesData.textStyles.length}

## Text Styles by Category

### Display & Headings
${textStylesData.textStyles
  .filter(s => s.name.includes('display') || s.name.includes('heading'))
  .map(s => `- **${s.name}**: ${s.fontFamily} ${s.fontWeight} ${s.fontSize}px`)
  .join('\n')}

### Titles
${textStylesData.textStyles
  .filter(s => s.name.includes('title'))
  .map(s => `- **${s.name}**: ${s.fontFamily} ${s.fontWeight} ${s.fontSize}px`)
  .join('\n')}

### Body Text
${textStylesData.textStyles
  .filter(s => s.name.includes('body'))
  .map(s => `- **${s.name}**: ${s.fontFamily} ${s.fontWeight} ${s.fontSize}px`)
  .join('\n')}

## Usage

The generated typography classes can be used as:

\`\`\`jsx
<h1 className="text-display">Display Text</h1>
<h1 className="text-heading-h1">Page Title</h1>
<p className="text-body-md-regular">Body text</p>
\`\`\`

## Next Steps

1. The typography.css file has been updated with proper font data
2. All ${textStylesData.textStyles.length} text styles are available as utility classes
3. Responsive breakpoints are included for mobile/tablet/desktop
4. Test your components to ensure they use the correct classes
`;

  const reportPath = './tokens/typography-report.md';
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Generated typography report: ${reportPath}`);

  console.log('\n📋 Summary:');
  console.log(`- Generated ${textStylesData.textStyles.length} individual text style classes`);
  console.log('- Created semantic typography tokens');
  console.log('- Added responsive breakpoints');
  console.log('- Created utility classes for common usage patterns');
  console.log('\n🎉 Typography system generation complete!');
}

if (require.main === module) {
  generateTypographyCSS();
}

export { generateTypographyCSS };