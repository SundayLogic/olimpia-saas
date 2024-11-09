"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/image/ImageUpload";
import { ImageGallery } from "@/components/image/ImageGallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { MenuCategory } from '@/components/image/types';

const MENU_CATEGORIES = [
  { value: 'arroces', label: 'Arroces' },
  { value: 'carnes', label: 'Carnes' },
  { value: 'del-huerto', label: 'Del Huerto' },
  { value: 'del-mar', label: 'Del Mar' },
  { value: 'para-compartir', label: 'Para Compartir' },
  { value: 'para-peques', label: 'Para Peques' },
  { value: 'para-veganos', label: 'Para Veganos' },
  { value: 'postres', label: 'Postres' }
] as const;

export default function ImagesPage() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('arroces');
  const [itemName, setItemName] = useState('');
  const { toast } = useToast();
  
  const handleUploadComplete = (url: string) => {
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
    setItemName('');
  };

  const handleUploadError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Image Management</h1>
        <p className="text-muted-foreground">
          Upload and manage images for menu items
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value as MenuCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MENU_CATEGORIES.map((category) => (
                        <SelectItem 
                          key={category.value} 
                          value={category.value}
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Item Name</label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <ImageUpload
                category={selectedCategory}
                itemName={itemName}
                onUploadComplete={handleUploadComplete}
                onError={handleUploadError}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as MenuCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {MENU_CATEGORIES.map((category) => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ImageGallery category={selectedCategory} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}