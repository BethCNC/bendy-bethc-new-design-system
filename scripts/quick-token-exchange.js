#!/usr/bin/env node

/**
 * Quick token exchange script
 * Run this after you get a short-lived token from Meta Developer Console
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔄 Quick Instagram Token Exchange\n');

function askForToken() {
  rl.question('📝 Enter your short-lived token from Meta Developer Console: ', (shortToken) => {
    if (!shortToken || shortToken.trim() === '') {
      console.log('❌ Please provide a valid token');
      askForToken();
      return;
    }
    
    rl.question('🔑 Enter your Facebook App Secret: ', (appSecret) => {
      if (!appSecret || appSecret.trim() === '') {
        console.log('❌ Please provide your app secret');
        askForToken();
        return;
      }
      
      exchangeToken(shortToken.trim(), appSecret.trim());
    });
  });
}

async function exchangeToken(shortToken, appSecret) {
  console.log('\n🔄 Exchanging token for long-lived version...\n');
  
  try {
    const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`;
    
    console.log('📞 Making request to Instagram Graph API...');
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.access_token) {
      console.log('✅ SUCCESS! Long-lived token generated:\n');
      console.log('🔑 New Access Token:');
      console.log(data.access_token);
      console.log('\n⏰ Expires in:', data.expires_in, 'seconds');
      console.log('📅 That\'s approximately:', Math.floor(data.expires_in / (60 * 60 * 24)), 'days\n');
      
      console.log('🔧 Next steps:');
      console.log('1. Copy the token above');
      console.log('2. Update your Instagram API route with the new token');
      console.log('3. Test with: node scripts/test-current-instagram-token.js\n');
      
      // Test the new token immediately
      console.log('🧪 Testing new token...');
      await testNewToken(data.access_token);
      
    } else {
      console.log('❌ Failed to exchange token:');
      console.log('Status:', response.status);
      console.log('Error:', data);
      
      if (data.error) {
        console.log('\n💡 Common fixes:');
        console.log('• Check that your App Secret is correct');
        console.log('• Make sure the short-lived token is valid');
        console.log('• Verify your Instagram account is connected to a Facebook Page');
      }
    }
  } catch (error) {
    console.log('❌ Error exchanging token:', error.message);
  }
  
  rl.close();
}

async function testNewToken(newToken) {
  const igAccountId = '17841414374322086';
  
  try {
    const testUrl = `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username&access_token=${newToken}`;
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ New token works! Account ID:', data.id);
      if (data.username) {
        console.log('📱 Username:', data.username);
      }
    } else {
      console.log('⚠️  Token exchange successful but test failed:', data.error?.message);
    }
  } catch (error) {
    console.log('⚠️  Could not test new token:', error.message);
  }
}

console.log('📋 Instructions:');
console.log('1. Go to: https://developers.facebook.com/apps');
console.log('2. Select your app → Instagram Basic Display → Basic Display');
console.log('3. Click "Generate Token" next to your Instagram account');
console.log('4. Copy the short-lived token and paste it below\n');

askForToken();