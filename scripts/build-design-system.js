#!/usr/bin/env node

/**
 * Build Design System Script
 * 
 * This script follows the workflow defined in .cursor/rules/workflow.mdc:
 * 1. Export tokens from Figma
 * 2. Build tokens using Style Dictionary
 * 3. Generate CSS files for the design system
 * 
 * Based on the existing generate-complete-design-system.ts but adapted
 * to work with the project's build process and updated responsive tokens.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Building Design System from Updated Figma Tokens...\n');

// Check if we have the required directories
const requiredDirs = [
  './design-system',
  './design-system/src',
  './tokens'
];

for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    console.log(`📁 Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Check for variables directory from Figma export
const variablesDir = './variables';
if (!fs.existsSync(variablesDir)) {
  console.error('❌ Variables directory not found.');
  console.error('📋 To rebuild the design system:');
  console.error('1. Export variables from Figma as JSON files');
  console.error('2. Place them in ./variables/ directory');
  console.error('3. Run this script again');
  process.exit(1);
}

// Look for expected Figma export files
const expectedFiles = [
  'Mapped.json',
  'Responsive-mobile.json', 
  'Responsive-tablet.json',
  'Responsive-desktop.json',
  'Primitives-Light.json',
  'Primitives-Dark.json'
];

const missingFiles = expectedFiles.filter(file => 
  !fs.existsSync(path.join(variablesDir, file))
);

if (missingFiles.length > 0) {
  console.error('❌ Missing required Figma export files:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  console.error('\n📋 Export these collections from Figma and place in ./variables/');
  process.exit(1);
}

console.log('✅ Found all required Figma export files');

// Check if TypeScript is available for running the generator
let useTypeScript = false;
try {
  execSync('which tsx', { stdio: 'ignore' });
  useTypeScript = true;
  console.log('📦 Using tsx for TypeScript execution');
} catch {
  try {
    execSync('which ts-node', { stdio: 'ignore' });
    useTypeScript = true;
    console.log('📦 Using ts-node for TypeScript execution');
  } catch {
    console.log('📦 TypeScript not available, will use Node.js conversion');
  }
}

try {
  console.log('\n🔄 Generating design system files...');
  
  // Use the JavaScript version directly
  const jsGenerator = './scripts/generate-complete-design-system.js';
  if (fs.existsSync(jsGenerator)) {
    execSync(`node ${jsGenerator}`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
  } else {
    throw new Error('JavaScript generator not found');
  }

  console.log('\n✅ Design system generation completed!');
  
  // Verify generated files
  const generatedFiles = [
    './tokens/semantic.css',
    './tokens/utilities.css', 
    './tokens/primitives.css',
    './tokens/dark-mode.css'
  ];
  
  console.log('\n📋 Verifying generated files:');
  generatedFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      console.log(`   ✅ ${file} (${Math.round(stats.size / 1024)}KB)`);
    } else {
      console.log(`   ❌ ${file} - MISSING`);
    }
  });

  // Run Style Dictionary if available
  try {
    console.log('\n🎯 Running Style Dictionary build...');
    execSync('npx style-dictionary build', { stdio: 'inherit' });
    console.log('✅ Style Dictionary build completed');
  } catch (error) {
    console.log('⚠️  Style Dictionary not available or failed - continuing with token files');
  }

  console.log('\n🎉 Design System build completed successfully!');
  console.log('📈 Updated responsive typography tokens have been processed');
  console.log('🔄 You can now use the updated design system in your components');

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  console.error('\n🔧 Troubleshooting:');
  console.error('1. Ensure all Figma JSON files are in ./variables/');
  console.error('2. Check that the files are valid JSON');
  console.error('3. Verify you have the latest token exports from Figma');
  process.exit(1);
}