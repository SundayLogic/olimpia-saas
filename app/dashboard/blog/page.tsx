"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
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

// Dynamic Imports
const AlertDialog = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialog));
const AlertDialogContent = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogContent));
const AlertDialogHeader = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogHeader));
const AlertDialogTitle = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogTitle));
const AlertDialogDescription = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogDescription));
const AlertDialogFooter = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogFooter));
const AlertDialogCancel = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogCancel));
const AlertDialogAction = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogAction));

const Select = dynamic(() => import("@/components/ui/select").then(mod => mod.Select));
const SelectContent = dynamic(() => import("@/components/ui/select").then(mod => mod.SelectContent));
const SelectItem = dynamic(() => import("@/components/ui/select").then(mod => mod.SelectItem));
const SelectTrigger = dynamic(() => import("@/components/ui/select").then(mod => mod.SelectTrigger));
const SelectValue = dynamic(() => import("@/components/ui/select").then(mod => mod.SelectValue));

// Types
type FilterOptions = { status:"all"|"published"|"draft"; author:string; sortBy:"newest"|"oldest"|"title"; };
type ContentNode = { type:string; content?:{type:string; text?:string;}[] };
type BlogContent = { type:string; content:ContentNode[] };
type AuthorInfo = { id:string; name:string|null; email:string; };
type BlogPost = {
  id:string;
  title:string;
  slug:string;
  published:boolean;
  created_at:string;
  updated_at:string|null;
  content:BlogContent|null;
  featured_image_url:string|null;
  featured_image_alt:string|null;
  author_id:string;
  author_info?: AuthorInfo[];
};

type BlogPostsRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string|null;
  content: BlogContent|null;
  featured_image_url: string|null;
  featured_image_alt: string|null;
  author_id: string;
};

