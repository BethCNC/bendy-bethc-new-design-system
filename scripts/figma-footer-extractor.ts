#!/usr/bin/env npx tsx

/**
 * Figma Footer Component Extractor
 * Extracts footer component specifications from Figma API
 * Target: https://www.figma.com/design/Jj89xqSTRiTU2P4qEw5zUu/Bendy_BethC-Website?node-id=38-46776&m=dev
 */

import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY;
const FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu';
const NODE_ID = '38:46776';

if (!FIGMA_ACCESS_TOKEN) {
  console.error('❌ FIGMA_API_KEY not found in environment variables');
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
  constraints?: {
    vertical: string;
    horizontal: string;
  };
  layoutAlign?: string;
  layoutGrow?: number;
  layoutSizingHorizontal?: string;
  layoutSizingVertical?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  layoutMode?: string;
  fills?: any[];
  strokes?: any[];
  strokeWeight?: number;
  cornerRadius?: number;
  effects?: any[];
  blendMode?: string;
  opacity?: number;
  isMask?: boolean;
  exportSettings?: any[];
  characters?: string;
  style?: any;
  characterStyleOverrides?: any[];
  styleOverrideTable?: any;
  componentPropertyReferences?: any;
  boundVariables?: any;
}

interface FooterAnalysis {
  componentInfo: {
    id: string;
    name: string;
    dimensions: {
      width: number;
      height: number;
    };
    layout: {
      mode?: string;
      direction?: string;
      alignment?: {
        primary?: string;
        counter?: string;
      };
      spacing?: number;
      padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
      };
    };
  };
  textContent: Array<{
    text: string;
    element: string;
    typography?: {
      fontFamily?: string;
      fontSize?: number;
      fontWeight?: number;
      lineHeight?: number;
      letterSpacing?: number;
    };
    path: string;
  }>;
  socialMediaLinks: Array<{
    platform: string;
    text?: string;
    iconName?: string;
    path: string;
  }>;
  marqueeText?: {
    content: string;
    path: string;
  };
  colorScheme: {
    background?: string;
    text?: string;
    accents?: string[];
  };
  structure: any;
  rawData: any;
}

