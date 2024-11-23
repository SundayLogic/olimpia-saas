"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Plus, Wine } from "lucide-react"; // Removed ToggleLeft as it's unused
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
import Image from "next/image"; // Added Image import

// Updated Interfaces
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
  image_path: string; // New field
  image_url: string;  // New field
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
  image_path: string; // New field
  image_url: string;  // New field
}

interface NewWine {
  name: string;
  description: string;
  bottle_price: string;
  glass_price: string;
  category_ids: number[];
  active: boolean;
  image_path: string; // New field
}

export default function WinePage() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [categories, setCategories] = useState<WineCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false); // New state for image dialog
  const [selectedWineId, setSelectedWineId] = useState<number | null>(null); // New state to track selected wine
  const [newWine, setNewWine] = useState<NewWine>({
    name: "",
    description: "",
    bottle_price: "",
    glass_price: "",
    category_ids: [],
    active: true,
    image_path: "wines/wine.webp", // Updated initial state
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false); // New loading state

  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch wine categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("wine_categories")
        .select("*")
        .order("display_order");

      if (categoriesError) throw categoriesError;

      // Fetch wines with their categories
      const { data: winesData, error: winesError } = await supabase
        .from("wines")
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
        .order("name");

      if (winesError) throw winesError;

      // Transform the data to match our interface
      const transformedWines: Wine[] = (winesData as WineResponse[])?.map((wine) => ({
        id: wine.id,
        name: wine.name,
        description: wine.description,
        bottle_price: wine.bottle_price,
        glass_price: wine.glass_price,
        active: wine.active,
        created_at: wine.created_at,
        categories: wine.wine_category_assignments.map(
          (assignment) => assignment.wine_categories
        ),
        image_path: wine.image_path || "wines/wine.webp", // Updated path
        image_url:
          wine.image_url ||
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/wines/wine.webp`, // Updated URL
      }));

      setCategories(categoriesData || []);
      setWines(transformedWines || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load wines");
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
      // Validation
      if (!newWine.name || !newWine.bottle_price) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Create the wine with default image_path
      const { data: wine, error: wineError } = await supabase
        .from("wines")
        .insert({
          name: newWine.name,
          description: newWine.description,
          bottle_price: parseFloat(newWine.bottle_price),
          glass_price: newWine.glass_price ? parseFloat(newWine.glass_price) : null,
          active: newWine.active,
          image_path: newWine.image_path, // Updated image_path
        })
        .select()
        .single();

      if (wineError) throw wineError;

      // Create category assignments if any
      if (newWine.category_ids.length > 0) {
        const categoryAssignments = newWine.category_ids.map((categoryId) => ({
          wine_id: wine.id,
          category_id: categoryId,
        }));

        const { error: assignmentError } = await supabase
          .from("wine_category_assignments")
          .insert(categoryAssignments);

        if (assignmentError) throw assignmentError;
      }

      await fetchData(); // Refresh data
      setIsDialogOpen(false);
      setNewWine({
        name: "",
        description: "",
        bottle_price: "",
        glass_price: "",
        category_ids: [],
        active: true,
        image_path: "wines/wine.webp", // Reset to default
      });

      toast({
        title: "Success",
        description: "Wine added successfully",
      });
    } catch (error) {
      console.error("Error creating wine:", error);
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
        .from("wines")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (updateError) throw updateError;

      setWines((prev) =>
        prev.map((wine) =>
          wine.id === id ? { ...wine, active: !currentStatus } : wine
        )
      );

      toast({
        title: "Success",
        description: `Wine ${!currentStatus ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error toggling wine status:", error);
      toast({
        title: "Error",
        description: "Failed to update wine status",
        variant: "destructive",
      });
    }
  };

  // Handle selecting a new image for a wine
  const handleSelectImage = (wineId: number) => {
    setSelectedWineId(wineId);
    setIsImageDialogOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploadingImage(true); // Start uploading
    const file = e.target.files?.[0];
    if (!file || !selectedWineId) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      setIsUploadingImage(false); // End uploading
      return;
    }

    try {
      // Define the file path in Supabase storage
      const fileExtension = file.name.split(".").pop();
      const filePath = `wines/${selectedWineId}.${fileExtension}`;

      // ======== Updated Image Upload Section Start ========
      // Remove data since we're not using it
      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Fix the publicUrl type error
      const { data: urlData } = supabase.storage
        .from("menu")
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      // Update the wine's image_path and image_url in the database
      const { error: updateError } = await supabase
        .from("wines")
        .update({
          image_path: filePath,
          image_url: urlData.publicUrl,
        })
        .eq("id", selectedWineId);

      if (updateError) throw updateError;
      // ======== Updated Image Upload Section End ========

      // Update the local state
      setWines((prevWines) =>
        prevWines.map((wine) =>
          wine.id === selectedWineId
            ? { ...wine, image_path: filePath, image_url: urlData.publicUrl }
            : wine
        )
      );

      toast({
        title: "Success",
        description: "Image updated successfully",
      });

      // Close the image dialog
      setIsImageDialogOpen(false);
      setSelectedWineId(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false); // End uploading
    }
  };

  return (
    <div className="container p-6">
      <PageHeader heading="Wine List" text="Manage your restaurant's wine selection">
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
        // ======== Updated Wine Cards Rendering Start ========
        <div className="space-y-12">
          {wines.map((wine) => (
            <div
              key={wine.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-neutral-200 pb-12 mb-12"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] bg-neutral-100">
                <Image
                  src={wine.image_url}
                  alt={wine.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                  loading="lazy"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/wines/wine.webp`;
                  }}
                />
              </div>

              {/* Content Container */}
              <div className="flex flex-col justify-between space-y-8">
                {/* Header */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-light tracking-tight">{wine.name}</h2>
                  
                  {/* Categories */}
                  <div className="flex gap-2">
                    {wine.categories.map((category) => (
                      <span
                        key={category.id}
                        className="text-sm uppercase tracking-wider text-neutral-600"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-base leading-relaxed text-neutral-600 max-w-prose">
                    {wine.description}
                  </p>
                </div>

                {/* Footer with Prices and Actions */}
                <div className="flex items-end justify-between pt-6 border-t border-neutral-200">
                  {/* Prices */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-light">${wine.bottle_price.toFixed(2)}</span>
                      <span className="text-sm uppercase tracking-wider text-neutral-600">bottle</span>
                    </div>
                    {wine.glass_price && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-light">${wine.glass_price.toFixed(2)}</span>
                        <span className="text-sm uppercase tracking-wider text-neutral-600">glass</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 rounded-none hover:bg-neutral-100"
                      onClick={() => toggleWineStatus(wine.id, wine.active)}
                    >
                      {wine.active ? "Available" : "Unavailable"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 rounded-none hover:bg-neutral-100"
                      onClick={() => handleSelectImage(wine.id)}
                    >
                      Change Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        // ======== Updated Wine Cards Rendering End ========
      )}

      {/* Add Wine Dialog */}
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
                  onChange={(e) =>
                    setNewWine({ ...newWine, bottle_price: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewWine({ ...newWine, glass_price: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
            {/* ======== Updated Categories Select Start ======== */}
            <div className="grid gap-2">
              <Label>Categories</Label>
              <Select
                value={newWine.category_ids[0]?.toString() || ""} // Only select one at a time
                onValueChange={(value) =>
                  setNewWine({
                    ...newWine,
                    category_ids: [...newWine.category_ids, parseInt(value)],
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

              {/* Display selected categories as badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {newWine.category_ids.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return category ? (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {category.name}
                      <button
                        type="button"
                        onClick={() =>
                          setNewWine({
                            ...newWine,
                            category_ids: newWine.category_ids.filter(
                              (id) => id !== categoryId
                            ),
                          })
                        }
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
            {/* ======== Updated Categories Select End ======== */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWine}>Create Wine</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======== Image Upload Dialog Start ======== */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Wine Image</DialogTitle>
            <DialogDescription>
              Select a new image for the wine.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <Button
              variant="outline"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              disabled={isUploadingImage} // Disable button while uploading
            >
              {isUploadingImage ? "Uploading..." : "Select Image"} {/* Update button text */}
            </Button>
            {/* Optionally, display a preview of the selected image */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ======== Image Upload Dialog End ======== */}
    </div>
  );
}
