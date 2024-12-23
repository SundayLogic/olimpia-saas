# Documentation for Selected Directories

Generated on: 2024-12-19 13:11:30

## Documented Directories:
- app/
- middleware.ts
- tailwind.config.ts
- next.config.ts
- package.json
- src/
- next.config.ts

## Directory Structure

```
app/
    ├── app/
        ├── (auth)/
            ├── login/
            │   ├── page.tsx
            ├── signup/
            │   ├── page.tsx
        │   
        │   ├── layout.tsx
        ├── api/
            ├── auth/
                ├── [...supabase]/
                │   ├── route.ts
        ├── blog/
            ├── [slug]/
            │   ├── page.tsx
        │   
        │   ├── page.tsx
        ├── dashboard/
            ├── blog/
                ├── [id]/
                │   ├── page.tsx
            │   
            │   ├── page.tsx
            ├── images/
            │   ├── page.tsx
            ├── menu/
                ├── daily/
                │   ├── page.tsx
                ├── wine/
                │   ├── page.tsx
            │   
            │   ├── page.tsx
            ├── settings/
            │   ├── pages.tsx
            ├── users/
            │   ├── page.tsx
        │   
        │   ├── layout.tsx
        │   ├── page.tsx
    │   
    │   ├── global.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── providers.tsx

middleware.ts/
    ├── middleware.ts/

tailwind.config.ts/
    ├── tailwind.config.ts/

next.config.ts/
    ├── next.config.ts/

package.json/
    ├── package.json/

src/
    ├── src/
        ├── components/
            ├── core/
            │   ├── forms.tsx
            │   ├── layout.tsx
            │   ├── ui.tsx
            ├── features/
            │   ├── images.tsx
            │   ├── menu.tsx
            │   ├── users.tsx
            ├── ui/
            │   ├── alert-dialog.tsx
            │   ├── alert.tsx
            │   ├── badge.tsx
            │   ├── button.tsx
            │   ├── calendar.tsx
            │   ├── command.tsx
            │   ├── dialog.tsx
            │   ├── dropdown-menu.tsx
            │   ├── form.tsx
            │   ├── input.tsx
            │   ├── label.tsx
            │   ├── multi-select.tsx
            │   ├── popover.tsx
            │   ├── select.tsx
            │   ├── switch.tsx
            │   ├── table.tsx
            │   ├── textarea.tsx
            │   ├── toast.tsx
            │   ├── toaster.tsx
        ├── hooks/
        │   ├── use-toast.ts
        ├── lib/
        │   ├── supabase.ts
        │   ├── utils.ts
        ├── types/
        │   ├── index.ts

next.config.ts/
    ├── next.config.ts/

```

## File Contents

### app/(auth)/login/page.tsx

```typescript
"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().nonempty("Email is required").email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Values = z.infer<typeof schema>;

export default function SwissLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const form = useForm<Values>({ 
    resolver: zodResolver(schema), 
    defaultValues: { 
      email: "",
      password: ""
    } 
  });

  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}}) => {
      if(session) router.replace("/dashboard");
    });
  }, [router, supabase.auth]);

  useEffect(() => {
    const e = searchParams.get("error");
    if(e) setError(decodeURIComponent(e));
  }, [searchParams]);

  const onSubmit = async (data: Values) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data: res, error: err } = await supabase.auth.signInWithPassword(data);
      if(err) throw err;
      if(!res?.session) throw new Error("No session created");
      await supabase.auth.getSession();
      toast({ title: "Success", description: "You have successfully logged in." });
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      router.refresh();
      router.replace(redirectTo);
    } catch(e) {
      const msg = e instanceof Error ? e.message : "Failed to login";
      console.error("Login error:", e);
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Grid system - 12 columns */}
      <div className="container mx-auto grid grid-cols-12 min-h-screen">
        {/* Left column - Brand */}
        <div className="col-span-5 bg-black text-white p-12 hidden lg:flex lg:flex-col justify-between">
          <div>
            <h1 className="font-mono text-6xl mb-8">RM</h1>
            <div className="h-px w-16 bg-white mb-4"></div>
            <p className="text-sm uppercase tracking-widest">Restaurant Manager</p>
          </div>
          <div>
            <div className="h-px w-16 bg-white mb-4"></div>
            <p className="font-mono text-sm">© 2024</p>
          </div>
        </div>

        {/* Right column - Form */}
        <div className="col-span-12 lg:col-span-7 p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            {error && (
              <Alert variant="destructive" className="mb-8 bg-red-50 border-red-600">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mb-12">
              <h2 className="font-mono text-4xl mb-4">Login</h2>
              <div className="h-px w-8 bg-black"></div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com"
                          type="email"
                          disabled={isLoading}
                          className="border-0 border-b border-black rounded-none focus:ring-0 px-0 font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest">Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your password"
                          type="password"
                          disabled={isLoading}
                          className="border-0 border-b border-black rounded-none focus:ring-0 px-0 font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-2" />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-4 px-6 text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Processing
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </Form>

            <div className="mt-12">
              <div className="h-px w-full bg-black opacity-10 mb-8"></div>
              <Link 
                href="/signup" 
                className="text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### app/(auth)/signup/page.tsx

```typescript
"use client"
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email("Must be a valid email").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().nonempty("Confirm Password is required"),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type Values = z.infer<typeof schema>;

export default function SwissSignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (v: Values) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: v.email,
        password: v.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Please check your email to confirm your account."
      });
      router.push("/login");
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to sign up",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto grid grid-cols-12 min-h-screen">
        {/* Left column - Brand */}
        <div className="col-span-5 bg-black text-white p-12 hidden lg:flex lg:flex-col justify-between">
          <div>
            <h1 className="font-mono text-6xl mb-8">RM</h1>
            <div className="h-px w-16 bg-white mb-4"></div>
            <p className="text-sm uppercase tracking-widest">Restaurant Manager</p>
          </div>
          
          {/* Swiss Design grid element */}
          <div className="grid grid-cols-4 gap-4">
            <div className="h-16 w-16 border border-white"></div>
            <div className="h-16 w-16 bg-white"></div>
            <div className="h-16 w-16 border border-white"></div>
            <div className="h-16 w-16 bg-white"></div>
          </div>

          <div>
            <div className="h-px w-16 bg-white mb-4"></div>
            <p className="font-mono text-sm">© 2024</p>
          </div>
        </div>

        {/* Right column - Form */}
        <div className="col-span-12 lg:col-span-7 p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-12">
              <h2 className="font-mono text-4xl mb-4">Create Account</h2>
              <div className="h-px w-8 bg-black"></div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com"
                          type="email"
                          disabled={isLoading}
                          className="border-0 border-b border-black rounded-none focus:ring-0 px-0 font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-2 font-mono" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest">Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Create a password"
                          type="password"
                          disabled={isLoading}
                          className="border-0 border-b border-black rounded-none focus:ring-0 px-0 font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-2 font-mono" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest">Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Confirm your password"
                          type="password"
                          disabled={isLoading}
                          className="border-0 border-b border-black rounded-none focus:ring-0 px-0 font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-2 font-mono" />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-4 px-6 text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Processing
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            </Form>

            <div className="mt-12">
              <div className="h-px w-full bg-black opacity-10 mb-8"></div>
              <Link 
                href="/login" 
                className="text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### app/(auth)/layout.tsx

```typescript
export const dynamic = 'force-dynamic';
// app/(auth)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 overflow-hidden antialiased">
      {/* Gradient background */}
      <div 
        className="fixed inset-0 -z-10 opacity-40"
        style={{
          background: 
            "radial-gradient(circle at 50% 50%, rgba(17, 24, 39, 0.1), rgba(0, 0, 0, 0.4))",
        }}
      />

      {/* Background pattern */}
      <div 
        className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col">
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <div className="border-t py-4 lg:hidden">
          <div className="container flex items-center justify-between px-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Restaurant Manager. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### app/api/auth/[...supabase]/route.ts

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    if (!code) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    });

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

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
      new URL('/login?error=Authentication%20failed', request.url)
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
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth action error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
```

### app/blog/[slug]/page.tsx

```typescript
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

// Types for blog content structure
type ContentNode = {
 type: string;
 content?: Array<{
   type: string;
   text?: string;
   content?: ContentNode[];
 }>;
 text?: string;
 attrs?: Record<string, unknown>;
};

type BlogContent = {
 type: string;
 content: ContentNode[];
};

type MenuItem = {
 id: number;
 name: string;
 price: number;
};

type Wine = {
 id: number;
 name: string;
 bottle_price: number;
};

type BlogPostData = {
 id: string;
 title: string;
 slug: string;
 content: BlogContent;
 featured_image: string | null;
 featured_image_url: string | null;
 featured_image_alt: string | null;
 published: boolean;
 created_at: string;
 author_info: Array<{
   name: string | null;
   email: string;
 }>;
 menu_items: Array<{
   menu_items: MenuItem;
 }>;
 wines: Array<{
   wines: Wine;
 }>;
};

// Helper function to render content
const renderContent = (content: BlogContent) => {
 if (!content.content) return null;

 return content.content.map((node, index) => {
   switch (node.type) {
     case 'paragraph':
       return (
         <p key={index} className="mb-4 leading-relaxed">
           {node.content?.map((child, childIndex) => (
             <span key={childIndex}>{child.text}</span>
           ))}
         </p>
       );
     case 'heading':
       const HeadingTag = `h${(node.attrs?.level || 1) as number}` as keyof JSX.IntrinsicElements;
       return (
         <HeadingTag key={index} className="mb-4 mt-6 font-bold">
           {node.content?.map((child, childIndex) => (
             <span key={childIndex}>{child.text}</span>
           ))}
         </HeadingTag>
       );
     case 'image':
       return (
         <div key={index} className="my-6">
           <Image
             src={node.attrs?.src as string}
             alt={node.attrs?.alt as string || ''}
             width={800}
             height={400}
             className="rounded-lg"
             unoptimized
           />
         </div>
       );
     default:
       return null;
   }
 });
};

type Props = {
 params: Promise<{ slug: string }>;
 searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPostPage({ params, searchParams }: Props) {
 const [resolvedParams] = await Promise.all([
   params,
   searchParams
 ]);
 
 const supabase = createServerComponentClient({ cookies });

 // Fetch blog post with related content
 const { data: post } = await supabase
   .from('blog_posts')
   .select(`
     *,
     author_info:users(name, email),
     menu_items:blog_menu_references(
       menu_items(id, name, price)
     ),
     wines:blog_wine_references(
       wines(id, name, bottle_price)
     )
   `)
   .eq('slug', resolvedParams.slug)
   .eq('published', true)
   .single();

 if (!post) {
   notFound();
 }

 const typedPost = post as unknown as BlogPostData;

 return (
   <article className="mx-auto max-w-3xl px-4 py-8">
     {/* Header */}
     <header className="mb-8">
       <h1 className="mb-4 text-4xl font-bold tracking-tight">
         {typedPost.title}
       </h1>
       <div className="flex items-center gap-4 text-muted-foreground">
         <span>
           By {typedPost.author_info[0]?.name || typedPost.author_info[0]?.email || 'Anonymous'}
         </span>
         <span>•</span>
         <time dateTime={typedPost.created_at}>
           {format(new Date(typedPost.created_at), 'MMMM d, yyyy')}
         </time>
       </div>
     </header>

     {/* Featured Image */}
     {typedPost.featured_image_url && (
       <div className="mb-8 overflow-hidden rounded-lg">
         <Image
           src={typedPost.featured_image_url}
           alt={typedPost.featured_image_alt || typedPost.title}
           width={1200}
           height={630}
           className="w-full object-cover"
           priority
           unoptimized
         />
       </div>
     )}

     {/* Content */}
     <div className="prose prose-lg max-w-none">
       {renderContent(typedPost.content)}
     </div>

     {/* Related Items Section */}
     {(typedPost.menu_items?.length > 0 || typedPost.wines?.length > 0) && (
       <div className="mt-12 border-t pt-8">
         <h2 className="mb-6 text-2xl font-bold">Featured Items</h2>
         
         {/* Menu Items */}
         {typedPost.menu_items?.length > 0 && (
           <div className="mb-8">
             <h3 className="mb-4 text-xl font-semibold">Menu Items</h3>
             <div className="grid gap-4 sm:grid-cols-2">
               {typedPost.menu_items.map(({ menu_items: item }) => (
                 <div key={item.id} className="rounded-lg border p-4">
                   <div className="flex items-center justify-between">
                     <h4 className="font-medium">{item.name}</h4>
                     <span className="text-muted-foreground">
                       ${item.price.toFixed(2)}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* Wines */}
         {typedPost.wines?.length > 0 && (
           <div>
             <h3 className="mb-4 text-xl font-semibold">Featured Wines</h3>
             <div className="grid gap-4 sm:grid-cols-2">
               {typedPost.wines.map(({ wines: wine }) => (
                 <div key={wine.id} className="rounded-lg border p-4">
                   <div className="flex items-center justify-between">
                     <h4 className="font-medium">{wine.name}</h4>
                     <span className="text-muted-foreground">
                       ${wine.bottle_price.toFixed(2)}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}
       </div>
     )}

     {/* Back Link */}
     <div className="mt-12 border-t pt-8">
       <Link
         href="/blog"
         className="text-sm text-muted-foreground hover:text-foreground"
       >
         ← Back to all posts
       </Link>
     </div>
   </article>
 );
}
```

### app/blog/page.tsx

