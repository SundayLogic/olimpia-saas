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
import dynamic from "next/dynamic";
import { useEditor } from "@tiptap/react";
import { EditorView } from "@tiptap/pm/view";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
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

import Image from "next/image"; // For showing featured image
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

/** Dynamically import Tiptap UI components */
const EditorContent = dynamic(
  () => import("@tiptap/react").then((mod) => mod.EditorContent),
  { ssr: false }
);
const BubbleMenu = dynamic(
  () => import("@tiptap/react").then((mod) => mod.BubbleMenu),
  { ssr: false }
);

/* ---------------------------------------------------------------------
   1) Types & Helpers
---------------------------------------------------------------------- */

/** Potential Tiptap doc shape (no `any`). */
interface TiptapDoc extends JSONContent {
  type?: "doc";
}

/** Potential Raw HTML shape. */
interface RawHTML {
  html: string;
  type?: "html";
}

/** Type guard to see if object is Tiptap doc. */
function isTiptapDoc(content: unknown): content is TiptapDoc {
  if (typeof content !== "object" || content === null) return false;
  const doc = content as TiptapDoc;
  return Array.isArray(doc.content);
}

/** Type guard to see if object is HTML-based. */
function isRawHtml(content: unknown): content is RawHTML {
  if (typeof content !== "object" || content === null) return false;
  return "html" in (content as Record<string, unknown>);
}

/** Convert raw HTML => naive Tiptap doc. */
function convertHTMLToTiptap(html: string): TiptapDoc {
  const stripped = html.replace(/<[^>]+>/g, "");
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: stripped }],
      },
    ],
  };
}

/** We only allow "draft" or "published". */
type BlogStatus = "draft" | "published";

type AutoSaveState = {
  lastSaved: Date | null;
  saving: boolean;
  error: string | null;
};

/** Zod schema for the form. */
const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.custom<JSONContent>((val) => !!val, {
    message: "Content is required",
  }),
  meta_description: z.string().optional(),
  status: z.enum(["draft", "published"]),
});
type FormData = z.infer<typeof schema>;

