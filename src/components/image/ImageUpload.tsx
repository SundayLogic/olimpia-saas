"use client";

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";

type MenuCategory = 
  | 'arroces' 
  | 'carnes' 
  | 'del-huerto' 
  | 'del-mar' 
  | 'para-compartir' 
  | 'para-peques' 
  | 'para-veganos' 
  | 'postres';

interface ImageUploadProps {
  category: MenuCategory;
  itemName: string;
  onUploadComplete: (url: string) => void;
  onError: (error: string) => void;
}

interface FilePreview {
  file: File;
  preview: string;
}

const validateFile = (file: File) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPG, PNG or WebP files are allowed'
    };
  }

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File is too large. Maximum size is 2MB'
    };
  }

  return { isValid: true, error: null };
};

const generateFileName = (itemName: string, originalName: string): string => {
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = itemName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const timestamp = Date.now();
  return `${cleanName}-${timestamp}.${extension}`;
};

export function ImageUpload({
  category,
  itemName,
  onUploadComplete,
  onError
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FilePreview | null>(null);
  const supabase = createClientComponentClient();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      onError(validation.error || 'Validation Error');
      return;
    }

    setSelectedFile({
      file,
      preview: URL.createObjectURL(file)
    });
  }, [onError]);

  const handleUpload = async () => {
    if (!selectedFile) {
      onError('Please select an image');
      return;
    }

    setIsUploading(true);

    try {
      const fileName = generateFileName(itemName, selectedFile.file.name);
      const filePath = `${category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, selectedFile.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      onError(error instanceof Error ? error.message : 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = useCallback(() => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
      setSelectedFile(null);
    }
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Image
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-medium
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
          />
        </div>

        {selectedFile && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Preview:</p>
            <div className="relative w-48 h-48 rounded-lg overflow-hidden group">
              <Image
                src={selectedFile.preview}
                alt="Upload preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <button
                onClick={handleClear}
                type="button"
                aria-label="Clear selection"
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 
                         group-hover:opacity-100 transition-opacity"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          type="button"
          className={`w-full py-2 px-4 rounded-md text-white font-medium
                     ${!selectedFile || isUploading
                       ? 'bg-gray-400 cursor-not-allowed'
                       : 'bg-blue-600 hover:bg-blue-700'
                     } transition-colors`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Uploading...
            </span>
          ) : (
            'Upload Image'
          )}
        </button>
      </div>
    </div>
  );
}

export default ImageUpload;