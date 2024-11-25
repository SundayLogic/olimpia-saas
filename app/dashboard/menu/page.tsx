"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from "next/image"; // **Added Image Import**
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
import { Alert, AlertDescription } from "@/components/ui/alert"; // **Ensured Alert Import**
import { PageHeader } from "@/components/core/layout";
import { Badge } from "@/components/ui/badge"; // Ensure Badge component exists

// **1. Type Definitions**

type Allergen = {
  id: number;
  name: string;
};

type MenuItemWithRelations = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string | null;
  image_alt: string | null; // **Added image_alt**
  image_path: string | null; // **Added image_path**
  active: boolean;
  menu_categories: {
    id: number;
    name: string;
  };
  menu_item_allergens: {
    allergens: Allergen;
  }[];
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string | null;
  image_alt: string | null; // **Added image_alt**
  image_path: string | null; // **Added image_path**
  active: boolean;
  category?: {
    id: number;
    name: string;
  };
  allergens?: Allergen[]; // Added allergens
};

type Category = {
  id: number;
  name: string;
};

// Updated NewMenuItem type to include allergen_ids
type NewMenuItem = {
  name: string;
  description: string;
  price: string;
  category_id: string;
  active: boolean;
  allergen_ids: number[]; // Added allergen IDs for selection
};

