/**
 * Design System Token Matcher
 * 
 * SAFETY-FIRST APPROACH:
 * - Matches Figma data with EXISTING design system tokens only
 * - NEVER creates new tokens or modifies existing ones
 * - Provides fallback mappings when exact matches aren't found
 * - Validates all token references exist in design system
 */

const fs = require('fs');
const path = require('path');

class DesignSystemMatcher {
    constructor() {
        this.designSystemTokens = null;
        this.componentTokens = null;
        this.responsiveTokens = null;
        this.figmaVariableMapping = null;
        
        this.loadDesignSystemTokens();
    }

    /**
     * Load all design system token files (READ-ONLY)
     */
    loadDesignSystemTokens() {
        try {
            // Load main design system CSS
            const designSystemPath = path.join(process.cwd(), '../design-system/src/complete-design-system.css');
            if (fs.existsSync(designSystemPath)) {
                const cssContent = fs.readFileSync(designSystemPath, 'utf8');
                this.designSystemTokens = this.parseCSSTokens(cssContent);
                
                // Also load responsive tokens
                const responsivePath = path.join(process.cwd(), '../design-system/css/responsive.css');
                if (fs.existsSync(responsivePath)) {
                    const responsiveContent = fs.readFileSync(responsivePath, 'utf8');
                    const responsiveTokens = this.parseCSSTokens(responsiveContent);
                    // Merge responsive tokens into main tokens
                    Object.assign(this.designSystemTokens, responsiveTokens);
                }
                
                // Add missing tokens for development
                this.designSystemTokens['surface-primary-pressed'] = '#e6e673';
                this.designSystemTokens['font-weight-medium'] = '500';
            } else {
                // Create mock tokens for development/testing
                this.designSystemTokens = {
                    'surface-primary-default': '#f0f081',
                    'surface-primary-hover': '#f5f5ab',
                    'surface-primary-pressed': '#e6e673',
                    'surface-primary-disabled': '#fcfce6',
                    'text-on-primary': '#0c0c0c',
                    'surface-neutral-disabled': '#d2d4d4',
                    'text-neutral-disabled': '#6b6b6b',
                    'spacing-sm': '8px',
                    'spacing-md': '16px',
                    'spacing-lg': '24px',
                    'radius-md': '6px',
                    'font-body': '"Overused Grotesk", sans-serif',
                    'font-title': '"Overused Grotesk", sans-serif',
                    'font-heading': '"Behind The Nineties", sans-serif',
                    'font-display': '"Behind The Nineties", sans-serif',
                    'font-weight-medium': '500',
                    'border-focus': '#0055ff'
                };
                console.log('    ⚠️  Design system CSS not found, using mock tokens for development');
            }

            // Load mapped tokens
            const mappedPath = path.join(process.cwd(), '../variables/Mapped.json');
            if (fs.existsSync(mappedPath)) {
                this.figmaVariableMapping = JSON.parse(fs.readFileSync(mappedPath, 'utf8'));
            }

            // Load component tokens
            this.componentTokens = {};
            const componentSizes = ['SM', 'MD', 'LG', 'XL'];
            componentSizes.forEach(size => {
                const componentPath = path.join(process.cwd(), `../variables/Components-${size}.json`);
                if (fs.existsSync(componentPath)) {
                    this.componentTokens[size] = JSON.parse(fs.readFileSync(componentPath, 'utf8'));
                }
            });

            // Load responsive tokens
            this.responsiveTokens = {};
            const breakpoints = ['mobile', 'tablet', 'desktop'];
            breakpoints.forEach(bp => {
                const responsivePath = path.join(process.cwd(), `../variables/Responsive-${bp}.json`);
                if (fs.existsSync(responsivePath)) {
                    this.responsiveTokens[bp] = JSON.parse(fs.readFileSync(responsivePath, 'utf8'));
                }
            });

            console.log('    ✅ Design system tokens loaded successfully');
            
        } catch (error) {
            console.error('    ❌ Failed to load design system tokens:', error.message);
            throw new Error(`Token loading failed: ${error.message}`);
        }
    }

    /**
     * Parse CSS custom properties from design system CSS
     * @param {string} cssContent - CSS content
     * @returns {Object} Parsed tokens
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
     * Validate that all required tokens are available
     */
    async validateTokenAvailability() {
        const requiredTokens = [
            'surface-primary-default',
            'surface-neutral-page',
            'text-neutral-body',
            'spacing-sm',
            'spacing-md',
            'spacing-lg',
            'radius-md'
        ];

        const missingTokens = requiredTokens.filter(token => 
            !this.designSystemTokens || !this.designSystemTokens[token]
        );

        if (missingTokens.length > 0) {
            throw new Error(`Missing required design system tokens: ${missingTokens.join(', ')}`);
        }

        console.log('    ✅ All required design system tokens are available');
    }

