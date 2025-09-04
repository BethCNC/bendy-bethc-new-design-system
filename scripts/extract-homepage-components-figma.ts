const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY;
const FIGMA_FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu'; // Homepage design file

if (!FIGMA_ACCESS_TOKEN) {
  console.error('❌ Missing required environment variable:');
  console.error('   - FIGMA_API_KEY');
  console.error(`   Current value: ${process.env.FIGMA_API_KEY ? 'Set' : 'Missing'}`);
  process.exit(1);
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fills?: any[];
  strokes?: any[];
  strokeWeight?: number;
  cornerRadius?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  layoutMode?: string;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeightPx?: number;
    lineHeightPercent?: number;
    letterSpacing?: number;
    textAlignHorizontal?: string;
    textAlignVertical?: string;
  };
  characters?: string;
  effects?: any[];
  opacity?: number;
}

interface ComponentSpec {
  nodeId: string;
  componentName: string;
  figmaName: string;
  layout: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  spacing: {
    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    gap: number;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
    textAlign: string;
  };
  visual: {
    fill: string;
    stroke: string;
    strokeWidth: number;
    borderRadius: number;
    effects: any[];
    opacity: number;
  };
  autoLayout: {
    enabled: boolean;
    mode: string;
    primaryAxisSizing: string;
    counterAxisSizing: string;
  };
  constraints: {
    horizontal: string;
    vertical: string;
  };
}

// Homepage components to extract
const HOMEPAGE_COMPONENTS = [
  { name: 'CTA', searchTerms: ['CTA', 'Call to Action', 'cta'] },
  { name: 'NavBar', searchTerms: ['Navigation', 'Nav', 'Menu', 'navbar'] },
  { name: 'PageTitle', searchTerms: ['Title', 'Page Title', 'Hello Bendy Friends'] },
  { name: 'HeroSection', searchTerms: ['Hero', 'Hero Section', 'Finding my peace'] },
  { name: 'CopyBlock', searchTerms: ['Copy Block', 'My Story', 'copy block'] },
  { name: 'ImageGallery', searchTerms: ['Gallery', 'Images', 'Instagram', 'gallery'] },
  { name: 'FeatureCardGrid', searchTerms: ['Feature', 'Cards', 'Grid', 'feature card'] },
  { name: 'SocialFeedPreview', searchTerms: ['Social', 'Feed', 'Instagram', 'social feed'] },
  { name: 'Footer', searchTerms: ['Footer', 'footer'] }
];

async function getFigmaFile() {
  try {
    console.log('🔍 Fetching Figma file...');
    const response = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching Figma file:', error);
    throw error;
  }
}

function findComponentNode(node: FigmaNode, searchTerms: string[]): FigmaNode | null {
  // Check if current node matches search terms
  const nodeName = node.name.toLowerCase();
  const matches = searchTerms.some(term => 
    nodeName.includes(term.toLowerCase())
  );
  
  if (matches) {
    return node;
  }
  
  // Recursively search children
  if (node.children) {
    for (const child of node.children) {
      const found = findComponentNode(child, searchTerms);
      if (found) return found;
    }
  }
  
  return null;
}

function extractNodeSpec(node: FigmaNode): ComponentSpec {
  const boundingBox = node.absoluteBoundingBox || { x: 0, y: 0, width: 0, height: 0 };
  
  return {
    nodeId: node.id,
    componentName: node.name,
    figmaName: node.name,
    layout: {
      width: boundingBox.width,
      height: boundingBox.height,
      x: boundingBox.x,
      y: boundingBox.y
    },
    spacing: {
      padding: {
        top: node.paddingTop || 0,
        right: node.paddingRight || 0,
        bottom: node.paddingBottom || 0,
        left: node.paddingLeft || 0
      },
      margin: {
        top: 0, // Figma API doesn't provide margin directly
        right: 0,
        bottom: 0,
        left: 0
      },
      gap: node.itemSpacing || 0
    },
    typography: {
      fontFamily: node.style?.fontFamily || '',
      fontSize: node.style?.fontSize || 0,
      fontWeight: node.style?.fontWeight || 0,
      lineHeight: node.style?.lineHeightPx || node.style?.lineHeightPercent || 0,
      letterSpacing: node.style?.letterSpacing || 0,
      textAlign: node.style?.textAlignHorizontal || 'left'
    },
    visual: {
      fill: node.fills?.[0]?.color ? 
        `rgb(${Math.round(node.fills[0].color.r * 255)}, ${Math.round(node.fills[0].color.g * 255)}, ${Math.round(node.fills[0].color.b * 255)})` : '',
      stroke: node.strokes?.[0]?.color ? 
        `rgb(${Math.round(node.strokes[0].color.r * 255)}, ${Math.round(node.strokes[0].color.g * 255)}, ${Math.round(node.strokes[0].color.b * 255)})` : '',
      strokeWidth: node.strokeWeight || 0,
      borderRadius: node.cornerRadius || 0,
      effects: node.effects || [],
      opacity: node.opacity || 1
    },
    autoLayout: {
      enabled: !!node.layoutMode,
      mode: node.layoutMode || '',
      primaryAxisSizing: node.primaryAxisSizingMode || '',
      counterAxisSizing: node.counterAxisSizingMode || ''
    },
    constraints: {
      horizontal: 'scale', // Default assumption
      vertical: 'scale'
    }
  };
}

