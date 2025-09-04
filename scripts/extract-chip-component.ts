#!/usr/bin/env tsx

import axios from 'axios';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu'; // Bendy_BethC Website

// From the Figma extraction, I can see Chip instances referenced as 269:6974, 269:6975, 269:6976
// But the actual Chip component is likely 239:13055 (from the nested structure)
const CHIP_COMPONENT_NODE_IDS = ['239:13055', '239:13056', '239:13057']; // Lead icon, Label, Trail icon

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  children?: FigmaNode[];
  fills?: any[];
  style?: any;
  effects?: any[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

function analyzeChipNode(node: FigmaNode, depth: number = 0): void {
  const indent = '  '.repeat(depth);
  
  // Look for chip-related components
  const isChipRelated = node.name.toLowerCase().includes('chip') || 
                       node.name.toLowerCase().includes('label') ||
                       node.name.toLowerCase().includes('icon') ||
                       node.type === 'INSTANCE';
  
  const marker = isChipRelated ? '🏷️' : '  ';
  
  console.log(`${indent}${marker} ${node.name} (${node.type}) - ID: ${node.id}`);
  
  if (isChipRelated) {
    console.log(`${indent}    🔗 Node ID: ${node.id}`);
    
    // Extract component details if available
    if (node.absoluteBoundingBox) {
      console.log(`${indent}    📏 Size: ${node.absoluteBoundingBox.width}x${node.absoluteBoundingBox.height}`);
    }
    
    if (node.style) {
      console.log(`${indent}    🎨 Typography: Font ${node.style.fontSize}px, Weight ${node.style.fontWeight}`);
    }
    
    if (node.fills && node.fills.length > 0) {
      console.log(`${indent}    🎨 Has fill information`);
    }
  }
  
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      analyzeChipNode(child, depth + 1);
    });
  }
}

async function findChipComponent(): Promise<void> {
  console.log('🏷️ Searching for Chip Component...');
  console.log(`📁 File Key: ${FIGMA_FILE_KEY}`);
  
  if (!FIGMA_ACCESS_TOKEN) {
    console.error('❌ FIGMA_ACCESS_TOKEN environment variable is required');
    console.log('💡 Please set FIGMA_API_KEY or FIGMA_ACCESS_TOKEN in your .env file');
    process.exit(1);
  }

  try {
    // First, get the full file to search for chip components
    console.log('🔍 Fetching full Figma file to search for Chip components...');
    
    const fullFileResponse = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    console.log('✅ Successfully fetched full file');

    // Search through all components for chip-related ones
    console.log('\n🔍 Searching for Chip components in full file...');
    
    function searchForChips(node: any, path: string = ''): void {
      if (node.name && node.name.toLowerCase().includes('chip')) {
        console.log(`\n🏷️ Found Chip Component: ${node.name}`);
        console.log(`📍 Path: ${path}`);
        console.log(`🆔 Node ID: ${node.id}`);
        console.log(`🏗️ Type: ${node.type}`);
        
        if (node.absoluteBoundingBox) {
          console.log(`📏 Size: ${node.absoluteBoundingBox.width}x${node.absoluteBoundingBox.height}`);
        }
        
        // Analyze the chip structure
        analyzeChipNode(node);
      }
      
      if (node.children) {
        node.children.forEach((child: any) => {
          const newPath = path ? `${path} > ${child.name}` : child.name;
          searchForChips(child, newPath);
        });
      }
    }

    searchForChips(fullFileResponse.data.document);

    // Also search in components specifically
    if (fullFileResponse.data.components) {
      console.log('\n🔍 Searching in component definitions...');
      
      Object.entries(fullFileResponse.data.components).forEach(([key, component]: [string, any]) => {
        if (component.name && component.name.toLowerCase().includes('chip')) {
          console.log(`\n🏷️ Found Chip Component Definition: ${component.name}`);
          console.log(`🆔 Component Key: ${key}`);
          console.log(`🏗️ Type: ${component.type || 'COMPONENT'}`);
        }
      });
    }

    // Save the analysis
    const outputDir = './figma-blog-analysis';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Extract just the chip-related data for easier analysis
    const chipData = {
      searchResults: 'See console output above',
      components: fullFileResponse.data.components,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(outputDir, 'chip-search-results.json'),
      JSON.stringify(chipData, null, 2)
    );

    console.log('\n💾 Chip search results saved to ./figma-blog-analysis/chip-search-results.json');
    console.log('✅ Chip component search complete!');

  } catch (error) {
    console.error('❌ Error fetching Figma data:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
  }
}

// Run the search
findChipComponent().catch(console.error);