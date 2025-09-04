#!/usr/bin/env node

/**
 * Test current Instagram access token to see what error we're getting
 */

const accessToken = 'EAAO02FobKA0BPGvNQcZBTldwu3WmYPTXEYhimDj3CpaZB3llSU7DEmLrPXu5ExyWzzatYizFzjFMr1FkL3NeDkAG19QeKqeXMVFZAg6XlJfoOeW38SCOxGVhT2wiX2eZCoz2I7oezQ4NB2ZA2239xlBnpKj4zCOvkaaSfB6vVtSDyNwZC6SPUDru9QEEWT4r3lwdD6YQ0Ib2ZATYTNusRbyR8QxjL6LxSZCzVitmmUX83wLfwh6U2AgXsA1YeI7s';
const igAccountId = '17841414374322086';

async function testToken() {
  console.log('🔍 Testing current Instagram access token...\n');
  
  // Test 1: Check if token is valid by fetching account info
  console.log('1️⃣ Testing account access...');
  try {
    const accountUrl = `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username,profile_picture_url&access_token=${accessToken}`;
    console.log('   URL:', accountUrl);
    
    const accountResponse = await fetch(accountUrl);
    const accountData = await accountResponse.json();
    
    if (accountResponse.ok) {
      console.log('   ✅ Account access successful!');
      console.log('   Account ID:', accountData.id);
      console.log('   Username:', accountData.username || 'N/A');
    } else {
      console.log('   ❌ Account access failed:');
      console.log('   Status:', accountResponse.status);
      console.log('   Error:', accountData);
    }
  } catch (error) {
    console.log('   ❌ Account access error:', error.message);
  }
  
  console.log('\n');
  
  // Test 2: Try to fetch media
  console.log('2️⃣ Testing media access...');
  try {
    const mediaUrl = `https://graph.facebook.com/v18.0/${igAccountId}/media?fields=id,media_url,permalink,media_type,timestamp,caption&limit=3&access_token=${accessToken}`;
    console.log('   URL:', mediaUrl);
    
    const mediaResponse = await fetch(mediaUrl);
    const mediaData = await mediaResponse.json();
    
    if (mediaResponse.ok) {
      console.log('   ✅ Media access successful!');
      console.log('   Posts found:', mediaData.data?.length || 0);
      if (mediaData.data && mediaData.data.length > 0) {
        console.log('   First post ID:', mediaData.data[0].id);
        console.log('   Media type:', mediaData.data[0].media_type);
      }
    } else {
      console.log('   ❌ Media access failed:');
      console.log('   Status:', mediaResponse.status);
      console.log('   Error:', mediaData);
      
      if (mediaData.error) {
        console.log('   Error Code:', mediaData.error.code);
        console.log('   Error Type:', mediaData.error.type);
        console.log('   Error Message:', mediaData.error.message);
        console.log('   Error Subcode:', mediaData.error.error_subcode);
      }
    }
  } catch (error) {
    console.log('   ❌ Media access error:', error.message);
  }
  
  console.log('\n');
  
  // Test 3: Check token info
  console.log('3️⃣ Testing token info...');
  try {
    const tokenUrl = `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`;
    console.log('   URL:', tokenUrl);
    
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();
    
    if (tokenResponse.ok) {
      console.log('   ✅ Token info successful!');
      console.log('   Token belongs to:', tokenData.name || tokenData.id);
    } else {
      console.log('   ❌ Token info failed:');
      console.log('   Status:', tokenResponse.status);
      console.log('   Error:', tokenData);
    }
  } catch (error) {
    console.log('   ❌ Token info error:', error.message);
  }
  
  console.log('\n📋 Test completed!');
}

testToken().catch(console.error);