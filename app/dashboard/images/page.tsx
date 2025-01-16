"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/types";
import Image from "next/image";

// i18n
import { useTranslation } from "react-i18next";

// Icons
import { Upload, Trash2, FolderIcon, AlertCircle, Edit2 } from "lucide-react";

// UI
import { PageHeader } from "@/components/core/layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Dynamically imported components (for dialog and select)
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

const AlertDialog = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialog)
);
const AlertDialogAction = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogAction)
);
const AlertDialogCancel = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogCancel)
);
const AlertDialogContent = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogContent)
);
const AlertDialogDescription = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogDescription)
);
const AlertDialogFooter = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogFooter)
);
const AlertDialogHeader = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogHeader)
);
const AlertDialogTitle = dynamic(() =>
  import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogTitle)
);

const Select = dynamic(() => import("@/components/ui/select").then((mod) => mod.Select));
const SelectContent = dynamic(() =>
  import("@/components/ui/select").then((mod) => mod.SelectContent)
);
const SelectItem = dynamic(() => import("@/components/ui/select").then((mod) => mod.SelectItem));
const SelectTrigger = dynamic(() =>
  import("@/components/ui/select").then((mod) => mod.SelectTrigger)
);
const SelectValue = dynamic(() =>
  import("@/components/ui/select").then((mod) => mod.SelectValue)
);

/* ---------------------------------------------------------------------
   1) We have one bucket ("menu") plus a "blog" subfolder
---------------------------------------------------------------------- */
const BUCKETS = {
  menu: {
    name: "menu",
    label: "Menu Images",
    categories: {
      arroces: "Arroces",
      carnes: "Carnes",
      "del-huerto": "Del Huerto",
      "del-mar": "Del Mar",
      "para-compartir": "Para Compartir",
      "para-peques": "Para Peques",
      "para-veganos": "Para Veganos",
      postres: "Postres",
      wines: "Wines",
      blog: "Blog"
    },
  },
} as const;

type MenuCategory = keyof typeof BUCKETS.menu.categories;

/* ---------------------------------------------------------------------
   2) Usage-count functions for menu vs. blog references
---------------------------------------------------------------------- */
async function getMenuUsageCount(
  supabase: ReturnType<typeof createClientComponentClient<Database>>,
  imagePath: string
): Promise<number> {
  // Example usage check in "wines" table
  const { count } = await supabase
    .from("wines")
    .select("*", { count: "exact", head: true })
    .eq("image_path", imagePath);
  return count || 0;
}

