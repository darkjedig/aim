import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createMiddlewareClient({ req: request, res: response })
    
    // This will refresh the session if expired
    const { data: { session }, error } = await supabase.auth.getSession()

    // Protected routes
    if (request.nextUrl.pathname.startsWith("/protected") && !session) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    // Redirect logged-in users from public pages
    if (["/sign-in", "/sign-up", "/"].includes(request.nextUrl.pathname) && session) {
      return NextResponse.redirect(new URL("/protected", request.url))
    }

    return response

  } catch (error) {
    console.error('Error in middleware:', error)
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}