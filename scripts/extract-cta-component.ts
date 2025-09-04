#!/usr/bin/env tsx

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { figmaColorToHex, figmaColorToRgba, extractTextStyles } from '../utils/figmaUtils';

// Load environment variables from .env file
config();

// Figma API configuration
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu';
const CTA_NODE_ID = '804:6978';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  constraints?: {
    horizontal: string;
    vertical: string;
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
  style?: any;
  characters?: string;
  layoutMode?: string;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  effects?: any[];
  opacity?: number;
}

interface FigmaFileResponse {
  document: FigmaNode;
  components: Record<string, any>;
  styles: Record<string, any>;
}

async function getFigmaNode(fileKey: string, nodeId: string): Promise<FigmaNode | null> {
  try {
    console.log(`🔗 Making request to: https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`);
    console.log(`🔑 Using token: ${FIGMA_ACCESS_TOKEN ? FIGMA_ACCESS_TOKEN.substring(0, 10) + '...' : 'NOT SET'}`);
    
    const response = await axios.get(
      `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    console.log(`📊 Response status: ${response.status}`);
    console.log(`📄 Response data keys: ${Object.keys(response.data)}`);
    
    const nodeData = response.data.nodes[nodeId];
    console.log(`🎯 Node data found: ${nodeData ? 'YES' : 'NO'}`);
    
    return nodeData?.document || null;
  } catch (error: any) {
    console.error('❌ Error fetching Figma node:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   Message: ${error.message}`);
    }
    return null;
  }
}

function extractLayoutInfo(node: FigmaNode): any {
  const layout: any = {
    type: node.type,
    name: node.name,
    id: node.id,
  };

  // Bounding box
  if (node.absoluteBoundingBox) {
    layout.boundingBox = {
      x: node.absoluteBoundingBox.x,
      y: node.absoluteBoundingBox.y,
      width: node.absoluteBoundingBox.width,
      height: node.absoluteBoundingBox.height,
    };
  }

  // Constraints
  if (node.constraints) {
    layout.constraints = {
      horizontal: node.constraints.horizontal,
      vertical: node.constraints.vertical,
    };
  }

  // Auto layout properties
  if (node.layoutMode) {
    layout.autoLayout = {
      mode: node.layoutMode,
      primaryAxisSizingMode: node.primaryAxisSizingMode,
      counterAxisSizingMode: node.counterAxisSizingMode,
      primaryAxisAlignItems: node.primaryAxisAlignItems,
      counterAxisAlignItems: node.counterAxisAlignItems,
      paddingLeft: node.paddingLeft,
      paddingRight: node.paddingRight,
      paddingTop: node.paddingTop,
      paddingBottom: node.paddingBottom,
      itemSpacing: node.itemSpacing,
    };
  }

  // Corner radius
  if (node.cornerRadius) {
    layout.cornerRadius = node.cornerRadius;
  }

  // Opacity
  if (node.opacity !== undefined) {
    layout.opacity = node.opacity;
  }

  return layout;
}

function extractVisualInfo(node: FigmaNode): any {
  const visual: any = {};

  // Fills (background colors)
  if (node.fills && node.fills.length > 0) {
    visual.fills = node.fills.map((fill: any) => {
      if (fill.type === 'SOLID' && fill.color) {
        return {
          type: 'solid',
          color: {
            hex: figmaColorToHex(fill.color),
            rgba: figmaColorToRgba(fill.color),
            opacity: fill.color.a,
          },
        };
      }
      return fill;
    });
  }

  // Strokes (borders)
  if (node.strokes && node.strokes.length > 0) {
    visual.strokes = node.strokes.map((stroke: any) => {
      if (stroke.type === 'SOLID' && stroke.color) {
        return {
          type: 'solid',
          color: {
            hex: figmaColorToHex(stroke.color),
            rgba: figmaColorToRgba(stroke.color),
            opacity: stroke.color.a,
          },
          weight: node.strokeWeight,
        };
      }
      return stroke;
    });
  }

  // Effects (shadows, blurs)
  if (node.effects && node.effects.length > 0) {
    visual.effects = node.effects.map((effect: any) => {
      if (effect.type === 'DROP_SHADOW') {
        return {
          type: 'dropShadow',
          color: {
            hex: figmaColorToHex(effect.color),
            rgba: figmaColorToRgba(effect.color),
          },
          offset: {
            x: effect.offset.x,
            y: effect.offset.y,
          },
          radius: effect.radius,
          visible: effect.visible,
        };
      }
      return effect;
    });
  }

  return visual;
}