```typescript
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

// Define types for blog content structure
type ContentNode = {
  type: string;
  content?: Array<{
    type: string;
    text?: string;
    content?: ContentNode[];
  }>;
  text?: string;
};

type BlogContent = {
  type: string;
  content: ContentNode[];
};

type BlogPostType = {
  id: string;
  title: string;
  slug: string;
  content: BlogContent;
  featured_image: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  published: boolean;
  created_at: string;
  author_info: Array<{
    name: string | null;
    email: string;
  }>;
};

export default async function BlogPage() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch published blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`
      id,
      title,
      slug,
      content,
      featured_image,
      featured_image_url,
      featured_image_alt,
      published,
      created_at,
      author_info:users(name, email)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false });

  // Extract a preview from the content
  const getPreview = (content: BlogContent | null): string => {
    if (!content || !content.content) return "";
    
    const textContent = content.content.reduce((acc: string, node) => {
      if (node.content?.[0]?.text) {
        return acc + " " + node.content[0].text;
      }
      return acc;
    }, "");

    return textContent.length > 200 
      ? textContent.substring(0, 200) + "..."
      : textContent;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Latest news and updates from our restaurant
        </p>
      </div>

      {!posts?.length ? (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: BlogPostType) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
            >
              {/* Featured Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.featured_image_alt || post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="text-sm text-muted-foreground">
                      No image available
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {getPreview(post.content)}
                  </p>
                </div>

                {/* Metadata */}
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    By {post.author_info[0]?.name || post.author_info[0]?.email || 'Anonymous'}
                  </span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

### app/dashboard/blog/[id]/page.tsx

```typescript
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import slugify from "slugify";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import type { JSONContent } from "@tiptap/react";
import {
  Loader2, Save, Eye, EyeOff, Settings, Bold, Italic, Code,
  Link as LinkIcon, Image as ImageIcon, Quote, List, Heading as HeadingIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type BlogStatus = "draft"|"published"|"scheduled";
type AutoSaveState = { lastSaved:Date|null; saving:boolean; error:string|null; };

const schema = z.object({
  title:z.string().min(1,{message:"Title is required"}),
  content:z.custom<JSONContent>(d=>!!d,{message:"Content is required"}),
  meta_description:z.string().optional(),
  status:z.enum(["draft","published","scheduled"]),
  published_at:z.string().optional(),
  tags:z.array(z.string()).default([]),
});
type FormData=z.infer<typeof schema>;

export default function Page() {
  const params=useParams();const router=useRouter();const {toast}=useToast();
  const supabase=createClientComponentClient();
  const [isLoading,setIsLoading]=useState(false);
  const [isPreview,setIsPreview]=useState(false);
  const [showSidebar,setShowSidebar]=useState(true);
  const [isEditorReady,setIsEditorReady]=useState(false);
  const [autoSave,setAutoSave]=useState<AutoSaveState>({lastSaved:null,saving:false,error:null});
  const isNew=params.id==="new";

  const form=useForm<FormData>({
    resolver:zodResolver(schema),
    defaultValues:{
      title:"",
      content:{type:"doc",content:[{type:"paragraph"}]},
      meta_description:"",
      status:"draft",
      tags:[]
    },
  });

  const autoSavePost=useCallback(async(data:FormData)=>{
    if(!isNew&&isEditorReady){
      try {
        setAutoSave(p=>({...p,saving:true}));
        const {error}=await supabase.from("blog_posts")
          .update({content:data.content,updated_at:new Date().toISOString()})
          .eq("id",params.id);
        if(error)throw error;
        setAutoSave({lastSaved:new Date(),saving:false,error:null});
      } catch(e) {
        console.error(e);
        setAutoSave(p=>({...p,saving:false,error:"Failed to auto-save"}));
      }
    }
  },[isNew,params.id,supabase,isEditorReady]);

  const editor=useEditor({
    extensions:[StarterKit,ImageExt,LinkExt],
    content:form.watch("content"),
    editorProps:{
      attributes:{class:"prose prose-lg max-w-none focus:outline-none [&_*]:outline-none",spellcheck:"false"},
      handleDOMEvents:{focus:(_view,ev)=>(ev.preventDefault(),false)},
    },
    onUpdate:({editor:e})=>{
      if(!isPreview){
        const content=e.getJSON();
        form.setValue("content",content);
        void autoSavePost({...form.getValues(),content});
      }
    },
  });

  useEffect(()=>{if(editor)editor.setEditable(!isPreview);},[isPreview,editor]);
  useEffect(()=>{if(editor)setIsEditorReady(true);},[editor]);

  useEffect(()=>{
    return ()=>{
      if(editor&&!editor.isDestroyed){
        try{editor.commands.clearContent();editor.destroy();}catch{}
      }
    };
  },[editor]);

  useEffect(()=>{
    const fetchPost=async()=>{
      if(isNew)return;
      try {
        setIsLoading(true);
        const {data:post,error}=await supabase
          .from("blog_posts").select("*")
          .eq("id",params.id).single();
        if(error)throw error;
        if(post&&editor&&!editor.isDestroyed){
          form.reset({
            title:post.title,content:post.content,meta_description:post.meta_description,
            status:post.status as BlogStatus,published_at:post.published_at,tags:post.tags||[]
          });
          editor.commands.setContent(post.content);
        }
      } catch(e) {
        toast({title:"Error",description:e instanceof Error?e.message:"Failed to load blog post",variant:"destructive"});
      } finally {
        setIsLoading(false);
      }
    };
    if(editor&&isEditorReady)void fetchPost();
  },[isNew,params.id,supabase,form,editor,toast,isEditorReady]);

  const onSubmit=async(values:FormData)=>{
    try {
      setIsLoading(true);
      const {data:{user},error:userErr}=await supabase.auth.getUser();
      if(userErr)throw userErr;if(!user)throw new Error("No user found");
      const postData={
        title:values.title,
        slug:slugify(values.title,{lower:true,strict:true}),
        content:values.content,
        meta_description:values.meta_description,
        status:values.status,
        published_at:values.status==="scheduled"?values.published_at:null,
        published:values.status==="published",
        tags:values.tags,
        author_id:user.id,
        updated_at:new Date().toISOString(),
      };
      if(isNew){
        const {error:createErr}=await supabase.from("blog_posts")
          .insert([{...postData,created_at:new Date().toISOString()}]);
        if(createErr)throw createErr;
        toast({title:"Success",description:"Blog post created successfully"});
      }else{
        const {error:updateErr}=await supabase.from("blog_posts").update(postData).eq("id",params.id);
        if(updateErr)throw updateErr;
        toast({title:"Success",description:"Blog post updated successfully"});
      }
      router.push("/dashboard/blog");
    } catch(e) {
      toast({title:"Error",description:e instanceof Error?e.message:"Failed to save blog post",variant:"destructive"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="border-b p-4 flex items-center justify-between bg-card">
        <div className="flex items-center space-x-4">
          {autoSave.lastSaved&&(
            <span className="text-sm text-muted-foreground flex items-center">
              <Save className="w-4 h-4 mr-1"/>Last saved {format(autoSave.lastSaved,"h:mm a")}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={()=>setIsPreview(p=>!p)} disabled={!isEditorReady} aria-label="Toggle Preview">
            {isPreview?(<><EyeOff className="w-4 h-4 mr-2"/>Edit</>):(<><Eye className="w-4 h-4 mr-2"/>Preview</>)}
          </Button>
          <Button variant="ghost" size="sm" onClick={()=>setShowSidebar(!showSidebar)} aria-label="Toggle Sidebar"><Settings className="w-4 h-4"/></Button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            <Input type="text" placeholder="Post title" className="text-3xl font-bold border-none bg-transparent focus-visible:ring-0 p-0 placeholder:text-muted-foreground/60" {...form.register("title")} disabled={isPreview}/>
            {!isPreview&&(
              <div className="flex items-center gap-2 py-2 mb-4 border-b">
                <Button variant="outline" size="sm" onClick={()=>editor?.chain().focus().toggleHeading({level:1}).run()} className={cn("hover:bg-accent/50",editor?.isActive("heading",{level:1})?"bg-accent":"")} aria-label="H1">H1</Button>
                <Button variant="outline" size="sm" onClick={()=>editor?.chain().focus().toggleHeading({level:2}).run()} className={cn("hover:bg-accent/50",editor?.isActive("heading",{level:2})?"bg-accent":"")} aria-label="H2">H2</Button>
                <Button variant="outline" size="sm" onClick={()=>editor?.chain().focus().setParagraph().run()} className={cn("hover:bg-accent/50",editor?.isActive("paragraph")?"bg-accent":"")} aria-label="Paragraph">P</Button>
                <Button variant="outline" size="sm" onClick={()=>editor?.chain().focus().toggleBold().run()} className={cn("hover:bg-accent/50",editor?.isActive("bold")?"bg-accent":"")} aria-label="Bold">B</Button>
                <Button variant="outline" size="sm" onClick={()=>editor?.chain().focus().toggleBulletList().run()} className={cn("hover:bg-accent/50",editor?.isActive("bulletList")?"bg-accent":"")} aria-label="Bullet List">• List</Button>
              </div>
            )}
            {!isEditorReady?(
              <div className="flex items-center justify-center min-h-[300px]"><Loader2 className="h-8 w-8 animate-spin"/></div>
            ):(
              <div className="min-h-[300px]">
                <div className="relative">
                  <EditorContent editor={editor} className={cn("prose prose-lg max-w-none","[&_.ProseMirror]:min-h-[300px]","[&_.ProseMirror]:outline-none","[&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]","[&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground/60","[&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left","[&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none","[&_.ProseMirror_::selection]:bg-primary/10","[&_.ProseMirror-selectednode]:outline-none","[&_.ProseMirror_h1]:text-3xl","[&_.ProseMirror_h2]:text-2xl","[&_.ProseMirror_h3]:text-xl","[&_.ProseMirror_h1,h2,h3,h4,h5,h6]:font-bold","[&_.ProseMirror_blockquote]:border-l-4","[&_.ProseMirror_blockquote]:border-muted","[&_.ProseMirror_blockquote]:pl-4","[&_.ProseMirror_blockquote]:italic","[&_.ProseMirror_pre]:bg-muted","[&_.ProseMirror_pre]:p-4","[&_.ProseMirror_pre]:rounded-md","[&_.ProseMirror_pre]:font-mono","[&_.ProseMirror_pre]:text-sm","[&_.ProseMirror_code]:bg-muted","[&_.ProseMirror_code]:px-1.5","[&_.ProseMirror_code]:py-0.5","[&_.ProseMirror_code]:rounded-sm","[&_.ProseMirror_code]:font-mono","[&_.ProseMirror_code]:text-sm","[&_.ProseMirror_img]:rounded-md","[&_.ProseMirror_img]:max-w-full","[&_.ProseMirror_img]:h-auto","[&_.ProseMirror_a]:text-primary","[&_.ProseMirror_a]:underline","[&_.ProseMirror_a:hover]:text-primary/80",isPreview?"pointer-events-none opacity-70":"")}/>
                  {editor&&!isPreview&&(
                    <BubbleMenu editor={editor} tippyOptions={{duration:100}} className="flex items-center space-x-1 rounded-lg bg-background shadow-lg border p-1">
                      <Button variant="ghost" size="sm" onClick={()=>editor.chain().focus().toggleBold().run()} className={cn("hover:bg-accent/50",editor.isActive("bold")?"bg-accent":"")} aria-label="Bold"><Bold className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="sm" onClick={()=>editor.chain().focus().toggleItalic().run()} className={cn("hover:bg-accent/50",editor.isActive("italic")?"bg-accent":"")} aria-label="Italic"><Italic className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="sm" onClick={()=>editor.chain().focus().toggleCode().run()} className={cn("hover:bg-accent/50",editor.isActive("code")?"bg-accent":"")} aria-label="Code"><Code className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="sm" onClick={()=>editor.chain().focus().toggleHeading({level:2}).run()} className={cn("hover:bg-accent/50",editor.isActive("heading",{level:2})?"bg-accent":"")} aria-label="Heading"><HeadingIcon className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="sm" onClick={()=>editor.chain().focus().toggleBlockquote().run()} className={cn("hover:bg-accent/50",editor.isActive("blockquote")?"bg-accent":"")} aria-label="Blockquote"><Quote className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="sm" onClick={()=>editor.chain().focus().toggleBulletList().run()} className={cn("hover:bg-accent/50",editor.isActive("bulletList")?"bg-accent":"")} aria-label="Bullet List"><List className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="sm" onClick={()=>{const url=window.prompt("Enter URL");if(url)editor.chain().focus().setLink({href:url}).run();}} className={cn("hover:bg-accent/50",editor.isActive("link")?"bg-accent":"")} aria-label="Add Link"><LinkIcon className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="sm" onClick={()=>{const url=window.prompt("Enter image URL");if(url)editor.chain().focus().setImage({src:url}).run();}} className={cn("hover:bg-accent/50",editor.isActive("image")?"bg-accent":"")} aria-label="Add Image"><ImageIcon className="h-4 w-4"/></Button>
                    </BubbleMenu>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {showSidebar&&(
          <div className="w-80 border-l bg-card overflow-y-auto">
            <div className="p-4 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={form.watch("status")} onValueChange={v=>form.setValue("status",v as BlogStatus)}>
                  <SelectTrigger><SelectValue placeholder="Select status"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.watch("status")==="scheduled"&&(
                <div className="space-y-2">
                  <label className="text-sm font-medium">Publish Date</label>
                  <Input type="datetime-local" value={form.watch("published_at")||""} onChange={e=>form.setValue("published_at",e.target.value)} disabled={isPreview}/>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Description</label>
                <Textarea value={form.watch("meta_description")||""} onChange={e=>form.setValue("meta_description",e.target.value)} placeholder="Enter SEO description..." className="h-20" disabled={isPreview}/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Select value={form.watch("tags").join(",")} onValueChange={v=>form.setValue("tags",v.split(",").filter(Boolean))}>
                  <SelectTrigger><SelectValue placeholder="Select tags"/></SelectTrigger>
                  <SelectContent>
                    {["tech","food","travel","lifestyle"].map(tag=><SelectItem key={tag} value={tag}>{tag.charAt(0).toUpperCase()+tag.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t bg-card p-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {autoSave.saving&&<span className="flex items-center"><Loader2 className="w-3 h-3 mr-2 animate-spin"/>Saving...</span>}
          {autoSave.error&&<span className="text-destructive">{autoSave.error}</span>}
          {!autoSave.saving&&!autoSave.error&&autoSave.lastSaved&&<span className="text-muted-foreground">All changes saved</span>}
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={()=>router.push("/dashboard/blog")} disabled={isLoading||autoSave.saving}>Cancel</Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading||autoSave.saving}>
            {isLoading?(<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Saving...</>):form.watch("status")==="published"?"Publish":form.watch("status")==="scheduled"?"Schedule":"Save Draft"}
          </Button>
        </div>
      </div>
      {form.watch("status")==="scheduled"&&!form.watch("published_at")&&(
        <div className="border-t bg-yellow-50 dark:bg-yellow-900/10 p-2 text-center">
          <span className="text-sm text-yellow-800 dark:text-yellow-200">Please select a publication date for scheduled posts</span>
        </div>
      )}
      <style jsx global>{`
        .ProseMirror > * + * {margin-top:0.75em;}
        .ProseMirror:focus {outline:none!important;}
        .ProseMirror p.is-editor-empty:first-child::before {
          color:#adb5bd;content:attr(data-placeholder);float:left;height:0;pointer-events:none;
        }
        .ProseMirror-selectednode {outline:none!important;}
        .ProseMirror ::selection {background:rgba(0,0,0,0.1);}
      `}</style>
    </div>
  );
}

```

### app/dashboard/blog/page.tsx

```typescript
"use client";
import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Plus, Search, Eye, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/core/layout";
import { useRouter } from "next/navigation";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";

type FilterOptions = { status:"all"|"published"|"draft"; author:string; sortBy:"newest"|"oldest"|"title"; };
type ContentNode = { type:string; content?:{type:string; text?:string;}[] };
type BlogContent = { type:string; content:ContentNode[] };
type AuthorInfo = { id:string; name:string|null; email:string; };
type BlogPost = {
  id:string;
  title:string;
  slug:string;
  published:boolean;
  created_at:string;
  updated_at:string|null;
  content:BlogContent|null;
  featured_image_url:string|null;
  featured_image_alt:string|null;
  author_id:string;
  author_info?: AuthorInfo[];
};

type BlogPostsRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string|null;
  content: BlogContent|null;
  featured_image_url: string|null;
  featured_image_alt: string|null;
  author_id: string;
};

export default function BlogPage() {
  const [posts,setPosts]=useState<BlogPost[]>([]);
  const [isLoading,setIsLoading]=useState(true);
  const [searchQuery,setSearchQuery]=useState("");
  const [deletePost,setDeletePost]=useState<BlogPost|null>(null);
  const [filters,setFilters]=useState<FilterOptions>({status:"all",author:"all",sortBy:"newest"});
  const supabase = createClientComponentClient();
  const {toast}=useToast();
  const router=useRouter();

  const getContentPreview=(c:BlogContent|null)=>
    c?.content?.map(b=>b.content?.[0]?.text).filter(Boolean).join(" ")||"";

  const getUniqueAuthors=():string[]=>
    Array.from(new Set(posts.flatMap(p=>p.author_info?.[0]?[(p.author_info[0].name||p.author_info[0].email)!]:[])));

  useEffect(()=>{
    (async()=>{
      try {
        setIsLoading(true);
        const {data,error}=await supabase
          .from("blog_posts")
          .select("id,title,slug,published,created_at,updated_at,content,featured_image_url,featured_image_alt,author_id")
          .order("created_at",{ascending:false});

        if(error){
          toast({title:"Error",description:"Failed to load blog posts",variant:"destructive"});
          return;
        }

        const postsData = data as BlogPostsRow[]|null;
        if(!postsData){setPosts([]);return;}

        const authorIds=postsData.map(p=>p.author_id).filter(Boolean);
        let authorsData:AuthorInfo[]|undefined;
        if(authorIds.length>0){
          const {data:aData,error:authorsError}=await supabase
            .from("users")
            .select("id,name,email")
            .in("id",authorIds);
          if(authorsError) console.error("Authors fetch error:",authorsError);
          authorsData=aData?.map(u=>({id:u.id,name:u.name,email:u.email}));
        }

        setPosts(postsData.map(p=>({
          ...p,
          author_info: authorsData?.filter((a)=>a.id===p.author_id)||[]
        })));
      } catch(e){
        console.error(e);
        toast({title:"Error",description:"An error occurred while loading posts",variant:"destructive"});
      } finally {
        setIsLoading(false);
      }
    })();
  },[supabase,toast]);

  const handleDeletePost=async()=>{
    if(!deletePost)return;
    const {error}=await supabase.from("blog_posts").delete().eq("id",deletePost.id);
    if(error){
      toast({title:"Error",description:"Failed to delete post",variant:"destructive"});
      return;
    }
    toast({title:"Success",description:"Post deleted successfully"});
    setPosts(c=>c.filter(x=>x.id!==deletePost.id));
    setDeletePost(null);
  };

  const filteredPosts=useMemo(()=>{
    return posts
      .filter(p=>{
        const s=searchQuery.toLowerCase();
        const matchesSearch=p.title.toLowerCase().includes(s);
        const matchesStatus=filters.status==="all"?true:filters.status==="published"?p.published:!p.published;
        const matchesAuthor=filters.author==="all"?true:(p.author_info?.[0]&&(p.author_info[0].name===filters.author||p.author_info[0].email===filters.author));
        return matchesSearch && matchesStatus && matchesAuthor;
      })
      .sort((a,b)=>{
        switch(filters.sortBy){
          case "newest":return new Date(b.created_at).getTime()-new Date(a.created_at).getTime();
          case "oldest":return new Date(a.created_at).getTime()-new Date(b.created_at).getTime();
          case "title":return a.title.localeCompare(b.title);
          default:return 0;
        }
      });
  },[posts,filters,searchQuery]);

  return (
    <div className="p-6">
      <PageHeader heading="Blog Posts" text="Create and manage your blog content">
        <Button onClick={()=>router.push("/dashboard/blog/new")}><Plus className="mr-2 h-4 w-4"/>New Post</Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
          <Input placeholder="Search posts..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="pl-9"/>
        </div>

        <Select value={filters.status} onValueChange={val=>setFilters(p=>({...p,status:val as FilterOptions["status"]}))}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.author} onValueChange={val=>setFilters(p=>({...p,author:val}))}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Author"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            {getUniqueAuthors().map(a=><SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={val=>setFilters(p=>({...p,sortBy:val as FilterOptions["sortBy"]}))}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Sort by"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(filters.status!=="all"||filters.author!=="all"||searchQuery)&&(
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.status!=="all"&&<Badge variant="secondary" className="capitalize">{filters.status}</Badge>}
          {filters.author!=="all"&&<Badge variant="secondary">Author: {filters.author}</Badge>}
          {searchQuery&&<Badge variant="secondary">Search: {searchQuery}</Badge>}
        </div>
      )}

      {isLoading?(
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"/></div>
      ):filteredPosts.length===0?(
        <div className="text-center py-12"><p className="text-muted-foreground">{searchQuery||filters.status!=="all"||filters.author!=="all"?"No posts found matching your filters.":"No blog posts found. Create your first post!"}</p></div>
      ):(
        <div className="grid gap-6">
          {filteredPosts.map(post=>(
            <div key={post.id} className="group relative flex gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow">
              {post.featured_image_url&&(
                <div className="relative h-32 w-32 rounded-md overflow-hidden bg-muted shrink-0">
                  <Image src={post.featured_image_url} alt={post.featured_image_alt||post.title} fill className="object-cover" unoptimized/>
                </div>
              )}

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium truncate">{post.title}</h3>
                  <Badge variant={post.published?"default":"secondary"}>{post.published?"Published":"Draft"}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4"/>
                    {format(new Date(post.created_at),"MMM d, yyyy")}
                  </div>
                  {post.author_info?.[0]&&(<><span>•</span><span>By {post.author_info[0].name||post.author_info[0].email}</span></>)}
                  {post.updated_at&&post.updated_at!==post.created_at&&(<><span>•</span><span>Updated {format(new Date(post.updated_at),"MMM d, yyyy")}</span></>)}
                </div>

                {post.content&&(
                  <p className="text-sm text-muted-foreground line-clamp-2">{getContentPreview(post.content)}</p>
                )}

                <div className="flex items-center gap-2 mt-4">
                  {post.published&&<Button variant="outline" size="sm" onClick={()=>router.push(`/blog/${post.slug}`)}><Eye className="h-4 w-4 mr-2"/>View</Button>}
                  <Button variant="outline" size="sm" onClick={()=>router.push(`/dashboard/blog/${post.id}`)}>Edit</Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={()=>setDeletePost(post)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletePost} onOpenChange={()=>setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletePost?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-8 p-4 border rounded-lg bg-card">
        <h3 className="font-medium mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Total Posts</div>
            <div className="text-2xl font-bold">{posts.length}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Published</div>
            <div className="text-2xl font-bold">{posts.filter(p=>p.published).length}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Drafts</div>
            <div className="text-2xl font-bold">{posts.filter(p=>!p.published).length}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Authors</div>
            <div className="text-2xl font-bold">{getUniqueAuthors().length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

### app/dashboard/images/page.tsx

```typescript
"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Upload, Trash2, FolderIcon, AlertCircle, Edit2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { Database } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/core/layout";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CATEGORIES = [
  "arroces",
  "carnes",
  "del-huerto",
  "del-mar",
  "para-compartir",
  "para-peques",
  "para-veganos",
  "postres",
  "wines",
] as const;
type Category = (typeof CATEGORIES)[number];

interface ImageInfo {
  name: string;
  url: string;
  category: string;
  usageCount: number;
}

async function getImageUsageCount(
  supabase: ReturnType<typeof createClientComponentClient<Database>>,
  imagePath: string
): Promise<number> {
  const { count } = await supabase
    .from("wines")
    .select("*", { count: "exact", head: true })
    .eq("image_path", imagePath);
  return count || 0;
}

async function fetchImages(
  supabase: ReturnType<typeof createClientComponentClient<Database>>,
  category: string
): Promise<ImageInfo[]> {
  const { data: storageData, error: storageError } = await supabase.storage
    .from("menu")
    .list(category);
  if (storageError) throw storageError;
  const imageList: ImageInfo[] = [];
  for (const file of storageData || []) {
    const { data } = supabase.storage.from("menu").getPublicUrl(`${category}/${file.name}`);
    const usageCount = await getImageUsageCount(supabase, `${category}/${file.name}`);
    imageList.push({ name: file.name, url: data.publicUrl, category, usageCount });
  }
  return imageList;
}

export default function ImagesPage() {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; image: ImageInfo | null }>({
    open: false,
    image: null,
  });
  const [moveDialog, setMoveDialog] = useState<{ open: boolean; image: ImageInfo | null }>({
    open: false,
    image: null,
  });
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; image: ImageInfo | null }>({
    open: false,
    image: null,
  });
  const [newImageName, setNewImageName] = useState("");
  const [targetCategory, setTargetCategory] = useState<Category>(CATEGORIES[0]);

  const handleCategoryChange = (value: string) => {
    if (CATEGORIES.includes(value as Category)) setSelectedCategory(value as Category);
  };

  const handleTargetCategoryChange = (value: string) => {
    if (CATEGORIES.includes(value as Category)) setTargetCategory(value as Category);
  };

  const {
    data: images = [],
    isLoading,
    error,
  } = useQuery<ImageInfo[], Error>({
    queryKey: ["images", selectedCategory],
    queryFn: () => fetchImages(supabase, selectedCategory),
  });

  const uploadMutation = useMutation<string[], Error, File[]>({
    mutationFn: async (files: File[]): Promise<string[]> => {
      const results: string[] = [];
      for (const file of files) {
        if (file.size > 2 * 1024 * 1024) {
          toast({ title: "Error", description: `File ${file.name} exceeds 2MB limit`, variant: "destructive" });
          continue;
        }
        const filePath = `${selectedCategory}/${file.name}`;
        const { error: uploadError } = await supabase.storage.from("menu").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (uploadError) {
          if (uploadError.message.includes("duplicate")) {
            toast({
              title: "Error",
              description: `File ${file.name} already exists`,
              variant: "destructive",
            });
          } else {
            throw uploadError;
          }
          continue;
        }
        results.push(file.name);
      }
      return results;
    },
    onSuccess: (fileNames: string[]) => {
      if (fileNames.length > 0) {
        toast({ title: "Success", description: `Uploaded ${fileNames.length} files` });
        queryClient.invalidateQueries({ queryKey: ["images", selectedCategory] });
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to upload images";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation<string, Error, ImageInfo>({
    mutationFn: async (image: ImageInfo): Promise<string> => {
      const { error: deleteError } = await supabase.storage.from("menu").remove([`${image.category}/${image.name}`]);
      if (deleteError) throw deleteError;
      return image.name;
    },
    onSuccess: (fileName: string) => {
      toast({ title: "Success", description: `Deleted ${fileName}` });
      setDeleteDialog({ open: false, image: null });
      queryClient.invalidateQueries({ queryKey: ["images", selectedCategory] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to delete image";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const moveMutation = useMutation<string, Error, { image: ImageInfo; targetCategory: string }>({
    mutationFn: async ({ image, targetCategory }): Promise<string> => {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("menu")
        .download(`${image.category}/${image.name}`);
      if (downloadError || !fileData) throw new Error("Failed to download file");
      const newFile = new File([fileData], image.name, { type: fileData.type });
      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(`${targetCategory}/${image.name}`, newFile, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { error: removeError } = await supabase.storage
        .from("menu")
        .remove([`${image.category}/${image.name}`]);
      if (removeError) throw removeError;
      return image.name;
    },
    onSuccess: (fileName: string) => {
      toast({ title: "Success", description: `Moved ${fileName}` });
      setMoveDialog({ open: false, image: null });
      queryClient.invalidateQueries({ queryKey: ["images", selectedCategory] });
      queryClient.invalidateQueries({ queryKey: ["images", targetCategory] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to move image";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const renameMutation = useMutation<{ oldName: string; newName: string }, Error, { image: ImageInfo; newImageName: string }>({
    mutationFn: async ({ image, newImageName }): Promise<{ oldName: string; newName: string }> => {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("menu")
        .download(`${image.category}/${image.name}`);
      if (downloadError || !fileData) throw new Error("Failed to download file");
      const newFile = new File([fileData], newImageName, { type: fileData.type });
      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(`${image.category}/${newImageName}`, newFile, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { error: removeError } = await supabase.storage
        .from("menu")
        .remove([`${image.category}/${image.name}`]);
      if (removeError) throw removeError;
      return { oldName: image.name, newName: newImageName };
    },
    onSuccess: ({ oldName, newName }: { oldName: string; newName: string }) => {
      toast({ title: "Success", description: `Renamed ${oldName} to ${newName}` });
      setRenameDialog({ open: false, image: null });
      setNewImageName("");
      queryClient.invalidateQueries({ queryKey: ["images", selectedCategory] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to rename image";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    onDrop: (acceptedFiles: File[]) => uploadMutation.mutate(acceptedFiles),
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  if (error)
    return (
      <div className="container p-6">
        <Alert variant="destructive">
          <AlertDescription>Failed to load images.</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="container p-6">
      <PageHeader heading="Image Management" text="Upload and manage images for menu items">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      <div
        {...getRootProps()}
        className={`mt-6 border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive ? "border-primary" : "border-muted-foreground/25"
        } ${uploadMutation.isPending ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-sm text-muted-foreground">or click to select files</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <div key={image.name} className="group relative aspect-square rounded-lg overflow-hidden border bg-card">
            <Image
              src={image.url}
              alt={image.name}
              fill
              className="object-cover transition-all group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm mb-2 truncate">{image.name}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="secondary" onClick={() => setRenameDialog({ open: true, image })}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setMoveDialog({ open: true, image })}>
                    <FolderIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteDialog({ open: true, image })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, image: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.image && deleteDialog.image.usageCount > 0 ? (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  This image is used in {deleteDialog.image.usageCount}{" "}
                  {deleteDialog.image.usageCount === 1 ? "item" : "items"}. Deleting it will remove the image from those
                  items.
                </div>
              ) : (
                "Are you sure you want to delete this image? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.image && deleteMutation.mutate(deleteDialog.image)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={moveDialog.open} onOpenChange={(open) => setMoveDialog({ open, image: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Image</DialogTitle>
            <DialogDescription>Select a new category for this image</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Category</Label>
              <Input disabled value={moveDialog.image?.category || ""} />
            </div>
            <div className="grid gap-2">
              <Label>Destination Category</Label>
              <Select value={targetCategory} onValueChange={handleTargetCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((cat) => cat !== moveDialog.image?.category).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {moveDialog.image && moveDialog.image.usageCount > 0 && (
                <p className="text-sm text-yellow-600 flex items-center gap-2 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  This image is used in {moveDialog.image.usageCount}{" "}
                  {moveDialog.image.usageCount === 1 ? "item" : "items"}. Moving it will update all references.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDialog({ open: false, image: null })}>
              Cancel
            </Button>
            <Button
              onClick={() => moveDialog.image && moveMutation.mutate({ image: moveDialog.image, targetCategory })}
              disabled={!targetCategory || targetCategory === moveDialog.image?.category || moveMutation.isPending}
            >
              {moveMutation.isPending ? "Moving..." : "Move Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={renameDialog.open}
        onOpenChange={(open) => {
          setRenameDialog({ open, image: null });
          setNewImageName("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Image</DialogTitle>
            <DialogDescription>Enter a new name for the image</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Name</Label>
              <Input disabled value={renameDialog.image?.name || ""} />
            </div>
            <div className="grid gap-2">
              <Label>New Name</Label>
              <Input value={newImageName} onChange={(e) => setNewImageName(e.target.value)} placeholder="image.jpg" />
              {!newImageName.includes(".") && newImageName && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Please include a file extension (e.g., .jpg, .png, .webp)
                </p>
              )}
              {renameDialog.image && renameDialog.image.usageCount > 0 && (
                <p className="text-sm text-yellow-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  This image is used in {renameDialog.image.usageCount}{" "}
                  {renameDialog.image.usageCount === 1 ? "item" : "items"}. Renaming it will update all references.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRenameDialog({ open: false, image: null });
                setNewImageName("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => renameDialog.image && renameMutation.mutate({ image: renameDialog.image, newImageName })}
              disabled={
                !newImageName ||
                newImageName === renameDialog.image?.name ||
                !newImageName.includes(".") ||
                renameMutation.isPending
              }
            >
              {renameMutation.isPending ? "Renaming..." : "Rename Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

### app/dashboard/menu/daily/page.tsx

```typescript
"use client";
import React,{useState,useMemo}from"react";
import{Plus,ToggleLeft,Edit,Copy,Search,Calendar as CalendarIcon}from"lucide-react";
import{useToast}from"@/hooks/use-toast";
import type{Database}from'@/types';
import{createClientComponentClient}from"@supabase/auth-helpers-nextjs";
import{useQuery,useMutation,useQueryClient}from"@tanstack/react-query";
import{startOfWeek,endOfWeek,startOfMonth,endOfMonth,addWeeks,addMonths,addDays,format,isSameDay}from"date-fns";
import{es}from"date-fns/locale";
import{DateRange}from"react-day-picker";
import{cn}from"@/lib/utils";
import{Button}from"@/components/ui/button";
import{Switch}from"@/components/ui/switch";
import{Input}from"@/components/ui/input";
import{Label}from"@/components/ui/label";
import{Alert,AlertDescription}from"@/components/ui/alert";
import{Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter}from"@/components/ui/dialog";
import{Select,SelectContent,SelectItem,SelectTrigger,SelectValue}from"@/components/ui/select";
import{Calendar}from"@/components/ui/calendar";
import{Popover,PopoverTrigger,PopoverContent}from"@/components/ui/popover";

interface DailyMenuItem{id:string;course_name:string;course_type:"first"|"second";display_order:number}
interface DailyMenu{id:string;date:string;repeat_pattern:"none"|"weekly"|"monthly";active:boolean;scheduled_for:string;created_at:string;daily_menu_items:DailyMenuItem[]}
interface FilterOptions{search:string;pattern:"all"|"none"|"weekly"|"monthly";status:"all"|"active"|"inactive"}
interface AdvancedFilterOptions extends FilterOptions{dateRange:DateRange|undefined;courseSearch:string;}
interface NewMenu{dateRange:DateRange;repeat_pattern:"none"|"weekly"|"monthly";active:boolean;firstCourse:string;secondCourse:string;}
interface GroupedMenus{[key:string]:DailyMenu[]}

function groupMenusByWeek(menus:DailyMenu[]):GroupedMenus{return menus.reduce((acc,menu)=>{const w=format(startOfWeek(new Date(menu.date),{locale:es}),'yyyy-MM-dd');acc[w]=(acc[w]||[]).concat(menu);return acc;},{} as GroupedMenus);}

const getThisWeekRange=():DateRange=>({from:startOfWeek(new Date(),{locale:es}),to:endOfWeek(new Date(),{locale:es})});
const getNextWeekRange=():DateRange=>({from:startOfWeek(addWeeks(new Date(),1),{locale:es}),to:endOfWeek(addWeeks(new Date(),1),{locale:es})});
const getThisMonthRange=():DateRange=>({from:startOfMonth(new Date()),to:endOfMonth(new Date())});

async function fetchDailyMenus(supabase:ReturnType<typeof createClientComponentClient<Database>>){const{data,error}=await supabase.from("daily_menus").select(`id,date,repeat_pattern,active,scheduled_for,created_at,daily_menu_items (id,course_name,course_type,display_order)`).order("date",{ascending:false});if(error)throw error;return data as DailyMenu[];}

const AdvancedFilters=({filters,onFilterChange}:{filters:AdvancedFilterOptions;onFilterChange:(f:AdvancedFilterOptions)=>void;})=>(
  <div className="space-y-4">
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
        <Input placeholder="Search menus..." value={filters.search} onChange={e=>onFilterChange({...filters,search:e.target.value})} className="pl-9"/>
      </div>
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
        <Input placeholder="Search courses..." value={filters.courseSearch} onChange={e=>onFilterChange({...filters,courseSearch:e.target.value})} className="pl-9"/>
      </div>
      <Select value={filters.pattern} onValueChange={(value:FilterOptions["pattern"])=>onFilterChange({...filters,pattern:value})}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by pattern"/></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Patterns</SelectItem>
          <SelectItem value="none">Single</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[200px] justify-start">
            <CalendarIcon className="mr-2 h-4 w-4"/>
            {filters.dateRange?.from?filters.dateRange.to?`${format(filters.dateRange.from,"PPP",{locale:es})} - ${format(filters.dateRange.to,"PPP",{locale:es})}`:format(filters.dateRange.from,"PPP",{locale:es}):"Pick a date range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="range" selected={filters.dateRange} onSelect={range=>onFilterChange({...filters,dateRange:range})}/>
        </PopoverContent>
      </Popover>
      <Select value={filters.status} onValueChange={(value:FilterOptions["status"])=>onFilterChange({...filters,status:value})}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status"/></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const QuickActions=({onSelectDateRange,onCreateMenu}:{onSelectDateRange:(r:DateRange)=>void;onCreateMenu:()=>void;})=>(
  <div className="flex items-center justify-between mb-6">
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={()=>onSelectDateRange(getThisWeekRange())}>This Week</Button>
      <Button variant="outline" size="sm" onClick={()=>onSelectDateRange(getNextWeekRange())}>Next Week</Button>
      <Button variant="outline" size="sm" onClick={()=>onSelectDateRange(getThisMonthRange())}>This Month</Button>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={()=>onSelectDateRange({from:new Date(),to:new Date()})}>
        <CalendarIcon className="mr-2 h-4 w-4"/>
        Today
      </Button>
      <Button onClick={onCreateMenu}>
        <Plus className="mr-2 h-4 w-4"/>
        Schedule Menu
      </Button>
    </div>
  </div>
);

type MenuCardProps={menu:DailyMenu;onStatusToggle:(id:string,status:boolean)=>void;onEdit:(m:DailyMenu)=>void;onDuplicate:(m:DailyMenu)=>void;}

const MenuCard=({menu,onStatusToggle,onEdit,onDuplicate}:MenuCardProps)=>(
  <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 rounded-sm relative group">
    <div className="flex justify-between items-start mb-6">
      <div>
        <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide">DATE</div>
        <div className="text-lg mt-1">{format(new Date(menu.date),"PPP",{locale:es})}</div>
      </div>
      <Switch checked={menu.active} onCheckedChange={checked=>onStatusToggle(menu.id,checked)} aria-label={`Toggle ${format(new Date(menu.date),"PPP",{locale:es})} menu status`} className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",menu.active?"bg-black":"bg-gray-200")}>
        <span className="sr-only">Toggle menu status</span>
        <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform",menu.active?"translate-x-6":"translate-x-1")}/>
      </Switch>
    </div>
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide">PATTERN</div>
        <div className="mt-1 capitalize">{menu.repeat_pattern}</div>
      </div>
      <div>
        <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide">COURSES</div>
        <div className="grid gap-2 mt-2">
          {menu.daily_menu_items?.sort((a,b)=>a.display_order-b.display_order).map(item=><div key={item.id} className="text-sm"><span className="font-medium capitalize">{item.course_type}:</span> {item.course_name}</div>)}
        </div>
      </div>
    </div>
    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button size="sm" variant="ghost" onClick={()=>onEdit(menu)} className="hover:bg-black hover:text-white" aria-label="Edit menu"><Edit className="h-4 w-4"/></Button>
        <Button size="sm" variant="ghost" onClick={()=>onDuplicate(menu)} className="hover:bg-black hover:text-white" aria-label="Duplicate menu"><Copy className="h-4 w-4"/></Button>
        <Button size="sm" variant="ghost" onClick={()=>onStatusToggle(menu.id,menu.active)} className="hover:bg-black hover:text-white" aria-label="Toggle menu status"><ToggleLeft className="h-4 w-4"/></Button>
      </div>
    </div>
  </div>
);

const MenuListSection=({filteredMenus,toggleMenuStatus,handleEditMenu,handleDuplicateMenu}:{filteredMenus:DailyMenu[];toggleMenuStatus:(id:string,status:boolean)=>void;handleEditMenu:(m:DailyMenu)=>void;handleDuplicateMenu:(m:DailyMenu)=>void;})=>{
  const groupedMenus=useMemo(()=>groupMenusByWeek(filteredMenus),[filteredMenus]);
  if(!filteredMenus.length)return<div className="text-center py-12"><p className="text-muted-foreground">No menus found.</p></div>;
  return(
    <div className="space-y-8">
      {Object.entries(groupedMenus).map(([week,menus])=>(
        <div key={week} className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-white z-10 py-2">
            Week of {format(new Date(week),"PPP",{locale:es})}
          </h3>
          <div className="space-y-4">
            {menus.map(menu=><MenuCard key={menu.id} menu={menu} onStatusToggle={toggleMenuStatus} onEdit={handleEditMenu} onDuplicate={handleDuplicateMenu}/>)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function DailyMenuPage(){
  const supabase=createClientComponentClient<Database>(),{toast}=useToast(),queryClient=useQueryClient();
  const[advancedFilter,setAdvancedFilter]=useState<AdvancedFilterOptions>({search:"",pattern:"all",status:"all",dateRange:undefined,courseSearch:""});
  const[isDialogOpen,setIsDialogOpen]=useState(false);
  const[editingMenu,setEditingMenu]=useState<DailyMenu|null>(null);
  const[newMenu,setNewMenu]=useState<NewMenu>({dateRange:{from:new Date(),to:new Date()},repeat_pattern:"none",active:true,firstCourse:"",secondCourse:""});
  const {data:dailyMenus=[],isLoading,error}=useQuery<DailyMenu[],Error>({queryKey:["dailyMenus"],queryFn:()=>fetchDailyMenus(supabase)});

  const queryInvalidate=()=>queryClient.invalidateQueries({queryKey:["dailyMenus"]});

  const toggleStatusMutation=useMutation({
    mutationFn:async({id,status}:{id:string;status:boolean})=>{
      const{error:toggleError}=await supabase.from("daily_menus").update({active:status}).eq("id",id);
      if(toggleError)throw toggleError;
    },
    onSuccess:()=>{
      queryInvalidate();
      toast({title:"Success",description:"Menu status updated successfully"});
    },
    onError:()=>{
      toast({title:"Error",description:"Failed to update menu status",variant:"destructive"});
    },
  });

  type InsertedMenu=Pick<DailyMenu,'id'|'date'|'repeat_pattern'|'active'|'scheduled_for'|'created_at'>;
  const createMenuMutation=useMutation({
    mutationFn:async()=>{
      const{dateRange,firstCourse,secondCourse,repeat_pattern,active}=newMenu;
      if(!dateRange.from||!firstCourse||!secondCourse)throw new Error("Please fill in all required fields and select dates");
      const datesToSchedule:Date[]=[];
      let currentDate=new Date(dateRange.from);
      const endDate=dateRange.to?new Date(dateRange.to):new Date(dateRange.from);
      while(currentDate<=endDate){
        datesToSchedule.push(new Date(currentDate));
        currentDate=repeat_pattern==="weekly"?addWeeks(currentDate,1):repeat_pattern==="monthly"?addMonths(currentDate,1):addDays(currentDate,1);
      }
      const menusToInsert=datesToSchedule.filter(date=>!dailyMenus.some(m=>isSameDay(new Date(m.date),date))).map(date=>({
        date:format(date,"yyyy-MM-dd"),
        repeat_pattern,
        active,
        scheduled_for:format(date,"yyyy-MM-dd'T'11:00:00.000'Z'"),
      }));
      if(!menusToInsert.length)throw new Error("No new menus to schedule.");
      const{data:insertedMenus,error:insertError}=await supabase.from("daily_menus").insert(menusToInsert).select();
      if(insertError)throw insertError;
      const allMenuItems=(insertedMenus as InsertedMenu[]).flatMap(menu=>[
        {daily_menu_id:menu.id,course_name:firstCourse,course_type:"first" as const,display_order:1},
        {daily_menu_id:menu.id,course_name:secondCourse,course_type:"second" as const,display_order:2},
      ]);
      const{error:itemsError}=await supabase.from("daily_menu_items").insert(allMenuItems);
      if(itemsError)throw itemsError;
    },
    onSuccess:()=>{
      queryInvalidate();setIsDialogOpen(false);resetNewMenu();
      toast({title:"Success",description:"Menus scheduled successfully"});
    },
    onError:(err)=>{
      const message=err instanceof Error?err.message:"Failed to schedule menus";
      toast({title:"Error",description:message,variant:"destructive"});
    },
  });

  const handleDuplicateMenu=(menu:DailyMenu)=>{
    setNewMenu({
      dateRange:{from:new Date(),to:new Date()},
      repeat_pattern:"none",
      active:true,
      firstCourse:menu.daily_menu_items.find(i=>i.course_type==="first")?.course_name||"",
      secondCourse:menu.daily_menu_items.find(i=>i.course_type==="second")?.course_name||"",
    });
    setIsDialogOpen(true);
  };

  const handleEditMenu=(menu:DailyMenu)=>{
    setEditingMenu(menu);
    setNewMenu({
      dateRange:{from:new Date(menu.date),to:new Date(menu.date)},
      repeat_pattern:menu.repeat_pattern,
      active:menu.active,
      firstCourse:menu.daily_menu_items.find(i=>i.course_type==="first")?.course_name||"",
      secondCourse:menu.daily_menu_items.find(i=>i.course_type==="second")?.course_name||"",
    });
    setIsDialogOpen(true);
  };

  const resetNewMenu=()=>{setEditingMenu(null);setNewMenu({dateRange:{from:new Date(),to:new Date()},repeat_pattern:"none",active:true,firstCourse:"",secondCourse:""});};

  const filteredMenus=useMemo(()=>{
    let menus=[...dailyMenus];
    if(advancedFilter.search.trim()){
      const s=advancedFilter.search.toLowerCase();
      menus=menus.filter(m=>m.daily_menu_items.some(i=>i.course_name.toLowerCase().includes(s)));
    }
    if(advancedFilter.courseSearch.trim()){
      const c=advancedFilter.courseSearch.toLowerCase();
      menus=menus.filter(m=>m.daily_menu_items.some(i=>i.course_name.toLowerCase().includes(c)));
    }
    if(advancedFilter.pattern!=="all")menus=menus.filter(m=>m.repeat_pattern===advancedFilter.pattern);
    if(advancedFilter.status!=="all"){
      const isActive=advancedFilter.status==="active";
      menus=menus.filter(m=>m.active===isActive);
    }
    if(advancedFilter.dateRange?.from&&advancedFilter.dateRange?.to){
      const{from,to}=advancedFilter.dateRange;
      menus=menus.filter(m=>{const d=new Date(m.date);return d>=from&&d<=to;});
    }
    return menus.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());
  },[dailyMenus,advancedFilter]);

  return(
    <div className="min-h-screen bg-background">
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium mb-1">Daily Menus</h1>
            <p className="text-sm uppercase text-muted-foreground tracking-wide">Menu Schedule Management</p>
          </div>
          <Button onClick={()=>{resetNewMenu();setIsDialogOpen(true);}} className="bg-black hover:bg-gray-800 text-white rounded-none">
            <Plus className="mr-2 h-4 w-4"/>Schedule Menu
          </Button>
        </div>

        {error&&<Alert variant="destructive"><AlertDescription>{String(error)}</AlertDescription></Alert>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Calendar View</h2>
              <p className="text-sm text-gray-500 mt-1">SELECT DATES TO VIEW OR SCHEDULE MENUS</p>
            </div>
            <QuickActions onSelectDateRange={r=>setNewMenu({...newMenu,dateRange:r})} onCreateMenu={()=>{resetNewMenu();setIsDialogOpen(true);}}/>
            {isLoading?<div className="flex h-[200px] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"/></div>:
              <Calendar mode="range" selected={newMenu.dateRange} onSelect={range=>setNewMenu({...newMenu,dateRange:range||{from:undefined,to:undefined}})} numberOfMonths={1} locale={es}/>}
            <div className="mt-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-black rounded-sm"/><span className="text-sm text-gray-600">Single</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#2563eb] rounded-sm"/><span className="text-sm text-gray-600">Weekly</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#7c3aed] rounded-sm"/><span className="text-sm text-gray-600">Monthly</span></div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-medium mb-1">Scheduled Menus</h2>
              <p className="text-sm uppercase text-muted-foreground tracking-wide">View and manage your daily menus</p>
            </div>
            <AdvancedFilters filters={advancedFilter} onFilterChange={setAdvancedFilter}/>
            {isLoading?<div className="flex h-[200px] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"/></div>:
              <MenuListSection
                filteredMenus={filteredMenus}
                toggleMenuStatus={(id,status)=>toggleStatusMutation.mutate({id,status:!status})}
                handleEditMenu={handleEditMenu}
                handleDuplicateMenu={handleDuplicateMenu}
              />}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={open=>{if(!open)resetNewMenu();setIsDialogOpen(open);}}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingMenu?"Edit Menu":"Schedule Menu"}</DialogTitle>
              <DialogDescription>{editingMenu?"Modify the menu details":"Create a new menu by selecting dates and entering courses"}</DialogDescription>
            </DialogHeader>

            <form onSubmit={e=>{e.preventDefault();createMenuMutation.mutate();}} className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground font-medium tracking-wide">Selected Dates</Label>
                <div className="text-sm">
                  {newMenu.dateRange.from&&format(newMenu.dateRange.from,"PPP",{locale:es})}
                  {newMenu.dateRange.to&&newMenu.dateRange.from!==newMenu.dateRange.to&&` - ${format(newMenu.dateRange.to,"PPP",{locale:es})}`}
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground font-medium tracking-wide">Repeat Pattern</Label>
                <Select value={newMenu.repeat_pattern} onValueChange={value=>setNewMenu({...newMenu,repeat_pattern:value as NewMenu["repeat_pattern"]})}>
                  <SelectTrigger><SelectValue placeholder="Select repeat pattern"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground font-medium tracking-wide">First Course</Label>
                <Input value={newMenu.firstCourse} onChange={e=>setNewMenu({...newMenu,firstCourse:e.target.value})} placeholder="Enter first course" required/>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground font-medium tracking-wide">Second Course</Label>
                <Input value={newMenu.secondCourse} onChange={e=>setNewMenu({...newMenu,secondCourse:e.target.value})} placeholder="Enter second course" required/>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={()=>{resetNewMenu();setIsDialogOpen(false);}}>Cancel</Button>
                <Button type="submit">{editingMenu?"Update Menu":"Schedule Menu"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

```

### app/dashboard/menu/wine/page.tsx

```typescript
"use client";
import React, { useState, useMemo, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { Plus, Image as ImageIcon, Edit, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/core/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WineCategory {
  id: number;
  name: string;
  display_order: number;
}

interface Wine {
  id: number;
  name: string;
  description: string;
  bottle_price: number;
  glass_price: number | null;
  active: boolean;
  created_at: string;
  categories: WineCategory[];
  image_path: string;
  image_url: string;
}

interface NewWine {
  name: string;
  description: string;
  bottle_price: string;
  glass_price: string;
  category_ids: number[];
  active: boolean;
  image_path: string;
}

interface EditWineDialog {
  open: boolean;
  wine: Wine | null;
}

interface EditFormData {
  name: string;
  description: string;
  bottle_price: string;
  glass_price: string;
  category_ids: number[];
}

async function fetchCategories(supabase: ReturnType<typeof createClientComponentClient<Database>>) {
  const { data, error } = await supabase
    .from("wine_categories")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return data as WineCategory[];
}

async function fetchWines(supabase: ReturnType<typeof createClientComponentClient<Database>>) {
  const { data, error } = await supabase
    .from("wines")
    .select(`*, wine_category_assignments ( wine_categories ( id, name, display_order ) )`)
    .order("name");
  if (error) throw error;

  type WineResponse = {
    id: number;
    name: string;
    description: string;
    bottle_price: number;
    glass_price: number;
    active: boolean;
    created_at: string;
    wine_category_assignments: {
      wine_categories: WineCategory[];
    }[];
    image_path?: string;
    image_url?: string;
  };

  const rawWines = data as WineResponse[];
  return rawWines.map((wine) => ({
    id: wine.id,
    name: wine.name,
    description: wine.description,
    bottle_price: wine.bottle_price,
    glass_price: wine.glass_price,
    active: wine.active,
    created_at: wine.created_at,
    categories: wine.wine_category_assignments.flatMap((a) => a.wine_categories),
    image_path: wine.image_path || "wines/wine.webp",
    image_url:
      wine.image_url ||
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/wines/wine.webp`,
  })) as Wine[];
}

function highlightText(text: string, searchTerm: string) {
  if (!searchTerm.trim()) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-orange-500 text-white">
        {part}
      </span>
    ) : (
      part
    )
  );
}

const WineCard = ({
  wine,
  searchTerm,
  handleEdit,
}: {
  wine: Wine;
  searchTerm: string;
  handleEdit: (wine: Wine) => void;
}) => (
  <div className="group relative flex flex-col bg-white border border-neutral-100 rounded-sm p-6 hover:shadow-sm transition-shadow">
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleEdit(wine)}
        className="h-8 w-8 p-0"
        aria-label={`Edit ${wine.name}`}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
    <div className="relative w-full pb-[150%] mb-4">
      <Image
        src={wine.image_url}
        alt={wine.name}
        fill
        className="object-contain"
        sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw,(max-width: 1536px) 33vw,25vw"
        priority={false}
        loading="lazy"
        unoptimized
        onError={(e) => {
          (e.target as HTMLImageElement).src = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/wines/wine.webp`;
        }}
      />
    </div>
    <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
      {wine.categories.map((c) => c.name).join(" · ")}
    </div>
    <h3 className="text-lg font-medium mb-2 line-clamp-2">
      {highlightText(wine.name, searchTerm)}
    </h3>
    <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
      {highlightText(wine.description, searchTerm)}
    </p>
    <div className="mt-auto grid grid-cols-2 gap-x-4 text-sm">
      <div>
        <div className="font-medium">${wine.bottle_price.toFixed(2)}</div>
        <div className="text-neutral-500 uppercase text-xs">bottle</div>
      </div>
      {wine.glass_price && (
        <div>
          <div className="font-medium">${wine.glass_price.toFixed(2)}</div>
          <div className="text-neutral-500 uppercase text-xs">glass</div>
        </div>
      )}
    </div>
  </div>
);

export default function WinePage() {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedWineId, setSelectedWineId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newWine, setNewWine] = useState<NewWine>({
    name: "",
    description: "",
    bottle_price: "",
    glass_price: "",
    category_ids: [],
    active: true,
    image_path: "wines/wine.webp",
  });

  const [editDialog, setEditDialog] = useState<EditWineDialog>({
    open: false,
    wine: null,
  });

  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    description: "",
    bottle_price: "",
    glass_price: "",
    category_ids: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<WineCategory[]>({
    queryKey: ["wineCategories"],
    queryFn: () => fetchCategories(supabase),
  });

  const {
    data: wines = [],
    isLoading: winesLoading,
    error: winesError,
  } = useQuery<Wine[]>({
    queryKey: ["wines"],
    queryFn: () => fetchWines(supabase),
  });

  const isLoading = categoriesLoading || winesLoading;
  const error = categoriesError || winesError;

  const createWineMutation = useMutation({
    mutationFn: async (data: NewWine) => {
      if (!data.name || !data.bottle_price) throw new Error("Please fill in all required fields");
      const { data: wine, error: wineError } = await supabase
        .from("wines")
        .insert({
          name: data.name,
          description: data.description,
          bottle_price: parseFloat(data.bottle_price),
          glass_price: data.glass_price ? parseFloat(data.glass_price) : null,
          active: data.active,
          image_path: data.image_path,
        })
        .select()
        .single();
      if (wineError) throw wineError;
      if (data.category_ids.length > 0) {
        const categoryAssignments = data.category_ids.map((categoryId) => ({
          wine_id: wine.id,
          category_id: categoryId,
        }));
        const { error: assignmentError } = await supabase.from("wine_category_assignments").insert(categoryAssignments);
        if (assignmentError) throw assignmentError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      setIsDialogOpen(false);
      setNewWine({ name: "", description: "", bottle_price: "", glass_price: "", category_ids: [], active: true, image_path: "wines/wine.webp" });
      toast({ title: "Success", description: "Wine added successfully" });
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const updateWineMutation = useMutation({
    mutationFn: async ({ wineId, form }: { wineId: number; form: EditFormData }) => {
      const { data: updatedWine, error: wineError } = await supabase
        .from("wines")
        .update({
          name: form.name,
          description: form.description,
          bottle_price: parseFloat(form.bottle_price),
          glass_price: form.glass_price ? parseFloat(form.glass_price) : null,
        })
        .eq("id", wineId)
        .select("*")
        .single();
      if (wineError) throw wineError;
      const { error: deleteError } = await supabase.from("wine_category_assignments").delete().eq("wine_id", wineId);
      if (deleteError) throw deleteError;
      if (form.category_ids.length > 0) {
        const assignments = form.category_ids.map((categoryId) => ({ wine_id: wineId, category_id: categoryId }));
        const { error: assignmentError } = await supabase.from("wine_category_assignments").insert(assignments);
        if (assignmentError) throw assignmentError;
      }
      return updatedWine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      toast({ title: "Success", description: "Wine updated successfully" });
      setEditDialog({ open: false, wine: null });
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Warning", description: msg, variant: "destructive" });
      setEditDialog({ open: false, wine: null });
    },
  });

  const toggleWineStatusMutation = useMutation({
    mutationFn: async ({ wineId, currentStatus }: { wineId: number; currentStatus: boolean }) => {
      const { error } = await supabase.from("wines").update({ active: !currentStatus }).eq("id", wineId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wines"] }),
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ file, wineId }: { file: File; wineId: number }) => {
      const ext = file.name.split(".").pop();
      const filePath = `wines/${wineId}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("menu").upload(filePath, file, { cacheControl: "3600", upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("menu").getPublicUrl(filePath);
      if (!urlData.publicUrl) throw new Error("Failed to get public URL");
      const { error: updateError } = await supabase.from("wines").update({ image_path: filePath, image_url: urlData.publicUrl }).eq("id", wineId);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      toast({ title: "Success", description: "Image updated successfully" });
      setIsImageDialogOpen(false);
      setSelectedWineId(null);
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const filteredAndSortedWines = useMemo(() => {
    let filtered = wines;
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter((wine) => wine.name.toLowerCase().includes(s) || wine.description.toLowerCase().includes(s));
    }
    if (selectedFilter !== "all") filtered = filtered.filter((wine) => wine.categories.some((cat) => cat.id.toString() === selectedFilter));
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      return sortOrder === "asc" ? a.bottle_price - b.bottle_price : b.bottle_price - a.bottle_price;
    });
  }, [wines, selectedFilter, sortBy, sortOrder, searchTerm]);

  const handleCreateWine = () => createWineMutation.mutate(newWine);
  const handleEdit = (wine: Wine) => {
    setEditForm({
      name: wine.name,
      description: wine.description,
      bottle_price: wine.bottle_price.toString(),
      glass_price: wine.glass_price?.toString() || "",
      category_ids: wine.categories.map((c) => c.id),
    });
    setEditDialog({ open: true, wine });
  };
  const handleSaveEdit = () => { if (editDialog.wine) updateWineMutation.mutate({ wineId: editDialog.wine.id, form: editForm }); };
  const toggleWineStatus = (id: number, currentStatus: boolean) => toggleWineStatusMutation.mutate({ wineId: id, currentStatus });
  const handleSelectImage = (wineId: number) => { setSelectedWineId(wineId); setIsImageDialogOpen(true); fileInputRef.current?.click(); };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedWineId) { toast({ title: "Error", description: "No file selected", variant: "destructive" }); return; }
    uploadImageMutation.mutate({ file, wineId: selectedWineId });
  };

  if (isLoading)
    return <div className="flex items-center justify-center h-[200px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"/></div>;
  if (error)
    return <div className="container p-6"><Alert variant="destructive"><AlertDescription>Failed to load wines or categories.</AlertDescription></Alert></div>;
  if (!wines.length)
    return <div className="container p-6"><Alert><AlertDescription>No wines found. Add one to get started.</AlertDescription></Alert><div className="mt-4"><Button onClick={()=>setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4"/>Add Wine</Button></div></div>;

  return (
    <div className="container p-6">
      <PageHeader heading="Wine List" text="Manage your restaurant's wine selection">
        <Button onClick={()=>setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4"/>Add Wine
        </Button>
      </PageHeader>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-[300px]">
            <Input type="text" placeholder="Search wines..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-10"/>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
          </div>

          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Category"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c=><SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val:"name"|"price")=>setSortBy(val)}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={()=>setSortOrder(o=>o==="asc"?"desc":"asc")} aria-label={`Sort order: ${sortOrder==="asc"?"Ascending":"Descending"}`}>
            {sortOrder==="asc"?"↑":"↓"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredAndSortedWines.map(wine=><WineCard key={wine.id} wine={wine} searchTerm={searchTerm} handleEdit={handleEdit}/>)}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Wine</DialogTitle>
            <DialogDescription>Add a new wine to your list with its details and pricing.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={newWine.name} onChange={e=>setNewWine({...newWine,name:e.target.value})} placeholder="Wine name"/></div>
            <div className="grid gap-2"><Label>Description</Label><Input value={newWine.description} onChange={e=>setNewWine({...newWine,description:e.target.value})} placeholder="Wine description"/></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Bottle Price</Label><Input type="number" step="0.01" value={newWine.bottle_price} onChange={e=>setNewWine({...newWine,bottle_price:e.target.value})} placeholder="0.00"/></div>
              <div className="grid gap-2"><Label>Glass Price (Optional)</Label><Input type="number" step="0.01" value={newWine.glass_price} onChange={e=>setNewWine({...newWine,glass_price:e.target.value})} placeholder="0.00"/></div>
            </div>
            <div className="grid gap-2">
              <Label>Categories</Label>
              <Select value={newWine.category_ids[0]?.toString()||""} onValueChange={val=>setNewWine({...newWine,category_ids:[...newWine.category_ids,parseInt(val)]})}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select categories"/></SelectTrigger>
                <SelectContent>
                  {categories.map(cat=>(
                    <SelectItem key={cat.id} value={cat.id.toString()} disabled={newWine.category_ids.includes(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {newWine.category_ids.map(categoryId=>{
                  const c=categories.find(ct=>ct.id===categoryId);
                  return c?(
                    <Badge key={c.id} variant="secondary" className="flex items-center gap-1">
                      {c.name}
                      <button type="button" onClick={()=>setNewWine({...newWine,category_ids:newWine.category_ids.filter(id=>id!==categoryId)})} className="ml-1 hover:text-destructive" aria-label={`Remove category ${c.name}`}>
                        ×
                      </button>
                    </Badge>
                  ):null;
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={()=>setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateWine}>{createWineMutation.isPending?"Creating...":"Create Wine"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialog.open} onOpenChange={open=>!open&&setEditDialog({open,wine:null})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wine</DialogTitle>
            <DialogDescription>Update the details of the wine.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} placeholder="Wine name"/></div>
            <div className="grid gap-2"><Label>Description</Label><Input value={editForm.description} onChange={e=>setEditForm({...editForm,description:e.target.value})} placeholder="Wine description"/></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Bottle Price</Label><Input type="number" step="0.01" value={editForm.bottle_price} onChange={e=>setEditForm({...editForm,bottle_price:e.target.value})} placeholder="0.00"/></div>
              <div className="grid gap-2"><Label>Glass Price (Optional)</Label><Input type="number" step="0.01" value={editForm.glass_price} onChange={e=>setEditForm({...editForm,glass_price:e.target.value})} placeholder="0.00"/></div>
            </div>
            <div className="grid gap-2">
              <Label>Categories</Label>
              <Select value={editForm.category_ids[0]?.toString()||""} onValueChange={val=>setEditForm({...editForm,category_ids:[...editForm.category_ids,parseInt(val)]})}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select categories"/></SelectTrigger>
                <SelectContent>
                  {categories.map(cat=>(
                    <SelectItem key={cat.id} value={cat.id.toString()} disabled={editForm.category_ids.includes(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {editForm.category_ids.map(categoryId=>{
                  const c=categories.find(ct=>ct.id===categoryId);
                  return c?(
                    <Badge key={c.id} variant="secondary" className="flex items-center gap-1">
                      {c.name}
                      <button type="button" onClick={()=>setEditForm({...editForm,category_ids:editForm.category_ids.filter(id=>id!==categoryId)})} className="ml-1 hover:text-destructive" aria-label={`Remove category ${c.name}`}>
                        ×
                      </button>
                    </Badge>
                  ):null;
                })}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="flex-1" onClick={()=>editDialog.wine&&toggleWineStatus(editDialog.wine.id,editDialog.wine.active)}>
                {editDialog.wine?.active?"Set Unavailable":"Set Available"}
              </Button>
              <Button variant="outline" size="sm" onClick={()=>editDialog.wine&&handleSelectImage(editDialog.wine.id)}>
                <ImageIcon className="h-4 w-4 mr-2"/>Change Image
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={()=>setEditDialog({open:false,wine:null})}>Cancel</Button>
            <Button onClick={handleSaveEdit}>{updateWineMutation.isPending?"Saving...":"Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Wine Image</DialogTitle>
            <DialogDescription>Select a new image for the wine.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <input type="file" accept="image/*" ref={fileInputRef} style={{display:"none"}} onChange={handleImageUpload}/>
            <Button variant="outline" onClick={()=>fileInputRef.current?.click()} disabled={uploadImageMutation.isPending}>
              {uploadImageMutation.isPending?"Uploading...":"Select Image"}
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={()=>setIsImageDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

### app/dashboard/menu/page.tsx

```typescript
"use client";
import React,{useState,useMemo,useCallback,useTransition,useEffect}from"react";
import{createClientComponentClient}from"@supabase/auth-helpers-nextjs";
import Image from"next/image";
import{Plus,Search,Edit}from"lucide-react";
import{Button}from"@/components/ui/button";
import{useToast}from"@/hooks/use-toast";
import{Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle}from"@/components/ui/dialog";
import{Input}from"@/components/ui/input";
import{Label}from"@/components/ui/label";
import{Select,SelectContent,SelectItem,SelectTrigger,SelectValue}from"@/components/ui/select";
import{Alert,AlertDescription}from"@/components/ui/alert";
import{PageHeader}from"@/components/core/layout";
import{Badge}from"@/components/ui/badge";
import{MultiSelect}from"@/components/ui/multi-select";
import{useQuery,useQueryClient}from"@tanstack/react-query";

type Allergen={id:string;name:string;};
type Category={id:string;name:string;};
type RawMenuItemResponse={
  id:string;name:string;description:string;price:number;category_id:number;image_path:string|null;active:boolean;
  menu_categories:{id:string;name:string;}[];
  menu_item_allergens:{allergens:{id:string;name:string;}[]}[];
};
type MenuItem={
  id:string;name:string;description:string;price:number;category_id:number;image_url:string|null;image_path:string|null;active:boolean;
  category?:{id:string;name:string;}|null;
  allergens?:Allergen[];
};
type NewMenuItem={name:string;description:string;price:string;category_id:string;active:boolean;allergen_ids:string[];};
interface EditDialogState{open:boolean;item:MenuItem|null;}
interface EditFormData{name:string;description:string;price:string;category_id:string;allergen_ids:string[];}

export default function MenuPage(){
  const supabase=createClientComponentClient();
  const{toast}=useToast();
  const queryClient=useQueryClient();
  const[isDialogOpen,setIsDialogOpen]=useState(false);
  const[newItem,setNewItem]=useState<NewMenuItem>({name:"",description:"",price:"",category_id:"",active:true,allergen_ids:[]});
  const[editDialog,setEditDialog]=useState<EditDialogState>({open:false,item:null});
  const[editForm,setEditForm]=useState<EditFormData>({name:"",description:"",price:"",category_id:"",allergen_ids:[]});
  const[,startSearchTransition]=useTransition();
  const[selectedFilter,setSelectedFilter]=useState("all");
  const[searchTerm,setSearchTerm]=useState("");
  const[localSearchTerm,setLocalSearchTerm]=useState(searchTerm);

  useEffect(()=>{
    const handler=setTimeout(()=>{startSearchTransition(()=>setSearchTerm(localSearchTerm));},300);
    return()=>clearTimeout(handler);
  },[localSearchTerm,startSearchTransition]);

  const getImageUrl=(path:string|null)=>path?`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/${path}`:null;

  const highlightText=useCallback((text:string,term:string)=>{
    if(!term.trim())return text;
    const regex=new RegExp(`(${term})`,"gi");
    return text.split(regex).map((part,i)=>
      regex.test(part)?<span key={i} className="bg-orange-500 text-white">{part}</span>:part
    );
  },[]);

  const fetchAllergens=async()=>{
    const{data,error}=await supabase.from("allergens").select("*").order("name");
    if(error)throw error;return data as Allergen[];
  };

  const fetchCategories=async()=>{
    const{data,error}=await supabase.from("menu_categories").select("*").order("name");
    if(error)throw error;return data as Category[];
  };

  const fetchItems=async()=>{
    const{data,error}=await supabase
      .from("menu_items")
      .select(`id,name,description,price,category_id,image_path,active,menu_categories (id,name),menu_item_allergens (allergens (id,name))`)
      .order("name");
    if(error)throw error;
    const raw=data as RawMenuItemResponse[];
    return raw.map(i=>({
      id:i.id,name:i.name,description:i.description,price:i.price,category_id:i.category_id,image_url:getImageUrl(i.image_path),image_path:i.image_path,active:i.active,
      category:i.menu_categories[0]||null,
      allergens:i.menu_item_allergens.flatMap(r=>r.allergens)
    }));
  };

  const{data:allergens=[],isLoading:allergensLoading,error:allergensError}=useQuery<Allergen[]>({queryKey:["allergens"],queryFn:fetchAllergens});
  const{data:categories=[],isLoading:categoriesLoading,error:categoriesError}=useQuery<Category[]>({queryKey:["categories"],queryFn:fetchCategories});
  const{data:items=[],isLoading:itemsLoading,error:itemsError}=useQuery<MenuItem[]>({queryKey:["items"],queryFn:fetchItems});

  const isLoading=allergensLoading||categoriesLoading||itemsLoading;
  const error=allergensError||categoriesError||itemsError;

  const filteredItems=useMemo(()=>{
    if(!items)return[];
    let f=items;
    const s=searchTerm.toLowerCase().trim();
    if(s)f=f.filter(i=>i.name.toLowerCase().includes(s)||i.description.toLowerCase().includes(s));
    if(selectedFilter!=="all"){
      const parsed=Number(selectedFilter);
      f=f.filter(i=>(i.category?.id===selectedFilter)||i.category_id===parsed);
    }
    return f;
  },[items,selectedFilter,searchTerm]);

  const handleCreateItem=async()=>{
    try{
      if(!newItem.name||!newItem.category_id||!newItem.price){toast({title:"Error",description:"Please fill in all required fields",variant:"destructive"});return;}
      const priceValue=parseFloat(newItem.price);
      if(isNaN(priceValue)||priceValue<0){toast({title:"Error",description:"Please enter a valid positive price.",variant:"destructive"});return;}
      const{data:insertedItem,error:itemError}=await supabase.from("menu_items").insert({
        name:newItem.name,description:newItem.description,price:priceValue,category_id:Number(newItem.category_id),active:newItem.active
      }).select().single();
      if(itemError)throw itemError;
      if(newItem.allergen_ids.length>0){
        const assign=newItem.allergen_ids.map(allergenId=>({menu_item_id:insertedItem.id,allergen_id:allergenId}));
        const{error:assignmentError}=await supabase.from("menu_item_allergens").insert(assign);
        if(assignmentError)throw assignmentError;
      }
      await queryClient.invalidateQueries({queryKey:["items"]});
      setIsDialogOpen(false);
      setNewItem({name:"",description:"",price:"",category_id:"",active:true,allergen_ids:[]});
      toast({title:"Success",description:"Menu item created successfully"});
    }catch(e){
      const msg=e instanceof Error?e.message:"Failed to create menu item";
      console.error(e);
      toast({title:"Error",description:msg,variant:"destructive"});
    }
  };

  const handleEdit=useCallback((item:MenuItem)=>{
    setEditForm({
      name:item.name,
      description:item.description,
      price:item.price.toString(),
      category_id:item.category_id.toString(),
      allergen_ids:item.allergens?.map(a=>a.id)||[],
    });
    setEditDialog({open:true,item});
  },[]);

  const handleSaveEdit=useCallback(async()=>{
    if(!editDialog.item)return;
    try{
      if(!editForm.name||!editForm.category_id||!editForm.price){toast({title:"Error",description:"Please fill in all required fields.",variant:"destructive"});return;}
      const priceValue=parseFloat(editForm.price);
      if(isNaN(priceValue)||priceValue<0){toast({title:"Error",description:"Please enter a valid positive price.",variant:"destructive"});return;}
      const categoryId=Number(editForm.category_id);
      if(isNaN(categoryId)){toast({title:"Error",description:"Please select a valid category.",variant:"destructive"});return;}
      const{error:itemError}=await supabase.from("menu_items").update({
        name:editForm.name,description:editForm.description,price:priceValue,category_id:categoryId
      }).eq("id",editDialog.item.id);
      if(itemError)throw itemError;
      const{error:deleteError}=await supabase.from("menu_item_allergens").delete().eq("menu_item_id",editDialog.item.id);
      if(deleteError)throw deleteError;
      if(editForm.allergen_ids.length>0){
        const assign=editForm.allergen_ids.map(allergenId=>({menu_item_id:editDialog.item!.id,allergen_id:allergenId}));
        const{error:assignmentError}=await supabase.from("menu_item_allergens").insert(assign);
        if(assignmentError)throw assignmentError;
      }
      await queryClient.invalidateQueries({queryKey:["items"]});
      toast({title:"Success",description:"Menu item updated successfully."});
      setEditDialog({open:false,item:null});
    }catch(e){
      const msg=e instanceof Error?e.message:"Failed to update menu item";
      console.error(e);
      toast({title:"Error",description:msg,variant:"destructive"});
    }
  },[editDialog.item,editForm,supabase,toast,queryClient]);

  if(isLoading)return<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"/></div>;
  if(error)return<div className="container p-6"><Alert variant="destructive"><AlertDescription>Failed to load data.</AlertDescription></Alert></div>;
  if(!items||items.length===0)return<div className="container p-6"><Alert><AlertDescription>No menu items found.</AlertDescription></Alert><div className="mt-4"><Button onClick={()=>setIsDialogOpen(true)}>Add Your First Item</Button></div></div>;

  return(
    <div className="container p-6">
      <PageHeader heading="Menu Items" text="Manage your restaurant's menu selection">
        <Button onClick={()=>setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4"/>
          Add Item
        </Button>
      </PageHeader>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-[300px]">
            <Input type="text" placeholder="Search menu items..." value={localSearchTerm} onChange={e=>setLocalSearchTerm(e.target.value)} className="w-full pl-10"/>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
          </div>
          <Select value={selectedFilter} onValueChange={value=>startSearchTransition(()=>{setSelectedFilter(value);})}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Category"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c=><SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 relative">
        {filteredItems.map(item=>(
          <div key={item.id} className="group relative flex flex-col bg-white border border-neutral-100 rounded-sm p-6 hover:shadow-sm transition-shadow">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button variant="secondary" size="sm" onClick={()=>handleEdit(item)} className="h-8 w-8 p-0" aria-label={`Edit ${item.name}`}>
                <Edit className="h-4 w-4"/>
              </Button>
            </div>

            <div className="relative w-full pb-[100%] mb-4">
              {item.image_url?(
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover rounded-sm"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                  onError={e=>{
                    const t=e.target as HTMLImageElement;
                    t.src=`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/placeholder.webp`;
                  }}
                />
              ):(
                <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center rounded-sm">
                  <span className="text-neutral-400">No image</span>
                </div>
              )}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
              {item.category?.name}
            </div>
            {item.name&&<h3 className="text-lg font-medium mb-2">{highlightText(item.name,searchTerm)}</h3>}
            {item.description&&<p className="text-sm text-neutral-600 mb-4">{highlightText(item.description,searchTerm)}</p>}
            <div className="flex flex-wrap gap-1 mb-4">
              {item.allergens?.map(a=><Badge key={a.id} variant="secondary" className="text-xs px-2 py-0.5 bg-neutral-100">{a.name}</Badge>)}
            </div>
            <div className="mt-auto font-medium text-lg">${item.price.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>Create a new menu item with details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})} placeholder="Menu item name"/></div>
            <div className="grid gap-2"><Label>Price</Label><Input type="number" step="0.01" value={newItem.price} onChange={e=>setNewItem({...newItem,price:e.target.value})} placeholder="0.00"/></div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={newItem.category_id} onValueChange={value=>setNewItem({...newItem,category_id:value})}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select category"/></SelectTrigger>
                <SelectContent>{categories.map(c=><SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Description</Label><Input value={newItem.description} onChange={e=>setNewItem({...newItem,description:e.target.value})} placeholder="Menu item description"/></div>
            <div className="grid gap-2">
              <Label>Allergens</Label>
              <MultiSelect options={allergens} selected={newItem.allergen_ids} onChange={ids=>setNewItem({...newItem,allergen_ids:ids})} placeholder="Select allergens"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateItem}>Create Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialog.open} onOpenChange={open=>!open&&setEditDialog({open:false,item:null})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>Update the details of the selected menu item.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} placeholder="Menu item name"/></div>
            <div className="grid gap-2"><Label>Description</Label><Input value={editForm.description} onChange={e=>setEditForm({...editForm,description:e.target.value})} placeholder="Menu item description"/></div>
            <div className="grid gap-2"><Label>Price</Label><Input type="number" step="0.01" value={editForm.price} onChange={e=>setEditForm({...editForm,price:e.target.value})} placeholder="0.00"/></div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={editForm.category_id} onValueChange={value=>setEditForm({...editForm,category_id:value})}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select category"/></SelectTrigger>
                <SelectContent>{categories.map(c=><SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Allergens</Label>
              <MultiSelect options={allergens} selected={editForm.allergen_ids} onChange={ids=>setEditForm({...editForm,allergen_ids:ids})} placeholder="Select allergens"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setEditDialog({open:false,item:null})}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

### app/dashboard/settings/pages.tsx

```typescript

```

### app/dashboard/users/page.tsx

```typescript

"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UsersTable, InviteUserDialog } from "@/components/features/users";
import type { User, Role } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [supabase, toast]);

  // Handle user status toggle
  const handleUserStatusChange = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId ? { ...user, active: isActive } : user
        )
      );

      toast({
        title: "Success",
        description: `User ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  // Handle user role change
  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  // Handle user invitation
  const handleInviteUser = async (email: string, role: Role) => {
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      if (existingUser) {
        toast({
          title: "Error",
          description: "This email is already registered",
          variant: "destructive",
        });
        return;
      }

      // Send invitation
      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        email,
        { data: { role } }
      );

      if (inviteError) throw inviteError;

      // Create user record
      const { error: createError } = await supabase
        .from('users')
        .insert([{
          email,
          role,
          active: false,
          name: email.split('@')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (createError) throw createError;

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });

      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage user access and permissions
          </p>
        </div>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="space-y-4">
        <UsersTable
          users={users}
          onStatusChange={handleUserStatusChange}
          onRoleChange={handleRoleChange}
        />

        <InviteUserDialog
          open={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          onInvite={handleInviteUser}
        />
      </div>
    </div>
  );
}
```

### app/dashboard/layout.tsx

```typescript
export const dynamic = 'force-dynamic';
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ImageIcon,
  MenuSquare,
  ClipboardList,
  Wine,
  BookOpen, // Added BookOpen icon
} from "lucide-react";
import type { Database } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Restaurant management dashboard",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch user profile data
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("role, name")
    .eq("id", session.user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    // Optionally, you can handle the error by redirecting or showing an error message
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="border-b px-6 py-4">
            <Link href="/dashboard" className="flex items-center text-lg font-semibold">
              Restaurant Dashboard
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {/* Dashboard Link */}
            <Link href="/dashboard">
              <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </div>
            </Link>

            {/* Menu Management Section */}
            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Menu Management
              </h2>
              <Link href="/dashboard/menu">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Menu Items
                </div>
              </Link>
              <Link href="/dashboard/menu/daily">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <MenuSquare className="mr-2 h-4 w-4" />
                  Daily Menu
                </div>
              </Link>
              <Link href="/dashboard/menu/wine">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <Wine className="mr-2 h-4 w-4" />
                  Wine List
                </div>
              </Link>
            </div>

            {/* Blog Section - Newly Added */}
            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Blog
              </h2>
              <Link href="/dashboard/blog">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Blog Posts
                </div>
              </Link>
            </div>

            {/* Assets Section */}
            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Assets
              </h2>
              <Link href="/dashboard/images">
                <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Images
                </div>
              </Link>
            </div>

            {/* Admin Section - Only visible for admin users */}
            {userProfile?.role === 'admin' && (
              <div className="pt-4">
                <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Admin
                </h2>
                <Link href="/dashboard/users">
                  <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </div>
                </Link>
                <Link href="/dashboard/settings">
                  <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </div>
                </Link>
              </div>
            )}
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{userProfile?.name || session.user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{userProfile?.role || 'user'}</p>
              </div>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-full p-2 hover:bg-accent hover:text-accent-foreground"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 w-full">
        <div className="h-full min-h-screen bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}

```

### app/dashboard/page.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/components/core/layout";
import { PageHeader } from "@/components/core/layout";
import {
  ClipboardList,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

type DashboardStats = {
  total_menu_items: number;
  total_users: number;
  daily_menus_active: number;
  total_wine_items: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_menu_items: 0,
    total_users: 0,
    daily_menus_active: 0,
    total_wine_items: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Fetch menu items count
        const { count: menuCount } = await supabase
          .from('menu_items')
          .select('*', { count: 'exact', head: true });

        // Fetch users count
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Fetch active daily menus
        const { count: activeMenusCount } = await supabase
          .from('daily_menus')
          .select('*', { count: 'exact', head: true })
          .eq('active', true);

        // Fetch wine items count
        const { count: wineCount } = await supabase
          .from('wines')
          .select('*', { count: 'exact', head: true });

        setStats({
          total_menu_items: menuCount || 0,
          total_users: usersCount || 0,
          daily_menus_active: activeMenusCount || 0,
          total_wine_items: wineCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  return (
    <div className="p-6">
      <PageHeader
        heading="Dashboard Overview"
        text="Welcome to your restaurant management dashboard"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Menu Items</p>
              <h3 className="text-2xl font-bold">
                {isLoading ? "..." : stats.total_menu_items}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Menus</p>
              <h3 className="text-2xl font-bold">
                {isLoading ? "..." : stats.daily_menus_active}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wine Selection</p>
              <h3 className="text-2xl font-bold">
                {isLoading ? "..." : stats.total_wine_items}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">
                {isLoading ? "..." : stats.total_users}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Additional dashboard widgets can be added here */}
      </div>
    </div>
  );
}
```

### app/global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
 
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
 
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
 
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
 
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
 
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
 
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
 
    --ring: 240 5% 64.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
 
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
 
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
 
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
 
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
 
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
 
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
 
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
 
    --ring: 240 3.7% 15.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Custom scrollbar */
@layer utilities {
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    @apply bg-muted;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/30 rounded-full;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/50;
  }
}

/* Custom animations */
@layer utilities {
  .animate-in {
    animation: animateIn 0.3s ease-in-out;
  }
  
  .animate-out {
    animation: animateOut 0.3s ease-in-out;
  }
  
  @keyframes animateIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes animateOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(10px);
    }
  }
}
```

### app/layout.tsx

```typescript
import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import { cookies } from "next/headers";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Toaster } from "@/components/ui/toaster";
import "./global.css";
import { Providers } from "./providers"; // <-- Import the Providers here

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

const APP_NAME = "Restaurant Manager";
const APP_DESCRIPTION = "A modern restaurant management platform";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Initialize the Supabase client
  const supabase = createServerComponentClient({ cookies });

  try {
    // Check if we have a session
    await supabase.auth.getSession();
  } catch (error) {
    console.error('Error fetching session:', error);
  }

  return (
    <html 
      lang="en" 
      className={`${lato.variable} antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-screen bg-background font-sans">
        <Providers>
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

```

### app/page.tsx

```typescript
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  try {
    // Check auth status
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Redirect based on auth status
    if (!session) {
      redirect("/login");
    } else {
      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('role, active')
        .eq('id', session.user.id)
        .single();

      // Check if user is active
      if (profile && !profile.active) {
        // Sign out inactive users
        await supabase.auth.signOut();
        redirect("/login?error=Account%20is%20inactive");
      }

      // Redirect to dashboard for active users
      redirect("/dashboard");
    }
  } catch (error) {
    console.error('Error in root page:', error);
    redirect("/login?error=Something%20went%20wrong");
  }

  // This return is technically unreachable but satisfies TypeScript
  return null;
}
```

### app/providers.tsx

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

```

### src/components/core/forms.tsx

```typescript
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Context and Provider
const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

// Form Field
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

// Hook for accessing form field context
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// Form Item Context
type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

// Form Item Component
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

// Form Label Component
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

// Form Control Component
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

// Form Description Component
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

// Form Message Component
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
```

### src/components/core/layout.tsx

```typescript
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// PageContainer Component
export function PageContainer({ 
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// PageHeader Component
interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  heading,
  text,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between pb-4 md:pb-6",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {heading}
        </h1>
        {text && (
          <p className="text-muted-foreground">
            {text}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

// Section Component
interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function Section({
  title,
  description,
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <div
      className={cn("grid gap-6", className)}
      {...props}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// Separator Component
interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  );
}

// Grid Component
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: number;
}

export function Grid({
  columns = 1,
  gap = 6,
  className,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        `grid-cols-${columns}`,
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Components
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
```

### src/components/core/ui.tsx

```typescript
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Button Component
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

// Input Component
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

// Badge Component
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 shadow hover:bg-green-100/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Loading Component
type LoadingSpinnerProps = React.HTMLAttributes<HTMLDivElement>;

export function LoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex h-[100px] w-full items-center justify-center",
        className
      )}
      {...props}
    >
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

// Empty State Component
type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      {icon && <div className="mx-auto mb-4 h-12 w-12 text-muted-foreground">{icon}</div>}
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Textarea Component
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

// Label Component
export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

// Alert Component
type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "destructive";
};

export function Alert({
  className,
  variant = "default",
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        variant === "default" && "bg-background text-foreground",
        variant === "destructive" &&
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        className
      )}
      {...props}
    />
  );
}

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export {
  buttonVariants,
  badgeVariants,
};
```

### src/components/features/images.tsx

```typescript
"use client";

import { useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageUploadProps {
  category: string;
  onUploadComplete: (url: string) => void;
}

export function ImageUpload({ category, onUploadComplete }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleUpload = useCallback(async (file: File) => {
    try {
      setIsUploading(true);

      // Generate file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${category}-${Date.now()}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });

      onUploadComplete(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setPreview(null);
    }
  }, [category, onUploadComplete, supabase.storage, toast]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    handleUpload(file);
  }, [handleUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 transition-colors
          ${isDragActive ? 'border-primary' : 'border-muted-foreground/25'}
          ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          {preview ? (
            <div className="relative w-40 h-40">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
          )}
          {isUploading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium mb-1">
                Drag & drop or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 2MB
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface ImageGalleryProps {
  images: string[];
  onSelect?: (url: string) => void;
  onDelete?: (url: string) => void;
}

export function ImageGallery({ images, onSelect, onDelete }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = useCallback((url: string) => {
    setSelectedImage(url);
    onSelect?.(url);
  }, [onSelect]);

  const handleDelete = useCallback(async (url: string) => {
    if (!onDelete) return;
    
    try {
      // Extract file path from URL
      const path = url.split('/').pop();
      if (!path) throw new Error('Invalid file path');

      onDelete(url);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }, [onDelete]);

  if (!images.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No images found
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((url) => (
          <div
            key={url}
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
          >
            <Image
              src={url}
              alt="Gallery image"
              fill
              className="object-cover transition-all group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleImageClick(url)}
              >
                Select
              </Button>
              {onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative aspect-video">
              <Image
                src={selectedImage}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### src/components/features/menu.tsx

```typescript
"use client";

import { useState } from "react";
import { Edit2, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: number;
  category: string;
  image_url: string | null;
  allergens: string[];
  active: boolean;
};

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

interface MenuListProps {
  items: MenuItem[];
  isLoading: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

interface MenuSearchProps {
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
  categories: string[];
}

// Components
export function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-sm border">
      {item.image_url && (
        <div className="relative aspect-[4/3] bg-muted">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <Badge variant={item.active ? "success" : "secondary"}>
            {item.active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="mt-4">
          <div className="text-lg font-semibold">€{item.price.toFixed(2)}</div>
          {item.allergens.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.allergens.map((allergen) => (
                <Badge key={allergen} variant="outline" className="text-xs">
                  {allergen}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {item.name}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(item.id);
                setIsDeleteDialogOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function MenuList({ items, isLoading, onEdit, onDelete }: MenuListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No items found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export function MenuSearch({ onSearch, onFilter, categories }: MenuSearchProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search menu items..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Select onValueChange={onFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

### src/components/features/users.tsx

```typescript
"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, UserPlus, UserX, UserCheck, Mail, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User, Role } from "@/types";

// Types
interface UsersTableProps {
  users: User[];
  onStatusChange: (userId: string, isActive: boolean) => Promise<void>;
  onRoleChange: (userId: string, role: Role) => Promise<void>;
}

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: Role) => Promise<void>;
}

// Components
export function UsersTable({ users, onStatusChange, onRoleChange }: UsersTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusToggle = async (user: User) => {
    try {
      setLoadingId(user.id);
      await onStatusChange(user.id, !user.active);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user.email}
              </div>
            </TableCell>
            <TableCell>
              <Select
                defaultValue={user.role}
                onValueChange={(value) => onRoleChange(user.id, value as Role)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Badge
                variant={user.active ? "success" : "secondary"}
                className="cursor-pointer"
                onClick={() => handleStatusToggle(user)}
              >
                {user.active ? (
                  <UserCheck className="mr-1 h-3 w-3" />
                ) : (
                  <UserX className="mr-1 h-3 w-3" />
                )}
                {user.active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {loadingId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleStatusToggle(user)}
                    disabled={loadingId === user.id}
                  >
                    {user.active ? (
                      <>
                        <UserX className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function InviteUserDialog({ open, onOpenChange, onInvite }: InviteUserDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onInvite(email, role);
      setEmail("");
      setRole("user");
      onOpenChange(false);
    } catch {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new user.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as Role)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### src/components/ui/alert-dialog.tsx

```typescript
"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
```

### src/components/ui/alert.tsx

```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

```

### src/components/ui/badge.tsx

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 shadow hover:bg-green-100/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

### src/components/ui/button.tsx

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

### src/components/ui/calendar.tsx

```typescript
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
```

### src/components/ui/command.tsx

```typescript
import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}

```

### src/components/ui/dialog.tsx

```typescript
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

```

### src/components/ui/dropdown-menu.tsx

```typescript
"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
```

### src/components/ui/form.tsx

```typescript
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}

```

### src/components/ui/input.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

```

### src/components/ui/label.tsx

```typescript
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

```

### src/components/ui/multi-select.tsx

```typescript
"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Option {
  id: string
  name: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selectedIds: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select items...",
  disabled = false
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    return options.filter(option =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  // Handle option selection
  const toggleOption = (optionId: string) => {
    const isSelected = selected.includes(optionId)
    const newSelected = isSelected
      ? selected.filter(id => id !== optionId)
      : [...selected, optionId]
    onChange(newSelected)
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="truncate">
              {selected.length === 0
                ? placeholder
                : `${selected.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="p-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="max-h-[200px] overflow-auto p-2">
            {filteredOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">No options found</p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option.id)
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center gap-2 p-2 cursor-pointer rounded-sm hover:bg-accent",
                      isSelected && "bg-accent"
                    )}
                    onClick={() => toggleOption(option.id)}
                  >
                    <div className={cn(
                      "w-4 h-4 border rounded-sm flex items-center justify-center",
                      isSelected && "bg-primary border-primary"
                    )}>
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    {option.name}
                  </div>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected Items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.map((selectedId) => {
            const selectedOption = options.find((opt) => opt.id === selectedId)
            if (!selectedOption) return null
            return (
              <Badge
                key={selectedId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {selectedOption.name}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none hover:bg-secondary"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleOption(selectedId)
                  }}
                  disabled={disabled}
                >
                  ×
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

### src/components/ui/popover.tsx

```typescript
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }

```

### src/components/ui/select.tsx

```typescript
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

```

### src/components/ui/switch.tsx

```typescript
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

```

### src/components/ui/table.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

```

### src/components/ui/textarea.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

```

### src/components/ui/toast.tsx

```typescript
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

```

### src/components/ui/toaster.tsx

```typescript
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

```

### src/hooks/use-toast.ts

```typescript
import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Define action type literals directly in a type
type ActionType = {
  ADD_TOAST: "ADD_TOAST"
  UPDATE_TOAST: "UPDATE_TOAST"
  DISMISS_TOAST: "DISMISS_TOAST"
  REMOVE_TOAST: "REMOVE_TOAST"
}

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

### src/lib/supabase.ts

```typescript
// src/lib/supabase.ts
import { createClientComponentClient, createServerComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Database } from "@/types";
import type {  RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Client Component Client (for client-side)
export const createClient = () => {
  return createClientComponentClient<Database>();
};

// Cached Server Component Client (for server components)
export const createServerClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});

// Server Action Client (for use in Server Actions)
export const createActionClient = () => {
  const cookieStore = cookies();
  return createServerActionClient<Database>({ cookies: () => cookieStore });
};

// Authentication Helper Functions
export const getSession = async () => {
  const supabase = createServerClient();
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getUserProfile = async () => {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// Database Helper Functions
export const getMenuItems = async () => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        category:categories(id, name),
        menu_item_allergens!inner(
          allergen:allergens(*)
        )
      `)
      .order("name");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const getCategories = async () => {
  const supabase = createServerClient();
  try {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// Storage Helper Functions
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const supabase = createClient();
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteFile = async (
  bucket: string,
  path: string
) => {
  const supabase = createClient();
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Types for Realtime Subscriptions
type TableName = Database['public']['Tables'][keyof Database['public']['Tables']];
type RealtimePayload<T extends TableName> = RealtimePostgresChangesPayload<T['Row']>;

// Realtime Subscription Helper Functions
export const subscribeToChanges = <T extends TableName>(
  table: string,
  callback: (payload: RealtimePayload<T>) => void
): (() => void) => {
  const supabase = createClient();
  
  const subscription = supabase
    .channel('db_changes')
    .on<T['Row']>(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table
      },
      (payload) => callback(payload as RealtimePayload<T>)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

// Error Types
export interface SupabaseErrorDetails {
  message: string;
  code: string;
  details?: string;
}

// Error Handling Helper
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details: string
  ) {
    super(message);
    this.name = "SupabaseError";
  }
}

export const handleError = (error: unknown) => {
  console.error("Supabase Error:", error);
  
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error &&
    typeof error.message === 'string' &&
    typeof error.code === 'string'
  ) {
    throw new SupabaseError(
      error.message,
      error.code,
      'details' in error && typeof error.details === 'string' ? error.details : ""
    );
  }
  
  throw new Error("An unexpected error occurred");
};
```

### src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Classname utility
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date, formatString: string = "PP"): string {
  return format(new Date(date), formatString, { locale: es });
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const timestamp = new Date(date).getTime();
  const seconds = Math.floor((now - timestamp) / 1000);

  // Less than a minute
  if (seconds < 60) {
    return "just now";
  }

  // Less than an hour
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  // Less than a day
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  // For older dates, use date-fns format
  return format(new Date(date), "PP", { locale: es });
}

// Debounce function with proper typing
type AnyFunction = (...args: unknown[]) => unknown;

export function debounce<T extends AnyFunction>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// File size formatter
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Slug generator
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// URL validator
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Email validator
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Random ID generator
export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => 
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

// Deep clone utility
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

// Object comparison with proper typing
export function isEqual<T extends Record<string, unknown>>(obj1: T, obj2: T): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Array shuffle utility
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Truncate text
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Parse boolean with proper typing
export function parseBoolean(value: string | number | boolean | null | undefined): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
}

// Check if object is empty
export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

// Remove undefined values from object
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
}

// Type guard for checking if value is Record type
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Type guard for checking if value is array
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}
```

### src/types/index.ts

```typescript
import type { ReactNode } from 'react';

// Core Database Types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'user';
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string;
          role?: 'admin' | 'user';
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'user';
          active?: boolean;
          updated_at?: string;
        };
      };

      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category_id: number;
          image_url: string | null;
          image_path: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          category_id: number;
          image_url?: string | null;
          image_path?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          category_id?: number;
          image_url?: string | null;
          image_path?: string | null;
          active?: boolean;
          updated_at?: string;
        };
      };

      menu_item_allergens: {
        Row: {
          menu_item_id: string;
          allergen_id: string;
          created_at: string;
        };
        Insert: {
          menu_item_id: string;
          allergen_id: string;
          created_at?: string;
        };
        Update: {
          menu_item_id?: string;
          allergen_id?: string;
        };
      };

      allergens: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          updated_at?: string;
        };
      };

      menu_categories: {
        Row: {
          id: string;
          name: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          display_order?: number;
          updated_at?: string;
        };
      };

      // ===== Added daily_menus and daily_menu_items Tables =====
      daily_menus: {
  Row: {
    id: string;
    date: string;
    repeat_pattern: "none" | "weekly" | "monthly";
    active: boolean;
    scheduled_for: string;
    created_at: string;
    daily_menu_items?: {
      id: string;
      course_name: string;
      course_type: "first" | "second";
      display_order: number;
      daily_menu_id: string;
    }[];
  };
  Insert: {
    date: string;
    repeat_pattern?: "none" | "weekly" | "monthly";
    active?: boolean;
    scheduled_for: string;
    created_at?: string;
  };
  Update: {
    date?: string;
    repeat_pattern?: "none" | "weekly" | "monthly";
    active?: boolean;
    scheduled_for?: string;
  };
};

      daily_menu_items: {
        Row: {
          id: string;
          course_name: string;
          course_type: "first" | "second";
          display_order: number;
          daily_menu_id: string;
        };
        Insert: {
          course_name: string;
          course_type: "first" | "second";
          display_order: number;
          daily_menu_id: string;
        };
        Update: {
          course_name?: string;
          course_type?: "first" | "second";
          display_order?: number;
          daily_menu_id?: string;
        };
      };

      // ===== New Tables for Wines =====
      wines: {
        Row: {
          id: number;
          name: string;
          description: string;
          bottle_price: number;
          glass_price: number | null;
          active: boolean;
          created_at: string;
          image_path: string | null;
          image_url: string | null;
        };
        Insert: {
          name: string;
          description?: string;
          bottle_price: number;
          glass_price?: number | null;
          active?: boolean;
          created_at?: string;
          image_path?: string | null;
          image_url?: string | null;
        };
        Update: {
          name?: string;
          description?: string;
          bottle_price?: number;
          glass_price?: number | null;
          active?: boolean;
          image_path?: string | null;
          image_url?: string | null;
        };
      };

      wine_categories: {
        Row: {
          id: number;
          name: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          name: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          display_order?: number;
        };
      };

      wine_category_assignments: {
        Row: {
          wine_id: number;
          category_id: number;
        };
        Insert: {
          wine_id: number;
          category_id: number;
        };
        Update: {
          wine_id?: number;
          category_id?: number;
        };
      };
      // ===== End of New Tables =====
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_user: {
        Args: { email: string };
        Returns: Array<{
          id: string;
          email: string;
          role: 'admin' | 'user';
          active: boolean;
        }>;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Component & Form Types
export type CommonProps = {
  className?: string;
  children?: ReactNode;
};

// User Related Types
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type UserRole = 'admin' | 'user';

export type UserFormData = {
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
};

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type Session = {
  user: AuthUser;
  accessToken: string;
};

// Menu Related Types
export type MenuItem = Database['public']['Tables']['menu_items']['Row'] & {
  menu_categories?: {
    id: string;
    name: string;
    display_order: number;
  };
  menu_item_allergens?: Array<{
    allergens: {
      id: string;
      name: string;
    };
  }>;
};

export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];

export type MenuAllergen = Database['public']['Tables']['allergens']['Row'];
export type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];

export type MenuItemAllergen = Database['public']['Tables']['menu_item_allergens']['Row'];

export type MenuItemFormData = {
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url?: string | null;
  image_path?: string | null;
  allergen_ids: string[];
  active?: boolean;
};

export type MenuItemEditFormData = Omit<MenuItemFormData, 'active'>;

// **Added Relation Types**
export type MenuItemWithRelations = MenuItem & {
  category: MenuCategory | null;
  allergens: MenuAllergen[];
};

export type MenuItemResponse = Database['public']['Tables']['menu_items']['Row'] & {
  menu_categories: Pick<MenuCategory, 'id' | 'name'>;
  menu_item_allergens: Array<{
    allergens: Pick<MenuAllergen, 'id' | 'name'>;
  }>;
};

// Form State Types
export type FormState = {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};

export type DialogState<T = unknown> = {
  isOpen: boolean;
  type: 'create' | 'edit' | 'delete' | null;
  data: T | null;
};

// Component Specific Types
export type TableColumn<T> = {
  title: string;
  field: keyof T;
  render?: (value: T[keyof T], item: T) => ReactNode;
};

export type ImageUploadState = {
  file: File | null;
  preview: string | null;
  error: string | null;
  isUploading: boolean;
};

// API Response Types
export type ApiSuccessResponse<T> = {
  data: T;
  error: null;
  status: 200 | 201 | 204;
  count?: number;
};

export type ApiErrorResponse = {
  data: null;
  error: {
    message: string;
    code?: string;
    details?: unknown;
    hint?: string;
    status?: number;
  };
  status: 400 | 401 | 403 | 404 | 500;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination Types
export type PaginationParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
};

export type PaginatedResponse<T> = ApiSuccessResponse<PaginatedData<T>> & {
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

// Filter Types
export type FilterParams = {
  search?: string;
  category?: string;
  status?: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
};

export type RequestParams = PaginationParams & FilterParams;

// Supabase Response Types
export type SupabaseResponse<T> = {
  data: T | null;
  error: {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
  } | null;
  count?: number | null;
  status: number;
  statusText: string;
};

// Error Types
export type ErrorResponse = {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, unknown>;
};

// File & Image Types
export type FileUpload = {
  file: File;
  path: string;
  category: string;
};

export type ImageMetadata = {
  width: number;
  height: number;
  format: string;
  size: number;
  url: string;
};

export type ImageUploadResponse = {
  url: string;
  path: string;
  metadata: ImageMetadata;
};

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

// Object Key Types
export type ObjectKeys<T> = keyof T;
export type ObjectValues<T> = T[keyof T];

// Function Types
export type AsyncFunction<T = void> = () => Promise<T>;
export type AsyncFunctionWithParam<P, T = void> = (param: P) => Promise<T>;
export type VoidFunction = () => void;
export type ErrorHandler = (error: unknown) => void;

// Event Types
export type EventHandler<T = void> = (event: Event) => T;
export type ChangeHandler<T = string> = (value: T) => void;
export type SubmitHandler<T> = (data: T) => void | Promise<void>;

// Realtime Types
export type RealtimeSubscription = {
  unsubscribe: () => void;
};

export type RealtimeMessage<T> = {
  event: string;
  payload: T;
};

export type RealtimeChannel<T = unknown> = {
  subscribe: (callback: (payload: T) => void) => RealtimeSubscription;
  unsubscribe: () => void;
};

// Type Guards
export function isApiSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.error === null;
}

export function isApiErrorResponse(
  response: ApiResponse<unknown>
): response is ApiErrorResponse {
  return response.error !== null;
}

export function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'role' in value
  );
}

export function isMenuItem(value: unknown): value is MenuItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'price' in value &&
    'category_id' in value
  );
}

export function isValidImage(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type) && file.size <= MAX_FILE_SIZE;
}

// Constants
export const ROLES = ['admin', 'user'] as const;
export type Role = typeof ROLES[number];

export const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp'] as const;
export type ImageFormat = typeof IMAGE_FORMATS[number];

export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = typeof SORT_ORDERS[number];

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
export type HttpMethod = typeof HTTP_METHODS[number];

export const MENU_CATEGORIES = [
  'appetizers',
  'main-courses',
  'desserts',
  'beverages',
  'specials'
] as const;
export type MenuCategoryType = typeof MENU_CATEGORIES[number];

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_IMAGE_DIMENSION = 2048; // pixels
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;

// Validation Types
export type ValidationError = {
  path: string[];
  message: string;
  type?: string;
  value?: unknown;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

export type FormValidation = {
  [key: string]: boolean | string | undefined;
  isValid: boolean;
  message?: string;
};

export type ValidationRule = {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: number | string | RegExp;
  message: string;
  validator?: (value: unknown) => boolean;
};

export type ValidationSchema = {
  [key: string]: ValidationRule[];
};

// Form Control Types
export type FormControl = {
  value: unknown;
  error: string | null;
  touched: boolean;
  dirty: boolean;
};

export type FormControls = {
  [key: string]: FormControl;
};

// Status Types
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type StatusCode = typeof STATUS_CODES[keyof typeof STATUS_CODES];

export class ValidationException extends Error {
  constructor(message: string, public errors: ValidationError[]) {
    super(message);
    this.name = 'ValidationException';
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Utility Functions
export function createFormControl(initialValue: unknown = ''): FormControl {
  return {
    value: initialValue,
    error: null,
    touched: false,
    dirty: false,
  };
}

export function isFormValid(controls: FormControls): boolean {
  return Object.values(controls).every(
    control => !control.error && control.touched
  );
}

```

