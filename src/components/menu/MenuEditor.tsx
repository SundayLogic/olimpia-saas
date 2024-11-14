"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Image as ImageIcon } from "lucide-react";
import type { MenuEditorProps } from "@/types/menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Form Schema
const menuItemSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.coerce.number().min(0, "El precio debe ser mayor a 0"),
  category_id: z.string().min(1, "La categoría es requerida"),
  image_path: z.string().min(1, "La imagen es requerida"),
  allergens: z.array(z.string()).optional(),
});

const MenuEditor: React.FC<MenuEditorProps> = ({
  item,
  type,
  onSave,
  onCancel,
  categories,
  allergens
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);

  const form = useForm({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || 0,
      category_id: item?.category_id || "",
      image_path: item?.image_path || "",
      allergens: type === 'menu' ? (item as any)?.allergens || [] : undefined,
    }
  });

  const handleSubmit = async (data: z.infer<typeof menuItemSchema>) => {
    try {
      setIsSubmitting(true);
      await onSave(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
      {/* Image Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Imagen</label>
        <div className="flex gap-4 items-center">
          {form.watch("image_path") ? (
            <div className="relative w-20 h-20 rounded overflow-hidden">
              <img
                src={form.watch("image_path")}
                alt="Selected"
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowImageSelector(true)}
          >
            Seleccionar Imagen
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre</label>
          <Input
            {...form.register("name")}
            placeholder="Nombre del item"
            error={form.formState.errors.name?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Precio</label>
          <Input
            type="number"
            step="0.01"
            {...form.register("price")}
            placeholder="0.00"
            error={form.formState.errors.price?.message}
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Categoría</label>
        <Select
          value={form.watch("category_id")}
          onValueChange={(value) => form.setValue("category_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción</label>
        <Textarea
          {...form.register("description")}
          placeholder="Descripción del item"
          rows={3}
          error={form.formState.errors.description?.message}
        />
      </div>

      {/* Allergens (Only for menu items) */}
      {type === 'menu' && allergens && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Alérgenos</label>
          <Select
            value={form.watch("allergens")}
            onValueChange={(value) => form.setValue("allergens", value)}
            multiple
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona los alérgenos" />
            </SelectTrigger>
            <SelectContent>
              {allergens.map((allergen) => (
                <SelectItem key={allergen.id} value={allergen.id}>
                  {allergen.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </div>
    </form>
  );
};

export default MenuEditor;