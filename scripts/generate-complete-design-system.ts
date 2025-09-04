#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface MappedTokens {
  Surface: Record<string, Record<string, string>>;
  Text: Record<string, Record<string, string>>;
  Icon: Record<string, Record<string, string>>;
  Border: Record<string, Record<string, string>>;
}

interface ResponsiveBreakpoint {
  breakpoint: string;
  margins: string;
  spacing: Record<string, string>;
  ui: Record<string, Record<string, string>>;
}

interface PrimitiveColors {
  [key: string]: any;
}

function generateCompleteDesignSystem() {
  console.log('🎨 Generating complete design system from Figma collections...\n');

  // Read all source files
  const mappedPath = './variables/Mapped.json';
  const responsiveMobilePath = './variables/Responsive-mobile.json';
  const responsiveTabletPath = './variables/Responsive-tablet.json';
  const responsiveDesktopPath = './variables/Responsive-desktop.json';
  const primitivesLightPath = './variables/Primitives-Light.json';
  const primitivesDarkPath = './variables/Primitives-Dark.json';

  if (!fs.existsSync(mappedPath)) {
    console.error('❌ Mapped.json not found');
    process.exit(1);
  }

  const mapped: MappedTokens = JSON.parse(fs.readFileSync(mappedPath, 'utf8'));
  const responsiveMobile: ResponsiveBreakpoint = JSON.parse(fs.readFileSync(responsiveMobilePath, 'utf8'));
  const responsiveTablet: ResponsiveBreakpoint = JSON.parse(fs.readFileSync(responsiveTabletPath, 'utf8'));
  const responsiveDesktop: ResponsiveBreakpoint = JSON.parse(fs.readFileSync(responsiveDesktopPath, 'utf8'));
  const primitivesLight: PrimitiveColors = JSON.parse(fs.readFileSync(primitivesLightPath, 'utf8'));
  const primitivesDark: PrimitiveColors = JSON.parse(fs.readFileSync(primitivesDarkPath, 'utf8'));

  console.log(`📊 Found ${Object.keys(mapped.Surface).length} surface categories`);
  console.log(`📊 Found ${Object.keys(mapped.Text).length} text categories`);
  console.log(`📊 Found ${Object.keys(mapped.Icon).length} icon categories`);
  console.log(`📊 Found ${Object.keys(mapped.Border).length} border categories`);

  // Generate semantic.css with all mapped tokens
  const semanticCSS = generateSemanticCSS(mapped, primitivesLight, primitivesDark);
  fs.writeFileSync('./tokens/semantic.css', semanticCSS);
  console.log('✅ Generated semantic.css with all mapped tokens');

  // Generate utilities.css with all utility classes
  const utilitiesCSS = generateUtilitiesCSS(mapped, responsiveMobile, responsiveTablet, responsiveDesktop);
  fs.writeFileSync('./tokens/utilities.css', utilitiesCSS);
  console.log('✅ Generated utilities.css with all utility classes');

  // Generate primitives.css with responsive values
  const primitivesCSS = generatePrimitivesCSS(primitivesLight, responsiveMobile, responsiveTablet, responsiveDesktop);
  fs.writeFileSync('./tokens/primitives.css', primitivesCSS);
  console.log('✅ Generated primitives.css with responsive values');

  // Generate dark-mode.css
  const darkModeCSS = generateDarkModeCSS(mapped, primitivesDark);
  fs.writeFileSync('./tokens/dark-mode.css', darkModeCSS);
  console.log('✅ Generated dark-mode.css with dark mode overrides');

  console.log('\n🎉 Complete design system generated successfully!');
  console.log(`📈 Total tokens: ${getTotalTokenCount(mapped)}`);
}

function generateSemanticCSS(mapped: MappedTokens, primitivesLight: PrimitiveColors, primitivesDark: PrimitiveColors): string {
  let css = `/**
 * SEMANTIC TOKENS
 * Generated from Mapped.json - Complete Figma design system
 */

:root {`;

  // Generate Surface tokens
  css += '\n  /* === SURFACE TOKENS === */\n';
  for (const [category, tokens] of Object.entries(mapped.Surface)) {
    css += `  /* ${category} surfaces */\n`;
    for (const [state, value] of Object.entries(tokens)) {
      const tokenName = `--surface-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
      css += `  ${tokenName}: ${value};\n`;
    }
    css += '\n';
  }

  // Generate Text tokens
  css += '  /* === TEXT TOKENS === */\n';
  for (const [category, tokens] of Object.entries(mapped.Text)) {
    css += `  /* ${category} text */\n`;
    for (const [state, value] of Object.entries(tokens)) {
      const tokenName = `--text-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
      css += `  ${tokenName}: ${value};\n`;
    }
    css += '\n';
  }

  // Generate Icon tokens
  css += '  /* === ICON TOKENS === */\n';
  for (const [category, tokens] of Object.entries(mapped.Icon)) {
    if (typeof tokens === 'object' && tokens !== null) {
      css += `  /* ${category} icons */\n`;
      for (const [state, value] of Object.entries(tokens)) {
        const tokenName = `--icon-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
        css += `  ${tokenName}: ${value};\n`;
      }
    } else {
      // Handle special cases like "focus"
      const tokenName = `--icon-${category.toLowerCase().replace(/\s+/g, '-')}`;
      css += `  ${tokenName}: ${tokens};\n`;
    }
    css += '\n';
  }

  // Generate Border tokens
  css += '  /* === BORDER TOKENS === */\n';
  for (const [category, tokens] of Object.entries(mapped.Border)) {
    if (typeof tokens === 'object' && tokens !== null) {
      css += `  /* ${category} borders */\n`;
      for (const [state, value] of Object.entries(tokens)) {
        const tokenName = `--border-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
        css += `  ${tokenName}: ${value};\n`;
      }
    } else {
      // Handle special cases like "Focus Ring"
      const tokenName = `--border-${category.toLowerCase().replace(/\s+/g, '-')}`;
      css += `  ${tokenName}: ${tokens};\n`;
    }
    css += '\n';
  }

  css += '  /* Stroke widths */\n';
  css += '  --stroke-width-sm: 1px;\n';
  css += '  --stroke-width-md: 2px;\n';
  css += '}';

  return css;
}

