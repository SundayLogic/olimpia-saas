"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { Plus, Search, Edit } from "lucide-react"; // Added 'Edit' icon
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
import type { PostgrestError } from "@supabase/postgrest-js"; // Added type import
import { MultiSelect } from "@/components/ui/multi-select"; // Imported MultiSelect

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
  category_id: number; // Changed to number to match Database type
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
  category_id: number; // Changed to number
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

// Updated Types for Edit Functionality
interface EditDialogState {
  open: boolean;
  item: MenuItem | null;
}

interface EditFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  allergen_ids: string[];
}

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

  // Add search state
  const [searchTerm, setSearchTerm] = useState("");

  // Add state for Edit Functionality
  const [editDialog, setEditDialog] = useState<EditDialogState>({
    open: false,
    item: null,
  });

  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    description: "",
    price: "",
    category_id: "",
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

  // Add highlight text function
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-orange-500 text-white">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Consolidate fetchData function with useCallback
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [allergensResponse, categoriesResponse, itemsResponse] = await Promise.all([
        supabase.from("allergens").select("*").order("name"),
        supabase.from("menu_categories").select("*").order("name"),
        supabase
          .from("menu_items")
          .select(`
            id,
            name,
            description,
            price,
            category_id,
            image_path,
            active,
            menu_categories (id, name),
            menu_item_allergens (
              allergens (id, name)
            )
          `)
          .order("name"),
      ]);

      // Add error handling
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
      // Define the type guard
      const isPostgrestError = (error: unknown): error is PostgrestError =>
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error;

      if (isPostgrestError(error)) {
        console.error("Database error:", error);
        toast({
          title: "Database Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        console.error("Application error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.error("Unknown error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      setError("Failed to load menu items");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);

  // Call fetchData inside useEffect
  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Filter items with search and category filter
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Apply search filter
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearchTerm) ||
          item.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply category filter
    if (selectedFilter !== "all") {
      const parsedFilter = parseInt(selectedFilter);
      filtered = filtered.filter(
        (item) =>
          item.category?.id === selectedFilter ||
          item.category_id === parsedFilter
      );
    }

    return filtered;
  }, [items, selectedFilter, searchTerm]);

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

      // Validate price
      const priceValue = parseFloat(newItem.price);
      if (isNaN(priceValue) || priceValue < 0) {
        toast({
          title: "Error",
          description: "Please enter a valid positive price.",
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
          price: priceValue,
          category_id: parseInt(newItem.category_id), // Convert to number
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
        price: priceValue,
        category_id: parseInt(newItem.category_id), // Convert to number
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
      // Define the type guard
      const isPostgrestError = (error: unknown): error is PostgrestError =>
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error;

      if (isPostgrestError(error)) {
        console.error("Database error:", error);
        toast({
          title: "Database Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        console.error("Application error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.error("Unknown error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      console.error("Error creating item:", error);
      setError("Failed to create menu item");
    }
  };

  // Handler to open the edit dialog with the selected menu item's data
  const handleEdit = useCallback((item: MenuItem) => {
    setEditForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category_id: item.category_id.toString(),
      allergen_ids: item.allergens?.map((a) => a.id) || [],
    });
    setEditDialog({ open: true, item });
  }, []);

  // Handler to save the edited menu item
  const handleSaveEdit = useCallback(async () => {
    if (!editDialog.item) return;

    try {
      // Validation
      if (!editForm.name || !editForm.category_id || !editForm.price) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const priceValue = parseFloat(editForm.price);
      if (isNaN(priceValue) || priceValue < 0) {
        toast({
          title: "Error",
          description: "Please enter a valid positive price.",
          variant: "destructive",
        });
        return;
      }

      const categoryId = parseInt(editForm.category_id);
      if (isNaN(categoryId)) {
        toast({
          title: "Error",
          description: "Please select a valid category.",
          variant: "destructive",
        });
        return;
      }

      // Update menu item details
      const { error: itemError } = await supabase
        .from("menu_items")
        .update({
          name: editForm.name,
          description: editForm.description,
          price: priceValue,
          category_id: categoryId,
        })
        .eq("id", editDialog.item.id);

      if (itemError) throw itemError;

      // Update allergen assignments
      // First, delete existing assignments
      const { error: deleteError } = await supabase
        .from("menu_item_allergens")
        .delete()
        .eq("menu_item_id", editDialog.item.id);

      if (deleteError) throw deleteError;

      // Then, insert new assignments if any
      if (editForm.allergen_ids.length > 0) {
        const allergenAssignments = editForm.allergen_ids.map((allergenId) => ({
          menu_item_id: editDialog.item!.id,
          allergen_id: allergenId,
        }));

        const { error: assignmentError } = await supabase
          .from("menu_item_allergens")
          .insert(allergenAssignments);

        if (assignmentError) throw assignmentError;
      }

      // Refresh data
      await fetchData();
      toast({
        title: "Success",
        description: "Menu item updated successfully.",
      });
      setEditDialog({ open: false, item: null });
    } catch (error) {
      // Define the type guard
      const isPostgrestError = (error: unknown): error is PostgrestError =>
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error;

      if (isPostgrestError(error)) {
        console.error("Database error:", error);
        toast({
          title: "Database Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        console.error("Application error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.error("Unknown error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      console.error("Error updating menu item:", error);
      setError("Failed to update menu item");
    }
  }, [editDialog.item, editForm, supabase, toast, fetchData]);

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
      {/* Page Header */}
      <PageHeader
        heading="Menu Items"
        text="Manage your restaurant's menu selection"
      >
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </PageHeader>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative w-full md:w-[300px]">
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Category filter */}
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[180px]">
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
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 relative">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col bg-white border border-neutral-100 rounded-sm p-6 hover:shadow-sm"
          >
            {/* Add Edit Button */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(item)}
                className="h-8 w-8 p-0"
                aria-label={`Edit ${item.name}`}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            {/* Image */}
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

            {/* Category */}
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
              {item.category?.name}
            </div>

            {/* Name */}
            {item.name && (
              <h3 className="text-lg font-medium mb-2">
                {highlightText(item.name, searchTerm)}
              </h3>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-sm text-neutral-600 mb-4">
                {highlightText(item.description, searchTerm)}
              </p>
            )}

            {/* Allergens */}
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

            {/* Price */}
            <div className="mt-auto font-medium text-lg">
              ${item.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Add Menu Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>Create a new menu item with details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                placeholder="Menu item name"
              />
            </div>
            {/* Price Field */}
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
                placeholder="0.00"
              />
            </div>
            {/* Category Selection */}
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={newItem.category_id}
                onValueChange={(value: string) =>
                  setNewItem({ ...newItem, category_id: value })
                }
              >
                <SelectTrigger className="w-full">
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
            {/* Description Field */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                placeholder="Menu item description"
              />
            </div>
            {/* Allergen Selection */}
            <div className="grid gap-2">
              <Label>Allergens</Label>
              <MultiSelect
                options={allergens}
                selected={newItem.allergen_ids}
                onChange={(selectedIds: string[]) =>
                  setNewItem({ ...newItem, allergen_ids: selectedIds })
                }
                placeholder="Select allergens"
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

      {/* Edit Menu Item Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => !open && setEditDialog({ open: false, item: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details of the selected menu item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Menu item name"
              />
            </div>
            {/* Description Field */}
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Menu item description"
              />
            </div>
            {/* Price Field */}
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            {/* Category Selection */}
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={editForm.category_id}
                onValueChange={(value: string) =>
                  setEditForm({ ...editForm, category_id: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      disabled={editForm.category_id === category.id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Allergen Selection */}
            <div className="grid gap-2">
              <Label>Allergens</Label>
              <MultiSelect
                options={allergens}
                selected={editForm.allergen_ids}
                onChange={(selectedIds: string[]) =>
                  setEditForm({ ...editForm, allergen_ids: selectedIds })
                }
                placeholder="Select allergens"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, item: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
