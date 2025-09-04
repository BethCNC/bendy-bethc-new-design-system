#!/usr/bin/env node

/**
 * Instagram Token Renewal Guide
 * 
 * This script provides step-by-step instructions to generate a new Instagram access token
 */

console.log('🔑 Instagram Access Token Renewal Guide\n');

console.log('📋 Your current token expired on: Friday, 01-Aug-25 03:00:00 PDT');
console.log('🆔 Instagram Business Account ID: 17841414374322086\n');

console.log('🚀 Steps to get a new access token:\n');

console.log('1️⃣ Go to Meta Developer Console:');
console.log('   🌐 https://developers.facebook.com/apps\n');

console.log('2️⃣ Find your Facebook app (the one connected to your Instagram account)');
console.log('   📱 Look for the app you used to set up Instagram Basic Display API\n');

console.log('3️⃣ Go to Instagram Basic Display → Basic Display:');
console.log('   🔧 Click on your app → Instagram Basic Display → Basic Display\n');

console.log('4️⃣ Generate User Token:');
console.log('   🎯 Click "Generate Token" next to your Instagram account');
console.log('   🔐 This will give you a short-lived token (1 hour)\n');

console.log('5️⃣ Exchange for Long-Lived Token:');
console.log('   📞 Use this URL format (replace YOUR_SHORT_TOKEN and YOUR_APP_SECRET):');
console.log('   🌐 https://graph.instagram.com/access_token');
console.log('      ?grant_type=ig_exchange_token');
console.log('      &client_secret=YOUR_APP_SECRET');
console.log('      &access_token=YOUR_SHORT_TOKEN\n');

console.log('6️⃣ Alternative - Use Graph API Explorer:');
console.log('   🌐 https://developers.facebook.com/tools/explorer/');
console.log('   🔧 Select your app → Get User Access Token → instagram_basic');
console.log('   📊 Make a GET request to: me/accounts');
console.log('   🎯 Find your Instagram Business Account ID in the response\n');

console.log('7️⃣ Test your new token:');
console.log('   🧪 Use the test script: node scripts/test-current-instagram-token.js\n');

console.log('📝 What you need to provide:');
console.log('   • Your Facebook App ID');
console.log('   • Your Facebook App Secret');
console.log('   • Access to your Meta Developer Console\n');

console.log('❓ Do you have access to your Meta Developer Console? (Y/N)');

// Interactive prompt
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n✅ Great! Please follow the steps above to get your new token.');
    console.log('🔄 Once you have the new token, we can update the API.');
  } else {
    console.log('\n❌ You\'ll need access to your Meta Developer Console first.');
    console.log('🔑 If you don\'t have the login details, you may need to:');
    console.log('   • Reset your Facebook developer account password');
    console.log('   • Create a new Facebook app and Instagram connection');
    console.log('   • Contact someone who has access to your developer account');
  }
  
  console.log('\n💡 Need help with any of these steps? Let me know!');
  rl.close();
});

// Graceful exit
rl.on('close', () => {
  process.exit(0);
});