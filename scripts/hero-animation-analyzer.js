/**
 * Hero Section Animation Analyzer
 * Focused analysis for header/hero animations
 * Copy and paste this into browser console on any website
 */

// Quick one-liner to run this script:
// Just paste this entire code into the browser console

(function() {
  console.log('🎬 HERO SECTION ANIMATION ANALYSIS');
  console.log('==================================');
  
  // 1. Check for animation libraries
  const libraries = {
    'GSAP': window.gsap || window.TweenMax || window.TweenLite,
    'Framer Motion': window.framerMotion,
    'Anime.js': window.anime,
    'ScrollMagic': window.ScrollMagic,
    'AOS': window.AOS,
    'Lottie': window.lottie || window.bodymovin,
    'Three.js': window.THREE,
    'Locomotive Scroll': window.LocomotiveScroll,
    'Intersection Observer': window.IntersectionObserver
  };
  
  console.log('\n📚 Animation Libraries:');
  Object.entries(libraries).forEach(([name, exists]) => {
    console.log(`${exists ? '✅' : '❌'} ${name}`);
  });
  
  // 2. Find hero/header sections
  const heroSelectors = [
    'header', '[class*="hero"]', '[class*="banner"]', 
    '[id*="hero"]', '[class*="header"]', 'main > section:first-child',
    '.hero', '.banner', '.header', '#hero', '#header'
  ];
  
  let heroElements = [];
  heroSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (!heroElements.includes(el)) {
        heroElements.push(el);
      }
    });
  });
  
  console.log(`\n🎯 Found ${heroElements.length} potential hero/header elements`);
  
  // 3. Analyze each hero element
  heroElements.forEach((element, index) => {
    console.log(`\n--- Hero Element ${index + 1} ---`);
    console.log('Tag:', element.tagName);
    console.log('Classes:', Array.from(element.classList).join(', ') || 'none');
    console.log('ID:', element.id || 'none');
    
    const style = window.getComputedStyle(element);
    
    // Check for transforms
    if (style.transform !== 'none') {
      console.log('🔄 Transform:', style.transform);
    }
    
    // Check for transitions
    if (style.transition !== 'all 0s ease 0s') {
      console.log('⚡ Transition:', style.transition);
    }
    
    // Check for position effects
    if (style.position === 'fixed' || style.position === 'sticky') {
      console.log('📌 Position:', style.position);
    }
    
    // Check for animation
    if (style.animation !== 'none') {
      console.log('🎭 Animation:', style.animation);
    }
    
    // Check for data attributes
    const dataAttrs = Array.from(element.attributes)
      .filter(attr => attr.name.startsWith('data-'))
      .map(attr => `${attr.name}="${attr.value}"`);
    if (dataAttrs.length > 0) {
      console.log('📊 Data attributes:', dataAttrs.join(', '));
    }
  });
  
  // 4. Look for videos in hero sections
  console.log('\n🎬 Video Elements:');
  const videos = document.querySelectorAll('video');
  if (videos.length > 0) {
    videos.forEach((video, index) => {
      console.log(`Video ${index + 1}:`);
      console.log('  Source:', video.src || video.querySelector('source')?.src || 'none');
      console.log('  Autoplay:', video.autoplay);
      console.log('  Loop:', video.loop);
      console.log('  Muted:', video.muted);
    });
  } else {
    console.log('No video elements found');
  }
  
  // 5. Look for scroll listeners
  console.log('\n📜 Scroll Animation Indicators:');
  const scripts = Array.from(document.querySelectorAll('script'));
  let scrollIndicators = 0;
  
  scripts.forEach(script => {
    if (script.textContent) {
      const indicators = [
        'scroll', 'parallax', 'IntersectionObserver', 
        'requestAnimationFrame', 'transform', 'translate'
      ];
      
      indicators.forEach(indicator => {
        if (script.textContent.includes(indicator)) {
          scrollIndicators++;
        }
      });
    }
  });
  
  console.log(`Found ${scrollIndicators} potential scroll animation indicators in scripts`);
  
  // 6. Check for common animation CSS classes
  console.log('\n🎨 Animation CSS Classes Found:');
  const animationClasses = [
    'fade', 'slide', 'zoom', 'bounce', 'rotate', 'scale',
    'animate', 'motion', 'parallax', 'sticky', 'fixed'
  ];
  
  const foundClasses = [];
  animationClasses.forEach(className => {
    const elements = document.querySelectorAll(`[class*="${className}"]`);
    if (elements.length > 0) {
      foundClasses.push(`${className} (${elements.length} elements)`);
    }
  });
  
  if (foundClasses.length > 0) {
    foundClasses.forEach(cls => console.log(`  • ${cls}`));
  } else {
    console.log('  No common animation classes found');
  }
  
  // 7. Performance check
  console.log('\n⚡ Performance Notes:');
  console.log('• Use browser DevTools Performance tab to see actual animations');
  console.log('• Check Network tab for animation library files');
  console.log('• Look at Elements tab for style changes during scroll');
  
  console.log('\n✨ Analysis Complete!');
  
})();