async function extractFooterSpecs(): Promise<void> {
  try {
    console.log('🦶 Extracting Footer component from Figma...');
    console.log(`📁 File: ${FILE_KEY}`);
    console.log(`🎯 Node: ${NODE_ID}`);

    // Get detailed node information
    const nodeUrl = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_ID}`;
    
    const nodeResponse = await fetch(nodeUrl, {
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN,
      },
    });

    if (!nodeResponse.ok) {
      throw new Error(`Figma API error: ${nodeResponse.status} ${nodeResponse.statusText}`);
    }

    const nodeData = await nodeResponse.json();
    const node = nodeData.nodes[NODE_ID];
    
    if (!node) {
      throw new Error(`Node ${NODE_ID} not found in detailed response`);
    }

    console.log('✅ Footer component data received');
    console.log(`📦 Component: ${node.document.name}`);

    // Initialize analysis object
    const analysis: FooterAnalysis = {
      componentInfo: {
        id: NODE_ID,
        name: node.document.name,
        dimensions: {
          width: node.document.absoluteBoundingBox?.width || 0,
          height: node.document.absoluteBoundingBox?.height || 0,
        },
        layout: {
          mode: node.document.layoutMode,
          spacing: node.document.itemSpacing,
          padding: {
            top: node.document.paddingTop,
            right: node.document.paddingRight,
            bottom: node.document.paddingBottom,
            left: node.document.paddingLeft,
          },
          alignment: {
            primary: node.document.primaryAxisAlignItems,
            counter: node.document.counterAxisAlignItems,
          },
        },
      },
      textContent: [],
      socialMediaLinks: [],
      colorScheme: {
        background: undefined,
        text: undefined,
        accents: [],
      },
      structure: node.document,
      rawData: nodeData,
    };

    // Extract colors from fills
    if (node.document.fills && node.document.fills.length > 0) {
      const backgroundFill = node.document.fills.find((fill: any) => fill.type === 'SOLID');
      if (backgroundFill && backgroundFill.color) {
        const { r, g, b } = backgroundFill.color;
        analysis.colorScheme.background = '#' + [r, g, b].map(c => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
      }
    }

    console.log('\n📊 Footer Component Analysis:');
    console.log('='.repeat(50));
    
    function analyzeNode(node: FigmaNode, level = 0, path = '') {
      const indent = '  '.repeat(level);
      const currentPath = path ? `${path} > ${node.name}` : node.name;
      
      console.log(`${indent}📦 ${node.name} (${node.type})`);
      
      if (node.absoluteBoundingBox) {
        const { width, height } = node.absoluteBoundingBox;
        console.log(`${indent}   📏 Size: ${width}×${height}px`);
      }

      // Extract text content
      if (node.characters) {
        console.log(`${indent}   📝 Text: "${node.characters}"`);
        
        const textEntry = {
          text: node.characters,
          element: node.name,
          path: currentPath,
          typography: undefined as any,
        };

        if (node.style) {
          textEntry.typography = {
            fontFamily: node.style.fontFamily,
            fontSize: node.style.fontSize,
            fontWeight: node.style.fontWeight,
            lineHeight: node.style.lineHeightPx,
            letterSpacing: node.style.letterSpacing,
          };
        }

        analysis.textContent.push(textEntry);

        // Check for marquee text (long scrolling text)
        if (node.characters.length > 50 || 
            node.name.toLowerCase().includes('marquee') ||
            node.name.toLowerCase().includes('scroll')) {
          analysis.marqueeText = {
            content: node.characters,
            path: currentPath,
          };
        }

        // Check for social media links
        const socialPlatforms = ['instagram', 'twitter', 'linkedin', 'github', 'facebook', 'youtube', 'tiktok', 'email', 'mail'];
        const text = node.characters.toLowerCase();
        const name = node.name.toLowerCase();
        
        for (const platform of socialPlatforms) {
          if (text.includes(platform) || name.includes(platform) || text.includes('@')) {
            analysis.socialMediaLinks.push({
              platform: platform,
              text: node.characters,
              path: currentPath,
            });
            break;
          }
        }
      }

      if (node.paddingTop !== undefined || node.paddingLeft !== undefined) {
        console.log(`${indent}   📐 Padding: T:${node.paddingTop || 0} R:${node.paddingRight || 0} B:${node.paddingBottom || 0} L:${node.paddingLeft || 0}`);
      }

      if (node.layoutMode) {
        console.log(`${indent}   🔄 Layout: ${node.layoutMode}`);
        if (node.primaryAxisSizingMode) {
          console.log(`${indent}   📊 Primary Axis: ${node.primaryAxisSizingMode}`);
        }
        if (node.counterAxisSizingMode) {
          console.log(`${indent}   📊 Counter Axis: ${node.counterAxisSizingMode}`);
        }
        if (node.primaryAxisAlignItems) {
          console.log(`${indent}   ⚡ Primary Align: ${node.primaryAxisAlignItems}`);
        }
        if (node.counterAxisAlignItems) {
          console.log(`${indent}   ⚡ Counter Align: ${node.counterAxisAlignItems}`);
        }
        if (node.itemSpacing !== undefined) {
          console.log(`${indent}   📏 Item Spacing: ${node.itemSpacing}px`);
        }
      }

      if (node.fills && node.fills.length > 0) {
        console.log(`${indent}   🎨 Fills: ${node.fills.length} fill(s)`);
        node.fills.forEach((fill, i) => {
          if (fill.type === 'SOLID' && fill.color) {
            const { r, g, b } = fill.color;
            const hex = '#' + [r, g, b].map(c => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
            console.log(`${indent}     ${i + 1}. Solid: ${hex} (opacity: ${fill.opacity || 1})`);
            analysis.colorScheme.accents?.push(hex);
          } else if (fill.type === 'GRADIENT_LINEAR') {
            console.log(`${indent}     ${i + 1}. Linear Gradient`);
          } else {
            console.log(`${indent}     ${i + 1}. ${fill.type}`);
          }
        });
      }

      if (node.style) {
        console.log(`${indent}   🔤 Typography:`);
        if (node.style.fontFamily) console.log(`${indent}     Font: ${node.style.fontFamily}`);
        if (node.style.fontSize) console.log(`${indent}     Size: ${node.style.fontSize}px`);
        if (node.style.fontWeight) console.log(`${indent}     Weight: ${node.style.fontWeight}`);
        if (node.style.lineHeightPx) console.log(`${indent}     Line Height: ${node.style.lineHeightPx}px`);
        if (node.style.letterSpacing) console.log(`${indent}     Letter Spacing: ${node.style.letterSpacing}px`);
      }

      console.log('');

      if (node.children) {
        node.children.forEach(child => analyzeNode(child, level + 1, currentPath));
      }
    }

    analyzeNode(node.document);

    console.log('\n🔍 Footer Content Summary:');
    console.log('='.repeat(40));
    
    if (analysis.textContent.length > 0) {
      console.log('\n📝 All Text Content:');
      analysis.textContent.forEach((text, i) => {
        console.log(`${i + 1}. "${text.text}" (${text.element})`);
        console.log(`   Path: ${text.path}`);
        if (text.typography?.fontFamily) {
          console.log(`   Font: ${text.typography.fontFamily} ${text.typography.fontSize}px`);
        }
        console.log('');
      });
    }

    if (analysis.marqueeText) {
      console.log('\n🎭 Marquee/Scrolling Text:');
      console.log(`"${analysis.marqueeText.content}"`);
      console.log(`Path: ${analysis.marqueeText.path}`);
      console.log('');
    }

    if (analysis.socialMediaLinks.length > 0) {
      console.log('\n🔗 Social Media Links:');
      analysis.socialMediaLinks.forEach((link, i) => {
        console.log(`${i + 1}. ${link.platform}: "${link.text}"`);
        console.log(`   Path: ${link.path}`);
      });
      console.log('');
    }

    console.log('\n🎨 Color Scheme:');
    if (analysis.colorScheme.background) {
      console.log(`Background: ${analysis.colorScheme.background}`);
    }
    if (analysis.colorScheme.accents && analysis.colorScheme.accents.length > 0) {
      console.log(`Accent Colors: ${analysis.colorScheme.accents.join(', ')}`);
    }

    console.log('\n📐 Layout Info:');
    console.log(`Dimensions: ${analysis.componentInfo.dimensions.width}×${analysis.componentInfo.dimensions.height}px`);
    if (analysis.componentInfo.layout.mode) {
      console.log(`Layout Mode: ${analysis.componentInfo.layout.mode}`);
    }
    if (analysis.componentInfo.layout.spacing) {
      console.log(`Item Spacing: ${analysis.componentInfo.layout.spacing}px`);
    }

    // Save the analysis to JSON files
    const dataDir = join(process.cwd(), 'data', 'figma-analysis');
    
    // Full analysis
    const analysisPath = join(dataDir, 'footer-component-analysis.json');
    writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
    console.log(`\n💾 Full analysis saved to: ${analysisPath}`);

    // Simplified spec for development
    const footerSpec = {
      name: analysis.componentInfo.name,
      id: analysis.componentInfo.id,
      dimensions: analysis.componentInfo.dimensions,
      layout: analysis.componentInfo.layout,
      textContent: analysis.textContent.map(t => ({
        text: t.text,
        element: t.element,
        typography: t.typography,
      })),
      socialLinks: analysis.socialMediaLinks,
      marqueeText: analysis.marqueeText,
      colors: analysis.colorScheme,
      extractedAt: new Date().toISOString(),
      figmaUrl: `https://www.figma.com/design/${FILE_KEY}?node-id=${NODE_ID.replace(':', '-')}&m=dev`,
    };

    const specPath = join(dataDir, 'footer-component-spec.json');
    writeFileSync(specPath, JSON.stringify(footerSpec, null, 2));
    console.log(`💾 Development spec saved to: ${specPath}`);

    // Create markdown report
    const reportContent = `# Footer Component Analysis

## Overview
- **Component**: ${analysis.componentInfo.name}
- **Figma Node ID**: ${NODE_ID}
- **Dimensions**: ${analysis.componentInfo.dimensions.width}×${analysis.componentInfo.dimensions.height}px
- **Extracted**: ${new Date().toISOString()}

## Layout Structure
- **Layout Mode**: ${analysis.componentInfo.layout.mode || 'Not specified'}
- **Item Spacing**: ${analysis.componentInfo.layout.spacing || 0}px
- **Padding**: T:${analysis.componentInfo.layout.padding?.top || 0} R:${analysis.componentInfo.layout.padding?.right || 0} B:${analysis.componentInfo.layout.padding?.bottom || 0} L:${analysis.componentInfo.layout.padding?.left || 0}

## Text Content

${analysis.textContent.map((text, i) => `
### ${i + 1}. ${text.element}
- **Text**: "${text.text}"
- **Path**: ${text.path}
${text.typography ? `- **Font**: ${text.typography.fontFamily || 'Not specified'}
- **Size**: ${text.typography.fontSize || 'Not specified'}px
- **Weight**: ${text.typography.fontWeight || 'Not specified'}` : ''}
`).join('')}

${analysis.marqueeText ? `## Marquee/Scrolling Text
- **Content**: "${analysis.marqueeText.content}"
- **Path**: ${analysis.marqueeText.path}
` : ''}

${analysis.socialMediaLinks.length > 0 ? `## Social Media Links
${analysis.socialMediaLinks.map((link, i) => `
### ${i + 1}. ${link.platform}
- **Text**: "${link.text}"
- **Path**: ${link.path}
`).join('')}` : ''}

## Color Scheme
${analysis.colorScheme.background ? `- **Background**: ${analysis.colorScheme.background}` : ''}
${analysis.colorScheme.accents && analysis.colorScheme.accents.length > 0 ? `- **Accent Colors**: ${analysis.colorScheme.accents.join(', ')}` : ''}

## Figma Link
[View in Figma](https://www.figma.com/design/${FILE_KEY}?node-id=${NODE_ID.replace(':', '-')}&m=dev)
`;

    const reportPath = join(dataDir, 'footer-component-report.md');
    writeFileSync(reportPath, reportContent);
    console.log(`📋 Analysis report saved to: ${reportPath}`);

    console.log('\n✅ Footer extraction complete!');

  } catch (error) {
    console.error('❌ Error extracting footer specs:', error);
    process.exit(1);
  }
}

// Run the extraction
extractFooterSpecs();