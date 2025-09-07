#!/usr/bin/env node

/**
 * Demo Runner for Figma Component Automation
 * 
 * SAFETY-FIRST DEMO:
 * - Runs automation with sample components
 * - Uses mock Figma data for testing
 * - Generates example components
 * - Validates all safety measures
 */

const FigmaComponentAutomation = require('./figma-component-automation');
const Config = require('./config/component-config');

class DemoRunner {
    constructor() {
        this.originalConfig = Config.components;
        this.setupDemoConfig();
    }

    /**
     * Setup demo configuration with sample components
     */
    setupDemoConfig() {
        // Override config with demo components
        Config.components = [
            {
                name: 'Demo Button',
                figmaNodeId: 'demo:1',
                type: 'button',
                variants: ['primary', 'secondary'],
                sizes: ['sm', 'md', 'lg'],
                description: 'Demo button component for testing',
                safetyRules: {
                    requiredTokens: ['--surface-primary-default', '--text-on-primary'],
                    protectedFiles: ['design-system/css/design-system.css'],
                    outputDirectory: 'design-system/examples/demo-button'
                }
            },
            {
                name: 'Demo Card',
                figmaNodeId: 'demo:2',
                type: 'card',
                variants: ['default', 'elevated'],
                sizes: ['sm', 'md'],
                description: 'Demo card component for testing',
                safetyRules: {
                    requiredTokens: ['--surface-neutral-card', '--border-neutral-default'],
                    protectedFiles: ['design-system/css/design-system.css'],
                    outputDirectory: 'design-system/examples/demo-card'
                }
            }
        ];

        // Enable demo mode
        Config.development.useMockData = true;
        Config.development.verboseLogging = true;
        Config.safety.maxComponentsPerRun = 2;
    }

    /**
     * Run demo
     */
    async run() {
        console.log('🎭 Starting Figma Component Automation Demo...');
        console.log('🔒 Safety Mode: ENABLED - Using mock data only');
        console.log('📁 Output: /design-system/examples/ directory only\n');

        try {
            const automation = new FigmaComponentAutomation();
            await automation.run();
            
            console.log('\n🎉 Demo completed successfully!');
            console.log('📁 Check the /design-system/examples/ directory for generated components');
            console.log('📄 Review the automation report for detailed results');
            
        } catch (error) {
            console.error('\n❌ Demo failed:', error.message);
            console.log('🔍 Check the error logs for details');
        } finally {
            // Restore original config
            Config.components = this.originalConfig;
        }
    }
}

// Run demo if called directly
if (require.main === module) {
    const demo = new DemoRunner();
    demo.run().catch(console.error);
}

module.exports = DemoRunner;
