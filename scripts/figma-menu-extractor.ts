import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env files
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Configuration
const FIGMA_FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu';
const MENU_ITEM_NODE_ID = '16:13565';
const MENU_NODE_ID = '16:13558';

// Get Figma API token from environment
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_ACCESS_TOKEN) {
  console.error('❌ Error: FIGMA_ACCESS_TOKEN environment variable is required');
  console.log('📝 Check your .env file for FIGMA_API_KEY or FIGMA_ACCESS_TOKEN');
  process.exit(1);
}

/**
 * Fetch Figma nodes using the API
 */
async function fetchFigmaNodes() {
  const nodeIds = [MENU_NODE_ID, MENU_ITEM_NODE_ID].join(',');
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${nodeIds}`;
  
  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': FIGMA_ACCESS_TOKEN,
    },
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.nodes;
}

/**
 * Extract node details recursively
 */
function extractNodeDetails(node, depth = 0) {
  const indent = '  '.repeat(depth);
  let details = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible !== false
  };

  // Layout properties
  if (node.absoluteBoundingBox) {
    details.dimensions = {
      width: node.absoluteBoundingBox.width,
      height: node.absoluteBoundingBox.height,
      x: node.absoluteBoundingBox.x,
      y: node.absoluteBoundingBox.y
    };
  }

  // Auto layout properties
  if (node.layoutMode) {
    details.autoLayout = {
      mode: node.layoutMode,
      primaryAxisSizingMode: node.primaryAxisSizingMode,
      counterAxisSizingMode: node.counterAxisSizingMode,
      primaryAxisAlignItems: node.primaryAxisAlignItems,
      counterAxisAlignItems: node.counterAxisAlignItems,
      paddingLeft: node.paddingLeft || 0,
      paddingRight: node.paddingRight || 0,
      paddingTop: node.paddingTop || 0,
      paddingBottom: node.paddingBottom || 0,
      itemSpacing: node.itemSpacing || 0
    };
  }

  // Text properties
  if (node.type === 'TEXT' && node.style) {
    details.text = {
      content: node.characters,
      fontFamily: node.style.fontFamily,
      fontSize: node.style.fontSize,
      fontWeight: node.style.fontWeight,
      lineHeight: node.style.lineHeightPx,
      letterSpacing: node.style.letterSpacing,
      textAlign: node.style.textAlignHorizontal,
      textCase: node.style.textCase
    };
  }

  // Fill/Background properties
  if (node.fills && node.fills.length > 0) {
    details.fills = node.fills.map(fill => {
      if (fill.type === 'SOLID') {
        return {
          type: fill.type,
          color: fill.color,
          opacity: fill.opacity || 1
        };
      }
      return fill;
    });
  }

  // Stroke properties
  if (node.strokes && node.strokes.length > 0) {
    details.strokes = {
      strokes: node.strokes,
      strokeWeight: node.strokeWeight,
      strokeAlign: node.strokeAlign
    };
  }

  // Corner radius
  if (node.cornerRadius !== undefined) {
    details.cornerRadius = node.cornerRadius;
  }

  // Effects (shadows, etc.)
  if (node.effects && node.effects.length > 0) {
    details.effects = node.effects;
  }

  // Component properties
  if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
    details.component = {
      key: node.componentPropertyDefinitions ? Object.keys(node.componentPropertyDefinitions) : [],
      description: node.description || ''
    };
  }

  // Instance properties
  if (node.type === 'INSTANCE') {
    details.instance = {
      componentId: node.componentId,
      overrides: node.overrides || []
    };
  }

  // Recursively process children
  if (node.children && node.children.length > 0) {
    details.children = node.children.map(child => extractNodeDetails(child, depth + 1));
  }

  return details;
}

/**
 * Convert color object to CSS
 */
function colorToCSS(colorObj) {
  if (!colorObj) return 'transparent';
  const { r, g, b, a = 1 } = colorObj;
  const toHex = (val) => Math.round(val * 255).toString(16).padStart(2, '0');
  
  if (a === 1) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } else {
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
  }
}

/**
 * Generate CSS utilities from component data
 */
function generateCSS(componentData, componentName) {
  let css = `/* === ${componentName.toUpperCase()} COMPONENT === */\n`;
  
  // Base component styles
  css += `.${componentName.toLowerCase()} {\n`;
  
  if (componentData.dimensions) {
    if (componentData.autoLayout) {
      css += `  display: flex;\n`;
      css += `  flex-direction: ${componentData.autoLayout.mode === 'HORIZONTAL' ? 'row' : 'column'};\n`;
      css += `  align-items: ${componentData.autoLayout.counterAxisAlignItems || 'center'};\n`;
      css += `  justify-content: ${componentData.autoLayout.primaryAxisAlignItems || 'flex-start'};\n`;
      css += `  gap: ${componentData.autoLayout.itemSpacing || 0}px;\n`;
      css += `  padding: ${componentData.autoLayout.paddingTop}px ${componentData.autoLayout.paddingRight}px ${componentData.autoLayout.paddingBottom}px ${componentData.autoLayout.paddingLeft}px;\n`;
    }
    
    if (componentData.autoLayout?.primaryAxisSizingMode !== 'FIXED') {
      css += `  width: 100%;\n`;
    } else {
      css += `  width: ${componentData.dimensions.width}px;\n`;
    }
    
    if (componentData.autoLayout?.counterAxisSizingMode !== 'FIXED') {
      css += `  height: auto;\n`;
    } else {
      css += `  height: ${componentData.dimensions.height}px;\n`;
    }
  }
  
  if (componentData.fills && componentData.fills[0]) {
    css += `  background-color: ${colorToCSS(componentData.fills[0].color)};\n`;
  }
  
  if (componentData.strokes && componentData.strokes.strokes[0]) {
    css += `  border: ${componentData.strokes.strokeWeight}px solid ${colorToCSS(componentData.strokes.strokes[0].color)};\n`;
  }
  
  if (componentData.cornerRadius) {
    css += `  border-radius: ${componentData.cornerRadius}px;\n`;
  }
  
  css += `}\n\n`;
  
  // Process children for additional styles
  if (componentData.children) {
    componentData.children.forEach(child => {
      if (child.type === 'TEXT' && child.text) {
        css += `.${componentName.toLowerCase()}-text {\n`;
        css += `  font-family: "${child.text.fontFamily}";\n`;
        css += `  font-size: ${child.text.fontSize}px;\n`;
        css += `  font-weight: ${child.text.fontWeight};\n`;
        css += `  line-height: ${child.text.lineHeight}px;\n`;
        css += `  text-align: ${child.text.textAlign.toLowerCase()};\n`;
        if (child.fills && child.fills[0]) {
          css += `  color: ${colorToCSS(child.fills[0].color)};\n`;
        }
        css += `}\n\n`;
      }
    });
  }
  
  return css;
}

/**
 * Main extraction function
 */
async function extractMenuComponents() {
  try {
    console.log('🚀 Starting Figma Menu Component Extraction...\n');
    console.log(`📁 File: ${FIGMA_FILE_KEY}`);
    console.log(`🎯 Menu Node: ${MENU_NODE_ID}`);
    console.log(`🎯 MenuItem Node: ${MENU_ITEM_NODE_ID}\n`);
    
    // Get nodes data
    console.log('📡 Fetching Figma nodes...');
    const nodes = await fetchFigmaNodes();
    
    const menuNode = nodes[MENU_NODE_ID];
    const menuItemNode = nodes[MENU_ITEM_NODE_ID];
    
    if (!menuNode && !menuItemNode) {
      throw new Error('Target nodes not found');
    }
    
    console.log('✅ Found target components\n');
    
    // Extract details
    const results = {
      extractedAt: new Date().toISOString(),
      fileKey: FIGMA_FILE_KEY,
      components: {}
    };
    
    if (menuNode && menuNode.document) {
      console.log('🔍 Extracting Menu component details...');
      results.components.menu = extractNodeDetails(menuNode.document);
    }
    
    if (menuItemNode && menuItemNode.document) {
      console.log('🔍 Extracting MenuItem component details...');
      results.components.menuItem = extractNodeDetails(menuItemNode.document);
    }
    
    // Save raw data
    const outputDir = path.join(process.cwd(), 'data', 'figma-analysis');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const rawDataPath = path.join(outputDir, 'menu-components-raw.json');
    fs.writeFileSync(rawDataPath, JSON.stringify(results, null, 2));
    console.log(`📝 Raw data saved: ${rawDataPath}`);
    
    // Generate CSS
    let generatedCSS = '/* Generated from Figma Menu Components */\n\n';
    
    if (results.components.menu) {
      generatedCSS += generateCSS(results.components.menu, 'Menu');
    }
    
    if (results.components.menuItem) {
      generatedCSS += generateCSS(results.components.menuItem, 'MenuItem');
    }
    
    const cssPath = path.join(outputDir, 'menu-components.css');
    fs.writeFileSync(cssPath, generatedCSS);
    console.log(`🎨 CSS generated: ${cssPath}`);
    
    // Generate summary report
    const report = generateReport(results);
    const reportPath = path.join(outputDir, 'menu-extraction-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`📊 Report generated: ${reportPath}`);
    
    console.log('\n✅ Extraction completed successfully!');
    
  } catch (error) {
    console.error('❌ Extraction failed:', error.message);
    process.exit(1);
  }
}

/**
 * Generate markdown report
 */
function generateReport(data) {
  let report = '# Figma Menu Components Extraction Report\n\n';
  report += `**Extracted:** ${data.extractedAt}\n`;
  report += `**File ID:** ${data.fileId}\n\n`;
  
  Object.entries(data.components).forEach(([name, component]) => {
    report += `## ${name.charAt(0).toUpperCase() + name.slice(1)} Component\n\n`;
    report += `- **Type:** ${component.type}\n`;
    report += `- **Name:** ${component.name}\n`;
    
    if (component.dimensions) {
      report += `- **Dimensions:** ${component.dimensions.width}×${component.dimensions.height}px\n`;
    }
    
    if (component.autoLayout) {
      report += `- **Layout:** ${component.autoLayout.mode} layout\n`;
      report += `- **Padding:** ${component.autoLayout.paddingTop}px ${component.autoLayout.paddingRight}px ${component.autoLayout.paddingBottom}px ${component.autoLayout.paddingLeft}px\n`;
      report += `- **Gap:** ${component.autoLayout.itemSpacing}px\n`;
    }
    
    if (component.children) {
      report += `- **Children:** ${component.children.length} elements\n`;
    }
    
    report += '\n';
  });
  
  return report;
}

// Run the extraction
if (import.meta.url === `file://${process.argv[1]}`) {
  extractMenuComponents();
}