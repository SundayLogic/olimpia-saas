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

// Dynamically import Tiptap UI components
const EditorContent = dynamic(
  () => import("@tiptap/react").then((mod) => mod.EditorContent),
  { ssr: false }
);
const BubbleMenu = dynamic(
  () => import("@tiptap/react").then((mod) => mod.BubbleMenu),
  { ssr: false }
);

/* ---------------------------------------------------------------------
   1) Types & Schema
---------------------------------------------------------------------- */

/** Base interface for 'type' property. */
interface BaseBlogContent {
  type: string; // "doc" or "html"
}

/** TiptapDoc extends the base interface and JSONContent, with type "doc". */
interface TiptapDoc extends BaseBlogContent, JSONContent {
  type: "doc";
}

/** RawHTML extends the base interface; type is "html" plus an html string. */
interface RawHTML extends BaseBlogContent {
  type: "html";
  html: string;
}

/** Union for blog content. */
type BlogContent = TiptapDoc | RawHTML | null;

/** Type guards. */
function isTiptapDoc(content: BlogContent): content is TiptapDoc {
  return !!content && content.type === "doc";
}
function isRawHtml(content: BlogContent): content is RawHTML {
  return !!content && content.type === "html";
}

/** Create RawHTML with type "html". */

/** Convert HTML to a Tiptap doc with type "doc". */
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

type BlogStatus = "draft" | "published" | "scheduled";
type AutoSaveState = {
  lastSaved: Date | null;
  saving: boolean;
  error: string | null;
};

/** Our schema for form data. */
const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.custom<JSONContent>((val) => !!val, {
    message: "Content is required",
  }),
  meta_description: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"]),
  published_at: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof schema>;

