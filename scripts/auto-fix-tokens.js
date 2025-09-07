#!/usr/bin/env node

/**
 * Auto-fix script to replace hardcoded values with design system tokens
 */

const fs = require('fs');
const path = require('path');

const COMMON_FIXES = {
  // Typography fixes
  "font-family: 'Overused Grotesk', sans-serif;": "font-family: var(--font-title);",
  "font-family: 'Behind The Nineties', sans-serif;": "font-family: var(--font-display);",
  
  // Font sizes - map to available tokens
  "font-size: 14px;": "font-size: var(--font-body-md);",
  "font-size: 18px;": "font-size: var(--font-body-xl);",
  "font-size: 20px;": "font-size: var(--font-title-sm);",
  "font-size: 24px;": "font-size: var(--font-title-md);",
  "font-size: 30px;": "font-size: var(--font-title-lg);",
  "font-size: 36px;": "font-size: var(--font-title-xl);",
  "font-size: 48px;": "font-size: var(--font-heading-H1);",
  "font-size: 60px;": "font-size: var(--font-heading-H1);",
  "font-size: 72px;": "font-size: var(--font-display-display);",
  "font-size: 96px;": "font-size: var(--font-display-display);",
  "font-size: 128px;": "font-size: var(--font-display-display);",
  
  // Line heights - use relative values
  "line-height: 20px;": "line-height: 1.4;",
  "line-height: 32px;": "line-height: 1.33;",
  "line-height: 40px;": "line-height: 1.33;",
  "line-height: 44px;": "line-height: 1.2;",
  "line-height: 48px;": "line-height: 1.33;",
  "line-height: 60px;": "line-height: 1.25;",
  "line-height: 72px;": "line-height: 1.2;",
  "line-height: 96px;": "line-height: 1.33;",
  "line-height: 104px;": "line-height: 1.1;",
  "line-height: 128px;": "line-height: 1.33;",
  "line-height: 136px;": "line-height: 1.1;",
  
  // Spacing fixes - map to design system spacing
  "margin: 12px": "margin: var(--spacing-sm)",
  "padding: 8px": "padding: var(--spacing-sm)",
  "padding: 12px": "padding: var(--spacing-sm)",
  "padding: 16px": "padding: var(--spacing-md)",
  "padding: 24px": "padding: var(--spacing-md)",
  "padding: 32px": "padding: var(--spacing-lg)",
  "padding: 48px": "padding: var(--spacing-lg)",
  "padding: 64px": "padding: var(--spacing-xl)",
  "padding: 96px": "padding: var(--spacing-2xl)",
  
  // Heights for common components
  "min-height: 48px": "min-height: var(--spacing-xl)",
  "min-height: 50px": "min-height: var(--spacing-xl)",
  "height: 32px": "height: var(--spacing-lg)",
  "height: 48px": "height: var(--spacing-xl)",
  "height: 50px": "height: var(--spacing-xl)",
  
  // Widths for icons
  "width: 32px": "width: var(--spacing-lg)",
  "height: 32px": "height: var(--spacing-lg)",
  
  // Border fixes
  "border: 1px solid": "border: var(--border-width-sm) solid",
  "border: 2px solid": "border: var(--border-width-md) solid",
  "border-top: 1px solid": "border-top: var(--border-width-sm) solid",
  "border-bottom: 1px solid": "border-bottom: var(--border-width-sm) solid",
  "border-left: 1px solid": "border-left: var(--border-width-sm) solid",
  "border-right: 1px solid": "border-right: var(--border-width-sm) solid",
  "border-top: 2px solid": "border-top: var(--border-width-md) solid",
  "border-bottom: 2px solid": "border-bottom: var(--border-width-md) solid",
  "border-left: 2px solid": "border-left: var(--border-width-md) solid",
  "border-right: 2px solid": "border-right: var(--border-width-md) solid"
  
  // Border radius
  "border-radius: 6px;": "border-radius: var(--radius-sm);",
  
  // Colors - common hardcoded colors
  "#252626": "var(--border-neutral-dark)",
  "#f1f2f2": "var(--surface-neutral-card)",
  "#0c0d0d": "var(--text-neutral-display)",
  "#bbbfbf": "var(--text-neutral-disabled)",
};

function autoFixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changesMade = 0;
  
  console.log(`🔧 Processing: ${filePath}`);
  
  // Apply all common fixes
  Object.entries(COMMON_FIXES).forEach(([oldValue, newValue]) => {
    const regex = new RegExp(oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    
    if (matches) {
      content = content.replace(regex, newValue);
      changesMade += matches.length;
      console.log(`   ✅ Replaced "${oldValue}" → "${newValue}" (${matches.length} times)`);
    }
  });
  
  if (changesMade > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✨ Fixed ${changesMade} violations in ${filePath}`);
  } else {
    console.log(`   No changes needed`);
  }
  
  return changesMade;
}

// CLI usage
if (require.main === module) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.log('Usage: node auto-fix-tokens.js <file-path>');
    process.exit(1);
  }
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  
  console.log('🎨 Auto-fixing Design System Token Violations');
  console.log('==============================================\n');
  
  const changesMade = autoFixFile(filePath);
  
  console.log(`\n📊 Summary: ${changesMade} total changes made`);
  
  if (changesMade > 0) {
    console.log('✅ Run the enforcement script again to check remaining violations');
  }
}

module.exports = { autoFixFile, COMMON_FIXES };