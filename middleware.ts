import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Quickly skip middleware for public routes and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('/_not-found') ||
    pathname.includes('/_error') ||
    pathname.startsWith('/public') ||
    pathname.endsWith('favicon.ico')
  ) {
    return res;
  }

  const supabase = createMiddlewareClient({ req: request, res });

  // Get session once for all checks
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth routes: If user is logged in, redirect away from login/signup
  if (pathname === '/login' || pathname === '/signup') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return res;
  }

  // Protected routes: Require session
  if (pathname === '/' || pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin-only routes
    if (
      pathname.startsWith('/dashboard/users') ||
      pathname.startsWith('/dashboard/settings')
    ) {
      // We already have session, so we can trust `session.user` directly
      const userId = session.user?.id;
      if (!userId) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();

        if (profileError || profile?.role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/|_not-found|_error).*)',
  ],
};
