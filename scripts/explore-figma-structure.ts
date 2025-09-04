#!/usr/bin/env tsx

import axios from 'axios';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  children?: FigmaNode[];
}

function exploreNode(node: FigmaNode, depth: number = 0, path: string = ''): void {
  const indent = '  '.repeat(depth);
  const currentPath = path ? `${path} > ${node.name}` : node.name;
  
  // Look for CTA-related components
  const isCTARelated = node.name.toLowerCase().includes('cta') || 
                      node.name.toLowerCase().includes('call') ||
                      node.name.toLowerCase().includes('action') ||
                      node.name.toLowerCase().includes('button');
  
  const marker = isCTARelated ? '🎯' : '  ';
  
  console.log(`${indent}${marker} ${node.name} (${node.type}) - ID: ${node.id}`);
  
  if (isCTARelated) {
    console.log(`${indent}    📍 Path: ${currentPath}`);
    console.log(`${indent}    🔗 Node ID: ${node.id}`);
  }
  
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      exploreNode(child, depth + 1, currentPath);
    });
  }
}

async function main() {
  console.log('🔍 Exploring Figma file structure...');
  console.log(`📁 File Key: ${FIGMA_FILE_KEY}`);

  if (!FIGMA_ACCESS_TOKEN) {
    console.error('❌ FIGMA_ACCESS_TOKEN environment variable is required');
    process.exit(1);
  }

  try {
    const response = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    console.log(`📄 File name: ${response.data.name}`);
    console.log(`📅 Last modified: ${response.data.lastModified}`);
    console.log(`👥 Role: ${response.data.role}`);
    
    console.log('\n🌳 File structure:');
    console.log('================');
    
    const document = response.data.document;
    exploreNode(document);
    
    console.log('\n🎯 CTA-related components found above');
    console.log('\n💡 To extract a specific component, use its Node ID in the extract script');
    
  } catch (error: any) {
    console.error('❌ Error exploring Figma file:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   Message: ${error.message}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 