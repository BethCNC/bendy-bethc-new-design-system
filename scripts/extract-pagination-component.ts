#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Figma API configuration
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu';
const NODE_ID = '273:1710'; // Pagination component node ID (container)
const OUTPUT_DIR = './component_specs/pagination';

if (!FIGMA_ACCESS_TOKEN) {
  console.error('❌ FIGMA_ACCESS_TOKEN environment variable is required');
  console.error('Please set FIGMA_API_KEY or FIGMA_ACCESS_TOKEN in your .env file');
  process.exit(1);
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  children?: FigmaNode[];
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
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  characters?: string;
  style?: {
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    lineHeightPx?: number;
    lineHeightPercent?: number;
    letterSpacing?: number;
    textAlignHorizontal?: string;
    textAlignVertical?: string;
  };
  effects?: any[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  constraints?: any;
  blendMode?: string;
  opacity?: number;
  componentPropertyDefinitions?: any;
}

interface FigmaFileResponse {
  name: string;
  lastModified: string;
  version: string;
  document: FigmaNode;
  components: Record<string, any>;
  styles: Record<string, any>;
}

async function fetchFigmaFile(): Promise<FigmaFileResponse> {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}`;
  
  console.log(`🔄 Fetching Figma file: ${FILE_KEY}`);
  
  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': FIGMA_ACCESS_TOKEN!,
    },
  });

  if (!response.ok) {
    throw new Error(`Figma API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchComponentImages(nodeId: string): Promise<Record<string, string>> {
  const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${nodeId}&format=png&scale=2`;
  
  console.log(`🖼️ Fetching component images for node: ${nodeId}`);
  
  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': FIGMA_ACCESS_TOKEN!,
    },
  });

  if (!response.ok) {
    throw new Error(`Figma Images API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.images || {};
}

function findNodeById(node: FigmaNode, targetId: string): FigmaNode | null {
  if (node.id === targetId) {
    return node;
  }
  
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, targetId);
      if (found) return found;
    }
  }
  
  return null;
}

function analyzeComponentStructure(node: FigmaNode): any {
  const analysis = {
    name: node.name,
    type: node.type,
    dimensions: node.absoluteBoundingBox,
    layout: {
      layoutMode: node.layoutMode,
      primaryAxisSizingMode: node.primaryAxisSizingMode,
      counterAxisSizingMode: node.counterAxisSizingMode,
      itemSpacing: node.itemSpacing,
      paddingLeft: node.paddingLeft,
      paddingRight: node.paddingRight,
      paddingTop: node.paddingTop,
      paddingBottom: node.paddingBottom,
    },
    styling: {
      fills: node.fills,
      strokes: node.strokes,
      strokeWeight: node.strokeWeight,
      cornerRadius: node.cornerRadius,
      effects: node.effects,
    },
    children: [],
  };

  if (node.children) {
    analysis.children = node.children.map(child => analyzeComponentStructure(child));
  }

  return analysis;
}

async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const outputPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Downloaded: ${filename}`);
  } catch (error) {
    console.error(`❌ Error downloading ${filename}:`, error);
  }
}

function generateComponentSpecsMarkdown(analysis: any): string {
  return `# Pagination Component Specifications

## Component Overview
- **Name**: ${analysis.name}
- **Type**: ${analysis.type}
- **Dimensions**: ${analysis.dimensions?.width}px × ${analysis.dimensions?.height}px

## Layout Properties
- **Layout Mode**: ${analysis.layout.layoutMode || 'Not specified'}
- **Item Spacing**: ${analysis.layout.itemSpacing || 'Not specified'}px
- **Padding**: ${analysis.layout.paddingTop || 0}px ${analysis.layout.paddingRight || 0}px ${analysis.layout.paddingBottom || 0}px ${analysis.layout.paddingLeft || 0}px

## Styling Properties
- **Corner Radius**: ${analysis.styling.cornerRadius || 0}px
- **Stroke Weight**: ${analysis.styling.strokeWeight || 0}px
- **Fill Colors**: ${JSON.stringify(analysis.styling.fills, null, 2)}
- **Stroke Colors**: ${JSON.stringify(analysis.styling.strokes, null, 2)}

