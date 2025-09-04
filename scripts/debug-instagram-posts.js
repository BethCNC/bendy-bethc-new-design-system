#!/usr/bin/env node

/**
 * Debug Instagram posts to see why first two aren't showing
 */

const accessToken = 'IGAAIn9LFq4mNBZAE10REFYYi1RS2VUd2pVY1VFLVBFbTRvaTZASVG9PakF6VEp0d1hjTDNNS1luVmJPRG9NZAC11YWxSamRmWklscHFsMTB2V2NiMDFIcS1mSkh6SDdEWHZAqdlhwVnoxdDhUcmM3LW52ak1ucGRzQko5NFdOWlp2cwZDZD';

async function debugPosts() {
  console.log('🔍 Debug Instagram posts data...\n');
  
  try {
    const url = `https://graph.instagram.com/me/media?fields=id,media_url,thumbnail_url,permalink,media_type,timestamp,caption&limit=6&access_token=${accessToken}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.data) {
      console.log('✅ Found', data.data.length, 'posts\n');
      
      data.data.forEach((post, index) => {
        console.log(`📸 Post ${index + 1}:`);
        console.log('   ID:', post.id);
        console.log('   Type:', post.media_type);
        console.log('   Media URL:', post.media_url ? 'Available' : '❌ MISSING');
        console.log('   Thumbnail URL:', post.thumbnail_url ? 'Available' : '❌ MISSING');
        console.log('   Permalink:', post.permalink ? 'Available' : '❌ MISSING');
        
        if (post.media_type === 'VIDEO') {
          console.log('   🎥 VIDEO POST');
          console.log('   Best Image URL:', post.thumbnail_url || post.media_url);
          if (post.thumbnail_url) {
            console.log('   Thumbnail Preview:', post.thumbnail_url.substring(0, 80) + '...');
          }
        } else {
          console.log('   URL Preview:', post.media_url ? post.media_url.substring(0, 80) + '...' : 'None');
        }
        
        console.log('');
      });
      
      // Check if first two posts have media_url
      const firstTwo = data.data.slice(0, 2);
      console.log('🔍 First two posts analysis:');
      firstTwo.forEach((post, index) => {
        console.log(`   Post ${index + 1}: ${post.media_type} - URL: ${post.media_url ? 'OK' : 'MISSING'}`);
      });
      
    } else {
      console.log('❌ Failed to fetch posts:', data);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugPosts();