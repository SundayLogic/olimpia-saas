import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

// Types for blog content structure
type ContentNode = {
  type: string;
  content?: Array<{
    type: string;
    text?: string;
    content?: ContentNode[];
  }>;
  text?: string;
  attrs?: Record<string, unknown>;
};

type BlogContent = {
  type: string;
  content: ContentNode[];
};

type MenuItem = {
  id: number;
  name: string;
  price: number;
};

type Wine = {
  id: number;
  name: string;
  bottle_price: number;
};

type BlogPostData = {
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
  menu_items: Array<{
    menu_items: MenuItem;
  }>;
  wines: Array<{
    wines: Wine;
  }>;
};

// Helper function to render content
const renderContent = (content: BlogContent) => {
  if (!content.content) return null;

  return content.content.map((node, index) => {
    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {node.content?.map((child, childIndex) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </p>
        );
      case 'heading':
        const HeadingTag = `h${(node.attrs?.level || 1) as number}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag key={index} className="mb-4 mt-6 font-bold">
            {node.content?.map((child, childIndex) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </HeadingTag>
        );
      case 'image':
        return (
          <div key={index} className="my-6">
            <Image
              src={node.attrs?.src as string}
              alt={node.attrs?.alt as string || ''}
              width={800}
              height={400}
              className="rounded-lg"
              unoptimized
            />
          </div>
        );
      default:
        return null;
    }
  });
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch blog post with related content
  const { data: post } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author_info:users(name, email),
      menu_items:blog_menu_references(
        menu_items(id, name, price)
      ),
      wines:blog_wine_references(
        wines(id, name, bottle_price)
      )
    `)
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!post) {
    notFound();
  }

  const typedPost = post as unknown as BlogPostData;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          {typedPost.title}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>
            By {typedPost.author_info[0]?.name || typedPost.author_info[0]?.email || 'Anonymous'}
          </span>
          <span>•</span>
          <time dateTime={typedPost.created_at}>
            {format(new Date(typedPost.created_at), 'MMMM d, yyyy')}
          </time>
        </div>
      </header>

      {/* Featured Image */}
      {typedPost.featured_image_url && (
        <div className="mb-8 overflow-hidden rounded-lg">
          <Image
            src={typedPost.featured_image_url}
            alt={typedPost.featured_image_alt || typedPost.title}
            width={1200}
            height={630}
            className="w-full object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {renderContent(typedPost.content)}
      </div>

      {/* Related Items Section */}
      {(typedPost.menu_items?.length > 0 || typedPost.wines?.length > 0) && (
        <div className="mt-12 border-t pt-8">
          <h2 className="mb-6 text-2xl font-bold">Featured Items</h2>
          
          {/* Menu Items */}
          {typedPost.menu_items?.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">Menu Items</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {typedPost.menu_items.map(({ menu_items: item }) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <span className="text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wines */}
          {typedPost.wines?.length > 0 && (
            <div>
              <h3 className="mb-4 text-xl font-semibold">Featured Wines</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {typedPost.wines.map(({ wines: wine }) => (
                  <div key={wine.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{wine.name}</h4>
                      <span className="text-muted-foreground">
                        ${wine.bottle_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Back Link */}
      <div className="mt-12 border-t pt-8">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to all posts
        </Link>
      </div>
    </article>
  );
}