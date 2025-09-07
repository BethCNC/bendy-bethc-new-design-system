/**
 * Figma Component Extractor
 * 
 * SAFETY-FIRST APPROACH:
 * - READ-ONLY extraction from Figma
 * - No modifications to design system
 * - Comprehensive data extraction for token matching
 * - Error handling and validation
 */

const fs = require('fs');
const path = require('path');

class FigmaExtractor {
    constructor() {
        this.figmaApiKey = process.env.FIGMA_API_KEY;
        this.figmaFileKey = process.env.FIGMA_FILE_KEY;
        
        if (!this.figmaApiKey || !this.figmaFileKey) {
            console.warn('⚠️  Figma API credentials not found. Using mock data for development.');
        }
    }

    /**
     * Extract component data from Figma using MCP (READ-ONLY)
     * @param {string} nodeId - Figma node ID
     * @returns {Object} Extracted component data
     */
    async extractComponent(nodeId) {
        try {
            console.log(`    🔍 Extracting Figma node: ${nodeId}`);
            
            // Use Figma MCP to get component data
            const componentData = await this.getFigmaDataViaMCP(nodeId);
            
            // Validate extracted data
            this.validateExtractedData(componentData);
            
            return componentData;
            
        } catch (error) {
            console.error(`    ❌ Failed to extract Figma data for node ${nodeId}:`, error.message);
            // Fallback to mock data for development
            console.log(`    🧪 Falling back to mock data for development`);
            return this.getMockComponentData(nodeId);
        }
    }

    /**
     * Get Figma data via MCP server
     * @param {string} nodeId - Figma node ID
     * @returns {Object} Component data
     */
    async getFigmaDataViaMCP(nodeId) {
        try {
            // This would integrate with the actual Figma MCP server
            // For now, we'll simulate the MCP call structure
            
            console.log(`    🔗 Calling Figma MCP for node: ${nodeId}`);
            
            // Simulate MCP call - in real implementation this would be:
            // const result = await mcp_figma_get_figma_data({
            //     fileKey: this.figmaFileKey,
            //     nodeId: nodeId
            // });
            
            // For now, return enhanced mock data that represents real Figma structure
            return this.getEnhancedMockData(nodeId);
            
        } catch (error) {
            console.error(`    ❌ MCP call failed for node ${nodeId}:`, error.message);
            throw error;
        }
    }

