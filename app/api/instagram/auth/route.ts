import { NextRequest, NextResponse } from 'next/server';

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const REDIRECT_URI = 'http://localhost:3001/api/instagram/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle OAuth error
  if (error) {
    return NextResponse.json({ 
      success: false, 
      error: `Instagram OAuth error: ${error}` 
    });
  }

  // Initial OAuth request - redirect to Instagram
  if (!code) {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    
    return NextResponse.redirect(authUrl);
  }

  // Exchange code for access token
  try {
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_APP_ID!,
        client_secret: INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    
    // Exchange short-lived token for long-lived token
    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${tokenData.access_token}`
    );

    if (!longLivedTokenResponse.ok) {
      throw new Error(`Long-lived token exchange failed: ${longLivedTokenResponse.status}`);
    }

    const longLivedTokenData = await longLivedTokenResponse.json();

    return NextResponse.json({
      success: true,
      access_token: longLivedTokenData.access_token,
      expires_in: longLivedTokenData.expires_in,
      message: 'Add this access token to your .env file as INSTAGRAM_API_KEY'
    });

  } catch (error) {
    console.error('Instagram OAuth error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to exchange code for access token' 
    });
  }
} 