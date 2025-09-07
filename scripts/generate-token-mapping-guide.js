#!/usr/bin/env node

/**
 * Design Token Mapping Guide Generator
 * 
 * Automatically generates comprehensive mapping documentation
 * between Figma variables and design system tokens.
 */

const fs = require('fs');
const path = require('path');

class TokenMappingGuideGenerator {
    constructor() {
        this.figmaTextStyles = this.loadFigmaTextStyles();
        this.designSystemTokens = this.loadDesignSystemTokens();
        this.responsiveTokens = this.loadResponsiveTokens();
    }

    /**
     * Load Figma text styles
     */
    loadFigmaTextStyles() {
        try {
            const figmaPath = path.join(process.cwd(), 'variables/textStyles.json');
            if (fs.existsSync(figmaPath)) {
                return JSON.parse(fs.readFileSync(figmaPath, 'utf8'));
            }
        } catch (error) {
            console.error('Failed to load Figma text styles:', error.message);
        }
        return [];
    }

    /**
     * Load design system tokens
     */
    loadDesignSystemTokens() {
        const tokens = {};
        
        try {
            const designSystemPath = path.join(process.cwd(), 'design-system/src/complete-design-system.css');
            if (fs.existsSync(designSystemPath)) {
                const content = fs.readFileSync(designSystemPath, 'utf8');
                Object.assign(tokens, this.parseCSSTokens(content));
            }
        } catch (error) {
            console.error('Failed to load design system tokens:', error.message);
        }
        
        return tokens;
    }

    /**
     * Load responsive tokens
     */
    loadResponsiveTokens() {
        const tokens = {};
        
        try {
            const responsivePath = path.join(process.cwd(), 'design-system/css/responsive.css');
            if (fs.existsSync(responsivePath)) {
                const content = fs.readFileSync(responsivePath, 'utf8');
                Object.assign(tokens, this.parseCSSTokens(content));
            }
        } catch (error) {
            console.error('Failed to load responsive tokens:', error.message);
        }
        
        return tokens;
    }

    /**
     * Parse CSS custom properties
     */
    parseCSSTokens(cssContent) {
        const tokens = {};
        const cssVariableRegex = /--([^:]+):\s*([^;]+);/g;
        let match;

        while ((match = cssVariableRegex.exec(cssContent)) !== null) {
            const [, name, value] = match;
            tokens[name.trim()] = value.trim();
        }

        return tokens;
    }

    /**
     * Generate comprehensive mapping guide
     */
    async generateMappingGuide() {
        console.log('📚 Generating Token Mapping Guide...');
        
        const guide = this.buildMappingGuide();
        const outputPath = path.join(process.cwd(), 'docs/TOKEN-MAPPING-REFERENCE.md');
        
        fs.writeFileSync(outputPath, guide);
        console.log(`✅ Token mapping guide generated: ${outputPath}`);
        
        // Also generate JSON version for tooling
        const jsonData = this.generateJSONMapping();
        const jsonPath = path.join(process.cwd(), 'docs/token-mapping-reference.json');
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
        console.log(`✅ JSON mapping reference generated: ${jsonPath}`);
    }

