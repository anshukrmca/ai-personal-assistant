import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define public routes
  const isPublicRoute = pathname === '/' || pathname === '/login'
  
  // Get the session cookie
  const session = request.cookies.get('ai_assistant_session')?.value
  
  // 1. API Route Protection
  if (pathname.startsWith('/api/')) {
    // Let the auth endpoints run (e.g. login)
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next()
    }
    
    // Block API calls if there's no session cookie
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  // 2. Web Page Protection
  // If the user doesn't have a session and tries to access a protected route
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If the user HAS a session and tries to access the login page
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any static files (like svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
