#!/usr/bin/env node

/**
 * Test your current Instagram token directly
 */

const yourToken = 'IGAAIn9LFq4mNBZAE10REFYYi1RS2VUd2pVY1VFLVBFbTRvaTZASVG9PakF6VEp0d1hjTDNNS1luVmJPRG9NZAC11YWxSamRmWklscHFsMTB2V2NiMDFIcS1mSkh6SDdEWHZAqdlhwVnoxdDhUcmM3LW52ak1ucGRzQko5NFdOWlp2cwZDZD';
const igAccountId = '17841414374322086';

async function testCurrentToken() {
  console.log('🧪 Testing your current Instagram token...\n');
  console.log('🔑 Token:', yourToken.substring(0, 20) + '...');
  console.log('📱 Instagram Account ID:', igAccountId);
  console.log('');

  // Test 1: Direct Instagram Graph API (new method)
  console.log('1️⃣ Testing with Instagram Graph API...');
  try {
    const url1 = `https://graph.instagram.com/me?fields=id,username&access_token=${yourToken}`;
    console.log('   URL:', url1);
    
    const response1 = await fetch(url1);
    const data1 = await response1.json();
    
    if (response1.ok) {
      console.log('   ✅ Instagram Graph API works!');
      console.log('   Account ID:', data1.id);
      console.log('   Username:', data1.username || 'N/A');
      
      // Test media
      const mediaUrl = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption&limit=3&access_token=${yourToken}`;
      const mediaResponse = await fetch(mediaUrl);
      const mediaData = await mediaResponse.json();
      
      if (mediaResponse.ok && mediaData.data) {
        console.log('   📸 Found', mediaData.data.length, 'posts!');
        console.log('   🎉 THIS TOKEN WORKS! We can use it directly!');
        
        console.log('\n🔧 Your working token:');
        console.log('━'.repeat(80));
        console.log(yourToken);
        console.log('━'.repeat(80));
        
        console.log('\nℹ️  Token type: Instagram User Access Token (works directly with Instagram Graph API)');
        
        return true;
      }
    } else {
      console.log('   ❌ Instagram Graph API failed:');
      console.log('   Status:', response1.status);
      console.log('   Error:', data1);
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n');

  // Test 2: Facebook Graph API (older method)
  console.log('2️⃣ Testing with Facebook Graph API...');
  try {
    const url2 = `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username&access_token=${yourToken}`;
    console.log('   URL:', url2);
    
    const response2 = await fetch(url2);
    const data2 = await response2.json();
    
    if (response2.ok) {
      console.log('   ✅ Facebook Graph API works too!');
      console.log('   Account ID:', data2.id);
      console.log('   Username:', data2.username || 'N/A');
    } else {
      console.log('   ❌ Facebook Graph API failed:');
      console.log('   Status:', response2.status);
      console.log('   Error:', data2);
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  return false;
}

testCurrentToken().then((success) => {
  if (success) {
    console.log('\n🎯 RESULT: Your token works! I can update your API now.');
  } else {
    console.log('\n🔄 RESULT: Need to try a different approach.');
  }
});