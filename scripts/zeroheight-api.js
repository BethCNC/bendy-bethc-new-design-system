#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

/**
 * Zeroheight API Integration
 * Uploads design tokens to Zeroheight via API
 */

class ZeroheightAPI {
  constructor() {
    this.baseUrl = 'https://api.zeroheight.com/v1';
    this.accessToken = process.env.ZERO_HEIGHT_ACCESS_TOKEN;
    this.clientId = process.env.ZERO_HEIGHT_CLIENT_ID;
    
    if (!this.accessToken) {
      throw new Error('ZERO_HEIGHT_ACCESS_TOKEN environment variable is required');
    }
  }
  
  async uploadTokens(tokens, collectionName = 'design-tokens') {
    try {
      console.log(`🚀 Uploading ${Object.keys(tokens).length} tokens to Zeroheight...`);
      
      const payload = {
        collection: collectionName,
        tokens: tokens,
        version: '1.0.0',
        description: 'Design tokens from Figma'
      };
      
      const response = await fetch(`${this.baseUrl}/tokens`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Client-ID': this.clientId
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
      }
      
      const result = await response.json();
      console.log('✅ Tokens uploaded successfully!');
      console.log(`📊 Collection: ${result.collection}`);
      console.log(`🔗 View at: https://zeroheight.com/collection/${result.collection}`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Upload failed:', error.message);
      throw error;
    }
  }
  
  async getCollections() {
    try {
      const response = await fetch(`${this.baseUrl}/collections`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Client-ID': this.clientId
        }
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('❌ Failed to fetch collections:', error.message);
      throw error;
    }
  }
  
  async updateTokens(tokens, collectionName) {
    try {
      console.log(`🔄 Updating tokens in collection: ${collectionName}`);
      
      const response = await fetch(`${this.baseUrl}/tokens/${collectionName}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Client-ID': this.clientId
        },
        body: JSON.stringify({
          tokens: tokens,
          version: '1.0.1'
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
      }
      
      console.log('✅ Tokens updated successfully!');
      return await response.json();
      
    } catch (error) {
      console.error('❌ Update failed:', error.message);
      throw error;
    }
  }
}

async function main() {
  try {
    // Check environment variables
    if (!process.env.ZERO_HEIGHT_ACCESS_TOKEN) {
      console.error('❌ ZERO_HEIGHT_ACCESS_TOKEN environment variable is required');
      process.exit(1);
    }
    
    const api = new ZeroheightAPI();
    
    // Load tokens
    const tokensPath = path.join(__dirname, '../tokens/zeroheight-tokens.json');
    if (!fs.existsSync(tokensPath)) {
      console.error('❌ Tokens file not found. Run generate-zeroheight-tokens.js first');
      process.exit(1);
    }
    
    const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
    
    // Get existing collections
    console.log('📋 Fetching existing collections...');
    const collections = await api.getCollections();
    console.log(`Found ${collections.length} collections`);
    
    // Upload tokens
    await api.uploadTokens(tokens, 'health-journey-tokens');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ZeroheightAPI; 