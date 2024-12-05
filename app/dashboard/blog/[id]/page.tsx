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
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import type { JSONContent } from "@tiptap/react";

import {
  Loader2,
  Save,
  Eye,
  EyeOff,
  Settings,
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  List,
  Heading as HeadingIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/core/layout";

type BlogStatus = "draft" | "published" | "scheduled";

interface AutoSaveState {
  lastSaved: Date | null;
  saving: boolean;
  error: string | null;
}

const blogFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.custom<JSONContent>((data) => !!data),
  meta_description: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"]),
  published_at: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof blogFormSchema>;

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [autoSave, setAutoSave] = useState<AutoSaveState>({
    lastSaved: null,
    saving: false,
    error: null,
  });

  const isNewPost = params.id === "new";

  const form = useForm<FormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: { type: "doc", content: [{ type: "paragraph" }] },
      meta_description: "",
      status: "draft" as const,
      tags: [],
    },
  });

  const editor = useEditor({
    extensions: [StarterKit, Image, Link],
    content: form.watch("content"),
    editable: !isPreview,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none [&_*]:outline-none",
        spellcheck: "false",
      },
      handleDOMEvents: {
        focus: (view, event) => {
          event.preventDefault();
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      if (!isPreview) {
        const content = editor.getJSON();
        form.setValue("content", content);
        void autoSavePost({ ...form.getValues(), content });
      }
    },
  });

  useEffect(() => {
    if (editor) {
      setIsEditorReady(true);
    }
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const handlePreviewToggle = useCallback(() => {
    if (editor) {
      editor.setEditable(!isPreview);
      setIsPreview(!isPreview);
    }
  }, [editor, isPreview]);

  const autoSavePost = useCallback(
    async (data: FormData) => {
      if (!isNewPost) {
        try {
          setAutoSave((prev) => ({ ...prev, saving: true }));
          const { error: saveError } = await supabase
            .from("blog_posts")
            .update({
              content: data.content,
              updated_at: new Date().toISOString(),
            })
            .eq("id", params.id);

          if (saveError) throw saveError;

          setAutoSave({
            lastSaved: new Date(),
            saving: false,
            error: null,
          });
        } catch {
          setAutoSave((prev) => ({
            ...prev,
            saving: false,
            error: "Failed to auto-save",
          }));
        }
      }
    },
    [isNewPost, params.id, supabase]
  );

  useEffect(() => {
    const fetchPost = async () => {
      if (isNewPost) return;

      try {
        setIsLoading(true);
        const { data: post, error: fetchError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", params.id)
          .single();

        if (fetchError) throw fetchError;

        if (post && editor) {
          form.reset({
            title: post.title,
            content: post.content,
            meta_description: post.meta_description,
            status: post.status as BlogStatus,
            published_at: post.published_at,
            tags: post.tags || [],
          });
          editor.commands.setContent(post.content);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load blog post";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [isNewPost, params.id, supabase, form, editor, toast]);

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      const postData = {
        title: values.title,
        slug: slugify(values.title, { lower: true, strict: true }),
        content: values.content,
        meta_description: values.meta_description,
        status: values.status,
        published_at:
          values.status === "scheduled" ? values.published_at : null,
        published: values.status === "published",
        tags: values.tags,
        author_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (isNewPost) {
        const { error: createError } = await supabase
          .from("blog_posts")
          .insert([{ ...postData, created_at: new Date().toISOString() }]);

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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save blog post";
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PageHeader
        heading={isNewPost ? "Create New Post" : "Edit Post"}
        text={
          isNewPost ? "Create a new blog post" : "Edit an existing blog post"
        }
      />

      <div className="border-b p-4 flex items-center justify-between bg-card">
        <div className="flex items-center space-x-4">
          {autoSave.lastSaved && (
            <span className="text-sm text-muted-foreground flex items-center">
              <Save className="w-4 h-4 mr-1" />
              Last saved {format(autoSave.lastSaved, "h:mm a")}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviewToggle}
            disabled={!isEditorReady}
          >
            {isPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            <Input
              type="text"
              placeholder="Post title"
              className="text-3xl font-bold border-none bg-transparent focus-visible:ring-0 p-0 placeholder:text-muted-foreground/60"
              {...form.register("title")}
            />

            {!isEditorReady ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="min-h-[300px]">
                <div className="relative">
                  <EditorContent
                    editor={editor}
                    className={cn(
                      "prose prose-lg max-w-none",
                      isPreview ? "pointer-events-none" : "",
                      "[&_.ProseMirror]:min-h-[300px]",
                      "[&_.ProseMirror]:outline-none",
                      "[&_.ProseMirror]:focus:outline-none",
                      "[&_.ProseMirror]:focus-visible:outline-none",
                      "[&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]",
                      "[&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground/60",
                      "[&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left",
                      "[&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none",
                      "[&_.ProseMirror_::selection]:bg-primary/10",
                      "[&_.ProseMirror-selectednode]:outline-none",
                      "[&_.ProseMirror_h1]:text-3xl",
                      "[&_.ProseMirror_h2]:text-2xl",
                      "[&_.ProseMirror_h3]:text-xl",
                      "[&_.ProseMirror_h1,h2,h3,h4,h5,h6]:font-bold",
                      "[&_.ProseMirror_blockquote]:border-l-4",
                      "[&_.ProseMirror_blockquote]:border-muted",
                      "[&_.ProseMirror_blockquote]:pl-4",
                      "[&_.ProseMirror_blockquote]:italic",
                      "[&_.ProseMirror_pre]:bg-muted",
                      "[&_.ProseMirror_pre]:p-4",
                      "[&_.ProseMirror_pre]:rounded-md",
                      "[&_.ProseMirror_pre]:font-mono",
                      "[&_.ProseMirror_pre]:text-sm",
                      "[&_.ProseMirror_code]:bg-muted",
                      "[&_.ProseMirror_code]:px-1.5",
                      "[&_.ProseMirror_code]:py-0.5",
                      "[&_.ProseMirror_code]:rounded-sm",
                      "[&_.ProseMirror_code]:font-mono",
                      "[&_.ProseMirror_code]:text-sm",
                      "[&_.ProseMirror_img]:rounded-md",
                      "[&_.ProseMirror_img]:max-w-full",
                      "[&_.ProseMirror_img]:h-auto",
                      "[&_.ProseMirror_a]:text-primary",
                      "[&_.ProseMirror_a]:underline",
                      "[&_.ProseMirror_a:hover]:text-primary/80"
                    )}
                  />

                  {!isPreview && editor && (
                    <BubbleMenu
                      editor={editor}
                      tippyOptions={{ duration: 100 }}
                      className="flex items-center space-x-1 rounded-lg bg-background shadow-lg border p-1"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          editor.chain().focus().toggleBold().run()
                        }
                        className={editor.isActive("bold") ? "bg-accent" : ""}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          editor.chain().focus().toggleItalic().run()
                        }
                        className={editor.isActive("italic") ? "bg-accent" : ""}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          editor.chain().focus().toggleCode().run()
                        }
                        className={editor.isActive("code") ? "bg-accent" : ""}
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                        }
                        className={
                          editor.isActive("heading", { level: 2 })
                            ? "bg-accent"
                            : ""
                        }
                      >
                        <HeadingIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          editor.chain().focus().toggleBlockquote().run()
                        }
                        className={
                          editor.isActive("blockquote") ? "bg-accent" : ""
                        }
                      >
                        <Quote className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          editor.chain().focus().toggleBulletList().run()
                        }
                        className={
                          editor.isActive("bulletList") ? "bg-accent" : ""
                        }
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const url = window.prompt("Enter URL");
                          if (url)
                            editor.chain().focus().setLink({ href: url }).run();
                        }}
                        className={editor.isActive("link") ? "bg-accent" : ""}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const url = window.prompt("Enter image URL");
                          if (url)
                            editor.chain().focus().setImage({ src: url }).run();
                        }}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </BubbleMenu>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {showSidebar && (
          <div className="w-80 border-l bg-card overflow-y-auto">
            <div className="p-4 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value: BlogStatus) =>
                    form.setValue("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.watch("status") === "scheduled" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Publish Date</label>
                  <Input
                    type="datetime-local"
                    value={form.watch("published_at") || ""}
                    onChange={(e) =>
                      form.setValue("published_at", e.target.value)
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Description</label>
                <Textarea
                  value={form.watch("meta_description") || ""}
                  onChange={(e) =>
                    form.setValue("meta_description", e.target.value)
                  }
                  placeholder="Enter SEO description..."
                  className="h-20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Select
                  value={form.watch("tags").join(",")}
                  onValueChange={(value) =>
                    form.setValue("tags", value.split(",").filter(Boolean))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                  <SelectContent>
                    {["tech", "food", "travel", "lifestyle"].map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t bg-card p-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {autoSave.saving && (
            <span className="flex items-center">
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Saving...
            </span>
          )}
          {autoSave.error && (
            <span className="text-destructive">{autoSave.error}</span>
          )}
          {!autoSave.saving && !autoSave.error && autoSave.lastSaved && (
            <span className="text-muted-foreground">All changes saved</span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/blog")}
            disabled={isLoading || autoSave.saving}
          >
            Cancel
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading || autoSave.saving}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : form.watch("status") === "published" ? (
                "Publish"
              ) : form.watch("status") === "scheduled" ? (
                "Schedule"
              ) : (
                "Save Draft"
              )}
            </Button>
          </div>
        </div>
      </div>

      {form.watch("status") === "scheduled" && !form.watch("published_at") && (
        <div className="border-t bg-yellow-50 dark:bg-yellow-900/10 p-2 text-center">
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            Please select a publication date for scheduled posts
          </span>
        </div>
      )}
    </div>
  );
}
