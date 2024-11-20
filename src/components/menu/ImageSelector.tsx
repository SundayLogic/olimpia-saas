"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ValidImageSource } from "@/types/menu";

interface ImageFile {
  name: string;
  url: string;
  updatedAt: string;
  error?: boolean;
}

interface ImageSelectorProps {
  onSelect: (imagePath: ValidImageSource) => void;
  onClose: () => void;
  categoryId: string;
}

const DEFAULT_IMAGE_EXPIRY = 3600; // 1 hour

const ImageSelector = ({ onSelect, onClose, categoryId }: ImageSelectorProps) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const getFolderName = async (categoryId: string): Promise<string> => {
    try {
      const { data: category, error } = await supabase
        .from("categories")
        .select("name")
        .eq("id", categoryId)
        .single();

      if (error) throw error;
      if (!category?.name) throw new Error("Category not found");

      return category.name.toLowerCase().replace(/\s+/g, "-");
    } catch (error) {
      console.error("Error getting folder name:", error);
      throw new Error("Failed to get category folder name");
    }
  };

  const getSignedUrl = async (folderName: string, fileName: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .storage
        .from("menu-images")
        .createSignedUrl(`${folderName}/${fileName}`, DEFAULT_IMAGE_EXPIRY);

      if (error) throw error;
      if (!data?.signedUrl) throw new Error("Failed to get signed URL");

      return data.signedUrl;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw new Error("Failed to get image URL");
    }
  };
  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        if (!categoryId) {
          throw new Error("Category ID is required");
        }

        // Get folder name from category
        const folderName = await getFolderName(categoryId);

        // List files from category folder
        const { data: files, error: listError } = await supabase
          .storage
          .from("menu-images")
          .list(folderName);

        if (listError) throw listError;
        if (!files?.length) {
          setImages([]);
          return;
        }

        // Process image files
        const imageFiles = await Promise.all(
          files
            .filter(file => 
              !file.name.startsWith(".") && 
              file.name.match(/\.(jpg|jpeg|png|webp)$/i)
            )
            .map(async (file) => {
              try {
                const signedUrl = await getSignedUrl(folderName, file.name);
                
                return {
                  name: file.name,
                  url: signedUrl,
                  updatedAt: file.updated_at,
                  error: false
                };
              } catch (error) {
                console.error(`Error processing image ${file.name}:`, error);
                return {
                  name: file.name,
                  url: "",
                  updatedAt: file.updated_at,
                  error: true
                };
              }
            })
        );

        // Filter out failed images
        setImages(imageFiles.filter(img => !img.error && img.url));

      } catch (error) {
        console.error("Error loading images:", error);
        setLoadError(error instanceof Error ? error.message : "Failed to load images");
        toast({
          title: "Error",
          description: "No se pudieron cargar las imágenes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      loadImages();
    }
  }, [categoryId, supabase, toast]);

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageSelect = (url: string) => {
    try {
      // Validate URL before selecting
      new URL(url);
      setSelectedImage(url);
    } catch (error) {
      console.error("Invalid image URL:", error);
      toast({
        title: "Error",
        description: "URL de imagen inválida",
        variant: "destructive",
      });
    }
  };

  const handleConfirm = () => {
    if (!selectedImage) return;
    
    try {
      // Final validation before sending back
      new URL(selectedImage);
      onSelect(selectedImage as ValidImageSource);
      onClose();
    } catch (error) {
      console.error("Invalid image URL on confirm:", error);
      toast({
        title: "Error",
        description: "URL de imagen inválida",
        variant: "destructive",
      });
    }
  };

  const imageMotion = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 }
  };
}