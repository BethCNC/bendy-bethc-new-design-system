# Figma Component Automation Script

## 🔒 Safety-First Design System Integration

This automation script safely extracts component details from Figma, matches them with your existing design system tokens, and generates components using **ONLY** existing design system tokens. It includes comprehensive safety measures to ensure the core design system is never modified.

## 🚨 Safety Guarantees

- ✅ **NEVER modifies core design system files**
- ✅ **ONLY uses existing design system tokens**
- ✅ **Generates files in `/examples/` directory only**
- ✅ **Validates all token references exist**
- ✅ **Prevents hardcoded values**
- ✅ **Enforces accessibility requirements**
- ✅ **Stops on any safety violation**

## 📁 File Structure

```
scripts/
├── figma-component-automation.js    # Main automation script
├── modules/
│   ├── figma-extractor.js          # Figma data extraction (READ-ONLY)
│   ├── design-system-matcher.js    # Token matching with existing system
│   ├── component-generator.js      # Component generation
│   └── safety-validator.js         # Safety validation and enforcement
├── config/
│   └── component-config.js         # Component definitions and settings
├── test/
│   └── test-runner.js              # Test suite
└── README.md                       # This file
```

## 🚀 Quick Start

### 1. Setup Environment Variables

```bash
# Required for Figma API access
export FIGMA_API_KEY="your-figma-api-key"
export FIGMA_FILE_KEY="your-figma-file-key"
```

### 2. Configure Components

Edit `config/component-config.js` to define which components to process:

```javascript
components: [
    {
        name: 'Primary Button',
        figmaNodeId: '1:2', // Your actual Figma node ID
        type: 'button',
        variants: ['primary', 'secondary', 'neutral'],
        sizes: ['sm', 'md', 'lg', 'xl']
    }
    // Add more components...
]
```

### 3. Run the Automation

```bash
# Install dependencies
npm install

# Run the automation
npm start

# Or run directly
node figma-component-automation.js
```

## 📋 What Gets Generated

For each component, the script generates:

### 1. Demo HTML File
- Interactive component showcase
- All variants and sizes
- State demonstrations (hover, focus, active, disabled)
- Accessibility features display

### 2. CSS File
- Component styles using design system tokens only
- All required states (default, hover, active, focus, disabled)
- Responsive typography
- Accessibility compliance

### 3. Documentation
- Component usage guide
- Token mapping documentation
- Accessibility features
- Safety compliance notes

### 4. Test File
- Automated compliance tests
- Accessibility validation
- Visual regression tests

## 🔧 Configuration Options

### Safety Settings

```javascript
safety: {
    maxComponentsPerRun: 10,        // Limit components per run
    requireApproval: false,         // Manual approval for each component
    stopOnError: true,             // Stop on first error
    validateTokensFirst: true,     // Validate tokens before processing
    createBackup: false            // Create backup before processing
}
```

### Output Settings

```javascript
output: {
    componentsDir: 'design-system/examples',
    generateDemos: true,
    generateDocs: true,
    generateTests: true
}
```

## 🛡️ Safety Validation

The script includes multiple layers of safety validation:

### 1. Pre-Flight Checks
- Verifies protected files exist and are untouched
- Validates design system token availability
- Checks output directory permissions

### 2. Figma Data Validation
- Ensures READ-ONLY extraction
- Validates data structure
- Prevents system modification attempts

### 3. Token Mapping Validation
- Verifies all tokens exist in design system
- Prevents hardcoded values
- Blocks new token creation attempts

### 4. Generated File Validation
- Ensures files are in allowed directories only
- Validates no protected file references
- Checks accessibility compliance

## 🚫 What's Protected

The script **NEVER** modifies these files:

- `design-system/src/complete-design-system.css`
- `design-system/css/design-system.css`
- `variables/*.json`
- `tokens/index.css`
- `.cursor/rules/*.mdc`

## 📊 Generated Output

### Example Component Structure

```
design-system/examples/primary-button/
├── primary-button-demo.html      # Interactive demo
├── primary-button.css            # Component styles
├── primary-button-docs.md        # Documentation
└── primary-button-test.html      # Test file
```

### Demo Features

- **Interactive States**: Hover, focus, active, disabled
- **All Variants**: Primary, secondary, neutral, destructive, etc.
- **All Sizes**: Small, medium, large, extra large
- **Accessibility**: Focus indicators, ARIA labels, keyboard navigation
- **Responsive**: Mobile-first design with responsive typography

## 🔍 Monitoring and Logging

### Automation Report

After each run, the script generates:

- **Console Output**: Real-time progress and results
- **JSON Report**: Detailed results in `design-system/examples/automation-report.json`
- **Error Log**: Any failures in `design-system/examples/error-log.json`

### Report Contents

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "summary": {
    "total": 10,
    "successful": 8,
    "failed": 2,
    "safetyViolations": 0
  },
  "processed": [...],
  "failed": [...],
  "safetyViolations": []
}
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

- **Safety Validation**: All protection rules enforced
- **Token Validation**: All tokens exist in design system
- **Accessibility**: Focus states, contrast ratios, ARIA labels
- **Component Generation**: Proper HTML structure and CSS
- **Error Handling**: Graceful failure and recovery

## 🚨 Error Handling

### Common Issues

1. **Missing Figma API Key**
   ```
   Solution: Set FIGMA_API_KEY environment variable
   ```

2. **Invalid Figma Node ID**
   ```
   Solution: Check node ID in Figma and update config
   ```

3. **Missing Design System Tokens**
   ```
   Solution: Ensure design system is built and tokens are available
   ```

4. **Safety Violations**
   ```
   Solution: Review generated files and fix any hardcoded values
   ```

### Recovery

- Script stops on first error by default
- All generated files are in `/examples/` directory (safe)
- No core design system files are modified
- Detailed error logs help with debugging

## 🔄 Workflow Integration

### Design System Workflow

1. **Design in Figma** → Apply semantic tokens
2. **Export Tokens** → Update `variables/*.json`
3. **Build System** → Run `npx style-dictionary build`
4. **Run Automation** → Extract and generate components
5. **Review Output** → Check generated demos and tests

### Continuous Integration

```yaml
# Example CI/CD integration
- name: Run Figma Component Automation
  run: |
    cd scripts
    npm install
    npm start
  env:
    FIGMA_API_KEY: ${{ secrets.FIGMA_API_KEY }}
    FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
```

## 📚 Best Practices

### 1. Component Configuration
- Use descriptive names
- Include all variants and sizes
- Set proper safety rules
- Test with small batches first

### 2. Token Mapping
- Always use existing tokens
- Provide fallbacks for missing tokens
- Document token decisions
- Validate all mappings

### 3. Safety First
- Never modify core files
- Always generate in examples directory
- Validate all outputs
- Test thoroughly before production use

## 🆘 Support

### Troubleshooting

1. **Check logs**: Review console output and error logs
2. **Validate config**: Ensure component configuration is correct
3. **Test tokens**: Verify design system tokens are available
4. **Check permissions**: Ensure write access to examples directory

### Getting Help

- Review the generated documentation
- Check the automation report
- Examine the error logs
- Test with mock data first

## 📄 License

MIT License - See LICENSE file for details.

---

**Remember**: This script is designed with safety as the top priority. It will never modify your core design system files and will always generate components using only existing design system tokens.