function extractTextInfo(node: FigmaNode): any {
  if (node.type !== 'TEXT') return null;

  const textInfo: any = {
    characters: node.characters,
    style: extractTextStyles(node),
  };

  return textInfo;
}

function analyzeNode(node: FigmaNode, depth: number = 0): any {
  const analysis: any = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible !== false,
    depth,
  };

  // Extract layout information
  analysis.layout = extractLayoutInfo(node);

  // Extract visual information
  analysis.visual = extractVisualInfo(node);

  // Extract text information if it's a text node
  if (node.type === 'TEXT') {
    analysis.text = extractTextInfo(node);
  }

  // Recursively analyze children
  if (node.children && node.children.length > 0) {
    analysis.children = node.children.map((child: FigmaNode) => 
      analyzeNode(child, depth + 1)
    );
  }

  return analysis;
}

function generateComponentSpec(analysis: any): any {
  const spec: any = {
    componentName: 'CTA',
    figmaNodeId: CTA_NODE_ID,
    figmaNodeName: analysis.name,
    extractedAt: new Date().toISOString(),
    
    // Overall component dimensions
    dimensions: {
      width: analysis.layout.boundingBox?.width,
      height: analysis.layout.boundingBox?.height,
      constraints: analysis.layout.constraints,
    },

    // Layout properties
    layout: {
      autoLayout: analysis.layout.autoLayout,
      cornerRadius: analysis.layout.cornerRadius,
      opacity: analysis.layout.opacity,
    },

    // Visual properties
    visual: {
      background: analysis.visual.fills?.[0] || null,
      borders: analysis.visual.strokes || [],
      effects: analysis.visual.effects || [],
    },

    // Child elements
    children: analysis.children || [],
  };

  return spec;
}

function saveAnalysis(analysis: any, spec: any): void {
  const outputDir = path.join(__dirname, '../data/figma-analysis');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save detailed analysis
  const analysisPath = path.join(outputDir, 'cta-component-analysis.json');
  fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
  console.log(`✅ Detailed analysis saved to: ${analysisPath}`);

  // Save component spec
  const specPath = path.join(outputDir, 'cta-component-spec.json');
  fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));
  console.log(`✅ Component spec saved to: ${specPath}`);

  // Generate markdown report
  const reportPath = path.join(outputDir, 'cta-component-report.md');
  const report = generateMarkdownReport(spec);
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Markdown report saved to: ${reportPath}`);
}

function generateMarkdownReport(spec: any): string {
  return `# CTA Component Analysis

## Component Information
- **Name**: ${spec.componentName}
- **Figma Node ID**: ${spec.figmaNodeId}
- **Figma Node Name**: ${spec.figmaNodeName}
- **Extracted At**: ${spec.extractedAt}

## Dimensions
- **Width**: ${spec.dimensions.width}px
- **Height**: ${spec.dimensions.height}px
- **Constraints**: 
  - Horizontal: ${spec.dimensions.constraints?.horizontal}
  - Vertical: ${spec.dimensions.constraints?.vertical}

## Layout Properties
${spec.layout.autoLayout ? `
### Auto Layout
- **Mode**: ${spec.layout.autoLayout.mode}
- **Primary Axis Sizing**: ${spec.layout.autoLayout.primaryAxisSizingMode}
- **Counter Axis Sizing**: ${spec.layout.autoLayout.counterAxisSizingMode}
- **Primary Axis Alignment**: ${spec.layout.autoLayout.primaryAxisAlignItems}
- **Counter Axis Alignment**: ${spec.layout.autoLayout.counterAxisAlignItems}
- **Padding**: 
  - Left: ${spec.layout.autoLayout.paddingLeft}px
  - Right: ${spec.layout.autoLayout.paddingRight}px
  - Top: ${spec.layout.autoLayout.paddingTop}px
  - Bottom: ${spec.layout.autoLayout.paddingBottom}px
- **Item Spacing**: ${spec.layout.autoLayout.itemSpacing}px
` : '- No auto layout'}

