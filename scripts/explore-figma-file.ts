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

function exploreNode(node: FigmaNode, depth = 0): void {
  const indent = '  '.repeat(depth);
  const visibility = node.visible === false ? ' (hidden)' : '';
  const childrenCount = node.children ? ` (${node.children.length} children)` : '';
  
  console.log(`${indent}📄 ${node.name} [${node.type}] - ID: ${node.id}${visibility}${childrenCount}`);
  
  if (node.children) {
    node.children.forEach(child => exploreNode(child, depth + 1));
  }
}

function findNodesByName(node: FigmaNode, searchName: string, results: FigmaNode[] = []): FigmaNode[] {
  if (node.name.toLowerCase().includes(searchName.toLowerCase())) {
    results.push(node);
  }
  
  if (node.children) {
    node.children.forEach(child => findNodesByName(child, searchName, results));
  }
  
  return results;
}

async function main() {
  try {
    console.log('🔍 Exploring Figma file structure...');
    console.log(`📁 File: ${FILE_KEY}`);
    console.log('');

    const fileData = await fetchFigmaFile();
    
    if (!fileData.document) {
      console.error('❌ No document found in file');
      return;
    }

    console.log('✅ Successfully fetched file data');
    console.log('');
    console.log('📋 File Structure:');
    console.log('==================');
    
    exploreNode(fileData.document);
    
    console.log('');
    console.log('🔍 Searching for components...');
    console.log('=============================');
    
    // Find all components
    const components = findNodesByName(fileData.document, 'component');
    const buttons = findNodesByName(fileData.document, 'button');
    const cards = findNodesByName(fileData.document, 'card');
    
    if (components.length > 0) {
      console.log('');
      console.log('🎨 Components found:');
      components.forEach(comp => {
        console.log(`  - ${comp.name} [${comp.type}] - ID: ${comp.id}`);
      });
    }
    
    if (buttons.length > 0) {
      console.log('');
      console.log('🔘 Buttons found:');
      buttons.forEach(btn => {
        console.log(`  - ${btn.name} [${btn.type}] - ID: ${btn.id}`);
      });
    }
    
    if (cards.length > 0) {
      console.log('');
      console.log('🃏 Cards found:');
      cards.forEach(card => {
        console.log(`  - ${card.name} [${card.type}] - ID: ${card.id}`);
      });
    }
    
    // Save the full file structure for reference
    const outputDir = path.join(process.cwd(), 'data', 'figma-analysis');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const structurePath = path.join(outputDir, 'figma-file-structure.json');
    fs.writeFileSync(structurePath, JSON.stringify(fileData.document, null, 2));
    console.log('');
    console.log(`📄 Full file structure saved to: ${structurePath}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
} 