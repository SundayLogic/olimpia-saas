'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MenuCategory } from './types';

interface ImageGalleryProps {
  category: MenuCategory;
  refreshTrigger: number;
}

interface ImageItem {
  name: string;
  url: string;
  updatedAt: string;
}

export function ImageGallery({ category, refreshTrigger }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const loadImages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: files, error: listError } = await supabase
        .storage
        .from('menu-images')
        .list(category);

      if (listError) throw listError;

      if (!files) {
        setImages([]);
        return;
      }

      // Filter for image files
      const imageFiles = files.filter(file => 
        !file.name.startsWith('.') && 
        file.name.match(/\.(jpg|jpeg|png|webp)$/i)
      );

      // Create signed URLs for each image
      const imageItems = await Promise.all(
        imageFiles.map(async (file) => {
          // Get a signed URL that's valid for 1 hour
          const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('menu-images')
            .createSignedUrl(`${category}/${file.name}`, 3600);

          if (signedUrlError) throw signedUrlError;

          return {
            name: file.name,
            url: signedUrlData.signedUrl,
            updatedAt: file.updated_at,
          };
        })
      );

      console.log('Loaded images:', imageItems); // Debug log
      setImages(imageItems);
    } catch (err) {
      console.error('Error loading images:', err);
      setError(err instanceof Error ? err.message : 'Error loading images');
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [category, refreshTrigger]);

  const handleDelete = async (imageName: string) => {
    try {
      const { error: deleteError } = await supabase
        .storage
        .from('menu-images')
        .remove([`${category}/${imageName}`]);

      if (deleteError) throw deleteError;

      setImages(current => current.filter(img => img.name !== imageName));
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No images found in {category}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div 
          key={image.name}
          className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
        >
          {/* Regular img tag with error handling */}
          <img
            src={image.url}
            alt={image.name.split('-')[0]} // Use the first part of the filename as alt text
            className="absolute inset-0 w-full h-full object-cover transition-all group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.error(`Failed to load image: ${image.url}`);
              // Set a fallback image or placeholder
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
            }}
          />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
            <p className="text-white text-sm text-center break-all">
              {image.name.split('-')[0]} {/* Display the first part of the filename */}
            </p>
            <button
              onClick={() => handleDelete(image.name)}
              className="flex items-center gap-1 text-white bg-red-500 px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}