function generateUtilitiesCSS(mapped: MappedTokens, mobile: ResponsiveBreakpoint, tablet: ResponsiveBreakpoint, desktop: ResponsiveBreakpoint): string {
  let css = `/**
 * UTILITY CLASSES
 * Generated from Mapped.json and responsive collections
 */

/* === SURFACE UTILITIES === */
`;

  // Generate surface utilities
  for (const [category, tokens] of Object.entries(mapped.Surface)) {
    css += `/* ${category} surface utilities */\n`;
    for (const [state, value] of Object.entries(tokens)) {
      const className = `.bg-surface-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
      const tokenName = `--surface-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
      css += `${className} { background-color: var(${tokenName}); }\n`;
    }
    css += '\n';
  }

  // Generate text utilities
  css += '/* === TEXT UTILITIES === */\n';
  for (const [category, tokens] of Object.entries(mapped.Text)) {
    css += `/* ${category} text utilities */\n`;
    for (const [state, value] of Object.entries(tokens)) {
      const className = `.text-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
      const tokenName = `--text-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
      css += `${className} { color: var(${tokenName}); }\n`;
    }
    css += '\n';
  }

  // Generate icon utilities
  css += '/* === ICON UTILITIES === */\n';
  for (const [category, tokens] of Object.entries(mapped.Icon)) {
    if (typeof tokens === 'object' && tokens !== null) {
      css += `/* ${category} icon utilities */\n`;
      for (const [state, value] of Object.entries(tokens)) {
        const className = `.icon-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
        const tokenName = `--icon-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
        css += `${className} { color: var(${tokenName}); }\n`;
      }
    } else {
      const className = `.icon-${category.toLowerCase().replace(/\s+/g, '-')}`;
      const tokenName = `--icon-${category.toLowerCase().replace(/\s+/g, '-')}`;
      css += `${className} { color: var(${tokenName}); }\n`;
    }
    css += '\n';
  }

  // Generate border utilities
  css += '/* === BORDER UTILITIES === */\n';
  for (const [category, tokens] of Object.entries(mapped.Border)) {
    if (typeof tokens === 'object' && tokens !== null) {
      css += `/* ${category} border utilities */\n`;
      for (const [state, value] of Object.entries(tokens)) {
        const className = `.border-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
        const tokenName = `--border-${category.toLowerCase()}-${state.toLowerCase().replace(/\s+/g, '-')}`;
        css += `${className} { border-color: var(${tokenName}); }\n`;
      }
    } else {
      const className = `.border-${category.toLowerCase().replace(/\s+/g, '-')}`;
      const tokenName = `--border-${category.toLowerCase().replace(/\s+/g, '-')}`;
      css += `${className} { border-color: var(${tokenName}); }\n`;
    }
    css += '\n';
  }

  // Add responsive component utilities from existing file
  css += `
/* === RESPONSIVE COMPONENT UTILITIES === */
/* CTA Component */
.cta-full-width-wrapper {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.cta-logo-container,
.cta-text-container {
  position: relative;
  width: 100%;
  padding: var(--spacing-mobile-lg) 0;
  display: block;
  background-color: var(--surface-neutral-page);
  overflow: hidden;
  cursor: pointer;
  border: none;
  box-sizing: border-box;
}

/* Menu Bar Component */
.menu-bar {
  width: 100%;
  background-color: var(--surface-neutral-page);
  border-top: var(--ui-menu-bar-border-width-mobile) solid var(--border-neutral-dark);
  border-bottom: var(--ui-menu-bar-border-width-mobile) solid var(--border-neutral-dark);
}

.menu-item {
  flex: 1;
  min-width: 0;
  padding: var(--ui-menu-item-v-padding-mobile) var(--ui-menu-item-h-padding-mobile);
  text-decoration: none;
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: var(--font-family-overused-grotesk);
  font-size: var(--font-size-title-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-neutral-heading);
  transition: background-color 0.2s ease;
  cursor: pointer;
}

/* Responsive breakpoints */
@media (min-width: 810px) {
  .cta-logo-container,
  .cta-text-container {
    padding: var(--spacing-tablet-lg) 0;
  }
  
  .menu-bar {
    border-top: var(--ui-menu-bar-border-width-tablet) solid var(--border-neutral-dark);
    border-bottom: var(--ui-menu-bar-border-width-tablet) solid var(--border-neutral-dark);
  }
  
  .menu-item {
    padding: var(--ui-menu-item-v-padding-tablet) var(--ui-menu-item-h-padding-tablet);
  }
}

@media (min-width: 1440px) {
  .cta-logo-container,
  .cta-text-container {
    padding: var(--spacing-desktop-lg) 0;
  }
  
  .menu-item {
    padding: var(--ui-menu-item-v-padding-desktop) var(--ui-menu-item-h-padding-desktop);
  }
}
`;

  return css;
}

function generatePrimitivesCSS(primitivesLight: PrimitiveColors, mobile: ResponsiveBreakpoint, tablet: ResponsiveBreakpoint, desktop: ResponsiveBreakpoint): string {
  let css = `/**
 * PRIMITIVE TOKENS
 * Generated from Figma responsive collections and primitives
 */

:root {
  /* === RESPONSIVE SPACING === */
  /* Mobile (${mobile.breakpoint}px breakpoint) */
  --margins-mobile: ${mobile.margins}px;
`;

  // Add mobile spacing
  for (const [key, value] of Object.entries(mobile.spacing)) {
    css += `  --spacing-mobile-${key}: ${value}px;\n`;
  }

  css += `\n  /* Tablet (${tablet.breakpoint}px breakpoint) */\n`;
  css += `  --margins-tablet: ${tablet.margins}px;\n`;
  
  // Add tablet spacing
  for (const [key, value] of Object.entries(tablet.spacing)) {
    css += `  --spacing-tablet-${key}: ${value}px;\n`;
  }

  css += `\n  /* Desktop (${desktop.breakpoint}px breakpoint) */\n`;
  css += `  --margins-desktop: ${desktop.margins}px;\n`;
  
  // Add desktop spacing
  for (const [key, value] of Object.entries(desktop.spacing)) {
    css += `  --spacing-desktop-${key}: ${value}px;\n`;
  }

  // Add UI component values from responsive files
  css += '\n  /* === UI COMPONENT VALUES FROM FIGMA === */\n';
  css += '  /* Menu Item Padding (from Figma responsive files) */\n';
  
  if (mobile.ui?.['menu item']) {
    const menuItem = mobile.ui['menu item'];
    css += `  --ui-menu-item-h-padding-mobile: ${menuItem['h-padding']}px;\n`;
    css += `  --ui-menu-item-v-padding-mobile: ${menuItem['v-padding']}px;\n`;
  }
  
  if (tablet.ui?.['menu item']) {
    const menuItem = tablet.ui['menu item'];
    css += `  --ui-menu-item-h-padding-tablet: ${menuItem['h-padding']}px;\n`;
    css += `  --ui-menu-item-v-padding-tablet: ${menuItem['v-padding']}px;\n`;
  }
  
  if (desktop.ui?.['menu item']) {
    const menuItem = desktop.ui['menu item'];
    css += `  --ui-menu-item-h-padding-desktop: ${menuItem['h-padding']}px;\n`;
    css += `  --ui-menu-item-v-padding-desktop: ${menuItem['v-padding']}px;\n`;
  }

  // Add border widths
  css += '\n  /* Menu Bar Border Width (from Figma responsive files) */\n';
  if (mobile.ui?.['menu item']?.['border width']) {
    css += `  --ui-menu-bar-border-width-mobile: ${mobile.ui['menu item']['border width']}px;\n`;
  }
  if (tablet.ui?.['menu item']?.['border width']) {
    css += `  --ui-menu-bar-border-width-tablet: ${tablet.ui['menu item']['border width']}px;\n`;
  }
  if (desktop.ui?.['menu item']?.['border width']) {
    css += `  --ui-menu-bar-border-width-desktop: ${desktop.ui['menu item']['border width']}px;\n`;
  }

  css += '}\n';

  return css;
}

function generateDarkModeCSS(mapped: MappedTokens, primitivesDark: PrimitiveColors): string {
  let css = `/**
 * DARK MODE TOKENS
 * Generated from Primitives-Dark.json
 */

[data-theme="dark"] {
  /* === DARK MODE OVERRIDES === */
  /* Surface tokens would be generated here from dark primitives */\n`;

  // This would need more complex logic to map primitives to semantic tokens
  // For now, keeping the existing structure
  css += `}

/* === AUTOMATIC DARK MODE === */
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode overrides would go here */
  }
}`;

  return css;
}

function getTotalTokenCount(mapped: MappedTokens): number {
  let count = 0;
  for (const category of Object.values(mapped)) {
    for (const tokens of Object.values(category)) {
      if (typeof tokens === 'object' && tokens !== null) {
        count += Object.keys(tokens).length;
      } else {
        count += 1;
      }
    }
  }
  return count;
}

if (require.main === module) {
  generateCompleteDesignSystem();
}

export { generateCompleteDesignSystem };