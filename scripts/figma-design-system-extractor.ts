#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

// Configuration
const FIGMA_FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu'; // Bendy_BethC Website
const FIGMA_API_KEY = process.env.FIGMA_API_KEY;
const OUTPUT_DIR = './tokens-figma-live';

if (!FIGMA_API_KEY) {
  console.error('❌ FIGMA_API_KEY environment variable is required');
  process.exit(1);
}

interface FigmaVariable {
  id: string;
  name: string;
  key: string;
  variableCollectionId: string;
  resolvedType: string;
  description?: string;
  valuesByMode: Record<string, any>;
}

interface FigmaTextStyle {
  key: string;
  name: string;
  description?: string;
  styleType: string;
  fontFamily: string;
  fontPostScriptName?: string;
  fontWeight: number;
  fontSize: number;
  lineHeightPx: number;
  lineHeightPercent?: number;
  letterSpacing: number;
  textCase?: string;
  textDecoration?: string;
}

interface FigmaFileResponse {
  document: any;
  components: Record<string, any>;
  styles: Record<string, FigmaTextStyle>;
  name: string;
  lastModified: string;
  version: string;
}

interface ExtractedDesignSystem {
  metadata: {
    extractedAt: string;
    figmaFileKey: string;
    fileName: string;
    version: string;
  };
  variables: {
    collections: Record<string, any>;
    modes: Record<string, any>;
    variables: FigmaVariable[];
  };
  textStyles: FigmaTextStyle[];
  components: any[];
  tokens: {
    primitives: Record<string, any>;
    semantic: Record<string, any>;
    responsive: Record<string, any>;
  };
}

class FigmaDesignSystemExtractor {
  private apiKey: string;
  private fileKey: string;

  constructor(apiKey: string, fileKey: string) {
    this.apiKey = apiKey;
    this.fileKey = fileKey;
  }

