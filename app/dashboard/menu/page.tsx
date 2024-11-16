"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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

interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: {
    id: string;
  };
}

interface LoadingState {
  auth: boolean;
  categories: boolean;
  allergens: boolean;
  menuItems: boolean;
  wines: boolean;
}

interface ErrorState {
  auth?: string;
  categories?: string;
  allergens?: string;
  menuItems?: string;
  wines?: string;
}

export default function MenuPage() {
  // State
  const [activeTab, setActiveTab] = useState<TabType>("menu");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Loading and Error States
  const [loadingState, setLoadingState] = useState<LoadingState>({
    auth: true,
    categories: true,
    allergens: true,
    menuItems: true,
    wines: true
  });
  const [errorState, setErrorState] = useState<ErrorState>({});

  // Data states
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);

  const { toast } = useToast();
  const supabase = createClientComponentClient();

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) throw authError;
        if (!session) throw new Error('No authenticated session');
        
        console.log('Auth successful:', session.user.email);
        setLoadingState(prev => ({ ...prev, auth: false }));
        
      } catch (error) {
        console.error('Auth error:', error);
        setErrorState(prev => ({
          ...prev,
          auth: error instanceof Error ? error.message : 'Authentication failed'
        }));
        setLoadingState(prev => ({ ...prev, auth: false }));
      }
    };

    checkAuth();
  }, [supabase.auth]);

  // Data fetching
  useEffect(() => {
    const loadData = async () => {
      if (errorState.auth) return; // Don't load data if auth failed

      const fetchData = async <T,>(
        key: keyof LoadingState,
        fetcher: () => Promise<T>,
        setter: (data: T) => void
      ) => {
        try {
          setLoadingState(prev => ({ ...prev, [key]: true }));
          const data = await fetcher();
          setter(data);
          setLoadingState(prev => ({ ...prev, [key]: false }));
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
          setErrorState(prev => ({
            ...prev,
            [key]: error instanceof Error ? error.message : `Failed to load ${key}`
          }));
          setLoadingState(prev => ({ ...prev, [key]: false }));
        }
      };

      await Promise.all([
        fetchData('categories', getCategories, setCategories),
        fetchData('allergens', getAllergens, setAllergens),
        fetchData('menuItems', getMenuItems, setMenuItems),
        fetchData('wines', getWines, setWines)
      ]);
    };

    loadData();
  }, [errorState.auth]);

  // Realtime subscriptions
  useEffect(() => {
    if (Object.keys(errorState).length > 0) return; // Don't subscribe if there are errors

    const menuUnsubscribe = subscribeToMenuChanges((payload: RealtimePayload<MenuItem>) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      setMenuItems(current => {
        switch (eventType) {
          case 'INSERT':
            return [...current, newRecord];
          case 'UPDATE':
            return current.map(item => item.id === oldRecord.id ? newRecord : item);
          case 'DELETE':
            return current.filter(item => item.id !== oldRecord.id);
          default:
            return current;
        }
      });
    });

    const wineUnsubscribe = subscribeToWineChanges((payload: RealtimePayload<Wine>) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      setWines(current => {
        switch (eventType) {
          case 'INSERT':
            return [...current, newRecord];
          case 'UPDATE':
            return current.map(wine => wine.id === oldRecord.id ? newRecord : wine);
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
  }, [errorState]);

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

  // CRUD handlers
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
        description: "Failed to create item",
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
      setEditingId(null);
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
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
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  // Auth error state
  if (errorState.auth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Authentication Error</p>
          <p className="text-gray-600 mb-4">{errorState.auth}</p>
          <Button onClick={() => window.location.href = '/login'}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  // General loading state
  const isLoading = Object.values(loadingState).some(Boolean);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading menu data...</p>
        </div>
      </div>
    );
  }

  // Any other error state
  const hasErrors = Object.keys(errorState).length > 0;
  if (hasErrors) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Error Loading Data</p>
          <p className="text-gray-600 mb-4">
            {Object.values(errorState).filter(Boolean).join(', ')}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
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
              No items found
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}