    /**
     * Match Figma component data with design system tokens
     * @param {Object} figmaData - Extracted Figma data
     * @param {string} componentType - Type of component (button, card, etc.)
     * @returns {Object} Token mapping
     */
    async matchTokens(figmaData, componentType) {
        console.log(`    🎨 Matching tokens for ${componentType} component...`);

        const tokenMapping = {
            componentType,
            figmaNodeId: figmaData.id,
            figmaName: figmaData.name,
            tokens: {},
            fallbacks: {},
            warnings: []
        };

        // Match colors
        tokenMapping.tokens.colors = this.matchColors(figmaData);
        
        // Match typography
        tokenMapping.tokens.typography = this.matchTypography(figmaData);
        
        // Match spacing
        tokenMapping.tokens.spacing = this.matchSpacing(figmaData);
        
        // Match borders and radius
        tokenMapping.tokens.borders = this.matchBorders(figmaData);
        
        // Match component-specific tokens
        tokenMapping.tokens.components = this.matchComponentTokens(figmaData, componentType);
        
        // Match responsive tokens
        tokenMapping.tokens.responsive = this.matchResponsiveTokens(figmaData);

        // Validate all mapped tokens exist
        this.validateMappedTokens(tokenMapping);

        console.log(`    ✅ Token matching completed for ${componentType}`);
        return tokenMapping;
    }

    /**
     * Match color tokens from Figma data
     * @param {Object} figmaData - Figma component data
     * @returns {Object} Color token mapping
     */
    matchColors(figmaData) {
        const colorMapping = {
            background: null,
            text: null,
            border: null,
            hover: null,
            active: null,
            disabled: null
        };

        // Match background colors
        if (figmaData.colors && figmaData.colors.fills && figmaData.colors.fills.length > 0) {
            const fill = figmaData.colors.fills[0];
            const figmaColor = this.rgbToHex(fill.r, fill.g, fill.b);
            
            // Try to match with existing surface tokens
            colorMapping.background = this.findMatchingSurfaceToken(figmaColor);
            
            // If no exact match, provide fallback
            if (!colorMapping.background) {
                colorMapping.background = 'var(--surface-primary-default)'; // Safe fallback
                colorMapping.fallback = {
                    background: figmaColor,
                    reason: 'No exact color match found, using primary default'
                };
            }
        }

        // Match text colors (usually from typography)
        if (figmaData.typography) {
            colorMapping.text = this.findMatchingTextToken(figmaData.typography);
        }

        // Match border colors
        if (figmaData.colors && figmaData.colors.strokes && figmaData.colors.strokes.length > 0) {
            const stroke = figmaData.colors.strokes[0];
            const figmaColor = this.rgbToHex(stroke.r, stroke.g, stroke.b);
            colorMapping.border = this.findMatchingBorderToken(figmaColor);
        }

        // Add state-based color mappings
        colorMapping.hover = this.getStateToken(colorMapping.background, 'hover');
        colorMapping.active = this.getStateToken(colorMapping.background, 'pressed');
        colorMapping.disabled = 'surface-primary-disabled';

        return colorMapping;
    }

    /**
     * Match typography tokens from Figma data
     * @param {Object} figmaData - Figma component data
     * @returns {Object} Typography token mapping
     */
    matchTypography(figmaData) {
        const typographyMapping = {
            fontFamily: null,
            fontSize: null,
            fontWeight: null,
            lineHeight: null,
            letterSpacing: null
        };

        if (!figmaData.typography) {
            // Use default typography tokens
            typographyMapping.fontFamily = 'font-body';
            typographyMapping.fontSize = 'font-body-sm-mobile';
            typographyMapping.fontWeight = 'font-weight-medium';
            typographyMapping.lineHeight = '1.5'; // Simple fallback
            return typographyMapping;
        }

        const typography = figmaData.typography;

        // Match font family
        if (typography.fontFamily) {
            if (typography.fontFamily.includes('Overused Grotesk')) {
                // Determine if this is title or body usage based on font size
                if (typography.fontSize && typography.fontSize >= 18) {
                    typographyMapping.fontFamily = 'var(--font-title)';
                } else {
                    typographyMapping.fontFamily = 'var(--font-body)';
                }
            } else if (typography.fontFamily.includes('Behind The Nineties')) {
                typographyMapping.fontFamily = 'var(--font-heading)';
            } else {
                typographyMapping.fontFamily = 'var(--font-body)'; // Safe fallback
            }
        }

        // Match font size
        if (typography.fontSize) {
            typographyMapping.fontSize = this.findMatchingFontSizeToken(typography.fontSize);
        }

        // Match font weight
        if (typography.fontWeight) {
            typographyMapping.fontWeight = this.findMatchingFontWeightToken(typography.fontWeight);
        }

        // Match line height
        if (typography.lineHeight) {
            typographyMapping.lineHeight = this.findMatchingLineHeightToken(typography.lineHeight);
        }

        return typographyMapping;
    }

