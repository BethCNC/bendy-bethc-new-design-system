/**
 * Instagram API Diagnosis Tool
 * Tests both old and new API endpoints to see what's working
 */

const https = require('https');
require('dotenv').config({ path: '.env.local' });

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

console.log('🔍 Instagram API Diagnosis');
console.log('===========================\n');

if (!accessToken) {
  console.log('❌ No INSTAGRAM_ACCESS_TOKEN found in .env.local');
  process.exit(1);
}

console.log('Token found:', accessToken.substring(0, 20) + '...');
console.log('Token length:', accessToken.length);
console.log('Token type:', accessToken.startsWith('EAAO') ? 'User Token' : accessToken.startsWith('IGQV') ? 'Instagram Token' : 'Unknown');

// Test 1: Old Basic Display API (should fail)
console.log('\n🧪 Test 1: Old Instagram Basic Display API');
console.log('==========================================');

function testOldAPI() {
  const oldUrl = `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`;
  
  https.get(oldUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        
        if (res.statusCode === 200) {
          console.log('✅ Old API still works (unexpected)');
          console.log('User:', parsed.username);
          testOldMediaAPI();
        } else {
          console.log('❌ Old API failed (expected)');
          console.log('Error:', parsed.error?.message || 'Unknown error');
          testNewAPI();
        }
      } catch (err) {
        console.log('❌ Old API response parse error');
        testNewAPI();
      }
    });
  }).on('error', (err) => {
    console.log('❌ Old API network error');
    testNewAPI();
  });
}

function testOldMediaAPI() {
  console.log('Testing old media endpoint...');
  
  const mediaUrl = `https://graph.instagram.com/me/media?fields=id,media_url,permalink&limit=1&access_token=${accessToken}`;
  
  https.get(mediaUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        
        if (res.statusCode === 200) {
          console.log('✅ Old media API works');
          console.log('Posts found:', parsed.data?.length || 0);
        } else {
          console.log('❌ Old media API failed');
          console.log('Error:', parsed.error?.message || 'Unknown error');
        }
        
        testNewAPI();
      } catch (err) {
        testNewAPI();
      }
    });
  });
}

// Test 2: New Facebook Graph API
function testNewAPI() {
  console.log('\n🧪 Test 2: New Facebook Graph API');
  console.log('=================================');
  
  // Test if token works with Facebook API
  const fbUrl = `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`;
  
  https.get(fbUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        
        if (res.statusCode === 200) {
          console.log('✅ Facebook API token works');
          console.log('User ID:', parsed.id);
          console.log('Name:', parsed.name);
          testPages();
        } else {
          console.log('❌ Facebook API failed');
          console.log('Error:', parsed.error?.message || 'Unknown error');
          
          if (parsed.error?.code === 190) {
            console.log('\n💡 Token is invalid or expired');
            console.log('Need to generate a new token via Facebook Graph API Explorer');
          }
          
          showSolution();
        }
      } catch (err) {
        console.log('❌ Facebook API parse error');
        showSolution();
      }
    });
  }).on('error', (err) => {
    console.log('❌ Facebook API network error');
    showSolution();
  });
}

function testPages() {
  console.log('\n🧪 Test 3: Facebook Pages & Instagram Connection');
  console.log('===============================================');
  
  const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?fields=name,access_token,instagram_business_account{id,username}&access_token=${accessToken}`;
  
  https.get(pagesUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        
        if (res.statusCode === 200) {
          console.log('✅ Pages API works');
          console.log('Pages found:', parsed.data?.length || 0);
          
          const instagramPage = parsed.data?.find(page => page.instagram_business_account);
          
          if (instagramPage) {
            console.log('✅ Instagram Business Account found!');
            console.log('Page:', instagramPage.name);
            console.log('Instagram ID:', instagramPage.instagram_business_account.id);
            console.log('Instagram Username:', instagramPage.instagram_business_account.username);
            
            console.log('\n🎉 SUCCESS! Use this page access token:');
            console.log(instagramPage.access_token);
            
            testInstagramMedia(instagramPage.instagram_business_account.id, instagramPage.access_token);
          } else {
            console.log('❌ No Instagram Business Account found');
            console.log('Make sure:');
            console.log('1. Your Instagram is a Business/Creator account');
            console.log('2. It\'s connected to a Facebook Page');
            console.log('3. You have the right permissions');
          }
        } else {
          console.log('❌ Pages API failed');
          console.log('Error:', parsed.error?.message || 'Unknown error');
        }
      } catch (err) {
        console.log('❌ Pages API parse error');
      }
      
      showSolution();
    });
  }).on('error', (err) => {
    console.log('❌ Pages API network error');
    showSolution();
  });
}

function testInstagramMedia(instagramId, pageToken) {
  console.log('\n🧪 Test 4: Instagram Media Fetch');
  console.log('================================');
  
  const mediaUrl = `https://graph.facebook.com/v18.0/${instagramId}/media?fields=id,media_url,permalink,media_type,timestamp&limit=3&access_token=${pageToken}`;
  
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
          
          if (parsed.data?.length > 0) {
            console.log('\n📸 Sample post:');
            const post = parsed.data[0];
            console.log('Type:', post.media_type);
            console.log('Date:', post.timestamp);
          }
        } else {
          console.log('❌ Instagram media fetch failed');
          console.log('Error:', parsed.error?.message || 'Unknown error');
        }
      } catch (err) {
        console.log('❌ Instagram media parse error');
      }
    });
  });
}

function showSolution() {
  console.log('\n🔧 SOLUTION');
  console.log('===========');
  console.log('1. Go to https://developers.facebook.com/tools/explorer/');
  console.log('2. Select your app: bendy_bethc');
  console.log('3. Generate User Access Token with permissions:');
  console.log('   - pages_show_list');
  console.log('   - pages_read_engagement');
  console.log('   - instagram_basic');
  console.log('4. Use that token to call: /me/accounts');
  console.log('5. Find your page with instagram_business_account');
  console.log('6. Use that page\'s access_token in your app');
}

// Start the diagnosis
testOldAPI();