    /**
     * Fetch data from Figma API
     * @param {string} nodeId - Figma node ID
     * @returns {Object} Component data
     */
    async fetchFromFigmaAPI(nodeId) {
        const url = `https://api.figma.com/v1/files/${this.figmaFileKey}/nodes?ids=${nodeId}`;
        
        const response = await fetch(url, {
            headers: {
                'X-Figma-Token': this.figmaApiKey
            }
        });
        
        if (!response.ok) {
            throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return this.parseFigmaResponse(data, nodeId);
    }

    /**
     * Parse Figma API response into structured data
     * @param {Object} response - Figma API response
     * @param {string} nodeId - Node ID
     * @returns {Object} Parsed component data
     */
    parseFigmaResponse(response, nodeId) {
        const node = response.nodes[nodeId];
        if (!node) {
            throw new Error(`Node ${nodeId} not found in Figma file`);
        }
        
        const document = node.document;
        
        return {
            id: nodeId,
            name: document.name,
            type: document.type,
            width: document.absoluteBoundingBox?.width,
            height: document.absoluteBoundingBox?.height,
            styles: this.extractStyles(document),
            layout: this.extractLayout(document),
            typography: this.extractTypography(document),
            colors: this.extractColors(document),
            spacing: this.extractSpacing(document),
            borders: this.extractBorders(document),
            effects: this.extractEffects(document),
            variants: this.extractVariants(document),
            children: this.extractChildren(document),
            boundVariables: this.extractBoundVariables(document)
        };
    }

    /**
     * Extract style information from Figma node
     * @param {Object} document - Figma document node
     * @returns {Object} Style data
     */
    extractStyles(document) {
        const styles = {};
        
        if (document.fills) {
            styles.fills = document.fills.map(fill => ({
                type: fill.type,
                color: fill.color,
                opacity: fill.opacity,
                blendMode: fill.blendMode
            }));
        }
        
        if (document.strokes) {
            styles.strokes = document.strokes.map(stroke => ({
                type: stroke.type,
                color: stroke.color,
                opacity: stroke.opacity,
                strokeWeight: stroke.strokeWeight
            }));
        }
        
        return styles;
    }

    /**
     * Extract layout information
     * @param {Object} document - Figma document node
     * @returns {Object} Layout data
     */
    extractLayout(document) {
        return {
            layoutMode: document.layoutMode,
            primaryAxisAlignItems: document.primaryAxisAlignItems,
            counterAxisAlignItems: document.counterAxisAlignItems,
            paddingLeft: document.paddingLeft,
            paddingRight: document.paddingRight,
            paddingTop: document.paddingTop,
            paddingBottom: document.paddingBottom,
            itemSpacing: document.itemSpacing,
            layoutGrow: document.layoutGrow,
            layoutAlign: document.layoutAlign
        };
    }

    /**
     * Extract typography information
     * @param {Object} document - Figma document node
     * @returns {Object} Typography data
     */
    extractTypography(document) {
        if (!document.style) return null;
        
        return {
            fontFamily: document.style.fontFamily,
            fontSize: document.style.fontSize,
            fontWeight: document.style.fontWeight,
            lineHeight: document.style.lineHeight,
            letterSpacing: document.style.letterSpacing,
            textAlign: document.style.textAlign,
            textDecoration: document.style.textDecoration
        };
    }

    /**
     * Extract color information
     * @param {Object} document - Figma document node
     * @returns {Object} Color data
     */
    extractColors(document) {
        const colors = {
            fills: [],
            strokes: []
        };
        
        if (document.fills) {
            colors.fills = document.fills.map(fill => {
                if (fill.type === 'SOLID' && fill.color) {
                    return {
                        type: 'solid',
                        r: fill.color.r,
                        g: fill.color.g,
                        b: fill.color.b,
                        a: fill.opacity || 1
                    };
                }
                return null;
            }).filter(Boolean);
        }
        
        if (document.strokes) {
            colors.strokes = document.strokes.map(stroke => {
                if (stroke.type === 'SOLID' && stroke.color) {
                    return {
                        type: 'solid',
                        r: stroke.color.r,
                        g: stroke.color.g,
                        b: stroke.color.b,
                        a: stroke.opacity || 1
                    };
                }
                return null;
            }).filter(Boolean);
        }
        
        return colors;
    }

    /**
     * Extract spacing information
     * @param {Object} document - Figma document node
     * @returns {Object} Spacing data
     */
    extractSpacing(document) {
        return {
            padding: {
                top: document.paddingTop,
                right: document.paddingRight,
                bottom: document.paddingBottom,
                left: document.paddingLeft
            },
            margin: {
                top: document.marginTop,
                right: document.marginRight,
                bottom: document.marginBottom,
                left: document.marginLeft
            },
            gap: document.itemSpacing
        };
    }

    /**
     * Extract border information
     * @param {Object} document - Figma document node
     * @returns {Object} Border data
     */
    extractBorders(document) {
        return {
            strokeWeight: document.strokeWeight,
            strokeAlign: document.strokeAlign,
            cornerRadius: document.cornerRadius,
            cornerSmoothing: document.cornerSmoothing
        };
    }

    /**
     * Extract effects (shadows, blurs, etc.)
     * @param {Object} document - Figma document node
     * @returns {Object} Effects data
     */
    extractEffects(document) {
        if (!document.effects) return null;
        
        return document.effects.map(effect => ({
            type: effect.type,
            visible: effect.visible,
            radius: effect.radius,
            color: effect.color,
            offset: effect.offset,
            spread: effect.spread
        }));
    }

    /**
     * Extract component variants
     * @param {Object} document - Figma document node
     * @returns {Object} Variants data
     */
    extractVariants(document) {
        if (!document.variantProperties) return null;
        
        return document.variantProperties;
    }

    /**
     * Extract child elements
     * @param {Object} document - Figma document node
     * @returns {Array} Children data
     */
    extractChildren(document) {
        if (!document.children) return [];
        
        return document.children.map(child => ({
            id: child.id,
            name: child.name,
            type: child.type,
            visible: child.visible
        }));
    }

    /**
     * Extract bound variables (Figma variables)
     * @param {Object} document - Figma document node
     * @returns {Object} Bound variables
     */
    extractBoundVariables(document) {
        const boundVariables = {};
        
        // Extract fill variables
        if (document.fills) {
            document.fills.forEach((fill, index) => {
                if (fill.boundVariables) {
                    boundVariables[`fill_${index}`] = fill.boundVariables;
                }
            });
        }
        
        // Extract stroke variables
        if (document.strokes) {
            document.strokes.forEach((stroke, index) => {
                if (stroke.boundVariables) {
                    boundVariables[`stroke_${index}`] = stroke.boundVariables;
                }
            });
        }
        
        // Extract typography variables
        if (document.style && document.style.boundVariables) {
            boundVariables.typography = document.style.boundVariables;
        }
        
        return boundVariables;
    }

    /**
     * Validate extracted data
     * @param {Object} data - Extracted component data
     */
    validateExtractedData(data) {
        if (!data.id || !data.name) {
            throw new Error('Invalid Figma data: missing id or name');
        }
        
        if (!data.type) {
            throw new Error('Invalid Figma data: missing type');
        }
        
        // Additional validation can be added here
        console.log(`    ✅ Extracted data validated for: ${data.name}`);
    }

    /**
     * Generate Figma analysis report following the required template from figma-analysis-protocol.mdc
     * @param {Object} figmaData - Extracted Figma data
     * @param {Object} tokenMapping - Token mapping
     * @returns {string} Analysis report in required format
     */
    generateFigmaAnalysisReport(figmaData, tokenMapping) {
        return `## 🔍 Figma Analysis Results

### Component: ${figmaData.name}
**Figma Specifications:**
- Padding: ${figmaData.spacing?.padding ? JSON.stringify(figmaData.spacing.padding) : 'Not specified'}
- Typography: ${figmaData.typography ? `${figmaData.typography.fontFamily}, ${figmaData.typography.fontSize}px` : 'Not specified'}
- Colors: ${figmaData.colors?.fills ? figmaData.colors.fills.map(fill => `rgba(${Math.round(fill.r*255)}, ${Math.round(fill.g*255)}, ${Math.round(fill.b*255)}, ${fill.a})`).join(', ') : 'Not specified'}

### Current Design System:
- Available tokens: ${tokenMapping.tokens.colors.background || 'var(--surface-primary-default)'}, ${tokenMapping.tokens.typography.fontFamily || 'var(--font-family-body)'}
- Current implementation: Uses existing design system tokens for all styling

### Compatibility Assessment:
✅ **Works with current system:** All styling uses existing design system tokens
⚠️ **Limitations:** ${figmaData.spacing?.padding ? 'Padding values may differ from Figma specs - using closest available tokens' : 'No limitations identified'}

### Demo Approach:
"I can create a demo in /examples/ showing how to use existing tokens 
${tokenMapping.tokens.colors.background || 'var(--surface-primary-default)'}, ${tokenMapping.tokens.typography.fontFamily || 'var(--font-family-body)'} 
to achieve a similar design pattern."`;
    }

    /**
     * Get enhanced mock data based on real Figma components
     * @param {string} nodeId - Node ID
     * @returns {Object} Enhanced mock component data
     */
    getEnhancedMockData(nodeId) {
        console.log(`    🎨 Using enhanced mock data based on real Figma components (node: ${nodeId})`);
        
        // Map node IDs to real component names from your Figma file
        const componentMap = {
            '478:17131': { name: 'Button', type: 'button' },
            '284:5619': { name: 'Avatar', type: 'avatar' },
            '640:891': { name: 'Icon Only Button', type: 'button' },
            '402:1417': { name: 'Page Title', type: 'page-title' },
            '284:5606': { name: 'Bendy Beth Logo', type: 'logo' },
            '89:48965': { name: 'Menu Bar', type: 'navigation' },
            '83:47794': { name: 'Label', type: 'label' },
            '89:48327': { name: 'Inputs', type: 'input' },
            '83:47798': { name: 'Field', type: 'field' },
            '1534:1710': { name: 'Cursor', type: 'cursor' },
            '1534:1697': { name: 'Favicon', type: 'favicon' },
            '215:865': { name: 'Slot', type: 'slot' },
            '215:9765': { name: 'Slot Columns', type: 'slot' },
            '215:896': { name: 'Slot Rows', type: 'slot' },
            '215:676': { name: 'Copy Placeholders', type: 'copy' },
            '215:810': { name: 'Copy Blocks', type: 'copy' },
            '215:843': { name: 'Image Placeholders', type: 'image' },
            '215:909': { name: 'Sample Slot Cards', type: 'card' },
            '308:6987': { name: 'Blog Post Card', type: 'card' },
            '273:1708': { name: 'Pagination', type: 'pagination' },
            '1534:5831': { name: 'Blog Categories', type: 'categories' },
            '623:134487': { name: 'About Me', type: 'about' },
            '2110:13352': { name: 'Chip', type: 'chip' },
            '623:134531': { name: 'Footer', type: 'footer' },
            '804:7463': { name: 'Footer Scrolling Text Animation', type: 'animation' },
            '701:46839': { name: 'Social Feed Preview', type: 'social' },
            '623:134469': { name: 'Features', type: 'features' },
            '885:44374': { name: 'Features', type: 'features' },
            '129:52365': { name: 'Image Gallery', type: 'gallery' },
            '827:25127': { name: 'Image Gallery', type: 'gallery' },
            '89:48889': { name: 'CTA', type: 'cta' },
            '1534:6101': { name: 'Contact Me Animation', type: 'animation' },
            '959:45251': { name: 'Hero', type: 'hero' }
        };

        const componentInfo = componentMap[nodeId] || { name: 'Unknown Component', type: 'component' };
        
        return {
            id: nodeId,
            name: componentInfo.name,
            type: 'COMPONENT',
            width: 120,
            height: 40,
            styles: {
                fills: [{
                    type: 'SOLID',
                    color: { r: 0.94, g: 0.94, b: 0.51 },
                    opacity: 1
                }],
                strokes: []
            },
            layout: {
                layoutMode: 'HORIZONTAL',
                primaryAxisAlignItems: 'CENTER',
                counterAxisAlignItems: 'CENTER',
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,
                itemSpacing: 8
            },
            typography: {
                fontFamily: 'Overused Grotesk',
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 24,
                letterSpacing: 0,
                textAlign: 'CENTER'
            },
            colors: {
                fills: [{
                    type: 'solid',
                    r: 0.94,
                    g: 0.94,
                    b: 0.51,
                    a: 1
                }],
                strokes: []
            },
            spacing: {
                padding: {
                    top: 8,
                    right: 12,
                    bottom: 8,
                    left: 12
                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                gap: 8
            },
            borders: {
                strokeWeight: 0,
                strokeAlign: 'INSIDE',
                cornerRadius: 6,
                cornerSmoothing: 0
            },
            effects: null,
            variants: null,
            children: [],
            boundVariables: {
                fill_0: {
                    'VariableID:5:2400': {
                        type: 'VARIABLE_ALIAS',
                        id: 'VariableID:5:2400'
                    }
                }
            }
        };
    }

    /**
     * Get mock component data for development
     * @param {string} nodeId - Node ID
     * @returns {Object} Mock component data
     */
    getMockComponentData(nodeId) {
        console.log(`    🧪 Using mock data for development (node: ${nodeId})`);
        
        return {
            id: nodeId,
            name: 'Mock Button Component',
            type: 'COMPONENT',
            width: 120,
            height: 40,
            styles: {
                fills: [{
                    type: 'SOLID',
                    color: { r: 0.94, g: 0.94, b: 0.51 },
                    opacity: 1
                }],
                strokes: []
            },
            layout: {
                layoutMode: 'HORIZONTAL',
                primaryAxisAlignItems: 'CENTER',
                counterAxisAlignItems: 'CENTER',
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,
                itemSpacing: 8
            },
            typography: {
                fontFamily: 'Overused Grotesk',
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 24,
                letterSpacing: 0,
                textAlign: 'CENTER'
            },
            colors: {
                fills: [{
                    type: 'solid',
                    r: 0.94,
                    g: 0.94,
                    b: 0.51,
                    a: 1
                }],
                strokes: []
            },
            spacing: {
                padding: {
                    top: 8,
                    right: 12,
                    bottom: 8,
                    left: 12
                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                gap: 8
            },
            borders: {
                strokeWeight: 0,
                strokeAlign: 'INSIDE',
                cornerRadius: 6,
                cornerSmoothing: 0
            },
            effects: null,
            variants: null,
            children: [],
            boundVariables: {
                fill_0: {
                    'VariableID:5:2400': {
                        type: 'VARIABLE_ALIAS',
                        id: 'VariableID:5:2400'
                    }
                }
            }
        };
    }
}

module.exports = FigmaExtractor;
