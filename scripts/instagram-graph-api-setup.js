/**
 * Instagram Graph API Token Generator
 * Updated for the new Instagram Graph API (replaces deprecated Basic Display)
 */

const https = require('https');

console.log('📸 Instagram Graph API Setup Guide');
console.log('===================================\n');

console.log('📋 Prerequisites:');
console.log('1. ✅ Instagram Business or Creator account');
console.log('2. ✅ Facebook Page connected to your Instagram');
console.log('3. ✅ Facebook App with Instagram Graph API product\n');

console.log('🔧 Setup Steps:');
console.log('===============\n');

console.log('Step 1: Convert Instagram to Business/Creator');
console.log('- Open Instagram app');
console.log('- Settings > Account > Switch to Professional Account');
console.log('- Choose "Creator" or "Business"\n');

console.log('Step 2: Connect Facebook Page');
console.log('- Instagram Settings > Account > Linked Accounts > Facebook');
console.log('- Connect to a Facebook Page (create one if needed)\n');

console.log('Step 3: Get Page Access Token');
console.log('- Go to Facebook Developer Console');
console.log('- Tools > Graph API Explorer');
console.log('- Select your app');
console.log('- Generate User Access Token with pages_show_list permission');
console.log('- Use this token to get page access token:\n');

console.log('📡 API Calls to Make:');
console.log('====================\n');

console.log('1. Get your pages:');
console.log('GET https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_USER_TOKEN\n');

console.log('2. Find the page connected to Instagram and copy its access_token\n');

console.log('3. Test Instagram connection:');
console.log('GET https://graph.facebook.com/v18.0/PAGE_ID?fields=instagram_business_account&access_token=PAGE_ACCESS_TOKEN\n');

console.log('4. Test getting Instagram posts:');
console.log('GET https://graph.facebook.com/v18.0/INSTAGRAM_ACCOUNT_ID/media?fields=id,media_url,permalink,media_type,timestamp,caption&access_token=PAGE_ACCESS_TOKEN\n');

console.log('🎯 Quick Test Function:');
console.log('=====================\n');

function testPageToken(pageAccessToken) {
  if (!pageAccessToken) {
    console.log('❌ No page access token provided');
    return;
  }

  console.log('🧪 Testing page access token...\n');
  
  // First, get page info and Instagram connection
  const pageUrl = `https://graph.facebook.com/v18.0/me?fields=name,instagram_business_account{id,username}&access_token=${pageAccessToken}`;
  
  https.get(pageUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        
        if (res.statusCode === 200) {
          console.log('✅ Page token is valid!');
          console.log('Page Name:', parsed.name);
          
          if (parsed.instagram_business_account) {
            console.log('✅ Instagram Business Account connected!');
            console.log('Instagram ID:', parsed.instagram_business_account.id);
            console.log('Instagram Username:', parsed.instagram_business_account.username);
            
            // Test getting media
            testInstagramMedia(parsed.instagram_business_account.id, pageAccessToken);
          } else {
            console.log('❌ No Instagram Business Account connected to this page');
            console.log('Make sure your Instagram is connected to this Facebook Page');
          }
        } else {
          console.log('❌ Page token test failed:');
          console.log(JSON.stringify(parsed, null, 2));
        }
      } catch (err) {
        console.error('❌ Failed to parse response:', err);
        console.log('Raw response:', data);
      }
    });
  }).on('error', (err) => {
    console.error('❌ Request failed:', err);
  });
}

function testInstagramMedia(instagramAccountId, pageAccessToken) {
  console.log('\n📱 Testing Instagram media fetch...');
  
  const mediaUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media?fields=id,media_url,permalink,media_type,timestamp,caption&limit=3&access_token=${pageAccessToken}`;
  
  https.get(mediaUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        
        if (res.statusCode === 200) {
          console.log('✅ Instagram media fetch successful!');
          console.log('Posts found:', parsed.data?.length || 0);
          
          if (parsed.data && parsed.data.length > 0) {
            console.log('\n📸 Sample post:');
            const post = parsed.data[0];
            console.log('ID:', post.id);
            console.log('Type:', post.media_type);
            console.log('Date:', post.timestamp);
            console.log('Caption:', post.caption ? post.caption.substring(0, 100) + '...' : 'No caption');
          }
          
          console.log('\n🎉 Setup is complete! Add this token to your .env.local:');
          console.log(`INSTAGRAM_ACCESS_TOKEN=${pageAccessToken}`);
        } else {
          console.log('❌ Instagram media fetch failed:');
          console.log(JSON.stringify(parsed, null, 2));
        }
      } catch (err) {
        console.error('❌ Failed to parse media response:', err);
      }
    });
  }).on('error', (err) => {
    console.error('❌ Media request failed:', err);
  });
}

// Uncomment and add your page access token to test:
// testPageToken('YOUR_PAGE_ACCESS_TOKEN_HERE');

console.log('💡 To test a token, uncomment the last line and add your page access token');
