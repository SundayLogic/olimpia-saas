"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/core/layout";
import { useRouter } from "next/navigation";

type BlogPost = {
 id: string;
 title: string;
 slug: string;
 published: boolean;
 created_at: string;
 author_id: string;
};

export default function BlogPage() {
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const supabase = createClientComponentClient();
 const { toast } = useToast();
 const router = useRouter();

 useEffect(() => {
   const fetchPosts = async () => {
     try {
       setIsLoading(true);
       const { data, error: supabaseError } = await supabase
         .from('blog_posts')
         .select('*')
         .order('created_at', { ascending: false });

       if (supabaseError) {
         toast({
           title: "Error",
           description: "Failed to load blog posts",
           variant: "destructive",
         });
         console.error('Supabase error:', supabaseError);
         return;
       }

       setPosts(data || []);
     } finally {
       setIsLoading(false);
     }
   };

   fetchPosts();
 }, [supabase, toast]);

 const handleNewPost = () => {
   router.push('/dashboard/blog/new');
 };

 return (
   <div className="p-6">
     <PageHeader
       heading="Blog Posts"
       text="Create and manage your blog content"
     >
       <Button onClick={handleNewPost}>
         <Plus className="mr-2 h-4 w-4" />
         New Post
       </Button>
     </PageHeader>

     {isLoading ? (
       <div className="flex justify-center items-center h-64">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
       </div>
     ) : posts.length === 0 ? (
       <div className="text-center py-12">
         <p className="text-muted-foreground">No blog posts found. Create your first post!</p>
       </div>
     ) : (
       <div className="grid gap-6">
         {posts.map((post) => (
           <div key={post.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
             <div>
               <h3 className="font-medium">{post.title}</h3>
               <p className="text-sm text-muted-foreground">
                 Created {new Date(post.created_at).toLocaleDateString()}
               </p>
             </div>
             <Button variant="outline" onClick={() => router.push(`/dashboard/blog/${post.id}`)}>
               Edit
             </Button>
           </div>
         ))}
       </div>
     )}
   </div>
 );
}