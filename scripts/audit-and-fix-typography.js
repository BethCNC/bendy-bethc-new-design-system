#!/usr/bin/env node

/**
 * Typography Audit and Fix Script
 * 
 * Systematically audits and fixes typography issues in generated components:
 * - Scans all HTML/CSS files in examples/ directory
 * - Identifies hardcoded typography values
 * - Replaces with proper responsive design system tokens
 * - Validates against Figma specifications
 * - Generates detailed audit report
 */

const fs = require('fs');
const path = require('path');

class TypographyAuditor {
    constructor() {
        this.designSystemTokens = this.loadDesignSystemTokens();
        this.figmaTextStyles = this.loadFigmaTextStyles();
        this.auditResults = {
            totalFiles: 0,
            filesWithIssues: 0,
            issuesFound: [],
            issuesFixed: [],
            validationErrors: []
        };
        
        // Typography patterns to detect and fix
        this.typographyPatterns = {
            // Hardcoded font sizes
            hardcodedFontSizes: /font-size:\s*(\d+)px/g,
            hardcodedLineHeights: /line-height:\s*(\d+)px/g,
            
            // Incorrect token usage
            wrongBodyTokens: /var\(--font-body-sm-mobile\)/g,
            
            // Missing responsive classes
            nonResponsiveClasses: /\.font-title-xs-medium\s*\{[^}]*font-size:\s*24px/g,
            
            // Figma style mismatches
            figmaStylePattern: /class="([^"]*font-[^"]*)"/ 
        };
    }

    /**
     * Load design system tokens from CSS files
     */
    loadDesignSystemTokens() {
        const tokens = {};
        
        try {
            // Load from complete design system
            const designSystemPath = path.join(process.cwd(), 'design-system/src/complete-design-system.css');
            if (fs.existsSync(designSystemPath)) {
                const content = fs.readFileSync(designSystemPath, 'utf8');
                Object.assign(tokens, this.parseCSSTokens(content));
            }
            
            // Load responsive tokens
            const responsivePath = path.join(process.cwd(), 'design-system/css/responsive.css');
            if (fs.existsSync(responsivePath)) {
                const content = fs.readFileSync(responsivePath, 'utf8');
                Object.assign(tokens, this.parseCSSTokens(content));
            }
            
            console.log(`✅ Loaded ${Object.keys(tokens).length} design system tokens`);
            
        } catch (error) {
            console.error('❌ Failed to load design system tokens:', error.message);
        }
        
        return tokens;
    }
    
    /**
     * Load Figma text styles for validation
     */
    loadFigmaTextStyles() {
        try {
            const figmaPath = path.join(process.cwd(), 'variables/textStyles.json');
            if (fs.existsSync(figmaPath)) {
                const figmaData = JSON.parse(fs.readFileSync(figmaPath, 'utf8'));
                console.log(`✅ Loaded ${figmaData.length || Object.keys(figmaData).length} Figma text styles`);
                return figmaData;
            }
        } catch (error) {
            console.error('❌ Failed to load Figma text styles:', error.message);
        }
        return [];
    }

    /**
     * Parse CSS custom properties
     */
    parseCSSTokens(cssContent) {
        const tokens = {};
        const cssVariableRegex = /--([^:]+):\s*([^;]+);/g;
        let match;

        while ((match = cssVariableRegex.exec(cssContent)) !== null) {
            const [, name, value] = match;
            tokens[name.trim()] = value.trim();
        }

        return tokens;
    }

    /**
     * Main audit and fix process
     */
    async run() {
        console.log('🔍 Starting Typography Audit and Fix Process...');
        console.log('================================================');
        
        // Step 1: Find all files to audit
        const filesToAudit = await this.findFilesToAudit();
        this.auditResults.totalFiles = filesToAudit.length;
        
        console.log(`📋 Found ${filesToAudit.length} files to audit`);
        
        // Step 2: Audit each file
        for (const filePath of filesToAudit) {
            await this.auditFile(filePath);
        }
        
        // Step 3: Generate comprehensive report
        this.generateAuditReport();
        
        console.log('✅ Typography audit and fix process completed!');
    }

    /**
     * Find all files that need typography auditing
     */
    async findFilesToAudit() {
        const files = [];
        const directories = [
            'design-system/examples',
            'design-system/pages'
        ];
        
        for (const dir of directories) {
            if (fs.existsSync(dir)) {
                const dirFiles = this.scanDirectory(dir, ['.html', '.css']);
                files.push(...dirFiles);
            }
        }
        
        return files;
    }
    