${spec.layout.cornerRadius ? `- **Corner Radius**: ${spec.layout.cornerRadius}px` : ''}
${spec.layout.opacity !== undefined ? `- **Opacity**: ${spec.layout.opacity}` : ''}

## Visual Properties
${spec.visual.background ? `
### Background
- **Type**: ${spec.visual.background.type}
- **Color**: ${spec.visual.background.color?.hex || 'N/A'}
- **Opacity**: ${spec.visual.background.color?.opacity || 'N/A'}
` : '- No background'}

${spec.visual.borders.length > 0 ? `
### Borders
${spec.visual.borders.map((border: any, index: number) => `
#### Border ${index + 1}
- **Type**: ${border.type}
- **Color**: ${border.color?.hex || 'N/A'}
- **Weight**: ${border.weight}px
- **Opacity**: ${border.color?.opacity || 'N/A'}
`).join('')}
` : '- No borders'}

${spec.visual.effects.length > 0 ? `
### Effects
${spec.visual.effects.map((effect: any, index: number) => `
#### Effect ${index + 1}
- **Type**: ${effect.type}
- **Color**: ${effect.color?.hex || 'N/A'}
- **Offset**: ${effect.offset?.x || 0}px, ${effect.offset?.y || 0}px
- **Radius**: ${effect.radius || 0}px
- **Visible**: ${effect.visible}
`).join('')}
` : '- No effects'}

## Child Elements
${spec.children.length > 0 ? spec.children.map((child: any, index: number) => `
### Child ${index + 1}: ${child.name}
- **Type**: ${child.type}
- **ID**: ${child.id}
- **Visible**: ${child.visible}
${child.layout.boundingBox ? `
- **Dimensions**: ${child.layout.boundingBox.width}px × ${child.layout.boundingBox.height}px
- **Position**: (${child.layout.boundingBox.x}, ${child.layout.boundingBox.y})
` : ''}
${child.text ? `
- **Text**: "${child.text.characters}"
- **Font**: ${child.text.style.fontFamily}
- **Size**: ${child.text.style.fontSize}
- **Weight**: ${child.text.style.fontWeight}
- **Line Height**: ${child.text.style.lineHeight}
` : ''}
`).join('') : '- No children'}

## Implementation Notes
1. Use design tokens for all colors, spacing, and typography
2. Follow responsive breakpoints: 390px (mobile), 810px (tablet), 1440px (desktop)
3. Implement hover states if specified in Figma
4. Ensure accessibility compliance
5. Test across all breakpoints
`;
}

async function main() {
  console.log('🔍 Extracting CTA component from Figma...');
  console.log(`📁 File Key: ${FIGMA_FILE_KEY}`);
  console.log(`🎯 Node ID: ${CTA_NODE_ID}`);

  if (!FIGMA_ACCESS_TOKEN) {
    console.error('❌ FIGMA_ACCESS_TOKEN environment variable is required');
    process.exit(1);
  }

  try {
    // First, let's get the file info to see what nodes are available
    console.log('\n📋 Getting file information...');
    const fileResponse = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );
    
    console.log(`📄 File name: ${fileResponse.data.name}`);
    console.log(`📅 Last modified: ${fileResponse.data.lastModified}`);
    console.log(`👥 Role: ${fileResponse.data.role}`);
    
    // Fetch the CTA component node
    const node = await getFigmaNode(FIGMA_FILE_KEY, CTA_NODE_ID);
    
    if (!node) {
      console.error('❌ Could not fetch CTA component from Figma');
      console.log('\n🔍 Available nodes in response:');
      console.log(Object.keys(fileResponse.data.document.children || []));
      process.exit(1);
    }

    console.log(`✅ Successfully fetched CTA component: ${node.name}`);

    // Analyze the node
    const analysis = analyzeNode(node);
    console.log('✅ Component analysis complete');

    // Generate component specification
    const spec = generateComponentSpec(analysis);
    console.log('✅ Component specification generated');

    // Save results
    saveAnalysis(analysis, spec);

    console.log('\n🎉 CTA component extraction complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Review the generated files in data/figma-analysis/');
    console.log('2. Use the component spec to implement the CTA component');
    console.log('3. Follow the systematic component audit workflow');

  } catch (error) {
    console.error('❌ Error during extraction:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 