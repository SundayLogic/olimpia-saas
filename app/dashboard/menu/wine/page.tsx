"use client";

import React, { useState, useMemo, useEffect, useCallback, FocusEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { Plus, Search, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/types";
import dynamic from "next/dynamic";
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

// i18n
import { useTranslation } from "react-i18next"; // <--- Import the useTranslation hook

// Dynamically imported Dialog components
const Dialog = dynamic(() => import("@/components/ui/dialog").then((mod) => mod.Dialog));
const DialogContent = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.DialogContent)
);
const DialogDescription = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.DialogDescription)
);
const DialogFooter = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.DialogFooter)
);
const DialogHeader = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.DialogHeader)
);
const DialogTitle = dynamic(() =>
  import("@/components/ui/dialog").then((mod) => mod.DialogTitle)
);

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
  image_path?: string;
}

// Simple highlight function
function highlightText(text: string, term: string) {
  if (!term.trim()) return text;
  const lowerTerm = term.toLowerCase();
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(lowerTerm);
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <span className="bg-orange-500 text-white">
        {text.slice(index, index + term.length)}
      </span>
      {text.slice(index + term.length)}
    </>
  );
}

// Wine card used for listing wines
const WineCard = ({
  wine,
  searchTerm,
  handleEdit,
}: {
  wine: Wine;
  searchTerm: string;
  handleEdit: (wine: Wine) => void;
}) => {
  const { t } = useTranslation("winePage");

  return (
    <div className="group relative flex flex-col bg-white border border-neutral-100 rounded-sm p-6 hover:shadow-sm transition-shadow">
      {/* Edit button */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleEdit(wine)}
          className="h-8 w-8 p-0"
          aria-label={t("editAriaLabel", { wineName: wine.name })}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {/* Image container */}
      <div className="relative w-full pb-[150%] mb-4">
        <Image
          src={wine.image_url}
          alt={wine.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw,(max-width: 1536px) 33vw,25vw"
          priority={false}
          loading="lazy"
          unoptimized
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/wines/wine.webp`;
          }}
        />
      </div>

      {/* Categories */}
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
        {wine.categories.map((c) => c.name).join(" · ")}
      </div>

      {/* Name & description with highlight */}
      <h3 className="text-lg font-medium mb-2 line-clamp-2">
        {highlightText(wine.name, searchTerm)}
      </h3>
      <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
        {highlightText(wine.description, searchTerm)}
      </p>

      {/* Pricing */}
      <div className="mt-auto grid grid-cols-2 gap-x-4 text-sm">
        <div>
          <div className="font-medium">€{wine.bottle_price.toFixed(2)}</div>
          <div className="text-neutral-500 uppercase text-xs">
            {t("bottleLabel")}
          </div>
        </div>
        {wine.glass_price && (
          <div>
            <div className="font-medium">€{wine.glass_price.toFixed(2)}</div>
            <div className="text-neutral-500 uppercase text-xs">
              {t("glassLabel")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Fetch categories
async function fetchCategories(
  supabase: ReturnType<typeof createClientComponentClient<Database>>
) {
  const { data, error } = await supabase
    .from("wine_categories")
    .select("id,name,display_order")
    .order("display_order");
  if (error) throw error;
  return data as WineCategory[];
}

// Fetch wines
async function fetchWines(
  supabase: ReturnType<typeof createClientComponentClient<Database>>
) {
  const { data, error } = await supabase
    .from("wines")
    .select(`
      id,name,description,bottle_price,glass_price,active,created_at,image_path,image_url,
      wine_category_assignments (
        wine_categories ( id, name, display_order )
      )
    `)
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
    image_path?: string;
    image_url?: string;
    wine_category_assignments: {
      wine_categories: WineCategory[];
    }[];
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
    categories: wine.wine_category_assignments.flatMap((a) => a.wine_categories),
    image_path: wine.image_path || "wines/wine.webp",
    image_url:
      wine.image_url ||
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/wines/wine.webp`,
  })) as Wine[];
}

