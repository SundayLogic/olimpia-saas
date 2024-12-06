"use client";

import React, { useState, useMemo, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Plus, Image as ImageIcon, Edit, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/types";

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
import { Button } from "@/components/ui/button";

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
  image_path: string;
  image_url: string;
}

interface NewWine {
  name: string;
  description: string;
  bottle_price: string;
  glass_price: string;
  category_ids: number[];
  active: boolean;
  image_path: string;
}

interface EditWineDialog {
  open: boolean;
  wine: Wine | null;
}

interface EditFormData {
  name: string;
  description: string;
  bottle_price: string;
  glass_price: string;
  category_ids: number[];
}

// Fetch functions
async function fetchCategories(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("wine_categories")
    .select("*")
    .order("display_order");

  if (error) throw error;

  return data as WineCategory[];
}

async function fetchWines(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("wines")
    .select(
      `
      *,
      wine_category_assignments (
        wine_categories (
          id, name, display_order
        )
      )
    `
    )
    .order("name");

  if (error) throw error;

  type WineResponse = {
    id: number;
    name: string;
    description: string;
    bottle_price: number;
    glass_price: number;
    active: boolean;
    created_at: string;
    wine_category_assignments: {
      wine_categories: WineCategory[];
    }[];
    image_path?: string;
    image_url?: string;
  };

  const rawWines = data as WineResponse[];
  return rawWines.map((wine) => ({
    id: wine.id,
    name: wine.name,
    description: wine.description,
    bottle_price: wine.bottle_price,
    glass_price: wine.glass_price,
    active: wine.active,
    created_at: wine.created_at,
    categories: wine.wine_category_assignments.flatMap(
      (a) => a.wine_categories
    ),
    image_path: wine.image_path || "wines/wine.webp",
    image_url:
      wine.image_url ||
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/wines/wine.webp`,
  })) as Wine[];
}

// Highlight function
function highlightText(text: string, searchTerm: string) {
  if (!searchTerm.trim()) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
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
}

// WineCard component
interface WineCardProps {
  wine: Wine;
  searchTerm: string;
  handleEdit: (wine: Wine) => void;
}

const WineCard: React.FC<WineCardProps> = ({
  wine,
  searchTerm,
  handleEdit,
}) => (
  <div
    className="group relative flex flex-col bg-white border border-neutral-100 rounded-sm 
               transition-all duration-300 ease-in-out p-6 hover:shadow-sm"
  >
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleEdit(wine)}
        className="h-8 w-8 p-0"
        aria-label={`Edit ${wine.name}`}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>

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

    <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
      {wine.categories.map((c) => c.name).join(" · ")}
    </div>

    <h3 className="text-lg font-medium mb-2 line-clamp-2">
      {highlightText(wine.name, searchTerm)}
    </h3>

    <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
      {highlightText(wine.description, searchTerm)}
    </p>

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

export default function WinePage() {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State for dialogs and forms
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedWineId, setSelectedWineId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newWine, setNewWine] = useState<NewWine>({
    name: "",
    description: "",
    bottle_price: "",
    glass_price: "",
    category_ids: [],
    active: true,
    image_path: "wines/wine.webp",
  });

  const [editDialog, setEditDialog] = useState<EditWineDialog>({
    open: false,
    wine: null,
  });

  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    description: "",
    bottle_price: "",
    glass_price: "",
    category_ids: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Queries
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<WineCategory[]>({
    queryKey: ["wineCategories"],
    queryFn: () => fetchCategories(supabase),
  });

  const {
    data: wines = [],
    isLoading: winesLoading,
    error: winesError,
  } = useQuery<Wine[]>({
    queryKey: ["wines"],
    queryFn: () => fetchWines(supabase),
  });

  const isLoading = categoriesLoading || winesLoading;
  const error = categoriesError || winesError;

  const createWineMutation = useMutation<unknown, Error, NewWine>({
    mutationFn: async (data: NewWine) => {
      if (!data.name || !data.bottle_price) {
        throw new Error("Please fill in all required fields");
      }

      const { data: wine, error: wineError } = await supabase
        .from("wines")
        .insert({
          name: data.name,
          description: data.description,
          bottle_price: parseFloat(data.bottle_price),
          glass_price: data.glass_price ? parseFloat(data.glass_price) : null,
          active: data.active,
          image_path: data.image_path,
        })
        .select()
        .single();

      if (wineError) throw wineError;

      if (data.category_ids.length > 0) {
        const categoryAssignments = data.category_ids.map((categoryId) => ({
          wine_id: wine.id,
          category_id: categoryId,
        }));
        const { error: assignmentError } = await supabase
          .from("wine_category_assignments")
          .insert(categoryAssignments);
        if (assignmentError) throw assignmentError;
      }
      return wine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      setIsDialogOpen(false);
      setNewWine({
        name: "",
        description: "",
        bottle_price: "",
        glass_price: "",
        category_ids: [],
        active: true,
        image_path: "wines/wine.webp",
      });
      toast({ title: "Success", description: "Wine added successfully" });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const updateWineMutation = useMutation<
    unknown,
    Error,
    { wineId: number; form: EditFormData }
  >({
    mutationFn: async ({ wineId, form }) => {
      const { data: updatedWine, error: wineError } = await supabase
        .from("wines")
        .update({
          name: form.name,
          description: form.description,
          bottle_price: parseFloat(form.bottle_price),
          glass_price: form.glass_price ? parseFloat(form.glass_price) : null,
        })
        .eq("id", wineId)
        .select("*")
        .single();

      if (wineError) throw wineError;

      const { error: deleteError } = await supabase
        .from("wine_category_assignments")
        .delete()
        .eq("wine_id", wineId);

      if (deleteError) throw deleteError;

      if (form.category_ids.length > 0) {
        const assignments = form.category_ids.map((categoryId) => ({
          wine_id: wineId,
          category_id: categoryId,
        }));
        const { error: assignmentError } = await supabase
          .from("wine_category_assignments")
          .insert(assignments);
        if (assignmentError) throw assignmentError;
      }
      return updatedWine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      toast({ title: "Success", description: "Wine updated successfully" });
      setEditDialog({ open: false, wine: null });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Warning", description: message, variant: "destructive" });
      setEditDialog({ open: false, wine: null });
    },
  });

  const toggleWineStatusMutation = useMutation<
    unknown,
    Error,
    { wineId: number; currentStatus: boolean }
  >({
    mutationFn: async ({ wineId, currentStatus }) => {
      const { error } = await supabase
        .from("wines")
        .update({ active: !currentStatus })
        .eq("id", wineId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const uploadImageMutation = useMutation<
    unknown,
    Error,
    { file: File; wineId: number }
  >({
    mutationFn: async ({ file, wineId }) => {
      const fileExtension = file.name.split(".").pop();
      const filePath = `wines/${wineId}.${fileExtension}`;
      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("menu")
        .getPublicUrl(filePath);
      if (!urlData.publicUrl) throw new Error("Failed to get public URL");

      const { error: updateError } = await supabase
        .from("wines")
        .update({ image_path: filePath, image_url: urlData.publicUrl })
        .eq("id", wineId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      toast({ title: "Success", description: "Image updated successfully" });
      setIsImageDialogOpen(false);
      setSelectedWineId(null);
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const filteredAndSortedWines = useMemo(() => {
    let filtered = wines;
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (wine) =>
          wine.name.toLowerCase().includes(lowerSearchTerm) ||
          wine.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (selectedFilter !== "all") {
      filtered = filtered.filter((wine) =>
        wine.categories.some((cat) => cat.id.toString() === selectedFilter)
      );
    }

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

  const handleCreateWine = () => {
    createWineMutation.mutate(newWine);
  };

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

  const handleSaveEdit = () => {
    if (!editDialog.wine) return;
    updateWineMutation.mutate({ wineId: editDialog.wine.id, form: editForm });
  };

  const toggleWineStatus = (id: number, currentStatus: boolean) => {
    toggleWineStatusMutation.mutate({ wineId: id, currentStatus });
  };

  const handleSelectImage = (wineId: number) => {
    setSelectedWineId(wineId);
    setIsImageDialogOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedWineId) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }
    uploadImageMutation.mutate({ file, wineId: selectedWineId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load wines or categories.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (wines.length === 0) {
    return (
      <div className="container p-6">
        <Alert>
          <AlertDescription>
            No wines found. Add one to get started.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Wine
          </Button>
        </div>
      </div>
    );
  }

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

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
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
                        aria-label={`Remove category ${category.name}`}
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
              {createWineMutation.isPending ? "Creating..." : "Create Wine"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Wine Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => !open && setEditDialog({ open, wine: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wine</DialogTitle>
            <DialogDescription>
              Update the details of the wine.
            </DialogDescription>
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
                        aria-label={`Remove category ${category.name}`}
                      >
                        ×
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

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
            <Button onClick={handleSaveEdit}>
              {updateWineMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
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
              disabled={uploadImageMutation.isPending}
            >
              {uploadImageMutation.isPending ? "Uploading..." : "Select Image"}
            </Button>
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
    </div>
  );
}
