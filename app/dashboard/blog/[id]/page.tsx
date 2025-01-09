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

// Dynamically import Tiptap UI
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

interface BaseBlogContent {
  type: string; // "doc" or "html"
}
interface TiptapDoc extends BaseBlogContent, JSONContent {
  type: "doc";
}
interface RawHTML extends BaseBlogContent {
  type: "html";
  html: string;
}
type BlogContent = TiptapDoc | RawHTML | null;

function isTiptapDoc(content: BlogContent): content is TiptapDoc {
  return !!content && content.type === "doc";
}
function isRawHtml(content: BlogContent): content is RawHTML {
  return !!content && content.type === "html";
}

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

type BlogStatus = "draft" | "published";

type AutoSaveState = {
  lastSaved: Date | null;
  saving: boolean;
  error: string | null;
};

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
   2) Editor Page
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

  const isNew = params.id === "new"; // Are we making a new post?

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
          ev.preventDefault();
          return false;
        },
      },
    },
    onUpdate: ({ editor: e }) => {
      if (!isPreview) {
        const updatedContent = e.getJSON();
        form.setValue("content", updatedContent);
        void autoSavePost({ ...form.getValues(), content: updatedContent });
      }
    },
  });

  useEffect(() => {
    if (editor) editor.setEditable(!isPreview);
  }, [isPreview, editor]);

  useEffect(() => {
    if (editor) setIsEditorReady(true);
  }, [editor]);

  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        editor.commands.clearContent();
        editor.destroy();
      }
    };
  }, [editor]);

  const autoSavePost = useCallback(
    async (data: FormData) => {
      if (!isNew && isEditorReady) {
        try {
          setAutoSave((p) => ({ ...p, saving: true }));
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
    [isNew, isEditorReady, supabase, params.id]
  );

  // *** The fetch effect with "shim" for missing type
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

        console.log("Fetched blog post from Supabase:", post);

        if (post && editor && !editor.isDestroyed) {
          let content = post.content as any;
          // If there's an .html property => treat it as raw HTML
          if (content && typeof content.html === "string" && !content.type) {
            content = { type: "html", html: content.html };
          }
          // If there's a top-level .content array => treat it as Tiptap doc
          else if (content && content.content && Array.isArray(content.content) && !content.type) {
            content.type = "doc";
          }

          if (isTiptapDoc(content)) {
            form.reset({
              title: post.title,
              content,
              meta_description: post.meta_description ?? "",
              status: post.published ? "published" : "draft",
            });
            editor.commands.setContent(content);
          } else if (isRawHtml(content)) {
            const converted = convertHTMLToTiptap(content.html);
            form.reset({
              title: post.title,
              content: converted,
              meta_description: post.meta_description ?? "",
              status: post.published ? "published" : "draft",
            });
            editor.commands.setContent(converted);
          } else {
            console.warn("Unrecognized content format, using empty doc.");
            form.reset({
              title: post.title,
              content: { type: "doc", content: [] },
              meta_description: post.meta_description ?? "",
              status: post.published ? "published" : "draft",
            });
            editor.commands.setContent({ type: "doc", content: [] });
          }
        }
      } catch (err) {
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

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!userData?.user) throw new Error("No user found");

      const postData = {
        title: values.title,
        slug: slugify(values.title, { lower: true, strict: true }),
        content: values.content,
        meta_description: values.meta_description,
        status: values.status,
        published: values.status === "published",
        author_id: userData.user.id,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { error: createErr } = await supabase
          .from("blog_posts")
          .insert([
            {
              ...postData,
              created_at: new Date().toISOString(),
            },
          ]);
        if (createErr) throw createErr;

        toast({ title: "Success", description: "Blog post created successfully" });
      } else {
        const { error: updateErr } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", params.id);
        if (updateErr) throw updateErr;

        toast({ title: "Success", description: "Blog post updated successfully" });
      }

      router.push("/dashboard/blog");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar with auto-save info, preview toggle */}
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
            {/* Title input */}
            <Input
              type="text"
              placeholder="Post title"
              className="text-3xl font-bold border-none bg-transparent focus-visible:ring-0 p-0 placeholder:text-muted-foreground/60"
              {...form.register("title")}
              disabled={isPreview}
            />

            {/* Simple toolbar */}
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

            {/* Editor region */}
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
                      onClick={() => editor.chain().focus().toggleItalic().run()}
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

        {/* Sidebar with status & meta desc */}
        {showSidebar && (
          <div className="w-80 border-l bg-card overflow-y-auto">
            <div className="p-4 space-y-6">
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
                  </SelectContent>
                </Select>
              </div>

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
            ) : (
              "Save Draft"
            )}
          </Button>
        </div>
      </div>

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
