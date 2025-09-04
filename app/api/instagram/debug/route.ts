import { NextResponse } from 'next/server';

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    return NextResponse.json({
      success: false,
      error: 'No access token found',
      token_length: 0
    });
  }

  try {
    // Test 1: Basic Facebook Graph API call
    const meResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`
    );
    const meData = await meResponse.json();
    
    // Test 2: Get Facebook Pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );
    const pagesData = await pagesResponse.json();
    
    // Test 3: Try to get Instagram Business Account
    let instagramData = null;
    if (pagesData.data && pagesData.data.length > 0) {
      const firstPage = pagesData.data[0];
      if (firstPage.instagram_business_account) {
        const igResponse = await fetch(
          `https://graph.facebook.com/v18.0/${firstPage.instagram_business_account.id}?fields=id,username,profile_picture_url&access_token=${accessToken}`
        );
        instagramData = await igResponse.json();
      }
    }
    
    return NextResponse.json({
      success: true,
      facebook_user: meData,
      facebook_pages: pagesData,
      instagram_account: instagramData,
      token_preview: accessToken.substring(0, 20) + '...',
      token_length: accessToken.length
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      token_preview: accessToken.substring(0, 20) + '...',
      token_length: accessToken.length
    });
  }
} 