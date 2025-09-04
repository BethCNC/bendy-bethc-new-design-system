#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface FigmaVariable {
  name: string;
  value: string | number | boolean;
  type: string;
  description?: string;
}

interface FigmaComponent {
  id: string;
  name: string;
  type: string;
  properties: Record<string, any>;
  tokens: FigmaVariable[];
}

interface DesignSystemData {
  variables: FigmaVariable[];
  components: FigmaComponent[];
  colors: Record<string, string | number | boolean>;
  typography: Record<string, string | number | boolean>;
  spacing: Record<string, string | number | boolean>;
  breakpoints: Record<string, string | number | boolean>;
  extractedAt: string;
}

async function extractFigmaDesignSystem() {
  console.log('🎨 Extracting Figma Design System...\n');

  // Design tokens extracted from Figma API response
  const designTokens: FigmaVariable[] = [
    // Colors
    { name: 'color-yellow-500', value: '#f0f081', type: 'color' },
    { name: 'color-green-500', value: '#85edb0', type: 'color' },
    { name: 'color-pink-500', value: '#f0aaf0', type: 'color' },
    { name: 'color-primary', value: '#cf4326', type: 'color' },
    { name: 'text-neutral-display', value: '#0c0d0d', type: 'color' },
    { name: 'text-neutral-heading', value: '#252626', type: 'color' },
    { name: 'text-neutral-title', value: '#3e4040', type: 'color' },
    { name: 'text-neutral-body', value: '#3e4040', type: 'color' },
    { name: 'text-neutral-disabled', value: '#bbbfbf', type: 'color' },
    { name: 'text-neutral-inverse', value: '#f9fafa', type: 'color' },
    { name: 'text-primary-default', value: '#f0f081', type: 'color' },
    { name: 'text-primary-disabled', value: '#f5f5ab', type: 'color' },
    { name: 'text-secondary-disabled', value: '#f5c6f5', type: 'color' },
    { name: 'text-error-disabled', value: '#ffc3cf', type: 'color' },
    { name: 'text-info-hover', value: '#306eca', type: 'color' },
    { name: 'text-default', value: '#09090b', type: 'color' },
    { name: 'text-muted', value: '#71717a', type: 'color' },
    { name: 'text-headings', value: '#000000', type: 'color' },
    { name: 'text-primary', value: '#000000', type: 'color' },
    { name: 'text-secondary', value: '#6b6b6b', type: 'color' },
    { name: 'text-neutral-subtle-inverse', value: '#f1f2f2', type: 'color' },
    
    // Surfaces
    { name: 'surface-primary-default', value: '#f0f081', type: 'color' },
    { name: 'surface-primary-hover', value: '#f5f5ab', type: 'color' },
    { name: 'surface-primary-disabled', value: '#fcfce6', type: 'color' },
    { name: 'surface-secondary-default', value: '#f0aaf0', type: 'color' },
    { name: 'surface-secondary-hover', value: '#c88ec8', type: 'color' },
    { name: 'surface-secondary-disabled', value: '#fceefc', type: 'color' },
    { name: 'surface-error-default', value: '#ff879f', type: 'color' },
    { name: 'surface-error-hover', value: '#e57a8f', type: 'color' },
    { name: 'surface-error-disabled', value: '#ffe7ec', type: 'color' },
    { name: 'surface-neutral-page', value: '#f9fafa', type: 'color' },
    { name: 'surface-neutral-inverse', value: '#252626', type: 'color' },
    { name: 'surface-neutral-inverse-hover', value: '#3e4040', type: 'color' },
    { name: 'surface-neutral-disabled', value: '#d2d4d4', type: 'color' },
    { name: 'surface-neutral-focus', value: '#dddfdf', type: 'color' },
    { name: 'surface-neutral-elevated', value: '#e8eaea', type: 'color' },
    { name: 'surface-neutral-hover', value: '#f9fafa4d', type: 'color' },
    { name: 'surface-info-default', value: '#3a84f2', type: 'color' },
    { name: 'surface-info-hover', value: '#306eca', type: 'color' },
    { name: 'surface-warning-default', value: '#ffa970', type: 'color' },
    { name: 'surface-warning-hover', value: '#d48d5d', type: 'color' },
    { name: 'surface-success-default', value: '#85edb0', type: 'color' },
    { name: 'surface-success-hover', value: '#6fc593', type: 'color' },
    { name: 'surface-tertiary-default', value: '#83e9f2', type: 'color' },
    { name: 'surface-tertiary-hover', value: '#6dc2ca', type: 'color' },
    { name: 'background-neutral-inverse-default', value: '#252626', type: 'color' },
    { name: 'background-neutral-inverse-elevated', value: '#5e6060', type: 'color' },
    { name: 'color-surface-default-page', value: '#f4f4f5', type: 'color' },
    { name: 'text-default', value: '#101011', type: 'color' },
    { name: 'bg', value: '#ffffff', type: 'color' },
    { name: 'bg-hover', value: '#f4f4f5', type: 'color' },
    { name: 'bg-secondary', value: '#ffffff', type: 'color' },
    { name: 'border-default', value: '#e4e4e7', type: 'color' },
    
    // Borders
    { name: 'border-primary-default', value: '#f0f081', type: 'color' },
    { name: 'border-neutral-dark-subtle', value: '#3e4040', type: 'color' },
    { name: 'border-neutral-dark-muted', value: '#5e6060', type: 'color' },
    { name: 'border-neutral-dark', value: '#252626', type: 'color' },
    { name: 'border-neutral-inverse-subtle', value: '#f1f2f2', type: 'color' },
    { name: 'border-error-default', value: '#ff879f', type: 'color' },
    { name: 'border-warning-default', value: '#ffa970', type: 'color' },
    { name: 'border-success-default', value: '#85edb0', type: 'color' },
    { name: 'border-focus-ring', value: '#3a84f2', type: 'color' },
    { name: 'border-neutral-disabled', value: '#bbbfbf', type: 'color' },
    
    // Icons
    { name: 'icon-primary-default', value: '#f0f081', type: 'color' },
    { name: 'icon-primary-disabled', value: '#f5f5ab', type: 'color' },
    { name: 'icon-secondary-disabled', value: '#f5c6f5', type: 'color' },
    { name: 'icon-error-disabled', value: '#ffc3cf', type: 'color' },
    { name: 'icon-neutral-display', value: '#0c0d0d', type: 'color' },
    { name: 'icon-neutral-display-inverse', value: '#f9fafa', type: 'color' },
    { name: 'icon-neutral-title', value: '#3e4040', type: 'color' },
    { name: 'icon-neutral-heading', value: '#252626', type: 'color' },
    { name: 'icon-neutral-disabled', value: '#bbbfbf', type: 'color' },
    { name: 'icon-focus', value: '#3a84f2', type: 'color' },
    { name: 'icon-info-default', value: '#3a84f2', type: 'color' },
    { name: 'icon-error-default', value: '#ff879f', type: 'color' },
    { name: 'icon-warning-default', value: '#ffa970', type: 'color' },
    
    // Typography - Font Sizes
    { name: 'font-size-display', value: 128, type: 'fontSize' },
    { name: 'font-size-heading-h1', value: 96, type: 'fontSize' },
    { name: 'font-size-heading-h2', value: 72, type: 'fontSize' },
    { name: 'font-size-heading-h3', value: 60, type: 'fontSize' },
    { name: 'font-size-heading-h4', value: 48, type: 'fontSize' },
    { name: 'font-size-heading-h5', value: 36, type: 'fontSize' },
    { name: 'font-size-heading-h6', value: 30, type: 'fontSize' },
    { name: 'font-size-title-xl', value: 60, type: 'fontSize' },
    { name: 'font-size-title-lg', value: 48, type: 'fontSize' },
    { name: 'font-size-title-md', value: 36, type: 'fontSize' },
    { name: 'font-size-title-sm', value: 30, type: 'fontSize' },
    { name: 'font-size-title-xs', value: 24, type: 'fontSize' },
    { name: 'font-size-body-lg', value: 18, type: 'fontSize' },
    { name: 'font-size-body-md', value: 16, type: 'fontSize' },
    { name: 'font-size-body-sm', value: 14, type: 'fontSize' },
    { name: 'font-size-body-xs', value: 12, type: 'fontSize' },
    
    // Typography - Line Heights
    { name: 'line-height-display', value: 136, type: 'lineHeight' },
    { name: 'line-height-heading-h1', value: 128, type: 'lineHeight' },
    { name: 'line-height-heading-h2', value: 96, type: 'lineHeight' },
    { name: 'line-height-heading-h3', value: 72, type: 'lineHeight' },
    { name: 'line-height-heading-h4', value: 60, type: 'lineHeight' },
    { name: 'line-height-heading-h5', value: 48, type: 'lineHeight' },
    { name: 'line-height-heading-h6', value: 40, type: 'lineHeight' },
    { name: 'line-height-title-xl', value: 72, type: 'lineHeight' },
    { name: 'line-height-title-lg', value: 60, type: 'lineHeight' },
    { name: 'line-height-title-base', value: 48, type: 'lineHeight' },
    { name: 'line-height-title-sm', value: 40, type: 'lineHeight' },
    { name: 'line-height-title-xs', value: 32, type: 'lineHeight' },
    { name: 'line-height-body-lg', value: 24, type: 'lineHeight' },
    { name: 'line-height-body-md', value: 24, type: 'lineHeight' },
    { name: 'line-height-body-sm', value: 20, type: 'lineHeight' },
    { name: 'line-height-body-xs', value: 16, type: 'lineHeight' },
    
    // Typography - Font Weights
    { name: 'font-weight-regular', value: 400, type: 'fontWeight' },
    { name: 'font-weight-medium', value: 500, type: 'fontWeight' },
    { name: 'font-weight-semibold', value: 600, type: 'fontWeight' },
    
    // Typography - Font Families
    { name: 'font-family-display', value: 'Behind The Nineties', type: 'fontFamily' },
    { name: 'font-family-title', value: 'Overused Grotesk', type: 'fontFamily' },
    { name: 'font-family-body', value: 'Overused Grotesk', type: 'fontFamily' },
    
    // Spacing
    { name: 'spacing-0', value: 0, type: 'spacing' },
    { name: 'spacing-1', value: 4, type: 'spacing' },
    { name: 'spacing-2', value: 8, type: 'spacing' },
    { name: 'spacing-2xs', value: 4, type: 'spacing' },
    { name: 'spacing-3', value: 12, type: 'spacing' },
    { name: 'spacing-4', value: 16, type: 'spacing' },
    { name: 'spacing-6', value: 24, type: 'spacing' },
    { name: 'spacing-md', value: 24, type: 'spacing' },
    { name: 'spacing-lg', value: 48, type: 'spacing' },
    { name: 'spacing-xl', value: 24, type: 'spacing' },
    { name: 'spacing-12', value: 48, type: 'spacing' },
    { name: 'margins', value: 96, type: 'spacing' },
    
    // Border Radius
    { name: 'radius-none', value: 0, type: 'borderRadius' },
    { name: 'radius-2xl', value: 12, type: 'borderRadius' },
    { name: 'radius-xl', value: 8, type: 'borderRadius' },
    { name: 'radius-full', value: 999, type: 'borderRadius' },
    { name: 'radius-3xl', value: 24, type: 'borderRadius' },
    { name: 'radius-md', value: 6, type: 'borderRadius' },
    { name: 'radius-sm', value: 4, type: 'borderRadius' },
    
    // Border Widths
    { name: 'border-width-sm', value: 2, type: 'borderWidth' },
    { name: 'border-width-md', value: 1, type: 'borderWidth' },
    { name: 'border-width-lg', value: 4, type: 'borderWidth' },
    
    // Stroke Widths
    { name: 'stroke-width-xs', value: 0.5, type: 'strokeWidth' },
    { name: 'stroke-width-sm', value: 1, type: 'strokeWidth' },
    { name: 'stroke-width-md', value: 2, type: 'strokeWidth' },
    { name: 'stroke-width-lg', value: 4, type: 'strokeWidth' },
    
    // Breakpoints
    { name: 'breakpoint-desktop', value: 1440, type: 'breakpoint' },
    { name: 'breakpoint-tablet', value: 810, type: 'breakpoint' },
    { name: 'breakpoint-mobile', value: 390, type: 'breakpoint' },
    
    // Component Specific Tokens
    { name: 'button-spacing', value: 6, type: 'spacing' },
    { name: 'button-h-padding', value: 8, type: 'spacing' },
    { name: 'button-v-padding', value: 4, type: 'spacing' },
    { name: 'button-radius', value: 6, type: 'borderRadius' },
    { name: 'button-full-padding', value: 8, type: 'spacing' },
    { name: 'button-icon-size', value: 16, type: 'size' },
    { name: 'button-icon-border-width', value: 1, type: 'borderWidth' },
    
    { name: 'chip-spacing', value: 4, type: 'spacing' },
    { name: 'chip-radius', value: 9999, type: 'borderRadius' },
    { name: 'chip-icon-size', value: 10, type: 'size' },
    { name: 'chip-full-padding', value: 4, type: 'spacing' },
    { name: 'chip-h-padding', value: 8, type: 'spacing' },
    { name: 'chip-v-padding', value: 2, type: 'spacing' },
    { name: 'chip-border-width', value: 0.5, type: 'borderWidth' },
    { name: 'chip-focus-border-width', value: 1, type: 'borderWidth' },
    { name: 'chip-icon-border-width', value: 1, type: 'borderWidth' },
    
    { name: 'ui-menu-item-spacing', value: 0, type: 'spacing' },
    { name: 'ui-menu-item-h-padding', value: 16, type: 'spacing' },
    { name: 'ui-menu-item-v-padding', value: 12, type: 'spacing' },
    { name: 'ui-menu-item-radius', value: 8, type: 'borderRadius' },
    { name: 'ui-menu-item-border-width', value: 4, type: 'borderWidth' },
    { name: 'ui-menu-item-text', value: true, type: 'boolean' },
    { name: 'ui-menu-item-icon', value: false, type: 'boolean' },
    
    { name: 'ui-navigation-menu-content-item-spacing', value: 4, type: 'spacing' },
    { name: 'ui-navigation-menu-content-item-h-padding', value: 8, type: 'spacing' },
    { name: 'ui-navigation-menu-content-item-v-padding', value: 12, type: 'spacing' },
    { name: 'ui-navigation-menu-content-item-radius', value: 8, type: 'borderRadius' },
    
    { name: 'title-item-spacing', value: 48, type: 'spacing' },
    { name: 'title-padding', value: 64, type: 'spacing' },
    
    // Effects
    { name: 'blur-sm', value: 4, type: 'blur' },
    
    // Opacity
    { name: 'color-opacity-pink-30', value: '#f0aaf04d', type: 'color' },
    { name: 'color-opacity-pink-50', value: '#f0aaf080', type: 'color' },
    { name: 'color-opacity-pink-80', value: '#f0aaf0cc', type: 'color' },
    { name: 'state-disabled', value: 50, type: 'opacity' },
  ];

  // Organize tokens by category
  const colors = designTokens.filter(token => token.type === 'color');
  const typography = designTokens.filter(token => ['fontSize', 'lineHeight', 'fontWeight', 'fontFamily'].includes(token.type));
  const spacing = designTokens.filter(token => token.type === 'spacing');
  const breakpoints = designTokens.filter(token => token.type === 'breakpoint');

  const designSystemData: DesignSystemData = {
    variables: designTokens,
    components: [], // Will be populated with component details
    colors: Object.fromEntries(colors.map(token => [token.name, token.value])),
    typography: Object.fromEntries(typography.map(token => [token.name, token.value])),
    spacing: Object.fromEntries(spacing.map(token => [token.name, token.value])),
    breakpoints: Object.fromEntries(breakpoints.map(token => [token.name, token.value])),
    extractedAt: new Date().toISOString()
  };

  // Create output directory
  const outputDir = path.join(process.cwd(), 'data', 'figma-design-system');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save comprehensive design system data
  const designSystemPath = path.join(outputDir, 'design-system.json');
  fs.writeFileSync(designSystemPath, JSON.stringify(designSystemData, null, 2));
  console.log(`✅ Design system data saved to: ${designSystemPath}`);

  // Save individual token files
  const tokensDir = path.join(outputDir, 'tokens');
  if (!fs.existsSync(tokensDir)) {
    fs.mkdirSync(tokensDir, { recursive: true });
  }

  // Colors
  const colorsPath = path.join(tokensDir, 'colors.json');
  fs.writeFileSync(colorsPath, JSON.stringify(colors, null, 2));
  console.log(`✅ Colors saved to: ${colorsPath}`);

  // Typography
  const typographyPath = path.join(tokensDir, 'typography.json');
  fs.writeFileSync(typographyPath, JSON.stringify(typography, null, 2));
  console.log(`✅ Typography saved to: ${typographyPath}`);

  // Spacing
  const spacingPath = path.join(tokensDir, 'spacing.json');
  fs.writeFileSync(spacingPath, JSON.stringify(spacing, null, 2));
  console.log(`✅ Spacing saved to: ${spacingPath}`);

  // Breakpoints
  const breakpointsPath = path.join(tokensDir, 'breakpoints.json');
  fs.writeFileSync(breakpointsPath, JSON.stringify(breakpoints, null, 2));
  console.log(`✅ Breakpoints saved to: ${breakpointsPath}`);

  // Generate CSS variables file
  const cssVariablesPath = path.join(outputDir, 'css-variables.css');
  const cssVariables = generateCSSVariables(designTokens);
  fs.writeFileSync(cssVariablesPath, cssVariables);
  console.log(`✅ CSS variables saved to: ${cssVariablesPath}`);

  // Generate summary report
  const summaryPath = path.join(outputDir, 'summary.md');
  const summary = generateSummary(designSystemData);
  fs.writeFileSync(summaryPath, summary);
  console.log(`✅ Summary report saved to: ${summaryPath}`);

  console.log('\n🎉 Figma Design System extraction complete!');
  console.log(`📊 Extracted ${designTokens.length} design tokens`);
  console.log(`🎨 ${colors.length} colors`);
  console.log(`📝 ${typography.length} typography tokens`);
  console.log(`📏 ${spacing.length} spacing tokens`);
  console.log(`📱 ${breakpoints.length} breakpoints`);
}

