"use client";

import { useState, useEffect } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string | null;
  content: {
    type: string;
    content: Array<{
      type: string;
      content?: Array<{
        type: string;
        text?: string;
      }>;
    }>;
  } | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  author_id: string;
  author_info?: Array<{
    name: string | null;
    email: string;
  }>;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);

  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();

  const getContentPreview = (content: BlogPost['content']): string => {
    if (!content?.content) return "";
    
    const textContent = content.content
      .map(block => 
        block.content
          ?.map(item => item.text)
          .filter(Boolean)
          .join(' ')
      )
      .filter(Boolean)
      .join(' ');
    
    return textContent.length > 150 
      ? `${textContent.substring(0, 150)}...`
      : textContent;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // First fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            slug,
            published,
            created_at,
            updated_at,
            content,
            featured_image_url,
            featured_image_alt,
            author_id
          `)
          .order('created_at', { ascending: false });

        if (postsError) {
          console.error('Posts fetch error:', postsError);
          toast({
            title: "Error",
            description: "Failed to load blog posts",
            variant: "destructive",
          });
          return;
        }

        if (!postsData) {
          setPosts([]);
          return;
        }

        // Then fetch authors
        const authorIds = postsData.map(post => post.author_id).filter(Boolean);
        if (authorIds.length > 0) {
          const { data: authorsData, error: authorsError } = await supabase
            .from('users')
            .select('id, name, email')
            .in('id', authorIds);

          if (authorsError) {
            console.error('Authors fetch error:', authorsError);
          }

          // Combine posts with author info
          const postsWithAuthors = postsData.map(post => ({
            ...post,
            author_info: authorsData?.filter(author => author.id === post.author_id) || []
          }));

          setPosts(postsWithAuthors);
        } else {
          setPosts(postsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "An error occurred while loading posts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [supabase, toast]);

  const handleDeletePost = async () => {
    if (!deletePost) return;

    try {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', deletePost.id);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      setPosts((current) => 
        current.filter((post) => post.id !== deletePost.id)
      );
      setDeletePost(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <PageHeader
        heading="Blog Posts"
        text="Create and manage your blog content"
      >
        <Button onClick={() => router.push('/dashboard/blog/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </PageHeader>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery 
              ? "No posts found matching your search." 
              : "No blog posts found. Create your first post!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="group relative flex gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow"
            >
              {post.featured_image_url && (
                <div className="relative h-32 w-32 rounded-md overflow-hidden bg-muted shrink-0">
                  <Image
                    src={post.featured_image_url}
                    alt={post.featured_image_alt || post.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium truncate">{post.title}</h3>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </div>
                  {post.author_info?.[0] && (
                    <>
                      <span>•</span>
                      <span>By {post.author_info[0].name || post.author_info[0].email}</span>
                    </>
                  )}
                  {post.updated_at && post.updated_at !== post.created_at && (
                    <>
                      <span>•</span>
                      <span>Updated {format(new Date(post.updated_at), "MMM d, yyyy")}</span>
                    </>
                  )}
                </div>

                {post.content && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {getContentPreview(post.content)}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-4">
                  {post.published && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/blog/${post.slug}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/blog/${post.id}`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    onClick={() => setDeletePost(post)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletePost?.title}&quot;? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
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