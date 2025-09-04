const fs = require('fs');
const path = require('path');

// Fix NavBar.css
const navbarPath = path.join(__dirname, '../tokens/NavBar.css');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');
navbarContent = navbarContent.replace(/var\(--font-family-overused-grotesk\)/g, 'var(--font-overused-grotesk)');
fs.writeFileSync(navbarPath, navbarContent);

// Fix reset.css
const resetPath = path.join(__dirname, '../styles/reset.css');
let resetContent = fs.readFileSync(resetPath, 'utf8');
resetContent = resetContent.replace(/var\(--font-family-overused-grotesk\)/g, 'var(--font-overused-grotesk)');
fs.writeFileSync(resetPath, resetContent);

console.log('✅ Fixed font family variables in NavBar.css and reset.css'); 