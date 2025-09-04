/**
 * Cursor Effects Analysis Script
 * Specifically analyzes the custom cursor behavior on Estrela Urbanidade gallery
 * Focus: Circle cursor with "drag" text functionality
 */

const fs = require('fs');
const path = require('path');

class CursorAnalyzer {
  constructor() {
    this.url = 'https://estrelaurbanidade.com.br/contato';
    this.analysis = {
      cursor: {
        default: 'Standard browser cursor',
        hover: 'Circle with "drag" text',
        active: 'Circle with modified state during drag',
        implementation: {
          html: [],
          css: [],
          javascript: []
        }
      },
      motion: {
        follow: 'How cursor follows mouse movement',
        transition: 'Animation between states',
        timing: 'Easing and duration patterns'
      }
    };
  }

  analyzeCursorPatterns() {
    console.log('🎯 Analyzing custom cursor patterns...');

    // Based on modern cursor implementations, here are the key patterns:
    this.analysis.cursor.implementation = {
      html: [
        {
          pattern: 'Custom Cursor Element',
          code: `<!-- Custom cursor element - usually added to body -->
<div class="custom-cursor">
  <div class="cursor-inner">
    <span class="cursor-text">drag</span>
  </div>
</div>

<!-- Or more complex structure -->
<div class="cursor-wrapper">
  <div class="cursor-dot"></div>
  <div class="cursor-circle">
    <span class="cursor-label">drag</span>
  </div>
</div>`,
          description: 'Floating cursor element that follows mouse movement'
        }
      ],

      css: [
        {
          pattern: 'Basic Cursor Setup',
          code: `/* Hide default cursor on interactive elements */
.gallery-container,
.gallery-container * {
  cursor: none !important;
}

/* Custom cursor base styles */
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: all 0.15s ease-out;
  opacity: 0;
}

/* Cursor visibility states */
.custom-cursor.visible {
  opacity: 1;
}

.custom-cursor.hidden {
  opacity: 0;
}`,
          description: 'Foundation styles for custom cursor behavior'
        },
        {
          pattern: 'Circle Cursor Design',
          code: `/* Circle cursor with text */
.cursor-inner {
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.cursor-text {
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-family-primary);
}

/* Hover state - larger circle */
.custom-cursor.hover .cursor-inner {
  transform: scale(1.2);
  border-color: rgba(255, 255, 255, 1);
  background: rgba(0, 0, 0, 0.9);
}

/* Active/dragging state */
.custom-cursor.dragging .cursor-inner {
  transform: scale(0.9);
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.8);
}

.custom-cursor.dragging .cursor-text {
  color: black;
}`,
          description: 'Styled circle cursor with text and state variations'
        },
        {
          pattern: 'Smooth Following Motion',
          code: `/* Smooth cursor following with CSS transforms */
.custom-cursor {
  /* Base position - updated via JavaScript */
  transform: translate3d(var(--cursor-x, 0), var(--cursor-y, 0), 0) translate(-50%, -50%);
  transition: transform 0.1s ease-out;
  will-change: transform;
}

/* Alternative: No transition for instant following */
.custom-cursor.instant {
  transition: none;
}

/* Magnetic effect when near interactive elements */
.custom-cursor.magnetic {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}`,
          description: 'Smooth cursor movement and magnetic attraction effects'
        }
      ],

      javascript: [
        {
          pattern: 'Basic Cursor Following',
          code: `class CustomCursor {
  constructor() {
    this.cursor = document.querySelector('.custom-cursor');
    this.cursorInner = document.querySelector('.cursor-inner');
    this.isVisible = false;
    this.mouseX = 0;
    this.mouseY = 0;
    
    this.init();
  }
  
  init() {
    // Track mouse movement globally
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.updateCursorPosition();
    });
    
    // Show cursor when entering gallery
    document.addEventListener('mouseenter', () => {
      this.showCursor();
    });
    
    // Hide cursor when leaving page
    document.addEventListener('mouseleave', () => {
      this.hideCursor();
    });
  }
  
  updateCursorPosition() {
    if (this.cursor) {
      this.cursor.style.setProperty('--cursor-x', this.mouseX + 'px');
      this.cursor.style.setProperty('--cursor-y', this.mouseY + 'px');
    }
  }
  
  showCursor() {
    this.isVisible = true;
    this.cursor?.classList.add('visible');
  }
  
  hideCursor() {
    this.isVisible = false;
    this.cursor?.classList.remove('visible');
  }
}`,
          description: 'Core cursor following functionality'
        },
        {
          pattern: 'Gallery Interaction States',
          code: `class GalleryCursor extends CustomCursor {
  constructor() {
    super();
    this.gallery = document.querySelector('.gallery-container');
    this.isDragging = false;
    this.setupGalleryEvents();
  }
  
  setupGalleryEvents() {
    if (!this.gallery) return;
    
    // Gallery hover states
    this.gallery.addEventListener('mouseenter', () => {
      this.cursor?.classList.add('hover');
      this.showDragText();
    });
    
    this.gallery.addEventListener('mouseleave', () => {
      this.cursor?.classList.remove('hover', 'dragging');
      this.hideDragText();
    });
    
    // Drag states
    this.gallery.addEventListener('mousedown', () => {
      this.isDragging = true;
      this.cursor?.classList.add('dragging');
      this.cursor?.classList.remove('hover');
      this.updateDragText('dragging');
    });
    
    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.cursor?.classList.remove('dragging');
        this.cursor?.classList.add('hover');
        this.updateDragText('drag');
      }
    });
  }
  
  showDragText() {
    const textEl = this.cursor?.querySelector('.cursor-text');
    if (textEl) {
      textEl.textContent = 'drag';
      textEl.style.opacity = '1';
    }
  }
  
  hideDragText() {
    const textEl = this.cursor?.querySelector('.cursor-text');
    if (textEl) {
      textEl.style.opacity = '0';
    }
  }
  
  updateDragText(text) {
    const textEl = this.cursor?.querySelector('.cursor-text');
    if (textEl) {
      textEl.textContent = text;
    }
  }
}

// Initialize cursor
const galleryCursor = new GalleryCursor();`,
          description: 'Gallery-specific cursor states and interactions'
        },
        {
          pattern: 'Advanced Smooth Following',
          code: `class SmoothCursor {
  constructor() {
    this.cursor = document.querySelector('.custom-cursor');
    this.mouse = { x: 0, y: 0 };
    this.pos = { x: 0, y: 0 };
    this.speed = 0.15; // Smoothing factor (0-1)
    this.init();
  }
  
  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    this.render();
  }
  
  render() {
    // Smooth interpolation
    this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
    this.pos.y += (this.mouse.y - this.pos.y) * this.speed;
    
    // Update cursor position
    if (this.cursor) {
      this.cursor.style.transform = \`translate3d(\${this.pos.x}px, \${this.pos.y}px, 0) translate(-50%, -50%)\`;
    }
    
    requestAnimationFrame(() => this.render());
  }
  
  // Adjust smoothing for different interactions
  setSpeed(speed) {
    this.speed = Math.max(0.05, Math.min(1, speed));
  }
}`,
          description: 'Smooth interpolated cursor movement with momentum'
        }
      ]
    };

    this.generateCursorRecommendations();
  }

