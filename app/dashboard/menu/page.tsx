"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MenuList from "@/components/features/menu/MenuList";
import MenuSearch from "@/components/features/menu/MenuSearch";
import type { MenuItem, Category } from "@/types/menu";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Fetch menu items and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (categoriesError) throw categoriesError;

        // Fetch menu items
        const { data: itemsData, error: itemsError } = await supabase
          .from('menu_items')
          .select(`
            *,
            categories (id, name),
            menu_item_allergens (
              allergen_id,
              allergens (id, name)
            )
          `)
          .order('name');

        if (itemsError) throw itemsError;

        setCategories(categoriesData);
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle new item creation
  const handleCreateItem = async () => {
    // Implementation will be added later
    toast({
      title: "Coming Soon",
      description: "This feature is under development",
    });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Menu Items</h1>
          <p className="text-muted-foreground mt-2">
            Manage your restaurant's menu items
          </p>
        </div>
        <Button onClick={handleCreateItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        <MenuSearch
          onSearch={setSearchQuery}
          onCategoryFilter={setSelectedCategory}
          categories={categories}
        />

        <MenuList
          items={filteredItems}
          isLoading={isLoading}
          categories={categories}
        />
      </div>
    </div>
  );
}