"use client";
import React,{useState,useMemo,useCallback,useTransition,useEffect}from"react";
import{createClientComponentClient}from"@supabase/auth-helpers-nextjs";
import Image from"next/image";
import{Plus,Search,Edit}from"lucide-react";
import{Button}from"@/components/ui/button";
import{useToast}from"@/hooks/use-toast";
import{Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle}from"@/components/ui/dialog";
import{Input}from"@/components/ui/input";
import{Label}from"@/components/ui/label";
import{Select,SelectContent,SelectItem,SelectTrigger,SelectValue}from"@/components/ui/select";
import{Alert,AlertDescription}from"@/components/ui/alert";
import{PageHeader}from"@/components/core/layout";
import{Badge}from"@/components/ui/badge";
import{MultiSelect}from"@/components/ui/multi-select";
import{useQuery,useQueryClient}from"@tanstack/react-query";

type Allergen={id:string;name:string;};
type Category={id:string;name:string;};
type RawMenuItemResponse={
  id:string;name:string;description:string;price:number;category_id:number;image_path:string|null;active:boolean;
  menu_categories:{id:string;name:string;}[];
  menu_item_allergens:{allergens:{id:string;name:string;}[]}[];
};
type MenuItem={
  id:string;name:string;description:string;price:number;category_id:number;image_url:string|null;image_path:string|null;active:boolean;
  category?:{id:string;name:string;}|null;
  allergens?:Allergen[];
};
type NewMenuItem={name:string;description:string;price:string;category_id:string;active:boolean;allergen_ids:string[];};
interface EditDialogState{open:boolean;item:MenuItem|null;}
interface EditFormData{name:string;description:string;price:string;category_id:string;allergen_ids:string[];}

