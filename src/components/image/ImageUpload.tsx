'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { StorageError } from '@supabase/storage-js';
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  category: string;
  itemName: string;
  onUploadComplete: (url: string) => void;
  onError: (error: string) => void;
  onItemNameChange: (name: string) => void;
  onImageUploaded: () => void;
}

export function ImageUpload({ 
  category,
  itemName,
  onUploadComplete,
  onError,
  onItemNameChange,
  onImageUploaded
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file');
      return;
    }

    // File size validation (2MB)
    if (file.size > 2 * 1024 * 1024) {
      onError('Image size should be less than 2MB');
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setSelectedFile(file);

    // Set item name from file name
    const fileName = file.name.split('.')[0]
      .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
      .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
    onItemNameChange(fileName);

    return () => URL.revokeObjectURL(objectUrl);
  }, [onError, onItemNameChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile || !itemName) {
      onError('Please select an image and enter an item name');
      return;
    }

    setIsUploading(true);

    try {
      // Generate file name
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${itemName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      // Upload to Supabase
      const { data, error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      setIsUploading(false);
      setPreview(null);
      setSelectedFile(null);
      onItemNameChange(''); // Clear item name after successful upload
      onUploadComplete(publicUrl);
      onImageUploaded(); // Trigger refresh of gallery
      
      // Show success toast
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
        duration: 3000,
      });

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof StorageError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Failed to upload image';
      onError(errorMessage);
      
      // Show error toast
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    onItemNameChange(''); // Clear item name when clearing image
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out cursor-pointer",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-gray-300 hover:border-primary",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          {preview ? (
            <div className="relative w-40 h-40 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-40 h-40 rounded-lg bg-gray-50 flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
              ) : (
                <ImageIcon className="h-10 w-10 text-gray-400" />
              )}
            </div>
          )}

          <div className="text-center">
            {isUploading ? (
              <div className="text-sm text-gray-600">Uploading...</div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1">
                  <Upload className="h-4 w-4" />
                  <span className="font-medium">Drop image here or click to select</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG, PNG, WEBP (max 2MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {selectedFile && itemName && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isUploading}
          >
            Clear
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}