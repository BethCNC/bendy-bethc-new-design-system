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

if (!FIGMA_ACCESS_TOKEN) {
  console.error('❌ FIGMA_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

interface FigmaFileResponse {
  document: FigmaNode;
}

async function fetchFigmaFile(): Promise<FigmaFileResponse> {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}`;
  
  console.log(`🔄 Fetching Figma file to find pagination node...`);
  
  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': FIGMA_ACCESS_TOKEN!,
    },
  });

  if (!response.ok) {
    throw new Error(`Figma API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function searchForPaginationNodes(node: FigmaNode, depth: number = 0): void {
  const indent = '  '.repeat(depth);
  
  // Check if this node or its name contains "pagination" or "page"
  const name = node.name.toLowerCase();
  const isPaginationRelated = name.includes('pagination') || 
                              name.includes('paginat') ||
                              name.includes('page') ||
                              name.includes('nav') ||
                              (name.includes('1') && name.includes('2') && name.includes('3'));
  
  if (isPaginationRelated || node.id === '273:1710' || node.id === '273-1710') {
    console.log(`🎯 ${indent}FOUND POTENTIAL PAGINATION: "${node.name}" (ID: ${node.id}, Type: ${node.type})`);
  }
  
  // Also log all top-level nodes to see structure
  if (depth < 3) {
    console.log(`${indent}"${node.name}" (ID: ${node.id}, Type: ${node.type})`);
  }
  
  if (node.children) {
    for (const child of node.children) {
      searchForPaginationNodes(child, depth + 1);
    }
  }
}

async function main() {
  try {
    console.log('🔍 Searching for pagination component nodes...\n');
    
    const figmaData = await fetchFigmaFile();
    console.log('📄 File structure:\n');
    
    searchForPaginationNodes(figmaData.document);
    
  } catch (error) {
    console.error('❌ Error searching for pagination nodes:', error);
  }
}

main();