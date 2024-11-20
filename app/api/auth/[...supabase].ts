import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase/types';

// This route handles all Supabase auth callbacks
export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    // If there's no code, we can't do anything
    if (!code) {
      throw new Error('No code provided');
    }

    // Create a Supabase client using cookies
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    });

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw error;
    }

    // Get the user data after successful authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw userError || new Error('User not found');
    }

    // Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    // If no profile exists, create one
    if (!profile && !profileError) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            name: user.email?.split('@')[0] || 'New User', // Default name from email
            role: 'user', // Default role
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error('Error creating user profile:', insertError);
      }
    }

    // Redirect to the dashboard or specified next URL
    return NextResponse.redirect(new URL(next, request.url));
  } catch (error) {
    console.error('Auth error:', error);
    
    // Redirect to login page with error
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('Authentication failed')}`,
        request.url
      )
    );
  }
}

// Handle POST requests (sign out)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    });

    // Parse the request body
    const { action } = await request.json();

    if (action === 'signout') {
      // Sign out the user
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    // Handle unknown actions
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

// Make route dynamic
export const dynamic = 'force-dynamic';