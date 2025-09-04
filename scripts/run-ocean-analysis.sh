#!/bin/bash

# Ocean Agency Animation Analysis Runner
echo "🌊 Starting The Ocean Agency Animation Analysis..."

# Check if puppeteer is installed
if ! node -e "require('puppeteer')" 2>/dev/null; then
    echo "📦 Installing puppeteer..."
    npm install puppeteer
fi

# Run the analysis
echo "🚀 Running animation analysis..."
node analyze-ocean-agency-animations.js

echo "✅ Analysis complete! Check the generated files:"
echo "   - ocean-agency-animation-analysis.json"
echo "   - ocean-agency-animation-report.md"
echo "   - ocean-agency-initial.png"
echo "   - ocean-agency-scrolled.png" 