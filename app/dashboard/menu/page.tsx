"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MenuList, MenuSearch, MenuItem } from "@/components/features/menu";

type MenuItemAllergen = {
  allergens: {
    id: number;
    name: string;
  };
};

type MenuItemResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string | null;
  active: boolean;
  categories: {
    id: number;
    name: string;
  } | null;
  menu_item_allergens: MenuItemAllergen[];
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
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
          .select('name')
          .order('name');

        if (categoriesError) throw categoriesError;

        // Fetch menu items
        const { data: itemsData, error: itemsError } = await supabase
          .from('menu_items')
          .select(`
            *,
            categories (id, name),
            menu_item_allergens (
              allergens (id, name)
            )
          `)
          .order('name');

        if (itemsError) throw itemsError;

        // Transform categories data to array of strings
        const categoryNames = (categoriesData ?? []).map((cat) => cat.name);
        setCategories(categoryNames);

        // Transform menu items data
        const transformedItems: MenuItem[] = (itemsData ?? []).map((item: MenuItemResponse) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category_id: item.category_id,
          category: item.categories?.name ?? '',
          image_url: item.image_url,
          allergens: item.menu_item_allergens.map((allergen) => allergen.allergens.name),
          active: item.active
        }));
        
        setItems(transformedItems);
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
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle edit item
  const handleEditItem = (item: MenuItem) => {
    toast({
      title: "Coming Soon",
      description: `Edit functionality for "${item.name}" is under development`,
    });
  };

  // Handle delete item
  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  // Handle new item creation
  const handleCreateItem = () => {
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
            Manage your restaurant&apos;s menu items
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
          onFilter={setSelectedCategory}
          categories={categories}
        />
        <MenuList
          items={filteredItems}
          isLoading={isLoading}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      </div>
    </div>
  );
}