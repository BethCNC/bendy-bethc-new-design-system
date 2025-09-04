#!/bin/bash

# Figma Component Analysis Script
echo "🎨 Figma Component Analysis"
echo "=========================="
echo ""

# Check if FIGMA_ACCESS_TOKEN is set
if [ -z "$FIGMA_ACCESS_TOKEN" ]; then
    echo "❌ Error: FIGMA_ACCESS_TOKEN environment variable is not set"
    echo ""
    echo "Please set your Figma access token:"
    echo "export FIGMA_ACCESS_TOKEN='your_token_here'"
    echo ""
    echo "You can get your token from: https://www.figma.com/developers/api#access-tokens"
    exit 1
fi

echo "✅ Figma access token found"
echo ""

# Run the TypeScript analysis
echo "🔍 Running component analysis..."
npx tsx scripts/extract-figma-component-details.ts

echo ""
echo "📁 Check the 'data/figma-analysis' directory for results"
echo ""
echo "Files generated:"
echo "  - component-16-13565-details.json (raw Figma data)"
echo "  - component-16-13565-css-mapping.json (CSS class mapping)"
echo "  - component-16-13565-analysis.md (analysis report)" 