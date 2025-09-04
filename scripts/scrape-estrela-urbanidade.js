const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeEstrelaUrbanidade() {
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for production
    defaultViewport: { width: 1920, height: 1080 }
  });

  try {
    const page = await browser.newPage();
    
    // Enable request interception to capture all resources
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

    console.log('🌐 Navigating to Estrela Urbanidade...');
    await page.goto('https://estrelaurbanidade.com.br/contato', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for the page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🔍 Analyzing page structure...');

    // Extract all HTML content
    const htmlContent = await page.content();
    
    // Extract all CSS
    const cssContent = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets);
      let cssText = '';
      
      styles.forEach(styleSheet => {
        try {
          const rules = Array.from(styleSheet.cssRules || styleSheet.rules);
          rules.forEach(rule => {
            cssText += rule.cssText + '\n';
          });
        } catch (e) {
          // Cross-origin stylesheets will throw errors
          console.log('Skipping cross-origin stylesheet:', styleSheet.href);
        }
      });
      
      return cssText;
    });

    // Extract all JavaScript
    const javascriptContent = await page.evaluate(() => {
      const scripts = Array.from(document.scripts);
      let jsText = '';
      
      scripts.forEach(script => {
        if (script.src) {
          jsText += `// External script: ${script.src}\n`;
        } else {
          jsText += script.textContent + '\n';
        }
      });
      
      return jsText;
    });

    // Look specifically for ARRASTE-related elements
    const arrasteElements = await page.evaluate(() => {
      const elements = [];
      
      // Search for elements containing "ARRASTE"
      const textNodes = document.evaluate(
        "//text()[contains(., 'ARRASTE')]",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      
      for (let i = 0; i < textNodes.snapshotLength; i++) {
        const node = textNodes.snapshotItem(i);
        const element = node.parentElement;
        if (element) {
          elements.push({
            tagName: element.tagName,
            className: element.className,
            id: element.id,
            textContent: element.textContent.trim(),
            outerHTML: element.outerHTML,
            computedStyle: window.getComputedStyle(element)
          });
        }
      }
      
      // Search for elements with drag-related classes or IDs
      const dragSelectors = [
        '[class*="drag"]',
        '[class*="scroll"]',
        '[class*="arraste"]',
        '[id*="drag"]',
        '[id*="scroll"]',
        '[id*="arraste"]',
        '[class*="circle"]',
        '[class*="indicator"]'
      ];
      
      dragSelectors.forEach(selector => {
        try {
          const found = document.querySelectorAll(selector);
          found.forEach(el => {
            elements.push({
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              textContent: el.textContent.trim(),
              outerHTML: el.outerHTML,
              computedStyle: window.getComputedStyle(el)
            });
          });
        } catch (e) {
          // Invalid selector
        }
      });
      
      return elements;
    });

    // Look for scroll-related JavaScript
    const scrollScripts = await page.evaluate(() => {
      const scrollFunctions = [];
      
      // Search for scroll event listeners
      const scripts = Array.from(document.scripts);
      scripts.forEach(script => {
        const content = script.textContent || '';
        if (content.includes('scroll') || content.includes('drag') || content.includes('arraste')) {
          scrollFunctions.push({
            src: script.src,
            content: content.substring(0, 1000) // First 1000 chars
          });
        }
      });
      
      return scrollFunctions;
    });

    // Capture screenshots of the page
    await page.screenshot({ 
      path: 'scripts/estrela-urbanidade-full.png',
      fullPage: true 
    });

    // Look for the gallery section specifically
    const gallerySection = await page.evaluate(() => {
      const gallerySelectors = [
        '.conteudos-list',
        '.gallery',
        '[class*="gallery"]',
        '[class*="conteudos"]',
        '.scroll-container',
        '.horizontal-scroll'
      ];
      
      const sections = [];
      gallerySelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            sections.push({
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              outerHTML: el.outerHTML.substring(0, 2000), // First 2000 chars
              children: Array.from(el.children).map(child => ({
                tagName: child.tagName,
                className: child.className,
                id: child.id
              }))
            });
          });
        } catch (e) {
          // Invalid selector
        }
      });
      
      return sections;
    });

    // Create comprehensive analysis report
    const analysis = {
      timestamp: new Date().toISOString(),
      url: 'https://estrelaurbanidade.com.br/contato',
      arrasteElements,
      scrollScripts,
      gallerySection,
      resources: resources.filter(r => r.type === 'script' || r.type === 'stylesheet'),
      pageTitle: await page.title(),
      pageUrl: page.url()
    };

    // Save the analysis
    fs.writeFileSync(
      'scripts/estrela-urbanidade-complete-analysis.json',
      JSON.stringify(analysis, null, 2)
    );

    // Save raw HTML
    fs.writeFileSync('scripts/estrela-urbanidade-html.html', htmlContent);

    // Save CSS
    fs.writeFileSync('scripts/estrela-urbanidade-css.css', cssContent);

    // Save JavaScript
    fs.writeFileSync('scripts/estrela-urbanidade-js.js', javascriptContent);

    console.log('✅ Analysis complete!');
    console.log('📁 Files saved:');
    console.log('  - scripts/estrela-urbanidade-complete-analysis.json');
    console.log('  - scripts/estrela-urbanidade-html.html');
    console.log('  - scripts/estrela-urbanidade-css.css');
    console.log('  - scripts/estrela-urbanidade-js.js');
    console.log('  - scripts/estrela-urbanidade-full.png');

    // Log findings
    if (arrasteElements.length > 0) {
      console.log('\n🎯 Found ARRASTE elements:');
      arrasteElements.forEach((el, i) => {
        console.log(`  ${i + 1}. ${el.tagName}.${el.className}#${el.id}`);
        console.log(`     Text: "${el.textContent}"`);
      });
    } else {
      console.log('\n❌ No ARRASTE elements found');
    }

    if (scrollScripts.length > 0) {
      console.log('\n📜 Found scroll-related scripts:');
      scrollScripts.forEach((script, i) => {
        console.log(`  ${i + 1}. ${script.src || 'inline'}`);
      });
    }

    if (gallerySection.length > 0) {
      console.log('\n🖼️ Found gallery sections:');
      gallerySection.forEach((section, i) => {
        console.log(`  ${i + 1}. ${section.tagName}.${section.className}#${section.id}`);
        console.log(`     Children: ${section.children.length}`);
      });
    }

  } catch (error) {
    console.error('❌ Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapeEstrelaUrbanidade().catch(console.error); 