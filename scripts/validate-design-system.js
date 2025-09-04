#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * STRICT DESIGN SYSTEM VALIDATION
 * This script enforces Beth's design system rules with ZERO TOLERANCE
 * 
 * CLAUDE MUST RUN THIS BEFORE ANY CODE CHANGES
 */

// Load actual design system tokens
function loadDesignSystemTokens() {
  const tokens = new Set();
  
  try {
    // Load all CSS files from tokens directory
    const tokenFiles = [
      path.join(__dirname, '../tokens/index.css'),
      path.join(__dirname, '../design-system/src/complete-design-system.css'),
      path.join(__dirname, '../design-system/css/responsive.css')
    ];
    
    tokenFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        // Extract CSS class names
        const classMatches = content.match(/\.[a-zA-Z][a-zA-Z0-9-_]*(?=\s*{)/g);
        if (classMatches) {
          classMatches.forEach(match => {
            tokens.add(match.substring(1)); // Remove the dot
          });
        }
      }
    });
    
    console.log(`✅ Loaded ${tokens.size} valid design system tokens`);
    return tokens;
  } catch (error) {
    console.error('❌ Failed to load design system tokens:', error.message);
    return new Set();
  }
}

// ABSOLUTE VIOLATIONS - These will FAIL the build
const FORBIDDEN_PATTERNS = [
  // Hardcoded colors
  { pattern: /#[0-9a-fA-F]{3,6}/, message: 'Hardcoded hex colors are forbidden' },
  { pattern: /rgb\([^)]+\)/, message: 'Hardcoded RGB colors are forbidden' },
  { pattern: /rgba\([^)]+\)/, message: 'Hardcoded RGBA colors are forbidden' },
  { pattern: /hsl\([^)]+\)/, message: 'Hardcoded HSL colors are forbidden' },
  
  // Tailwind classes
  { pattern: /\bbg-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]+\b/, message: 'Tailwind color classes are forbidden' },
  { pattern: /\btext-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]+\b/, message: 'Tailwind text color classes are forbidden' },
  
  // Hardcoded spacing
  { pattern: /\bp-[0-9]+\b/, message: 'Hardcoded padding classes are forbidden' },
  { pattern: /\bm-[0-9]+\b/, message: 'Hardcoded margin classes are forbidden' },
  { pattern: /\bpx-[0-9]+\b/, message: 'Hardcoded horizontal padding is forbidden' },
  { pattern: /\bpy-[0-9]+\b/, message: 'Hardcoded vertical padding is forbidden' },
  
  // Hardcoded typography
  { pattern: /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/, message: 'Hardcoded text size classes are forbidden' },
  
  // Inline styles
  { pattern: /style=\{\{[^}]*\}\}/, message: 'Inline styles are forbidden' },
  { pattern: /style="[^"]*"/, message: 'Inline styles are forbidden' },
  
  // Made-up classes that sound like they could be real
  { pattern: /\bbg-magenta-/, message: 'Invalid color name "magenta" - use actual design system tokens' },
  { pattern: /\btext-neutral-display\b/, message: 'Use text-neutral-heading or check actual tokens' },
];

function validateFile(filePath, validTokens) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  
  // Check for forbidden patterns
  FORBIDDEN_PATTERNS.forEach(({ pattern, message }) => {
    const matches = content.match(new RegExp(pattern, 'g'));
    if (matches) {
      violations.push({
        type: 'FORBIDDEN_PATTERN',
        message,
        matches: matches,
        lines: getLineNumbers(content, matches)
      });
    }
  });
  
  // Extract all CSS classes used in the file
  const classMatches = content.match(/className=["'][^"']*["']/g);
  if (classMatches) {
    classMatches.forEach(match => {
      const classes = match.replace(/className=["']/, '').replace(/["']$/, '').split(/\s+/);
      classes.forEach(cls => {
        if (cls && !validTokens.has(cls) && !isKnownException(cls)) {
          violations.push({
            type: 'INVALID_CLASS',
            message: `Class "${cls}" is not in design system tokens`,
            matches: [cls],
            lines: getLineNumbers(content, [cls])
          });
        }
      });
    });
  }
  
  return violations;
}

function isKnownException(className) {
  // Allow certain classes that are not design system tokens
  const exceptions = [
    'container', // Layout container
    'grid', // Grid system
    'flex', 'block', 'inline', 'hidden', // Display utilities
    'absolute', 'relative', 'fixed', 'sticky', // Position utilities
    'w-full', 'h-full', // Size utilities that are standard
    'cursor-pointer', // Interaction utilities
    'transition', 'transform', // Animation utilities
    // Next.js specific
    'next-error-h1', 'next-error-h2',
    // React specific
    'react-hot-toast',
    // Add more as needed, but keep minimal
  ];
  
  return exceptions.includes(className) || 
         className.startsWith('grid-') ||
         className.startsWith('col-') ||
         className.startsWith('row-') ||
         className.startsWith('justify-') ||
         className.startsWith('items-') ||
         className.startsWith('self-') ||
         className.startsWith('place-');
}

function getLineNumbers(content, matches) {
  const lines = content.split('\n');
  const lineNumbers = [];
  
  matches.forEach(match => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        lineNumbers.push(i + 1);
      }
    }
  });
  
  return [...new Set(lineNumbers)]; // Remove duplicates
}