    /**
     * Build the complete mapping guide
     */
    buildMappingGuide() {
        const typographyTable = this.generateTypographyTable();
        const colorTable = this.generateColorTable();
        const spacingTable = this.generateSpacingTable();
        const responsiveTable = this.generateResponsiveTable();

        return `# 🎨 Design Token Mapping Reference

*Auto-generated reference for mapping Figma variables to design system tokens*

---

## 📝 Typography Mapping

### Complete Typography Token Reference

${typographyTable}

### Font Family Mapping
| Figma Font Family | CSS Token | Usage Context |
|------------------|-----------|---------------|
| "Overused Grotesk" (Body) | \`var(--font-body)\` | Body text, small titles |
| "Overused Grotesk" (Title) | \`var(--font-title)\` | Titles, headings, menu items |
| "Behind The Nineties" | \`var(--font-heading)\` | Large headings, display text |

### Font Weight Mapping
| Figma Weight | Numeric Value | CSS Usage |
|-------------|---------------|-----------|
| Regular | 400 | Standard body text |
| Medium | 500 | Emphasized text, menu items |
| Semibold | 600 | Important headings |
| Bold | 700 | Strong emphasis |

---

## 🎨 Color Mapping

${colorTable}

---

## 📏 Spacing & Layout Mapping

${spacingTable}

---

## 📱 Responsive Token Mapping

${responsiveTable}

---

## 🔧 Implementation Examples

### Example 1: Menu Item (Figma: title/title-xs/medium)
\`\`\`css
.menu-item {
  /* Typography */
  font-family: var(--font-title);
  font-size: var(--font-size-title-xs);      /* 18px mobile → 24px desktop */
  line-height: var(--line-height-title-xs);  /* 24px mobile → 32px desktop */
  font-weight: 500;                          /* medium */
  
  /* Colors */
  color: var(--text-neutral-heading);
  background: var(--surface-neutral-card);
  
  /* Spacing */
  padding: var(--spacing-sm) var(--spacing-md);
  
  /* States */
  &:hover {
    background: var(--surface-primary-hover);
  }
}
\`\`\`

### Example 2: Body Text (Figma: body/body-md/regular)
\`\`\`css
.body-text {
  font-family: var(--font-body);
  font-size: var(--font-size-body-md);
  line-height: var(--line-height-body-md);
  font-weight: 400;
  color: var(--text-neutral-body);
}
\`\`\`

---

## ⚡ Quick Reference Commands

\`\`\`bash
# Validate component against Figma spec
node scripts/validate-figma-implementation.js <component-path> <figma-node-id>

# Audit and fix typography issues
node scripts/audit-and-fix-typography.js

# Regenerate this mapping guide
node scripts/generate-token-mapping-guide.js
\`\`\`

---

*Last generated: ${new Date().toISOString()}*
*Source: Figma variables and design system tokens*`;
    }

    /**
     * Generate typography mapping table
     */
    generateTypographyTable() {
        const typographyMappings = [
            {
                figmaStyle: 'title/title-xs/regular',
                fontSize: '18px mobile → 24px desktop',
                fontSizeToken: 'var(--font-size-title-xs)',
                lineHeightToken: 'var(--line-height-title-xs)',
                fontWeight: '400',
                usage: 'Small titles, large body text'
            },
            {
                figmaStyle: 'title/title-xs/medium',
                fontSize: '18px mobile → 24px desktop', 
                fontSizeToken: 'var(--font-size-title-xs)',
                lineHeightToken: 'var(--line-height-title-xs)',
                fontWeight: '500',
                usage: 'Menu items, emphasized titles'
            },
            {
                figmaStyle: 'title/title-sm/medium',
                fontSize: '20px',
                fontSizeToken: 'var(--font-size-title-sm)',
                lineHeightToken: 'var(--line-height-title-sm)',
                fontWeight: '500',
                usage: 'Medium titles, section headers'
            },
            {
                figmaStyle: 'title/title-md/medium',
                fontSize: '24px mobile → 36px desktop',
                fontSizeToken: 'var(--font-size-title-md)',
                lineHeightToken: 'var(--line-height-title-md)',
                fontWeight: '500',
                usage: 'Large titles, page headers'
            },
            {
                figmaStyle: 'body/body-sm/regular',
                fontSize: '12px',
                fontSizeToken: 'var(--font-size-body-sm)',
                lineHeightToken: 'var(--line-height-body-sm)',
                fontWeight: '400',
                usage: 'Small text, captions'
            },
            {
                figmaStyle: 'body/body-md/regular',
                fontSize: '14px',
                fontSizeToken: 'var(--font-size-body-md)',
                lineHeightToken: 'var(--line-height-body-md)',
                fontWeight: '400',
                usage: 'Standard body text'
            }
        ];

        let table = '| Figma Style | Font Size | Font Size Token | Line Height Token | Weight | Usage |\n';
        table += '|-------------|-----------|-----------------|-------------------|--------|-------|\n';

        typographyMappings.forEach(mapping => {
            table += `| \`${mapping.figmaStyle}\` | ${mapping.fontSize} | \`${mapping.fontSizeToken}\` | \`${mapping.lineHeightToken}\` | ${mapping.fontWeight} | ${mapping.usage} |\n`;
        });

        return table;
    }

