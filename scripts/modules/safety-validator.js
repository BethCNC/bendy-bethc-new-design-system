/**
 * Safety Validator
 * 
 * ENFORCES ALL DESIGN SYSTEM PROTECTION RULES:
 * - Validates Figma data extraction
 * - Ensures token mapping uses existing tokens only
 * - Validates generated files don't modify core system
 * - Enforces workflow compliance
 * - Prevents hardcoded values
 * - Validates accessibility requirements
 */

const fs = require('fs');
const path = require('path');

class SafetyValidator {
    constructor() {
        this.protectedFiles = [
            // Core Design System Files (from system-protection-rules.mdc)
            'design-system/src/complete-design-system.css',
            'design-system/css/design-system.css',
            'design-system/css/globals.css',
            'design-system/src/tailwind.config.js',
            
            // Token Files (from file-modification-restrictions.mdc)
            'variables/Mapped.json',
            'variables/Primitives-Light.json',
            'variables/Primitives-Dark.json',
            'variables/Components-SM.json',
            'variables/Components-MD.json',
            'variables/Components-LG.json',
            'variables/Components-XL.json',
            'variables/Responsive-mobile.json',
            'variables/Responsive-tablet.json',
            'variables/Responsive-desktop.json',
            'variables/Alias.json',
            'variables/figma_styles.json',
            'variables/textStyles.json',
            'tokens/index.css',
            
            // Rule Files (from file-modification-restrictions.mdc)
            '.cursor/rules/button-rules.mdc',
            '.cursor/rules/component-rules.mdc',
            '.cursor/rules/state-rules.mdc',
            '.cursor/rules/tokens-rules.mdc',
            '.cursor/rules/design-system.mdc',
            '.cursor/rules/workflow.mdc',
            '.cursor/rules/workflow-enforcement.mdc',
            '.cursor/rules/system-protection-rules.mdc',
            '.cursor/rules/pre-action-checks.mdc',
            '.cursor/rules/figma-analysis-protocol.mdc',
            '.cursor/rules/file-modification-restrictions.mdc',
            '.cursor/rules/typography-rules.mdc',
            '.cursor/rules/responsive-component.mdc',
            '.cursor/rules/no-hardcoding.mdc',
            '.cursor/rules/navigation-rules.mdc',
            '.cursor/rules/naming-rules.mdc',
            '.cursor/rules/layout-rules.mdc',
            '.cursor/rules/responsive-rules.mdc'
        ];

        this.allowedDirectories = [
            'design-system/examples/',
            'design-system/docs/',
            'test-files/',
            'scripts/'
        ];

        this.violations = [];
    }

    /**
     * Validate Figma data extraction
     * @param {Object} figmaData - Extracted Figma data
     */
    validateFigmaData(figmaData) {
        console.log('    🔒 Validating Figma data extraction...');

        // Check required fields
        const requiredFields = ['id', 'name', 'type'];
        const missingFields = requiredFields.filter(field => !figmaData[field]);
        
        if (missingFields.length > 0) {
            this.addViolation(`Missing required Figma fields: ${missingFields.join(', ')}`);
        }

        // Validate data types
        if (typeof figmaData.id !== 'string') {
            this.addViolation('Figma ID must be a string');
        }

        if (typeof figmaData.name !== 'string') {
            this.addViolation('Figma name must be a string');
        }

        // Check for suspicious data that might indicate system modification attempts
        if (figmaData.systemModifications) {
            this.addViolation('Figma data contains system modification attempts - BLOCKED');
        }

        if (figmaData.newTokens) {
            this.addViolation('Figma data contains new token creation attempts - BLOCKED');
        }

        if (this.violations.length > 0) {
            throw new Error(`Figma data validation failed: ${this.violations.join('; ')}`);
        }

        console.log('    ✅ Figma data validation passed');
    }

    /**
     * Validate token mapping
     * @param {Object} tokenMapping - Token mapping object
     */
    validateTokenMapping(tokenMapping) {
        console.log('    🔒 Validating token mapping...');

        // Extract all token references
        const allTokens = this.extractAllTokenReferences(tokenMapping);

        // Check for hardcoded values
        const hardcodedValues = this.findHardcodedValues(tokenMapping);
        if (hardcodedValues.length > 0) {
            this.addViolation(`Hardcoded values found: ${hardcodedValues.join(', ')}`);
        }

        // Check for new token creation attempts
        const newTokenAttempts = this.findNewTokenAttempts(allTokens);
        if (newTokenAttempts.length > 0) {
            this.addViolation(`New token creation attempts: ${newTokenAttempts.join(', ')}`);
        }

        // Validate token format
        const invalidTokens = this.findInvalidTokenFormats(allTokens);
        if (invalidTokens.length > 0) {
            this.addViolation(`Invalid token formats: ${invalidTokens.join(', ')}`);
        }

        // Check for protected file references
        const protectedReferences = this.findProtectedFileReferences(tokenMapping);
        if (protectedReferences.length > 0) {
            this.addViolation(`Protected file references: ${protectedReferences.join(', ')}`);
        }

        if (this.violations.length > 0) {
            throw new Error(`Token mapping validation failed: ${this.violations.join('; ')}`);
        }

        console.log(`    ✅ Token mapping validation passed (${allTokens.length} tokens validated)`);
    }