export default function MenuPage() {
  // **2. State Management**

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]); // Added allergens state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<NewMenuItem>({
    name: '',
    description: '',
    price: '',
    category_id: '',
    active: true,
    allergen_ids: [], // Initialized allergen_ids
  });
  const [selectedFilter, setSelectedFilter] = useState<string>('all'); // Added filter state

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // **3. Data Fetching with useEffect**

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories') // Ensure this table name matches your Supabase schema
          .select('*')
          .order('name');

        if (categoriesError) throw categoriesError;

        // Fetch allergens
        const { data: allergensData, error: allergensError } = await supabase
          .from('allergens')
          .select('*')
          .order('name');

        if (allergensError) throw allergensError;

        // Fetch menu items with allergens and categories
        const { data: itemsData, error: itemsError } = await supabase
          .from('menu_items')
          .select(`
            *,
            menu_categories!inner(*),
            menu_item_allergens!inner(
              allergens(*)
            )
          `)
          .order('name');

        if (itemsError) throw itemsError;

        // **Debug the data**
        console.log('Raw items data:', itemsData);

        // Map fetched items to include allergens and category
        setItems(
          (itemsData as MenuItemWithRelations[])?.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category_id: item.category_id,
            image_url: item.image_url,
            image_alt: item.image_alt, // **Added image_alt**
            image_path: item.image_path, // **Added image_path**
            active: item.active,
            category: item.menu_categories,
            allergens: item.menu_item_allergens?.map(relation => relation.allergens) || []
          })) || []
        );

        setCategories(categoriesData || []);
        setAllergens(allergensData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load menu items');
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

  // **4. Handle Create Item with Allergens**

  const handleCreateItem = async () => {
    try {
      // Basic validation
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
        .from('menu_items')
        .insert({
          name: newItem.name,
          description: newItem.description,
          price: parseFloat(newItem.price),
          category_id: parseInt(newItem.category_id),
          active: newItem.active,
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Create allergen assignments if any
      if (newItem.allergen_ids.length > 0) {
        const allergenAssignments = newItem.allergen_ids.map(allergenId => ({
          menu_item_id: item.id,
          allergen_id: allergenId,
        }));

        const { error: assignmentError } = await supabase
          .from('menu_item_allergens')
          .insert(allergenAssignments);

        if (assignmentError) throw assignmentError;
      }

      // Optimistically update the UI
      const newMenuItem: MenuItem = {
        id: item.id,
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category_id: parseInt(newItem.category_id),
        image_url: null, // Assuming no image upload in this flow
        image_alt: null, // **Set to null or handle as needed**
        image_path: null, // **Set to null or handle as needed**
        active: newItem.active,
        category: categories.find(c => c.id === parseInt(newItem.category_id)),
        allergens: allergens.filter(a => newItem.allergen_ids.includes(a.id)),
      };

      setItems(prev => [...prev, newMenuItem]);

      setIsDialogOpen(false);
      setNewItem({
        name: '',
        description: '',
        price: '',
        category_id: '',
        active: true,
        allergen_ids: [],
      });

      toast({
        title: "Success",
        description: "Menu item created successfully",
      });
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "Failed to create menu item",
        variant: "destructive",
      });
    }
  };

  // **5. Filtering Logic**

  const filteredItems = selectedFilter === 'all'
    ? items
    : items.filter(item => item.category_id === parseInt(selectedFilter));

  // **6. Error Boundaries and Loading States**
  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  // **Replaced the error return statement**
  if (error) return (
    <div className="container p-6">
      <Alert>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );

  // **Replaced the no items return statement**
  if (!items.length) return (
    <div className="container p-6">
      <Alert>
        <AlertDescription>No menu items found.</AlertDescription>
      </Alert>
      <div className="mt-4">
        <Button onClick={() => setIsDialogOpen(true)}>Add Your First Item</Button>
      </div>
    </div>
  );

  return (
    <div className="container p-6">
      {/* **7. Updated PageHeader with Filter Controls and Add Button** */}
      <PageHeader
        heading="Menu Items"
        text="Manage your restaurant's menu selection"
      >
        <div className="flex items-center gap-4">
          {/* **Filter Controls** */}
          <Select
            value={selectedFilter}
            onValueChange={setSelectedFilter}
          >
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* **Add Item Button** */}
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </PageHeader>

      {/* **8. Menu Items Grid** */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col bg-white border border-neutral-100 rounded-sm transition-all duration-300 ease-in-out p-6 hover:shadow-sm"
          >
            {/* **a. Image Container with Fixed Proportions** */}
            <div className="relative w-full pb-[100%] mb-4"> {/* Square aspect ratio container */}
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.image_alt || item.name}
                  fill
                  className="object-cover rounded-sm" // Changed from object-contain to object-cover
                  sizes="(max-width: 640px) 100vw, 
                         (max-width: 1024px) 50vw, 
                         (max-width: 1536px) 33vw,
                         25vw"
                  priority={false}
                  loading="lazy"
                  onError={(e) => {
                    console.error('Image load error for:', item.name, item.image_url);
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

            {/* **c. Category Label** */}
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
              {item.category?.name}
            </div>

            {/* **d. Item Name** */}
            <h3 className="text-lg font-medium mb-2 line-clamp-2">
              {item.name}
            </h3>

            {/* **e. Description** */}
            <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
              {item.description}
            </p>

            {/* **f. Allergens with Improved Styling** */}
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

            {/* **g. Price** */}
            <div className="mt-auto font-medium text-lg">
              ${item.price.toFixed(2)}
            </div>

            {/* **h. Actions** */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs rounded-sm"
              >
                {item.active ? "Available" : "Unavailable"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* **9. Add Item Dialog with Updated Form Layout** */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Add Menu Item</DialogTitle>
            <DialogDescription className="text-neutral-600">
              Create a new item for your menu
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* **a. Name and Description** */}
            <div className="space-y-4">
              {/* **Name Input** */}
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  className="h-9"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item name"
                />
              </div>

              {/* **Description Input** */}
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Input
                  id="description"
                  className="h-9"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Item description"
                />
              </div>
            </div>

            {/* **b. Price and Category** */}
            <div className="grid grid-cols-2 gap-4">
              {/* **Price Input** */}
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  className="h-9"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              {/* **Category Select** */}
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                <Select
                  value={newItem.category_id}
                  onValueChange={(value) => setNewItem({ ...newItem, category_id: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* **c. Allergens** */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Allergens</Label>
              <Select
                onValueChange={(value) => {
                  const allergenId = parseInt(value);
                  if (allergenId && !newItem.allergen_ids.includes(allergenId)) {
                    setNewItem({
                      ...newItem,
                      allergen_ids: [...newItem.allergen_ids, allergenId],
                    });
                  }
                }}
                // Since multiple selection isn't directly supported, handle single selection and add to the list
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select allergens" />
                </SelectTrigger>
                <SelectContent>
                  {allergens.map((allergen) => (
                    <SelectItem
                      key={allergen.id}
                      value={allergen.id.toString()}
                      disabled={newItem.allergen_ids.includes(allergen.id)}
                    >
                      {allergen.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* **Display Selected Allergens** */}
              <div className="flex flex-wrap gap-2 mt-2">
                {newItem.allergen_ids.map((allergenId) => {
                  const allergen = allergens.find((a) => a.id === allergenId);
                  return allergen ? (
                    <Badge
                      key={allergen.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {allergen.name}
                      <button
                        type="button"
                        onClick={() =>
                          setNewItem({
                            ...newItem,
                            allergen_ids: newItem.allergen_ids.filter(
                              (id) => id !== allergenId
                            ),
                          })
                        }
                        className="ml-1 hover:text-destructive"
                        aria-label={`Remove ${allergen.name}`}
                      >
                        ×
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateItem}>
              Create Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
