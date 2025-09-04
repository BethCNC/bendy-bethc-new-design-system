import { NextResponse } from 'next/server';

export async function GET() {
  const accessToken = process.env.INSTAGRAM_API_KEY;
  
  if (!accessToken) {
    return NextResponse.json({
      success: false,
      error: 'No Instagram API key found'
    });
  }

  try {
    // Test basic user info first
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      return NextResponse.json({
        success: false,
        error: `Instagram API error: ${userResponse.status}`,
        details: errorData
      });
    }

    const userData = await userResponse.json();

    // Test media endpoint
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_url,permalink,media_type&limit=3&access_token=${accessToken}`
    );

    if (!mediaResponse.ok) {
      const errorData = await mediaResponse.json();
      return NextResponse.json({
        success: false,
        error: `Media API error: ${mediaResponse.status}`,
        details: errorData,
        user: userData
      });
    }

    const mediaData = await mediaResponse.json();

    return NextResponse.json({
      success: true,
      user: userData,
      media: mediaData,
      token_preview: accessToken.substring(0, 20) + '...'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to test Instagram API',
      details: error
    });
  }
} 