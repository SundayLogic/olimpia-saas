"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Plus, Image as ImageIcon, Edit, Search } from "lucide-react"; // Added 'Search' icon
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
import Image from "next/image";

// ====== Custom Error Type ======
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}
// ===============================

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
  image_url: string; // New field
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
  image_url: string; // New field
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

// Define the structure for the edit dialog state
interface EditWineDialog {
  open: boolean;
  wine: Wine | null;
}

// ====== WineCardProps Interface ======
interface WineCardProps {
  wine: Wine; // Using the Wine interface we already defined
  searchTerm: string; // To pass the search term for highlighting
  handleEdit: (wine: Wine) => void; // Handler to edit wine
}
// =====================================

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

  // ====== New State Variables for Editing ======
  const [editDialog, setEditDialog] = useState<EditWineDialog>({
    open: false,
    wine: null,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    bottle_price: "",
    glass_price: "",
    category_ids: [] as number[],
  });
  // ==============================================

  // ====== New State for Search ======
  const [searchTerm, setSearchTerm] = useState("");
  // =================================

  // New state variables for filtering and sorting
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isUploadingImage, setIsUploadingImage] = useState(false); // New loading state

  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input

  // ====== Helper Function to Highlight Matching Text ======
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
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
  // ========================================================

  // ====== fetchData Function with useCallback ======
  const fetchData = useCallback(async () => {
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
      const transformedWines: Wine[] = (winesData as WineResponse[])?.map(
        (wine) => ({
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
        })
      );

      setCategories(categoriesData || []);
      setWines(transformedWines || []);
    } catch (error: unknown) {
      const supabaseError = error as SupabaseError;
      console.error("Complete error details:", {
        error: supabaseError,
        message: supabaseError.message,
        details: supabaseError.details,
        hint: supabaseError.hint,
        code: supabaseError.code,
      });

      setError("Failed to load wines");
      toast({
        title: "Error",
        description: "Failed to load wines",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);
  // ================================================

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Added fetchData to dependencies

  // ====== Filter and Sort Wines ======
  // Filter and sort wines using useMemo for performance optimization
  const filteredAndSortedWines = useMemo(() => {
    let filtered = wines;

    // First apply search filter if there's a search term
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (wine) =>
          wine.name.toLowerCase().includes(lowerSearchTerm) ||
          wine.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Then apply category filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((wine) =>
        wine.categories.some((cat) => cat.id.toString() === selectedFilter)
      );
    }

    // Then sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc"
          ? a.bottle_price - b.bottle_price
          : b.bottle_price - a.bottle_price;
      }
    });
  }, [wines, selectedFilter, sortBy, sortOrder, searchTerm]);
  // ====================================

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
          glass_price: newWine.glass_price
            ? parseFloat(newWine.glass_price)
            : null,
          active: newWine.active,
          image_path: newWine.image_path, // Updated image_path
        })
        .select()
        .single();

      if (wineError) throw wineError;

      // Create category assignments if any
      if (newWine.category_ids.length > 0) {
        const categoryAssignments = newWine.category_ids.map(
          (categoryId) => ({
            wine_id: wine.id,
            category_id: categoryId,
          })
        );

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
    } catch (error: unknown) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
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
        description: `Wine ${
          !currentStatus ? "activated" : "deactivated"
        } successfully`,
      });
    } catch (error: unknown) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
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
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
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
    } catch (error: unknown) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false); // End uploading
    }
  };

  // ====== New Handlers for Editing ======
  // Handler to open the edit dialog with the selected wine's data
  const handleEdit = (wine: Wine) => {
    setEditForm({
      name: wine.name,
      description: wine.description,
      bottle_price: wine.bottle_price.toString(),
      glass_price: wine.glass_price?.toString() || "",
      category_ids: wine.categories.map((c) => c.id),
    });
    setEditDialog({ open: true, wine });
  };

  // Updated handleSaveEdit with your changes
  const handleSaveEdit = async () => {
    if (!editDialog.wine) return;

    try {
      // Add this check at the start of category assignment
      console.log("Category IDs before processing:", {
        rawIds: editForm.category_ids,
        processedIds: editForm.category_ids.map((id) => Number(id)),
      });

      // Log update data
      console.log("Update data:", {
        wineId: editDialog.wine.id,
        updates: {
          name: editForm.name,
          description: editForm.description,
          bottle_price: parseFloat(editForm.bottle_price),
          glass_price: editForm.glass_price
            ? parseFloat(editForm.glass_price)
            : null,
        },
        categories: editForm.category_ids,
      });

      // First update the wine details
      const { data: wineData, error: wineError } = await supabase
        .from("wines")
        .update({
          name: editForm.name,
          description: editForm.description,
          bottle_price: parseFloat(editForm.bottle_price),
          glass_price: editForm.glass_price
            ? parseFloat(editForm.glass_price)
            : null,
        })
        .eq("id", editDialog.wine.id)
        .select("*")
        .single(); // Make sure to return the updated data

      if (wineError) {
        console.error("Wine update error:", wineError);
        throw wineError;
      }

      console.log("Wine updated successfully:", wineData);

      // Always delete existing assignments first
      console.log(
        "Deleting existing category assignments for wine:",
        editDialog.wine.id
      );
      const { error: deleteError } = await supabase
        .from("wine_category_assignments")
        .delete()
        .eq("wine_id", editDialog.wine.id);

      if (deleteError) {
        console.error("Delete categories error:", deleteError);
        throw deleteError;
      }

      // Only attempt category assignments if we have categories
      if (editForm.category_ids && editForm.category_ids.length > 0) {
        // Create all assignments at once
        const assignments = editForm.category_ids.map((categoryId) => ({
          wine_id: Number(editDialog.wine!.id), // Ensure it's a number
          category_id: Number(categoryId), // Ensure it's a number
        }));

        console.log("Attempting to insert assignments:", assignments);

        // Insert all assignments in one operation
        const { error: assignmentError } = await supabase
          .from("wine_category_assignments")
          .insert(assignments)
          .select();

        if (assignmentError) {
          console.error("Assignment error:", assignmentError);
          throw assignmentError;
        }
      }

      // Refresh data
      await fetchData();
      toast({
        title: "Success",
        description: "Wine updated successfully",
      });
      setEditDialog({ open: false, wine: null });
    } catch (error: unknown) {
      const supabaseError = error as SupabaseError;
      console.error("Complete error details:", {
        error: supabaseError,
        message: supabaseError.message,
        details: supabaseError.details,
        hint: supabaseError.hint,
        code: supabaseError.code,
      });

      // Still refresh data to ensure UI is in sync
      await fetchData();

      // More specific error message
      toast({
        title: "Warning",
        description:
          supabaseError.message ||
          "Wine details updated but categories could not be assigned",
        variant: "destructive",
      });
      setEditDialog({ open: false, wine: null });
    }
  };
  // ==========================================

  // ====== WineCard Component ======
  const WineCard: React.FC<WineCardProps> = ({ wine, searchTerm, handleEdit }) => (
    <div
      className="group relative flex flex-col bg-white border border-neutral-100 rounded-sm 
                 transition-all duration-300 ease-in-out p-6 hover:shadow-sm"
    >
      {/* Edit button in top-right corner */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="secondary" // Changed to secondary to be visible on white
          size="sm"
          onClick={() => handleEdit(wine)}
          className="h-8 w-8 p-0"
          aria-label={`Edit ${wine.name}`} // Enhanced ARIA label for accessibility
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {/* Image Container */}
      <div className="relative w-full pb-[150%] mb-4">
        <Image
          src={wine.image_url}
          alt={wine.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, 
                 (max-width: 1024px) 50vw, 
                 (max-width: 1536px) 33vw,
                 25vw"
          priority={false}
          loading="lazy"
          unoptimized
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/wines/wine.webp`;
          }}
        />
      </div>

      {/* Wine Details */}
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
        {wine.categories.map((category) => category.name).join(" · ")}
      </div>

      <h3 className="text-lg font-medium mb-2 line-clamp-2">
        {highlightText(wine.name, searchTerm)}
      </h3>

      <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
        {highlightText(wine.description, searchTerm)}
      </p>

      {/* Prices */}
      <div className="mt-auto grid grid-cols-2 gap-x-4 text-sm">
        <div>
          <div className="font-medium">${wine.bottle_price.toFixed(2)}</div>
          <div className="text-neutral-500 uppercase text-xs">bottle</div>
        </div>
        {wine.glass_price && (
          <div>
            <div className="font-medium">${wine.glass_price.toFixed(2)}</div>
            <div className="text-neutral-500 uppercase text-xs">glass</div>
          </div>
        )}
      </div>
    </div>
  );
  // =================================

  return (
    <div className="container p-6">
      <PageHeader heading="Wine List" text="Manage your restaurant's wine selection">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Wine
        </Button>
      </PageHeader>

      {/* Filter, Sort, and Search Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative w-full md:w-[300px]">
            <Input
              type="text"
              placeholder="Search wines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Filter by Category */}
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={sortBy}
            onValueChange={(value: "name" | "price") => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setSortOrder((current) => (current === "asc" ? "desc" : "asc"))
            }
            aria-label={`Sort order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      {/* Wine Grid with fixed image proportions */}
      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : wines.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No wines found. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredAndSortedWines.map((wine) => (
            <WineCard
              key={wine.id}
              wine={wine}
              searchTerm={searchTerm}
              handleEdit={handleEdit}
            />
          ))}
        </div>
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
                onChange={(e) =>
                  setNewWine({ ...newWine, name: e.target.value })
                }
                placeholder="Wine name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newWine.description}
                onChange={(e) =>
                  setNewWine({ ...newWine, description: e.target.value })
                }
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
                value={newWine.category_ids[0]?.toString() || ""}
                onValueChange={(value: string) =>
                  setNewWine({
                    ...newWine,
                    category_ids: [...newWine.category_ids, parseInt(value)],
                  })
                }
              >
                <SelectTrigger className="w-full">
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
                        aria-label={`Remove category ${category.name}`} // Added ARIA label
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

      {/* ======== Edit Wine Dialog Start ======== */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => !open && setEditDialog({ open, wine: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wine</DialogTitle>
            <DialogDescription>Update the details of the wine.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Wine name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Wine description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-bottle-price">Bottle Price</Label>
                <Input
                  id="edit-bottle-price"
                  type="number"
                  step="0.01"
                  value={editForm.bottle_price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bottle_price: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-glass-price">Glass Price (Optional)</Label>
                <Input
                  id="edit-glass-price"
                  type="number"
                  step="0.01"
                  value={editForm.glass_price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, glass_price: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Categories selection - similar to your add form */}
            <div className="grid gap-2">
              <Label>Categories</Label>
              <Select
                value={editForm.category_ids[0]?.toString() || ""}
                onValueChange={(value: string) =>
                  setEditForm({
                    ...editForm,
                    category_ids: [...editForm.category_ids, parseInt(value)],
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                      disabled={editForm.category_ids.includes(category.id)}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Display selected categories as badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {editForm.category_ids.map((categoryId) => {
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
                          setEditForm({
                            ...editForm,
                            category_ids: editForm.category_ids.filter(
                              (id) => id !== categoryId
                            ),
                          })
                        }
                        className="ml-1 hover:text-destructive"
                        aria-label={`Remove category ${category.name}`} // Added ARIA label
                      >
                        ×
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {/* Add Controls Section */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() =>
                  editDialog.wine &&
                  toggleWineStatus(editDialog.wine.id, editDialog.wine.active)
                }
              >
                {editDialog.wine?.active ? "Set Unavailable" : "Set Available"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  editDialog.wine && handleSelectImage(editDialog.wine.id)
                }
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Change Image
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, wine: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ======== Edit Wine Dialog End ======== */}

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
            <Button
              variant="outline"
              onClick={() => setIsImageDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ======== Image Upload Dialog End ======== */}
    </div>
  );
}
