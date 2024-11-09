'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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

        // List files in the category folder
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
            const { data, error: signedUrlError } = await supabase
              .storage
              .from('menu-images')
              .createSignedUrl(`${category}/${file.name}`, 60 * 60); // 1 hour expiry

            if (signedUrlError) throw signedUrlError;

            return {
              name: file.name,
              url: data.signedUrl,
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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
          {/* Using regular img tag instead of Next.js Image */}
          <img
            src={image.url}
            alt={image.name}
            className="absolute inset-0 w-full h-full object-cover transition-all group-hover:scale-105"
            loading="lazy"
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