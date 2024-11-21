import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types';

// This route handles all Supabase auth callbacks
export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    if (!code) {
      throw new Error('No code provided');
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    });

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
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          email: user.email,
          name: user.email.split('@')[0] || 'New User',
          role: 'user' as const,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error creating user profile:', insertError);
      }
    }

    return NextResponse.redirect(new URL(next, request.url));
  } catch (error) {
    console.error('Auth error:', error);
    
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('Authentication failed')}`,
        request.url
      )
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    });

    const { action } = await request.json();

    if (action === 'signout') {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth action error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';