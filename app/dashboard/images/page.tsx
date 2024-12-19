"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Upload, Trash2, FolderIcon, AlertCircle, Edit2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { Database } from "@/types";
import { PageHeader } from "@/components/core/layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Dynamic imports for dialog and select components
const Dialog = dynamic(() => import("@/components/ui/dialog").then(mod => mod.Dialog));
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogContent));
const DialogDescription = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogDescription));
const DialogFooter = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogFooter));
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogHeader));
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTitle));

const AlertDialog = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialog));
const AlertDialogAction = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogAction));
const AlertDialogCancel = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogCancel));
const AlertDialogContent = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogContent));
const AlertDialogDescription = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogDescription));
const AlertDialogFooter = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogFooter));
const AlertDialogHeader = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogHeader));
const AlertDialogTitle = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogTitle));

const Select = dynamic(() => import("@/components/ui/select").then(mod => mod.Select));
const SelectContent = dynamic(() => import("@/components/ui/select").then(mod => mod.SelectContent));
const SelectItem = dynamic(() => import("@/components/ui/select").then(mod => mod.SelectItem));
const SelectTrigger = dynamic(() => import("@/components/ui/select").then(mod => mod.SelectTrigger));
const SelectValue = dynamic(() => import("@/components/ui/select").then(mod => mod.SelectValue));

const CATEGORIES = [
  "arroces",
  "carnes",
  "del-huerto",
  "del-mar",
  "para-compartir",
  "para-peques",
  "para-veganos",
  "postres",
  "wines",
] as const;
type Category = (typeof CATEGORIES)[number];

interface ImageInfo {
  name: string;
  url: string;
  category: string;
  usageCount: number;
}

async function getImageUsageCount(
  supabase: ReturnType<typeof createClientComponentClient<Database>>,
  imagePath: string
): Promise<number> {
  const { count } = await supabase
    .from("wines")
    .select("*", { count: "exact", head: true })
    .eq("image_path", imagePath);
  return count || 0;
}

async function fetchImages(
  supabase: ReturnType<typeof createClientComponentClient<Database>>,
  category: string
): Promise<ImageInfo[]> {
  const { data: storageData, error: storageError } = await supabase.storage
    .from("menu")
    .list(category);
  if (storageError) throw storageError;
  const imageList: ImageInfo[] = [];
  for (const file of storageData || []) {
    const { data } = supabase.storage.from("menu").getPublicUrl(`${category}/${file.name}`);
    const usageCount = await getImageUsageCount(supabase, `${category}/${file.name}`);
    imageList.push({ name: file.name, url: data.publicUrl, category, usageCount });
  }
  return imageList;
}

