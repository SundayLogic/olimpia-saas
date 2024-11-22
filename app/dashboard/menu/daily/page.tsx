"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Plus, Calendar, ToggleLeft } from "lucide-react";
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

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

interface DailyMenuItem {
  menu_items: MenuItem;
}

interface DailyMenu {
  id: number;
  date: string;
  price: number;
  active: boolean;
  created_at: string;
  daily_menu_items: DailyMenuItem[];
}

interface NewMenu {
  date: string;
  price: string;
  active: boolean;
  selectedItems: string[];
}

export default function DailyMenuPage() {
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMenu, setNewMenu] = useState<NewMenu>({
    date: new Date().toISOString().split('T')[0],
    price: '',
    active: true,
    selectedItems: []
  });

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch menu items for selection
        const { data: itemsData, error: itemsError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('active', true)
          .order('name');

        if (itemsError) throw itemsError;

        // Fetch daily menus
        const { data: menusData, error: menusError } = await supabase
          .from('daily_menus')
          .select(`
            *,
            daily_menu_items (
              menu_items (
                id,
                name,
                description,
                price
              )
            )
          `)
          .order('date', { ascending: false });

        if (menusError) throw menusError;

        setMenuItems(itemsData || []);
        setDailyMenus(menusData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load daily menus');
        toast({
          title: "Error",
          description: "Failed to load daily menus",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supabase, toast]);

  const handleCreateMenu = async () => {
    try {
      if (!newMenu.date || !newMenu.price || newMenu.selectedItems.length === 0) {
        toast({
          title: "Error",
          description: "Please fill in all required fields and select at least one item",
          variant: "destructive",
        });
        return;
      }

      const { data: menuData, error: menuError } = await supabase
        .from('daily_menus')
        .insert({
          date: newMenu.date,
          price: parseFloat(newMenu.price),
          active: newMenu.active,
        })
        .select()
        .single();

      if (menuError) throw menuError;

      const menuItemAssociations = newMenu.selectedItems.map(itemId => ({
        daily_menu_id: menuData.id,
        menu_item_id: itemId
      }));

      const { error: associationError } = await supabase
        .from('daily_menu_items')
        .insert(menuItemAssociations);

      if (associationError) throw associationError;

      const { data: updatedMenu, error: fetchError } = await supabase
        .from('daily_menus')
        .select(`
          *,
          daily_menu_items (
            menu_items (
              id,
              name,
              description,
              price
            )
          )
        `)
        .eq('id', menuData.id)
        .single();

      if (fetchError) throw fetchError;

      setDailyMenus(prev => [updatedMenu, ...prev]);
      setIsDialogOpen(false);
      setNewMenu({
        date: new Date().toISOString().split('T')[0],
        price: '',
        active: true,
        selectedItems: []
      });

      toast({
        title: "Success",
        description: "Daily menu created successfully",
      });
    } catch (error) {
      console.error('Error creating daily menu:', error);
      toast({
        title: "Error",
        description: "Failed to create daily menu",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleMenuStatus = async (menuId: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('daily_menus')
        .update({ active: !currentStatus })
        .eq('id', menuId);

      if (error) throw error;

      setDailyMenus(prev =>
        prev.map(menu =>
          menu.id === menuId ? { ...menu, active: !currentStatus } : menu
        )
      );

      toast({
        title: "Success",
        description: `Menu ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling menu status:', error);
      toast({
        title: "Error",
        description: "Failed to update menu status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container p-6">
      <PageHeader
        heading="Daily Menus"
        text="Manage your restaurant's daily menus"
      >
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Daily Menu
        </Button>
      </PageHeader>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : dailyMenus.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No daily menus found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {dailyMenus.map((menu) => (
            <div
              key={menu.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(menu.date)}
                    </h3>
                    <Badge className="mt-2" variant={menu.active ? "success" : "secondary"}>
                      {menu.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMenuStatus(menu.id, menu.active)}
                    >
                      <ToggleLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-lg font-bold mb-2">
                    Price: ${menu.price.toFixed(2)}
                  </div>
                  <div className="space-y-2">
                    {menu.daily_menu_items?.map(({ menu_items }) => (
                      <div key={menu_items.id} className="text-sm">
                        • {menu_items.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Daily Menu</DialogTitle>
            <DialogDescription>
              Create a new daily menu by selecting the date, price, and menu items.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newMenu.date}
                onChange={(e) => setNewMenu({ ...newMenu, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newMenu.price}
                onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label>Menu Items</Label>
              <Select
                value={newMenu.selectedItems[0] || ''}
                onValueChange={(value) => 
                  setNewMenu({ 
                    ...newMenu, 
                    selectedItems: [...newMenu.selectedItems, value] 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select items" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map((item) => (
                    <SelectItem 
                      key={item.id} 
                      value={item.id}
                      disabled={newMenu.selectedItems.includes(item.id)}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {newMenu.selectedItems.map((itemId) => {
                  const item = menuItems.find(i => i.id === itemId);
                  return item ? (
                    <Badge 
                      key={item.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {item.name}
                      <button
                        type="button"
                        onClick={() => setNewMenu({
                          ...newMenu,
                          selectedItems: newMenu.selectedItems.filter(id => id !== itemId)
                        })}
                        className="ml-1 hover:text-destructive"
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
            <Button onClick={handleCreateMenu}>
              Create Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}