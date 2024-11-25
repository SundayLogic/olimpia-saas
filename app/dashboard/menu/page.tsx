"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/core/layout";
import { Badge } from "@/components/ui/badge";

// Basic types
type Allergen = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

// Raw response types from Supabase
type RawMenuItemResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_path: string | null;
  active: boolean;
  menu_categories: Array<{
    id: string;
    name: string;
  }>;
  menu_item_allergens: Array<{
    allergens: {
      id: string;
      name: string;
    };
  }>;
};

// Transformed MenuItem type for the application
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string | null;
  image_path: string | null;
  active: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  allergens?: Allergen[];
};

// Type for new menu item form
type NewMenuItem = {
  name: string;
  description: string;
  price: string;
  category_id: string;
  active: boolean;
  allergen_ids: string[];
};

export default function MenuPage() {
  // State declarations
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [newItem, setNewItem] = useState<NewMenuItem>({
    name: "",
    description: "",
    price: "",
    category_id: "",
    active: true,
    allergen_ids: [],
  });

  // Initialize Supabase client and toast
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Helper function for image URL construction
  const getImageUrl = (imagePath: string | null): string | null => {
    if (!imagePath) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/${imagePath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Parallel data fetching
        const [allergensResponse, categoriesResponse, itemsResponse] =
          await Promise.all([
            supabase.from("allergens").select("*").order("name"),
            supabase.from("menu_categories").select("*").order("name"),
            supabase
              .from("menu_items")
              .select(
                `
              id,
              name,
              description,
              price,
              category_id,
              image_path,
              active,
              menu_categories!menu_items_category_id_fkey (
                id,
                name
              ),
              menu_item_allergens (
                allergens (
                  id,
                  name
                )
              )
            `
              )
              .order("name"),
          ]);

        // Error checking
        if (allergensResponse.error) throw allergensResponse.error;
        if (categoriesResponse.error) throw categoriesResponse.error;
        if (itemsResponse.error) throw itemsResponse.error;

        // Set basic data
        setAllergens(allergensResponse.data || []);
        setCategories(categoriesResponse.data || []);

        // Transform and type menu items
        const rawItems = itemsResponse.data as unknown as RawMenuItemResponse[];
        const transformedItems = rawItems.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category_id: item.category_id,
          image_url: getImageUrl(item.image_path),
          image_path: item.image_path,
          active: item.active,
          category: item.menu_categories[0] || null,
          allergens: item.menu_item_allergens.map(
            (relation) => relation.allergens
          ),
        }));

        setItems(transformedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load menu items");
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supabase, toast]);

  // Create new item handler
  const handleCreateItem = async () => {
    try {
      if (!newItem.name || !newItem.category_id || !newItem.price) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Create menu item
      const { data: item, error: itemError } = await supabase
        .from("menu_items")
        .insert({
          name: newItem.name,
          description: newItem.description,
          price: parseFloat(newItem.price),
          category_id: newItem.category_id,
          active: newItem.active,
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Create allergen assignments if any
      if (newItem.allergen_ids.length > 0) {
        const allergenAssignments = newItem.allergen_ids.map((allergenId) => ({
          menu_item_id: item.id,
          allergen_id: allergenId,
        }));

        const { error: assignmentError } = await supabase
          .from("menu_item_allergens")
          .insert(allergenAssignments);

        if (assignmentError) throw assignmentError;
      }

      // Find category for the new item
      const category = categories.find((c) => c.id === newItem.category_id);
      const itemAllergens = allergens.filter((a) =>
        newItem.allergen_ids.includes(a.id)
      );

      // Create new menu item for state
      const newMenuItem: MenuItem = {
        id: item.id,
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category_id: newItem.category_id,
        image_url: null,
        image_path: null,
        active: newItem.active,
        category: category || null,
        allergens: itemAllergens,
      };

      // Update state and cleanup
      setItems((prev) => [...prev, newMenuItem]);
      setIsDialogOpen(false);
      setNewItem({
        name: "",
        description: "",
        price: "",
        category_id: "",
        active: true,
        allergen_ids: [],
      });

      toast({
        title: "Success",
        description: "Menu item created successfully",
      });
    } catch (error) {
      console.error("Error creating item:", error);
      toast({
        title: "Error",
        description: "Failed to create menu item",
        variant: "destructive",
      });
    }
  };

  // Filter items based on selected category
  const filteredItems =
    selectedFilter === "all"
      ? items
      : items.filter(
          (item) =>
            item.category?.id === selectedFilter ||
            item.category_id === selectedFilter
        );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (!items.length) {
    return (
      <div className="container p-6">
        <Alert>
          <AlertDescription>No menu items found.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => setIsDialogOpen(true)}>
            Add Your First Item
          </Button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="container p-6">
      <PageHeader
        heading="Menu Items"
        text="Manage your restaurant's menu selection"
      >
        <div className="flex items-center gap-4">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col bg-white border border-neutral-100 rounded-sm p-6 hover:shadow-sm"
          >
            <div className="relative w-full pb-[100%] mb-4">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover rounded-sm"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/placeholder.webp`;
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center rounded-sm">
                  <span className="text-neutral-400">No image</span>
                </div>
              )}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
              {item.category?.name}
            </div>
            <h3 className="text-lg font-medium mb-2">{item.name}</h3>
            <p className="text-sm text-neutral-600 mb-4">{item.description}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {item.allergens?.map((allergen) => (
                <Badge
                  key={allergen.id}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-neutral-100"
                >
                  {allergen.name}
                </Badge>
              ))}
            </div>
            <div className="mt-auto font-medium text-lg">
              ${item.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>
              Create a new menu item with details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newItem.category_id}
                onValueChange={(value) =>
                  setNewItem({ ...newItem, category_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateItem}>Create Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
