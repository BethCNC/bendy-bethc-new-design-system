#!/usr/bin/env tsx

import axios from 'axios';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu'; // Bendy_BethC Website
const BLOG_PAGE_NODE_ID = '1474:15170'; // Updated Blog Home page node ID
const CHIP_COMPONENT_NODE_ID = '269:3240'; // Chip component from your URL
const BLOG_CATEGORIES_NODE_ID = '1474:15162'; // Blog Categories component

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

interface FigmaResponse {
  document: FigmaNode;
  components: Record<string, any>;
  styles: Record<string, any>;
}

function analyzeNode(node: FigmaNode, depth: number = 0): void {
  const indent = '  '.repeat(depth);
  
  // Look for blog-related components
  const isBlogRelated = node.name.toLowerCase().includes('blog') || 
                       node.name.toLowerCase().includes('post') ||
                       node.name.toLowerCase().includes('article') ||
                       node.name.toLowerCase().includes('category') ||
                       node.name.toLowerCase().includes('featured') ||
                       node.name.toLowerCase().includes('pagination');
  
  const marker = isBlogRelated ? '📝' : '  ';
  
  console.log(`${indent}${marker} ${node.name} (${node.type}) - ID: ${node.id}`);
  
  if (isBlogRelated) {
    console.log(`${indent}    🔗 Node ID: ${node.id}`);
    
    // Extract component details if available
    if (node.absoluteBoundingBox) {
      console.log(`${indent}    📏 Size: ${node.absoluteBoundingBox.width}x${node.absoluteBoundingBox.height}`);
    }
    
    if (node.style) {
      console.log(`${indent}    🎨 Has styling information`);
    }
  }
  
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      analyzeNode(child, depth + 1);
    });
  }
}

async function extractBlogComponents(): Promise<void> {
  console.log('📝 Extracting Blog Components...');
  console.log(`📁 File Key: ${FIGMA_FILE_KEY}`);
  console.log(`🎯 Blog Page Node ID: ${BLOG_PAGE_NODE_ID}`);
  console.log(`🏷️ Chip Component Node ID: ${CHIP_COMPONENT_NODE_ID}`);
  console.log(`📂 Blog Categories Node ID: ${BLOG_CATEGORIES_NODE_ID}`);
  
  if (!FIGMA_ACCESS_TOKEN) {
    console.error('❌ FIGMA_ACCESS_TOKEN environment variable is required');
    console.log('💡 Please set FIGMA_API_KEY or FIGMA_ACCESS_TOKEN in your .env file');
    process.exit(1);
  }

  try {
    // Get blog page, chip component, and blog categories component
    const nodeResponse = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${BLOG_PAGE_NODE_ID},${CHIP_COMPONENT_NODE_ID},${BLOG_CATEGORIES_NODE_ID}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    console.log('✅ Successfully fetched components');
    
    const blogPageNode = nodeResponse.data.nodes[BLOG_PAGE_NODE_ID];
    const chipComponentNode = nodeResponse.data.nodes[CHIP_COMPONENT_NODE_ID];
    const blogCategoriesNode = nodeResponse.data.nodes[BLOG_CATEGORIES_NODE_ID];
    
    if (!blogPageNode) {
      console.error('❌ Blog page node not found');
      return;
    }
    
    if (!chipComponentNode) {
      console.error('❌ Chip component node not found');
      return;
    }
    
    if (!blogCategoriesNode) {
      console.error('❌ Blog categories component node not found');
      return;
    }

    console.log('\n🏷️ Chip Component Structure:');
    analyzeNode(chipComponentNode.document);
    
    console.log('\n📂 Blog Categories Component Structure:');
    analyzeNode(blogCategoriesNode.document);
    
    console.log('\n📝 Blog Page Structure:');
    analyzeNode(blogPageNode.document);

    // Save the response for further analysis
    const outputDir = './figma-blog-analysis';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save components separately for easier analysis
    fs.writeFileSync(
      path.join(outputDir, 'chip-component-structure.json'),
      JSON.stringify(chipComponentNode, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'blog-categories-structure.json'),
      JSON.stringify(blogCategoriesNode, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'blog-page-structure.json'),
      JSON.stringify(blogPageNode, null, 2)
    );

    console.log('\n💾 Component structures saved:');
    console.log('   - Chip component: ./figma-blog-analysis/chip-component-structure.json');
    console.log('   - Blog categories: ./figma-blog-analysis/blog-categories-structure.json');
    console.log('   - Blog page: ./figma-blog-analysis/blog-page-structure.json');

    // Now get the full file to understand component relationships
    const fullFileResponse = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        },
      }
    );

    // Extract blog-related components from the full file
    console.log('\n🔍 Searching for blog components in full file...');
    analyzeNode(fullFileResponse.data.document);

    // Save full file analysis
    fs.writeFileSync(
      path.join(outputDir, 'full-file-blog-analysis.json'),
      JSON.stringify({
        blogPageNode: nodeResponse.data,
        blogCategoriesNode: blogCategoriesNode,
        components: fullFileResponse.data.components,
        styles: fullFileResponse.data.styles
      }, null, 2)
    );

    console.log('\n✅ Blog component analysis complete!');
    console.log('📁 Check ./figma-blog-analysis/ folder for detailed component specifications');

  } catch (error) {
    console.error('❌ Error fetching Figma data:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
  }
}

// Run the extraction
extractBlogComponents().catch(console.error);