async function getBlogUsageCount(
  supabase: ReturnType<typeof createClientComponentClient<Database>>,
  imagePath: string
): Promise<number> {
  // Example usage check in "blog_posts"
  const { count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .or(`featured_image_url.eq.${imagePath},content->>'text'.ilike.%${imagePath}%`);
  return count || 0;
}

/* ---------------------------------------------------------------------
   3) Single function to fetch images from "menu" bucket
---------------------------------------------------------------------- */
interface ImageInfo {
  name: string;
  url: string;
  path: string;
  folder: string; // which category/folder
  usageCount: number;
}

async function fetchImages(
  supabase: ReturnType<typeof createClientComponentClient<Database>>,
  folder: string
): Promise<ImageInfo[]> {
  const { data: storageData, error: storageError } = await supabase.storage
    .from("menu")
    .list(folder);

  if (storageError) {
    throw storageError;
  }

  const imageList: ImageInfo[] = [];
  for (const file of storageData || []) {
    // Skip directories or non-image files
    if (file.metadata?.mimetype === null || !file.metadata?.mimetype.startsWith("image/")) {
      continue;
    }

    const path = `${folder}/${file.name}`;
    const { data: urlData } = supabase.storage.from("menu").getPublicUrl(path);

    const usageCount =
      folder === "blog"
        ? await getBlogUsageCount(supabase, path)
        : await getMenuUsageCount(supabase, path);

    imageList.push({
      name: file.name,
      url: urlData.publicUrl,
      path,
      folder,
      usageCount,
    });
  }
  return imageList;
}

/* ---------------------------------------------------------------------
   4) Main ImagesPage component
---------------------------------------------------------------------- */
export default function ImagesPage() {
  const { t } = useTranslation("imagesPage"); // <--- Our new i18n namespace
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // We'll default to the first category in "menu"
  const [selectedFolder, setSelectedFolder] = useState<string>(
    Object.keys(BUCKETS.menu.categories)[0]
  );

  // Query to fetch images from the chosen folder
  const {
    data: images = [],
    isLoading: imagesLoading,
    error: imagesError,
  } = useQuery<ImageInfo[], Error>({
    queryKey: ["images", selectedFolder],
    queryFn: () => fetchImages(supabase, selectedFolder),
  });

  // Drag & drop for uploading
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    onDrop: (acceptedFiles: File[]) => uploadMutation.mutate(acceptedFiles),
  });

  // Upload
  const uploadMutation = useMutation<string[], Error, File[]>({
    mutationFn: async (files: File[]) => {
      const results: string[] = [];
      for (const file of files) {
        if (file.size > 2 * 1024 * 1024) {
          toast({
            title: t("error"),
            description: t("errors.fileTooLarge", { fileName: file.name }),
            variant: "destructive",
          });
          continue;
        }
        const filePath = `${selectedFolder}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("menu")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) {
          if (uploadError.message.includes("duplicate")) {
            toast({
              title: t("error"),
              description: t("errors.fileAlreadyExists", { fileName: file.name }),
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
    onSuccess: (fileNames) => {
      if (fileNames.length > 0) {
        toast({
          title: t("success"),
          description: t("uploadedFiles", { count: fileNames.length }),
        });
        queryClient.invalidateQueries({ queryKey: ["images", selectedFolder] });
      }
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : t("errors.uploadFailed");
      toast({ title: t("error"), description: message, variant: "destructive" });
    },
  });

  // Delete
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; image: ImageInfo | null }>({
    open: false,
    image: null,
  });
  const deleteMutation = useMutation<string, Error, ImageInfo>({
    mutationFn: async (image) => {
      const { error: deleteError } = await supabase.storage
        .from("menu")
        .remove([image.path]);
      if (deleteError) throw deleteError;
      return image.name;
    },
    onSuccess: (fileName) => {
      toast({ title: t("success"), description: t("deletedFile", { fileName }) });
      setDeleteDialog({ open: false, image: null });
      queryClient.invalidateQueries({ queryKey: ["images", selectedFolder] });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : t("errors.deleteFailed");
      toast({ title: t("error"), description: message, variant: "destructive" });
    },
  });

  // Move
  const [moveDialog, setMoveDialog] = useState<{ open: boolean; image: ImageInfo | null }>({
    open: false,
    image: null,
  });
  const [targetFolder, setTargetFolder] = useState<string>(
    Object.keys(BUCKETS.menu.categories)[0]
  );
  const moveMutation = useMutation<string, Error, { image: ImageInfo; targetFolder: string }>({
    mutationFn: async ({ image, targetFolder }) => {
      // 1) Download old file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("menu")
        .download(image.path);
      if (downloadError || !fileData) throw new Error(t("errors.downloadFailed"));

      // 2) Upload new file
      const newPath = `${targetFolder}/${image.name}`;
      const newFile = new File([fileData], image.name, { type: fileData.type });
      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(newPath, newFile, {
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadError) throw uploadError;

      // 3) Remove old file
      const { error: removeError } = await supabase.storage
        .from("menu")
        .remove([image.path]);
      if (removeError) throw removeError;

      return image.name;
    },
    onSuccess: (fileName, { targetFolder }) => {
      toast({ title: t("success"), description: t("movedFile", { fileName }) });
      setMoveDialog({ open: false, image: null });
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["images", selectedFolder] });
      queryClient.invalidateQueries({ queryKey: ["images", targetFolder] });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : t("errors.moveFailed");
      toast({ title: t("error"), description: message, variant: "destructive" });
    },
  });

  // Rename
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; image: ImageInfo | null }>({
    open: false,
    image: null,
  });
  const [newImageName, setNewImageName] = useState("");
  const renameMutation = useMutation<
    { oldName: string; newName: string },
    Error,
    { image: ImageInfo; newImageName: string }
  >({
    mutationFn: async ({ image, newImageName }) => {
      // 1) Download existing
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("menu")
        .download(image.path);
      if (downloadError || !fileData) throw new Error(t("errors.downloadFailed"));

      // 2) Upload under new name
      const newPath = `${image.folder}/${newImageName}`;
      const newFile = new File([fileData], newImageName, { type: fileData.type });
      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(newPath, newFile, {
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadError) throw uploadError;

      // 3) Remove old
      const { error: removeError } = await supabase.storage
        .from("menu")
        .remove([image.path]);
      if (removeError) throw removeError;

      return { oldName: image.name, newName: newImageName };
    },
    onSuccess: ({ oldName, newName }) => {
      toast({ title: t("success"), description: t("renamedFile", { oldName, newName }) });
      setRenameDialog({ open: false, image: null });
      setNewImageName("");
      queryClient.invalidateQueries({ queryKey: ["images", selectedFolder] });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : t("errors.renameFailed");
      toast({ title: t("error"), description: message, variant: "destructive" });
    },
  });

  // Folder selector
  const folderSelector = (
    <Select value={selectedFolder} onValueChange={setSelectedFolder}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("selectCategory") as string}>
          {BUCKETS.menu.categories[selectedFolder as MenuCategory]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(BUCKETS.menu.categories).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  // Renders
  if (imagesLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (imagesError) {
    return (
      <div className="container p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {t("errors.loadImagesFailed")}: {imagesError.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <PageHeader heading={t("heading")} text={t("description")}>
        {folderSelector}
      </PageHeader>

      {/* Dropzone for uploading */}
      <div
        {...getRootProps()}
        className={`mt-6 border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive ? "border-primary" : "border-muted-foreground/25"
        } ${
          uploadMutation.isPending
            ? "pointer-events-none opacity-50"
            : "cursor-pointer hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? t("dropFilesHere") : t("dragDropOrClick")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("maxSize")}
          </p>
        </div>
      </div>

      {/* Image grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.path}
            className="group relative aspect-square rounded-lg overflow-hidden border bg-card"
          >
            <Image
              src={image.url}
              alt={image.name}
              fill
              className="object-cover transition-all group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
              onError={() => {
                // fallback or console error
                console.error("Image load error:", image.url);
              }}
            />
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm mb-2 truncate">
                  {image.name}
                  <span className="block text-xs opacity-75">{image.path}</span>
                </p>
                <div className="flex gap-2 mt-2">
                  {/* Rename */}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setRenameDialog({ open: true, image })}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {/* Move */}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setMoveDialog({ open: true, image })}
                  >
                    <FolderIcon className="h-4 w-4" />
                  </Button>
                  {/* Delete */}
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

      {/* ------------------ Delete Dialog ------------------ */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, image: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.image && deleteDialog.image.usageCount > 0 ? (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  {t("deleteUsedImage", {
                    usageCount: deleteDialog.image.usageCount,
                  })}
                </div>
              ) : (
                t("deleteWarning")
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteDialog.image) {
                  deleteMutation.mutate(deleteDialog.image);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? t("deleting") : t("deleteButton")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ------------------ Move Dialog ------------------ */}
      <Dialog
        open={moveDialog.open}
        onOpenChange={(open) => setMoveDialog({ open, image: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("moveTitle")}</DialogTitle>
            <DialogDescription>{t("moveDescription")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Current folder */}
            <div className="grid gap-2">
              <Label>{t("moveCurrentFolder")}</Label>
              <Input disabled value={moveDialog.image?.folder || ""} />
            </div>
            {/* Destination */}
            <div className="grid gap-2">
              <Label>{t("moveDestination")}</Label>
              <Select
                value={targetFolder}
                onValueChange={(val) => setTargetFolder(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BUCKETS.menu.categories)
                    .filter(([folderKey]) => folderKey !== moveDialog.image?.folder)
                    .map(([folderKey, folderLabel]) => (
                      <SelectItem key={folderKey} value={folderKey}>
                        {folderLabel}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {moveDialog.image && moveDialog.image.usageCount > 0 && (
                <p className="text-sm text-yellow-600 flex items-center gap-2 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  {t("moveUsedImage", {
                    usageCount: moveDialog.image.usageCount,
                  })}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDialog({ open: false, image: null })}>
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                if (moveDialog.image) {
                  moveMutation.mutate({
                    image: moveDialog.image,
                    targetFolder,
                  });
                }
              }}
              disabled={
                !targetFolder ||
                targetFolder === moveDialog.image?.folder ||
                moveMutation.isPending
              }
            >
              {moveMutation.isPending ? t("moving") : t("moveButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------ Rename Dialog ------------------ */}
      <Dialog
        open={renameDialog.open}
        onOpenChange={(open) => {
          setRenameDialog({ open, image: null });
          setNewImageName("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("renameTitle")}</DialogTitle>
            <DialogDescription>{t("renameDescription")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Current name */}
            <div className="grid gap-2">
              <Label>{t("renameCurrentName")}</Label>
              <Input disabled value={renameDialog.image?.name || ""} />
            </div>
            {/* New name */}
            <div className="grid gap-2">
              <Label>{t("renameNewName")}</Label>
              <Input
                value={newImageName}
                onChange={(e) => setNewImageName(e.target.value)}
                placeholder={t("renamePlaceholder") as string}
              />
              {/* Validation warnings */}
              {!newImageName.includes(".") && newImageName && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {t("renameNoExtensionWarning")}
                </p>
              )}
              {renameDialog.image && renameDialog.image.usageCount > 0 && (
                <p className="text-sm text-yellow-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {t("renameUsedImage", {
                    usageCount: renameDialog.image.usageCount,
                  })}
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
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                if (renameDialog.image) {
                  renameMutation.mutate({
                    image: renameDialog.image,
                    newImageName,
                  });
                }
              }}
              disabled={
                !newImageName ||
                newImageName === renameDialog.image?.name ||
                !newImageName.includes(".") ||
                renameMutation.isPending
              }
            >
              {renameMutation.isPending ? t("renaming") : t("renameButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
