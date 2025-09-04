import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env files
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Figma API configuration
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu';

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

function findNavComponents(node: FigmaNode): FigmaNode[] {
  const navComponents: FigmaNode[] = [];
  
  if (node.name.toLowerCase().includes('nav') || node.name.toLowerCase().includes('link')) {
    navComponents.push(node);
  }
  
  if (node.children) {
    node.children.forEach(child => {
      navComponents.push(...findNavComponents(child));
    });
  }
  
  return navComponents;
}

function extractComponentDetails(node: FigmaNode, depth = 0): any {
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
    details.children = node.children.map(child => extractComponentDetails(child, depth + 1));
  }

  return details;
}

function mapToCSSClasses(details: any): any {
  const cssMapping: any = {
    layout: {},
    typography: {},
    colors: {},
    spacing: {},
    effects: {},
  };

  // Layout mapping
  if (details.layout) {
    const layout = details.layout;
    
    if (layout.mode === 'HORIZONTAL') {
      cssMapping.layout.display = 'flex';
      cssMapping.layout.flexDirection = 'row';
    } else if (layout.mode === 'VERTICAL') {
      cssMapping.layout.display = 'flex';
      cssMapping.layout.flexDirection = 'column';
    }

    if (layout.primaryAxisAlignItems === 'CENTER') {
      cssMapping.layout.justifyContent = 'center';
    } else if (layout.primaryAxisAlignItems === 'SPACE_BETWEEN') {
      cssMapping.layout.justifyContent = 'space-between';
    }

    if (layout.counterAxisAlignItems === 'CENTER') {
      cssMapping.layout.alignItems = 'center';
    }

    // Padding mapping
    if (layout.paddingLeft || layout.paddingRight || layout.paddingTop || layout.paddingBottom) {
      cssMapping.spacing.padding = {
        left: layout.paddingLeft,
        right: layout.paddingRight,
        top: layout.paddingTop,
        bottom: layout.paddingBottom,
      };
    }

    // Gap mapping
    if (layout.itemSpacing) {
      cssMapping.spacing.gap = layout.itemSpacing;
    }
  }

  // Typography mapping
  if (details.text && details.text.style) {
    const style = details.text.style;
    
    if (style.fontFamily) {
      cssMapping.typography.fontFamily = style.fontFamily;
    }
    
    if (style.fontWeight) {
      cssMapping.typography.fontWeight = style.fontWeight;
    }
    
    if (style.fontSize) {
      cssMapping.typography.fontSize = style.fontSize;
    }
    
    if (style.lineHeightPx) {
      cssMapping.typography.lineHeight = style.lineHeightPx;
    }
    
    if (style.textAlignHorizontal) {
      cssMapping.typography.textAlign = style.textAlignHorizontal.toLowerCase();
    }
  }

  // Colors mapping
  if (details.fills && details.fills.length > 0) {
    const fill = details.fills[0];
    if (fill.type === 'SOLID' && fill.color) {
      const { r, g, b, a } = fill.color;
      cssMapping.colors.backgroundColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
    }
  }

  if (details.strokes && details.strokes.length > 0) {
    const stroke = details.strokes[0];
    if (stroke.type === 'SOLID' && stroke.color) {
      const { r, g, b, a } = stroke.color;
      cssMapping.colors.borderColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
    }
  }

  // Border radius mapping
  if (details.cornerRadius) {
    cssMapping.effects.borderRadius = details.cornerRadius;
  }

  if (details.rectangleCornerRadii) {
    cssMapping.effects.borderRadius = details.rectangleCornerRadii;
  }

  // Effects mapping
  if (details.effects && details.effects.length > 0) {
    cssMapping.effects.shadows = details.effects.map((effect: any) => {
      if (effect.type === 'DROP_SHADOW') {
        return {
          type: 'drop-shadow',
          color: effect.color,
          offset: effect.offset,
          radius: effect.radius,
          spread: effect.spread,
        };
      }
      return effect;
    });
  }

  return cssMapping;
}

