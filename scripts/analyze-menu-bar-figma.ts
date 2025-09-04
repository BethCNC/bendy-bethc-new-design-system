import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env files
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Figma API configuration
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu';
const MENU_BAR_NODE_ID = '16:13558'; // Menu Bar Node ID from documentation

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
  constraints?: {
    horizontal: string;
    vertical: string;
  };
  layoutAlign?: string;
  layoutGrow?: number;
  opacity?: number;
  blendMode?: string;
  preserveRatio?: boolean;
  layoutPositioning?: string;
  strokeAlign?: string;
  strokeCap?: string;
  strokeJoin?: string;
  dashPattern?: number[];
  rectangleCornerRadii?: number[];
  characterStyleOverrides?: number[];
  styleOverrideTable?: any;
  lineTypes?: string[];
  lineIndentations?: number[];
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

function extractMenuBarDetails(node: FigmaNode, depth = 0): any {
  const details: any = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
  };

  // Layout properties
  if (node.layoutMode) {
    details.layout = {
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

  // Sizing and positioning
  if (node.absoluteBoundingBox) {
    details.boundingBox = node.absoluteBoundingBox;
  }

  if (node.constraints) {
    details.constraints = node.constraints;
  }

  // Visual properties
  if (node.fills && node.fills.length > 0) {
    details.fills = node.fills;
  }

  if (node.strokes && node.strokes.length > 0) {
    details.strokes = node.strokes;
  }

  if (node.strokeWeight) {
    details.strokeWeight = node.strokeWeight;
  }

  if (node.cornerRadius) {
    details.cornerRadius = node.cornerRadius;
  }

  if (node.rectangleCornerRadii) {
    details.rectangleCornerRadii = node.rectangleCornerRadii;
  }

  // Effects (shadows, etc.)
  if (node.effects && node.effects.length > 0) {
    details.effects = node.effects;
  }

  // Typography
  if (node.characters) {
    details.text = {
      characters: node.characters,
      style: node.style,
      characterStyleOverrides: node.characterStyleOverrides,
      styleOverrideTable: node.styleOverrideTable,
    };
  }

  // Opacity and blend mode
  if (node.opacity !== undefined) {
    details.opacity = node.opacity;
  }

  if (node.blendMode) {
    details.blendMode = node.blendMode;
  }

  // Children
  if (node.children && node.children.length > 0) {
    details.children = node.children.map(child => extractMenuBarDetails(child, depth + 1));
  }

  return details;
}

function analyzeMenuBarStructure(details: any): any {
  const analysis: any = {
    menuBar: {},
    menuItems: [],
    layout: {},
    spacing: {},
    colors: {},
    typography: {},
  };

  // Analyze the main menu bar
  if (details.layout) {
    analysis.menuBar.layout = details.layout;
  }

  if (details.boundingBox) {
    analysis.menuBar.dimensions = {
      width: details.boundingBox.width,
      height: details.boundingBox.height,
    };
  }

  if (details.fills) {
    analysis.menuBar.background = details.fills;
  }

  if (details.strokes) {
    analysis.menuBar.borders = details.strokes;
  }

  // Analyze menu items
  if (details.children) {
    details.children.forEach((child: any, index: number) => {
      const menuItem = {
        index,
        name: child.name,
        type: child.type,
        dimensions: child.boundingBox ? {
          width: child.boundingBox.width,
          height: child.boundingBox.height,
        } : null,
        layout: child.layout || null,
        background: child.fills || null,
        borders: child.strokes || null,
        text: child.text || null,
        padding: child.layout ? {
          left: child.layout.paddingLeft,
          right: child.layout.paddingRight,
          top: child.layout.paddingTop,
          bottom: child.layout.paddingBottom,
        } : null,
      };

      analysis.menuItems.push(menuItem);
    });
  }

  // Analyze spacing
  if (details.layout && details.layout.itemSpacing !== undefined) {
    analysis.spacing.itemSpacing = details.layout.itemSpacing;
  }

  // Analyze colors
  if (details.fills) {
    analysis.colors.background = details.fills;
  }

  if (details.strokes) {
    analysis.colors.borders = details.strokes;
  }

  return analysis;
}

function generateMenuBarReport(analysis: any): string {
  let report = '# Menu Bar Figma Analysis Report\n\n';
  report += '**Generated:** ' + new Date().toISOString() + '\n';
  report += '**Figma Node ID:** ' + MENU_BAR_NODE_ID + '\n\n';

  // Menu Bar Overview
  report += '## Menu Bar Overview\n\n';
  report += '- **Name:** ' + (analysis.menuBar.name || 'Menu Bar') + '\n';
  report += '- **Type:** ' + (analysis.menuBar.type || 'Component') + '\n';
  
  if (analysis.menuBar.dimensions) {
    report += '- **Dimensions:** ' + analysis.menuBar.dimensions.width + 'px × ' + analysis.menuBar.dimensions.height + 'px\n';
  }

  if (analysis.menuBar.layout) {
    report += '- **Layout Mode:** ' + (analysis.menuBar.layout.mode || 'N/A') + '\n';
    report += '- **Primary Axis Alignment:** ' + (analysis.menuBar.layout.primaryAxisAlignItems || 'N/A') + '\n';
    report += '- **Counter Axis Alignment:** ' + (analysis.menuBar.layout.counterAxisAlignItems || 'N/A') + '\n';
  }

  // Menu Items Analysis
  report += '\n## Menu Items Analysis\n\n';
  report += 'Found ' + analysis.menuItems.length + ' menu items:\n\n';

  analysis.menuItems.forEach((item: any, index: number) => {
    report += '### ' + (index + 1) + '. ' + item.name + '\n\n';
    
    if (item.dimensions) {
      report += '- **Dimensions:** ' + item.dimensions.width + 'px × ' + item.dimensions.height + 'px\n';
    }

    if (item.layout) {
      report += '- **Layout Mode:** ' + (item.layout.mode || 'N/A') + '\n';
      report += '- **Primary Axis Sizing:** ' + (item.layout.primaryAxisSizingMode || 'N/A') + '\n';
      report += '- **Counter Axis Sizing:** ' + (item.layout.counterAxisSizingMode || 'N/A') + '\n';
    }

    if (item.padding) {
      report += '- **Padding:** L:' + (item.padding.left || 0) + 'px, R:' + (item.padding.right || 0) + 'px, T:' + (item.padding.top || 0) + 'px, B:' + (item.padding.bottom || 0) + 'px\n';
    }

    if (item.text) {
      report += '- **Text:** "' + item.text.characters + '"\n';
      if (item.text.style) {
        report += '- **Font:** ' + (item.text.style.fontFamily || 'N/A') + ' ' + (item.text.style.fontWeight || '') + ' ' + (item.text.style.fontSize || '') + 'px\n';
      }
    }

    if (item.background && item.background.length > 0) {
      report += '- **Background:** ' + item.background.length + ' fill(s)\n';
    }

    if (item.borders && item.borders.length > 0) {
      report += '- **Borders:** ' + item.borders.length + ' stroke(s)\n';
    }

    report += '\n';
  });

  // Spacing Analysis
  if (analysis.spacing.itemSpacing !== undefined) {
    report += '## Spacing Analysis\n\n';
    report += '- **Item Spacing:** ' + analysis.spacing.itemSpacing + 'px\n\n';
  }

  // Color Analysis
  if (analysis.colors.background || analysis.colors.borders) {
    report += '## Color Analysis\n\n';
    
    if (analysis.colors.background) {
      report += '### Background Colors\n';
      analysis.colors.background.forEach((fill: any, index: number) => {
        report += '- Fill ' + (index + 1) + ': ' + JSON.stringify(fill) + '\n';
      });
      report += '\n';
    }

    if (analysis.colors.borders) {
      report += '### Border Colors\n';
      analysis.colors.borders.forEach((stroke: any, index: number) => {
        report += '- Stroke ' + (index + 1) + ': ' + JSON.stringify(stroke) + '\n';
      });
      report += '\n';
    }
  }

  // Implementation Recommendations
  report += '## Implementation Recommendations\n\n';
  report += '### CSS Classes Needed\n\n';
  
  if (analysis.menuBar.layout) {
    report += '```css\n';
    report += '.menu-bar {\n';
    report += '  display: flex;\n';
    report += '  align-items: ' + (analysis.menuBar.layout.counterAxisAlignItems || 'center') + ';\n';
    report += '  justify-content: ' + (analysis.menuBar.layout.primaryAxisAlignItems || 'center') + ';\n';
    if (analysis.spacing.itemSpacing !== undefined) {
      report += '  gap: ' + analysis.spacing.itemSpacing + 'px;\n';
    }
    report += '}\n';
    report += '```\n\n';
  }

  report += '### Menu Item Classes\n\n';
  analysis.menuItems.forEach((item: any, index: number) => {
    report += '```css\n';
    report += '.menu-item-' + (index + 1) + ' {\n';
    if (item.padding) {
      report += '  padding: ' + (item.padding.top || 0) + 'px ' + (item.padding.right || 0) + 'px ' + (item.padding.bottom || 0) + 'px ' + (item.padding.left || 0) + 'px;\n';
    }
    if (item.dimensions) {
      report += '  width: ' + item.dimensions.width + 'px;\n';
      report += '  height: ' + item.dimensions.height + 'px;\n';
    }
    report += '}\n';
    report += '```\n\n';
  });

  return report;
}

async function main() {
  try {
    console.log('🔍 Analyzing Menu Bar from Figma...');
    console.log('📋 Node ID: ' + MENU_BAR_NODE_ID);

    // Fetch the menu bar node from Figma
    const nodeData = await fetchFigmaNode(MENU_BAR_NODE_ID);
    
    if (!nodeData.nodes || !nodeData.nodes[MENU_BAR_NODE_ID]) {
      throw new Error('Menu bar node ' + MENU_BAR_NODE_ID + ' not found in Figma file');
    }

    const menuBarNode = nodeData.nodes[MENU_BAR_NODE_ID].document;
    console.log('✅ Found menu bar: "' + menuBarNode.name + '"');

    // Extract detailed information
    const details = extractMenuBarDetails(menuBarNode);
    console.log('📊 Extracted ' + (details.children ? details.children.length : 0) + ' child components');

    // Analyze the structure
    const analysis = analyzeMenuBarStructure(details);
    console.log('🔍 Analyzed menu bar structure with ' + analysis.menuItems.length + ' menu items');

    // Generate reports
    const report = generateMenuBarReport(analysis);

    // Create output directory
    const outputDir = path.join(process.cwd(), 'data', 'figma-analysis');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save detailed analysis
    const detailsPath = path.join(outputDir, 'menu-bar-' + MENU_BAR_NODE_ID + '-details.json');
    fs.writeFileSync(detailsPath, JSON.stringify(details, null, 2));
    console.log('💾 Saved detailed analysis to: ' + detailsPath);

    // Save analysis summary
    const analysisPath = path.join(outputDir, 'menu-bar-' + MENU_BAR_NODE_ID + '-analysis.json');
    fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
    console.log('💾 Saved analysis summary to: ' + analysisPath);

    // Save markdown report
    const reportPath = path.join(outputDir, 'menu-bar-' + MENU_BAR_NODE_ID + '-analysis.md');
    fs.writeFileSync(reportPath, report);
    console.log('📄 Saved markdown report to: ' + reportPath);

    console.log('\n✅ Menu bar analysis complete!');
    console.log('📊 Found ' + analysis.menuItems.length + ' menu items');
    console.log('📏 Menu bar dimensions: ' + (analysis.menuBar.dimensions?.width || 'N/A') + 'px × ' + (analysis.menuBar.dimensions?.height || 'N/A') + 'px');
    console.log('🎨 Layout mode: ' + (analysis.menuBar.layout?.mode || 'N/A'));

  } catch (error) {
    console.error('❌ Error analyzing menu bar:', error);
    process.exit(1);
  }
}

// Run the script
main(); 