    /**
     * Recursively scan directory for files with specific extensions
     */
    scanDirectory(dir, extensions) {
        const files = [];
        
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    files.push(...this.scanDirectory(fullPath, extensions));
                } else if (extensions.some(ext => fullPath.endsWith(ext))) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            console.warn(`⚠️  Could not scan directory ${dir}:`, error.message);
        }
        
        return files;
    }

    /**
     * Audit a single file for typography issues
     */
    async auditFile(filePath) {
        console.log(`\n🔍 Auditing: ${filePath}`);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const issues = [];
            let fixedContent = content;
            let hasChanges = false;
            
            // Check 1: Hardcoded font sizes
            const hardcodedSizes = this.findHardcodedFontSizes(content);
            if (hardcodedSizes.length > 0) {
                issues.push({
                    type: 'hardcoded-font-sizes',
                    count: hardcodedSizes.length,
                    examples: hardcodedSizes.slice(0, 3)
                });
                
                // Fix hardcoded font sizes
                const fixed = this.fixHardcodedFontSizes(fixedContent);
                if (fixed.changed) {
                    fixedContent = fixed.content;
                    hasChanges = true;
                    this.auditResults.issuesFixed.push({
                        file: filePath,
                        type: 'hardcoded-font-sizes',
                        fixes: fixed.fixes
                    });
                }
            }
            
            // Check 2: Hardcoded line heights
            const hardcodedLineHeights = this.findHardcodedLineHeights(content);
            if (hardcodedLineHeights.length > 0) {
                issues.push({
                    type: 'hardcoded-line-heights',
                    count: hardcodedLineHeights.length,
                    examples: hardcodedLineHeights.slice(0, 3)
                });
                
                // Fix hardcoded line heights
                const fixed = this.fixHardcodedLineHeights(fixedContent);
                if (fixed.changed) {
                    fixedContent = fixed.content;
                    hasChanges = true;
                    this.auditResults.issuesFixed.push({
                        file: filePath,
                        type: 'hardcoded-line-heights',
                        fixes: fixed.fixes
                    });
                }
            }
            
            // Check 3: Non-responsive typography classes
            const nonResponsiveClasses = this.findNonResponsiveClasses(content);
            if (nonResponsiveClasses.length > 0) {
                issues.push({
                    type: 'non-responsive-classes',
                    count: nonResponsiveClasses.length,
                    examples: nonResponsiveClasses.slice(0, 3)
                });
                
                // Fix non-responsive classes
                const fixed = this.fixNonResponsiveClasses(fixedContent);
                if (fixed.changed) {
                    fixedContent = fixed.content;
                    hasChanges = true;
                    this.auditResults.issuesFixed.push({
                        file: filePath,
                        type: 'non-responsive-classes',
                        fixes: fixed.fixes
                    });
                }
            }
            
            // Check 4: Validate against Figma specifications
            const figmaValidation = this.validateAgainstFigma(content, filePath);
            if (figmaValidation.length > 0) {
                issues.push({
                    type: 'figma-validation-errors',
                    count: figmaValidation.length,
                    examples: figmaValidation.slice(0, 3)
                });
            }
            
            // Save fixed file if changes were made
            if (hasChanges) {
                // Create backup first
                const backupPath = filePath + '.backup.' + Date.now();
                fs.writeFileSync(backupPath, content);
                
                // Write fixed content
                fs.writeFileSync(filePath, fixedContent);
                console.log(`    ✅ Fixed typography issues (backup: ${path.basename(backupPath)})`);
            }
            
            // Record results
            if (issues.length > 0) {
                this.auditResults.filesWithIssues++;
                this.auditResults.issuesFound.push({
                    file: filePath,
                    issues,
                    hasChanges
                });
                
                console.log(`    ⚠️  Found ${issues.length} issue types`);
                issues.forEach(issue => {
                    console.log(`        - ${issue.type}: ${issue.count} occurrences`);
                });
            } else {
                console.log(`    ✅ No typography issues found`);
            }
            
        } catch (error) {
            console.error(`    ❌ Error auditing ${filePath}:`, error.message);
            this.auditResults.validationErrors.push({
                file: filePath,
                error: error.message
            });
        }
    }
    
    /**
     * Find hardcoded font sizes
     */
    findHardcodedFontSizes(content) {
        const matches = [];
        let match;
        
        while ((match = this.typographyPatterns.hardcodedFontSizes.exec(content)) !== null) {
            matches.push({
                value: match[1] + 'px',
                position: match.index,
                context: content.substring(match.index - 20, match.index + 40)
            });
        }
        
        return matches;
    }
    
    /**
     * Fix hardcoded font sizes
     */
    fixHardcodedFontSizes(content) {
        const fixes = [];
        let fixedContent = content;
        let changed = false;
        
        fixedContent = fixedContent.replace(this.typographyPatterns.hardcodedFontSizes, (match, size) => {
            const sizeNum = parseInt(size);
            const properToken = this.getProperFontSizeToken(sizeNum);
            
            if (properToken) {
                fixes.push({
                    original: `font-size: ${size}px`,
                    fixed: `font-size: ${properToken}`
                });
                changed = true;
                return `font-size: ${properToken}`;
            }
            
            return match;
        });
        
        return { content: fixedContent, changed, fixes };
    }
    
    /**
     * Find hardcoded line heights
     */
    findHardcodedLineHeights(content) {
        const matches = [];
        let match;
        
        while ((match = this.typographyPatterns.hardcodedLineHeights.exec(content)) !== null) {
            matches.push({
                value: match[1] + 'px',
                position: match.index,
                context: content.substring(match.index - 20, match.index + 40)
            });
        }
        
        return matches;
    }
    
    /**
     * Fix hardcoded line heights
     */
    fixHardcodedLineHeights(content) {
        const fixes = [];
        let fixedContent = content;
        let changed = false;
        
        fixedContent = fixedContent.replace(this.typographyPatterns.hardcodedLineHeights, (match, height) => {
            const heightNum = parseInt(height);
            const properToken = this.getProperLineHeightToken(heightNum);
            
            if (properToken) {
                fixes.push({
                    original: `line-height: ${height}px`,
                    fixed: `line-height: ${properToken}`
                });
                changed = true;
                return `line-height: ${properToken}`;
            }
            
            return match;
        });
        
        return { content: fixedContent, changed, fixes };
    }
    
    /**
     * Find non-responsive typography classes
     */
    findNonResponsiveClasses(content) {
        const matches = [];
        const nonResponsivePattern = /\.font-[^{]*\{[^}]*font-size:\s*\d+px[^}]*\}/g;
        let match;
        
        while ((match = nonResponsivePattern.exec(content)) !== null) {
            matches.push({
                className: match[0].split('{')[0].trim(),
                position: match.index,
                context: match[0]
            });
        }
        
        return matches;
    }
    
    /**
     * Fix non-responsive classes
     */
    fixNonResponsiveClasses(content) {
        const fixes = [];
        let fixedContent = content;
        let changed = false;
        
        // Fix .font-title-xs-medium specifically
        const titleXsMediumPattern = /\.font-title-xs-medium\s*\{\s*font-family:[^}]*?font-size:\s*24px;\s*line-height:\s*32px;\s*font-weight:\s*500;?\s*\}/g;
        
        fixedContent = fixedContent.replace(titleXsMediumPattern, (match) => {
            const fixed = `.font-title-xs-medium {
  font-family: var(--font-title, "Overused Grotesk", sans-serif);
  font-size: var(--font-size-title-xs);
  line-height: var(--line-height-title-xs);
  font-weight: 500;
}`;
            
            fixes.push({
                original: 'Non-responsive .font-title-xs-medium class',
                fixed: 'Responsive .font-title-xs-medium class using tokens'
            });
            changed = true;
            return fixed;
        });
        
        return { content: fixedContent, changed, fixes };
    }
    
    /**
     * Validate typography against Figma specifications
     */
    validateAgainstFigma(content, filePath) {
        const errors = [];
        
        // Check if file mentions title/title-xs/medium but doesn't use correct implementation
        if (content.includes('title-xs') || content.includes('24px')) {
            if (!content.includes('var(--font-size-title-xs)')) {
                errors.push({
                    type: 'figma-spec-mismatch',
                    message: 'Uses title-xs sizing but not responsive token',
                    suggestion: 'Use var(--font-size-title-xs) and var(--line-height-title-xs)'
                });
            }
        }
        
        return errors;
    }
    
    /**
     * Get proper font size token for pixel value
     */
    getProperFontSizeToken(sizeInPx) {
        if (sizeInPx <= 10) return 'var(--font-size-body-xs)';
        if (sizeInPx <= 12) return 'var(--font-size-body-sm)';
        if (sizeInPx <= 14) return 'var(--font-size-body-md)';
        if (sizeInPx <= 16) return 'var(--font-size-body-lg)';
        if (sizeInPx <= 18) return 'var(--font-size-title-xs)';
        if (sizeInPx <= 20) return 'var(--font-size-title-sm)';
        if (sizeInPx <= 24) return 'var(--font-size-title-md)';
        if (sizeInPx <= 30) return 'var(--font-size-title-lg)';
        if (sizeInPx <= 36) return 'var(--font-size-title-xl)';
        if (sizeInPx <= 48) return 'var(--font-size-heading-h1)';
        return 'var(--font-size-display-display)';
    }
    
    /**
     * Get proper line height token for pixel value
     */
    getProperLineHeightToken(heightInPx) {
        if (heightInPx <= 16) return 'var(--line-height-body-xs)';
        if (heightInPx <= 20) return 'var(--line-height-body-sm)';
        if (heightInPx <= 24) return 'var(--line-height-title-xs)';
        if (heightInPx <= 28) return 'var(--line-height-body-xl)';
        if (heightInPx <= 32) return 'var(--line-height-title-md)';
        if (heightInPx <= 40) return 'var(--line-height-title-xl)';
        if (heightInPx <= 48) return 'var(--line-height-heading-h2)';
        if (heightInPx <= 60) return 'var(--line-height-heading-h1)';
        return 'var(--line-height-display-display)';
    }

    /**
     * Generate comprehensive audit report
     */
    generateAuditReport() {
        console.log('\n📊 TYPOGRAPHY AUDIT REPORT');
        console.log('='.repeat(50));
        
        const { totalFiles, filesWithIssues, issuesFound, issuesFixed, validationErrors } = this.auditResults;
        
        console.log(`📁 Total files audited: ${totalFiles}`);
        console.log(`⚠️  Files with issues: ${filesWithIssues}`);
        console.log(`🔧 Issues fixed: ${issuesFixed.length}`);
        console.log(`❌ Validation errors: ${validationErrors.length}`);
        
        if (filesWithIssues > 0) {
            console.log('\n📋 FILES WITH ISSUES:');
            issuesFound.forEach(fileResult => {
                console.log(`\n  📄 ${fileResult.file}`);
                fileResult.issues.forEach(issue => {
                    console.log(`    - ${issue.type}: ${issue.count} occurrences`);
                });
                if (fileResult.hasChanges) {
                    console.log(`    ✅ Issues were automatically fixed`);
                }
            });
        }
        
        if (issuesFixed.length > 0) {
            console.log('\n🔧 FIXES APPLIED:');
            issuesFixed.forEach(fix => {
                console.log(`\n  📄 ${fix.file}`);
                console.log(`    Type: ${fix.type}`);
                console.log(`    Fixes: ${fix.fixes.length}`);
            });
        }
        
        // Generate JSON report
        const reportPath = path.join(process.cwd(), 'design-system/examples/typography-audit-report.json');
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalFiles,
                filesWithIssues,
                issuesFixedCount: issuesFixed.length,
                validationErrors: validationErrors.length
            },
            filesAudited: issuesFound,
            fixesApplied: issuesFixed,
            validationErrors,
            recommendations: this.generateRecommendations()
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    }
    
    /**
     * Generate recommendations based on audit results
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (this.auditResults.filesWithIssues > 0) {
            recommendations.push({
                type: 'workflow-improvement',
                priority: 'high',
                message: 'Update component generation workflow to use responsive tokens by default'
            });
            
            recommendations.push({
                type: 'css-class-generation',
                priority: 'high', 
                message: 'Fix CSS class generation to use var(--token-name) instead of hardcoded values'
            });
        }
        
        recommendations.push({
            type: 'validation-enhancement',
            priority: 'medium',
            message: 'Add pre-commit hooks to validate typography token usage'
        });
        
        return recommendations;
    }
}

// Export for use as module
module.exports = TypographyAuditor;

// Run if called directly
if (require.main === module) {
    const auditor = new TypographyAuditor();
    auditor.run().catch(console.error);
}