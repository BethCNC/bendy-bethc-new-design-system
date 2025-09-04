#!/usr/bin/env node

/**
 * Exchange the Instagram token for a long-lived version
 */

const shortToken = 'IGAAIn9LFq4mNBZAE10REFYYi1RS2VUd2pVY1VFLVBFbTRvaTZASVG9PakF6VEp0d1hjTDNNS1luVmJPRG9NZAC11YWxSamRmWklscHFsMTB2V2NiMDFIcS1mSkh6SDdEWHZAqdlhwVnoxdDhUcmM3LW52ak1ucGRzQko5NFdOWlp2cwZDZD';

async function exchangeToken() {
  console.log('🔄 Exchanging Instagram token for long-lived version...\n');
  
  try {
    // For Instagram Basic Display API, we use this endpoint
    const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=${shortToken}`;
    
    console.log('❓ I need your Instagram App Secret to exchange the token.');
    console.log('📍 In your Meta Developer Console, click "Show" next to "Instagram app secret"\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('🔑 Please enter your Instagram App Secret: ', async (appSecret) => {
      if (!appSecret || appSecret.trim() === '') {
        console.log('❌ Please provide a valid app secret');
        rl.close();
        return;
      }
      
      try {
        const exchangeUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret.trim()}&access_token=${shortToken}`;
        
        console.log('\n📞 Making request to Instagram Graph API...');
        
        const response = await fetch(exchangeUrl);
        const data = await response.json();
        
        if (response.ok && data.access_token) {
          console.log('✅ SUCCESS! Long-lived token generated:\n');
          console.log('🔑 New Long-lived Access Token:');
          console.log('━'.repeat(80));
          console.log(data.access_token);
          console.log('━'.repeat(80));
          console.log('\n⏰ Expires in:', data.expires_in, 'seconds');
          console.log('📅 That\'s approximately:', Math.floor(data.expires_in / (60 * 60 * 24)), 'days\n');
          
          // Test the new token immediately
          console.log('🧪 Testing new token...');
          await testNewToken(data.access_token);
          
          console.log('\n🔧 Next step:');
          console.log('I\'ll now update your Instagram API with this new token!\n');
          
          // Save the token for updating the API
          process.env.NEW_INSTAGRAM_TOKEN = data.access_token;
          
        } else {
          console.log('❌ Failed to exchange token:');
          console.log('Status:', response.status);
          console.log('Response:', data);
          
          if (data.error) {
            console.log('\n💡 Error details:');
            console.log('• Code:', data.error.code);
            console.log('• Type:', data.error.type);  
            console.log('• Message:', data.error.message);
            
            if (data.error.message.includes('Invalid client_secret')) {
              console.log('\n🔧 Fix: Double-check your Instagram App Secret');
            }
          }
        }
      } catch (error) {
        console.log('❌ Error exchanging token:', error.message);
      }
      
      rl.close();
    });
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function testNewToken(newToken) {
  // Test with your Instagram account ID
  const igAccountId = '17841414374322086';
  
  try {
    const testUrl = `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username&access_token=${newToken}`;
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ New token works perfectly!');
      console.log('📱 Account ID:', data.id);
      if (data.username) {
        console.log('📱 Username:', data.username);
      }
      
      // Test media access too
      const mediaUrl = `https://graph.facebook.com/v18.0/${igAccountId}/media?fields=id,media_type&limit=1&access_token=${newToken}`;
      const mediaResponse = await fetch(mediaUrl);
      const mediaData = await mediaResponse.json();
      
      if (mediaResponse.ok && mediaData.data && mediaData.data.length > 0) {
        console.log('📸 Media access confirmed - found', mediaData.data.length, 'posts');
      }
      
    } else {
      console.log('⚠️  Token exchange successful but test failed:');
      console.log('   Error:', data.error?.message);
    }
  } catch (error) {
    console.log('⚠️  Could not test new token:', error.message);
  }
}

exchangeToken();