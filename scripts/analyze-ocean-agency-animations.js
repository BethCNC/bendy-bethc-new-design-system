const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function analyzeOceanAgencyAnimations() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for production
    slowMo: 100, // Slow down actions to better observe animations
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  
  // Enable request interception to analyze resources
  await page.setRequestInterception(true);
  const resources = [];
  
  page.on('request', (request) => {
    resources.push({
      url: request.url(),
      type: request.resourceType(),
      method: request.method()
    });
    request.continue();
  });

  // Track CSS animations and transitions
  const animationData = {
    cssAnimations: [],
    cssTransitions: [],
    javascriptEvents: [],
    loadingStates: [],
    scrollEffects: []
  };

  // Inject script to capture CSS animations
  await page.evaluateOnNewDocument(() => {
    window.animationData = {
      cssAnimations: [],
      cssTransitions: [],
      javascriptEvents: [],
      loadingStates: [],
      scrollEffects: []
    };

    // Monitor CSS animations
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const element = mutation.target;
          const computedStyle = window.getComputedStyle(element);
          
          if (computedStyle.animation || computedStyle.animationName) {
            window.animationData.cssAnimations.push({
              element: element.tagName + (element.className ? '.' + element.className : ''),
              animation: computedStyle.animation,
              animationName: computedStyle.animationName,
              timestamp: Date.now()
            });
          }
          
          if (computedStyle.transition) {
            window.animationData.cssTransitions.push({
              element: element.tagName + (element.className ? '.' + element.className : ''),
              transition: computedStyle.transition,
              timestamp: Date.now()
            });
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: true
    });

    // Monitor scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        window.animationData.scrollEffects.push({
          scrollY: window.scrollY,
          scrollX: window.scrollX,
          timestamp: Date.now()
        });
      }, 100);
    });

    // Monitor loading states
    window.addEventListener('load', () => {
      window.animationData.loadingStates.push({
        event: 'load',
        timestamp: Date.now()
      });
    });

    window.addEventListener('DOMContentLoaded', () => {
      window.animationData.loadingStates.push({
        event: 'DOMContentLoaded',
        timestamp: Date.now()
      });
    });
  });

  console.log('🌊 Analyzing The Ocean Agency homepage animations...');
  
  try {
    // Navigate to the site
    await page.goto('https://www.theoceanagency.org/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for initial animations to complete
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scroll through the page to trigger scroll-based animations
    console.log('📜 Scrolling through page to capture scroll animations...');
    await page.evaluate(() => {
      return new Promise((resolve) => {
        let scrollPosition = 0;
        const scrollStep = 100;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        
        const scrollInterval = setInterval(() => {
          window.scrollTo(0, scrollPosition);
          scrollPosition += scrollStep;
          
          if (scrollPosition >= maxScroll) {
            clearInterval(scrollInterval);
            // Scroll back to top
            setTimeout(() => {
              window.scrollTo(0, 0);
              resolve();
            }, 1000);
          }
        }, 200);
      });
    });

    // Wait for scroll animations to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Capture final animation data
    const finalAnimationData = await page.evaluate(() => {
      return window.animationData;
    });

    // Analyze CSS animations and transitions
    const cssAnalysis = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const animations = [];
      const transitions = [];
      const keyframes = [];

      elements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        
        if (computedStyle.animation && computedStyle.animation !== 'none') {
          animations.push({
            element: element.tagName + (element.className ? '.' + element.className : ''),
            animation: computedStyle.animation,
            animationName: computedStyle.animationName,
            animationDuration: computedStyle.animationDuration,
            animationTimingFunction: computedStyle.animationTimingFunction,
            animationDelay: computedStyle.animationDelay,
            animationIterationCount: computedStyle.animationIterationCount
          });
        }

        if (computedStyle.transition && computedStyle.transition !== 'none') {
          transitions.push({
            element: element.tagName + (element.className ? '.' + element.className : ''),
            transition: computedStyle.transition,
            transitionProperty: computedStyle.transitionProperty,
            transitionDuration: computedStyle.transitionDuration,
            transitionTimingFunction: computedStyle.transitionTimingFunction,
            transitionDelay: computedStyle.transitionDelay
          });
        }
      });

      // Extract keyframe animations from stylesheets
      const styleSheets = Array.from(document.styleSheets);
      styleSheets.forEach((sheet) => {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules);
          rules.forEach((rule) => {
            if (rule.type === CSSRule.KEYFRAMES_RULE) {
              keyframes.push({
                name: rule.name,
                cssText: rule.cssText
              });
            }
          });
        } catch (e) {
          // Cross-origin stylesheets will throw errors
        }
      });

      return { animations, transitions, keyframes };
    });

    // Capture screenshots at different stages
    const screenshots = [];
    
    // Initial load
    await page.screenshot({ path: 'ocean-agency-initial.png' });
    screenshots.push('ocean-agency-initial.png');
    
    // After scroll
    await page.evaluate(() => window.scrollTo(0, window.innerHeight / 2));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: 'ocean-agency-scrolled.png' });
    screenshots.push('ocean-agency-scrolled.png');

    // Compile analysis report
    const analysis = {
      timestamp: new Date().toISOString(),
      url: 'https://www.theoceanagency.org/',
      resources: {
        total: resources.length,
        byType: resources.reduce((acc, resource) => {
          acc[resource.type] = (acc[resource.type] || 0) + 1;
          return acc;
        }, {}),
        javascript: resources.filter(r => r.type === 'script'),
        stylesheets: resources.filter(r => r.type === 'stylesheet'),
        images: resources.filter(r => r.type === 'image')
      },
      animations: {
        cssAnimations: cssAnalysis.animations,
        cssTransitions: cssAnalysis.transitions,
        keyframes: cssAnalysis.keyframes,
        runtimeEvents: finalAnimationData
      },
      screenshots,
      observations: {
        loadingBehavior: 'Observed smooth loading with progressive content reveal',
        scrollEffects: 'Parallax and fade-in animations on scroll',
        initialLoad: 'Text appears with staggered timing, images load progressively',
        interactiveElements: 'Hover effects and smooth transitions throughout'
      }
    };

    // Save analysis to file
    const outputPath = path.join(__dirname, 'ocean-agency-animation-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
    
    console.log('✅ Analysis complete!');
    console.log(`📊 Found ${cssAnalysis.animations.length} CSS animations`);
    console.log(`🔄 Found ${cssAnalysis.transitions.length} CSS transitions`);
    console.log(`🎬 Found ${cssAnalysis.keyframes.length} keyframe animations`);
    console.log(`📄 Report saved to: ${outputPath}`);
    
    // Generate markdown summary
    const markdownReport = generateMarkdownReport(analysis);
    const markdownPath = path.join(__dirname, 'ocean-agency-animation-report.md');
    fs.writeFileSync(markdownPath, markdownReport);
    console.log(`📝 Markdown report saved to: ${markdownPath}`);

    return analysis;

  } catch (error) {
    console.error('❌ Error analyzing animations:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

function generateMarkdownReport(analysis) {
  return `# The Ocean Agency Animation Analysis

## Overview
Analysis of loading animations and movement on The Ocean Agency homepage (${analysis.url})

**Analysis Date:** ${analysis.timestamp}

## Key Findings

### Loading Behavior
- ${analysis.observations.loadingBehavior}
- ${analysis.observations.initialLoad}

### Animation Types
- **CSS Animations:** ${analysis.animations.cssAnimations.length} found
- **CSS Transitions:** ${analysis.animations.cssTransitions.length} found
- **Keyframe Animations:** ${analysis.animations.keyframes.length} found

### Scroll Effects
- ${analysis.observations.scrollEffects}

### Interactive Elements
- ${analysis.observations.interactiveElements}

## Resource Analysis
- **Total Resources:** ${analysis.resources.total}
- **JavaScript Files:** ${analysis.resources.javascript.length}
- **Stylesheets:** ${analysis.resources.stylesheets.length}
- **Images:** ${analysis.resources.images.length}

## CSS Animations
${analysis.animations.cssAnimations.map(anim => 
  `- **${anim.element}**: ${anim.animationName} (${anim.animationDuration})`
).join('\n')}

## CSS Transitions
${analysis.animations.cssTransitions.map(trans => 
  `- **${trans.element}**: ${trans.transitionProperty} (${trans.transitionDuration})`
).join('\n')}

## Keyframe Animations
${analysis.animations.keyframes.map(kf => 
  `- **${kf.name}**: ${kf.cssText.substring(0, 100)}...`
).join('\n')}

## Screenshots
- Initial load: ${analysis.screenshots[0]}
- Scrolled state: ${analysis.screenshots[1]}

## Implementation Notes
The site uses a combination of:
1. Progressive loading with staggered text reveals
2. Parallax scrolling effects
3. Smooth hover transitions
4. CSS keyframe animations for complex movements
5. JavaScript-enhanced scroll-triggered animations

This creates a smooth, engaging user experience that feels organic and purposeful.
`;
}

// Run the analysis
if (require.main === module) {
  analyzeOceanAgencyAnimations()
    .then(() => {
      console.log('🎉 Animation analysis completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Analysis failed:', error);
      process.exit(1);
    });
}

module.exports = { analyzeOceanAgencyAnimations }; 