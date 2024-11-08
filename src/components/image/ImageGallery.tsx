'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Loader2 } from "lucide-react";
import type { MenuCategory } from './types';

interface ImageGalleryProps {
  category: MenuCategory;
}

interface ImageItem {
  name: string;
  url: string;
  updatedAt: string;
}

export function ImageGallery({ category }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(() => createClientComponentClient());

  useEffect(() => {
    async function loadImages() {
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

        const imageItems = await Promise.all(
          files.map(async (file) => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('menu-images')
              .getPublicUrl(`${category}/${file.name}`);

            return {
              name: file.name,
              url: publicUrl,
              updatedAt: file.updated_at,
            };
          })
        );

        setImages(imageItems);
      } catch (err) {
        console.error('Error loading images:', err);
        setError(err instanceof Error ? err.message : 'Error loading images');
      } finally {
        setIsLoading(false);
      }
    }

    loadImages();
  }, [category, supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin" />
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
        No images yet in {category}
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
          <Image
            src={image.url}
            alt={image.name}
            fill
            className="object-cover transition-all group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={async () => {
                try {
                  const { error: deleteError } = await supabase
                    .storage
                    .from('menu-images')
                    .remove([`${category}/${image.name}`]);

                  if (deleteError) throw deleteError;

                  setImages(current => 
                    current.filter(img => img.name !== image.name)
                  );
                } catch (err) {
                  console.error('Error deleting image:', err);
                  // Add toast notification here
                }
              }}
              className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}