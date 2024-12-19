import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables not found');
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Early exit for public assets and routes that don't need auth
  if (
    pathname.includes('/_not-found') ||
    pathname.includes('/_error') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth')
  ) {
    return res;
  }

  // If we are on login or signup and no session is needed yet:
  if ((pathname === '/login' || pathname === '/signup') && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
    // If environment variables are not set, just proceed
    return res;
  }

  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Check login/signup routes
  if ((pathname === '/login' || pathname === '/signup')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return res;
  }

  // Protect dashboard and root route
  if (pathname.startsWith('/dashboard') || pathname === '/') {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin check for certain routes:
    if (pathname.startsWith('/dashboard/users') || pathname.startsWith('/dashboard/settings')) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.redirect(new URL('/login', request.url));

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
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
