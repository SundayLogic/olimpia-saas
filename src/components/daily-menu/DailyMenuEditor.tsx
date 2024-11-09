// components/daily-menu/DailyMenuEditor.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

interface DailyMenuEditorProps {
  item?: MenuItem | null;
  onSave: (item: Partial<MenuItem>) => void;
  onCancel: () => void;
}

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

export function DailyMenuEditor({ item, onSave, onCancel }: DailyMenuEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'arroces',
    is_available: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        is_available: item.is_available,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      is_available: formData.is_available,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {MENU_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (€)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="is_available" className="block mb-2">Availability</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_available"
              checked={formData.is_available}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: checked }))}
            />
            <Label htmlFor="is_available">Available</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {item ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
}