## Component Structure
${JSON.stringify(analysis.children, null, 2)}

## Design System Integration
Based on the Figma specifications, this pagination component should use:
- Design system spacing tokens
- Semantic color tokens
- Typography tokens for page numbers
- Button component variants for navigation

## Implementation Notes
- Use responsive design patterns
- Implement proper keyboard navigation
- Support various pagination states (active, inactive, disabled)
- Follow accessibility best practices (ARIA labels, roles)
`;
}

async function main() {
  try {
    console.log('🚀 Starting pagination component extraction...');
    
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Created directory: ${OUTPUT_DIR}`);
    }

    // Fetch Figma file data
    const figmaData = await fetchFigmaFile();
    console.log(`📄 File: ${figmaData.name} (version: ${figmaData.version})`);

    // Find pagination component node
    const paginationNode = findNodeById(figmaData.document, NODE_ID);
    
    if (!paginationNode) {
      console.error(`❌ Pagination component not found with ID: ${NODE_ID}`);
      return;
    }

    console.log(`✅ Found pagination component: ${paginationNode.name}`);

    // Analyze component structure
    const analysis = analyzeComponentStructure(paginationNode);
    
    // Save analysis as JSON
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'component-data.json'),
      JSON.stringify(analysis, null, 2)
    );
    console.log('💾 Saved component-data.json');

    // Generate markdown documentation
    const markdownContent = generateComponentSpecsMarkdown(analysis);
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'README.md'),
      markdownContent
    );
    console.log('📝 Generated README.md');

    // Fetch and download component images
    const images = await fetchComponentImages(NODE_ID);
    
    if (images[NODE_ID]) {
      await downloadImage(images[NODE_ID], 'pagination.png');
    } else {
      console.log('⚠️ No main component image found');
    }

    // Create placeholder spec images (these would typically be manually exported from Figma)
    const specImages = [
      'Anatomy.png',
      'Styling.png',
      'Layout and spacing.png',
      'Data.png',
      'Properties.png',
      'Modes.png'
    ];

    const placeholderNote = `<!-- 
This spec image should be manually exported from Figma:
https://www.figma.com/design/Jj89xqSTRiTU2P4qEw5zUu/Bendy_BethC-Website?node-id=273-1710

Please export the corresponding specification view and replace this placeholder.
-->

# Pagination Component Specification

This specification image needs to be manually exported from Figma. 
Please follow these steps:

1. Open the Figma file: https://www.figma.com/design/Jj89xqSTRiTU2P4qEw5zUu/Bendy_BethC-Website?node-id=273-1710
2. Navigate to the pagination component specifications
3. Export the appropriate spec image (Anatomy, Styling, Layout, Data, Properties, or Modes)
4. Save as PNG with 2x scale
5. Replace this markdown file with the actual image

## Component Requirements
Based on the extracted data, this pagination component includes:
- Page number buttons with active/inactive states
- Previous/Next navigation arrows
- Responsive layout with proper spacing
- Design system color tokens
- Typography following brand guidelines
`;

    for (const specImage of specImages) {
      const specPath = path.join(OUTPUT_DIR, specImage.replace('.png', '.md'));
      fs.writeFileSync(specPath, placeholderNote);
      console.log(`📋 Created placeholder: ${specImage.replace('.png', '.md')}`);
    }

    console.log('\n🎉 Pagination component extraction completed!');
    console.log(`📁 Output saved to: ${OUTPUT_DIR}`);
    console.log('\n⚠️ IMPORTANT: Please manually export the spec images from Figma:');
    console.log('   - Anatomy.png (component structure)');
    console.log('   - Styling.png (colors, typography, design tokens)');
    console.log('   - Layout and spacing.png (spacing measurements)');
    console.log('   - Data.png (content structure)');
    console.log('   - Properties.png (component variants)');
    console.log('   - Modes.png (states and responsive behavior)');

  } catch (error) {
    console.error('❌ Error extracting pagination component:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}