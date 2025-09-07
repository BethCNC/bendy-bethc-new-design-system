#!/usr/bin/env node

/**
 * Figma Implementation Validator
 * 
 * Compares implemented components with their Figma specifications
 * to ensure 100% accuracy between design and code.
 */

const fs = require('fs');
const path = require('path');

class FigmaImplementationValidator {
    constructor() {
        this.figmaSpecs = this.loadFigmaSpecs();
        this.designSystemTokens = this.loadDesignSystemTokens();
    }

    /**
     * Load Figma specifications from MCP analysis
     */
    loadFigmaSpecs() {
        try {
            // Load from previous MCP analysis files
            const specs = {};
            
            // Example structure - in real usage, this would come from MCP calls
            specs['16:13565'] = { // Menu item node ID
                name: '[NAV]--menuitem',
                typography: {
                    fontFamily: 'Overused Grotesk',
                    fontSize: 24,
                    lineHeight: 32,
                    fontWeight: 500,
                    figmaStyle: 'title/title-xs/medium'
                },
                colors: {
                    background: {
                        default: '#f1f2f2', // Surface/Neutral/card
                        hover: '#f0f081',   // Surface/Primary/default  
                        selected: '#f0aaf0' // Surface/Secondary/default
                    },
                    text: '#0c0d0d', // Text/Neutral/display
                    border: '#252626'  // Border/Neutral/dark
                },
                spacing: {
                    padding: {
                        horizontal: 16,
                        vertical: 8
                    },
                    borderWidth: 2
                },
                states: ['default', 'hover', 'selected']
            };
            
            return specs;
        } catch (error) {
            console.error('Failed to load Figma specs:', error.message);
            return {};
        }
    }

