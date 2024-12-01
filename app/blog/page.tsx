import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

// Define types for blog content structure
type ContentNode = {
  type: string;
  content?: Array<{
    type: string;
    text?: string;
    content?: ContentNode[];
  }>;
  text?: string;
};

type BlogContent = {
  type: string;
  content: ContentNode[];
};

type BlogPostType = {
  id: string;
  title: string;
  slug: string;
  content: BlogContent;
  featured_image: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  published: boolean;
  created_at: string;
  author_info: Array<{
    name: string | null;
    email: string;
  }>;
};

export default async function BlogPage() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch published blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`
      id,
      title,
      slug,
      content,
      featured_image,
      featured_image_url,
      featured_image_alt,
      published,
      created_at,
      author_info:users(name, email)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false });

  // Extract a preview from the content
  const getPreview = (content: BlogContent | null): string => {
    if (!content || !content.content) return "";
    
    const textContent = content.content.reduce((acc: string, node) => {
      if (node.content?.[0]?.text) {
        return acc + " " + node.content[0].text;
      }
      return acc;
    }, "");

    return textContent.length > 200 
      ? textContent.substring(0, 200) + "..."
      : textContent;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Latest news and updates from our restaurant
        </p>
      </div>

      {!posts?.length ? (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: BlogPostType) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
            >
              {/* Featured Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.featured_image_alt || post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="text-sm text-muted-foreground">
                      No image available
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {getPreview(post.content)}
                  </p>
                </div>

                {/* Metadata */}
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    By {post.author_info[0]?.name || post.author_info[0]?.email || 'Anonymous'}
                  </span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}