#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env files
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Figma API configuration
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu';
const HOMEPAGE_NODE_ID = '701:50573';

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
    textCase?: string;
    textDecoration?: string;
  };
  layoutMode?: string;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  effects?: any[];
}

interface HomepageAnalysis {
  nodeId: string;
  nodeName: string;
  layout: {
    width: number;
    height: number;
    layoutMode: string;
    primaryAxisSizingMode: string;
    counterAxisSizingMode: string;
  };
  spacing: {
    padding: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
    itemSpacing: number;
  };
  children: HomepageAnalysis[];
  textContent?: string;
  typography?: {
    fontFamily: string;
    fontWeight: number;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
  };
  colors?: {
    fills: any[];
    strokes: any[];
  };
  effects?: any[];
}

async function fetchFigmaNode(nodeId: string): Promise<any> {
  if (!FIGMA_ACCESS_TOKEN) {
    throw new Error('FIGMA_API_KEY environment variable is required');
  }

  const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${nodeId}`;
  
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

function analyzeNode(node: FigmaNode): HomepageAnalysis {
  const analysis: HomepageAnalysis = {
    nodeId: node.id,
    nodeName: node.name,
    layout: {
      width: node.absoluteBoundingBox?.width || 0,
      height: node.absoluteBoundingBox?.height || 0,
      layoutMode: node.layoutMode || 'NONE',
      primaryAxisSizingMode: node.primaryAxisSizingMode || 'AUTO',
      counterAxisSizingMode: node.counterAxisSizingMode || 'AUTO',
    },
    spacing: {
      padding: {
        left: node.paddingLeft || 0,
        right: node.paddingRight || 0,
        top: node.paddingTop || 0,
        bottom: node.paddingBottom || 0,
      },
      itemSpacing: node.itemSpacing || 0,
    },
    children: [],
  };

  // Add text content if available
  if (node.characters) {
    analysis.textContent = node.characters;
  }

  // Add typography if available
  if (node.style) {
    analysis.typography = {
      fontFamily: node.style.fontFamily || '',
      fontWeight: node.style.fontWeight || 400,
      fontSize: node.style.fontSize || 16,
      lineHeight: node.style.lineHeightPx || 0,
      letterSpacing: node.style.letterSpacing || 0,
    };
  }

  // Add colors if available
  if (node.fills || node.strokes) {
    analysis.colors = {
      fills: node.fills || [],
      strokes: node.strokes || [],
    };
  }

  // Add effects if available
  if (node.effects) {
    analysis.effects = node.effects;
  }

  // Analyze children
  if (node.children) {
    analysis.children = node.children.map(child => analyzeNode(child));
  }

  return analysis;
}

function printAnalysis(analysis: HomepageAnalysis, depth = 0): void {
  const indent = '  '.repeat(depth);
  
  console.log(`${indent}📄 ${analysis.nodeName} [${analysis.nodeId}]`);
  console.log(`${indent}   Layout: ${analysis.layout.width}x${analysis.layout.height}px`);
  console.log(`${indent}   Mode: ${analysis.layout.layoutMode} (${analysis.layout.primaryAxisSizingMode}/${analysis.layout.counterAxisSizingMode})`);
  
  if (analysis.spacing.padding.left > 0 || analysis.spacing.padding.right > 0 || 
      analysis.spacing.padding.top > 0 || analysis.spacing.padding.bottom > 0) {
    console.log(`${indent}   Padding: ${analysis.spacing.padding.left}px ${analysis.spacing.padding.top}px ${analysis.spacing.padding.right}px ${analysis.spacing.padding.bottom}px`);
  }
  
  if (analysis.spacing.itemSpacing > 0) {
    console.log(`${indent}   Item Spacing: ${analysis.spacing.itemSpacing}px`);
  }
  
  if (analysis.textContent) {
    console.log(`${indent}   Text: "${analysis.textContent}"`);
  }
  
  if (analysis.typography) {
    console.log(`${indent}   Typography: ${analysis.typography.fontFamily} ${analysis.typography.fontWeight} ${analysis.typography.fontSize}px`);
  }
  
  if (analysis.colors?.fills && analysis.colors.fills.length > 0) {
    console.log(`${indent}   Fills: ${analysis.colors.fills.length} fill(s)`);
  }
  
  if (analysis.colors?.strokes && analysis.colors.strokes.length > 0) {
    console.log(`${indent}   Strokes: ${analysis.colors.strokes.length} stroke(s)`);
  }
  
  console.log('');
  
  // Analyze children
  analysis.children.forEach(child => printAnalysis(child, depth + 1));
}

function generateLayoutReport(analysis: HomepageAnalysis): string {
  let report = `# Homepage Layout Analysis\n\n`;
  report += `## Node: ${analysis.nodeName} (${analysis.nodeId})\n\n`;
  report += `### Layout Properties\n`;
  report += `- **Width**: ${analysis.layout.width}px\n`;
  report += `- **Height**: ${analysis.layout.height}px\n`;
  report += `- **Layout Mode**: ${analysis.layout.layoutMode}\n`;
  report += `- **Primary Axis Sizing**: ${analysis.layout.primaryAxisSizingMode}\n`;
  report += `- **Counter Axis Sizing**: ${analysis.layout.counterAxisSizingMode}\n\n`;
  
  if (analysis.spacing.padding.left > 0 || analysis.spacing.padding.right > 0 || 
      analysis.spacing.padding.top > 0 || analysis.spacing.padding.bottom > 0) {
    report += `### Spacing\n`;
    report += `- **Padding**: ${analysis.spacing.padding.left}px ${analysis.spacing.padding.top}px ${analysis.spacing.padding.right}px ${analysis.spacing.padding.bottom}px\n`;
  }
  
  if (analysis.spacing.itemSpacing > 0) {
    report += `- **Item Spacing**: ${analysis.spacing.itemSpacing}px\n`;
  }
  
  report += `\n### Children (${analysis.children.length})\n\n`;
  
  analysis.children.forEach((child, index) => {
    report += `#### ${index + 1}. ${child.nodeName}\n`;
    report += `- **ID**: ${child.nodeId}\n`;
    report += `- **Size**: ${child.layout.width}x${child.layout.height}px\n`;
    report += `- **Layout**: ${child.layout.layoutMode} (${child.layout.primaryAxisSizingMode}/${child.layout.counterAxisSizingMode})\n`;
    
    if (child.textContent) {
      report += `- **Text**: "${child.textContent}"\n`;
    }
    
    if (child.typography) {
      report += `- **Typography**: ${child.typography.fontFamily} ${child.typography.fontWeight} ${child.typography.fontSize}px\n`;
    }
    
    report += `\n`;
  });
  
  return report;
}