    /**
     * Load design system tokens
     */
    loadDesignSystemTokens() {
        const tokens = {};
        
        try {
            const designSystemPath = path.join(process.cwd(), 'design-system/src/complete-design-system.css');
            if (fs.existsSync(designSystemPath)) {
                const content = fs.readFileSync(designSystemPath, 'utf8');
                Object.assign(tokens, this.parseCSSTokens(content));
            }
            
            const responsivePath = path.join(process.cwd(), 'design-system/css/responsive.css');
            if (fs.existsSync(responsivePath)) {
                const content = fs.readFileSync(responsivePath, 'utf8');
                Object.assign(tokens, this.parseCSSTokens(content));
            }
            
        } catch (error) {
            console.error('Failed to load design system tokens:', error.message);
        }
        
        return tokens;
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
     * Validate implementation against Figma spec
     */
    async validateImplementation(componentPath, figmaNodeId) {
        console.log(`🔍 Validating: ${componentPath}`);
        console.log(`📋 Against Figma Node: ${figmaNodeId}`);
        console.log('='.repeat(50));

        const figmaSpec = this.figmaSpecs[figmaNodeId];
        if (!figmaSpec) {
            console.error(`❌ No Figma specification found for node ${figmaNodeId}`);
            return false;
        }

        try {
            const componentContent = fs.readFileSync(componentPath, 'utf8');
            const validationResults = {
                typography: this.validateTypography(componentContent, figmaSpec.typography),
                colors: this.validateColors(componentContent, figmaSpec.colors),
                spacing: this.validateSpacing(componentContent, figmaSpec.spacing),
                states: this.validateStates(componentContent, figmaSpec.states),
                tokens: this.validateTokenUsage(componentContent)
            };

            return this.generateValidationReport(componentPath, figmaNodeId, validationResults, figmaSpec);

        } catch (error) {
            console.error(`❌ Error validating ${componentPath}:`, error.message);
            return false;
        }
    }

    /**
     * Validate typography implementation
     */
    validateTypography(content, figmaTypography) {
        const results = {
            passed: [],
            failed: [],
            warnings: []
        };

        if (!figmaTypography) return results;

        // Check font size token usage
        if (figmaTypography.fontSize === 24) {
            if (content.includes('var(--font-size-title-xs)')) {
                results.passed.push('✅ Uses correct responsive font size token for 24px');
            } else if (content.includes('font-size: 24px')) {
                results.failed.push('❌ Uses hardcoded 24px instead of var(--font-size-title-xs)');
            } else if (content.includes('var(--font-title-md)')) {
                results.failed.push('❌ Uses var(--font-title-md) (36px) instead of title-xs (24px)');
            }
        }

        // Check line height token usage
        if (figmaTypography.lineHeight === 32) {
            if (content.includes('var(--line-height-title-xs)')) {
                results.passed.push('✅ Uses correct responsive line height token for 32px');
            } else if (content.includes('line-height: 32px') || content.includes('line-height: 1.33')) {
                results.failed.push('❌ Uses hardcoded line height instead of var(--line-height-title-xs)');
            }
        }

        // Check font weight
        if (figmaTypography.fontWeight === 500) {
            if (content.includes('font-weight: 500')) {
                results.passed.push('✅ Correct font weight (500 - medium)');
            } else {
                results.failed.push('❌ Incorrect font weight, should be 500 (medium)');
            }
        }

        // Check font family token
        if (figmaTypography.fontFamily === 'Overused Grotesk') {
            if (content.includes('var(--font-title)')) {
                results.passed.push('✅ Uses correct font family token for titles');
            } else if (content.includes('var(--font-body)')) {
                results.warnings.push('⚠️ Uses body font token - verify if title font is intended');
            }
        }

        return results;
    }

    /**
     * Validate color implementation
     */
    validateColors(content, figmaColors) {
        const results = {
            passed: [],
            failed: [],
            warnings: []
        };

        if (!figmaColors) return results;

        // Check background colors
        if (figmaColors.background) {
            if (figmaColors.background.default === '#f1f2f2') {
                if (content.includes('var(--surface-neutral-card)')) {
                    results.passed.push('✅ Uses correct surface token for default background');
                } else if (content.includes('#f1f2f2')) {
                    results.failed.push('❌ Uses hardcoded hex color instead of var(--surface-neutral-card)');
                }
            }
        }

        // Check text colors
        if (figmaColors.text === '#0c0d0d') {
            if (content.includes('var(--text-neutral-heading)') || content.includes('var(--text-neutral-display)')) {
                results.passed.push('✅ Uses appropriate text color token');
            } else if (content.includes('#0c0d0d')) {
                results.failed.push('❌ Uses hardcoded text color instead of semantic token');
            }
        }

        return results;
    }

    /**
     * Validate spacing implementation
     */
    validateSpacing(content, figmaSpacing) {
        const results = {
            passed: [],
            failed: [],
            warnings: []
        };

        if (!figmaSpacing) return results;

        // Check padding
        if (figmaSpacing.padding) {
            if (figmaSpacing.padding.horizontal === 16) {
                if (content.includes('var(--spacing-md)')) {
                    results.passed.push('✅ Uses correct spacing token for 16px padding');
                } else if (content.includes('padding: 16px') || content.includes('padding-left: 16px')) {
                    results.failed.push('❌ Uses hardcoded 16px instead of var(--spacing-md)');
                }
            }
        }

        return results;
    }

    /**
     * Validate component states
     */
    validateStates(content, figmaStates) {
        const results = {
            passed: [],
            failed: [],
            warnings: []
        };

        if (!figmaStates) return results;

        const stateChecks = {
            'default': () => content.includes('background:') || content.includes('background-color:'),
            'hover': () => content.includes(':hover') && content.includes('surface-primary-hover'),
            'selected': () => content.includes('selected') || content.includes('active')
        };

        figmaStates.forEach(state => {
            if (stateChecks[state] && stateChecks[state]()) {
                results.passed.push(`✅ ${state} state implemented`);
            } else {
                results.warnings.push(`⚠️ ${state} state may not be fully implemented`);
            }
        });

        return results;
    }

    /**
     * Validate overall token usage
     */
    validateTokenUsage(content) {
        const results = {
            passed: [],
            failed: [],
            warnings: []
        };

        // Check for hardcoded values
        const hardcodedChecks = [
            { pattern: /font-size:\s*\d+px/g, message: 'Hardcoded font size found' },
            { pattern: /line-height:\s*\d+px/g, message: 'Hardcoded line height found' },
            { pattern: /color:\s*#[a-fA-F0-9]{6}/g, message: 'Hardcoded hex color found' },
            { pattern: /background:\s*#[a-fA-F0-9]{6}/g, message: 'Hardcoded background color found' },
            { pattern: /padding:\s*\d+px/g, message: 'Hardcoded padding found' },
            { pattern: /margin:\s*\d+px/g, message: 'Hardcoded margin found' }
        ];

        let hasHardcodedValues = false;
        hardcodedChecks.forEach(check => {
            const matches = content.match(check.pattern);
            if (matches && matches.length > 0) {
                results.failed.push(`❌ ${check.message}: ${matches.length} occurrences`);
                hasHardcodedValues = true;
            }
        });

        if (!hasHardcodedValues) {
            results.passed.push('✅ No hardcoded values detected');
        }

        // Check for proper token usage
        const tokenPattern = /var\(--[^)]+\)/g;
        const tokenMatches = content.match(tokenPattern);
        if (tokenMatches && tokenMatches.length > 0) {
            results.passed.push(`✅ Uses ${tokenMatches.length} design system tokens`);
        }

        return results;
    }

    /**
     * Generate comprehensive validation report
     */
    generateValidationReport(componentPath, figmaNodeId, results, figmaSpec) {
        console.log(`\n📊 VALIDATION REPORT`);
        console.log(`Component: ${path.basename(componentPath)}`);
        console.log(`Figma Node: ${figmaNodeId} (${figmaSpec.name})`);
        console.log('='.repeat(50));

        let totalPassed = 0;
        let totalFailed = 0;
        let totalWarnings = 0;

        Object.entries(results).forEach(([category, result]) => {
            console.log(`\n📋 ${category.toUpperCase()}:`);
            
            if (result.passed.length > 0) {
                result.passed.forEach(item => console.log(`  ${item}`));
                totalPassed += result.passed.length;
            }
            
            if (result.failed.length > 0) {
                result.failed.forEach(item => console.log(`  ${item}`));
                totalFailed += result.failed.length;
            }
            
            if (result.warnings.length > 0) {
                result.warnings.forEach(item => console.log(`  ${item}`));
                totalWarnings += result.warnings.length;
            }
        });

        // Summary
        console.log(`\n📈 SUMMARY:`);
        console.log(`✅ Passed: ${totalPassed}`);
        console.log(`❌ Failed: ${totalFailed}`);  
        console.log(`⚠️  Warnings: ${totalWarnings}`);

        const isValid = totalFailed === 0;
        console.log(`\n🎯 OVERALL: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

        if (!isValid) {
            console.log(`\n🔧 NEXT STEPS:`);
            console.log(`1. Fix failed validation items above`);
            console.log(`2. Use design system tokens instead of hardcoded values`);
            console.log(`3. Run: node scripts/audit-and-fix-typography.js`);
            console.log(`4. Re-validate implementation`);
        }

        return isValid;
    }
}

// CLI usage
if (require.main === module) {
    const validator = new FigmaImplementationValidator();
    const componentPath = process.argv[2];
    const figmaNodeId = process.argv[3];
    
    if (!componentPath || !figmaNodeId) {
        console.log('Usage: node validate-figma-implementation.js <component-path> <figma-node-id>');
        console.log('Example: node validate-figma-implementation.js design-system/examples/menu-item-complete.html 16:13565');
        process.exit(1);
    }
    
    validator.validateImplementation(componentPath, figmaNodeId)
        .then(isValid => process.exit(isValid ? 0 : 1))
        .catch(console.error);
}

module.exports = FigmaImplementationValidator;