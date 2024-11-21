// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/types";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req: request, res: response });
  const path = request.nextUrl.pathname;

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Public routes that don't require auth
  if (path === '/login' || path === '/signup' || path.startsWith('/auth')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // Protected routes
  if (path.startsWith('/dashboard') || path === '/') {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Admin route protection
    if (path.startsWith('/dashboard/users') || path.startsWith('/dashboard/settings')) {
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (user?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Check user status
    const { data: userStatus } = await supabase
      .from('users')
      .select('active')
      .eq('id', session.user.id)
      .single();

    if (!userStatus?.active) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL('/login?error=Account%20is%20inactive', request.url)
      );
    }
  }

  // Refresh session if needed
  if (session?.expires_at) {
    const timeNow = Math.floor(Date.now() / 1000);
    const hasExpired = session.expires_at < timeNow;

    if (hasExpired) {
      const { data: { session: newSession } } = await supabase.auth.refreshSession();
      if (!newSession) {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    '/',
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/:path*',
  ],
};