import { NextResponse } from 'next/server';
import { fetchInstagramPostsSimple, getInstagramUserInfo } from '../../../lib/instagram-simple';

export async function GET() {
  const accessToken = process.env.INSTAGRAM_BASIC_TOKEN;
  
  if (!accessToken) {
    return NextResponse.json({
      success: false,
      error: 'INSTAGRAM_BASIC_TOKEN not found in environment variables',
      token_preview: 'No token found'
    });
  }

  try {
    // Test user info first
    const userInfo = await getInstagramUserInfo();
    
    // Test fetching posts
    const posts = await fetchInstagramPostsSimple(3);
    
    return NextResponse.json({
      success: true,
      user: userInfo,
      posts: posts,
      count: posts.length,
      token_preview: accessToken.substring(0, 20) + '...',
      message: 'Instagram Basic Display API test successful'
    });
    
  } catch (error: any) {
    console.error('Instagram Basic Display test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      token_preview: accessToken.substring(0, 20) + '...',
      details: error.toString()
    });
  }
} 