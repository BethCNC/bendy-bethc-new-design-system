#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

// Design system violation patterns
const VIOLATION_PATTERNS = [
  // Hardcoded colors
  /#[0-9a-fA-F]{3,6}/g,
  /rgb\([^)]+\)/g,
  /rgba\([^)]+\)/g,
  /hsl\([^)]+\)/g,
  /hsla\([^)]+\)/g,
  
  // Tailwind classes
  /className="[^"]*(?:bg-|text-|p-|m-|w-|h-|flex|grid|border|rounded|shadow|opacity|transition|transform|hover:|focus:|active:|sm:|md:|lg:|xl:)[^"]*"/g,
  
  // Hardcoded spacing
  /(?:padding|margin|top|right|bottom|left|width|height|min-width|max-width|min-height|max-height):\s*[0-9]+px/g,
  
  // Hardcoded font sizes
  /font-size:\s*[0-9]+px/g,
  
  // Inline styles
  /style=\{[^}]*\}/g,
  
  // Hardcoded breakpoints
  /@media\s*\([^)]*[0-9]+px[^)]*\)/g,
];

// Design system compliant patterns
const COMPLIANT_PATTERNS = [
  // CSS custom properties
  /var\(--[^)]+\)/g,
  
  // Design system classes
  /className="[^"]*(?:bg-surface-|text-|p-mobile-|p-tablet-|p-desktop-|space-mobile-|space-tablet-|space-desktop-|font-|copy-|cta-|navigation-|page-title-|hero-|feature-card-|footer-|slot-|gallery-|year-overlay-|logo-|aspect-)[^"]*"/g,
];

interface Violation {
  file: string;
  line: number;
  pattern: string;
  match: string;
}

interface ComponentAudit {
  file: string;
  violations: Violation[];
  compliantClasses: string[];
  totalLines: number;
  violationCount: number;
}

function auditComponent(filePath: string): ComponentAudit {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations: Violation[] = [];
  const compliantClasses: string[] = [];
  
  // Check for violations
  lines.forEach((line, index) => {
    VIOLATION_PATTERNS.forEach((pattern, patternIndex) => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          violations.push({
            file: path.basename(filePath),
            line: index + 1,
            pattern: `Pattern ${patternIndex + 1}`,
            match: match.trim()
          });
        });
      }
    });
    
    // Check for compliant classes
    COMPLIANT_PATTERNS.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (!compliantClasses.includes(match)) {
            compliantClasses.push(match);
          }
        });
      }
    });
  });
  
  return {
    file: path.basename(filePath),
    violations,
    compliantClasses,
    totalLines: lines.length,
    violationCount: violations.length
  };
}

function findComponentFiles(dir: string): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

function main() {
  console.log('🔍 Auditing components for design system compliance...\n');
  
  const componentDir = path.join(process.cwd(), 'app', 'components');
  const componentFiles = findComponentFiles(componentDir);
  
  const audits: ComponentAudit[] = [];
  let totalViolations = 0;
  
  componentFiles.forEach(filePath => {
    const audit = auditComponent(filePath);
    audits.push(audit);
    totalViolations += audit.violationCount;
  });
  
  // Sort by violation count (highest first)
  audits.sort((a, b) => b.violationCount - a.violationCount);
  
  console.log(`📊 Found ${totalViolations} violations across ${audits.length} components\n`);
  
  // Display results
  audits.forEach(audit => {
    if (audit.violationCount > 0) {
      console.log(`❌ ${audit.file} (${audit.violationCount} violations)`);
      audit.violations.slice(0, 5).forEach(violation => {
        console.log(`   Line ${violation.line}: ${violation.match.substring(0, 60)}...`);
      });
      if (audit.violations.length > 5) {
        console.log(`   ... and ${audit.violations.length - 5} more violations`);
      }
      console.log('');
    } else {
      console.log(`✅ ${audit.file} (compliant)`);
    }
  });
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    totalComponents: audits.length,
    totalViolations,
    components: audits
  };
  
  const reportPath = path.join(process.cwd(), 'data', 'component-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📄 Detailed report saved to: data/component-audit-report.json`);
  
  // Return exit code based on violations
  process.exit(totalViolations > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
} 