"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import MenuNav from "@/components/menu/MenuNav";
import MenuSearch from "@/components/menu/MenuSearch";
import MenuCard from "@/components/menu/MenuCard";
import type { 
  MenuItem, 
  Wine, 
  Category, 
  Allergen,
  MenuItemFormData,
  WineFormData 
} from "@/types/menu";

import {
  getMenuItems,
  getWines,
  getCategories,
  getAllergens,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createWine,
  updateWine,
  deleteWine,
  subscribeToMenuChanges,
  subscribeToWineChanges,
} from "@/lib/supabase/menu";

type TabType = 'menu' | 'wine';

type EditFormData = {
  menu: MenuItemFormData;
  wine: WineFormData;
}[TabType];

// Define types for real-time subscription payloads
interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: {
    id: string;
  };
}

export default function MenuPage() {
  // State
  const [activeTab, setActiveTab] = useState<TabType>("menu");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data states
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);

  const { toast } = useToast();

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [menuData, wineData, categoryData, allergenData] = await Promise.all([
          getMenuItems(),
          getWines(),
          getCategories(),
          getAllergens(),
        ]);

        setMenuItems(menuData);
        setWines(wineData);
        setCategories(categoryData);
        setAllergens(allergenData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [toast]);

  // Real-time updates
  useEffect(() => {
    const menuUnsubscribe = subscribeToMenuChanges((payload: RealtimePayload<MenuItem>) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      setMenuItems((current) => {
        switch (eventType) {
          case 'INSERT':
            return [...current, newRecord];
          case 'UPDATE':
            return current.map(item => 
              item.id === oldRecord.id ? newRecord : item
            );
          case 'DELETE':
            return current.filter(item => item.id !== oldRecord.id);
          default:
            return current;
        }
      });
    });

    const wineUnsubscribe = subscribeToWineChanges((payload: RealtimePayload<Wine>) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      setWines((current) => {
        switch (eventType) {
          case 'INSERT':
            return [...current, newRecord];
          case 'UPDATE':
            return current.map(wine => 
              wine.id === oldRecord.id ? newRecord : wine
            );
          case 'DELETE':
            return current.filter(wine => wine.id !== oldRecord.id);
          default:
            return current;
        }
      });
    });

    return () => {
      menuUnsubscribe();
      wineUnsubscribe();
    };
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    const items = activeTab === "menu" ? menuItems : wines;
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || item.category_id === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeTab, menuItems, wines, searchQuery, activeCategory]);

  // Handlers
  const handleCreate = async () => {
    try {
      if (activeTab === "menu") {
        const newItem = await createMenuItem({
          name: "Nuevo plato",
          description: "Descripción del plato",
          price: 0,
          category_id: activeCategory || categories[0]?.id,
          image_path: "",
          allergens: [],
        });
        setEditingId(newItem.id);
      } else {
        const newWine = await createWine({
          name: "Nuevo vino",
          description: "Descripción del vino",
          price: 0,
          category_id: activeCategory || categories[0]?.id,
          image_path: "",
        });
        setEditingId(newWine.id);
      }
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el elemento",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (id: string, data: EditFormData) => {
    try {
      if (activeTab === "menu") {
        await updateMenuItem(id, data as MenuItemFormData);
      } else {
        await updateWine(id, data as WineFormData);
      }
      toast({
        title: "Éxito",
        description: "Elemento actualizado correctamente",
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el elemento",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (activeTab === "menu") {
        await deleteMenuItem(id);
      } else {
        await deleteWine(id);
      }
      toast({
        title: "Éxito",
        description: "Elemento eliminado correctamente",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el elemento",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs 
        value={activeTab} 
        onValueChange={(value: string) => setActiveTab(value as TabType)}
      >
        <div className="sticky top-0 z-50 bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="menu">Carta</TabsTrigger>
                <TabsTrigger value="wine">Vinos</TabsTrigger>
              </TabsList>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                {activeTab === "menu" ? "Nuevo plato" : "Nuevo vino"}
              </Button>
            </div>
            <MenuSearch
              onSearch={setSearchQuery}
              onCategoryFilter={setActiveCategory}
              categories={categories.filter(cat => 
                activeTab === "menu" ? !cat.name.toLowerCase().includes('vino') : cat.name.toLowerCase().includes('vino')
              )}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <MenuNav
            categories={categories.filter(cat => 
              activeTab === "menu" ? !cat.name.toLowerCase().includes('vino') : cat.name.toLowerCase().includes('vino')
            )}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            type={activeTab}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  type={activeTab}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  categories={categories}
                  allergens={activeTab === "menu" ? allergens : undefined}
                  isEditing={editingId === item.id}
                  onEditToggle={setEditingId}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No se encontraron elementos
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}