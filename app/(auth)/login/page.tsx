"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z.object({
  email: z.string().nonempty("Email is required").email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Values = z.infer<typeof schema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues:{ email:"",password:""} });

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{ if(session) router.replace("/dashboard"); });
  },[router,supabase.auth]);

  useEffect(()=>{
    const e = searchParams.get("error");
    if(e) setError(decodeURIComponent(e));
  },[searchParams]);

  const onSubmit = async (data:Values) => {
    try {
      setIsLoading(true); setError(null);
      const { data:res, error:err } = await supabase.auth.signInWithPassword(data);
      if(err) throw err;
      if(!res?.session) throw new Error("No session created");
      await supabase.auth.getSession();
      toast({ title:"Success", description:"You have successfully logged in." });
      const redirectTo = searchParams.get("redirectTo")||"/dashboard";
      router.refresh(); router.replace(redirectTo);
    } catch(e) {
      const msg = e instanceof Error ? e.message : "Failed to login";
      console.error("Login error:", e);
      setError(msg);
      toast({ title:"Error", description:msg, variant:"destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative h-screen grid flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 h-6 w-6">
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Restaurant Manager
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">&ldquo;This platform has transformed our operations.&rdquo;</p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to sign in</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="name@example.com" type="email" disabled={isLoading} {...field}/></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="password" render={({ field })=>(
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input placeholder="Enter your password" type="password" disabled={isLoading} {...field}/></FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading?(<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Signing in...</>):"Sign In"}
              </Button>
            </form>
          </Form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t"/></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                Don&apos;t have an account? Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
