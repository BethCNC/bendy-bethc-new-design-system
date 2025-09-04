#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Current Motion Code Analyzer
 * Analyzes the actual motion code being used in the ImageGallery component
 */

function analyzeImageGalleryMotion() {
  console.log('🎬 Analyzing Current ImageGallery Motion Code...\n');
  
  const imageGalleryPath = path.join(__dirname, '../app/components/ui/ImageGallery.tsx');
  
  if (!fs.existsSync(imageGalleryPath)) {
    console.log('❌ ImageGallery.tsx not found');
    return;
  }
  
  const code = fs.readFileSync(imageGalleryPath, 'utf8');
  
  // Analyze motion patterns
  const analysis = {
    gsapUsage: {
      count: (code.match(/gsap\./g) || []).length,
      methods: code.match(/gsap\.\w+/g) || [],
      uniqueMethods: [...new Set(code.match(/gsap\.\w+/g) || [])]
    },
    requestAnimationFrame: {
      count: (code.match(/requestAnimationFrame/g) || []).length,
      usage: code.match(/requestAnimationFrame\([^)]+\)/g) || []
    },
    mouseEvents: {
      handlers: code.match(/handleMouse\w+/g) || [],
      eventTypes: code.match(/onMouse\w+/g) || []
    },
    motionVariables: {
      momentum: code.includes('momentum'),
      velocity: code.includes('velocity'),
      autoScroll: code.includes('autoScroll'),
      isDragging: code.includes('isDragging')
    },
    animationPatterns: {
      infiniteLoop: code.includes('infinite loop'),
      momentum: code.includes('momentum'),
      elastic: code.includes('elastic'),
      easing: code.match(/ease:\s*"[^"]+"/g) || []
    }
  };
  
  console.log('📊 MOTION ANALYSIS RESULTS');
  console.log('==========================\n');
  
  console.log('🎯 GSAP Usage:');
  console.log(`  • Total GSAP calls: ${analysis.gsapUsage.count}`);
  console.log(`  • Methods used: ${analysis.gsapUsage.uniqueMethods.join(', ')}`);
  
  console.log('\n🔄 Animation Frame Usage:');
  console.log(`  • requestAnimationFrame calls: ${analysis.requestAnimationFrame.count}`);
  analysis.requestAnimationFrame.usage.forEach((usage, i) => {
    console.log(`  • Usage ${i + 1}: ${usage}`);
  });
  
  console.log('\n🖱️ Mouse Event Handlers:');
  console.log(`  • Handlers: ${analysis.mouseEvents.handlers.join(', ')}`);
  console.log(`  • Event types: ${analysis.mouseEvents.eventTypes.join(', ')}`);
  
  console.log('\n⚙️ Motion Variables:');
  Object.entries(analysis.motionVariables).forEach(([key, value]) => {
    console.log(`  • ${key}: ${value ? '✅' : '❌'}`);
  });
  
  console.log('\n🎭 Animation Patterns:');
  console.log(`  • Infinite loop: ${analysis.animationPatterns.infiniteLoop ? '✅' : '❌'}`);
  console.log(`  • Momentum: ${analysis.animationPatterns.momentum ? '✅' : '❌'}`);
  console.log(`  • Elastic physics: ${analysis.animationPatterns.elastic ? '✅' : '❌'}`);
  console.log(`  • Easing functions: ${analysis.animationPatterns.easing.join(', ')}`);
  
  // Extract key motion code sections
  console.log('\n📝 KEY MOTION CODE SECTIONS:');
  console.log('============================');
  
  const sections = [
    { name: 'Auto-scroll logic', pattern: /const startAutoScroll[\s\S]*?};/ },
    { name: 'Mouse down handler', pattern: /const handleMouseDown[\s\S]*?};/ },
    { name: 'Mouse move handler', pattern: /const handleMouseMove[\s\S]*?};/ },
    { name: 'Mouse up handler', pattern: /const handleMouseUp[\s\S]*?};/ }
  ];
  
  sections.forEach(section => {
    const match = code.match(section.pattern);
    if (match) {
      console.log(`\n🔍 ${section.name}:`);
      console.log(match[0].split('\n').slice(0, 10).join('\n'));
      if (match[0].split('\n').length > 10) {
        console.log('... (truncated)');
      }
    }
  });
  
  // Check for specific motion behaviors
  console.log('\n🎯 MOTION BEHAVIORS DETECTED:');
  console.log('=============================');
  
  const behaviors = [
    { name: 'Direct drag control', pattern: /walk.*=.*\(x.*-.*startX\)/ },
    { name: 'Momentum after release', pattern: /momentum\.current.*=.*velocity/ },
    { name: 'Infinite loop reset', pattern: /Math\.abs\(currentX\).*>=.*scrollDistance/ },
    { name: 'Auto-scroll from right to left', pattern: /targetX.*=.*currentX.*-.*autoScrollSpeed/ },
    { name: 'Cursor state management', pattern: /custom-cursor|drag-cursor/ }
  ];
  
  behaviors.forEach(behavior => {
    const found = code.match(behavior.pattern);
    console.log(`  • ${behavior.name}: ${found ? '✅' : '❌'}`);
  });
  
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('==================');
  
  if (analysis.gsapUsage.count > 0) {
    console.log('✅ GSAP is being used for animations');
  } else {
    console.log('❌ No GSAP detected - consider using GSAP for smooth animations');
  }
  
  if (analysis.requestAnimationFrame.count > 0) {
    console.log('✅ requestAnimationFrame is being used for smooth motion');
  } else {
    console.log('❌ No requestAnimationFrame detected - consider using for smooth motion');
  }
  
  if (analysis.motionVariables.momentum) {
    console.log('✅ Momentum physics implemented');
  } else {
    console.log('❌ No momentum detected - consider adding momentum for natural feel');
  }
  
  if (analysis.motionVariables.infiniteLoop) {
    console.log('✅ Infinite loop behavior detected');
  } else {
    console.log('❌ No infinite loop detected - consider adding for seamless scrolling');
  }
  
  console.log('\n📁 Analysis complete! Check the code sections above for implementation details.');
}

// Run the analysis
analyzeImageGalleryMotion(); 