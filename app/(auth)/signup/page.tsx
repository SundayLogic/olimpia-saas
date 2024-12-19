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