"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Image {
  name: string;
  url: string;
  updatedAt: string;
}
// components/menu/ImageSelector.tsx
interface ImageSelectorProps {
  onSelect: (imagePath: string) => void;
  onClose: () => void;
  categoryId: string; // This needs to be string for SelectItem compatibility
}

const ImageSelector = ({ onSelect, onClose, categoryId }: ImageSelectorProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);

        // Get category info to get the folder name
        const { data: category, error: categoryError } = await supabase
          .from("categories")
          .select("name")
          .eq("id", categoryId)
          .single();

        if (categoryError) throw categoryError;

        // Convert category name to folder name format
        const folderName = category.name.toLowerCase().replace(/\s+/g, "-");

        // List files from the specific category folder
        const { data: files, error: listError } = await supabase
          .storage
          .from("menu-images")
          .list(folderName);

        if (listError) throw listError;

        if (!files) {
          setImages([]);
          return;
        }

        // Filter for image files and get signed URLs
        const imageFiles = await Promise.all(
          files
            .filter(file => 
              !file.name.startsWith(".") && 
              file.name.match(/\.(jpg|jpeg|png|webp)$/i)
            )
            .map(async (file) => {
              const { data: signedUrl } = await supabase
                .storage
                .from("menu-images")
                .createSignedUrl(`${folderName}/${file.name}`, 3600);

              return {
                name: file.name,
                url: signedUrl?.signedUrl || "",
                updatedAt: file.updated_at
              };
            })
        );

        setImages(imageFiles.filter(img => img.url));
      } catch (error) {
        console.error("Error loading images:", error);
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

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
    }
  };

  const imageMotion = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Seleccionar imagen</DialogTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar imágenes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No se encontraron imágenes</p>
            {searchQuery && (
              <Button
                variant="ghost"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 -mx-6 px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
              {filteredImages.map((image) => (
                <motion.div
                  key={image.url}
                  {...imageMotion}
                  className={`
                    relative aspect-square rounded-lg overflow-hidden cursor-pointer
                    border-2 transition-colors
                    ${selectedImage === image.url 
                      ? "border-primary" 
                      : "border-transparent hover:border-muted"}
                  `}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {selectedImage === image.url && (
                    <div className="absolute inset-0 bg-primary/20" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedImage}
          >
            Seleccionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelector;