"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Plus, Wine, ToggleLeft } from "lucide-react";
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

interface WineCategoryAssignment {
  wine_categories: {
    id: number;
    name: string;
    display_order: number;
  };
}

interface WineResponse {
  id: number;
  name: string;
  description: string;
  bottle_price: number;
  glass_price: number;
  active: boolean;
  created_at: string;
  wine_category_assignments: WineCategoryAssignment[];
}

interface WineCategory {
  id: number;
  name: string;
  display_order: number;
}

interface Wine {
  id: number;
  name: string;
  description: string;
  bottle_price: number;
  glass_price: number | null;
  active: boolean;
  created_at: string;
  categories: WineCategory[];
}

interface NewWine {
  name: string;
  description: string;
  bottle_price: string;
  glass_price: string;
  category_ids: number[];
  active: boolean;
}

export default function WinePage() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [categories, setCategories] = useState<WineCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWine, setNewWine] = useState<NewWine>({
    name: '',
    description: '',
    bottle_price: '',
    glass_price: '',
    category_ids: [],
    active: true
  });

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch wine categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('wine_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) throw categoriesError;

      // Fetch wines with their categories
      const { data: winesData, error: winesError } = await supabase
        .from('wines')
        .select(`
          *,
          wine_category_assignments (
            wine_categories (
              id,
              name,
              display_order
            )
          )
        `)
        .order('name');

      if (winesError) throw winesError;

      // Transform the data to match our interface
      const transformedWines: Wine[] = (winesData as WineResponse[])?.map(wine => ({
        id: wine.id,
        name: wine.name,
        description: wine.description,
        bottle_price: wine.bottle_price,
        glass_price: wine.glass_price,
        active: wine.active,
        created_at: wine.created_at,
        categories: wine.wine_category_assignments.map(
          assignment => assignment.wine_categories
        )
      }));

      setCategories(categoriesData || []);
      setWines(transformedWines || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load wines');
      toast({
        title: "Error",
        description: "Failed to load wines",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateWine = async () => {
    try {
      if (!newWine.name || !newWine.bottle_price) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // First, create the wine
      const { data: wine, error: wineError } = await supabase
        .from('wines')
        .insert({
          name: newWine.name,
          description: newWine.description,
          bottle_price: parseFloat(newWine.bottle_price),
          glass_price: newWine.glass_price ? parseFloat(newWine.glass_price) : null,
          active: newWine.active
        })
        .select()
        .single();

      if (wineError) throw wineError;

      // Then create category assignments if there are any
      if (newWine.category_ids.length > 0) {
        const categoryAssignments = newWine.category_ids.map(categoryId => ({
          wine_id: wine.id,
          category_id: categoryId
        }));

        const { error: assignmentError } = await supabase
          .from('wine_category_assignments')
          .insert(categoryAssignments);

        if (assignmentError) throw assignmentError;
      }

      await fetchData(); // Refresh the data
      setIsDialogOpen(false);
      setNewWine({
        name: '',
        description: '',
        bottle_price: '',
        glass_price: '',
        category_ids: [],
        active: true
      });

      toast({
        title: "Success",
        description: "Wine added successfully",
      });
    } catch (error) {
      console.error('Error creating wine:', error);
      toast({
        title: "Error",
        description: "Failed to create wine",
        variant: "destructive",
      });
    }
  };

  const toggleWineStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('wines')
        .update({ active: !currentStatus })
        .eq('id', id);

      if (updateError) throw updateError;

      setWines(prev =>
        prev.map(wine =>
          wine.id === id ? { ...wine, active: !currentStatus } : wine
        )
      );

      toast({
        title: "Success",
        description: `Wine ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling wine status:', error);
      toast({
        title: "Error",
        description: "Failed to update wine status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container p-6">
      <PageHeader
        heading="Wine List"
        text="Manage your restaurant's wine selection"
      >
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Wine
        </Button>
      </PageHeader>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : wines.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No wines found. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wines.map((wine) => (
            <div
              key={wine.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <Wine className="mr-2 h-4 w-4" />
                      {wine.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {wine.categories.map((category) => (
                        <Badge key={category.id} variant="secondary">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWineStatus(wine.id, wine.active)}
                  >
                    <ToggleLeft className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  {wine.description}
                </p>

                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Bottle:</span>
                    <span className="font-medium">${wine.bottle_price.toFixed(2)}</span>
                  </div>
                  {wine.glass_price && (
                    <div className="flex justify-between text-sm">
                      <span>Glass:</span>
                      <span className="font-medium">${wine.glass_price.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Badge 
                  className="mt-4" 
                  variant={wine.active ? "success" : "secondary"}
                >
                  {wine.active ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Wine</DialogTitle>
            <DialogDescription>
              Add a new wine to your list with its details and pricing.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newWine.name}
                onChange={(e) => setNewWine({ ...newWine, name: e.target.value })}
                placeholder="Wine name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newWine.description}
                onChange={(e) => setNewWine({ ...newWine, description: e.target.value })}
                placeholder="Wine description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bottle_price">Bottle Price</Label>
                <Input
                  id="bottle_price"
                  type="number"
                  step="0.01"
                  value={newWine.bottle_price}
                  onChange={(e) => setNewWine({ ...newWine, bottle_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="glass_price">Glass Price (Optional)</Label>
                <Input
                  id="glass_price"
                  type="number"
                  step="0.01"
                  value={newWine.glass_price}
                  onChange={(e) => setNewWine({ ...newWine, glass_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Categories</Label>
              <Select
                value={newWine.category_ids[0]?.toString() || ''}
                onValueChange={(value) =>
                  setNewWine({
                    ...newWine,
                    category_ids: [...newWine.category_ids, parseInt(value)]
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                      disabled={newWine.category_ids.includes(category.id)}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {newWine.category_ids.map((categoryId) => {
                  const category = categories.find(c => c.id === categoryId);
                  return category ? (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {category.name}
                      <button
                        type="button"
                        onClick={() => setNewWine({
                          ...newWine,
                          category_ids: newWine.category_ids.filter(id => id !== categoryId)
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
            <Button onClick={handleCreateWine}>
              Create Wine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}