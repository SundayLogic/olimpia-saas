// app/dashboard/daily-menu/page.tsx
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { DailyMenuEditor } from "@/components/daily-menu/DailyMenuEditor";
import { MenuList } from "@/components/daily-menu/MenuList";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

export default function DailyMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('daily_menu')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      setMenuItems(data || []);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsEditing(true);
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleSave = async (item: Partial<MenuItem>) => {
    try {
      if (selectedItem?.id) {
        // Update existing item
        const { error } = await supabase
          .from('daily_menu')
          .update(item)
          .eq('id', selectedItem.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Menu item updated successfully",
        });
      } else {
        // Insert new item
        const { error } = await supabase
          .from('daily_menu')
          .insert([item]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Menu item added successfully",
        });
      }

      setIsEditing(false);
      loadMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('daily_menu')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });

      loadMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Daily Menu Management</h1>
        <p className="text-muted-foreground">
          Manage your restaurant&apos;s daily menu items
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Menu Items</CardTitle>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Item
            </Button>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <DailyMenuEditor
                item={selectedItem}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <MenuList
                items={menuItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}