import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error(
    'Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables'
  );
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { pathname } = request.nextUrl;

  try {
    // Skip auth check for not-found and error pages
    if (pathname.includes('/_not-found') || pathname.includes('/_error')) {
      return res;
    }

    // Refresh session if it exists
    const { data: { session } } = await supabase.auth.getSession();

    // Handle auth routes (login, signup)
    if (['/login', '/signup'].includes(pathname)) {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return res;
    }

    // Handle protected routes
    if (pathname.startsWith('/dashboard') || pathname === '/') {
      if (!session) {
        // Redirect to login if there's no session
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check for admin-only routes
      if ((pathname.startsWith('/dashboard/users') || pathname.startsWith('/dashboard/settings'))) {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user?.id)
          .single();

        if (profile?.role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, redirect to login except for not-found and error pages
    if (!pathname.includes('/_not-found') && !pathname.includes('/_error')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - not-found page
     * - error page
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|_not-found|_error).*)',
  ],
};