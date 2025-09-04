/**
 * Direct Instagram Token Generator
 * Use this when OAuth flow is having issues
 * Run: node scripts/generate-instagram-token.js
 */

const https = require('https');

// Your app credentials from Facebook Developer Console
const APP_ID = '1043266247796749'; // From your screenshot
const APP_SECRET = 'PASTE_YOUR_APP_SECRET_HERE'; // Get this from Facebook console > Settings > Basic
const REDIRECT_URI = 'https://localhost:3000/auth/instagram/callback';

console.log('🔧 Instagram Token Generator for Development');
console.log('=====================================\n');

console.log('📋 Manual Token Generation Steps:');
console.log('1. Go to Facebook Developer Console');
console.log('2. Navigate to: Instagram > Basic Display');
console.log('3. Scroll to "User Token Generator" section');
console.log('4. Make sure your Instagram account is added as a test user');
console.log('5. Click "Generate Token" next to your account');
console.log('6. Copy the generated token (short-lived)');
console.log('7. Run the exchange command below with your token\n');

console.log('🔄 Token Exchange Command:');
console.log('Replace YOUR_SHORT_LIVED_TOKEN with the token from step 6:');
console.log(`curl -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=YOUR_SHORT_LIVED_TOKEN"`);

console.log('\n📝 Then update your .env.local with the long-lived token from the response');

// Test function to validate a token
function testToken(token) {
  if (!token) {
    console.log('❌ No token provided');
    return;
  }

  console.log('\n🧪 Testing token...');
  
  const testUrl = `https://graph.instagram.com/me?fields=id,username&access_token=${token}`;
  
  https.get(testUrl, (res) => {
    let data = '';
    
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
        } else {
          console.log('❌ Token test failed:');
          console.log(JSON.stringify(parsed, null, 2));
        }
      } catch (err) {
        console.error('❌ Failed to parse response:', err);
      }
    });
  }).on('error', (err) => {
    console.error('❌ Request failed:', err);
  });
}

// If you want to test a token, uncomment and add it here:
// testToken('YOUR_TOKEN_HERE');