export default function WinePage() {
  const { t } = useTranslation("winePage"); // <--- Use translation in this page
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Local states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [wineImages, setWineImages] = useState<{ name: string; url: string }[]>([]);
  const [editDialog, setEditDialog] = useState<EditWineDialog>({ open: false, wine: null });
  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    description: "",
    bottle_price: "",
    glass_price: "",
    category_ids: [],
    image_path: "wines/wine.webp",
  });

  // Searching & filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [newWine, setNewWine] = useState<NewWine>({
    name: "",
    description: "",
    bottle_price: "",
    glass_price: "",
    category_ids: [],
    active: true,
    image_path: "wines/wine.webp",
  });

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(localSearchTerm), 300);
    return () => clearTimeout(handler);
  }, [localSearchTerm]);

  // Queries for categories and wines
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

  // Create Wine mutation
  const createWineMutation = useMutation<void, Error, NewWine>({
    mutationFn: async (data: NewWine) => {
      if (!data.name || !data.bottle_price) {
        throw new Error(t("errors.fillRequiredFields"));
      }
      const { data: inserted, error: wineError } = await supabase
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

      // Insert categories
      if (data.category_ids.length > 0 && inserted) {
        const categoryAssignments = data.category_ids.map((categoryId) => ({
          wine_id: inserted.id,
          category_id: categoryId,
        }));
        const { error: assignmentError } = await supabase
          .from("wine_category_assignments")
          .insert(categoryAssignments);
        if (assignmentError) throw assignmentError;
      }
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
      toast({ title: t("success"), description: t("wineCreated") });
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : t("errors.unexpected");
      toast({ title: t("error"), description: msg, variant: "destructive" });
    },
  });

  // Update Wine mutation
  const updateWineMutation = useMutation<void, Error, { wineId: number; form: EditFormData }>({
    mutationFn: async ({ wineId, form }) => {
      const bottlePrice = parseFloat(form.bottle_price);
      if (!form.name || !bottlePrice) {
        throw new Error(t("errors.fillRequiredFields"));
      }
      const { error: wineError } = await supabase
        .from("wines")
        .update({
          name: form.name,
          description: form.description,
          bottle_price: bottlePrice,
          glass_price: form.glass_price ? parseFloat(form.glass_price) : null,
          image_path: form.image_path || "wines/wine.webp",
        })
        .eq("id", wineId)
        .select("*")
        .single();
      if (wineError) throw wineError;

      // Delete old assignments
      const { error: deleteError } = await supabase
        .from("wine_category_assignments")
        .delete()
        .eq("wine_id", wineId);
      if (deleteError) throw deleteError;

      // Insert new assignments
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      toast({ title: t("success"), description: t("wineUpdated") });
      setEditDialog({ open: false, wine: null });
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : t("errors.unexpected");
      toast({ title: t("error"), description: msg, variant: "destructive" });
      setEditDialog({ open: false, wine: null });
    },
  });

  // Filter and sort wines
  const filteredAndSortedWines = useMemo(() => {
    let filtered = wines;
    const s = searchTerm.toLowerCase().trim();
    if (s) {
      filtered = filtered.filter(
        (wine) =>
          wine.name.toLowerCase().includes(s) || wine.description.toLowerCase().includes(s)
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

  // Functions
  const handleCreateWine = () => createWineMutation.mutate(newWine);

  const handleEdit = useCallback((wine: Wine) => {
    setEditForm({
      name: wine.name,
      description: wine.description,
      bottle_price: wine.bottle_price.toString(),
      glass_price: wine.glass_price?.toString() || "",
      category_ids: wine.categories.map((c) => c.id),
      image_path: wine.image_path || "wines/wine.webp",
    });
    setEditDialog({ open: true, wine });
  }, []);

  const handleSaveEdit = () => {
    if (editDialog.wine) {
      updateWineMutation.mutate({ wineId: editDialog.wine.id, form: editForm });
    }
  };

  // Remove highlight from input onFocus
  const removeHighlightOnFocus = (e: FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    e.target.value = "";
    e.target.value = val;
  };

  // Pre-load "wines" folder images if needed for selection
  useEffect(() => {
    const fetchImages = async () => {
      if (!editDialog.open) {
        setWineImages([]);
        return;
      }
      // List all images in "wines" folder
      const { data: fileList, error } = await supabase.storage.from("menu").list("wines");
      if (error || !fileList || fileList.length === 0) {
        setWineImages([]);
        return;
      }
      const images = fileList
        .filter((f) => f.name !== "placeholder.webp")
        .map((file) => {
          const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu/wines/${file.name}`;
          return { name: file.name, url };
        });
      setWineImages(images);
    };
    void fetchImages();
  }, [editDialog.open, supabase]);

  // Render
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
          <AlertDescription>{t("errors.failedLoadWines")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!wines.length) {
    return (
      <div className="container p-6">
        <Alert>
          <AlertDescription>{t("noWinesFound")}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addWine")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <PageHeader heading={t("heading")} text={t("description")}>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addWine")}
        </Button>
      </PageHeader>

      {/* Search & filter section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-[300px]">
          <Input
            autoComplete="off"
            spellCheck="false"
            autoCorrect="off"
            type="text"
            placeholder={t("searchPlaceholder") as string}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Category filter */}
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-[180px]" aria-label={t("filterByCategory") as string}>
            <SelectValue placeholder={t("filterByCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort by */}
        <Select value={sortBy} onValueChange={(val: "name" | "price") => setSortBy(val)}>
          <SelectTrigger className="w-[180px]" aria-label={t("sortBy") as string}>
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t("sortName")}</SelectItem>
            <SelectItem value="price">{t("sortPrice")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort order */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
          aria-label={
            sortOrder === "asc"
              ? (t("sortOrderAscendingAria") as string)
              : (t("sortOrderDescendingAria") as string)
          }
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </Button>
      </div>

      {/* Wines grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filteredAndSortedWines.map((wine) => (
          <WineCard key={wine.id} wine={wine} searchTerm={searchTerm} handleEdit={handleEdit} />
        ))}
      </div>

      {/* Dialog for creating wine */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dialogAddTitle")}</DialogTitle>
            <DialogDescription>{t("dialogAddDescription")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1">
              <Label>
                {t("fields.name")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                onFocus={removeHighlightOnFocus}
                value={newWine.name}
                onChange={(e) => setNewWine({ ...newWine, name: e.target.value })}
                placeholder={t("fields.namePlaceholder") as string}
              />
            </div>
            <div className="grid gap-1">
              <Label>{t("fields.description")}</Label>
              <Input
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                onFocus={removeHighlightOnFocus}
                value={newWine.description}
                onChange={(e) => setNewWine({ ...newWine, description: e.target.value })}
                placeholder={t("fields.descriptionPlaceholder") as string}
              />
            </div>

            {/* Price fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>
                  {t("fields.bottlePrice")}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <span className="text-sm text-muted-foreground">
                  {t("fields.bottlePriceHint")}
                </span>
                <Input
                  autoComplete="off"
                  spellCheck="false"
                  autoCorrect="off"
                  onFocus={removeHighlightOnFocus}
                  type="number"
                  step="0.01"
                  value={newWine.bottle_price}
                  onChange={(e) => setNewWine({ ...newWine, bottle_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-1">
                <Label>{t("fields.glassPriceOptional")}</Label>
                <Input
                  autoComplete="off"
                  spellCheck="false"
                  autoCorrect="off"
                  onFocus={removeHighlightOnFocus}
                  type="number"
                  step="0.01"
                  value={newWine.glass_price}
                  onChange={(e) => setNewWine({ ...newWine, glass_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Category selection */}
            <div className="grid gap-1">
              <Label>{t("fields.categories")}</Label>
              <span className="text-sm text-muted-foreground">{t("fields.categoriesHint")}</span>
              <Select
                value={newWine.category_ids[0]?.toString() || ""}
                onValueChange={(val) =>
                  setNewWine({
                    ...newWine,
                    category_ids: [...newWine.category_ids, parseInt(val)],
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("fields.categoriesPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id.toString()}
                      disabled={newWine.category_ids.includes(cat.id)}
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {newWine.category_ids.map((categoryId) => {
                  const c = categories.find((ct) => ct.id === categoryId);
                  return c ? (
                    <Badge key={c.id} variant="secondary" className="flex items-center gap-1">
                      {c.name}
                      <button
                        type="button"
                        onClick={() =>
                          setNewWine({
                            ...newWine,
                            category_ids: newWine.category_ids.filter((id) => id !== categoryId),
                          })
                        }
                        className="ml-1 hover:text-destructive"
                        aria-label={t("removeCategoryAria", { categoryName: c.name }) || ""}
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
              {t("cancel")}
            </Button>
            <Button
              onClick={handleCreateWine}
              disabled={createWineMutation.status === "pending"}
            >
              {createWineMutation.status === "pending" ? t("creating") : t("createWine")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing wine */}
      <Dialog open={editDialog.open} onOpenChange={(open) => !open && setEditDialog({ open, wine: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dialogEditTitle")}</DialogTitle>
            <DialogDescription>{t("dialogEditDescription")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1">
              <Label>
                {t("fields.name")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                onFocus={removeHighlightOnFocus}
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder={t("fields.namePlaceholder") as string}
              />
            </div>
            <div className="grid gap-1">
              <Label>{t("fields.description")}</Label>
              <Input
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                onFocus={removeHighlightOnFocus}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder={t("fields.descriptionPlaceholder") as string}
              />
            </div>

            {/* Price fields in EUR */}
            <div className="grid gap-1">
              <Label>
                {t("fields.bottlePrice")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <span className="text-sm text-muted-foreground">{t("fields.bottlePriceHint")}</span>
              <Input
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                onFocus={removeHighlightOnFocus}
                type="number"
                step="0.01"
                value={editForm.bottle_price}
                onChange={(e) => setEditForm({ ...editForm, bottle_price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-1">
              <Label>{t("fields.glassPriceOptional")}</Label>
              <Input
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                onFocus={removeHighlightOnFocus}
                type="number"
                step="0.01"
                value={editForm.glass_price}
                onChange={(e) => setEditForm({ ...editForm, glass_price: e.target.value })}
                placeholder="0.00"
              />
            </div>

            {/* Category selection for edit */}
            <div className="grid gap-1">
              <Label>{t("fields.categories")}</Label>
              <span className="text-sm text-muted-foreground">
                {t("fields.categoriesHint")}
              </span>
              <Select
                value={editForm.category_ids[0]?.toString() || ""}
                onValueChange={(val) =>
                  setEditForm({
                    ...editForm,
                    category_ids: [...editForm.category_ids, parseInt(val)],
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("fields.categoriesPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id.toString()}
                      disabled={editForm.category_ids.includes(cat.id)}
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {editForm.category_ids.map((categoryId) => {
                  const c = categories.find((ct) => ct.id === categoryId);
                  return c ? (
                    <Badge key={c.id} variant="secondary" className="flex items-center gap-1">
                      {c.name}
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            category_ids: editForm.category_ids.filter((id) => id !== categoryId),
                          })
                        }
                        className="ml-1 hover:text-destructive"
                        aria-label={t("removeCategoryAria", { categoryName: c.name }) || ""}
                      >
                        ×
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {/* Image selection */}
            <div className="grid gap-1 border-t pt-4">
              <p className="text-sm font-semibold">{t("fields.selectImageTitle")}</p>
              <span className="text-sm text-muted-foreground">
                {t("fields.selectImageHint")}
              </span>
              {wineImages.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noImagesFound")}</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                  {wineImages.map((img) => {
                    const pathValue = `wines/${img.name}`;
                    return (
                      <label key={img.name} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="image_path"
                          value={pathValue}
                          checked={editForm.image_path === pathValue}
                          onChange={(e) => setEditForm({ ...editForm, image_path: e.target.value })}
                        />
                        <div className="flex items-center gap-2">
                          <Image src={img.url} alt={img.name} width={50} height={50} />
                          <span className="truncate text-sm">{img.name}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setEditDialog({ open: false, wine: null })}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateWineMutation.status === "pending"}
            >
              {updateWineMutation.status === "pending" ? t("saving") : t("saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
