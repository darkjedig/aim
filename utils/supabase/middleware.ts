import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Fetch the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect the /dashboard route, ensuring only logged-in users can access
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login' // Redirect to login if unauthenticated
    return NextResponse.redirect(url)
  }

  // Optionally, redirect authenticated users away from public pages (e.g., sign-in) to /dashboard
  if (["/sign-in", "/sign-up"].includes(request.nextUrl.pathname) && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard' // Redirect authenticated users to dashboard
    return NextResponse.redirect(url)
  }

  // IMPORTANT: Return the supabaseResponse object with cookies intact
  return supabaseResponse
}
