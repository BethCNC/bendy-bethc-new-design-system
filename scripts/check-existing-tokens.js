#!/usr/bin/env node

/**
 * Check if there are any other tokens we should be using
 */

console.log('🔍 Let\'s check if you have other tokens available\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📋 In your Meta Developer Console, do you see:');
console.log('1. Any section showing "Current Tokens" or "Active Tokens"?');
console.log('2. Any tokens with expiration dates listed?');
console.log('3. Any "Generate New Token" or "Refresh Token" buttons?');
console.log('');

rl.question('What do you see in the "Generate access tokens" section when you click on it? (describe what appears): ', (answer) => {
  console.log('\n📝 You said:', answer);
  console.log('\n💡 Based on that, here\'s what we should do next:');
  
  if (answer.toLowerCase().includes('token') || answer.toLowerCase().includes('generate')) {
    console.log('✅ It sounds like you can generate a new token there!');
    console.log('🔄 Please generate a new token and we\'ll use that.');
    console.log('📅 Even if you did this before, tokens expire every 60 days max.');
  } else if (answer.toLowerCase().includes('nothing') || answer.toLowerCase().includes('empty')) {
    console.log('🤔 If nothing appears, we\'ll use the Graph API Explorer method.');
    console.log('🌐 Go to: https://developers.facebook.com/tools/explorer/');
  } else {
    console.log('🔧 Let\'s try the Graph API Explorer method to be safe.');
    console.log('🌐 Go to: https://developers.facebook.com/tools/explorer/');
  }
  
  console.log('\n❓ Would you like me to walk you through either method?');
  rl.close();
});