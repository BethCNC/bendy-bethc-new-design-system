import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow the new homepage to work - remove the coming-soon redirect
  // The homepage is now live at the root path
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
}; 