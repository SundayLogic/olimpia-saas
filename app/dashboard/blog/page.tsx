"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// Icons
import { Plus, Search, Trash2, Calendar } from "lucide-react";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/core/layout";

// Dynamically imported alert-dialog components
const AlertDialog = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialog)
);
const AlertDialogContent = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogContent)
);
const AlertDialogHeader = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogHeader)
);
const AlertDialogTitle = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogTitle)
);
const AlertDialogDescription = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogDescription)
);
const AlertDialogFooter = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogFooter)
);
const AlertDialogCancel = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogCancel)
);
const AlertDialogAction = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogAction)
);

// Dynamically imported select components
const Select = dynamic(() =>
  import("@/components/ui/select").then((mod) => mod.Select)
);
const SelectContent = dynamic(() =>
  import("@/components/ui/select").then((mod) => mod.SelectContent)
);
const SelectItem = dynamic(() =>
  import("@/components/ui/select").then((mod) => mod.SelectItem)
);
const SelectTrigger = dynamic(() =>
  import("@/components/ui/select").then((mod) => mod.SelectTrigger)
);
const SelectValue = dynamic(() =>
  import("@/components/ui/select").then((mod) => mod.SelectValue)
);

/* ---------------------------------------------------------------------
   1) Types & Helpers
---------------------------------------------------------------------- */
import type { JSONContent } from "@tiptap/react";

/** Tiptap doc shape. */
interface TiptapDoc extends JSONContent {
  type?: "doc";
}

/** If content is HTML-based. */
interface RawHTML {
  html: string;
  type?: "html";
}

type BlogContent = TiptapDoc | RawHTML | null;

/** Distinguish Tiptap doc from HTML object. */
function hasHtml(obj: unknown): obj is RawHTML {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "html" in obj &&
    typeof (obj as { html: unknown }).html === "string"
  );
}
function hasTiptapContent(obj: unknown): obj is TiptapDoc {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "content" in obj &&
    Array.isArray((obj as TiptapDoc).content)
  );
}

/** Extract minimal preview text (first 100 chars). */
function extractText(c: BlogContent): string {
  if (!c) return "";
  // If it's raw HTML
  if (hasHtml(c)) {
    const stripped = c.html.replace(/<[^>]+>/g, "");
    return stripped.slice(0, 100);
  }
  // If it's a Tiptap doc
  if (hasTiptapContent(c)) {
    let text = "";
    c.content?.forEach((node) => {
      if (node.type === "paragraph" && Array.isArray(node.content)) {
        node.content.forEach((child) => {
          if (child.type === "text" && typeof child.text === "string") {
            text += child.text + " ";
          }
        });
      }
    });
    return text.slice(0, 100);
  }
  return "";
}

type FilterOptions = {
  status: "all" | "published" | "draft";
  author: string;
  sortBy: "newest" | "oldest" | "title";
};

interface AuthorInfo {
  id: string;
  name: string | null;
  email: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string | null;
  content: BlogContent;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  author_id: string;
  author_info?: AuthorInfo[];
}

