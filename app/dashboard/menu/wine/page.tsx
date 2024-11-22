"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Plus, Edit2, Trash2, Wine } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/core/layout";
import { Badge } from "@/components/ui/badge";

type WineCategory = {
  id: number;
  name: string;
  description: string | null;
};

type WineItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: number;
  year: number | null;
  origin: string | null;
  active: boolean;
  wine_categories?: WineCategory;
};

export default function WinePage() {
  const [wines, setWines] = useState<WineItem[]>([]);
  const [categories, setCategories] = useState<WineCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWine, setSelectedWine] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    year: '',
    origin: '',
    active: true
  });

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch wine categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('wine_categories')
          .select('*')
          .order('name');

        if (categoriesError) throw categoriesError;

        // Fetch wines
        const { data: winesData, error: winesError } = await supabase
          .from('wines')
          .select(`
            *,
            wine_categories (
              id,
              name,
              description
            )
          `)
          .order('name');

        if (winesError) throw winesError;

        setCategories(categoriesData || []);
        setWines(winesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load wines');
        toast({
          title: "Error",
          description: "Failed to load wine list",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supabase, toast]);

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.category_id || !formData.price) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const wineData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        year: formData.year ? parseInt(formData.year) : null,
        origin: formData.origin || null,
        active: formData.active,
      };

      if (isEditing && selectedWine) {
        const { data, error } = await supabase
          .from('wines')
          .update(wineData)
          .eq('id', selectedWine)
          .select(`
            *,
            wine_categories (
              id,
              name,
              description
            )
          `)
          .single();

        if (error) throw error;

        setWines(prev => prev.map(wine => 
          wine.id === selectedWine ? data : wine
        ));

        toast({
          title: "Success",
          description: "Wine updated successfully",
        });
      } else {
        const { data, error } = await supabase
          .from('wines')
          .insert(wineData)
          .select(`
            *,
            wine_categories (
              id,
              name,
              description
            )
          `)
          .single();

        if (error) throw error;

        setWines(prev => [...prev, data]);

        toast({
          title: "Success",
          description: "Wine added successfully",
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving wine:', error);
      toast({
        title: "Error",
        description: "Failed to save wine",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedWine) return;

    try {
      const { error } = await supabase
        .from('wines')
        .delete()
        .eq('id', selectedWine);

      if (error) throw error;

      setWines(prev => prev.filter(wine => wine.id !== selectedWine));
      setIsDeleteDialogOpen(false);
      setSelectedWine(null);

      toast({
        title: "Success",
        description: "Wine deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting wine:', error);
      toast({
        title: "Error",
        description: "Failed to delete wine",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (wine: WineItem) => {
    setFormData({
      name: wine.name,
      description: wine.description,
      price: wine.price.toString(),
      category_id: wine.category_id.toString(),
      year: wine.year?.toString() || '',
      origin: wine.origin || '',
      active: wine.active
    });
    setSelectedWine(wine.id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      year: '',
      origin: '',
      active: true
    });
    setSelectedWine(null);
    setIsEditing(false);
    setIsDialogOpen(false);
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wines.map((wine) => (
            <div
              key={wine.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center">
                    <Wine className="mr-2 h-4 w-4" />
                    {wine.name}
                    {wine.year && <span className="ml-2 text-sm text-muted-foreground">
                      ({wine.year})
                    </span>}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(wine)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedWine(wine.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{wine.description}</p>
                {wine.origin && (
                  <Badge variant="secondary" className="mt-2">
                    {wine.origin}
                  </Badge>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">${wine.price.toFixed(2)}</span>
                  <Badge variant={wine.active ? "success" : "secondary"}>
                    {wine.active ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                {wine.wine_categories && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Category: {wine.wine_categories.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Wine' : 'Add New Wine'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edit wine details below.' : 'Add a new wine to your list.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Wine name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Wine description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="Year"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="Country or region of origin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
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
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="active">Available</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? 'Save Changes' : 'Add Wine'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the wine
              from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}