async function main() {
  try {
    console.log('🔍 Analyzing Homepage from Figma...');
    console.log(`📁 File: ${FILE_KEY}`);
    console.log(`🎯 Node: ${HOMEPAGE_NODE_ID}`);
    console.log('');

    const nodeData = await fetchFigmaNode(HOMEPAGE_NODE_ID);
    
    if (!nodeData.nodes || !nodeData.nodes[HOMEPAGE_NODE_ID]) {
      console.error('❌ Node not found');
      return;
    }

    const homepageNode = nodeData.nodes[HOMEPAGE_NODE_ID].document;
    console.log('✅ Successfully fetched homepage data');
    console.log('');
    
    const analysis = analyzeNode(homepageNode);
    
    console.log('📋 Homepage Analysis:');
    console.log('=====================');
    printAnalysis(analysis);
    
    // Generate detailed report
    const report = generateLayoutReport(analysis);
    const reportPath = path.join(__dirname, '..', 'docs', 'homepage-figma-analysis.md');
    
    fs.writeFileSync(reportPath, report);
    console.log(`📄 Detailed report saved to: ${reportPath}`);
    
    // Save raw analysis data
    const dataPath = path.join(__dirname, '..', 'data', 'homepage-figma-analysis.json');
    fs.writeFileSync(dataPath, JSON.stringify(analysis, null, 2));
    console.log(`📊 Raw data saved to: ${dataPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main(); 