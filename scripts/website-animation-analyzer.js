/**
 * Website Animation Analyzer Script
 * Analyzes movement, motion, and animations on any website
 * Run this in browser console to get detailed animation analysis
 */

class WebsiteAnimationAnalyzer {
  constructor() {
    this.results = {
      cssAnimations: [],
      jsAnimations: [],
      scrollAnimations: [],
      hoverEffects: [],
      loadingAnimations: [],
      videoAnimations: [],
      libraries: [],
      transforms: [],
      transitions: []
    };
  }

  // Analyze CSS animations and keyframes
  analyzeCSSAnimations() {
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        
        rules.forEach(rule => {
          // Check for keyframe animations
          if (rule.type === CSSRule.KEYFRAMES_RULE) {
            this.results.cssAnimations.push({
              type: 'keyframe',
              name: rule.name,
              keyframes: Array.from(rule.cssRules).map(kr => ({
                keyText: kr.keyText,
                style: kr.style.cssText
              }))
            });
          }
          
          // Check for CSS animations and transitions
          if (rule.style) {
            if (rule.style.animation) {
              this.results.cssAnimations.push({
                type: 'animation',
                selector: rule.selectorText,
                animation: rule.style.animation
              });
            }
            
            if (rule.style.transition) {
              this.results.transitions.push({
                selector: rule.selectorText,
                transition: rule.style.transition
              });
            }
            
            if (rule.style.transform) {
              this.results.transforms.push({
                selector: rule.selectorText,
                transform: rule.style.transform
              });
            }
          }
        });
      } catch (e) {
        console.warn('Could not access stylesheet:', e);
      }
    });
  }

  // Detect animation libraries
  detectAnimationLibraries() {
    const libraries = [
      { name: 'GSAP', check: () => window.gsap || window.TweenMax || window.TweenLite },
      { name: 'Framer Motion', check: () => window.framerMotion },
      { name: 'Anime.js', check: () => window.anime },
      { name: 'Velocity.js', check: () => window.Velocity },
      { name: 'ScrollMagic', check: () => window.ScrollMagic },
      { name: 'AOS (Animate On Scroll)', check: () => window.AOS },
      { name: 'Lottie', check: () => window.lottie || window.bodymovin },
      { name: 'Three.js', check: () => window.THREE },
      { name: 'PixiJS', check: () => window.PIXI },
      { name: 'Intersection Observer', check: () => window.IntersectionObserver },
      { name: 'Locomotive Scroll', check: () => window.LocomotiveScroll },
      { name: 'Barba.js', check: () => window.barba },
      { name: 'Swiper', check: () => window.Swiper }
    ];

    libraries.forEach(lib => {
      if (lib.check()) {
        this.results.libraries.push(lib.name);
      }
    });

    // Check for library-specific attributes
    const aosElements = document.querySelectorAll('[data-aos]');
    if (aosElements.length > 0) {
      this.results.libraries.push('AOS (detected via data-aos)');
    }

    const scrollElements = document.querySelectorAll('[data-scroll]');
    if (scrollElements.length > 0) {
      this.results.libraries.push('Locomotive Scroll (detected via data-scroll)');
    }
  }

  // Analyze scroll-based animations
  analyzeScrollAnimations() {
    const scrollElements = document.querySelectorAll('*');
    
    scrollElements.forEach(element => {
      const style = window.getComputedStyle(element);
      
      // Check for scroll-related CSS
      if (style.position === 'sticky' || style.position === 'fixed') {
        this.results.scrollAnimations.push({
          type: 'sticky/fixed positioning',
          element: element.tagName.toLowerCase(),
          classes: Array.from(element.classList),
          position: style.position
        });
      }
      
      // Check for data attributes related to scroll
      const dataAttrs = Array.from(element.attributes)
        .filter(attr => attr.name.includes('scroll') || attr.name.includes('parallax'))
        .map(attr => ({ name: attr.name, value: attr.value }));
        
      if (dataAttrs.length > 0) {
        this.results.scrollAnimations.push({
          type: 'data-attribute scroll',
          element: element.tagName.toLowerCase(),
          attributes: dataAttrs
        });
      }
    });
  }

  // Analyze hover effects
  analyzeHoverEffects() {
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        
        rules.forEach(rule => {
          if (rule.selectorText && rule.selectorText.includes(':hover')) {
            this.results.hoverEffects.push({
              selector: rule.selectorText,
              styles: rule.style.cssText
            });
          }
        });
      } catch (e) {
        console.warn('Could not access stylesheet for hover analysis:', e);
      }
    });
  }

  // Analyze video and media animations
  analyzeVideoAnimations() {
    const videos = document.querySelectorAll('video');
    const canvases = document.querySelectorAll('canvas');
    const svgs = document.querySelectorAll('svg');
    
    videos.forEach(video => {
      this.results.videoAnimations.push({
        type: 'video',
        src: video.src || video.querySelector('source')?.src,
        autoplay: video.autoplay,
        loop: video.loop,
        muted: video.muted
      });
    });
    
    canvases.forEach(canvas => {
      this.results.videoAnimations.push({
        type: 'canvas',
        width: canvas.width,
        height: canvas.height,
        context: canvas.getContext ? 'available' : 'unavailable'
      });
    });
    
    svgs.forEach(svg => {
      const animateElements = svg.querySelectorAll('animate, animateTransform');
      if (animateElements.length > 0) {
        this.results.videoAnimations.push({
          type: 'svg animation',
          animationCount: animateElements.length
        });
      }
    });
  }

  // Analyze JavaScript-based animations
  analyzeJSAnimations() {
    // Check for common animation patterns in inline scripts
    const scripts = document.querySelectorAll('script');
    
    scripts.forEach(script => {
      if (script.textContent) {
        const content = script.textContent;
        
        // Look for common animation keywords
        const animationKeywords = [
          'requestAnimationFrame',
          'setInterval',
          'setTimeout',
          'transform',
          'translate',
          'rotate',
          'scale',
          'opacity',
          'addEventListener.*scroll',
          'addEventListener.*resize',
          'IntersectionObserver'
        ];
        
        animationKeywords.forEach(keyword => {
          const regex = new RegExp(keyword, 'gi');
          const matches = content.match(regex);
          if (matches) {
            this.results.jsAnimations.push({
              type: keyword,
              count: matches.length,
              scriptType: script.src ? 'external' : 'inline'
            });
          }
        });
      }
    });
  }

  // Analyze elements with transforms
  analyzeTransforms() {
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      const style = window.getComputedStyle(element);
      
      if (style.transform && style.transform !== 'none') {
        this.results.transforms.push({
          element: element.tagName.toLowerCase(),
          classes: Array.from(element.classList),
          transform: style.transform,
          transformOrigin: style.transformOrigin
        });
      }
    });
  }

  // Run all analyses
  analyze() {
    console.log('🎬 Starting Website Animation Analysis...');
    
    this.analyzeCSSAnimations();
    this.detectAnimationLibraries();
    this.analyzeScrollAnimations();
    this.analyzeHoverEffects();
    this.analyzeVideoAnimations();
    this.analyzeJSAnimations();
    this.analyzeTransforms();
    
    return this.results;
  }

  // Generate a formatted report
  generateReport() {
    const results = this.analyze();
    
    console.log('\n📊 WEBSITE ANIMATION ANALYSIS REPORT');
    console.log('=====================================');
    
    console.log('\n🎨 Animation Libraries Detected:');
    if (results.libraries.length > 0) {
      results.libraries.forEach(lib => console.log(`  ✅ ${lib}`));
    } else {
      console.log('  ❌ No animation libraries detected');
    }
    
    console.log('\n🎭 CSS Animations:');
    console.log(`  Found ${results.cssAnimations.length} CSS animations`);
    results.cssAnimations.slice(0, 5).forEach(anim => {
      console.log(`  • ${anim.type}: ${anim.name || anim.selector}`);
    });
    
    console.log('\n🎯 Hover Effects:');
    console.log(`  Found ${results.hoverEffects.length} hover effects`);
    results.hoverEffects.slice(0, 5).forEach(effect => {
      console.log(`  • ${effect.selector}`);
    });
    
    console.log('\n📜 Scroll Animations:');
    console.log(`  Found ${results.scrollAnimations.length} scroll-related animations`);
    results.scrollAnimations.slice(0, 5).forEach(scroll => {
      console.log(`  • ${scroll.type}: ${scroll.element}`);
    });
    
    console.log('\n🎬 Video/Media Animations:');
    console.log(`  Found ${results.videoAnimations.length} video/media elements`);
    results.videoAnimations.forEach(video => {
      console.log(`  • ${video.type}`);
    });
    
    console.log('\n🔄 Transform Effects:');
    console.log(`  Found ${results.transforms.length} elements with transforms`);
    
    console.log('\n💫 JavaScript Animations:');
    console.log(`  Found ${results.jsAnimations.length} JS animation patterns`);
    results.jsAnimations.forEach(js => {
      console.log(`  • ${js.type}: ${js.count} occurrences`);
    });
    
    console.log('\n🔗 Transitions:');
    console.log(`  Found ${results.transitions.length} CSS transitions`);
    
    return results;
  }
}

// Auto-run the analyzer
const analyzer = new WebsiteAnimationAnalyzer();
const results = analyzer.generateReport();

// Make results available globally
window.animationAnalysis = results;

console.log('\n💡 Full results available in: window.animationAnalysis');
console.log('📝 Use analyzer.analyze() to run analysis again');