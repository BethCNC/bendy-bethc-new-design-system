#!/usr/bin/env node

/**
 * CLAUDE DESIGN SYSTEM CHECKER
 * 
 * MANDATORY TOOL FOR CLAUDE CODE
 * This tool MUST be run by Claude before making ANY code changes
 * that involve CSS classes or styling.
 * 
 * CLAUDE: Run this with: node scripts/claude-design-system-checker.js --class "your-class-name"
 * 
 * This enforces Beth's ZERO TOLERANCE design system policy.
 */

const fs = require('fs');
const path = require('path');

function loadValidTokens() {
  const tokens = new Set();
  
  const tokenFiles = [
    'tokens/utilities.css',
    'tokens/typography.css', 
    'tokens/semantic.css'
  ];
  
  tokenFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const classMatches = content.match(/\.[a-zA-Z][a-zA-Z0-9-_]*(?=\s*{)/g);
      if (classMatches) {
        classMatches.forEach(match => {
          tokens.add(match.substring(1)); // Remove the dot
        });
      }
    }
  });
  
  return tokens;
}

function checkClass(className, validTokens) {
  // Remove any extra quotes or spaces
  const cleanClass = className.replace(/['"]/g, '').trim();
  
  if (!cleanClass) {
    return {
      valid: false,
      message: 'Empty class name provided'
    };
  }
  
  // Check if it's a valid design system token
  if (validTokens.has(cleanClass)) {
    return {
      valid: true,
      message: `✅ "${cleanClass}" is a valid design system token`
    };
  }
  
  // Check for known exceptions (framework utilities)
  const knownExceptions = [
    'container', 'grid', 'flex', 'block', 'inline', 'hidden',
    'absolute', 'relative', 'fixed', 'sticky',
    'w-full', 'h-full', 'cursor-pointer',
    'transition', 'transform'
  ];
  
  if (knownExceptions.includes(cleanClass) || 
      cleanClass.startsWith('grid-') ||
      cleanClass.startsWith('col-') ||
      cleanClass.startsWith('justify-') ||
      cleanClass.startsWith('items-')) {
    return {
      valid: true,
      message: `✅ "${cleanClass}" is a known framework utility (allowed)`
    };
  }
  
  // Check for forbidden patterns
  const forbiddenPatterns = [
    { pattern: /^bg-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]+$/, message: 'Tailwind color classes are forbidden' },
    { pattern: /^text-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]+$/, message: 'Tailwind text color classes are forbidden' },
    { pattern: /^p-[0-9]+$/, message: 'Hardcoded padding classes are forbidden' },
    { pattern: /^m-[0-9]+$/, message: 'Hardcoded margin classes are forbidden' },
    { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/, message: 'Hardcoded text size classes are forbidden' },
    { pattern: /magenta/, message: 'Invalid color name "magenta" - check your design system tokens' }
  ];
  
  for (const { pattern, message } of forbiddenPatterns) {
    if (pattern.test(cleanClass)) {
      return {
        valid: false,
        message: `🚫 FORBIDDEN: "${cleanClass}" - ${message}`
      };
    }
  }
  
  // If we get here, it's an invalid class
  return {
    valid: false,
    message: `❌ INVALID: "${cleanClass}" is not in the design system tokens`,
    suggestions: findSimilarTokens(cleanClass, validTokens)
  };
}

function findSimilarTokens(className, validTokens) {
  const suggestions = [];
  const searchTerms = className.split('-');
  
  for (const token of validTokens) {
    // Look for tokens that contain similar parts
    if (searchTerms.some(term => token.includes(term))) {
      suggestions.push(token);
      if (suggestions.length >= 5) break; // Limit suggestions
    }
  }
  
  return suggestions;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || !args.includes('--class')) {
    console.log('🔒 CLAUDE DESIGN SYSTEM CHECKER');
    console.log('=================================');
    console.log('');
    console.log('USAGE:');
    console.log('  node scripts/claude-design-system-checker.js --class "your-class-name"');
    console.log('  node scripts/claude-design-system-checker.js --class "bg-surface-neutral-inverse"');
    console.log('');
    console.log('CLAUDE MUST USE THIS TOOL BEFORE USING ANY CSS CLASS');
    console.log('This enforces Beth\'s ZERO TOLERANCE design system policy.');
    console.log('');
    process.exit(1);
  }
  
  const classIndex = args.indexOf('--class');
  if (classIndex === -1 || classIndex === args.length - 1) {
    console.error('❌ ERROR: --class flag requires a class name');
    process.exit(1);
  }
  
  const className = args[classIndex + 1];
  
  console.log('🔍 CHECKING DESIGN SYSTEM COMPLIANCE');
  console.log('====================================');
  console.log(`Class to check: "${className}"`);
  console.log('');
  
  // Load valid tokens
  console.log('📚 Loading design system tokens...');
  const validTokens = loadValidTokens();
  console.log(`✅ Loaded ${validTokens.size} valid design system tokens`);
  console.log('');
  
  // Check the class
  const result = checkClass(className, validTokens);
  
  console.log('🧪 VALIDATION RESULT:');
  console.log('=====================');
  console.log(result.message);
  
  if (!result.valid) {
    if (result.suggestions && result.suggestions.length > 0) {
      console.log('');
      console.log('💡 SIMILAR TOKENS FOUND:');
      result.suggestions.forEach(suggestion => {
        console.log(`   - ${suggestion}`);
      });
    }
    
    console.log('');
    console.log('🚨 ACTION REQUIRED:');
    console.log('   1. Check /tokens/ directory for valid classes');
    console.log('   2. Use component specs in /component_specs/');
    console.log('   3. Verify with: grep -r "your-class" tokens/');
    console.log('   4. NEVER make up class names');
    
    process.exit(1);
  } else {
    console.log('');
    console.log('✅ APPROVED FOR USE');
    console.log('This class follows design system rules correctly!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkClass, loadValidTokens };