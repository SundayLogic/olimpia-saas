"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
  content: z.any(),
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

  const isNewPost = params.id === "new";

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: {
        type: "doc",
        content: [{ type: "paragraph" }],
      },
      featured_image: "",
      featured_image_alt: "",
      published: false,
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      console.log("Editor Update:", json);
      form.setValue("content", json);
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (isNewPost) return;

      try {
        setIsLoading(true);
        const { data: post, error: supabaseError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", params.id)
          .single();

        if (supabaseError) {
          toast({
            title: "Error",
            description: "Failed to load blog post",
            variant: "destructive",
          });
          console.error("Error fetching post:", supabaseError);
          return;
        }

        if (post && editor) {
          console.log("Post Content:", post.content);
          form.reset({
            ...post,
            content: post.content,
          });
          editor.commands.setContent(
            post.content || {
              type: "doc",
              content: [{ type: "paragraph" }],
            }
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [isNewPost, params.id, supabase, form, editor, toast]);

  const onSubmit = async (values: BlogFormValues) => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!editor) return;

      const editorContent = editor.getJSON();
      console.log("Saving content:", editorContent);

      const postData = {
        title: values.title,
        slug: slugify(values.title, { lower: true, strict: true }),
        content: {
          type: "doc",
          content: editorContent.content,
        },
        featured_image: values.featured_image,
        featured_image_alt: values.featured_image_alt,
        published: values.published,
        author_id: user?.id,
        updated_at: new Date().toISOString(),
      };

      if (isNewPost) {
        const { error: createError } = await supabase
          .from("blog_posts")
          .insert([{ ...postData, created_at: new Date().toISOString() }])
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

  return (
    <div className="p-6">
      <PageHeader
        heading={isNewPost ? "Create New Post" : "Edit Post"}
        text={
          isNewPost ? "Create a new blog post" : "Edit an existing blog post"
        }
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

          <div className="prose prose-sm w-full max-w-none">
            <FormField
              control={form.control}
              name="content"
              render={() => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div className="bg-background rounded-md shadow-sm ring-1 ring-inset ring-input">
                      <div className="border-b p-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={() =>
                            editor?.chain().focus().toggleBold().run()
                          }
                          className={
                            editor?.isActive("bold") ? "bg-accent" : ""
                          }
                        >
                          Bold
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={() =>
                            editor?.chain().focus().toggleItalic().run()
                          }
                          className={
                            editor?.isActive("italic") ? "bg-accent" : ""
                          }
                        >
                          Italic
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={() =>
                            editor
                              ?.chain()
                              .focus()
                              .toggleHeading({ level: 2 })
                              .run()
                          }
                          className={
                            editor?.isActive("heading", { level: 2 })
                              ? "bg-accent"
                              : ""
                          }
                        >
                          H2
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={() =>
                            editor?.chain().focus().toggleBulletList().run()
                          }
                          className={
                            editor?.isActive("bulletList") ? "bg-accent" : ""
                          }
                        >
                          Bullet List
                        </Button>
                      </div>
                      <div
                        className="p-4 min-h-[400px] cursor-text focus-within:outline-none"
                        onClick={() => editor?.chain().focus().run()}
                      >
                        <EditorContent
                          className="[&_*]:outline-none prose-sm focus:outline-none"
                          editor={editor}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