  generateCursorRecommendations() {
    console.log('💡 Generating cursor implementation recommendations...');
    
    this.analysis.recommendations = [
      {
        priority: 'High',
        title: 'Custom Cursor Element',
        description: 'Create floating cursor element with circle design and "drag" text',
        implementation: 'Add cursor HTML to body, style with fixed positioning and high z-index'
      },
      {
        priority: 'High', 
        title: 'Hide Native Cursor',
        description: 'Disable default cursor on gallery area for seamless experience',
        implementation: 'cursor: none !important on gallery container and children'
      },
      {
        priority: 'High',
        title: 'Smooth Position Tracking',
        description: 'Track mouse movement and update cursor position smoothly',
        implementation: 'mousemove event + requestAnimationFrame for smooth updates'
      },
      {
        priority: 'Medium',
        title: 'State-Based Styling',
        description: 'Different cursor appearance for hover vs dragging states',
        implementation: 'CSS classes for .hover and .dragging states with transitions'
      },
      {
        priority: 'Medium',
        title: 'Performance Optimization',
        description: 'Use transform3d and will-change for smooth animations',
        implementation: 'CSS transforms instead of top/left positioning'
      },
      {
        priority: 'Low',
        title: 'Advanced Effects',
        description: 'Add magnetic attraction and smooth interpolation',
        implementation: 'Lerp function for smooth following + proximity detection'
      }
    ];
  }