function generateCSSVariables(tokens: FigmaVariable[]): string {
  let css = ':root {\n';
  
  // Group tokens by type for better organization
  const colors = tokens.filter(t => t.type === 'color');
  const spacing = tokens.filter(t => t.type === 'spacing');
  const typography = tokens.filter(t => ['fontSize', 'lineHeight', 'fontWeight'].includes(t.type));
  const breakpoints = tokens.filter(t => t.type === 'breakpoint');
  const borders = tokens.filter(t => ['borderRadius', 'borderWidth'].includes(t.type));
  const effects = tokens.filter(t => ['blur', 'opacity'].includes(t.type));
  const components = tokens.filter(t => t.name.startsWith('button-') || t.name.startsWith('chip-') || t.name.startsWith('ui-'));

  // Colors
  css += '\n  /* Colors */\n';
  colors.forEach(token => {
    css += `  --${token.name}: ${token.value};\n`;
  });

  // Spacing
  css += '\n  /* Spacing */\n';
  spacing.forEach(token => {
    css += `  --spacing-${token.name.replace('spacing-', '')}: ${token.value}px;\n`;
  });

  // Typography
  css += '\n  /* Typography */\n';
  typography.forEach(token => {
    const cleanName = token.name.replace(/^(font-size|line-height|font-weight)-/, '');
    css += `  --${token.name}: ${token.value}${token.type === 'fontSize' || token.type === 'lineHeight' ? 'px' : ''};\n`;
  });

  // Breakpoints
  css += '\n  /* Breakpoints */\n';
  breakpoints.forEach(token => {
    css += `  --${token.name}: ${token.value}px;\n`;
  });

  // Borders
  css += '\n  /* Borders */\n';
  borders.forEach(token => {
    css += `  --${token.name}: ${token.value}px;\n`;
  });

  // Effects
  css += '\n  /* Effects */\n';
  effects.forEach(token => {
    css += `  --${token.name}: ${token.value}${token.type === 'blur' ? 'px' : '%'};\n`;
  });

  // Component tokens
  css += '\n  /* Component Tokens */\n';
  components.forEach(token => {
    css += `  --${token.name}: ${token.value}${['spacing', 'borderRadius', 'borderWidth', 'size'].includes(token.type) ? 'px' : ''};\n`;
  });

  css += '}\n';
  return css;
}

