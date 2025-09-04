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
const COMPONENT_NODE_ID = '754:108067';

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
  fills?: any[];
  strokes?: any[];
  strokeWeight?: number;
  cornerRadius?: number;
  characters?: string;
  style?: {
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    lineHeightPx?: number;
    letterSpacing?: number;
  };
  layoutMode?: string;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
}

async function fetchFigmaFile(): Promise<any> {
  if (!FIGMA_ACCESS_TOKEN) {
    throw new Error('FIGMA_API_KEY environment variable is required');
  }

  const url = `https://api.figma.com/v1/files/${FILE_KEY}`;
  
  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': FIGMA_ACCESS_TOKEN,
    },
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function findNodeById(nodes: any[], nodeId: string): any {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
}

function analyzeNode(node: any, depth: number = 0): any {
  const indent = '  '.repeat(depth);
  const analysis: any = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible !== false,
    dimensions: null,
    layout: null,
    typography: null,
    colors: null,
    children: []
  };

  // Dimensions
  if (node.absoluteBoundingBox) {
    analysis.dimensions = {
      x: node.absoluteBoundingBox.x,
      y: node.absoluteBoundingBox.y,
      width: node.absoluteBoundingBox.width,
      height: node.absoluteBoundingBox.height
    };
  }

  // Layout properties
  if (node.layoutMode || node.primaryAxisSizingMode || node.counterAxisSizingMode) {
    analysis.layout = {
      layoutMode: node.layoutMode,
      primaryAxisSizingMode: node.primaryAxisSizingMode,
      counterAxisSizingMode: node.counterAxisSizingMode,
      paddingLeft: node.paddingLeft,
      paddingRight: node.paddingRight,
      paddingTop: node.paddingTop,
      paddingBottom: node.paddingBottom,
      itemSpacing: node.itemSpacing
    };
  }

  // Typography
  if (node.characters && node.style) {
    analysis.typography = {
      text: node.characters,
      fontFamily: node.style.fontFamily,
      fontWeight: node.style.fontWeight,
      fontSize: node.style.fontSize,
      lineHeightPx: node.style.lineHeightPx,
      letterSpacing: node.style.letterSpacing
    };
  }

  // Colors
  if (node.fills || node.strokes) {
    analysis.colors = {
      fills: node.fills?.filter((fill: any) => fill.visible !== false) || [],
      strokes: node.strokes?.filter((stroke: any) => stroke.visible !== false) || []
    };
  }

  // Children
  if (node.children) {
    for (const child of node.children) {
      if (child.visible !== false) {
        analysis.children.push(analyzeNode(child, depth + 1));
      }
    }
  }

  return analysis;
}

async function main() {
  try {
    console.log('🔍 Analyzing updated component from Figma...\n');
    
    const figmaData = await fetchFigmaFile();
    const document = figmaData.document;
    
    // Find the specific component node
    const componentNode = findNodeById([document], COMPONENT_NODE_ID);
    
    if (!componentNode) {
      console.error(`❌ Component with ID ${COMPONENT_NODE_ID} not found`);
      return;
    }

    console.log(`✅ Found component: ${componentNode.name} (${componentNode.type})\n`);
    
    // Analyze the component
    const analysis = analyzeNode(componentNode);
    
    // Save detailed analysis
    const outputPath = path.join('docs', 'updated-component-analysis.md');
    const analysisData = {
      timestamp: new Date().toISOString(),
      nodeId: COMPONENT_NODE_ID,
      analysis: analysis
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(analysisData, null, 2));
    
    // Print summary
    console.log('📊 Component Analysis Summary:');
    console.log('================================');
    console.log(`Name: ${analysis.name}`);
    console.log(`Type: ${analysis.type}`);
    console.log(`Visible: ${analysis.visible}`);
    
    if (analysis.dimensions) {
      console.log(`\n📏 Dimensions:`);
      console.log(`  Width: ${analysis.dimensions.width}px`);
      console.log(`  Height: ${analysis.dimensions.height}px`);
      console.log(`  Position: (${analysis.dimensions.x}, ${analysis.dimensions.y})`);
    }
    
    if (analysis.layout) {
      console.log(`\n🎯 Layout Properties:`);
      console.log(`  Layout Mode: ${analysis.layout.layoutMode || 'N/A'}`);
      console.log(`  Primary Axis Sizing: ${analysis.layout.primaryAxisSizingMode || 'N/A'}`);
      console.log(`  Counter Axis Sizing: ${analysis.layout.counterAxisSizingMode || 'N/A'}`);
      if (analysis.layout.paddingLeft !== undefined) {
        console.log(`  Padding: ${analysis.layout.paddingLeft}px left, ${analysis.layout.paddingRight}px right, ${analysis.layout.paddingTop}px top, ${analysis.layout.paddingBottom}px bottom`);
      }
      if (analysis.layout.itemSpacing !== undefined) {
        console.log(`  Item Spacing: ${analysis.layout.itemSpacing}px`);
      }
    }
    
    if (analysis.typography) {
      console.log(`\n📝 Typography:`);
      console.log(`  Text: "${analysis.typography.text}"`);
      console.log(`  Font: ${analysis.typography.fontFamily} ${analysis.typography.fontWeight}`);
      console.log(`  Size: ${analysis.typography.fontSize}px`);
      if (analysis.typography.lineHeightPx) {
        console.log(`  Line Height: ${analysis.typography.lineHeightPx}px`);
      }
      if (analysis.typography.letterSpacing) {
        console.log(`  Letter Spacing: ${analysis.typography.letterSpacing}`);
      }
    }
    
    if (analysis.colors) {
      console.log(`\n🎨 Colors:`);
      if (analysis.colors.fills.length > 0) {
        console.log(`  Fills: ${analysis.colors.fills.length} fill(s)`);
      }
      if (analysis.colors.strokes.length > 0) {
        console.log(`  Strokes: ${analysis.colors.strokes.length} stroke(s)`);
      }
    }
    
    console.log(`\n👥 Children: ${analysis.children.length} visible child(ren)`);
    
    if (analysis.children.length > 0) {
      console.log('\n📋 Child Components:');
      analysis.children.forEach((child: any, index: number) => {
        console.log(`  ${index + 1}. ${child.name} (${child.type})`);
        if (child.dimensions) {
          console.log(`     Size: ${child.dimensions.width}px × ${child.dimensions.height}px`);
        }
        if (child.typography) {
          console.log(`     Text: "${child.typography.text}"`);
        }
      });
    }
    
    console.log(`\n💾 Detailed analysis saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error analyzing component:', error);
  }
}

main(); 