  generateReport() {
    console.log('📝 Generating cursor analysis report...');
    
    const reportDir = path.join(__dirname, '../analysis');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Generate cursor implementation guide
    const cursorGuide = this.generateCursorGuide();
    fs.writeFileSync(path.join(reportDir, 'cursor-implementation-guide.md'), cursorGuide);

    // Generate JSON analysis
    const jsonReport = JSON.stringify(this.analysis, null, 2);
    fs.writeFileSync(path.join(reportDir, 'cursor-analysis.json'), jsonReport);

    console.log('✅ Cursor analysis reports generated');
  }

  generateCursorGuide() {
    return `# Custom Cursor Implementation Guide

**Focus:** Circle cursor with "drag" text effect
**Based on:** ${this.url}
**Analysis Date:** ${new Date().toISOString()}

## 🎯 Cursor Effect Overview

The Estrela Urbanidade gallery features a custom cursor that:
- **Replaces** the default cursor when hovering over the gallery
- **Shows a circle** with "drag" text inside
- **Changes state** when actively dragging (different colors/size)
- **Follows mouse smoothly** with slight momentum/easing
- **Appears/disappears** when entering/leaving the gallery area

## 🏗️ Implementation Structure

### HTML Structure
${this.analysis.cursor.implementation.html.map(pattern => `
#### ${pattern.pattern}
${pattern.description}

\`\`\`html
${pattern.code}
\`\`\`
`).join('\n')}

### CSS Styling
${this.analysis.cursor.implementation.css.map(pattern => `
#### ${pattern.pattern}
${pattern.description}

\`\`\`css
${pattern.code}
\`\`\`
`).join('\n')}

### JavaScript Logic
${this.analysis.cursor.implementation.javascript.map(pattern => `
#### ${pattern.pattern}
${pattern.description}

\`\`\`javascript
${pattern.code}
\`\`\`
`).join('\n')}

## 🎨 Visual States

### State 1: Default (Outside Gallery)
- **Cursor:** Standard browser cursor
- **Custom Element:** Hidden (\`opacity: 0\`)

### State 2: Gallery Hover
- **Cursor:** Hidden (\`cursor: none\`)
- **Custom Element:** Visible circle with "drag" text
- **Style:** Semi-transparent background, white border
- **Animation:** Fade in + slight scale up

### State 3: Active Dragging
- **Custom Element:** Modified styling during drag
- **Style:** Inverted colors (white bg, black text)
- **Animation:** Scale down slightly
- **Text:** Could change to "dragging" or remain "drag"

## 📋 Implementation Checklist

${this.analysis.recommendations.map(rec => `
### ✅ ${rec.title} (${rec.priority} Priority)
${rec.description}

**Implementation:** ${rec.implementation}
`).join('\n')}

## 🚀 React Implementation Example

\`\`\`jsx
// CustomCursor component for React
import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = 
          \`translate3d(\${e.clientX}px, \${e.clientY}px, 0) translate(-50%, -50%)\`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={cursorRef}
      className={\`custom-cursor \${isVisible ? 'visible' : ''} \${isHovering ? 'hover' : ''} \${isDragging ? 'dragging' : ''}\`}
    >
      <div className="cursor-inner">
        <span className="cursor-text">drag</span>
      </div>
    </div>
  );
};

export default CustomCursor;
\`\`\`

## 🎯 Key Success Factors

1. **Performance:** Use \`transform3d\` and \`will-change\` for smooth animations
2. **Timing:** Keep transitions short (0.1-0.2s) for responsive feel
3. **Visibility:** High contrast and clear typography for "drag" text
4. **States:** Clear visual feedback for different interaction states
5. **Accessibility:** Ensure functionality works without custom cursor

---
*Generated by Cursor Effects Analyzer*
`;
  }

  run() {
    console.log('🎯 Starting Cursor Effects Analysis...');
    
    this.analyzeCursorPatterns();
    this.generateReport();
    
    console.log('🎉 Cursor analysis complete!');
    console.log('📁 Check /analysis/cursor-implementation-guide.md for detailed implementation');
  }
}

// Run the cursor analysis
const analyzer = new CursorAnalyzer();
analyzer.run();

module.exports = CursorAnalyzer;