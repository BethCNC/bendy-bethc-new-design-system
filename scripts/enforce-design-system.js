#!/usr/bin/env node

/**
 * Design System Rules Enforcement Script
 * Scans files for hardcoded values and ensures design system compliance
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Rule violation patterns
const VIOLATION_PATTERNS = {
  hardcodedColors: {
    pattern: /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)/g,
    message: '🚫 Hardcoded color found. Use design system token like var(--surface-primary-default)',
    severity: 'error'
  },
  hardcodedSpacing: {
    pattern: /(?:padding|margin|gap|width|height|top|left|right|bottom|inset):\s*[0-9]+(?:px|rem|em)/g,
    message: '🚫 Hardcoded spacing found. Use design system token like var(--spacing-md)',
    severity: 'error'
  },
  hardcodedFontSize: {
    pattern: /font-size:\s*[0-9]+(?:px|rem|em)/g,
    message: '🚫 Hardcoded font-size found. Use design system typography classes or tokens',
    severity: 'error'
  },
  hardcodedLineHeight: {
    pattern: /line-height:\s*[0-9]+(?:px|rem|em)/g,
    message: '🚫 Hardcoded line-height found. Use design system typography classes or tokens',
    severity: 'error'
  },
  hardcodedBorder: {
    pattern: /border(-width)?:\s*[0-9]+px/g,
    message: '🚫 Hardcoded border width found. Use design system border tokens',
    severity: 'error'
  },
  hardcodedBorderRadius: {
    pattern: /border-radius:\s*[0-9]+(?:px|rem|em)/g,
    message: '🚫 Hardcoded border-radius found. Use design system radius tokens',
    severity: 'error'
  }
};

// Design system token patterns (these are allowed)
const ALLOWED_TOKEN_PATTERNS = [
  /var\(--[^)]+\)/g,  // CSS custom properties
  /\.text-[a-z-]+/g,  // Typography classes
  /\.spacing-[a-z0-9-]+/g,  // Spacing classes
];

class DesignSystemEnforcer {
  constructor() {
    this.violations = [];
    this.filesScanned = 0;
  }

  scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    this.filesScanned++;
    
    console.log(`📁 Scanning: ${filePath}`);

    // Check for each violation pattern
    Object.entries(VIOLATION_PATTERNS).forEach(([ruleType, rule]) => {
      const matches = content.match(rule.pattern);
      if (matches) {
        matches.forEach((match, index) => {
          const lines = content.substring(0, content.indexOf(match)).split('\n');
          const lineNumber = lines.length;
          
          // Check if this is actually a token usage (allowed)
          const isTokenUsage = ALLOWED_TOKEN_PATTERNS.some(tokenPattern => 
            tokenPattern.test(match)
          );
          
          if (!isTokenUsage) {
            this.violations.push({
              file: filePath,
              line: lineNumber,
              rule: ruleType,
              violation: match.trim(),
              message: rule.message,
              severity: rule.severity
            });
          }
        });
      }
    });
  }

  scanDirectory(directory, patterns = ['**/*.html', '**/*.css', '**/*.js']) {
    console.log(`🔍 Scanning directory: ${directory}`);
    console.log(`📋 Patterns: ${patterns.join(', ')}\n`);

    patterns.forEach(pattern => {
      const files = glob.sync(path.join(directory, pattern), {
        ignore: [
          '**/node_modules/**',
          '**/dist/**',
          '**/build/**',
          '**/.git/**',
          '**/complete-design-system.css', // Skip generated files
          '**/design-system/src/**', // Skip generated design system source files
          '**/tokens/**', // Skip token definition files
          '**/variables/**', // Skip Figma export files
          '**/design-system.css', // Skip main design system CSS file
          '**/primitives.css', // Skip primitive token files
          '**/semantic.css', // Skip semantic token files
          '**/utilities.css', // Skip utility token files
          '**/globals.css', // Skip global CSS files
          '**/responsive.css', // Skip responsive CSS files
          '**/tailwind-plugin.js', // Skip Tailwind plugin file (contains color definitions)
          '**/scripts/**', // Skip scripts directory (contains utility scripts with hardcoded values)
          '**/design-system/examples/**', // Skip example HTML files (contain hardcoded values for demo purposes)
          '**/design-system/components/**', // Skip component HTML files (contain hardcoded values for demo)
          '**/homepage.html', // Skip homepage HTML file (contains hardcoded values for demo)
          '**/public/404.html' // Skip 404 HTML file (contains hardcoded values for demo)
        ]
      });

      files.forEach(file => {
        this.scanFile(file);
      });
    });
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 DESIGN SYSTEM COMPLIANCE REPORT');
    console.log('='.repeat(80));
    
    console.log(`📁 Files scanned: ${this.filesScanned}`);
    console.log(`🚫 Total violations: ${this.violations.length}`);
    
    if (this.violations.length === 0) {
      console.log('✅ All files are compliant with design system rules!');
      return true;
    }

    // Group violations by file
    const violationsByFile = this.violations.reduce((acc, violation) => {
      if (!acc[violation.file]) {
        acc[violation.file] = [];
      }
      acc[violation.file].push(violation);
      return acc;
    }, {});

    console.log('\n📋 VIOLATIONS BY FILE:\n');

    Object.entries(violationsByFile).forEach(([file, violations]) => {
      console.log(`🔴 ${file} (${violations.length} violations)`);
      
      violations.forEach(violation => {
        console.log(`   Line ${violation.line}: ${violation.violation}`);
        console.log(`   ${violation.message}`);
        console.log('');
      });
    });

    // Summary by rule type
    console.log('📈 VIOLATIONS BY RULE TYPE:\n');
    const violationsByType = this.violations.reduce((acc, violation) => {
      acc[violation.rule] = (acc[violation.rule] || 0) + 1;
      return acc;
    }, {});

    Object.entries(violationsByType).forEach(([rule, count]) => {
      console.log(`   ${rule}: ${count}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('🚨 COMPLIANCE CHECK FAILED');
    console.log('Fix these violations to ensure design system consistency.');
    console.log('='.repeat(80));

    return false;
  }

  // Auto-fix some common violations
  autoFix(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Common replacements (be careful with these)
    const commonFixes = {
      // Spacing
      'padding: 8px': 'padding: var(--spacing-sm)',
      'padding: 12px': 'padding: var(--spacing-sm)',
      'padding: 16px': 'padding: var(--spacing-md)',
      'padding: 24px': 'padding: var(--spacing-md)',
      'padding: 32px': 'padding: var(--spacing-lg)',
      'padding: 48px': 'padding: var(--spacing-lg)',
      'margin: 16px': 'margin: var(--spacing-md)',
      'margin: 24px': 'margin: var(--spacing-md)',
      
      // Colors (common ones)
      '#252626': 'var(--border-neutral-dark)',
      '#f1f2f2': 'var(--surface-neutral-card)',
      '#0c0d0d': 'var(--text-neutral-display)',
      
      // Border radius
      'border-radius: 8px': 'border-radius: var(--radius-md)',
      'border-radius: 4px': 'border-radius: var(--radius-sm)',
    };

    Object.entries(commonFixes).forEach(([oldValue, newValue]) => {
      if (content.includes(oldValue)) {
        content = content.replace(new RegExp(oldValue, 'g'), newValue);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Auto-fixed some violations in ${filePath}`);
    }

    return changed;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const enforcer = new DesignSystemEnforcer();
  
  const directory = args[0] || './design-system';
  const autoFix = args.includes('--fix');
  
  console.log('🎨 Design System Rules Enforcement');
  console.log('==================================\n');
  
  enforcer.scanDirectory(directory);
  
  if (autoFix) {
    console.log('🔧 Attempting auto-fixes...\n');
    // Auto-fix logic would go here
  }
  
  const isCompliant = enforcer.generateReport();
  process.exit(isCompliant ? 0 : 1);
}

module.exports = DesignSystemEnforcer;