export default function BlogPage() {
  const [posts,setPosts]=useState<BlogPost[]>([]);
  const [isLoading,setIsLoading]=useState(true);
  const [searchQuery,setSearchQuery]=useState("");
  const [deletePost,setDeletePost]=useState<BlogPost|null>(null);
  const [filters,setFilters]=useState<FilterOptions>({status:"all",author:"all",sortBy:"newest"});
  const supabase = createClientComponentClient();
  const {toast}=useToast();
  const router=useRouter();

  const getContentPreview=(c:BlogContent|null)=>
    c?.content?.map(b=>b.content?.[0]?.text).filter(Boolean).join(" ")||"";

  const getUniqueAuthors=():string[]=>
    Array.from(new Set(posts.flatMap(p=>p.author_info?.[0]?[(p.author_info[0].name||p.author_info[0].email)!]:[])));

  const uniqueAuthors=useMemo(()=>getUniqueAuthors(),[posts]);

  useEffect(()=>{
    (async()=>{
      try {
        setIsLoading(true);
        const {data,error}=await supabase
          .from("blog_posts")
          .select("id,title,slug,published,created_at,updated_at,content,featured_image_url,featured_image_alt,author_id")
          .order("created_at",{ascending:false});

        if(error){
          toast({title:"Error",description:"Failed to load blog posts",variant:"destructive"});
          return;
        }

        const postsData = data as BlogPostsRow[]|null;
        if(!postsData){setPosts([]);return;}

        const authorIds=postsData.map(p=>p.author_id).filter(Boolean);
        let authorsData:AuthorInfo[]|undefined;
        if(authorIds.length>0){
          const {data:aData,error:authorsError}=await supabase
            .from("users")
            .select("id,name,email")
            .in("id",authorIds);
          if(authorsError) console.error("Authors fetch error:",authorsError);
          authorsData=aData?.map(u=>({id:u.id,name:u.name,email:u.email}));
        }

        setPosts(postsData.map(p=>({
          ...p,
          author_info: authorsData?.filter((a)=>a.id===p.author_id)||[]
        })));
      } catch(e){
        console.error(e);
        toast({title:"Error",description:"An error occurred while loading posts",variant:"destructive"});
      } finally {
        setIsLoading(false);
      }
    })();
  },[supabase,toast]);

  const handleDeletePost=async()=>{
    if(!deletePost)return;
    const {error}=await supabase.from("blog_posts").delete().eq("id",deletePost.id);
    if(error){
      toast({title:"Error",description:"Failed to delete post",variant:"destructive"});
      return;
    }
    toast({title:"Success",description:"Post deleted successfully"});
    setPosts(c=>c.filter(x=>x.id!==deletePost.id));
    setDeletePost(null);
  };

  const filteredPosts=useMemo(()=>{
    return posts
      .filter(p=>{
        const s=searchQuery.toLowerCase();
        const matchesSearch=p.title.toLowerCase().includes(s);
        const matchesStatus=filters.status==="all"?true:filters.status==="published"?p.published:!p.published;
        const matchesAuthor=filters.author==="all"?true:(p.author_info?.[0]&&(p.author_info[0].name===filters.author||p.author_info[0].email===filters.author));
        return matchesSearch && matchesStatus && matchesAuthor;
      })
      .sort((a,b)=>{
        switch(filters.sortBy){
          case "newest":return new Date(b.created_at).getTime()-new Date(a.created_at).getTime();
          case "oldest":return new Date(a.created_at).getTime()-new Date(b.created_at).getTime();
          case "title":return a.title.localeCompare(b.title);
          default:return 0;
        }
      });
  },[posts,filters,searchQuery]);

  return (
    <div className="p-6">
      <PageHeader heading="Blog Posts" text="Create and manage your blog content">
        <Button onClick={()=>router.push("/dashboard/blog/new")}><Plus className="mr-2 h-4 w-4"/>New Post</Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
          <Input placeholder="Search posts..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="pl-9"/>
        </div>

        <Select value={filters.status} onValueChange={val=>setFilters(p=>({...p,status:val as FilterOptions["status"]}))}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.author} onValueChange={val=>setFilters(p=>({...p,author:val}))}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Author"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            {uniqueAuthors.map(a=><SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={val=>setFilters(p=>({...p,sortBy:val as FilterOptions["sortBy"]}))}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Sort by"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(filters.status!=="all"||filters.author!=="all"||searchQuery)&&(
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.status!=="all"&&<Badge variant="secondary" className="capitalize">{filters.status}</Badge>}
          {filters.author!=="all"&&<Badge variant="secondary">Author: {filters.author}</Badge>}
          {searchQuery&&<Badge variant="secondary">Search: {searchQuery}</Badge>}
        </div>
      )}

      {isLoading?(
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"/></div>
      ):filteredPosts.length===0?(
        <div className="text-center py-12"><p className="text-muted-foreground">{searchQuery||filters.status!=="all"||filters.author!=="all"?"No posts found matching your filters.":"No blog posts found. Create your first post!"}</p></div>
      ):(
        <div className="grid gap-6">
          {filteredPosts.map(post=>(
            <div key={post.id} className="group relative flex gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow">
              {post.featured_image_url&&(
                <div className="relative h-32 w-32 rounded-md overflow-hidden bg-muted shrink-0">
                  <Image src={post.featured_image_url} alt={post.featured_image_alt||post.title} fill className="object-cover" unoptimized/>
                </div>
              )}

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium truncate">{post.title}</h3>
                  <Badge variant={post.published?"default":"secondary"}>{post.published?"Published":"Draft"}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4"/>
                    {format(new Date(post.created_at),"MMM d, yyyy")}
                  </div>
                  {post.author_info?.[0]&&(<><span>•</span><span>By {post.author_info[0].name||post.author_info[0].email}</span></>)}
                  {post.updated_at&&post.updated_at!==post.created_at&&(<><span>•</span><span>Updated {format(new Date(post.updated_at),"MMM d, yyyy")}</span></>)}
                </div>

                {post.content&&(
                  <p className="text-sm text-muted-foreground line-clamp-2">{getContentPreview(post.content)}</p>
                )}

                <div className="flex items-center gap-2 mt-4">
                  {post.published&&<Button variant="outline" size="sm" onClick={()=>router.push(`/blog/${post.slug}`)}><Eye className="h-4 w-4 mr-2"/>View</Button>}
                  <Button variant="outline" size="sm" onClick={()=>router.push(`/dashboard/blog/${post.id}`)}>Edit</Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={()=>setDeletePost(post)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletePost} onOpenChange={()=>setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletePost?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-8 p-4 border rounded-lg bg-card">
        <h3 className="font-medium mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Total Posts</div>
            <div className="text-2xl font-bold">{posts.length}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Published</div>
            <div className="text-2xl font-bold">{posts.filter(p=>p.published).length}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Drafts</div>
            <div className="text-2xl font-bold">{posts.filter(p=>!p.published).length}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Authors</div>
            <div className="text-2xl font-bold">{uniqueAuthors.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
