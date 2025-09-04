#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface DesignToken {
  name: string;
  value: string | number | boolean;
  type: string;
}

interface ComponentUpdate {
  file: string;
  violations: string[];
  fixes: string[];
}

// Load design tokens from Figma extraction
function loadDesignTokens(): Record<string, string> {
  const designSystemPath = path.join(process.cwd(), 'data', 'figma-design-system', 'design-system.json');
  const designSystem = JSON.parse(fs.readFileSync(designSystemPath, 'utf8'));
  
  const tokens: Record<string, string> = {};
  designSystem.variables.forEach((token: DesignToken) => {
    tokens[token.name] = String(token.value);
  });
  
  return tokens;
}

// Create CSS class mappings for design tokens
function createTokenMappings(tokens: Record<string, string>): Record<string, string> {
  const mappings: Record<string, string> = {};
  
  // Color mappings
  Object.entries(tokens).forEach(([name, value]) => {
    if (name.includes('color-') || name.includes('text-') || name.includes('surface-') || 
        name.includes('border-') || name.includes('icon-') || name.includes('bg')) {
      mappings[name] = value;
    }
  });
  
  return mappings;
}

// Generate CSS classes for design tokens
function generateTokenCSS(tokens: Record<string, string>): string {
  let css = '/* Design Token Classes Generated from Figma */\n\n';
  
  // Color classes
  css += '/* Color Classes */\n';
  Object.entries(tokens).forEach(([name, value]) => {
    if (name.includes('color-') || name.includes('text-') || name.includes('surface-') || 
        name.includes('border-') || name.includes('icon-') || name.includes('bg')) {
      css += `.${name} { ${name.includes('text-') ? 'color' : 'background-color'}: ${value}; }\n`;
    }
  });
  
  // Spacing classes
  css += '\n/* Spacing Classes */\n';
  Object.entries(tokens).forEach(([name, value]) => {
    if (name.includes('spacing-') || name.includes('button-') || name.includes('chip-') || 
        name.includes('ui-') || name.includes('title-') || name.includes('margins')) {
      const spacingValue = value.replace('px', '');
      css += `.p-${name} { padding: ${spacingValue}px; }\n`;
      css += `.m-${name} { margin: ${spacingValue}px; }\n`;
      css += `.px-${name} { padding-left: ${spacingValue}px; padding-right: ${spacingValue}px; }\n`;
      css += `.py-${name} { padding-top: ${spacingValue}px; padding-bottom: ${spacingValue}px; }\n`;
      css += `.mx-${name} { margin-left: ${spacingValue}px; margin-right: ${spacingValue}px; }\n`;
      css += `.my-${name} { margin-top: ${spacingValue}px; margin-bottom: ${spacingValue}px; }\n`;
    }
  });
  
  // Typography classes
  css += '\n/* Typography Classes */\n';
  Object.entries(tokens).forEach(([name, value]) => {
    if (name.includes('font-size-')) {
      const sizeValue = value.replace('px', '');
      css += `.text-${name.replace('font-size-', '')} { font-size: ${sizeValue}px; }\n`;
    }
    if (name.includes('line-height-')) {
      const heightValue = value.replace('px', '');
      css += `.leading-${name.replace('line-height-', '')} { line-height: ${heightValue}px; }\n`;
    }
    if (name.includes('font-weight-')) {
      css += `.font-${name.replace('font-weight-', '')} { font-weight: ${value}; }\n`;
    }
    if (name.includes('font-family-')) {
      css += `.font-${name.replace('font-family-', '')} { font-family: ${value}; }\n`;
    }
  });
  
  // Border radius classes
  css += '\n/* Border Radius Classes */\n';
  Object.entries(tokens).forEach(([name, value]) => {
    if (name.includes('radius-')) {
      const radiusValue = value.replace('px', '');
      css += `.rounded-${name.replace('radius-', '')} { border-radius: ${radiusValue}px; }\n`;
    }
  });
  
  return css;
}

