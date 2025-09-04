const fs = require('fs');
const path = require('path');

// Read the utilities.css file
const filePath = path.join(__dirname, '../tokens/utilities.css');
let content = fs.readFileSync(filePath, 'utf8');

// Fix font family variable names
content = content.replace(/var\(--font-family-overused-grotesk\)/g, 'var(--font-overused-grotesk)');
content = content.replace(/var\(--font-family-behind-the-nineties\)/g, 'var(--font-behind-the-nineties)');
content = content.replace(/var\(--font-family-heading\)/g, 'var(--font-behind-the-nineties)');
content = content.replace(/var\(--font-family-body\)/g, 'var(--font-overused-grotesk)');
content = content.replace(/var\(--font-family-display\)/g, 'var(--font-behind-the-nineties)');

// Write the fixed content back
fs.writeFileSync(filePath, content);

console.log('✅ Fixed font family variable names in utilities.css'); 