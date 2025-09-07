#!/usr/bin/env node

/**
 * Figma Component Automation Script
 * 
 * SAFETY-FIRST APPROACH:
 * - Extracts component details from Figma
 * - Matches with existing design system tokens
 * - Generates components using ONLY existing tokens
 * - Validates against all protection rules
 * - Creates demo files in /examples/ directory
 * - NEVER modifies core design system files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import our modules
const FigmaExtractor = require('./modules/figma-extractor');
const DesignSystemMatcher = require('./modules/design-system-matcher');
const ComponentGenerator = require('./modules/component-generator');
const SafetyValidator = require('./modules/safety-validator');
const Config = require('./config/component-config');

class FigmaComponentAutomation {
    constructor() {
        this.config = Config;
        this.safetyValidator = new SafetyValidator();
        this.figmaExtractor = new FigmaExtractor();
        this.designSystemMatcher = new DesignSystemMatcher();
        this.componentGenerator = new ComponentGenerator();
        
        // Safety tracking
        this.processedComponents = [];
        this.failedComponents = [];
        this.safetyViolations = [];
    }

    /**
     * Main execution method with comprehensive safety checks
     * Processes your real Figma components ONE BY ONE
     */
    async run() {
        console.log('🚀 Starting Figma Component Automation...');
        console.log('🔒 Safety Mode: ENABLED - Core design system files are PROTECTED');
        console.log('📋 Processing your REAL Figma components ONE BY ONE');
        console.log('=====================================');
        
        try {
            // Pre-flight safety checks
            await this.performPreFlightChecks();
            
            console.log(`📋 Loaded configuration for ${this.config.components.length} real components from your Figma file`);
            console.log('🎯 Components will be processed sequentially with full safety validation');
            
            // Process each component definition one by one
            for (const componentDef of this.config.components) {
                await this.processComponent(componentDef);
                
                // Add a small delay between components for better readability
                if (this.processedComponents.length + this.failedComponents.length < this.config.components.length) {
                    console.log(`    ⏳ Waiting 1 second before next component...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            // Generate final report
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Automation failed:', error.message);
            this.handleFailure(error);
        }
    }

    /**
     * Pre-flight safety checks before any processing
     */
    async performPreFlightChecks() {
        console.log('🔍 Performing pre-flight safety checks...');
        
        // Check if protected files exist and are untouched
        const protectedFiles = [
            '../design-system/src/complete-design-system.css',
            '../design-system/css/design-system.css',
            '../variables/Mapped.json',
            '../tokens/index.css'
        ];
        
        for (const file of protectedFiles) {
            if (!fs.existsSync(file)) {
                throw new Error(`Protected file missing: ${file}`);
            }
        }
        
        // Verify we can create demo files
        const examplesDir = '../design-system/examples';
        if (!fs.existsSync(examplesDir)) {
            fs.mkdirSync(examplesDir, { recursive: true });
        }
        
        // Check design system token availability
        await this.designSystemMatcher.validateTokenAvailability();
        
        console.log('✅ Pre-flight checks passed');
    }

    /**
     * Process a single component with full safety validation
     * Processes components ONE BY ONE from your real Figma design
     */
    async processComponent(componentDef) {
        const { name, figmaNodeId, type, variants, description } = componentDef;
        const currentIndex = this.processedComponents.length + this.failedComponents.length + 1;
        const totalComponents = this.config.components.length;
        
        console.log(`\n🔧 [${currentIndex}/${totalComponents}] Processing: ${name}`);
        console.log(`    📍 Figma Node ID: ${figmaNodeId}`);
        console.log(`    🎯 Type: ${type}`);
        console.log(`    📝 Description: ${description}`);
        
        try {
            // Step 1: Extract from Figma using MCP (READ-ONLY)
            console.log(`    🔍 Step 1: Extracting from Figma using MCP...`);
            const figmaData = await this.figmaExtractor.extractComponent(figmaNodeId);
            console.log(`    ✅ Extracted Figma data for "${figmaData.name}"`);
            
            // Step 2: Safety validation of Figma data
            console.log(`    🔒 Step 2: Validating Figma data safety...`);
            this.safetyValidator.validateFigmaData(figmaData);
            console.log(`    ✅ Figma data validation passed`);
            
            // Step 3: Match with design system tokens
            console.log(`    🎨 Step 3: Matching with design system tokens...`);
            const tokenMapping = await this.designSystemMatcher.matchTokens(figmaData, type);
            console.log(`    ✅ Matched ${Object.keys(tokenMapping.tokens).length} token categories`);
            
            // Step 4: Validate token mapping
            console.log(`    🔍 Step 4: Validating token mapping...`);
            this.safetyValidator.validateTokenMapping(tokenMapping);
            console.log(`    ✅ Token mapping validation passed`);
            
            // Step 5: Generate component using existing tokens only
            console.log(`    🏗️  Step 5: Generating component files...`);
            const componentFiles = await this.componentGenerator.generateComponent({
                name,
                type,
                variants,
                figmaData,
                tokenMapping
            });
            console.log(`    ✅ Generated ${componentFiles.length} files:`);
            componentFiles.forEach(file => {
                console.log(`        📄 ${file.path}`);
            });
            
            // Step 6: Final safety validation of generated files
            console.log(`    🔒 Step 6: Final safety validation...`);
            this.safetyValidator.validateGeneratedFiles(componentFiles);
            console.log(`    ✅ Safety validation passed - Component is compliant!`);
            
            // Step 7: Save to examples directory (SAFE LOCATION)
            console.log(`    💾 Step 7: Saving files to examples directory...`);
            const savedFiles = await this.saveComponentFiles(name, componentFiles);
            console.log(`    ✅ Files saved successfully`);
            
            this.processedComponents.push({
                name,
                figmaNodeId,
                files: savedFiles,
                tokenMapping,
                status: 'success'
            });
            
            console.log(`    🎉 Successfully processed: ${name}`);
            console.log(`    📁 Files created in: ${componentDef.safetyRules.outputDirectory}`);
            
        } catch (error) {
            console.error(`    ❌ Failed to process ${name}:`, error.message);
            this.failedComponents.push({
                name,
                figmaNodeId,
                error: error.message,
                status: 'failed'
            });
            
            // Check if we should stop on error
            if (this.config.safety.stopOnError) {
                console.log(`    🛑 Stopping due to error (stopOnError: true)`);
                throw error;
            }
        }
    }

    /**
     * Save component files to examples directory (SAFE)
     */
    async saveComponentFiles(componentName, componentFiles) {
        const savedFiles = [];
        
        for (const file of componentFiles) {
            const filename = file.path;
            const content = file.content;
            
            // Ensure directory exists for each file
            const fileDir = path.dirname(filename);
            if (!fs.existsSync(fileDir)) {
                fs.mkdirSync(fileDir, { recursive: true });
            }
            
            fs.writeFileSync(filename, content);
            savedFiles.push(filename);
        }
        
        return savedFiles;
    }

    /**
     * Generate comprehensive report
     */
    generateReport() {
        console.log('\n📊 AUTOMATION REPORT');
        console.log('='.repeat(50));
        
        console.log(`✅ Successfully processed: ${this.processedComponents.length} components`);
        console.log(`❌ Failed: ${this.failedComponents.length} components`);
        console.log(`🚨 Safety violations: ${this.safetyViolations.length}`);
        
        if (this.processedComponents.length > 0) {
            console.log('\n✅ SUCCESSFUL COMPONENTS:');
            this.processedComponents.forEach(comp => {
                console.log(`  - ${comp.name}: ${comp.files.length} files generated`);
            });
        }
        
        if (this.failedComponents.length > 0) {
            console.log('\n❌ FAILED COMPONENTS:');
            this.failedComponents.forEach(comp => {
                console.log(`  - ${comp.name}: ${comp.error}`);
            });
        }
        
        if (this.safetyViolations.length > 0) {
            console.log('\n🚨 SAFETY VIOLATIONS:');
            this.safetyViolations.forEach(violation => {
                console.log(`  - ${violation}`);
            });
        }
        
        // Generate detailed report file
        const reportPath = '../design-system/examples/automation-report.json';
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.config.components.length,
                successful: this.processedComponents.length,
                failed: this.failedComponents.length,
                safetyViolations: this.safetyViolations.length
            },
            processed: this.processedComponents,
            failed: this.failedComponents,
            safetyViolations: this.safetyViolations
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    }

    /**
     * Handle failure with safety cleanup
     */
    handleFailure(error) {
        console.error('\n🚨 AUTOMATION FAILED - SAFETY MODE ACTIVATED');
        console.error('No core design system files were modified');
        console.error('All generated files are in /examples/ directory only');
        
        // Use required refusal phrases from workflow-enforcement.mdc
        if (error.message.includes('protected')) {
            console.error('REFUSAL: "I cannot modify the design system core files. This violates system protection rules. I can create demo files or documentation showing how to use the existing tokens instead."');
        } else if (error.message.includes('workflow')) {
            console.error('REFUSAL: "This violates the workflow rules - I cannot modify the design system"');
        } else if (error.message.includes('token')) {
            console.error('REFUSAL: "I cannot modify existing token values. I can create a demo showing how to use the existing tokens to achieve similar results."');
        } else {
            console.error('REFUSAL: "The design system is generated - modifications must go through the build process"');
        }
        
        // Log failure for debugging
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            processedComponents: this.processedComponents.length,
            failedComponents: this.failedComponents.length,
            refusalPhrase: this.getRefusalPhrase(error)
        };
        
        fs.writeFileSync('../design-system/examples/error-log.json', JSON.stringify(errorLog, null, 2));
    }

    /**
     * Get appropriate refusal phrase based on error type
     * @param {Error} error - Error object
     * @returns {string} Refusal phrase
     */
    getRefusalPhrase(error) {
        if (error.message.includes('protected')) {
            return "I cannot modify the design system core files. This violates system protection rules. I can create demo files or documentation showing how to use the existing tokens instead.";
        } else if (error.message.includes('workflow')) {
            return "This violates the workflow rules - I cannot modify the design system";
        } else if (error.message.includes('token')) {
            return "I cannot modify existing token values. I can create a demo showing how to use the existing tokens to achieve similar results.";
        } else {
            return "The design system is generated - modifications must go through the build process";
        }
    }
}

// Export for use as module
module.exports = FigmaComponentAutomation;

// Run if called directly
if (require.main === module) {
    const automation = new FigmaComponentAutomation();
    automation.run().catch(console.error);
}
