import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Instagram API route called');
  
  // Updated working Instagram User Access Token
  const accessToken = 'IGAAIn9LFq4mNBZAE10REFYYi1RS2VUd2pVY1VFLVBFbTRvaTZASVG9PakF6VEp0d1hjTDNNS1luVmJPRG9NZAC11YWxSamRmWklscHFsMTB2V2NiMDFIcS1mSkh6SDdEWHZAqdlhwVnoxdDhUcmM3LW52ak1ucGRzQko5NFdOWlp2cwZDZD';

  if (!accessToken) {
    console.log('No access token found');
    return NextResponse.json({
      success: false,
      error: 'No access token available',
      posts: []
    }, { status: 500 });
  }

  try {
    // Use Instagram Graph API with thumbnail URLs for videos
    const url = `https://graph.instagram.com/me/media?fields=id,media_url,thumbnail_url,permalink,media_type,timestamp,caption&limit=6&access_token=${accessToken}`;
    console.log('Fetching from Instagram Graph API:', url);
    
    const mediaResponse = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    console.log('Response status:', mediaResponse.status);

    if (!mediaResponse.ok) {
      const errorData = await mediaResponse.json();
      console.error('Instagram Graph API error:', errorData);
      throw new Error(`Instagram Graph API error: ${mediaResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const mediaData = await mediaResponse.json();
    console.log('Media data received:', mediaData);

    const posts = mediaData.data.map((post: any, index: number) => ({
      id: post.id,
      // Use thumbnail_url for videos, media_url for images/carousels
      imageUrl: post.media_type === 'VIDEO' && post.thumbnail_url ? post.thumbnail_url : post.media_url,
      alt: post.caption ? `Instagram post: ${post.caption.substring(0, 100)}...` : `Instagram post ${index + 1}`,
      permalink: post.permalink,
      media_type: post.media_type,
      timestamp: post.timestamp,
      caption: post.caption
    }));
    
    return NextResponse.json({
      success: true,
      posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Instagram API route error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Instagram posts',
        posts: []
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache for 1 hour