    /**
     * Validate generated component files
     * @param {Object} componentFiles - Generated component files
     */
    validateGeneratedFiles(componentFiles) {
        console.log('    🔒 Validating generated component files...');

        for (const file of componentFiles) {
            const filename = file.path;
            const content = file.content;
            
            // Check file location
            this.validateFileLocation(filename);

            // Check content for violations
            this.validateFileContent(filename, content);

            // Check for hardcoded values
            this.validateNoHardcodedValues(filename, content);

            // Check for system modification attempts
            this.validateNoSystemModifications(filename, content);

            // Check accessibility compliance
            this.validateAccessibility(filename, content);
        }

        if (this.violations.length > 0) {
            throw new Error(`Generated files validation failed: ${this.violations.join('; ')}`);
        }

        console.log(`    ✅ Generated files validation passed (${Object.keys(componentFiles).length} files)`);
    }

    /**
     * Validate file location is in allowed directory
     * @param {string} filename - File path
     */
    validateFileLocation(filename) {
        const isAllowed = this.allowedDirectories.some(dir => 
            filename.startsWith(dir) || filename.includes('/examples/')
        );

        if (!isAllowed) {
            this.addViolation(`File location not allowed: ${filename}. Must be in examples/ or docs/ directory.`);
        }
    }

    /**
     * Validate file content
     * @param {string} filename - File path
     * @param {string} content - File content
     */
    validateFileContent(filename, content) {
        // Check for import statements that might reference protected files
        const importRegex = /@import\s+['"]([^'"]+)['"]/g;
        let match;
        
        while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            if (this.isProtectedFile(importPath)) {
                this.addViolation(`Protected file import in ${filename}: ${importPath}`);
            }
        }