function main() {
  console.log('🔒 STRICT DESIGN SYSTEM VALIDATION');
  console.log('=====================================');
  console.log('Enforcing Beth\'s design system rules with ZERO TOLERANCE\n');
  
  // Load valid design system tokens
  const validTokens = loadDesignSystemTokens();
  
  if (validTokens.size === 0) {
    console.error('❌ CRITICAL ERROR: Could not load design system tokens');
    console.error('❌ BUILD BLOCKED: Cannot validate without token reference');
    process.exit(1);
  }
  
  // Get files to scan
  const componentFiles = glob.sync('app/components/**/*.{tsx,jsx}');
  const pageFiles = glob.sync('app/**/page.{tsx,jsx}');
  const layoutFiles = glob.sync('app/**/layout.{tsx,jsx}');
  const allFiles = [...componentFiles, ...pageFiles, ...layoutFiles];
  
  console.log(`📁 Scanning ${allFiles.length} files...\n`);
  
  let totalViolations = 0;
  let filesWithViolations = 0;
  let criticalViolations = 0;
  
  allFiles.forEach(file => {
    const violations = validateFile(file, validTokens);
    
    if (violations.length > 0) {
      filesWithViolations++;
      console.log(`💥 VIOLATIONS IN: ${file}`);
      console.log(''.padStart(50, '='));
      
      violations.forEach(violation => {
        totalViolations++;
        
        if (violation.type === 'FORBIDDEN_PATTERN') {
          criticalViolations++;
          console.log(`🚨 CRITICAL: ${violation.message}`);
        } else {
          console.log(`❌ ERROR: ${violation.message}`);
        }
        
        console.log(`   📍 Lines: ${violation.lines.join(', ')}`);
        console.log(`   💀 Found: ${violation.matches.slice(0, 3).join(', ')}${violation.matches.length > 3 ? ` (+${violation.matches.length - 3} more)` : ''}`);
        console.log('');
      });
      
      console.log('');
    }
  });
  
  // SUMMARY
  console.log('📊 VALIDATION SUMMARY');
  console.log('====================');
  console.log(`Files scanned: ${allFiles.length}`);
  console.log(`Files with violations: ${filesWithViolations}`);
  console.log(`Total violations: ${totalViolations}`);
  console.log(`Critical violations: ${criticalViolations}`);
  
  if (totalViolations > 0) {
    console.log('\n🚫 BUILD BLOCKED - DESIGN SYSTEM VIOLATIONS DETECTED');
    console.log('====================================================');
    console.log('REQUIRED ACTIONS:');
    console.log('1. ✅ Use ONLY classes from /tokens/ directory');
    console.log('2. ✅ Check component specs in /component_specs/');
    console.log('3. ✅ Verify tokens with: grep -r "your-class" tokens/');
    console.log('4. ✅ NO hardcoded colors, spacing, or typography');
    console.log('5. ✅ NO made-up class names');
    
    if (criticalViolations > 0) {
      console.log('\n🆘 CRITICAL VIOLATIONS MUST BE FIXED IMMEDIATELY');
    }
    
    process.exit(1);
  } else {
    console.log('\n✅ DESIGN SYSTEM VALIDATION PASSED');
    console.log('All components follow design system rules correctly!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateFile, loadDesignSystemTokens };