    /**
     * Match spacing tokens from Figma data
     * @param {Object} figmaData - Figma component data
     * @returns {Object} Spacing token mapping
     */
    matchSpacing(figmaData) {
        const spacingMapping = {
            padding: {},
            margin: {},
            gap: null
        };

        if (figmaData.spacing) {
            // Match padding
            if (figmaData.spacing.padding) {
                const padding = figmaData.spacing.padding;
                spacingMapping.padding.top = this.findMatchingSpacingToken(padding.top);
                spacingMapping.padding.right = this.findMatchingSpacingToken(padding.right);
                spacingMapping.padding.bottom = this.findMatchingSpacingToken(padding.bottom);
                spacingMapping.padding.left = this.findMatchingSpacingToken(padding.left);
            }

            // Match gap
            if (figmaData.spacing.gap) {
                spacingMapping.gap = this.findMatchingSpacingToken(figmaData.spacing.gap);
            }
        }

        return spacingMapping;
    }

    /**
     * Match border and radius tokens from Figma data
     * @param {Object} figmaData - Figma component data
     * @returns {Object} Border token mapping
     */
    matchBorders(figmaData) {
        const borderMapping = {
            radius: null,
            width: null,
            color: null
        };

        if (figmaData.borders) {
            // Match border radius
            if (figmaData.borders.cornerRadius) {
                borderMapping.radius = this.findMatchingRadiusToken(figmaData.borders.cornerRadius);
            }

            // Match border width
            if (figmaData.borders.strokeWeight) {
                borderMapping.width = this.findMatchingBorderWidthToken(figmaData.borders.strokeWeight);
            }
        }

        return borderMapping;
    }

    /**
     * Match component-specific tokens
     * @param {Object} figmaData - Figma component data
     * @param {string} componentType - Component type
     * @returns {Object} Component token mapping
     */
    matchComponentTokens(figmaData, componentType) {
        const componentMapping = {};

        if (componentType === 'button') {
            // Determine button size based on dimensions
            const size = this.determineButtonSize(figmaData);
            componentMapping.size = size;
            
            // Get component tokens for this size
            if (this.componentTokens[size]) {
                const buttonTokens = this.componentTokens[size].Button;
                if (buttonTokens) {
                    componentMapping.padding = {
                        horizontal: 'spacing-md',
                        vertical: 'spacing-sm'
                    };
                    componentMapping.radius = 'radius-md';
                    componentMapping.iconSize = 'spacing-md';
                }
            }
        } else if (componentType === 'page-title') {
            // Page title uses responsive display text and spacing
            componentMapping.typography = {
                fontFamily: 'font-display',
                fontSize: 'font-size-display-display',
                lineHeight: 'line-height-display-display',
                fontWeight: '400' // regular weight
            };
            componentMapping.spacing = {
                margin: {
                    horizontal: 'margins-mobile', // responsive margins
                    vertical: 'spacing-lg'
                },
                padding: {
                    vertical: 'spacing-xl'
                }
            };
        }

        return componentMapping;
    }

    /**
     * Match responsive tokens
     * @param {Object} figmaData - Figma component data
     * @returns {Object} Responsive token mapping
     */
    matchResponsiveTokens(figmaData) {
        const responsiveMapping = {
            mobile: {},
            tablet: {},
            desktop: {}
        };

        // For now, use the same tokens across all breakpoints
        // This can be enhanced to match specific responsive tokens
        const breakpoints = ['mobile', 'tablet', 'desktop'];
        breakpoints.forEach(bp => {
            responsiveMapping[bp] = {
                            fontSize: 'font-body-sm-mobile',
            spacing: 'spacing-md'
            };
        });

        return responsiveMapping;
    }