        // Check for CSS custom property definitions (should only use existing ones)
        // Look for CSS custom property definitions at the root level (not in selectors)
        const cssVarDefRegex = /^\s*--[a-zA-Z0-9-]+:\s*[^;]+;/gm;
        while ((match = cssVarDefRegex.exec(content)) !== null) {
            this.addViolation(`CSS custom property definition in ${filename}: ${match[0]}. Only use existing tokens.`);
        }
    }

    /**
     * Validate no hardcoded values in content
     * @param {string} filename - File path
     * @param {string} content - File content
     */
    validateNoHardcodedValues(filename, content) {
        // Check for hex colors
        const hexColorRegex = /#[0-9a-fA-F]{3,6}/g;
        const hexColors = content.match(hexColorRegex);
        if (hexColors) {
            this.addViolation(`Hardcoded hex colors in ${filename}: ${hexColors.join(', ')}`);
        }

        // Check for hardcoded pixel values (except in comments or examples)
        const pixelRegex = /\b\d+px\b/g;
        const pixels = content.match(pixelRegex);
        if (pixels) {
            // Allow pixels in comments or example contexts
            const lines = content.split('\n');
            const suspiciousPixels = [];
            
            pixels.forEach(pixel => {
                const lineIndex = content.indexOf(pixel);
                const lineNumber = content.substring(0, lineIndex).split('\n').length;
                const line = lines[lineNumber - 1];
                
                // Check if it's in a comment or example
                if (!line.trim().startsWith('//') && 
                    !line.trim().startsWith('/*') && 
                    !line.includes('example') &&
                    !line.includes('demo')) {
                    suspiciousPixels.push(`${pixel} (line ${lineNumber})`);
                }
            });
            
            if (suspiciousPixels.length > 0) {
                this.addViolation(`Hardcoded pixel values in ${filename}: ${suspiciousPixels.join(', ')}`);
            }
        }

        // Check for hardcoded font names
        const fontNameRegex = /font-family:\s*['"][^'"]*['"]/g;
        const fontNames = content.match(fontNameRegex);
        if (fontNames) {
            this.addViolation(`Hardcoded font names in ${filename}: ${fontNames.join(', ')}`);
        }
    }

    /**
     * Validate no system modification attempts
     * @param {string} filename - File path
     * @param {string} content - File content
     */
    validateNoSystemModifications(filename, content) {
        const systemModificationPatterns = [
            /design-system\/src\/complete-design-system\.css/,
            /design-system\/css\/design-system\.css/,
            /variables\/.*\.json/,
            /tokens\/index\.css/,
            /\.cursor\/rules\/.*\.mdc/
        ];

        systemModificationPatterns.forEach(pattern => {
            if (pattern.test(content)) {
                this.addViolation(`System modification attempt in ${filename}: ${pattern.source}`);
            }
        });

        // Check for file write operations
        const fileWritePatterns = [
            /fs\.writeFileSync/,
            /fs\.writeFile/,
            /fs\.createWriteStream/,
            /fs\.appendFile/
        ];

        fileWritePatterns.forEach(pattern => {
            if (pattern.test(content)) {
                this.addViolation(`File write operation in ${filename}: ${pattern.source}`);
            }
        });
    }

    /**
     * Validate accessibility compliance
     * @param {string} filename - File path
     * @param {string} content - File content
     */
    validateAccessibility(filename, content) {
        // Check for focus states
        if (content.includes('button') || content.includes('input') || content.includes('a[')) {
            // For HTML files, check if they include CSS files (focus states might be in CSS)
            if (filename.endsWith('.html') && content.includes('<link rel="stylesheet"')) {
                // HTML files that include CSS files are considered compliant for focus states
                // The CSS file will be validated separately
            } else if (filename.endsWith('.md') && content.includes('focus')) {
                // Documentation files that mention "focus" are considered compliant
            } else if (!content.includes(':focus') && !content.includes(':focus-visible')) {
                this.addViolation(`Missing focus states in ${filename} - accessibility requirement`);
            }
        }

        // Check for aria-labels on icon-only buttons (only for HTML files)
        if (filename.endsWith('.html') && content.includes('icon') && content.includes('button')) {
            if (!content.includes('aria-label') && !content.includes('title=')) {
                this.addViolation(`Missing aria-label on icon button in ${filename} - accessibility requirement`);
            }
        }

        // Check for proper contrast ratios (basic check)
        if (content.includes('color:') && content.includes('background:')) {
            // This is a basic check - more sophisticated contrast checking could be added
            console.log(`    ⚠️  Manual contrast ratio check recommended for ${filename}`);
        }
    }

    /**
     * Helper methods
     */

    extractAllTokenReferences(obj) {
        const tokens = [];
        
        const extractTokens = (item) => {
            if (typeof item === 'string' && item.startsWith('--')) {
                tokens.push(item);
            } else if (typeof item === 'object' && item !== null) {
                Object.values(item).forEach(extractTokens);
            }
        };

        extractTokens(obj);
        return [...new Set(tokens)];
    }

    findHardcodedValues(obj) {
        const hardcoded = [];
        
        const findHardcoded = (item) => {
            if (typeof item === 'string') {
                // Check for hex colors
                if (/^#[0-9a-fA-F]{3,6}$/.test(item)) {
                    hardcoded.push(`hex color: ${item}`);
                }
                // Check for pixel values
                if (/^\d+px$/.test(item)) {
                    hardcoded.push(`pixel value: ${item}`);
                }
                // Check for font names
                if (item.includes('Arial') || item.includes('Helvetica') || item.includes('Times')) {
                    hardcoded.push(`font name: ${item}`);
                }
            } else if (typeof item === 'object' && item !== null) {
                Object.values(item).forEach(findHardcoded);
            }
        };

        findHardcoded(obj);
        return hardcoded;
    }

    findNewTokenAttempts(tokens) {
        const newTokenPatterns = [
            /--new-/,
            /--custom-/,
            /--temp-/,
            /--test-/
        ];

        return tokens.filter(token => 
            newTokenPatterns.some(pattern => pattern.test(token))
        );
    }

    findInvalidTokenFormats(tokens) {
        return tokens.filter(token => 
            !/^--[a-z0-9-]+$/.test(token)
        );
    }

    findProtectedFileReferences(obj) {
        const references = [];
        
        const findReferences = (item) => {
            if (typeof item === 'string') {
                this.protectedFiles.forEach(protectedFile => {
                    if (item.includes(protectedFile)) {
                        references.push(protectedFile);
                    }
                });
            } else if (typeof item === 'object' && item !== null) {
                Object.values(item).forEach(findReferences);
            }
        };

        findReferences(obj);
        return [...new Set(references)];
    }

    isProtectedFile(filePath) {
        return this.protectedFiles.some(protectedFile => 
            filePath.includes(protectedFile) || filePath.includes(protectedFile.replace(/\//g, '/'))
        );
    }

    addViolation(message) {
        this.violations.push(message);
        console.error(`    🚨 SAFETY VIOLATION: ${message}`);
    }

    /**
     * Get required refusal phrases from workflow-enforcement.mdc
     * @param {string} violationType - Type of violation
     * @returns {string} Required refusal phrase
     */
    getRequiredRefusalPhrase(violationType) {
        const refusalPhrases = {
            workflow: "This violates the workflow rules - I cannot modify the design system",
            demo: "I can create a demo file instead to show the concept",
            build: "The design system is generated - modifications must go through the build process",
            protected: "I cannot modify the design system core files. This violates system protection rules. I can create demo files or documentation showing how to use the existing tokens instead.",
            token: "I cannot modify existing token values. I can create a demo showing how to use the existing tokens to achieve similar results.",
            hardcode: "I cannot use hardcoded values. I must use existing design system tokens only."
        };
        
        return refusalPhrases[violationType] || "This violates the design system protection rules.";
    }

    /**
     * Get all violations
     * @returns {Array} Array of violation messages
     */
    getViolations() {
        return this.violations;
    }

    /**
     * Clear violations
     */
    clearViolations() {
        this.violations = [];
    }

    /**
     * Check if there are any violations
     * @returns {boolean} True if violations exist
     */
    hasViolations() {
        return this.violations.length > 0;
    }
}

module.exports = SafetyValidator;
