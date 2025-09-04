#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns that indicate hardcoded values (VIOLATIONS)
const VIOLATION_PATTERNS = [
  // Hardcoded colors
  /#[0-9a-fA-F]{3,6}/g,
  /rgb\([^)]+\)/g,
  /rgba\([^)]+\)/g,
  /hsl\([^)]+\)/g,
  /hsla\([^)]+\)/g,
  
  // Tailwind classes
  /bg-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]+/g,
  /text-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]+/g,
  /border-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]+/g,
  
  // Hardcoded spacing
  /padding:\s*[0-9]+px/g,
  /margin:\s*[0-9]+px/g,
  /p-[0-9]+/g,
  /m-[0-9]+/g,
  /px-[0-9]+/g,
  /py-[0-9]+/g,
  /mx-[0-9]+/g,
  /my-[0-9]+/g,
  
  // Hardcoded font sizes
  /font-size:\s*[0-9]+px/g,
  /\btext-[xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl]\b/g,
  
  // Inline styles
  /style=\{\{[^}]*\}\}/g,
  
  // Hardcoded breakpoints
  /@media\s*\([^)]*[0-9]+px[^)]*\)/g,
  
  // Common hardcoded values
  /width:\s*[0-9]+px/g,
  /height:\s*[0-9]+px/g,
  /max-width:\s*[0-9]+px/g,
  /min-width:\s*[0-9]+px/g,
  /max-height:\s*[0-9]+px/g,
  /min-height:\s*[0-9]+px/g,
];

// Valid design system patterns (ALLOWED)
const VALID_PATTERNS = [
  // Design system classes
  /bg-surface-[a-zA-Z-]+/g,
  /text-text-[a-zA-Z-]+/g,
  /border-border-[a-zA-Z-]+/g,
  /p-mobile-[a-zA-Z]+/g,
  /p-tablet-[a-zA-Z]+/g,
  /p-desktop-[a-zA-Z]+/g,
  /m-mobile-[a-zA-Z]+/g,
  /m-tablet-[a-zA-Z]+/g,
  /m-desktop-[a-zA-Z]+/g,
  
  // Page section classes
  /page-section-[a-zA-Z-]+/g,
  /page-heading-[a-zA-Z-]+/g,
  /page-text-[a-zA-Z-]+/g,
  /page-container-[a-zA-Z-]+/g,
  
  // Blog classes
  /blog-[a-zA-Z-]+/g,
  
  // Component classes
  /cta-[a-zA-Z-]+/g,
  /nav-[a-zA-Z-]+/g,
  /logo-[a-zA-Z-]+/g,
  /button-[a-zA-Z-]+/g,
  /card-[a-zA-Z-]+/g,
  /field-[a-zA-Z-]+/g,
  /input-[a-zA-Z-]+/g,
  /label-[a-zA-Z-]+/g,
  /copy-[a-zA-Z-]+/g,
  /hero-[a-zA-Z-]+/g,
  /footer-[a-zA-Z-]+/g,
  /slot-[a-zA-Z-]+/g,
  /gallery-[a-zA-Z-]+/g,
  /avatar-[a-zA-Z-]+/g,
  /social-[a-zA-Z-]+/g,
  /keyline-[a-zA-Z-]+/g,
  /layout-[a-zA-Z-]+/g,
  /skip-[a-zA-Z-]+/g,
  
  // CSS custom properties
  /var\(--[a-zA-Z-]+\)/g,
  
  // Design system breakpoints
  /@media\s*\(min-width:\s*390px\)/g,
  /@media\s*\(min-width:\s*810px\)/g,
  /@media\s*\(min-width:\s*1440px\)/g,
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  
  VIOLATION_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      // Filter out matches that are part of valid design system patterns
      const validMatches = matches.filter(match => {
        return !VALID_PATTERNS.some(validPattern => {
          return validPattern.test(match);
        });
      });
      
      if (validMatches.length > 0) {
        violations.push({
          pattern: pattern.toString(),
          matches: validMatches,
          lineNumbers: getLineNumbers(content, validMatches)
        });
      }
    }
  });
  
  return violations;
}

function getLineNumbers(content, matches) {
  const lines = content.split('\n');
  const lineNumbers = [];
  
  matches.forEach(match => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        lineNumbers.push(i + 1);
        break;
      }
    }
  });
  
  return lineNumbers;
}

function main() {
  console.log('🔍 Scanning for CSS design system violations...\n');
  
  // Scan React components
  const componentFiles = glob.sync('app/components/**/*.{tsx,jsx}');
  const pageFiles = glob.sync('app/**/page.{tsx,jsx}');
  const allFiles = [...componentFiles, ...pageFiles];
  
  let totalViolations = 0;
  let filesWithViolations = 0;
  
  allFiles.forEach(file => {
    const violations = scanFile(file);
    if (violations.length > 0) {
      filesWithViolations++;
      console.log(`❌ ${file}:`);
      
      violations.forEach(violation => {
        console.log(`   🚫 Pattern: ${violation.pattern}`);
        console.log(`   📍 Lines: ${violation.lineNumbers.join(', ')}`);
        console.log(`   💥 Matches: ${violation.matches.slice(0, 3).join(', ')}${violation.matches.length > 3 ? '...' : ''}`);
        console.log('');
        totalViolations += violation.matches.length;
      });
    }
  });
  
  console.log('📊 SUMMARY:');
  console.log(`   Files scanned: ${allFiles.length}`);
  console.log(`   Files with violations: ${filesWithViolations}`);
  console.log(`   Total violations: ${totalViolations}`);
  
  if (totalViolations > 0) {
    console.log('\n🚫 BUILD BLOCKED - CSS VIOLATIONS DETECTED');
    console.log('==========================================');
    console.log('BETH\'S ZERO TOLERANCE DESIGN SYSTEM POLICY VIOLATED');
    console.log('');
    console.log('🚨 CRITICAL ACTIONS REQUIRED:');
    console.log('   1. ❌ STOP: Do not proceed until violations are fixed');
    console.log('   2. ✅ Replace ALL hardcoded values with design system tokens');
    console.log('   3. ✅ Use ONLY classes from /tokens/ directory');
    console.log('   4. ✅ Check component specs in /component_specs/');
    console.log('   5. ✅ Verify tokens with: grep -r "your-class" tokens/');
    console.log('   6. ✅ Use claude-design-system-checker.js for validation');
    console.log('');
    console.log('📖 RESOURCES:');
    console.log('   - Design system rules: CLAUDE.md');
    console.log('   - Token reference: /tokens/ directory');
    console.log('   - Component specs: /component_specs/');
    console.log('');
    console.log('🔒 ENFORCEMENT: This check runs on every commit');
    process.exit(1);
  } else {
    console.log('\n✅ CSS DESIGN SYSTEM VALIDATION PASSED');
    console.log('All components follow design system rules correctly!');
  }
}

if (require.main === module) {
  main();
} 