import { NextResponse } from 'next/server';

export async function GET() {
  // Use the exact token that worked in curl
  const accessToken = 'EAAO02FobKA0BPGvNQcZBTldwu3WmYPTXEYhimDj3CpaZB3llSU7DEmLrPXu5ExyWzzatYizFzjFMr1FkL3NeDkAG19QeKqeXMVFZAg6XlJfoOeW38SCOxGVhT2wiX2eZCoz2I7oezQ4NB2ZA2239xlBnpKj4zCOvkaaSfB6vVtSDyNwZC6SPUDru9QEEWT4r3lwdD6YQ0Ib2ZATYTNusRbyR8QxjL6LxSZCzVitmmUX83wLfwh6U2AgXsA1YeI7s';
  const igAccountId = '17841414374322086';

  try {
    // Test Instagram media directly
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igAccountId}/media?fields=id,media_url,permalink,media_type,timestamp,caption&limit=3&access_token=${accessToken}`
    );

    if (!mediaResponse.ok) {
      const errorData = await mediaResponse.json();
      return NextResponse.json({
        success: false,
        error: `Instagram API error: ${mediaResponse.status}`,
        details: errorData
      });
    }

    const mediaData = await mediaResponse.json();

    return NextResponse.json({
      success: true,
      posts: mediaData.data,
      count: mediaData.data.length,
      message: 'Direct Instagram API test successful'
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
} 