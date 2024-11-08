"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/image/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

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

type MenuCategory = typeof MENU_CATEGORIES[number]['value'] | 'all';

export default function ImagesPage() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [itemName, setItemName] = useState('');
  const { toast } = useToast();
  
  const handleUploadComplete = (url: string) => {
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
    setItemName('');
    setSelectedCategory('all');
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
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value as MenuCategory)}
                  >
                    <SelectTrigger className="w-full">
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
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Item Name
                  </label>
                  <Input
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
              </div>

              {selectedCategory !== 'all' && itemName && (
                <div className="mt-4">
                  <ImageUpload
                    category={selectedCategory}
                    itemName={itemName}
                    onUploadComplete={handleUploadComplete}
                    onError={handleUploadError}
                  />
                </div>
              )}
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
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No images yet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}