export default function ImagesPage() {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; image: ImageInfo | null }>({
    open: false,
    image: null,
  });
  const [moveDialog, setMoveDialog] = useState<{ open: boolean; image: ImageInfo | null }>({
    open: false,
    image: null,
  });
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; image: ImageInfo | null }>({
    open: false,
    image: null,
  });
  const [newImageName, setNewImageName] = useState("");
  const [targetCategory, setTargetCategory] = useState<Category>(CATEGORIES[0]);

  const handleCategoryChange = (value: string) => {
    if (CATEGORIES.includes(value as Category)) setSelectedCategory(value as Category);
  };

  const handleTargetCategoryChange = (value: string) => {
    if (CATEGORIES.includes(value as Category)) setTargetCategory(value as Category);
  };

  const {
    data: images = [],
    isLoading,
    error,
  } = useQuery<ImageInfo[], Error>({
    queryKey: ["images", selectedCategory],
    queryFn: () => fetchImages(supabase, selectedCategory),
  });

  const uploadMutation = useMutation<string[], Error, File[]>({
    mutationFn: async (files: File[]): Promise<string[]> => {
      const results: string[] = [];
      for (const file of files) {
        if (file.size > 2 * 1024 * 1024) {
          toast({ title: "Error", description: `File ${file.name} exceeds 2MB limit`, variant: "destructive" });
          continue;
        }
        const filePath = `${selectedCategory}/${file.name}`;
        const { error: uploadError } = await supabase.storage.from("menu").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (uploadError) {
          if (uploadError.message.includes("duplicate")) {
            toast({
              title: "Error",
              description: `File ${file.name} already exists`,
              variant: "destructive",
            });
          } else {
            throw uploadError;
          }
          continue;
        }
        results.push(file.name);
      }
      return results;
    },
    onSuccess: (fileNames: string[]) => {
      if (fileNames.length > 0) {
        toast({ title: "Success", description: `Uploaded ${fileNames.length} files` });
        queryClient.invalidateQueries({ queryKey: ["images", selectedCategory] });
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to upload images";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation<string, Error, ImageInfo>({
    mutationFn: async (image: ImageInfo): Promise<string> => {
      const { error: deleteError } = await supabase.storage.from("menu").remove([`${image.category}/${image.name}`]);
      if (deleteError) throw deleteError;
      return image.name;
    },
    onSuccess: (fileName: string) => {
      toast({ title: "Success", description: `Deleted ${fileName}` });
      setDeleteDialog({ open: false, image: null });
      queryClient.invalidateQueries({ queryKey: ["images", selectedCategory] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to delete image";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const moveMutation = useMutation<string, Error, { image: ImageInfo; targetCategory: string }>({
    mutationFn: async ({ image, targetCategory }): Promise<string> => {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("menu")
        .download(`${image.category}/${image.name}`);
      if (downloadError || !fileData) throw new Error("Failed to download file");
      const newFile = new File([fileData], image.name, { type: fileData.type });
      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(`${targetCategory}/${image.name}`, newFile, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { error: removeError } = await supabase.storage
        .from("menu")
        .remove([`${image.category}/${image.name}`]);
      if (removeError) throw removeError;
      return image.name;
    },
    onSuccess: (fileName: string) => {
      toast({ title: "Success", description: `Moved ${fileName}` });
      setMoveDialog({ open: false, image: null });
      queryClient.invalidateQueries({ queryKey: ["images", selectedCategory] });
      queryClient.invalidateQueries({ queryKey: ["images", targetCategory] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to move image";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const renameMutation = useMutation<{ oldName: string; newName: string }, Error, { image: ImageInfo; newImageName: string }>({
    mutationFn: async ({ image, newImageName }): Promise<{ oldName: string; newName: string }> => {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("menu")
        .download(`${image.category}/${image.name}`);
      if (downloadError || !fileData) throw new Error("Failed to download file");
      const newFile = new File([fileData], newImageName, { type: fileData.type });
      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(`${image.category}/${newImageName}`, newFile, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { error: removeError } = await supabase.storage
        .from("menu")
        .remove([`${image.category}/${image.name}`]);
      if (removeError) throw removeError;
      return { oldName: image.name, newName: newImageName };
    },
    onSuccess: ({ oldName, newName }: { oldName: string; newName: string }) => {
      toast({ title: "Success", description: `Renamed ${oldName} to ${newName}` });
      setRenameDialog({ open: false, image: null });
      setNewImageName("");
      queryClient.invalidateQueries({ queryKey: ["images", selectedCategory] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to rename image";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    onDrop: (acceptedFiles: File[]) => uploadMutation.mutate(acceptedFiles),
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  if (error)
    return (
      <div className="container p-6">
        <Alert variant="destructive">
          <AlertDescription>Failed to load images.</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="container p-6">
      <PageHeader heading="Image Management" text="Upload and manage images for menu items">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      <div
        {...getRootProps()}
        className={`mt-6 border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive ? "border-primary" : "border-muted-foreground/25"
        } ${uploadMutation.isPending ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-sm text-muted-foreground">or click to select files</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <div key={image.name} className="group relative aspect-square rounded-lg overflow-hidden border bg-card">
            <Image
              src={image.url}
              alt={image.name}
              fill
              className="object-cover transition-all group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm mb-2 truncate">{image.name}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="secondary" onClick={() => setRenameDialog({ open: true, image })}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setMoveDialog({ open: true, image })}>
                    <FolderIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteDialog({ open: true, image })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, image: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.image && deleteDialog.image.usageCount > 0 ? (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  This image is used in {deleteDialog.image.usageCount}{" "}
                  {deleteDialog.image.usageCount === 1 ? "item" : "items"}. Deleting it will remove the image from those
                  items.
                </div>
              ) : (
                "Are you sure you want to delete this image? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.image && deleteMutation.mutate(deleteDialog.image)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={moveDialog.open} onOpenChange={(open) => setMoveDialog({ open, image: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Image</DialogTitle>
            <DialogDescription>Select a new category for this image</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Category</Label>
              <Input disabled value={moveDialog.image?.category || ""} />
            </div>
            <div className="grid gap-2">
              <Label>Destination Category</Label>
              <Select value={targetCategory} onValueChange={handleTargetCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((cat) => cat !== moveDialog.image?.category).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {moveDialog.image && moveDialog.image.usageCount > 0 && (
                <p className="text-sm text-yellow-600 flex items-center gap-2 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  This image is used in {moveDialog.image.usageCount}{" "}
                  {moveDialog.image.usageCount === 1 ? "item" : "items"}. Moving it will update all references.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDialog({ open: false, image: null })}>
              Cancel
            </Button>
            <Button
              onClick={() => moveDialog.image && moveMutation.mutate({ image: moveDialog.image, targetCategory })}
              disabled={!targetCategory || targetCategory === moveDialog.image?.category || moveMutation.isPending}
            >
              {moveMutation.isPending ? "Moving..." : "Move Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={renameDialog.open}
        onOpenChange={(open) => {
          setRenameDialog({ open, image: null });
          setNewImageName("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Image</DialogTitle>
            <DialogDescription>Enter a new name for the image</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Name</Label>
              <Input disabled value={renameDialog.image?.name || ""} />
            </div>
            <div className="grid gap-2">
              <Label>New Name</Label>
              <Input value={newImageName} onChange={(e) => setNewImageName(e.target.value)} placeholder="image.jpg" />
              {!newImageName.includes(".") && newImageName && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Please include a file extension (e.g., .jpg, .png, .webp)
                </p>
              )}
              {renameDialog.image && renameDialog.image.usageCount > 0 && (
                <p className="text-sm text-yellow-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  This image is used in {renameDialog.image.usageCount}{" "}
                  {renameDialog.image.usageCount === 1 ? "item" : "items"}. Renaming it will update all references.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRenameDialog({ open: false, image: null });
                setNewImageName("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => renameDialog.image && renameMutation.mutate({ image: renameDialog.image, newImageName })}
              disabled={
                !newImageName ||
                newImageName === renameDialog.image?.name ||
                !newImageName.includes(".") ||
                renameMutation.isPending
              }
            >
              {renameMutation.isPending ? "Renaming..." : "Rename Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
