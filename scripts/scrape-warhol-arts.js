#!/usr/bin/env node

/**
 * Scrape Webflow site motion parameters
 * Target: https://warhol-arts.webflow.io/
 *
 * - Extract Webflow IX2 interaction state via Webflow.require('ix2').store.getState()
 * - Sample computed transforms/opacity across scroll positions
 * - Capture screenshots for visual reference
 * - Save to scripts/output/warhol-arts/
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function main() {
  const targetUrl = 'https://warhol-arts.webflow.io/';
  const outDir = path.resolve(__dirname, 'output/warhol-arts');
  await ensureDir(outDir);

  console.log('🔎 Launching headless browser to analyze motion...');
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    await sleep(3000); // allow Webflow to boot IX2

    console.log('✅ Page loaded. Extracting Webflow IX2 state...');
    const ix2State = await page.evaluate(() => {
      function safeClone(obj) {
        try { return JSON.parse(JSON.stringify(obj)); } catch { return null; }
      }
      try {
        if (window.Webflow && typeof window.Webflow.require === 'function') {
          const ix2 = window.Webflow.require('ix2');
          if (ix2 && ix2.store && typeof ix2.store.getState === 'function') {
            const state = ix2.store.getState();
            const data = state?.ixData || {};
            return {
              hasWebflow: true,
              version: ix2?.versions || null,
              mediaQueries: data.mediaQueries || null,
              events: data.events || null,
              actionLists: data.actionLists || null,
              triggers: data?.actionLists ? Object.keys(data.actionLists) : [],
            };
          }
        }
      } catch (err) {
        return { error: String(err) };
      }
      return { hasWebflow: false };
    });

    await fs.promises.writeFile(
      path.join(outDir, 'ix2-state.json'),
      JSON.stringify(ix2State, null, 2)
    );
    console.log('📝 Saved ix2-state.json');

    // Save HTML and list stylesheets
    console.log('🧩 Saving HTML and stylesheets list...');
    const html = await page.content();
    await fs.promises.writeFile(path.join(outDir, 'page.html'), html);

    const stylesheets = await page.evaluate(() =>
      Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map((l) => l.href)
    );
    await fs.promises.writeFile(
      path.join(outDir, 'stylesheets.json'),
      JSON.stringify(stylesheets, null, 2)
    );
    
    // Download a subset of CSS files
    const fetch = (await import('node-fetch')).default;
    const cssDir = path.join(outDir, 'css');
    await ensureDir(cssDir);
    for (let i = 0; i < Math.min(stylesheets.length, 8); i++) {
      try {
        const url = stylesheets[i];
        const res = await fetch(url);
        if (res.ok) {
          const text = await res.text();
          const fname = `style-${String(i).padStart(2, '0')}.css`;
          await fs.promises.writeFile(path.join(cssDir, fname), text);
        }
      } catch {}
    }

    // Sample transforms across scroll positions
    console.log('📸 Sampling transforms across scroll...');
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportH = 900;
    const maxScroll = Math.max(0, scrollHeight - viewportH);
    const steps = 12;
    const samples = [];

    for (let i = 0; i <= steps; i++) {
      const y = Math.floor((maxScroll * i) / steps);
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await sleep(450);

      const snap = await page.evaluate(() => {
        const out = [];
        const nodes = Array.from(document.querySelectorAll('*'));
        for (const el of nodes) {
          const cs = getComputedStyle(el);
          const t = cs.transform;
          if (t && t !== 'none') {
            const rect = el.getBoundingClientRect();
            if (rect.width > 160 && rect.height > 120) {
              out.push({
                tag: el.tagName.toLowerCase(),
                className: (el.className && String(el.className).slice(0, 200)) || '',
                transform: t,
                opacity: cs.opacity,
                willChange: cs.willChange,
                rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height }
              });
            }
          }
        }
        return { y: window.scrollY, count: out.length, items: out.slice(0, 60) };
      });
      samples.push(snap);

      const shotPath = path.join(outDir, `screenshot-${String(i).padStart(2, '0')}.png`);
      await page.screenshot({ path: shotPath });
    }

    await fs.promises.writeFile(
      path.join(outDir, 'transform-samples.json'),
      JSON.stringify({ url: targetUrl, samples }, null, 2)
    );
    console.log('🧾 Saved transform-samples.json and screenshots');

    // Capture 3D-related DOM nodes
    console.log('🧱 Scanning DOM for 3D containers (perspective/cube/walls)...');
    const threeD = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('*'));
      const results = [];
      const has3DFlags = (el, cs) => {
        const c = (el.className && String(el.className).toLowerCase()) || '';
        return (
          cs.perspective !== 'none' ||
          cs.transformStyle === 'preserve-3d' ||
          /cube|wall|face|side|tunnel/.test(c)
        );
      };
      for (const el of nodes) {
        const cs = getComputedStyle(el);
        if (has3DFlags(el, cs)) {
          const rect = el.getBoundingClientRect();
          results.push({
            tag: el.tagName.toLowerCase(),
            className: (el.className && String(el.className).slice(0, 200)) || '',
            perspective: cs.perspective,
            transform: cs.transform,
            transformStyle: cs.transformStyle,
            backfaceVisibility: cs.backfaceVisibility,
            transformOrigin: cs.transformOrigin,
            filter: cs.filter,
            boxShadow: cs.boxShadow,
            rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height }
          });
        }
      }
      return results.slice(0, 200);
    });
    await fs.promises.writeFile(
      path.join(outDir, 'three-d-containers.json'),
      JSON.stringify(threeD, null, 2)
    );
    console.log('🧱 Saved three-d-containers.json');

    // Also dump inline CSS variables for context
    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      const vars = {};
      for (let i = 0; i < styles.length; i++) {
        const name = styles[i];
        if (name.startsWith('--')) vars[name] = styles.getPropertyValue(name).trim();
      }
      return vars;
    });
    await fs.promises.writeFile(
      path.join(outDir, 'css-variables.json'),
      JSON.stringify(cssVars, null, 2)
    );
    console.log('🎛️  Saved css-variables.json');

    console.log(`✅ Analysis complete. Output -> ${outDir}`);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();


