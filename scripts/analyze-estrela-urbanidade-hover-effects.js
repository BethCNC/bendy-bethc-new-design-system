#!/usr/bin/env node

/**
 * Estrela Urbanidade Hover Effects Analysis Script
 * Analyzes the hover effects and motion from https://estrelaurbanidade.com.br/contato
 * 
 * This script will help us understand the hover effects and motion patterns
 * to implement similar interactions in our image gallery.
 */

const puppeteer = require('puppeteer');

async function analyzeEstrelaUrbanidadeHoverEffects() {
  console.log('🔍 Analyzing Estrela Urbanidade hover effects...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for production
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable request interception to analyze CSS and JS
    await page.setRequestInterception(true);
    
    const resources = {
      css: [],
      js: [],
      images: []
    };
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('.css')) resources.css.push(url);
      else if (url.includes('.js')) resources.js.push(url);
      else if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) resources.images.push(url);
      request.continue();
    });
    
    // Navigate to the contact page
    await page.goto('https://estrelaurbanidade.com.br/contato', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('✅ Page loaded successfully\n');
    
    // Analyze CSS for hover effects
    console.log('📋 Analyzing CSS for hover effects...');
    
    const cssAnalysis = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets);
      const hoverEffects = [];
      
      styles.forEach(styleSheet => {
        try {
          const rules = Array.from(styleSheet.cssRules || []);
          rules.forEach(rule => {
            if (rule.selectorText && rule.selectorText.includes(':hover')) {
              hoverEffects.push({
                selector: rule.selectorText,
                properties: rule.style.cssText,
                source: styleSheet.href || 'inline'
              });
            }
          });
        } catch (e) {
          // Cross-origin stylesheets will throw errors
        }
      });
      
      return hoverEffects;
    });
    
    console.log(`Found ${cssAnalysis.length} hover effects:\n`);
    cssAnalysis.forEach((effect, index) => {
      console.log(`${index + 1}. ${effect.selector}`);
      console.log(`   Properties: ${effect.properties}`);
      console.log(`   Source: ${effect.source}\n`);
    });
    
    // Analyze animations and transitions
    console.log('🎬 Analyzing animations and transitions...');
    
    const animationAnalysis = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const animations = [];
      
      elements.forEach(el => {
        const computedStyle = window.getComputedStyle(el);
        const transition = computedStyle.transition;
        const animation = computedStyle.animation;
        const transform = computedStyle.transform;
        
        if (transition !== 'all 0s ease 0s' || animation !== 'none 0s ease 0s 1 normal none running' || transform !== 'none') {
          animations.push({
            tag: el.tagName.toLowerCase(),
            class: el.className,
            transition,
            animation,
            transform
          });
        }
      });
      
      return animations;
    });
    
    console.log(`Found ${animationAnalysis.length} elements with animations/transitions:\n`);
    animationAnalysis.slice(0, 10).forEach((anim, index) => {
      console.log(`${index + 1}. ${anim.tag}${anim.class ? '.' + anim.class.split(' ')[0] : ''}`);
      console.log(`   Transition: ${anim.transition}`);
      console.log(`   Animation: ${anim.animation}`);
      console.log(`   Transform: ${anim.transform}\n`);
    });
    
    // Analyze interactive elements
    console.log('🖱️ Analyzing interactive elements...');
    
    const interactiveElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('a, button, input, [role="button"], [tabindex]');
      const interactive = [];
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          interactive.push({
            tag: el.tagName.toLowerCase(),
            type: el.type || 'link',
            text: el.textContent?.trim().slice(0, 50) || '',
            classes: el.className,
            position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
          });
        }
      });
      
      return interactive;
    });
    
    console.log(`Found ${interactiveElements.length} interactive elements:\n`);
    interactiveElements.slice(0, 10).forEach((el, index) => {
      console.log(`${index + 1}. ${el.tag} (${el.type})`);
      console.log(`   Text: "${el.text}"`);
      console.log(`   Classes: ${el.classes}`);
      console.log(`   Position: ${el.position.x}, ${el.position.y} (${el.position.width}x${el.position.height})\n`);
    });
    
    // Test hover effects by hovering over elements
    console.log('🧪 Testing hover effects...');
    
    const hoverTestResults = await page.evaluate(() => {
      const results = [];
      const elements = document.querySelectorAll('a, button, [role="button"]');
      
      elements.forEach((el, index) => {
        if (index < 5) { // Test first 5 elements
          const beforeStyle = window.getComputedStyle(el);
          const beforeTransform = beforeStyle.transform;
          const beforeOpacity = beforeStyle.opacity;
          const beforeScale = beforeStyle.scale;
          
          // Simulate hover
          el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          
          // Small delay to let hover effects apply
          setTimeout(() => {
            const afterStyle = window.getComputedStyle(el);
            const afterTransform = afterStyle.transform;
            const afterOpacity = afterStyle.opacity;
            const afterScale = afterStyle.scale;
            
            if (beforeTransform !== afterTransform || beforeOpacity !== afterOpacity || beforeScale !== afterScale) {
              results.push({
                element: el.tagName.toLowerCase(),
                text: el.textContent?.trim().slice(0, 30) || '',
                before: { transform: beforeTransform, opacity: beforeOpacity, scale: beforeScale },
                after: { transform: afterTransform, opacity: afterOpacity, scale: afterScale }
              });
            }
          }, 100);
        }
      });
      
      return results;
    });
    
    console.log(`Hover test results: ${hoverTestResults.length} elements with hover effects\n`);
    
    // Generate recommendations
    console.log('💡 Recommendations for our image gallery:\n');
    
    const recommendations = [
      '1. Implement smooth transitions on hover (0.2s ease-in-out)',
      '2. Use subtle scale transforms (1.05x) for hover effects',
      '3. Add opacity changes for overlay elements',
      '4. Use transform3d for hardware acceleration',
      '5. Implement cursor pointer for interactive elements',
      '6. Add focus states for accessibility',
      '7. Use CSS custom properties for consistent timing',
      '8. Implement reduced motion support'
    ];
    
    recommendations.forEach(rec => console.log(rec));
    
    // Save analysis results
    const analysisResults = {
      timestamp: new Date().toISOString(),
      url: 'https://estrelaurbanidade.com.br/contato',
      hoverEffects: cssAnalysis,
      animations: animationAnalysis.slice(0, 20),
      interactiveElements: interactiveElements.slice(0, 20),
      hoverTestResults,
      recommendations
    };
    
    const fs = require('fs');
    fs.writeFileSync(
      'scripts/estrela-urbanidade-hover-analysis.json',
      JSON.stringify(analysisResults, null, 2)
    );
    
    console.log('\n📁 Analysis results saved to scripts/estrela-urbanidade-hover-analysis.json');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  } finally {
    await browser.close();
  }
}

// Run the analysis
analyzeEstrelaUrbanidadeHoverEffects().catch(console.error); 