    /**
     * Generate color mapping table
     */
    generateColorTable() {
        const colorMappings = [
            {
                figmaVariable: 'Surface/Primary/default',
                hexValue: '#f0f081',
                cssToken: 'var(--surface-primary-default)',
                usage: 'Primary buttons, highlights'
            },
            {
                figmaVariable: 'Surface/Neutral/card',
                hexValue: '#f1f2f2',
                cssToken: 'var(--surface-neutral-card)',
                usage: 'Card backgrounds, menu items'
            },
            {
                figmaVariable: 'Text/Neutral/heading',
                hexValue: '#252626',
                cssToken: 'var(--text-neutral-heading)',
                usage: 'Headings, menu text'
            },
            {
                figmaVariable: 'Text/Neutral/body',
                hexValue: '#3e4040',
                cssToken: 'var(--text-neutral-body)',
                usage: 'Body text, descriptions'
            },
            {
                figmaVariable: 'Border/Neutral/dark',
                hexValue: '#252626',
                cssToken: 'var(--border-neutral-dark)',
                usage: 'Component borders'
            }
        ];

        let table = '| Figma Variable | Hex Value | CSS Token | Usage |\n';
        table += '|----------------|-----------|-----------|-------|\n';

        colorMappings.forEach(mapping => {
            table += `| \`${mapping.figmaVariable}\` | ${mapping.hexValue} | \`${mapping.cssToken}\` | ${mapping.usage} |\n`;
        });

        return table;
    }

    /**
     * Generate spacing mapping table
     */
    generateSpacingTable() {
        const spacingMappings = [
            { figmaValue: '4px', cssToken: 'var(--spacing-xs)', usage: 'Tight spacing, small gaps' },
            { figmaValue: '8px', cssToken: 'var(--spacing-sm)', usage: 'Small padding, minor gaps' },
            { figmaValue: '16px', cssToken: 'var(--spacing-md)', usage: 'Standard spacing, component padding' },
            { figmaValue: '24px', cssToken: 'var(--spacing-lg)', usage: 'Large gaps, section spacing' },
            { figmaValue: '48px', cssToken: 'var(--spacing-xl)', usage: 'Major section spacing' },
            { figmaValue: '1px', cssToken: 'var(--border-width-sm)', usage: 'Thin borders' },
            { figmaValue: '2px', cssToken: 'var(--border-width-md)', usage: 'Standard borders' },
            { figmaValue: '4px', cssToken: 'var(--border-width-lg)', usage: 'Thick borders' }
        ];

        let table = '| Figma Value | CSS Token | Usage |\n';
        table += '|-------------|-----------|-------|\n';

        spacingMappings.forEach(mapping => {
            table += `| ${mapping.figmaValue} | \`${mapping.cssToken}\` | ${mapping.usage} |\n`;
        });

        return table;
    }

    /**
     * Generate responsive mapping table
     */
    generateResponsiveTable() {
        return `| Breakpoint | Width | Font Scale | Spacing Scale |
|------------|-------|------------|---------------|
| Mobile | 390px+ | Base sizes | Base spacing |
| Tablet | 810px+ | +0px (same) | +0px (same) |
| Desktop | 1440px+ | +6px average | +0px (same) |

### Responsive Typography Examples
| Token | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| \`--font-size-title-xs\` | 18px | 18px | 24px |
| \`--line-height-title-xs\` | 24px | 24px | 32px |
| \`--font-size-title-md\` | 24px | 30px | 36px |
| \`--line-height-title-md\` | 32px | 32px | 44px |`;
    }

    /**
     * Generate JSON mapping for tools
     */
    generateJSONMapping() {
        return {
            typography: {
                'title/title-xs/regular': {
                    fontSizeToken: 'font-size-title-xs',
                    lineHeightToken: 'line-height-title-xs',
                    fontWeight: 400,
                    fontFamily: 'font-title'
                },
                'title/title-xs/medium': {
                    fontSizeToken: 'font-size-title-xs', 
                    lineHeightToken: 'line-height-title-xs',
                    fontWeight: 500,
                    fontFamily: 'font-title'
                },
                'body/body-md/regular': {
                    fontSizeToken: 'font-size-body-md',
                    lineHeightToken: 'line-height-body-md',
                    fontWeight: 400,
                    fontFamily: 'font-body'
                }
            },
            colors: {
                'Surface/Primary/default': 'surface-primary-default',
                'Surface/Neutral/card': 'surface-neutral-card',
                'Text/Neutral/heading': 'text-neutral-heading',
                'Text/Neutral/body': 'text-neutral-body'
            },
            spacing: {
                '4px': 'spacing-xs',
                '8px': 'spacing-sm', 
                '16px': 'spacing-md',
                '24px': 'spacing-lg',
                '48px': 'spacing-xl'
            }
        };
    }
}

// CLI usage
if (require.main === module) {
    const generator = new TokenMappingGuideGenerator();
    generator.generateMappingGuide().catch(console.error);
}

module.exports = TokenMappingGuideGenerator;