/* ---------------------------------------------------------------------
   2) The Editor Page
---------------------------------------------------------------------- */

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  // Local states
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [autoSave, setAutoSave] = useState<AutoSaveState>({
    lastSaved: null,
    saving: false,
    error: null,
  });

  /** Are we making a new post (id === "new") or editing existing? */
  const isNew = params.id === "new";

  // For displaying the featured image
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  const [featuredImageAlt, setFeaturedImageAlt] = useState<string | null>(null);

  // React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: { type: "doc", content: [{ type: "paragraph" }] },
      meta_description: "",
      status: "draft",
    },
  });

  const status = form.watch("status");
  const metaDescription = form.watch("meta_description") || "";

  // Tiptap Editor
  const editor = useEditor({
    extensions: [StarterKit, ImageExt, LinkExt],
    content: form.watch("content"),
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none [&_*]:outline-none",
        spellcheck: "false",
      },
      handleDOMEvents: {
        focus: (view: EditorView, ev: Event) => {
          // Prevent focusing Tiptap?
          ev.preventDefault();
          return false;
        },
      },
    },
    onUpdate: ({ editor: e }) => {
      if (!isPreview) {
        const updatedContent = e.getJSON();
        form.setValue("content", updatedContent);
        // Auto-save the content
        void autoSavePost({ ...form.getValues(), content: updatedContent });
      }
    },
  });

  // Toggle preview
  useEffect(() => {
    if (editor) editor.setEditable(!isPreview);
  }, [isPreview, editor]);

  // Mark editor as ready
  useEffect(() => {
    if (editor) setIsEditorReady(true);
  }, [editor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        editor.commands.clearContent();
        editor.destroy();
      }
    };
  }, [editor]);

  // Auto-Save logic for existing post
  const autoSavePost = useCallback(
    async (data: FormData) => {
      if (!isNew && isEditorReady) {
        try {
          setAutoSave((p) => ({ ...p, saving: true }));

          // Only update content in auto-save
          const updatePayload = {
            content: data.content,
            updated_at: new Date().toISOString(),
          };

          console.log("AutoSave - Attempting to save:", updatePayload);
          console.log("AutoSave - Post ID:", params.id);

          const { data: updateData, error } = await supabase
            .from("blog_posts")
            .update(updatePayload)
            .eq("id", params.id)
            .select();

          console.log("AutoSave - Response:", { data: updateData, error });

          if (error) {
            console.error("Auto-save update error details:", {
              error,
              postId: params.id,
            });
            throw error;
          }

          setAutoSave({
            lastSaved: new Date(),
            saving: false,
            error: null,
          });
        } catch (err) {
          console.error("Auto-save error:", err);
          setAutoSave((p) => ({
            ...p,
            saving: false,
            error: "Failed to auto-save",
          }));
        }
      }
    },
    [isNew, isEditorReady, supabase, params.id]
  );

  // Fetch existing post if not new
  useEffect(() => {
    const fetchPost = async () => {
      if (isNew) return;

      try {
        setIsLoading(true);

        // IMPORTANT: Make sure to select the columns you need, including featured_image_url & alt
        const { data: post, error } = await supabase
          .from("blog_posts")
          .select(
            "id, title, content, meta_description, published, created_at, updated_at, author_id, featured_image_url, featured_image_alt"
          )
          .eq("id", params.id)
          .single();

        if (error) throw error;
        console.log("Fetched blog post from Supabase:", post);

        if (post) {
          // Save featured image
          setFeaturedImageUrl(post.featured_image_url);
          setFeaturedImageAlt(post.featured_image_alt);

          // If we got a post, parse content
          let contentVal: unknown = post.content;
          if (typeof contentVal === "object" && contentVal !== null) {
            if (!("type" in contentVal)) {
              // If there's .html => treat as raw
              if (isRawHtml(contentVal)) {
                contentVal = {
                  type: "html",
                  html: contentVal.html,
                };
              }
              // If there's .content => treat as doc
              else if (isTiptapDoc(contentVal)) {
                (contentVal as TiptapDoc).type = "doc";
              }
            }
          }

          // Now final check
          let finalContent: JSONContent;
          if (isTiptapDoc(contentVal)) {
            finalContent = contentVal;
          } else if (isRawHtml(contentVal)) {
            finalContent = convertHTMLToTiptap(contentVal.html);
          } else {
            finalContent = { type: "doc", content: [] };
          }

          form.reset({
            title: post.title,
            content: finalContent,
            meta_description: post.meta_description ?? "",
            status: post.published ? "published" : "draft",
          });
          editor?.commands.setContent(finalContent);
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to load blog post",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!isNew && editor && isEditorReady) {
      void fetchPost();
    }
  }, [isNew, supabase, editor, isEditorReady, params.id, toast, form]);

  // Final Save => create or update
  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!userData?.user) throw new Error("No user found");

      // Get the current post if it exists
      let currentPost = null;
      if (!isNew) {
        const { data: postData, error: postErr } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", params.id)
          .single();

        if (postErr) throw postErr;
        currentPost = postData;
      }

      // Build postData
      const postData = {
        title: values.title,
        slug: slugify(values.title, { lower: true, strict: true }),
        content: values.content,
        meta_description: values.meta_description || null,
        published: values.status === "published",
        updated_at: new Date().toISOString(),
        // Ensure author_id is always set
        author_id: isNew
          ? userData.user.id
          : currentPost?.author_id || userData.user.id,
      };

      console.log("Saving post with data:", postData);

      if (isNew) {
        // Insert new post
        const { data: insertData, error: createErr } = await supabase
          .from("blog_posts")
          .insert([
            {
              ...postData,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        console.log("Insert response:", { data: insertData, error: createErr });

        if (createErr) throw createErr;
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      } else {
        // Update existing post
        const { data: updateData, error: updateErr } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", params.id)
          .select();

        console.log("Update response:", { data: updateData, error: updateErr });

        if (updateErr) throw updateErr;
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      }

      // Add a small delay to ensure toast is visible
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/blog");
    } catch (err) {
      console.error("Save error:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar with auto-save info & preview toggle */}
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
          {/* Toggle preview */}
          <Button
            variant="ghost"
            size="sm"
            disabled={!isEditorReady}
            onClick={() => setIsPreview((p) => !p)}
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

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Tiptap Editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Title */}
            <Input
              type="text"
              placeholder="Post title"
              className="text-3xl font-bold border-none bg-transparent focus-visible:ring-0 p-0 placeholder:text-muted-foreground/60"
              {...form.register("title")}
              disabled={isPreview}
            />

            {/* Simple toolbar if not preview */}
            {!isPreview && (
              <div className="flex items-center gap-2 py-2 mb-4 border-b">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={cn(
                    "hover:bg-accent/50",
                    editor?.isActive("heading", { level: 1 }) ? "bg-accent" : ""
                  )}
                >
                  H1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={cn(
                    "hover:bg-accent/50",
                    editor?.isActive("heading", { level: 2 }) ? "bg-accent" : ""
                  )}
                >
                  H2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().setParagraph().run()}
                  className={cn(
                    "hover:bg-accent/50",
                    editor?.isActive("paragraph") ? "bg-accent" : ""
                  )}
                >
                  P
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={cn(
                    "hover:bg-accent/50",
                    editor?.isActive("bold") ? "bg-accent" : ""
                  )}
                >
                  B
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  className={cn(
                    "hover:bg-accent/50",
                    editor?.isActive("bulletList") ? "bg-accent" : ""
                  )}
                >
                  • List
                </Button>
              </div>
            )}

            {/* Main editor region */}
            {!isEditorReady ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="min-h-[300px]">
                {editor && (
                  <EditorContent
                    editor={editor}
                    className={cn(
                      "prose prose-lg max-w-none",
                      "[&_.ProseMirror]:min-h-[300px]",
                      "[&_.ProseMirror]:outline-none",
                      isPreview ? "pointer-events-none opacity-70" : ""
                    )}
                  />
                )}

                {/* Bubble Menu for inline formatting */}
                {editor && !isPreview && (
                  <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 100 }}
                    className="flex items-center space-x-1 rounded-lg bg-background shadow-lg border p-1"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={cn(
                        "hover:bg-accent/50",
                        editor.isActive("bold") ? "bg-accent" : ""
                      )}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      className={cn(
                        "hover:bg-accent/50",
                        editor.isActive("italic") ? "bg-accent" : ""
                      )}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleCode().run()}
                      className={cn(
                        "hover:bg-accent/50",
                        editor.isActive("code") ? "bg-accent" : ""
                      )}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      }
                      className={cn(
                        "hover:bg-accent/50",
                        editor.isActive("heading", { level: 2 })
                          ? "bg-accent"
                          : ""
                      )}
                    >
                      <HeadingIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                      }
                      className={cn(
                        "hover:bg-accent/50",
                        editor.isActive("blockquote") ? "bg-accent" : ""
                      )}
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      className={cn(
                        "hover:bg-accent/50",
                        editor.isActive("bulletList") ? "bg-accent" : ""
                      )}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const url = window.prompt("Enter URL");
                        if (url) {
                          editor.chain().focus().setLink({ href: url }).run();
                        }
                      }}
                      className={cn(
                        "hover:bg-accent/50",
                        editor.isActive("link") ? "bg-accent" : ""
                      )}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const url = window.prompt("Enter image URL");
                        if (url) {
                          editor.chain().focus().setImage({ src: url }).run();
                        }
                      }}
                      className={cn(
                        "hover:bg-accent/50",
                        editor.isActive("image") ? "bg-accent" : ""
                      )}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </BubbleMenu>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar (Status & Meta Desc + Featured Image) */}
        {showSidebar && (
          <div className="w-80 border-l bg-card overflow-y-auto">
            <div className="p-4 space-y-6">

              {/* Featured Image Display */}
              <div>
                <label className="text-sm font-medium mb-2 inline-block">
                  Featured Image
                </label>
                {featuredImageUrl ? (
                  <div className="relative w-full h-48 mb-2 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={featuredImageUrl}
                      alt={featuredImageAlt || "Featured image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No featured image
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={status}
                  onValueChange={(v) =>
                    form.setValue("status", v as BlogStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Description</label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) =>
                    form.setValue("meta_description", e.target.value)
                  }
                  placeholder="Enter SEO description..."
                  className="h-20"
                  disabled={isPreview}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar: finalize actions */}
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
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading || autoSave.saving}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : status === "published" ? (
              "Publish"
            ) : (
              "Save Draft"
            )}
          </Button>
        </div>
      </div>

      {/* Tiptap global styling */}
      <style jsx global>{`
        .ProseMirror > * + * {
          margin-top: 0.75em;
        }
        .ProseMirror:focus {
          outline: none !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror-selectednode {
          outline: none !important;
        }
        .ProseMirror ::selection {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
