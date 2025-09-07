/**
 * Component Configuration
 * 
 * SAFETY-FIRST APPROACH:
 * - Defines components to be processed from Figma
 * - Each component has safety validation rules
 * - Prevents processing of protected components
 * - Ensures proper workflow compliance
 */

const Config = {
    // Figma file configuration
    figma: {
        fileKey: process.env.FIGMA_FILE_KEY || 'your-figma-file-key',
        apiKey: process.env.FIGMA_API_KEY || 'your-figma-api-key'
    },

    // Safety settings
    safety: {
        // Maximum number of components to process in one run
        maxComponentsPerRun: 10,
        
        // Require manual approval for each component
        requireApproval: false,
        
        // Stop on first error
        stopOnError: true,
        
        // Validate all tokens exist before processing
        validateTokensFirst: true,
        
        // Create backup before processing
        createBackup: false
    },

    // Output settings
    output: {
        // Directory for generated components
        componentsDir: 'design-system/examples',
        
        // Directory for documentation
        docsDir: 'design-system/docs/figma-analysis',
        
        // Directory for test files
        testsDir: 'design-system/examples',
        
        // Generate HTML demos
        generateDemos: true,
        
        // Generate documentation
        generateDocs: true,
        
        // Generate test files
        generateTests: true
    },

    // Component definitions - Real components from your Figma design system
    components: [
        {
            name: 'Button',
            figmaNodeId: '478:17131',
            type: 'button',
            variants: ['primary', 'secondary', 'neutral', 'destructive', 'outline', 'ghost'],
            sizes: ['sm', 'md', 'lg', 'xl'],
            description: 'Main action button component',
            safetyRules: {
                requiredTokens: ['--surface-primary-default', '--text-on-primary'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/button'
            }
        },
        {
            name: 'Avatar',
            figmaNodeId: '284:5619',
            type: 'avatar',
            variants: ['default', 'small', 'large'],
            sizes: ['sm', 'md', 'lg'],
            description: 'User avatar component',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--border-neutral-default'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/avatar'
            }
        },
        {
            name: 'Icon Only Button',
            figmaNodeId: '640:891',
            type: 'button',
            variants: ['default', 'hover', 'active'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Icon-only button variant',
            safetyRules: {
                requiredTokens: ['--surface-primary-default', '--text-on-primary'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/icon-button'
            }
        },
        {
            name: 'Page Title',
            figmaNodeId: '402:1417',
            type: 'page-title',
            variants: ['default', 'large', 'small'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Page title component with responsive display text and spacing',
            safetyRules: {
                requiredTokens: [
                    '--text-neutral-heading',
                    '--font-display',
                    '--font-size-display-display',
                    '--line-height-display-display',
                    '--margins-mobile',
                    '--margins-tablet', 
                    '--margins-desktop',
                    '--spacing-lg',
                    '--spacing-xl'
                ],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/page-title'
            }
        },
        {
            name: 'Bendy Beth Logo',
            figmaNodeId: '284:5606',
            type: 'logo',
            variants: ['default', 'dark', 'light'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Main logo component',
            safetyRules: {
                requiredTokens: ['--surface-primary-default', '--text-on-primary'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/logo'
            }
        },
        {
            name: 'Menu Bar',
            figmaNodeId: '89:48965',
            type: 'navigation',
            variants: ['horizontal', 'vertical', 'mobile'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Navigation menu bar',
            safetyRules: {
                requiredTokens: ['--surface-neutral-subtle', '--text-neutral-body'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/menu-bar'
            }
        },
        {
            name: 'Label',
            figmaNodeId: '83:47794',
            type: 'label',
            variants: ['default', 'required', 'optional'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Form label component',
            safetyRules: {
                requiredTokens: ['--text-neutral-body', '--font-weight-medium'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/label'
            }
        },
        {
            name: 'Inputs',
            figmaNodeId: '89:48327',
            type: 'input',
            variants: ['default', 'error', 'success', 'disabled'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Form input components',
            safetyRules: {
                requiredTokens: ['--surface-neutral-default', '--border-neutral-default'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/inputs'
            }
        },
        {
            name: 'Field',
            figmaNodeId: '83:47798',
            type: 'field',
            variants: ['default', 'error', 'success', 'disabled'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Form field component',
            safetyRules: {
                requiredTokens: ['--surface-neutral-default', '--border-neutral-default'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/field'
            }
        },
        {
            name: 'Cursor',
            figmaNodeId: '1534:1710',
            type: 'cursor',
            variants: ['default', 'pointer', 'text'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Custom cursor component',
            safetyRules: {
                requiredTokens: ['--surface-primary-default', '--text-on-primary'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/cursor'
            }
        },
        {
            name: 'Favicon',
            figmaNodeId: '1534:1697',
            type: 'favicon',
            variants: ['default', 'dark', 'light'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Website favicon',
            safetyRules: {
                requiredTokens: ['--surface-primary-default', '--text-on-primary'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/favicon'
            }
        },
        {
            name: 'Slot',
            figmaNodeId: '215:865',
            type: 'slot',
            variants: ['default', 'content', 'empty'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Content slot component',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--border-neutral-default'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/slot'
            }
        },
        {
            name: 'Slot Columns',
            figmaNodeId: '215:9765',
            type: 'slot',
            variants: ['default', '2-col', '3-col', '4-col'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Column-based slot layout',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--spacing-md'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/slot-columns'
            }
        },
        {
            name: 'Slot Rows',
            figmaNodeId: '215:896',
            type: 'slot',
            variants: ['default', '2-row', '3-row', '4-row'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Row-based slot layout',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--spacing-md'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/slot-rows'
            }
        },
        {
            name: 'Copy Placeholders',
            figmaNodeId: '215:676',
            type: 'copy',
            variants: ['default', 'heading', 'body', 'caption'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Text placeholder components',
            safetyRules: {
                requiredTokens: ['--text-neutral-body', '--font-family-body'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/copy-placeholders'
            }
        },
        {
            name: 'Copy Blocks',
            figmaNodeId: '215:810',
            type: 'copy',
            variants: ['default', 'paragraph', 'list', 'quote'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Text block components',
            safetyRules: {
                requiredTokens: ['--text-neutral-body', '--font-family-body'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/copy-blocks'
            }
        },
        {
            name: 'Image Placeholders',
            figmaNodeId: '215:843',
            type: 'image',
            variants: ['default', 'square', 'rectangle', 'circle'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Image placeholder components',
            safetyRules: {
                requiredTokens: ['--surface-neutral-subtle', '--border-neutral-default'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/image-placeholders'
            }
        },
        {
            name: 'Sample Slot Cards',
            figmaNodeId: '215:909',
            type: 'card',
            variants: ['default', 'elevated', 'outlined'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Sample card components for slots',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--border-neutral-default'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/sample-slot-cards'
            }
        },
        {
            name: 'Blog Post Card',
            figmaNodeId: '308:6987',
            type: 'card',
            variants: ['default', 'featured', 'compact'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Blog post card component',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--border-neutral-default'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/blog-post-card'
            }
        },
        {
            name: 'Pagination',
            figmaNodeId: '273:1708',
            type: 'pagination',
            variants: ['default', 'compact', 'extended'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Pagination component',
            safetyRules: {
                requiredTokens: ['--surface-primary-default', '--text-on-primary'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/pagination'
            }
        },
        {
            name: 'Blog Categories',
            figmaNodeId: '1534:5831',
            type: 'categories',
            variants: ['default', 'horizontal', 'vertical'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Blog category components',
            safetyRules: {
                requiredTokens: ['--surface-neutral-subtle', '--text-neutral-body'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/blog-categories'
            }
        },
        {
            name: 'About Me',
            figmaNodeId: '623:134487',
            type: 'about',
            variants: ['default', 'compact', 'detailed'],
            sizes: ['sm', 'md', 'lg'],
            description: 'About me section component',
            safetyRules: {
                requiredTokens: ['--text-neutral-body', '--font-family-body'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/about-me'
            }
        },
        {
            name: 'Chip',
            figmaNodeId: '2110:13352',
            type: 'chip',
            variants: ['default', 'success', 'warning', 'error', 'info'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Chip/tag component',
            safetyRules: {
                requiredTokens: ['--surface-primary-default', '--text-on-primary'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/chip'
            }
        },
        {
            name: 'Footer',
            figmaNodeId: '623:134531',
            type: 'footer',
            variants: ['default', 'minimal', 'extended'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Website footer component',
            safetyRules: {
                requiredTokens: ['--surface-neutral-subtle', '--text-neutral-body'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/footer'
            }
        },
        {
            name: 'Footer Scrolling Text Animation',
            figmaNodeId: '804:7463',
            type: 'animation',
            variants: ['default', 'slow', 'fast'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Animated scrolling text for footer',
            safetyRules: {
                requiredTokens: ['--text-neutral-body', '--font-family-body'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/footer-scrolling-animation'
            }
        },
        {
            name: 'Social Feed Preview',
            figmaNodeId: '701:46839',
            type: 'social',
            variants: ['default', 'compact', 'detailed'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Social media feed preview',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--border-neutral-default'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/social-feed-preview'
            }
        },
        {
            name: 'Features',
            figmaNodeId: '623:134469',
            type: 'features',
            variants: ['default', 'grid', 'list'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Features section component',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--text-neutral-body'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/features'
            }
        },
        {
            name: 'Features Alt',
            figmaNodeId: '885:44374',
            type: 'features',
            variants: ['default', 'grid', 'list'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Alternative features component',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--text-neutral-body'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/features-alt'
            }
        },
        {
            name: 'Image Gallery',
            figmaNodeId: '129:52365',
            type: 'gallery',
            variants: ['default', 'grid', 'masonry'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Image gallery component',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--border-neutral-default'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/image-gallery'
            }
        },
        {
            name: 'Image Gallery Alt',
            figmaNodeId: '827:25127',
            type: 'gallery',
            variants: ['default', 'grid', 'masonry'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Alternative image gallery component',
            safetyRules: {
                requiredTokens: ['--surface-neutral-card', '--border-neutral-default'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/image-gallery-alt'
            }
        },
        {
            name: 'CTA',
            figmaNodeId: '89:48889',
            type: 'cta',
            variants: ['default', 'primary', 'secondary'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Call-to-action component',
            safetyRules: {
                requiredTokens: ['--surface-primary-default', '--text-on-primary'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/cta'
            }
        },
        {
            name: 'Contact Me Animation',
            figmaNodeId: '1534:6101',
            type: 'animation',
            variants: ['default', 'slow', 'fast'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Contact me animation component',
            safetyRules: {
                requiredTokens: ['--text-neutral-body', '--font-family-body'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/contact-me-animation'
            }
        },
        {
            name: 'Hero',
            figmaNodeId: '959:45251',
            type: 'hero',
            variants: ['default', 'large', 'small'],
            sizes: ['sm', 'md', 'lg'],
            description: 'Hero section component',
            safetyRules: {
                requiredTokens: ['--text-neutral-heading', '--font-family-heading'],
                protectedFiles: ['design-system/css/design-system.css'],
                outputDirectory: 'design-system/examples/hero'
            }
        }
    ],

    // Token validation rules
    tokenValidation: {
        // Required token categories
        requiredCategories: [
            'surface',
            'text',
            'border',
            'spacing',
            'typography',
            'radius'
        ],
        
        // Minimum tokens per category
        minTokensPerCategory: {
            surface: 5,
            text: 3,
            border: 2,
            spacing: 4,
            typography: 6,
            radius: 3
        },
        
        // Forbidden token patterns
        forbiddenPatterns: [
            /--new-/,
            /--custom-/,
            /--temp-/,
            /--test-/,
            /--hardcoded-/
        ]
    },

    // Component validation rules
    componentValidation: {
        // Required states for all components
        requiredStates: [
            'default',
            'hover',
            'active',
            'focus',
            'disabled'
        ],
        
        // Required accessibility features
        requiredAccessibility: [
            'focus-visible',
            'aria-labels',
            'keyboard-navigation',
            'contrast-ratio'
        ],
        
        // Required responsive features
        requiredResponsive: [
            'mobile-first',
            'responsive-typography',
            'flexible-layout'
        ]
    },

    // Error handling
    errorHandling: {
        // Retry failed components
        retryFailed: true,
        maxRetries: 3,
        
        // Log all errors
        logErrors: true,
        errorLogFile: 'design-system/examples/error-log.json',
        
        // Continue processing after errors
        continueAfterError: false,
        
        // Send notifications on errors
        notifyOnError: false
    },

    // Performance settings
    performance: {
        // Process components in parallel
        parallelProcessing: false,
        maxConcurrent: 3,
        
        // Cache Figma data
        cacheFigmaData: true,
        cacheExpiry: 3600000, // 1 hour
        
        // Optimize generated files
        minifyOutput: false,
        removeComments: false
    },

    // Development settings
    development: {
        // Use mock data when Figma API is unavailable
        useMockData: true,
        
        // Generate verbose logs
        verboseLogging: true,
        
        // Create debug files
        createDebugFiles: true,
        
        // Skip token validation in dev mode
        skipTokenValidation: false
    }
};

// Validation function for configuration
Config.validate = function() {
    const errors = [];
    
    // Validate components array
    if (!Array.isArray(this.components)) {
        errors.push('Components must be an array');
    }
    
    // Validate each component
    this.components.forEach((component, index) => {
        if (!component.name) {
            errors.push(`Component ${index}: name is required`);
        }
        if (!component.figmaNodeId) {
            errors.push(`Component ${index}: figmaNodeId is required`);
        }
        if (!component.type) {
            errors.push(`Component ${index}: type is required`);
        }
        if (!component.safetyRules) {
            errors.push(`Component ${index}: safetyRules is required`);
        }
    });
    
    // Validate safety settings
    if (this.safety.maxComponentsPerRun < 1) {
        errors.push('maxComponentsPerRun must be at least 1');
    }
    
    // Validate output settings
    if (!this.output.componentsDir) {
        errors.push('componentsDir is required');
    }
    
    if (errors.length > 0) {
        throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
    
    return true;
};

// Get component by name
Config.getComponent = function(name) {
    return this.components.find(component => component.name === name);
};

// Get components by type
Config.getComponentsByType = function(type) {
    return this.components.filter(component => component.type === type);
};

// Check if component exists
Config.hasComponent = function(name) {
    return this.components.some(component => component.name === name);
};

// Add component (with validation)
Config.addComponent = function(component) {
    // Validate component
    if (!component.name || !component.figmaNodeId || !component.type) {
        throw new Error('Component must have name, figmaNodeId, and type');
    }
    
    // Check for duplicates
    if (this.hasComponent(component.name)) {
        throw new Error(`Component ${component.name} already exists`);
    }
    
    // Add default safety rules if not provided
    if (!component.safetyRules) {
        component.safetyRules = {
            requiredTokens: ['--surface-primary-default'],
            protectedFiles: ['design-system/css/design-system.css'],
            outputDirectory: `design-system/examples/${component.name.toLowerCase().replace(/\s+/g, '-')}`
        };
    }
    
    this.components.push(component);
    return component;
};

// Remove component
Config.removeComponent = function(name) {
    const index = this.components.findIndex(component => component.name === name);
    if (index === -1) {
        throw new Error(`Component ${name} not found`);
    }
    
    return this.components.splice(index, 1)[0];
};

module.exports = Config;
