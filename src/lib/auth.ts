// lib/auth.ts
import { createMiddlewareClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/types";

// Middleware handler
export async function handleMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req: request, res: response });
  const path = request.nextUrl.pathname;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth routes handling
  if (path.startsWith('/auth') || path === '/login' || path === '/signup') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // Protected routes handling
  if (path.startsWith('/dashboard') || path.startsWith('/api') || path === '/') {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check for admin-only routes
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

  // Handle session expiry
  const hasExpired = session?.expires_at ? session.expires_at * 1000 < Date.now() : false;
  if (session && hasExpired) {
    const { data: { session: newSession } } = await supabase.auth.refreshSession();
    if (!newSession) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

// Auth callback handler
export async function handleAuthCallback(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    if (!code) {
      throw new Error('No code provided');
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw userError || new Error('User not found');
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile && !profileError && user.email) {
      await supabase
        .from('users')
        .insert({
          email: user.email,
          name: user.email.split('@')[0] || 'New User',
          role: 'user' as const,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
    }

    return NextResponse.redirect(new URL(next, request.url));
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
    );
  }
}

// Auth actions handler
export async function handleAuthAction(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    const { action } = await request.json();

    if (action === 'signout') {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Auth action error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// Middleware config
export const middlewareConfig = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    '/',
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/:path*',
  ],
};