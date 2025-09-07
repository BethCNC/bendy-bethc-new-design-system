#!/usr/bin/env node

/**
 * Design System Compliance Validator
 * Runs before any file modifications to ensure rules compliance
 */

const fs = require('fs');
const path = require('path');

class ComplianceValidator {
  constructor() {
    this.rulesDir = '.cursor/rules';
    this.violations = [];
    this.protectedFiles = [
      'design-system/src/complete-design-system.css',
      'design-system/css/design-system.css',
      'design-system/css/globals.css',
      'design-system/src/tailwind.config.js',
      'tokens/index.css'
    ];
    this.protectedDirectories = [
      'variables/',
      'design-system/src/'
    ];
  }

  /**
   * Main validation entry point
   */
  validateAction(targetFile, action = 'modify') {
    console.log('🔍 DESIGN SYSTEM COMPLIANCE CHECK');
    console.log('================================');
    
    // Step 1: Verify rules files exist and are readable
    if (!this.verifyRulesAccess()) {
      return false;
    }
    
    // Step 2: Check if target file is protected
    if (this.isFileProtected(targetFile)) {
      this.reportViolation('PROTECTED_FILE', targetFile, action);
      return false;
    }
    
    // Step 3: If CSS modification, ensure token usage
    if (this.isCSSFile(targetFile)) {
      console.log('⚠️  CSS file detected - ensure you use design system tokens only');
      console.log('   No hardcoded values (px, hex, rem) allowed');
      console.log('   Use var(--token-name) format only');
    }
    
    console.log('✅ COMPLIANCE CHECK PASSED');
    console.log('   Action is permitted with design system tokens');
    console.log('');
    return true;
  }

  /**
   * Check if target file is in protected list
   */
  isFileProtected(filePath) {
    if (!filePath) return false;
    
    // Check exact file matches
    if (this.protectedFiles.includes(filePath)) {
      return true;
    }
    
    // Check directory matches
    return this.protectedDirectories.some(dir => 
      filePath.startsWith(dir)
    );
  }

  /**
   * Check if file is CSS/style related
   */
  isCSSFile(filePath) {
    if (!filePath) return false;
    
    return filePath.endsWith('.css') || 
           filePath.endsWith('.scss') ||
           filePath.endsWith('.html') && filePath.includes('style');
  }

  /**
   * Verify rules files are accessible
   */
  verifyRulesAccess() {
    const requiredRules = [
      'system-protection-rules.mdc',
      'file-modification-restrictions.mdc',
      'no-hardcoding.mdc',
      'design-system.mdc'
    ];
    
    const missingRules = requiredRules.filter(rule => {
      const rulePath = path.join(this.rulesDir, rule);
      return !fs.existsSync(rulePath);
    });
    
    if (missingRules.length > 0) {
      console.log('❌ RULES FILES MISSING:');
      missingRules.forEach(rule => {
        console.log(`   ${this.rulesDir}/${rule}`);
      });
      return false;
    }
    
    console.log('✅ All required rules files found');
    return true;
  }

  /**
   * Report compliance violation
   */
  reportViolation(type, file, action) {
    console.log('');
    console.log('🚨 COMPLIANCE VIOLATION DETECTED');
    console.log('================================');
    
    switch (type) {
      case 'PROTECTED_FILE':
        console.log(`❌ Cannot ${action} protected file: ${file}`);
        console.log('');
        console.log('PROTECTED FILES:');
        this.protectedFiles.forEach(pf => console.log(`   ${pf}`));
        console.log('');
        console.log('PROTECTED DIRECTORIES:');
        this.protectedDirectories.forEach(pd => console.log(`   ${pd}**/*`));
        console.log('');
        console.log('ALTERNATIVE APPROACHES:');
        console.log('• Create demo file in /examples/ directory');
        console.log('• Use existing tokens in component-specific CSS');
        console.log('• Document requirements for Figma regeneration');
        break;
        
      default:
        console.log(`❌ Unknown violation: ${type} on ${file}`);
    }
    
    console.log('');
    console.log('RULES REFERENCE:');
    console.log(`• System Protection: ${this.rulesDir}/system-protection-rules.mdc`);
    console.log(`• File Restrictions: ${this.rulesDir}/file-modification-restrictions.mdc`);
    console.log('');
  }

  /**
   * Generate compliance report
   */
  generateReport(targetFiles) {
    console.log('📋 DESIGN SYSTEM COMPLIANCE REPORT');
    console.log('==================================');
    
    if (!Array.isArray(targetFiles)) {
      targetFiles = [targetFiles];
    }
    
    const results = targetFiles.map(file => ({
      file,
      compliant: !this.isFileProtected(file),
      protected: this.isFileProtected(file),
      cssFile: this.isCSSFile(file)
    }));
    
    console.log('FILE ANALYSIS:');
    results.forEach(result => {
      const status = result.compliant ? '✅' : '❌';
      console.log(`${status} ${result.file}`);
      
      if (result.protected) {
        console.log(`    ⚠️  Protected file - modification blocked`);
      }
      if (result.cssFile && result.compliant) {
        console.log(`    🎨 CSS file - token usage required`);
      }
    });
    
    const compliantCount = results.filter(r => r.compliant).length;
    const totalCount = results.length;
    
    console.log('');
    console.log(`COMPLIANCE RATE: ${compliantCount}/${totalCount} (${Math.round(compliantCount/totalCount*100)}%)`);
    
    return compliantCount === totalCount;
  }
}

// CLI usage
if (require.main === module) {
  const validator = new ComplianceValidator();
  const targetFile = process.argv[2];
  const action = process.argv[3] || 'modify';
  
  if (!targetFile) {
    console.log('Usage: node validate-compliance.js <file-path> [action]');
    console.log('Example: node validate-compliance.js design-system/src/main.css modify');
    process.exit(1);
  }
  
  const isCompliant = validator.validateAction(targetFile, action);
  process.exit(isCompliant ? 0 : 1);
}

module.exports = ComplianceValidator;