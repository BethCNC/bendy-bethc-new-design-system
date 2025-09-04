#!/usr/bin/env node

/**
 * Get Facebook Page Access Token for Instagram Graph API
 * This is the newer method that doesn't use Instagram Basic Display
 */

console.log('🔄 Getting Facebook Page Access Token for Instagram API...\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📋 Since you\'re using the newer Instagram Graph API (not Basic Display),');
console.log('we need to get a Facebook Page Access Token instead.\n');

console.log('🚀 Steps:');
console.log('1. Go to: https://developers.facebook.com/tools/explorer/');
console.log('2. Select your app: "bendy_bethc"');
console.log('3. Click "Get User Access Token"');
console.log('4. Select these permissions:');
console.log('   • pages_show_list');
console.log('   • pages_read_engagement');
console.log('   • instagram_basic');
console.log('5. Generate the token');
console.log('6. Make a GET request to: me/accounts');
console.log('7. Find your Instagram-connected page in the response\n');

rl.question('📝 Have you done steps 1-5 and got a User Access Token? (y/n): ', async (answer) => {
  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    console.log('\n⏸️  Please complete steps 1-5 first, then run this script again.');
    rl.close();
    return;
  }
  
  rl.question('🔑 Paste your User Access Token here: ', async (userToken) => {
    if (!userToken || userToken.trim() === '') {
      console.log('❌ Please provide a valid token');
      rl.close();
      return;
    }
    
    try {
      console.log('\n📞 Fetching your Facebook Pages...');
      
      const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${userToken.trim()}`;
      const response = await fetch(pagesUrl);
      const data = await response.json();
      
      if (response.ok && data.data) {
        console.log('✅ Found', data.data.length, 'Facebook Pages:\n');
        
        for (let i = 0; i < data.data.length; i++) {
          const page = data.data[i];
          console.log(`${i + 1}. ${page.name} (ID: ${page.id})`);
          
          // Check if this page has Instagram
          try {
            const igCheckUrl = `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`;
            const igResponse = await fetch(igCheckUrl);
            const igData = await igResponse.json();
            
            if (igData.instagram_business_account) {
              console.log(`   📱 Connected Instagram: ${igData.instagram_business_account.id}`);
              console.log(`   🔑 Page Access Token: ${page.access_token.substring(0, 20)}...`);
              
              if (igData.instagram_business_account.id === '17841414374322086') {
                console.log('   ✅ THIS IS YOUR INSTAGRAM ACCOUNT!\n');
                
                console.log('🎯 FOUND IT! Here\'s your Page Access Token:');
                console.log('━'.repeat(80));
                console.log(page.access_token);
                console.log('━'.repeat(80));
                
                // Test the token
                console.log('\n🧪 Testing this token with your Instagram account...');
                await testInstagramToken(page.access_token);
                
                rl.close();
                return;
              }
            } else {
              console.log('   ❌ No Instagram connected');
            }
          } catch (error) {
            console.log('   ⚠️  Could not check Instagram connection');
          }
          
          console.log('');
        }
        
        if (data.data.length === 0) {
          console.log('❌ No Facebook Pages found. You need a Facebook Page connected to your Instagram Business account.');
        }
        
      } else {
        console.log('❌ Failed to fetch pages:');
        console.log('Status:', response.status);
        console.log('Error:', data);
      }
      
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
    
    rl.close();
  });
});

async function testInstagramToken(pageToken) {
  const igAccountId = '17841414374322086';
  
  try {
    // Test 1: Account info
    const accountUrl = `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username&access_token=${pageToken}`;
    const accountResponse = await fetch(accountUrl);
    const accountData = await accountResponse.json();
    
    if (accountResponse.ok) {
      console.log('✅ Account access works!');
      console.log('📱 Username:', accountData.username || 'N/A');
    }
    
    // Test 2: Media access
    const mediaUrl = `https://graph.facebook.com/v18.0/${igAccountId}/media?fields=id,media_type,media_url&limit=2&access_token=${pageToken}`;
    const mediaResponse = await fetch(mediaUrl);
    const mediaData = await mediaResponse.json();
    
    if (mediaResponse.ok && mediaData.data) {
      console.log('📸 Media access works! Found', mediaData.data.length, 'posts');
      console.log('🎉 This token is ready to use in your API!');
    } else {
      console.log('⚠️  Media access issue:', mediaData.error?.message);
    }
    
  } catch (error) {
    console.log('⚠️  Test error:', error.message);
  }
}