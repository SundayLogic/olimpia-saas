"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Loader2 } from "lucide-react";
import slugify from "slugify";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/core/layout";

const blogFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.any(), // We'll validate this separately
  featured_image: z.string().optional(),
  featured_image_alt: z.string().optional(),
  published: z.boolean().default(false),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [initialContent, setInitialContent] = useState("");

  const isNewPost = params.id === "new";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: initialContent,
  });

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      featured_image: "",
      featured_image_alt: "",
      published: false,
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (isNewPost) return;

      try {
        setIsLoading(true);
        const { data: post, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        if (post) {
          form.reset({
            title: post.title,
            content: post.content,
            featured_image: post.featured_image || "",
            featured_image_alt: post.featured_image_alt || "",
            published: post.published,
          });
          setInitialContent(post.content);
          editor?.commands.setContent(post.content);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to load blog post",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [isNewPost, params.id, supabase, form, editor, toast]);

  const onSubmit = async (values: BlogFormValues) => {
    try {
      setIsLoading(true);
      const content = editor?.getJSON();
      
      const postData = {
        title: values.title,
        slug: slugify(values.title, { lower: true, strict: true }),
        content,
        featured_image: values.featured_image,
        featured_image_alt: values.featured_image_alt,
        published: values.published,
      };

      if (isNewPost) {
        const { error: createError } = await supabase
          .from("blog_posts")
          .insert([postData])
          .select()
          .single();

        if (createError) throw createError;

        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      } else {
        const { error: updateError } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", params.id);

        if (updateError) throw updateError;

        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      }

      router.push("/dashboard/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isNewPost) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        heading={isNewPost ? "Create New Post" : "Edit Post"}
        text={isNewPost ? "Create a new blog post" : "Edit an existing blog post"}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Post title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TipTap Editor will go here */}
          <div className="min-h-[500px] border rounded-md p-4">
            {editor && <div>{/* TipTap Editor UI Components */}</div>}
          </div>

          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Publish post</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/blog")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNewPost ? "Create Post" : "Update Post"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}