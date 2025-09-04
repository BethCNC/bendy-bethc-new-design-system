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

function findHomepageNode(node: FigmaNode, path = ''): FigmaNode[] {
  const results: FigmaNode[] = [];
  
  // Check if this node is a homepage
  if (node.name.toLowerCase().includes('homepage') || 
      node.name.toLowerCase().includes('home') ||
      node.name.toLowerCase().includes('main')) {
    results.push({ ...node, name: `${path}/${node.name}` });
  }
  
  // Check children
  if (node.children) {
    node.children.forEach(child => {
      const childPath = path ? `${path}/${node.name}` : node.name;
      results.push(...findHomepageNode(child, childPath));
    });
  }
  
  return results;
}

async function main() {
  try {
    console.log('🔍 Finding Homepage Node...');
    console.log(`📁 File: ${FILE_KEY}`);
    console.log('');

    const fileData = await fetchFigmaFile();
    
    if (!fileData.document) {
      console.error('❌ No document found in file');
      return;
    }

    console.log('✅ Successfully fetched file data');
    console.log('');
    
    const homepageNodes = findHomepageNode(fileData.document);
    
    if (homepageNodes.length === 0) {
      console.log('❌ No homepage nodes found');
      return;
    }
    
    console.log('🏠 Homepage Nodes Found:');
    console.log('========================');
    
    homepageNodes.forEach((node, index) => {
      console.log(`${index + 1}. ${node.name}`);
      console.log(`   ID: ${node.id}`);
      console.log(`   Type: ${node.type}`);
      console.log(`   Visible: ${node.visible !== false ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // Save results
    const resultsPath = path.join(__dirname, '..', 'data', 'homepage-nodes.json');
    fs.writeFileSync(resultsPath, JSON.stringify(homepageNodes, null, 2));
    console.log(`📄 Results saved to: ${resultsPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main(); 