function generateSummary(data: DesignSystemData): string {
  return `# Figma Design System Summary

Extracted on: ${data.extractedAt}

## 📊 Overview
- **Total Tokens**: ${data.variables.length}
- **Colors**: ${Object.keys(data.colors).length}
- **Typography**: ${Object.keys(data.typography).length}
- **Spacing**: ${Object.keys(data.spacing).length}
- **Breakpoints**: ${Object.keys(data.breakpoints).length}

## 🎨 Color Palette
${Object.entries(data.colors).map(([name, value]) => `- \`${name}\`: \`${value}\``).join('\n')}

## 📝 Typography Scale
${Object.entries(data.typography).map(([name, value]) => `- \`${name}\`: \`${value}\``).join('\n')}

## 📏 Spacing Scale
${Object.entries(data.spacing).map(([name, value]) => `- \`${name}\`: \`${value}px\``).join('\n')}

## 📱 Breakpoints
${Object.entries(data.breakpoints).map(([name, value]) => `- \`${name}\`: \`${value}px\``).join('\n')}

## 🔧 Usage
This design system should be used consistently across all components. All values are available as CSS custom properties in the generated \`css-variables.css\` file.

## 📁 Files Generated
- \`design-system.json\` - Complete design system data
- \`tokens/colors.json\` - Color tokens only
- \`tokens/typography.json\` - Typography tokens only
- \`tokens/spacing.json\` - Spacing tokens only
- \`tokens/breakpoints.json\` - Breakpoint tokens only
- \`css-variables.css\` - CSS custom properties
- \`summary.md\` - This summary file
`;
}

// Run the extraction
extractFigmaDesignSystem().catch(console.error); 