/* ---------------------------------------------------------------------
   2) The Editor Page Component
---------------------------------------------------------------------- */
export default function Page() {
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

  // Check if we're creating a new post
  const isNew = params.id === "new";

  // React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: {
        type: "doc",
        content: [{ type: "paragraph" }],
      },
      meta_description: "",
      status: "draft",
      tags: [],
    },
  });

  const status = form.watch("status");
  const publishedAt = form.watch("published_at");
  const metaDescription = form.watch("meta_description") || "";
  const tags = form.watch("tags");

  // Tiptap Editor
  const editor = useEditor({
    extensions: [StarterKit, ImageExt, LinkExt],
    content: form.watch("content"), // Tiptap doc
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none [&_*]:outline-none",
        spellcheck: "false",
      },
      handleDOMEvents: {
        focus: (view: EditorView, ev: Event) => {
          ev.preventDefault(); // optionally block focusing
          return false;
        },
      },
    },
    onUpdate: ({ editor: e }) => {
      if (!isPreview) {
        // Each text update => store & auto-save
        const updatedContent = e.getJSON();
        form.setValue("content", updatedContent);
        void autoSavePost({ ...form.getValues(), content: updatedContent });
      }
    },
  });

  // Toggle edit mode if in preview
  useEffect(() => {
    if (editor) editor.setEditable(!isPreview);
  }, [isPreview, editor]);

  // Mark editor as ready
  useEffect(() => {
    if (editor) setIsEditorReady(true);
  }, [editor]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        try {
          editor.commands.clearContent();
          editor.destroy();
        } catch {
          /* no-op */
        }
      }
    };
  }, [editor]);

  // Auto-save (only if editing an existing post)
  const autoSavePost = useCallback(
    async (data: FormData) => {
      if (!isNew && isEditorReady) {
        try {
          setAutoSave((p) => ({ ...p, saving: true }));

          // Update content & updated_at in DB
          const { error } = await supabase
            .from("blog_posts")
            .update({
              content: data.content,
              updated_at: new Date().toISOString(),
            })
            .eq("id", params.id);

          if (error) throw error;

          setAutoSave({
            lastSaved: new Date(),
            saving: false,
            error: null,
          });
        } catch (err) {
          console.error(err);
          setAutoSave((p) => ({
            ...p,
            saving: false,
            error: "Failed to auto-save",
          }));
        }
      }
    },
    [isNew, isEditorReady, supabase, params.id, form]
  );

  // Fetch existing post if editing
  useEffect(() => {
    const fetchPost = async () => {
      if (isNew) return;
      try {
        setIsLoading(true);

        const { data: post, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        if (post && editor && !editor.isDestroyed) {
          const content: BlogContent = post.content;
          if (isTiptapDoc(content)) {
            // If Tiptap, load it directly
            form.reset({
              title: post.title,
              content,
              meta_description: post.meta_description || "",
              status: (post.status || "draft") as BlogStatus,
              published_at: post.published_at || "",
              tags: post.tags || [],
            });
            editor.commands.setContent(content);
          } else if (isRawHtml(content)) {
            // If raw HTML => convert to Tiptap
            const converted = convertHTMLToTiptap(content.html);
            form.reset({
              title: post.title,
              content: converted,
              meta_description: post.meta_description || "",
              status: (post.status || "draft") as BlogStatus,
              published_at: post.published_at || "",
              tags: post.tags || [],
            });
            editor.commands.setContent(converted);
          }
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load post",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (editor && isEditorReady) {
      void fetchPost();
    }
  }, [isNew, params.id, supabase, form, editor, toast, isEditorReady]);

  // Final "Save" (Create or Update)
  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);

      // Get user info
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!userData?.user) throw new Error("No user found");

      // Build final object
      const postData = {
        title: values.title,
        slug: slugify(values.title, { lower: true, strict: true }),
        content: values.content,
        meta_description: values.meta_description,
        status: values.status,
        published_at: values.status === "scheduled" ? values.published_at : null,
        published: values.status === "published",
        tags: values.tags,
        author_id: userData.user.id,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        // Insert new
        const { error: createErr } = await supabase
          .from("blog_posts")
          .insert([
            {
              ...postData,
              created_at: new Date().toISOString(),
            },
          ]);
        if (createErr) throw createErr;

        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      } else {
        // Update existing
        const { error: updateErr } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", params.id);
        if (updateErr) throw updateErr;

        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      }

      // Return to posts list
      router.push("/dashboard/blog");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------------------------------
     3) Render
  ---------------------------------------------------------------------- */
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar: auto-save info, preview toggle, etc. */}
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
            onClick={() => setIsPreview((p) => !p)}
            disabled={!isEditorReady}
            aria-label="Toggle Preview"
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
            aria-label="Toggle Sidebar"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Tiptap editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Title input */}
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
                  aria-label="H1"
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
                  aria-label="H2"
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
                  aria-label="Paragraph"
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
                  aria-label="Bold"
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
                  aria-label="Bullet List"
                >
                  • List
                </Button>
              </div>
            )}

            {/* Editor region */}
            {!isEditorReady ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="min-h-[300px]">
                <div className="relative">
                  {editor && (
                    <EditorContent
                      editor={editor}
                      className={cn(
                        "prose prose-lg max-w-none",
                        "[&_.ProseMirror]:min-h-[300px]",
                        "[&_.ProseMirror]:outline-none",
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
                        "[&_.ProseMirror_a:hover]:text-primary/80",
                        isPreview ? "pointer-events-none opacity-70" : ""
                      )}
                    />
                  )}

                  {/* Bubble Menu for formatting */}
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
                        aria-label="Bold"
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
                        aria-label="Italic"
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
                        aria-label="Code"
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
                        aria-label="Heading"
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
                        aria-label="Blockquote"
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
                        aria-label="Bullet List"
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
                        aria-label="Add Link"
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
                        aria-label="Add Image"
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

        {/* Right: Sidebar with status, meta, tags */}
        {showSidebar && (
          <div className="w-80 border-l bg-card overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={status}
                  onValueChange={(v) => form.setValue("status", v as BlogStatus)}
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

              {/* Publish date if scheduled */}
              {status === "scheduled" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Publish Date</label>
                  <Input
                    type="datetime-local"
                    value={publishedAt || ""}
                    onChange={(e) =>
                      form.setValue("published_at", e.target.value)
                    }
                    disabled={isPreview}
                  />
                </div>
              )}

              {/* Meta description */}
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

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Select
                  value={tags.join(",")}
                  onValueChange={(v) =>
                    form.setValue(
                      "tags",
                      v.split(",").filter(Boolean)
                    )
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

      {/* Bottom bar: auto-save status, Save/Cancel */}
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
            ) : status === "scheduled" ? (
              "Schedule"
            ) : (
              "Save Draft"
            )}
          </Button>
        </div>
      </div>

      {/* Warning if scheduled but no date */}
      {status === "scheduled" && !publishedAt && (
        <div className="border-t bg-yellow-50 dark:bg-yellow-900/10 p-2 text-center">
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            Please select a publication date for scheduled posts
          </span>
        </div>
      )}

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
