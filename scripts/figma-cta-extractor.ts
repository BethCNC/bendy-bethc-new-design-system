#!/usr/bin/env npx tsx

/**
 * Figma CTA Component Extractor
 * Extracts CTA component specifications from Figma API
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY;
const FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu';
const NODE_ID = '754-108067';

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

interface FigmaResponse {
  document: FigmaNode;
  components: Record<string, any>;
  componentSets: Record<string, any>;
  schemaVersion: number;
  styles: Record<string, any>;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
}

async function extractCTASpecs() {
  try {
    console.log('🎨 Extracting CTA component from Figma...');
    console.log(`📁 File: ${FILE_KEY}`);
    console.log(`🎯 Node: ${NODE_ID}`);

    // First, let's get the file structure to find the correct node
    const fileUrl = `https://api.figma.com/v1/files/${FILE_KEY}`;
    
    const fileResponse = await fetch(fileUrl, {
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN,
      },
    });

    if (!fileResponse.ok) {
      throw new Error(`Figma API error: ${fileResponse.status} ${fileResponse.statusText}`);
    }

    const fileData = await fileResponse.json();
    console.log('✅ Figma file structure received');
    
    // Look for CTA components in the file
    function findCTANodes(node: any, path = ''): any[] {
      const ctaNodes: any[] = [];
      const currentPath = path ? `${path} > ${node.name}` : node.name;
      
      if (node.name && (
        node.name.toLowerCase().includes('cta') ||
        node.name.toLowerCase().includes('call to action') ||
        node.name.toLowerCase().includes('logo container') ||
        node.name.toLowerCase().includes('text container')
      )) {
        ctaNodes.push({ ...node, path: currentPath });
      }
      
      if (node.children) {
        node.children.forEach((child: any) => {
          ctaNodes.push(...findCTANodes(child, currentPath));
        });
      }
      
      return ctaNodes;
    }

    const ctaNodes = findCTANodes(fileData.document);
    
    console.log('\n🔍 Found CTA-related nodes:');
    ctaNodes.forEach((node, i) => {
      console.log(`${i + 1}. ${node.name} (ID: ${node.id})`);
      console.log(`   Path: ${node.path}`);
      if (node.absoluteBoundingBox) {
        console.log(`   Size: ${node.absoluteBoundingBox.width}×${node.absoluteBoundingBox.height}px`);
      }
      console.log('');
    });

    if (ctaNodes.length === 0) {
      console.log('❌ No CTA components found. Let me search for any component with "754" in the ID...');
      
      function findNodeById(node: any, searchId: string): any[] {
        const foundNodes: any[] = [];
        
        if (node.id && node.id.includes(searchId)) {
          foundNodes.push(node);
        }
        
        if (node.children) {
          node.children.forEach((child: any) => {
            foundNodes.push(...findNodeById(child, searchId));
          });
        }
        
        return foundNodes;
      }
      
      const nodesWithId = findNodeById(fileData.document, '754');
      console.log(`Found ${nodesWithId.length} nodes with "754" in ID:`);
      nodesWithId.forEach((node, i) => {
        console.log(`${i + 1}. ${node.name} (ID: ${node.id})`);
      });
      
      return;
    }

    // Find the specific CTA component we want
    const targetNode = ctaNodes.find(node => node.id === '754:108067') || ctaNodes.find(node => 
      node.path.includes('🔷  Components > CTA > container > cta') && 
      node.absoluteBoundingBox && 
      node.absoluteBoundingBox.width > 1000
    ) || ctaNodes[0];
    
    console.log(`🎯 Analyzing: ${targetNode.name} (ID: ${targetNode.id})`);
    
    // Now get detailed node information
    const nodeUrl = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${targetNode.id}`;
    
    const nodeResponse = await fetch(nodeUrl, {
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN,
      },
    });

    if (!nodeResponse.ok) {
      throw new Error(`Figma API error: ${nodeResponse.status} ${nodeResponse.statusText}`);
    }

    const nodeData = await nodeResponse.json();
    const node = nodeData.nodes[targetNode.id];
    
    if (!node) {
      throw new Error(`Node ${targetNode.id} not found in detailed response`);
    }

    console.log('\n📊 CTA Component Analysis:');
    console.log('='.repeat(50));
    
    function analyzeNode(node: FigmaNode, level = 0) {
      const indent = '  '.repeat(level);
      console.log(`${indent}📦 ${node.name} (${node.type})`);
      
      if (node.absoluteBoundingBox) {
        const { width, height } = node.absoluteBoundingBox;
        console.log(`${indent}   📏 Size: ${width}×${height}px`);
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

      if (node.layoutSizingHorizontal) {
        console.log(`${indent}   ↔️  Horizontal Sizing: ${node.layoutSizingHorizontal}`);
      }
      if (node.layoutSizingVertical) {
        console.log(`${indent}   ↕️  Vertical Sizing: ${node.layoutSizingVertical}`);
      }

      if (node.layoutGrow !== undefined) {
        console.log(`${indent}   🌱 Layout Grow: ${node.layoutGrow}`);
      }

      if (node.constraints) {
        console.log(`${indent}   🔗 Constraints: H:${node.constraints.horizontal} V:${node.constraints.vertical}`);
      }

      if (node.fills && node.fills.length > 0) {
        console.log(`${indent}   🎨 Fills: ${node.fills.length} fill(s)`);
        node.fills.forEach((fill, i) => {
          if (fill.type === 'SOLID' && fill.color) {
            const { r, g, b } = fill.color;
            const hex = '#' + [r, g, b].map(c => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
            console.log(`${indent}     ${i + 1}. Solid: ${hex} (opacity: ${fill.opacity || 1})`);
          } else if (fill.type === 'GRADIENT_LINEAR') {
            console.log(`${indent}     ${i + 1}. Linear Gradient`);
          } else {
            console.log(`${indent}     ${i + 1}. ${fill.type}`);
          }
        });
      }

      if (node.effects && node.effects.length > 0) {
        console.log(`${indent}   ✨ Effects: ${node.effects.length} effect(s)`);
        node.effects.forEach((effect, i) => {
          console.log(`${indent}     ${i + 1}. ${effect.type}`);
        });
      }

      if (node.characters) {
        console.log(`${indent}   📝 Text: "${node.characters}"`);
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
        node.children.forEach(child => analyzeNode(child, level + 1));
      }
    }

    analyzeNode(node.document);

    console.log('\n🔍 Key Findings:');
    console.log('='.repeat(30));
    
    // Find container dimensions
    const container = node.document;
    if (container.absoluteBoundingBox) {
      console.log(`📦 Container: ${container.absoluteBoundingBox.width}×${container.absoluteBoundingBox.height}px`);
    }

    // Look for logo elements
    function findLogos(node: FigmaNode): FigmaNode[] {
      const logos: FigmaNode[] = [];
      
      if (node.name.toLowerCase().includes('logo') || 
          node.name.toLowerCase().includes('bendy') ||
          node.name.toLowerCase().includes('beth')) {
        logos.push(node);
      }
      
      if (node.children) {
        node.children.forEach(child => {
          logos.push(...findLogos(child));
        });
      }
      
      return logos;
    }

    const logos = findLogos(node.document);
    if (logos.length > 0) {
      console.log('\n🖼️  Logo Elements Found:');
      logos.forEach(logo => {
        if (logo.absoluteBoundingBox) {
          console.log(`   ${logo.name}: ${logo.absoluteBoundingBox.width}×${logo.absoluteBoundingBox.height}px`);
        }
      });
    }

    // Look for responsive variants
    function findVariants(node: FigmaNode): FigmaNode[] {
      const variants: FigmaNode[] = [];
      
      if (node.name.toLowerCase().includes('mobile') || 
          node.name.toLowerCase().includes('tablet') ||
          node.name.toLowerCase().includes('desktop') ||
          node.name.toLowerCase().includes('390') ||
          node.name.toLowerCase().includes('810') ||
          node.name.toLowerCase().includes('1440')) {
        variants.push(node);
      }
      
      if (node.children) {
        node.children.forEach(child => {
          variants.push(...findVariants(child));
        });
      }
      
      return variants;
    }

    const variants = findVariants(node.document);
    if (variants.length > 0) {
      console.log('\n📱 Responsive Variants Found:');
      variants.forEach(variant => {
        if (variant.absoluteBoundingBox) {
          console.log(`   ${variant.name}: ${variant.absoluteBoundingBox.width}×${variant.absoluteBoundingBox.height}px`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error extracting CTA specs:', error);
    process.exit(1);
  }
}

// Run the extraction
extractCTASpecs();