export default function BlogPage() {
  const { t } = useTranslation("blogPage");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    author: "all",
    sortBy: "newest",
  });

  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();

  // Fetch posts
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("blog_posts")
          .select(
            "id, title, slug, published, created_at, updated_at, content, featured_image_url, featured_image_alt, author_id"
          )
          .order("created_at", { ascending: false });

        if (error) {
          toast({
            title: t("error"),
            description: t("errors.failedToLoadPosts"),
            variant: "destructive",
          });
          return;
        }
        if (!data) {
          setPosts([]);
          return;
        }

        const rawPosts = data as BlogPost[];
        // Optionally fetch authors
        const authorIds = rawPosts.map((p) => p.author_id).filter(Boolean);
        let authorsData: AuthorInfo[] | undefined;
        if (authorIds.length > 0) {
          const { data: aData, error: authorsError } = await supabase
            .from("users")
            .select("id, name, email")
            .in("id", authorIds);

          if (authorsError) {
            console.error("Authors fetch error:", authorsError);
          }
          if (aData) {
            authorsData = aData.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
            }));
          }
        }

        setPosts(
          rawPosts.map((p) => ({
            ...p,
            author_info: authorsData?.filter((a) => a.id === p.author_id) || [],
          }))
        );
      } catch (err) {
        console.error(err);
        toast({
          title: t("error"),
          description: t("errors.loadPostsGeneric"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [supabase, toast, t]);

  // Delete logic
  const handleDeletePost = async () => {
    if (!deletePost) return;
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", deletePost.id);

    if (error) {
      toast({
        title: t("error"),
        description: t("errors.failedToDeletePost"),
        variant: "destructive",
      });
      return;
    }
    toast({
      title: t("success"),
      description: t("successPostDeleted"),
    });
    setPosts((cur) => cur.filter((x) => x.id !== deletePost.id));
    setDeletePost(null);
  };

  // Filtering
  const uniqueAuthors = useMemo(() => {
    return Array.from(
      new Set(
        posts.flatMap((p) =>
          p.author_info?.[0]
            ? [p.author_info[0].name || p.author_info[0].email]
            : []
        )
      )
    );
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => {
        const s = searchQuery.toLowerCase();
        const matchesSearch = p.title.toLowerCase().includes(s);

        const matchesStatus =
          filters.status === "all"
            ? true
            : filters.status === "published"
            ? p.published
            : !p.published;

        const matchesAuthor =
          filters.author === "all"
            ? true
            : p.author_info?.[0] &&
              (p.author_info[0].name === filters.author ||
                p.author_info[0].email === filters.author);

        return matchesSearch && matchesStatus && matchesAuthor;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          case "oldest":
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [posts, filters, searchQuery]);

  return (
    <div className="p-6">
      <PageHeader
        heading={t("heading")}
        text={t("description")}
      >
        <Button onClick={() => router.push("/dashboard/blog/new")}>
          <Plus className="mr-2 h-4 w-4" />
          {t("newPost")}
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder") as string}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(val) =>
            setFilters((prev) => ({
              ...prev,
              status: val as FilterOptions["status"],
            }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatus")}</SelectItem>
            <SelectItem value="published">{t("published")}</SelectItem>
            <SelectItem value="draft">{t("draft")}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.author}
          onValueChange={(val) => setFilters((prev) => ({ ...prev, author: val }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("filterByAuthor")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allAuthors")}</SelectItem>
            {uniqueAuthors.map((a) => (
              <SelectItem key={a} value={a || "Unnamed"}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy}
          onValueChange={(val) =>
            setFilters((prev) => ({
              ...prev,
              sortBy: val as FilterOptions["sortBy"],
            }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("newestFirst")}</SelectItem>
            <SelectItem value="oldest">{t("oldestFirst")}</SelectItem>
            <SelectItem value="title">{t("titleAz")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(filters.status !== "all" || filters.author !== "all" || searchQuery) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.status !== "all" && (
            <Badge variant="secondary" className="capitalize">
              {filters.status}
            </Badge>
          )}
          {filters.author !== "all" && (
            <Badge variant="secondary">
              {t("authorBadge")} {filters.author}
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary">
              {t("searchBadge")} {searchQuery}
            </Badge>
          )}
        </div>
      )}

      {/* Main content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || filters.status !== "all" || filters.author !== "all"
              ? t("noPostsMatchingFilters")
              : t("noPostsFound")}
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
                    {post.published ? t("published") : t("draft")}
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
                      <span>
                        {t("by")}{" "}
                        {post.author_info[0].name ||
                          post.author_info[0].email}
                      </span>
                    </>
                  )}
                  {post.updated_at && post.updated_at !== post.created_at && (
                    <>
                      <span>•</span>
                      <span>
                        {t("updated")}{" "}
                        {format(new Date(post.updated_at), "MMM d, yyyy")}
                      </span>
                    </>
                  )}
                </div>

                {post.content && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {extractText(post.content)}
                  </p>
                )}

                {/* Action buttons (View is REMOVED) */}
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/blog/${post.id}`)}
                  >
                    {t("editButton")}
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialogTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialogDescription", { title: deletePost?.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("deleteButton")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Stats */}
      <div className="mt-8 p-4 border rounded-lg bg-card">
        <h3 className="font-medium mb-4">{t("quickStatsHeading")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">{t("statsTotalPosts")}</div>
            <div className="text-2xl font-bold">{posts.length}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">{t("statsPublished")}</div>
            <div className="text-2xl font-bold">
              {posts.filter((p) => p.published).length}
            </div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">{t("statsDrafts")}</div>
            <div className="text-2xl font-bold">
              {posts.filter((p) => !p.published).length}
            </div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">{t("statsAuthors")}</div>
            <div className="text-2xl font-bold">{uniqueAuthors.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
