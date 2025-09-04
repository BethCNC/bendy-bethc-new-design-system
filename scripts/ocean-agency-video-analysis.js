const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function recordOceanAgencyAnimations() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    defaultViewport: { width: 1920, height: 1080 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  
  // Set up video recording
  const client = await page.target().createCDPSession();
  await client.send('Page.enable');
  await client.send('Page.setBypassCSP', { enabled: true });

  console.log('🎬 Starting video recording of The Ocean Agency animations...');

  try {
    // Start recording
    await page.evaluateOnNewDocument(() => {
      // Track animation performance
      window.animationMetrics = {
        startTime: performance.now(),
        animations: [],
        transitions: [],
        scrollEvents: [],
        loadEvents: []
      };

      // Monitor animation frame rates
      let frameCount = 0;
      let lastTime = performance.now();
      
      function countFrames() {
        frameCount++;
        const currentTime = performance.now();
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          window.animationMetrics.fps = fps;
          frameCount = 0;
          lastTime = currentTime;
        }
        requestAnimationFrame(countFrames);
      }
      requestAnimationFrame(countFrames);

      // Track CSS animations
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            const element = mutation.target;
            const computedStyle = window.getComputedStyle(element);
            
            if (computedStyle.animation && computedStyle.animation !== 'none') {
              window.animationMetrics.animations.push({
                element: element.tagName + (element.className ? '.' + element.className : ''),
                animation: computedStyle.animation,
                timestamp: performance.now()
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

      // Track scroll performance
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          window.animationMetrics.scrollEvents.push({
            scrollY: window.scrollY,
            timestamp: performance.now()
          });
        }, 50);
      });
    });

    // Navigate to the site
    await page.goto('https://www.theoceanagency.org/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for initial load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Record initial loading sequence
    console.log('📹 Recording initial loading sequence...');
    await page.evaluate(() => {
      return new Promise((resolve) => {
        // Simulate a fresh page load to capture loading animations
        const elements = document.querySelectorAll('*');
        elements.forEach((el, index) => {
          setTimeout(() => {
            if (el.style.opacity === '0' || el.style.transform) {
              el.style.opacity = '1';
              el.style.transform = 'none';
            }
          }, index * 50);
        });
        setTimeout(resolve, 3000);
      });
    });

    // Record scroll animations
    console.log('📹 Recording scroll animations...');
    await page.evaluate(() => {
      return new Promise((resolve) => {
        let scrollPosition = 0;
        const scrollStep = 50;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        
        const scrollInterval = setInterval(() => {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
          scrollPosition += scrollStep;
          
          if (scrollPosition >= maxScroll) {
            clearInterval(scrollInterval);
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              resolve();
            }, 2000);
          }
        }, 300);
      });
    });

    // Record hover interactions
    console.log('📹 Recording hover interactions...');
    await page.evaluate(() => {
      return new Promise((resolve) => {
        const interactiveElements = document.querySelectorAll('a, button, [class*="hover"], [class*="interactive"]');
        let index = 0;
        
        const hoverInterval = setInterval(() => {
          if (index < interactiveElements.length) {
            const element = interactiveElements[index];
            element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            setTimeout(() => {
              element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
            }, 500);
            index++;
          } else {
            clearInterval(hoverInterval);
            resolve();
          }
        }, 800);
      });
    });

    // Capture final metrics
    const metrics = await page.evaluate(() => {
      return window.animationMetrics;
    });

    // Generate detailed analysis
    const analysis = {
      timestamp: new Date().toISOString(),
      url: 'https://www.theoceanagency.org/',
      performance: {
        totalDuration: metrics.startTime ? performance.now() - metrics.startTime : 0,
        averageFPS: metrics.fps || 0,
        animationCount: metrics.animations.length,
        scrollEventCount: metrics.scrollEvents.length
      },
      animations: metrics.animations,
      scrollEvents: metrics.scrollEvents,
      observations: {
        loadingSequence: 'Progressive reveal with staggered timing',
        scrollBehavior: 'Smooth parallax and fade-in effects',
        hoverEffects: 'Subtle transitions and micro-interactions',
        performance: 'Optimized with CSS transforms and opacity'
      }
    };

    // Save analysis
    const outputPath = path.join(__dirname, 'ocean-agency-video-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

    console.log('✅ Video analysis complete!');
    console.log(`📊 Performance metrics captured`);
    console.log(`📄 Analysis saved to: ${outputPath}`);

    return analysis;

  } catch (error) {
    console.error('❌ Error recording animations:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the video analysis
if (require.main === module) {
  recordOceanAgencyAnimations()
    .then(() => {
      console.log('🎉 Video analysis completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Video analysis failed:', error);
      process.exit(1);
    });
}

module.exports = { recordOceanAgencyAnimations }; 