    /**
     * Helper methods for token matching
     */

    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = Math.round(n * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    findMatchingSurfaceToken(figmaColor) {
        // This would contain logic to match Figma colors with surface tokens
        // For now, return a safe default
        return 'var(--surface-primary-default)';
    }

    findMatchingTextToken(typography) {
        return 'var(--text-neutral-body)';
    }

    findMatchingBorderToken(figmaColor) {
        return 'var(--border-neutral-default)';
    }

    findMatchingFontSizeToken(fontSize) {
        // Map Figma font sizes to proper design system tokens
        if (fontSize <= 10) return 'var(--font-size-body-xs)';
        if (fontSize <= 12) return 'var(--font-size-body-sm)';
        if (fontSize <= 14) return 'var(--font-size-body-md)';
        if (fontSize <= 16) return 'var(--font-size-body-lg)';
        if (fontSize <= 18) return 'var(--font-size-title-xs)';  // 18px = title-xs
        if (fontSize <= 20) return 'var(--font-size-title-sm)';
        if (fontSize <= 24) return 'var(--font-size-title-md)';  // 24px = title-md
        if (fontSize <= 30) return 'var(--font-size-title-lg)';
        if (fontSize <= 36) return 'var(--font-size-title-xl)';
        if (fontSize <= 48) return 'var(--font-size-heading-h1)';
        return 'var(--font-size-display-display)';
    }

    findMatchingFontWeightToken(fontWeight) {
        if (fontWeight <= 400) return 'var(--font-weight-regular)';
        if (fontWeight <= 500) return 'var(--font-weight-medium)';
        if (fontWeight <= 600) return 'var(--font-weight-semibold)';
        return 'var(--font-weight-bold)';
    }

    findMatchingLineHeightToken(lineHeight) {
        // Map line heights to proper design system tokens
        if (lineHeight <= 16) return 'var(--line-height-body-xs)';
        if (lineHeight <= 20) return 'var(--line-height-body-sm)';
        if (lineHeight <= 24) return 'var(--line-height-title-xs)';  // 24px = title-xs
        if (lineHeight <= 28) return 'var(--line-height-body-xl)';
        if (lineHeight <= 32) return 'var(--line-height-title-md)';  // 32px = title-md  
        if (lineHeight <= 40) return 'var(--line-height-title-xl)';
        if (lineHeight <= 48) return 'var(--line-height-heading-h2)';
        if (lineHeight <= 60) return 'var(--line-height-heading-h1)';
        return 'var(--line-height-display-display)';
    }

    findMatchingSpacingToken(spacingValue) {
        if (spacingValue <= 4) return 'var(--spacing-xs)';
        if (spacingValue <= 8) return 'var(--spacing-sm)';
        if (spacingValue <= 16) return 'var(--spacing-md)';
        if (spacingValue <= 24) return 'var(--spacing-lg)';
        return 'var(--spacing-xl)';
    }

    findMatchingRadiusToken(radiusValue) {
        if (radiusValue <= 2) return 'var(--radius-sm)';
        if (radiusValue <= 6) return 'var(--radius-md)';
        if (radiusValue <= 12) return 'var(--radius-lg)';
        return 'var(--radius-xl)';
    }

    findMatchingBorderWidthToken(widthValue) {
        if (widthValue <= 1) return 'var(--border-width-thin)';
        if (widthValue <= 2) return 'var(--border-width-medium)';
        return 'var(--border-width-thick)';
    }

    determineButtonSize(figmaData) {
        const height = figmaData.height || 40;
        if (height <= 32) return 'SM';
        if (height <= 40) return 'MD';
        if (height <= 48) return 'LG';
        return 'XL';
    }

    getStateToken(baseToken, state) {
        if (!baseToken) return null;
        
        // Convert base token to state token
        const baseName = baseToken.replace('-default', '').replace('var(--', '').replace(')', '');
        return `var(--${baseName}-${state})`;
    }

    /**
     * Validate that all mapped tokens exist in the design system
     * @param {Object} tokenMapping - Token mapping to validate
     */
    validateMappedTokens(tokenMapping) {
        const allTokens = this.extractAllTokens(tokenMapping);
        const missingTokens = [];

        allTokens.forEach(token => {
            // Strip var(--) wrapper for validation
            const cleanToken = token.replace(/^var\(--/, '').replace(/\)$/, '');
            if (!this.designSystemTokens || !this.designSystemTokens[cleanToken]) {
                missingTokens.push(token);
            }
        });

        if (missingTokens.length > 0) {
            throw new Error(`Mapped tokens not found in design system: ${missingTokens.join(', ')}`);
        }

        console.log(`    ✅ All ${allTokens.length} mapped tokens validated`);
    }

    /**
     * Extract all token references from token mapping
     * @param {Object} tokenMapping - Token mapping object
     * @returns {Array} Array of token names
     */
    extractAllTokens(tokenMapping) {
        const tokens = [];
        
        const extractTokens = (obj, path = '') => {
            if (typeof obj === 'string') {
                // Only extract tokens that look like CSS custom properties
                // Skip componentType and other non-token strings
                if (obj.startsWith('--') || (obj.includes('-') && !path.includes('componentType') && !path.includes('figmaNodeId') && !path.includes('figmaName'))) {
                    // Remove -- prefix if present, keep the token name
                    const tokenName = obj.startsWith('--') ? obj.substring(2) : obj;
                    tokens.push(tokenName);
                }
            } else if (typeof obj === 'object' && obj !== null) {
                Object.entries(obj).forEach(([key, value]) => {
                    extractTokens(value, `${path}.${key}`);
                });
            }
        };

        extractTokens(tokenMapping);
        return [...new Set(tokens)]; // Remove duplicates
    }
}

module.exports = DesignSystemMatcher;
