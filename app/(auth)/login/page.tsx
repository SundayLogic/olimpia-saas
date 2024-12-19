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