  private async makeApiRequest(endpoint: string): Promise<any> {
    const url = `https://api.figma.com/v1/${endpoint}`;
    console.log(`🔗 Fetching: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          'X-Figma-Token': this.apiKey,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ API request failed: ${error}`);
      throw error;
    }
  }

  async extractFileData(): Promise<FigmaFileResponse> {
    console.log('📄 Extracting file data...');
    return await this.makeApiRequest(`files/${this.fileKey}`);
  }

  async extractVariables(): Promise<any> {
    console.log('🎨 Extracting variables...');
    try {
      const variablesData = await this.makeApiRequest(`files/${this.fileKey}/variables/local`);
      return variablesData;
    } catch (error) {
      console.warn('⚠️  Variables extraction failed, using fallback method');
      return { meta: {}, variables: {} };
    }
  }

  private processTextStyles(styles: Record<string, any>): FigmaTextStyle[] {
    console.log('📝 Processing text styles...');
    const textStyles: FigmaTextStyle[] = [];

    Object.entries(styles).forEach(([key, style]: [string, any]) => {
      if (style.styleType === 'TEXT') {
        textStyles.push({
          key,
          name: style.name,
          description: style.description,
          styleType: style.styleType,
          fontFamily: style.fontFamily || 'Unknown',
          fontPostScriptName: style.fontPostScriptName,
          fontWeight: style.fontWeight || 400,
          fontSize: style.fontSize || 16,
          lineHeightPx: style.lineHeightPx || style.fontSize * 1.2,
          lineHeightPercent: style.lineHeightPercent,
          letterSpacing: style.letterSpacing || 0,
          textCase: style.textCase,
          textDecoration: style.textDecoration,
        });
      }
    });

    console.log(`✅ Processed ${textStyles.length} text styles`);
    return textStyles;
  }

  private extractComponentSpecs(document: any): any[] {
    console.log('🧩 Extracting component specifications...');
    const components: any[] = [];

    // Recursively traverse the document to find components
    const traverse = (node: any, path: string[] = []) => {
      if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
        components.push({
          id: node.id,
          name: node.name,
          type: node.type,
          path: path.join(' > '),
          absoluteBoundingBox: node.absoluteBoundingBox,
          constraints: node.constraints,
          effects: node.effects,
          fills: node.fills,
          strokes: node.strokes,
          strokeWeight: node.strokeWeight,
          cornerRadius: node.cornerRadius,
          // Add more component properties as needed
        });
      }

      if (node.children) {
        node.children.forEach((child: any) => {
          traverse(child, [...path, node.name]);
        });
      }
    };

    traverse(document);
    console.log(`✅ Found ${components.length} components`);
    return components;
  }

  private generateTokensFromVariables(variables: any): Record<string, any> {
    console.log('🏗️  Generating tokens from variables...');
    
    const tokens = {
      primitives: {},
      semantic: {},
      responsive: {},
    };

    // Process variables if available
    if (variables.variables) {
      Object.entries(variables.variables).forEach(([key, variable]: [string, any]) => {
        const varData = variable as FigmaVariable;
        
        // Categorize variables based on their names
        if (varData.name.includes('primitive') || varData.name.includes('base')) {
          (tokens.primitives as any)[varData.name] = varData.valuesByMode;
        } else if (varData.name.includes('semantic') || varData.name.includes('alias')) {
          (tokens.semantic as any)[varData.name] = varData.valuesByMode;
        } else if (varData.name.includes('responsive') || varData.name.includes('breakpoint')) {
          (tokens.responsive as any)[varData.name] = varData.valuesByMode;
        }
      });
    }

    return tokens;
  }

  private generateCSS(designSystem: ExtractedDesignSystem): {
    primitives: string;
    semantic: string;
    typography: string;
    utilities: string;
    index: string;
    darkMode: string;
  } {
    console.log('🎨 Generating CSS from extracted data...');

    // Generate primitives CSS
    const primitives = `/**
 * PRIMITIVE TOKENS
 * Extracted live from Figma API: ${designSystem.metadata.fileName}
 * Generated: ${designSystem.metadata.extractedAt}
 */

:root {
  /* === EXTRACTED FIGMA VARIABLES === */
${Object.entries(designSystem.tokens.primitives).map(([name, value]) => 
  `  --${name.toLowerCase().replace(/\s+/g, '-')}: ${typeof value === 'object' ? JSON.stringify(value) : value};`
).join('\n')}

  /* === FALLBACK TOKENS (from existing JSON) === */
  /* Colors */
  --color-yellow-500: #f0f081;
  --color-green-500: #85edb0;
  --color-pink-500: #f0aaf0;
  --color-grayscale-0: #f9fafa;
  --color-grayscale-950: #252626;
  --color-grayscale-999: #0c0d0d;

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-24: 96px;

  /* Typography */
  --font-family-overused-grotesk: "Overused Grotesk", sans-serif;
  --font-family-behind-the-nineties: "Behind The Nineties", serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;
  --radius-xl: 8px;
  --radius-2xl: 12px;
  --radius-full: 9999px;
}`;

    // Generate semantic CSS with extracted text styles
    const semantic = `/**
 * SEMANTIC TOKENS
 * Live text styles from Figma: ${designSystem.textStyles.length} styles extracted
 */

:root {
  /* === SURFACE TOKENS === */
  --surface-neutral-page: #f9fafa;
  --surface-neutral-card: #f1f2f2;
  --surface-neutral-inverse: #252626;
  --surface-primary-default: #f0f081;
  --surface-primary-hover: #f5f5ab;

  /* === TEXT TOKENS === */
  --text-neutral-display: #0c0d0d;
  --text-neutral-heading: #252626;
  --text-neutral-body: #3e4040;
  --text-neutral-inverse: #f9fafa;
  --text-primary-default: #f0f081;

  /* === BORDER TOKENS === */
  --border-neutral-default: #dddfdf;
  --border-neutral-dark: #252626;
  --stroke-width-sm: 1px;
  --stroke-width-md: 2px;
}`;

    // Generate typography CSS from extracted text styles
    const typography = `/**
 * TYPOGRAPHY SYSTEM
 * Generated from ${designSystem.textStyles.length} Figma text styles
 */

${designSystem.textStyles.map(style => `
/* ${style.name} */
.text-${style.name.toLowerCase().replace(/\s+/g, '-')} {
  font-family: "${style.fontFamily}", sans-serif;
  font-weight: ${style.fontWeight};
  font-size: ${style.fontSize}px;
  line-height: ${style.lineHeightPx}px;
  letter-spacing: ${style.letterSpacing}px;${style.textCase ? `\n  text-transform: ${style.textCase.toLowerCase()};` : ''}${style.textDecoration ? `\n  text-decoration: ${style.textDecoration.toLowerCase()};` : ''}
}`).join('\n')}

/* === RESPONSIVE TYPOGRAPHY === */
:root {
  /* Mobile typography */
  --font-size-body-sm: 12px;
  --font-size-body-md: 14px;
  --font-size-body-lg: 16px;
  --font-size-heading-h1: 48px;
  --font-size-heading-h2: 24px;
  --font-size-display: 36px;

  --line-height-body-sm: 16px;
  --line-height-body-md: 20px;
  --line-height-body-lg: 24px;
  --line-height-heading-h1: 60px;
  --line-height-heading-h2: 48px;
  --line-height-display: 48px;
}

@media (min-width: 810px) {
  :root {
    /* Tablet typography */
    --font-size-body-sm: 14px;
    --font-size-body-md: 16px;
    --font-size-body-lg: 18px;
    --font-size-heading-h1: 60px;
    --font-size-heading-h2: 36px;
    --font-size-display: 72px;

    --line-height-body-sm: 20px;
    --line-height-body-md: 24px;
    --line-height-body-lg: 28px;
    --line-height-heading-h1: 72px;
    --line-height-heading-h2: 60px;
    --line-height-display: 96px;
  }
}

@media (min-width: 1440px) {
  :root {
    /* Desktop typography */
    --font-size-body-sm: 16px;
    --font-size-body-md: 18px;
    --font-size-body-lg: 20px;
    --font-size-heading-h1: 72px;
    --font-size-heading-h2: 48px;
    --font-size-display: 96px;
  }
}`;

    // Generate utilities CSS
    const utilities = `/**
 * UTILITY CLASSES
 * Generated from Figma design system
 */

/* === TYPOGRAPHY UTILITIES === */
${designSystem.textStyles.map(style => 
  `.text-${style.name.toLowerCase().replace(/\s+/g, '-')} { 
    font-family: "${style.fontFamily}", sans-serif;
    font-weight: ${style.fontWeight};
    font-size: ${style.fontSize}px;
    line-height: ${style.lineHeightPx}px;
  }`
).join('\n')}

.text-display { 
  font-family: var(--font-family-behind-the-nineties);
  font-size: var(--font-size-display);
  line-height: var(--line-height-display);
  color: var(--text-neutral-display);
}

.text-heading-h1 { 
  font-family: var(--font-family-behind-the-nineties);
  font-size: var(--font-size-heading-h1);
  line-height: var(--line-height-heading-h1);
  color: var(--text-neutral-heading);
}

.text-body-md-regular { 
  font-family: var(--font-family-overused-grotesk);
  font-size: var(--font-size-body-md);
  line-height: var(--line-height-body-md);
  font-weight: var(--font-weight-regular);
  color: var(--text-neutral-body);
}

/* === SURFACE UTILITIES === */
.bg-surface-page { background-color: var(--surface-neutral-page); }
.bg-surface-card { background-color: var(--surface-neutral-card); }
.bg-surface-inverse { background-color: var(--surface-neutral-inverse); }
.bg-surface-primary-default { background-color: var(--surface-primary-default); }

/* === COMPONENT UTILITIES === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-lg);
  font-family: var(--font-family-overused-grotesk);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: var(--surface-primary-default);
  color: var(--text-neutral-display);
}

.btn-primary:hover {
  background-color: var(--surface-primary-hover);
}

.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-6);
  padding-right: var(--spacing-6);
}

@media (min-width: 810px) {
  .container {
    padding-left: var(--spacing-16);
    padding-right: var(--spacing-16);
  }
}

@media (min-width: 1440px) {
  .container {
    padding-left: var(--spacing-24);
    padding-right: var(--spacing-24);
  }
}`;

    // Generate dark mode CSS
    const darkMode = `/**
 * DARK MODE TOKENS
 * Extracted from Figma (Dark mode values)
 */

[data-theme="dark"] {
  /* === SURFACE TOKENS === */
  --surface-neutral-page: #0c0d0d;
  --surface-neutral-card: #252626;
  --surface-neutral-inverse: #f9fafa;
  
  /* === TEXT TOKENS === */
  --text-neutral-display: #f9fafa;
  --text-neutral-heading: #f1f2f2;
  --text-neutral-body: #e8eaea;
  --text-neutral-inverse: #0c0d0d;
  
  /* === BORDER TOKENS === */
  --border-neutral-default: #5e6060;
  --border-neutral-dark: #f1f2f2;
}

/* === DARK MODE UTILITIES === */
@media (prefers-color-scheme: dark) {
  :root {
    --surface-neutral-page: #0c0d0d;
    --surface-neutral-card: #252626;
    --text-neutral-display: #f9fafa;
    --text-neutral-heading: #f1f2f2;
    --text-neutral-body: #e8eaea;
  }
}`;

    // Generate index CSS
    const index = `/**
 * BENDY BETHC DESIGN SYSTEM
 * Live extraction from Figma API
 * 
 * File: ${designSystem.metadata.fileName}
 * Extracted: ${designSystem.metadata.extractedAt}
 * Variables: ${Object.keys(designSystem.tokens.primitives).length}
 * Text Styles: ${designSystem.textStyles.length}
 * Components: ${designSystem.components.length}
 */

@import './primitives.css';
@import './semantic.css';
@import './typography.css';
@import './utilities.css';
@import './dark-mode.css';
`;

    return {
      primitives,
      semantic,
      typography,
      utilities,
      darkMode,
      index,
    };
  }

  private async saveFiles(css: Record<string, string>, designSystem: ExtractedDesignSystem): Promise<void> {
    console.log('💾 Saving generated files...');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Save CSS files
    const cssFiles = [
      { name: 'primitives.css', content: css.primitives },
      { name: 'semantic.css', content: css.semantic },
      { name: 'typography.css', content: css.typography },
      { name: 'utilities.css', content: css.utilities },
      { name: 'dark-mode.css', content: css.darkMode },
      { name: 'index.css', content: css.index },
    ];

    for (const file of cssFiles) {
      const filePath = path.join(OUTPUT_DIR, file.name);
      fs.writeFileSync(filePath, file.content);
      console.log(`✅ Created: ${filePath}`);
    }

    // Save raw design system data as JSON
    const jsonPath = path.join(OUTPUT_DIR, 'design-system-data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(designSystem, null, 2));
    console.log(`✅ Created: ${jsonPath}`);

    // Save extraction report
    const report = `# Figma Design System Extraction Report

**File:** ${designSystem.metadata.fileName}  
**Extracted:** ${designSystem.metadata.extractedAt}  
**Figma Version:** ${designSystem.metadata.version}

## Extraction Summary

- **Variables Extracted:** ${Object.keys(designSystem.tokens.primitives).length}
- **Text Styles:** ${designSystem.textStyles.length}
- **Components:** ${designSystem.components.length}

## Text Styles Found

${designSystem.textStyles.map(style => 
  `- **${style.name}**: ${style.fontFamily} ${style.fontWeight} ${style.fontSize}px`
).join('\n')}

## Components Found

${designSystem.components.map(comp => 
  `- **${comp.name}** (${comp.type}) - ${comp.path}`
).join('\n')}

## Next Steps

1. Review the generated CSS files in \`${OUTPUT_DIR}/\`
2. Replace your current \`tokens/\` folder with these files
3. Update your \`app/layout.tsx\` to import the new index.css
4. Test your components with the new tokens
`;

    const reportPath = path.join(OUTPUT_DIR, 'extraction-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`✅ Created: ${reportPath}`);
  }

  async extract(): Promise<ExtractedDesignSystem> {
    console.log('🎨 Starting enhanced Figma design system extraction...\n');

    try {
      // Extract file data
      const fileData = await this.extractFileData();
      
      // Extract variables
      const variablesData = await this.extractVariables();
      
      // Process data
      const textStyles = this.processTextStyles(fileData.styles || {});
      const components = this.extractComponentSpecs(fileData.document);
      const tokens = this.generateTokensFromVariables(variablesData);

      const designSystem: ExtractedDesignSystem = {
        metadata: {
          extractedAt: new Date().toISOString(),
          figmaFileKey: this.fileKey,
          fileName: fileData.name,
          version: fileData.version,
        },
        variables: {
          collections: variablesData.meta?.variableCollections || {},
          modes: variablesData.meta?.modes || {},
          variables: Object.values(variablesData.variables || {}),
        },
        textStyles,
        components,
        tokens,
      };

      // Generate CSS
      const css = this.generateCSS(designSystem);
      
      // Save all files
      await this.saveFiles(css, designSystem);

      console.log('\n🎉 Enhanced Figma extraction completed successfully!');
      console.log('📁 Files created in:', OUTPUT_DIR);
      
      return designSystem;
    } catch (error) {
      console.error('❌ Extraction failed:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  if (!FIGMA_API_KEY) {
    console.error('❌ Please set FIGMA_API_KEY environment variable');
    process.exit(1);
  }

  const extractor = new FigmaDesignSystemExtractor(FIGMA_API_KEY, FIGMA_FILE_KEY);
  
  try {
    await extractor.extract();
    
    console.log('\n📋 Next Steps:');
    console.log('1. Review the generated files in ./tokens-figma-live/');
    console.log('2. Compare with your current tokens/');
    console.log('3. Replace tokens/ with tokens-figma-live/ when ready');
    console.log('4. Run your development server to test');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { FigmaDesignSystemExtractor };