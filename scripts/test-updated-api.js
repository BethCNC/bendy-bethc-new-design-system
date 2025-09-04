#!/usr/bin/env node

/**
 * Test the updated Instagram API
 */

async function testAPI() {
  console.log('🧪 Testing updated Instagram API...\n');
  
  try {
    // Test the local API endpoint (if dev server is running)
    console.log('📞 Testing local API endpoint...');
    const response = await fetch('http://localhost:3001/api/instagram');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response received!');
      console.log('🔍 Response structure:', {
        success: data.success,
        postsCount: data.posts ? data.posts.length : 0,
        hasError: !!data.error
      });
      
      if (data.success && data.posts && data.posts.length > 0) {
        console.log('🎉 SUCCESS! Instagram API is working!');
        console.log('📸 Found', data.posts.length, 'posts:');
        
        data.posts.slice(0, 3).forEach((post, index) => {
          console.log(`   ${index + 1}. Post ID: ${post.id}`);
          console.log(`      Type: ${post.media_type}`);
          console.log(`      Image: ${post.imageUrl ? 'Available' : 'Missing'}`);
          console.log(`      Link: ${post.permalink ? 'Available' : 'Missing'}`);
          console.log('');
        });
        
        console.log('🎯 Your Instagram feed will now show live posts on your website!');
      } else {
        console.log('⚠️  API responded but no posts found:');
        console.log('   Success:', data.success);
        console.log('   Error:', data.error);
        console.log('   Posts:', data.posts);
      }
    } else {
      console.log('❌ API request failed:');
      console.log('   Status:', response.status);
      console.log('   Status Text:', response.statusText);
      
      try {
        const errorData = await response.json();
        console.log('   Error Data:', errorData);
      } catch (e) {
        console.log('   Could not parse error response');
      }
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  Development server not running on localhost:3001');
      console.log('💡 Start with: npm run dev');
      console.log('🌐 Or test on your live site once deployed');
    } else {
      console.log('❌ Error testing API:', error.message);
    }
  }
}

testAPI();