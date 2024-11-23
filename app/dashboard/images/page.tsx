"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Upload,
  Trash2,
  FolderIcon,
  AlertCircle,
  Edit2,
} from "lucide-react";
import Image from "next/image";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/core/layout";

// Define available categories
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
];

interface ImageInfo {
  name: string;
  url: string;
  category: string;
  usageCount: number; // Changed from optional to required, will default to 0
}

interface MoveImageDialog {
  open: boolean;
  image: ImageInfo | null;
}

interface RenameImageDialog {
  open: boolean;
  image: ImageInfo | null;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    CATEGORIES[0]
  );
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    image: ImageInfo | null;
  }>({
    open: false,
    image: null,
  });
  const [moveDialog, setMoveDialog] = useState<MoveImageDialog>({
    open: false,
    image: null,
  });
  const [renameDialog, setRenameDialog] = useState<RenameImageDialog>({
    open: false,
    image: null,
  });
  const [newImageName, setNewImageName] = useState("");
  const [targetCategory, setTargetCategory] = useState<string>(CATEGORIES[0]);

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    onDrop: handleFileDrop,
  });

  // Memoize fetchImages to avoid dependency cycle and include debug logs
  const fetchImages = React.useCallback(async () => {
    try {
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from("menu")  // Changed from "menu-images" to "menu"
        .list(selectedCategory);

      if (storageError) throw storageError;

      console.log("Files in category:", storageData); // Debug log

      const imageList = await Promise.all(
        (storageData || []).map(async (file) => {
          // Get public URL using the correct method
          const { data } = supabase.storage
            .from("menu")  // Changed from "menu-images" to "menu"
            .getPublicUrl(`${selectedCategory}/${file.name}`);

          // Log for debugging
          console.log("Generated Public URL:", data.publicUrl);

          // The URL should look like:
          // https://your-supabase-url/storage/v1/object/public/menu/category/image.webp

          const usageCount = await getImageUsageCount(
            `${selectedCategory}/${file.name}`
          );

          return {
            name: file.name,
            url: data.publicUrl, // Use the publicUrl from the data object
            category: selectedCategory,
            usageCount,
          };
        })
      );

      setImages(imageList);

      // Debug log the final image list
      console.log("Final image list:", imageList);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load images",
        variant: "destructive",
      });
    }
  }, [selectedCategory, supabase, toast]);

  // Fetch images for selected category
  useEffect(() => {
    void fetchImages();
  }, [selectedCategory, fetchImages]);

  async function handleFileDrop(acceptedFiles: File[]) {
    try {
      setIsUploading(true);

      for (const file of acceptedFiles) {
        // Validate file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `File ${file.name} exceeds 2MB limit`,
            variant: "destructive",
          });
          continue;
        }

        const filePath = `${selectedCategory}/${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("menu")  // Changed from "menu-images" to "menu"
          .upload(filePath, file, {
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

        toast({
          title: "Success",
          description: `Uploaded ${file.name}`,
        });
      }

      fetchImages();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function getImageUsageCount(imagePath: string): Promise<number> {
    try {
      // Check wines table
      const { count } = await supabase
        .from("wines")
        .select("*", { count: "exact", head: true })
        .eq("image_path", imagePath);

      return count || 0;
    } catch (error) {
      console.error("Error checking image usage:", error);
      return 0;
    }
  }

  async function handleDeleteImage(image: ImageInfo) {
    try {
      const { error } = await supabase.storage
        .from("menu")  // Changed from "menu-images" to "menu"
        .remove([`${image.category}/${image.name}`]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      setDeleteDialog({ open: false, image: null });
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete image",
        variant: "destructive",
      });
    }
  }

  async function handleMoveImage() {
    if (!moveDialog.image || targetCategory === moveDialog.image.category)
      return;

    try {
      // Copy to new location
      const { data: fileData } = await supabase.storage
        .from("menu")  // Changed from "menu-images" to "menu"
        .download(`${moveDialog.image.category}/${moveDialog.image.name}`);

      if (!fileData) throw new Error("Failed to download file");

      const newFile = new File([fileData], moveDialog.image.name, {
        type: fileData.type,
      });

      const { error: uploadError } = await supabase.storage
        .from("menu")  // Changed from "menu-images" to "menu"
        .upload(`${targetCategory}/${moveDialog.image.name}`, newFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Delete from old location
      const { error: deleteError } = await supabase.storage
        .from("menu")  // Changed from "menu-images" to "menu"
        .remove([`${moveDialog.image.category}/${moveDialog.image.name}`]);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: "Image moved successfully",
      });

      setMoveDialog({ open: false, image: null });
      fetchImages();
    } catch (error) {
      console.error("Error moving image:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to move image",
        variant: "destructive",
      });
    }
  }

  async function handleRenameImage() {
    if (!renameDialog.image || !newImageName) return;

    try {
      // Copy with new name
      const { data: fileData } = await supabase.storage
        .from("menu")  // Changed from "menu-images" to "menu"
        .download(`${renameDialog.image.category}/${renameDialog.image.name}`);

      if (!fileData) throw new Error("Failed to download file");

      const newFile = new File([fileData], newImageName, {
        type: fileData.type,
      });

      const { error: uploadError } = await supabase.storage
        .from("menu")  // Changed from "menu-images" to "menu"
        .upload(`${renameDialog.image.category}/${newImageName}`, newFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Delete old file
      const { error: deleteError } = await supabase.storage
        .from("menu")  // Changed from "menu-images" to "menu"
        .remove([`${renameDialog.image.category}/${renameDialog.image.name}`]);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: "Image renamed successfully",
      });

      setRenameDialog({ open: false, image: null });
      setNewImageName("");
      fetchImages();
    } catch (error) {
      console.error("Error renaming image:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to rename image",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container p-6">
      <PageHeader
        heading="Image Management"
        text="Upload and manage images for menu items"
      >
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      {/* Upload Section */}
      <div
        {...getRootProps()}
        className={`
          mt-6 border-2 border-dashed rounded-lg p-8 transition-colors text-center
          ${isDragActive ? "border-primary" : "border-muted-foreground/25"}
          ${
            isUploading
              ? "pointer-events-none opacity-50"
              : "cursor-pointer hover:border-primary/50"
          }
        `}
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

      {/* Images Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.name}
            className="group relative aspect-square rounded-lg overflow-hidden border bg-card"
          >
            <Image
              src={image.url}
              alt={image.name}
              fill
              className="object-cover transition-all group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized // Add this line to bypass Next.js image optimization
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm mb-2 truncate">{image.name}</p>
                {/* Debug URL */}
                <p className="text-xs text-gray-300 break-all">{image.url}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setRenameDialog({ open: true, image })}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setMoveDialog({ open: true, image })}
                  >
                    <FolderIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteDialog({ open: true, image })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, image: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.image && deleteDialog.image.usageCount > 0 ? (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  This image is used in {deleteDialog.image.usageCount}{" "}
                  {deleteDialog.image.usageCount === 1 ? "item" : "items"}.
                  Deleting it will remove the image from those items.
                </div>
              ) : (
                "Are you sure you want to delete this image? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.image && handleDeleteImage(deleteDialog.image)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Move Dialog */}
      <Dialog
        open={moveDialog.open}
        onOpenChange={(open) => setMoveDialog({ open, image: null })}
      >
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
              <Select value={targetCategory} onValueChange={setTargetCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(
                    (cat) => cat !== moveDialog.image?.category
                  ).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {moveDialog.image && moveDialog.image.usageCount > 0 && (
                <p className="text-sm text-yellow-600 flex items-center gap-2 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  This image is used in {moveDialog.image.usageCount}{" "}
                  {moveDialog.image.usageCount === 1 ? "item" : "items"}. Moving
                  it will update all references.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMoveDialog({ open: false, image: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMoveImage}
              disabled={
                !targetCategory ||
                targetCategory === moveDialog.image?.category
              }
            >
              Move Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
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
              <Input
                value={newImageName}
                onChange={(e) => setNewImageName(e.target.value)}
                placeholder="Enter new name with extension (e.g., image.jpg)"
              />
              {!newImageName.includes(".") && newImageName && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Please include file extension (e.g., .jpg, .png, .webp)
                </p>
              )}
              {renameDialog.image && renameDialog.image.usageCount > 0 && (
                <p className="text-sm text-yellow-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  This image is used in {renameDialog.image.usageCount}{" "}
                  {renameDialog.image.usageCount === 1 ? "item" : "items"}.
                  Renaming it will update all references.
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
              onClick={handleRenameImage}
              disabled={
                !newImageName ||
                newImageName === renameDialog.image?.name ||
                !newImageName.includes(".")
              }
            >
              Rename Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