function generateComponentDocumentation(componentSpec: ComponentSpec): string {
  return `# ${componentSpec.componentName} Component - Figma Specifications

## Node Information
- **Figma Node ID**: \`${componentSpec.nodeId}\`
- **Component Name**: ${componentSpec.componentName}
- **Figma Name**: ${componentSpec.figmaName}

## Layout Properties
- **Width**: ${componentSpec.layout.width}px
- **Height**: ${componentSpec.layout.height}px
- **Position X**: ${componentSpec.layout.x}px
- **Position Y**: ${componentSpec.layout.y}px

## Spacing Properties
- **Padding Top**: ${componentSpec.spacing.padding.top}px
- **Padding Right**: ${componentSpec.spacing.padding.right}px
- **Padding Bottom**: ${componentSpec.spacing.padding.bottom}px
- **Padding Left**: ${componentSpec.spacing.padding.left}px
- **Gap**: ${componentSpec.spacing.gap}px

## Typography Properties
- **Font Family**: ${componentSpec.typography.fontFamily}
- **Font Size**: ${componentSpec.typography.fontSize}px
- **Font Weight**: ${componentSpec.typography.fontWeight}
- **Line Height**: ${componentSpec.typography.lineHeight}${typeof componentSpec.typography.lineHeight === 'number' && componentSpec.typography.lineHeight > 100 ? '%' : 'px'}
- **Letter Spacing**: ${componentSpec.typography.letterSpacing}px
- **Text Align**: ${componentSpec.typography.textAlign}

## Visual Properties
- **Fill Color**: ${componentSpec.visual.fill || 'None'}
- **Stroke Color**: ${componentSpec.visual.stroke || 'None'}
- **Stroke Width**: ${componentSpec.visual.strokeWidth}px
- **Border Radius**: ${componentSpec.visual.borderRadius}px
- **Opacity**: ${componentSpec.visual.opacity * 100}%

## Auto Layout Properties
- **Enabled**: ${componentSpec.autoLayout.enabled ? 'Yes' : 'No'}
- **Mode**: ${componentSpec.autoLayout.mode || 'None'}
- **Primary Axis Sizing**: ${componentSpec.autoLayout.primaryAxisSizing || 'None'}
- **Counter Axis Sizing**: ${componentSpec.autoLayout.counterAxisSizing || 'None'}

## Design Token Mapping

### Spacing
\`\`\`css
/* Padding mapping */
${componentSpec.spacing.padding.top > 0 ? `padding-top: var(--spacing-${getSpacingToken(componentSpec.spacing.padding.top)});` : ''}
${componentSpec.spacing.padding.right > 0 ? `padding-right: var(--spacing-${getSpacingToken(componentSpec.spacing.padding.right)});` : ''}
${componentSpec.spacing.padding.bottom > 0 ? `padding-bottom: var(--spacing-${getSpacingToken(componentSpec.spacing.padding.bottom)});` : ''}
${componentSpec.spacing.padding.left > 0 ? `padding-left: var(--spacing-${getSpacingToken(componentSpec.spacing.padding.left)});` : ''}
${componentSpec.spacing.gap > 0 ? `gap: var(--spacing-${getSpacingToken(componentSpec.spacing.gap)});` : ''}
\`\`\`

### Typography
\`\`\`css
/* Font mapping */
font-family: var(--font-family-${getFontFamilyToken(componentSpec.typography.fontFamily)});
font-size: var(--font-size-${getFontSizeToken(componentSpec.typography.fontSize)});
font-weight: ${componentSpec.typography.fontWeight};
line-height: ${componentSpec.typography.lineHeight}${typeof componentSpec.typography.lineHeight === 'number' && componentSpec.typography.lineHeight > 100 ? '%' : 'px'};
\`\`\`

### Colors
\`\`\`css
/* Color mapping */
${componentSpec.visual.fill ? `background-color: ${mapColorToToken(componentSpec.visual.fill)};` : ''}
${componentSpec.visual.stroke ? `border-color: ${mapColorToToken(componentSpec.visual.stroke)};` : ''}
\`\`\`

## CSS Classes to Use
\`\`\`jsx
<section className="${componentSpec.componentName.toLowerCase()}-section w-full">
  <div className="${componentSpec.componentName.toLowerCase()}-container ${getPaddingClasses(componentSpec.spacing.padding)}">
    {/* Component content */}
  </div>
</section>
\`\`\`

## Implementation Notes
- Use responsive breakpoints: mobile (390px), tablet (810px), desktop (1440px)
- Map all values to design system tokens
- Ensure proper stacking behavior on desktop
- Test all breakpoints for responsive behavior
`;
}

function getSpacingToken(value: number): string {
  // Map pixel values to spacing tokens
  const spacingMap: { [key: number]: string } = {
    8: 'mobile-sm',
    16: 'mobile-md',
    24: 'mobile-lg',
    12: 'tablet-sm',
    20: 'tablet-md',
    32: 'tablet-lg',
    40: 'desktop-lg'
  };
  return spacingMap[value] || 'mobile-md';
}