async function main() {
  try {
    console.log('🔍 Fetching Figma file and extracting navigation components...');
    console.log(`📁 File: ${FILE_KEY}`);
    console.log('');

    const fileData = await fetchFigmaFile();
    
    if (!fileData.document) {
      console.error('❌ No document found in file');
      return;
    }

    console.log('✅ Successfully fetched file data');
    console.log('');

    // Find all navigation components
    const navComponents = findNavComponents(fileData.document);
    
    console.log(`🎯 Found ${navComponents.length} navigation/link components:`);
    console.log('');

    // Create output directory
    const outputDir = path.join(process.cwd(), 'data', 'figma-analysis');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Analyze each navigation component
    navComponents.forEach((component, index) => {
      console.log(`${index + 1}. ${component.name} [${component.type}] - ID: ${component.id}`);
      
      // Extract detailed component information
      const componentDetails = extractComponentDetails(component);
      
      // Map to CSS classes
      const cssMapping = mapToCSSClasses(componentDetails);

      // Save detailed component data
      const detailsPath = path.join(outputDir, `nav-component-${component.id.replace(/:/g, '-')}-details.json`);
      fs.writeFileSync(detailsPath, JSON.stringify(componentDetails, null, 2));

      // Save CSS mapping
      const cssPath = path.join(outputDir, `nav-component-${component.id.replace(/:/g, '-')}-css-mapping.json`);
      fs.writeFileSync(cssPath, JSON.stringify(cssMapping, null, 2));

      // Generate analysis report
      const reportPath = path.join(outputDir, `nav-component-${component.id.replace(/:/g, '-')}-analysis.md`);
      const report = generateAnalysisReport(componentDetails, cssMapping);
      fs.writeFileSync(reportPath, report);

      console.log(`   📄 Details: ${detailsPath}`);
      console.log(`   🎨 CSS Mapping: ${cssPath}`);
      console.log(`   📊 Report: ${reportPath}`);
      console.log('');
    });

    console.log('🎉 Navigation component analysis complete!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

function generateAnalysisReport(details: any, cssMapping: any): string {
  return `# Navigation Component Analysis

## Component Details
- **ID**: ${details.id}
- **Name**: ${details.name}
- **Type**: ${details.type}
- **Visible**: ${details.visible}

## Layout Analysis
${details.layout ? `
- **Layout Mode**: ${details.layout.mode}
- **Primary Axis Sizing**: ${details.layout.primaryAxisSizingMode}
- **Counter Axis Sizing**: ${details.layout.counterAxisSizingMode}
- **Primary Axis Alignment**: ${details.layout.primaryAxisAlignItems}
- **Counter Axis Alignment**: ${details.layout.counterAxisAlignItems}
- **Padding**: L:${details.layout.paddingLeft || 0} R:${details.layout.paddingRight || 0} T:${details.layout.paddingTop || 0} B:${details.layout.paddingBottom || 0}
- **Item Spacing**: ${details.layout.itemSpacing || 0}
` : 'No layout properties found'}

## CSS Class Mapping

### Layout Classes
\`\`\`json
${JSON.stringify(cssMapping.layout, null, 2)}
\`\`\`

### Typography Classes
\`\`\`json
${JSON.stringify(cssMapping.typography, null, 2)}
\`\`\`

### Color Classes
\`\`\`json
${JSON.stringify(cssMapping.colors, null, 2)}
\`\`\`

### Spacing Classes
\`\`\`json
${JSON.stringify(cssMapping.spacing, null, 2)}
\`\`\`

### Effects Classes
\`\`\`json
${JSON.stringify(cssMapping.effects, null, 2)}
\`\`\`

## Recommended CSS Classes

Based on the Figma component analysis, here are the recommended CSS classes for your design system:

${generateRecommendedClasses(cssMapping)}

## Raw Component Data
\`\`\`json
${JSON.stringify(details, null, 2)}
\`\`\`
`;
}

function generateRecommendedClasses(cssMapping: any): string {
  let recommendations = '';

  // Layout recommendations
  if (cssMapping.layout.display) {
    recommendations += `- **Display**: \`${cssMapping.layout.display}\`\n`;
  }
  if (cssMapping.layout.flexDirection) {
    recommendations += `- **Flex Direction**: \`${cssMapping.layout.flexDirection}\`\n`;
  }
  if (cssMapping.layout.justifyContent) {
    recommendations += `- **Justify Content**: \`${cssMapping.layout.justifyContent}\`\n`;
  }
  if (cssMapping.layout.alignItems) {
    recommendations += `- **Align Items**: \`${cssMapping.layout.alignItems}\`\n`;
  }

  // Typography recommendations
  if (cssMapping.typography.fontSize) {
    recommendations += `- **Font Size**: \`${cssMapping.typography.fontSize}px\`\n`;
  }
  if (cssMapping.typography.fontWeight) {
    recommendations += `- **Font Weight**: \`${cssMapping.typography.fontWeight}\`\n`;
  }

  // Spacing recommendations
  if (cssMapping.spacing.gap) {
    recommendations += `- **Gap**: \`${cssMapping.spacing.gap}px\`\n`;
  }

  // Effects recommendations
  if (cssMapping.effects.borderRadius) {
    recommendations += `- **Border Radius**: \`${cssMapping.effects.borderRadius}px\`\n`;
  }

  return recommendations || 'No specific recommendations based on current analysis.';
}

// Run the script
if (require.main === module) {
  main();
} 