export default function MenuPage(){
  const supabase=createClientComponentClient();
  const{toast}=useToast();
  const queryClient=useQueryClient();
  const[isDialogOpen,setIsDialogOpen]=useState(false);
  const[newItem,setNewItem]=useState<NewMenuItem>({name:"",description:"",price:"",category_id:"",active:true,allergen_ids:[]});
  const[editDialog,setEditDialog]=useState<EditDialogState>({open:false,item:null});
  const[editForm,setEditForm]=useState<EditFormData>({name:"",description:"",price:"",category_id:"",allergen_ids:[]});
  const[,startSearchTransition]=useTransition();
  const[selectedFilter,setSelectedFilter]=useState("all");
  const[searchTerm,setSearchTerm]=useState("");
  const[localSearchTerm,setLocalSearchTerm]=useState(searchTerm);

  useEffect(()=>{
    const handler=setTimeout(()=>{startSearchTransition(()=>setSearchTerm(localSearchTerm));},300);
    return()=>clearTimeout(handler);
  },[localSearchTerm,startSearchTransition]);

  const getImageUrl=(path:string|null)=>path?`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/${path}`:null;

  const highlightText=useCallback((text:string,term:string)=>{
    if(!term.trim())return text;
    const regex=new RegExp(`(${term})`,"gi");
    return text.split(regex).map((part,i)=>
      regex.test(part)?<span key={i} className="bg-orange-500 text-white">{part}</span>:part
    );
  },[]);

  const fetchAllergens=async()=>{
    const{data,error}=await supabase.from("allergens").select("*").order("name");
    if(error)throw error;return data as Allergen[];
  };

  const fetchCategories=async()=>{
    const{data,error}=await supabase.from("menu_categories").select("*").order("name");
    if(error)throw error;return data as Category[];
  };

  const fetchItems=async()=>{
    const{data,error}=await supabase
      .from("menu_items")
      .select(`id,name,description,price,category_id,image_path,active,menu_categories (id,name),menu_item_allergens (allergens (id,name))`)
      .order("name");
    if(error)throw error;
    const raw=data as RawMenuItemResponse[];
    return raw.map(i=>({
      id:i.id,name:i.name,description:i.description,price:i.price,category_id:i.category_id,image_url:getImageUrl(i.image_path),image_path:i.image_path,active:i.active,
      category:i.menu_categories[0]||null,
      allergens:i.menu_item_allergens.flatMap(r=>r.allergens)
    }));
  };

  const{data:allergens=[],isLoading:allergensLoading,error:allergensError}=useQuery<Allergen[]>({queryKey:["allergens"],queryFn:fetchAllergens});
  const{data:categories=[],isLoading:categoriesLoading,error:categoriesError}=useQuery<Category[]>({queryKey:["categories"],queryFn:fetchCategories});
  const{data:items=[],isLoading:itemsLoading,error:itemsError}=useQuery<MenuItem[]>({queryKey:["items"],queryFn:fetchItems});

  const isLoading=allergensLoading||categoriesLoading||itemsLoading;
  const error=allergensError||categoriesError||itemsError;

  const filteredItems=useMemo(()=>{
    if(!items)return[];
    let f=items;
    const s=searchTerm.toLowerCase().trim();
    if(s)f=f.filter(i=>i.name.toLowerCase().includes(s)||i.description.toLowerCase().includes(s));
    if(selectedFilter!=="all"){
      const parsed=Number(selectedFilter);
      f=f.filter(i=>(i.category?.id===selectedFilter)||i.category_id===parsed);
    }
    return f;
  },[items,selectedFilter,searchTerm]);

  const handleCreateItem=async()=>{
    try{
      if(!newItem.name||!newItem.category_id||!newItem.price){toast({title:"Error",description:"Please fill in all required fields",variant:"destructive"});return;}
      const priceValue=parseFloat(newItem.price);
      if(isNaN(priceValue)||priceValue<0){toast({title:"Error",description:"Please enter a valid positive price.",variant:"destructive"});return;}
      const{data:insertedItem,error:itemError}=await supabase.from("menu_items").insert({
        name:newItem.name,description:newItem.description,price:priceValue,category_id:Number(newItem.category_id),active:newItem.active
      }).select().single();
      if(itemError)throw itemError;
      if(newItem.allergen_ids.length>0){
        const assign=newItem.allergen_ids.map(allergenId=>({menu_item_id:insertedItem.id,allergen_id:allergenId}));
        const{error:assignmentError}=await supabase.from("menu_item_allergens").insert(assign);
        if(assignmentError)throw assignmentError;
      }
      await queryClient.invalidateQueries({queryKey:["items"]});
      setIsDialogOpen(false);
      setNewItem({name:"",description:"",price:"",category_id:"",active:true,allergen_ids:[]});
      toast({title:"Success",description:"Menu item created successfully"});
    }catch(e){
      const msg=e instanceof Error?e.message:"Failed to create menu item";
      console.error(e);
      toast({title:"Error",description:msg,variant:"destructive"});
    }
  };

  const handleEdit=useCallback((item:MenuItem)=>{
    setEditForm({
      name:item.name,
      description:item.description,
      price:item.price.toString(),
      category_id:item.category_id.toString(),
      allergen_ids:item.allergens?.map(a=>a.id)||[],
    });
    setEditDialog({open:true,item});
  },[]);

  const handleSaveEdit=useCallback(async()=>{
    if(!editDialog.item)return;
    try{
      if(!editForm.name||!editForm.category_id||!editForm.price){toast({title:"Error",description:"Please fill in all required fields.",variant:"destructive"});return;}
      const priceValue=parseFloat(editForm.price);
      if(isNaN(priceValue)||priceValue<0){toast({title:"Error",description:"Please enter a valid positive price.",variant:"destructive"});return;}
      const categoryId=Number(editForm.category_id);
      if(isNaN(categoryId)){toast({title:"Error",description:"Please select a valid category.",variant:"destructive"});return;}
      const{error:itemError}=await supabase.from("menu_items").update({
        name:editForm.name,description:editForm.description,price:priceValue,category_id:categoryId
      }).eq("id",editDialog.item.id);
      if(itemError)throw itemError;
      const{error:deleteError}=await supabase.from("menu_item_allergens").delete().eq("menu_item_id",editDialog.item.id);
      if(deleteError)throw deleteError;
      if(editForm.allergen_ids.length>0){
        const assign=editForm.allergen_ids.map(allergenId=>({menu_item_id:editDialog.item!.id,allergen_id:allergenId}));
        const{error:assignmentError}=await supabase.from("menu_item_allergens").insert(assign);
        if(assignmentError)throw assignmentError;
      }
      await queryClient.invalidateQueries({queryKey:["items"]});
      toast({title:"Success",description:"Menu item updated successfully."});
      setEditDialog({open:false,item:null});
    }catch(e){
      const msg=e instanceof Error?e.message:"Failed to update menu item";
      console.error(e);
      toast({title:"Error",description:msg,variant:"destructive"});
    }
  },[editDialog.item,editForm,supabase,toast,queryClient]);

  if(isLoading)return<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"/></div>;
  if(error)return<div className="container p-6"><Alert variant="destructive"><AlertDescription>Failed to load data.</AlertDescription></Alert></div>;
  if(!items||items.length===0)return<div className="container p-6"><Alert><AlertDescription>No menu items found.</AlertDescription></Alert><div className="mt-4"><Button onClick={()=>setIsDialogOpen(true)}>Add Your First Item</Button></div></div>;

  return(
    <div className="container p-6">
      <PageHeader heading="Menu Items" text="Manage your restaurant's menu selection">
        <Button onClick={()=>setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4"/>
          Add Item
        </Button>
      </PageHeader>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-[300px]">
            <Input type="text" placeholder="Search menu items..." value={localSearchTerm} onChange={e=>setLocalSearchTerm(e.target.value)} className="w-full pl-10"/>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
          </div>
          <Select value={selectedFilter} onValueChange={value=>startSearchTransition(()=>{setSelectedFilter(value);})}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Category"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c=><SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 relative">
        {filteredItems.map(item=>(
          <div key={item.id} className="group relative flex flex-col bg-white border border-neutral-100 rounded-sm p-6 hover:shadow-sm transition-shadow">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button variant="secondary" size="sm" onClick={()=>handleEdit(item)} className="h-8 w-8 p-0" aria-label={`Edit ${item.name}`}>
                <Edit className="h-4 w-4"/>
              </Button>
            </div>

            <div className="relative w-full pb-[100%] mb-4">
              {item.image_url?(
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover rounded-sm"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                  onError={e=>{
                    const t=e.target as HTMLImageElement;
                    t.src=`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/placeholder.webp`;
                  }}
                />
              ):(
                <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center rounded-sm">
                  <span className="text-neutral-400">No image</span>
                </div>
              )}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
              {item.category?.name}
            </div>
            {item.name&&<h3 className="text-lg font-medium mb-2">{highlightText(item.name,searchTerm)}</h3>}
            {item.description&&<p className="text-sm text-neutral-600 mb-4">{highlightText(item.description,searchTerm)}</p>}
            <div className="flex flex-wrap gap-1 mb-4">
              {item.allergens?.map(a=><Badge key={a.id} variant="secondary" className="text-xs px-2 py-0.5 bg-neutral-100">{a.name}</Badge>)}
            </div>
            <div className="mt-auto font-medium text-lg">${item.price.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>Create a new menu item with details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})} placeholder="Menu item name"/></div>
            <div className="grid gap-2"><Label>Price</Label><Input type="number" step="0.01" value={newItem.price} onChange={e=>setNewItem({...newItem,price:e.target.value})} placeholder="0.00"/></div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={newItem.category_id} onValueChange={value=>setNewItem({...newItem,category_id:value})}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select category"/></SelectTrigger>
                <SelectContent>{categories.map(c=><SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Description</Label><Input value={newItem.description} onChange={e=>setNewItem({...newItem,description:e.target.value})} placeholder="Menu item description"/></div>
            <div className="grid gap-2">
              <Label>Allergens</Label>
              <MultiSelect options={allergens} selected={newItem.allergen_ids} onChange={ids=>setNewItem({...newItem,allergen_ids:ids})} placeholder="Select allergens"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateItem}>Create Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialog.open} onOpenChange={open=>!open&&setEditDialog({open:false,item:null})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>Update the details of the selected menu item.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} placeholder="Menu item name"/></div>
            <div className="grid gap-2"><Label>Description</Label><Input value={editForm.description} onChange={e=>setEditForm({...editForm,description:e.target.value})} placeholder="Menu item description"/></div>
            <div className="grid gap-2"><Label>Price</Label><Input type="number" step="0.01" value={editForm.price} onChange={e=>setEditForm({...editForm,price:e.target.value})} placeholder="0.00"/></div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={editForm.category_id} onValueChange={value=>setEditForm({...editForm,category_id:value})}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select category"/></SelectTrigger>
                <SelectContent>{categories.map(c=><SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Allergens</Label>
              <MultiSelect options={allergens} selected={editForm.allergen_ids} onChange={ids=>setEditForm({...editForm,allergen_ids:ids})} placeholder="Select allergens"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setEditDialog({open:false,item:null})}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