// Update components with design tokens
function updateComponentsWithTokens(tokens: Record<string, string>): ComponentUpdate[] {
  const updates: ComponentUpdate[] = [];
  const componentsDir = path.join(process.cwd(), 'app', 'components', 'ui');
  
  if (!fs.existsSync(componentsDir)) {
    console.log('❌ Components directory not found');
    return updates;
  }
  
  const componentFiles = fs.readdirSync(componentsDir).filter(file => file.endsWith('.tsx'));
  
  componentFiles.forEach(file => {
    const filePath = path.join(componentsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const violations: string[] = [];
    const fixes: string[] = [];
    
    // Check for hardcoded colors
    const colorMatches = content.match(/#[0-9a-fA-F]{3,6}/g) || [];
    colorMatches.forEach(color => {
      violations.push(`Hardcoded color: ${color}`);
      // Find matching token
      const matchingToken = Object.entries(tokens).find(([name, value]) => value.toLowerCase() === color.toLowerCase());
      if (matchingToken) {
        fixes.push(`Replace ${color} with ${matchingToken[0]}`);
      }
    });
    
    // Check for Tailwind color classes
    const tailwindColorMatches = content.match(/text-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]+/g) || [];
    tailwindColorMatches.forEach(match => {
      violations.push(`Tailwind color class: ${match}`);
      fixes.push(`Replace ${match} with appropriate design token class`);
    });
    
    // Check for hardcoded spacing
    const spacingMatches = content.match(/(padding|margin):\s*[0-9]+px/g) || [];
    spacingMatches.forEach(match => {
      violations.push(`Hardcoded spacing: ${match}`);
      fixes.push(`Replace ${match} with design token spacing class`);
    });
    
    // Check for Tailwind spacing classes
    const tailwindSpacingMatches = content.match(/(p|m|px|py|mx|my)-[0-9]+/g) || [];
    tailwindSpacingMatches.forEach(match => {
      violations.push(`Tailwind spacing class: ${match}`);
      fixes.push(`Replace ${match} with design token spacing class`);
    });
    
    if (violations.length > 0) {
      updates.push({
        file,
        violations,
        fixes
      });
    }
  });
  
  return updates;
}

// Main function
async function main() {
  console.log('🎨 Updating Components with Figma Design Tokens...\n');
  
  // Load design tokens
  const tokens = loadDesignTokens();
  console.log(`✅ Loaded ${Object.keys(tokens).length} design tokens from Figma`);
  
  // Generate token mappings
  const mappings = createTokenMappings(tokens);
  console.log(`✅ Created ${Object.keys(mappings).length} token mappings`);
  
  // Generate CSS classes
  const tokenCSS = generateTokenCSS(tokens);
  const cssPath = path.join(process.cwd(), 'data', 'figma-design-system', 'token-classes.css');
  fs.writeFileSync(cssPath, tokenCSS);
  console.log(`✅ Generated CSS classes: ${cssPath}`);
  
  // Update components
  const updates = updateComponentsWithTokens(tokens);
  
  console.log('\n📊 Component Analysis Results:');
  console.log(`📁 Scanned ${updates.length} components with violations`);
  
  updates.forEach(update => {
    console.log(`\n🔍 ${update.file}:`);
    console.log(`   Violations: ${update.violations.length}`);
    update.violations.forEach(violation => {
      console.log(`   ❌ ${violation}`);
    });
    update.fixes.forEach(fix => {
      console.log(`   ✅ ${fix}`);
    });
  });
  
  // Generate report
  const reportPath = path.join(process.cwd(), 'data', 'figma-design-system', 'component-update-report.md');
  const report = generateReport(updates, tokens);
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report saved: ${reportPath}`);
  
  console.log('\n🎉 Component analysis complete!');
  console.log('💡 Use the generated CSS classes and token mappings to update your components.');
}

function generateReport(updates: ComponentUpdate[], tokens: Record<string, string>): string {
  return `# Component Update Report

Generated on: ${new Date().toISOString()}

## 📊 Summary
- **Components with violations**: ${updates.length}
- **Total violations found**: ${updates.reduce((sum, update) => sum + update.violations.length, 0)}
- **Design tokens available**: ${Object.keys(tokens).length}

## 🎨 Available Design Tokens

### Colors (${Object.keys(tokens).filter(k => k.includes('color') || k.includes('text') || k.includes('surface') || k.includes('border') || k.includes('icon') || k.includes('bg')).length})
${Object.keys(tokens)
  .filter(k => k.includes('color') || k.includes('text') || k.includes('surface') || k.includes('border') || k.includes('icon') || k.includes('bg'))
  .map(name => `- \`${name}\`: \`${tokens[name]}\``)
  .join('\n')}

### Spacing (${Object.keys(tokens).filter(k => k.includes('spacing') || k.includes('button') || k.includes('chip') || k.includes('ui') || k.includes('title') || k.includes('margins')).length})
${Object.keys(tokens)
  .filter(k => k.includes('spacing') || k.includes('button') || k.includes('chip') || k.includes('ui') || k.includes('title') || k.includes('margins'))
  .map(name => `- \`${name}\`: \`${tokens[name]}\``)
  .join('\n')}

### Typography (${Object.keys(tokens).filter(k => k.includes('font') || k.includes('line-height')).length})
${Object.keys(tokens)
  .filter(k => k.includes('font') || k.includes('line-height'))
  .map(name => `- \`${name}\`: \`${tokens[name]}\``)
  .join('\n')}

## 🔍 Component Violations

${updates.map(update => `
### ${update.file}
**Violations**: ${update.violations.length}

${update.violations.map(v => `- ❌ ${v}`).join('\n')}

**Suggested Fixes**:
${update.fixes.map(f => `- ✅ ${f}`).join('\n')}
`).join('\n')}

## 🛠️ Next Steps
1. Review the violations in each component
2. Replace hardcoded values with design token classes
3. Use the generated CSS classes from \`token-classes.css\`
4. Test components to ensure proper styling
5. Run the linting script to verify fixes

## 📁 Generated Files
- \`token-classes.css\` - CSS classes for all design tokens
- \`component-update-report.md\` - This report
`;
}

// Run the script
main().catch(console.error); 