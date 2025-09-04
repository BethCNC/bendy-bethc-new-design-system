const https = require('https');
const { URL } = require('url');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!accessToken) {
  console.error('❌ INSTAGRAM_ACCESS_TOKEN not found in .env.local');
  process.exit(1);
}

console.log('🔍 Testing Instagram API token...');
console.log('Token format valid:', accessToken.startsWith('EAAO'));
console.log('Token length:', accessToken.length);

// Test basic user info
const testUrl = `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`;

https.get(testUrl, (res) => {
  let data = '';
  
  console.log('\n📡 Response Status:', res.statusCode);
  console.log('Response Headers:', res.headers);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      
      if (res.statusCode === 200) {
        console.log('✅ Token is valid!');
        console.log('User ID:', parsed.id);
        console.log('Username:', parsed.username);
        
        // Now test media endpoint
        testMediaEndpoint();
      } else {
        console.log('❌ Token validation failed:');
        console.log(JSON.stringify(parsed, null, 2));
        
        if (parsed.error) {
          console.log('\n🔧 Error Details:');
          console.log('Type:', parsed.error.type);
          console.log('Code:', parsed.error.code);
          console.log('Message:', parsed.error.message);
          
          if (parsed.error.type === 'OAuthException') {
            console.log('\n💡 This is likely a token expiration issue.');
            console.log('You need to regenerate your Instagram token.');
          }
        }
      }
    } catch (err) {
      console.error('❌ Failed to parse response:', err);
      console.log('Raw response:', data);
    }
  });
}).on('error', (err) => {
  console.error('❌ Request failed:', err);
});

function testMediaEndpoint() {
  console.log('\n🎬 Testing media endpoint...');
  
  const mediaUrl = `https://graph.instagram.com/me/media?fields=id,media_url,permalink,media_type,timestamp,caption&limit=3&access_token=${accessToken}`;
  
  https.get(mediaUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        
        if (res.statusCode === 200) {
          console.log('✅ Media endpoint works!');
          console.log('Posts found:', parsed.data?.length || 0);
          
          if (parsed.data && parsed.data.length > 0) {
            console.log('\n📱 Sample post:');
            const post = parsed.data[0];
            console.log('ID:', post.id);
            console.log('Type:', post.media_type);
            console.log('Date:', post.timestamp);
          }
        } else {
          console.log('❌ Media endpoint failed:');
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
