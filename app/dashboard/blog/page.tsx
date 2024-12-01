"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/core/layout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  author_id: string;
  author_info?: {  // Made optional and renamed to avoid conflict
    name: string | null;
    email: string;
  };
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            slug,
            published,
            created_at,
            author_id,
            author_info:users(name, email)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match our type
        const transformedData: BlogPost[] = (data || []).map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          published: post.published,
          created_at: post.created_at,
          author_id: post.author_id,
          author_info: post.author_info?.[0] || undefined
        }));

        setPosts(transformedData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error",
          description: "Failed to load blog posts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [supabase, toast]);

  return (
    <div className="p-6">
      <PageHeader
        heading="Blog Posts"
        text="Create and manage your blog content"
      >
        <Button onClick={() => window.location.href = '/dashboard/blog/new'}>
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
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-card border rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{post.title}</h3>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {`Created ${formatDate(post.created_at)} by ${
                    post.author_info?.name || post.author_info?.email || 'Unknown'
                  }`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/dashboard/blog/${post.id}`}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/blog/${post.slug}`}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}