function getFontFamilyToken(fontFamily: string): string {
  if (fontFamily.toLowerCase().includes('overused') || fontFamily.toLowerCase().includes('grotesk')) {
    return 'primary';
  }
  if (fontFamily.toLowerCase().includes('behind') || fontFamily.toLowerCase().includes('nineties')) {
    return 'secondary';
  }
  return 'primary';
}

function getFontSizeToken(size: number): string {
  if (size <= 14) return 'sm';
  if (size <= 16) return 'md';
  if (size <= 18) return 'lg';
  if (size <= 24) return 'xl';
  if (size <= 32) return '2xl';
  return 'lg';
}

function mapColorToToken(color: string): string {
  // This would need to be expanded based on your color tokens
  return `var(--surface-primary-default)`;
}

function getPaddingClasses(padding: { top: number; right: number; bottom: number; left: number }): string {
  const classes: string[] = [];
  if (padding.top > 0) classes.push(`pt-${getSpacingToken(padding.top)}`);
  if (padding.right > 0) classes.push(`pr-${getSpacingToken(padding.right)}`);
  if (padding.bottom > 0) classes.push(`pb-${getSpacingToken(padding.bottom)}`);
  if (padding.left > 0) classes.push(`pl-${getSpacingToken(padding.left)}`);
  return classes.join(' ');
}

async function main() {
  try {
    console.log('🚀 Starting Figma component extraction...');
    
    const figmaData = await getFigmaFile();
    const document = figmaData.document;
    
    console.log('📋 Found components:');
    
    const componentSpecs: ComponentSpec[] = [];
    
    for (const component of HOMEPAGE_COMPONENTS) {
      console.log(`\n🔍 Searching for ${component.name}...`);
      
      const foundNode = findComponentNode(document, component.searchTerms);
      
      if (foundNode) {
        console.log(`✅ Found ${component.name}: ${foundNode.name} (ID: ${foundNode.id})`);
        const spec = extractNodeSpec(foundNode);
        componentSpecs.push(spec);
        
        // Generate individual documentation
        const docContent = generateComponentDocumentation(spec);
        const docPath = path.join(__dirname, '..', 'docs', `figma-${component.name.toLowerCase()}-specs.md`);
        fs.writeFileSync(docPath, docContent);
        console.log(`📄 Documentation saved: ${docPath}`);
      } else {
        console.log(`❌ ${component.name} not found`);
      }
    }
    
    // Generate summary report
    const summaryReport = {
      extractedAt: new Date().toISOString(),
      totalComponents: HOMEPAGE_COMPONENTS.length,
      foundComponents: componentSpecs.length,
      components: componentSpecs.map(spec => ({
        name: spec.componentName,
        nodeId: spec.nodeId,
        figmaName: spec.figmaName,
        dimensions: {
          width: spec.layout.width,
          height: spec.layout.height
        }
      }))
    };
    
    const summaryPath = path.join(__dirname, '..', 'docs', 'figma-components-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summaryReport, null, 2));
    console.log(`\n📊 Summary report saved: ${summaryPath}`);
    
    // Generate consolidated documentation
    const consolidatedDoc = `# Homepage Components - Figma Specifications

## Overview
This document contains the Figma specifications for all homepage components extracted on ${new Date().toLocaleDateString()}.

## Components Found: ${componentSpecs.length}/${HOMEPAGE_COMPONENTS.length}

${componentSpecs.map(spec => `
### ${spec.componentName}
- **Node ID**: \`${spec.nodeId}\`
- **Figma Name**: ${spec.figmaName}
- **Dimensions**: ${spec.layout.width}px × ${spec.layout.height}px
- **Documentation**: [figma-${spec.componentName.toLowerCase()}-specs.md](./figma-${spec.componentName.toLowerCase()}-specs.md)
`).join('\n')}

## Missing Components
${HOMEPAGE_COMPONENTS.filter(comp => !componentSpecs.find(spec => spec.componentName === comp.name))
  .map(comp => `- ${comp.name}`).join('\n')}

## Usage Instructions
1. Use the Node ID to locate the component in Figma
2. Reference the individual component documentation for detailed specifications
3. Map all values to design system tokens
4. Implement responsive behavior for all breakpoints
5. Test component stacking on desktop

## Next Steps
1. Review each component's specifications
2. Update components to match Figma exactly
3. Use proper design system classes
4. Test responsive behavior
5. Verify desktop stacking behavior
`;
    
    const consolidatedPath = path.join(__dirname, '..', 'docs', 'figma-homepage-components.md');
    fs.writeFileSync(consolidatedPath, consolidatedDoc);
    console.log(`📚 Consolidated documentation saved: ${consolidatedPath}`);
    
    console.log('\n✅ Figma component extraction complete!');
    console.log(`📁 Check the docs/ folder for detailed specifications`);
    
  } catch (error) {
    console.error('❌ Error during extraction:', error);
    process.exit(1);
  }
}

main(); 