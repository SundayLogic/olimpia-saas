"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Loader2, Image as ImageIcon, Check, X } from "lucide-react";
import type { MenuEditorProps, MenuItem, Wine, MenuItemFormData, WineFormData } from "@/types/menu";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import ImageSelector from "@/components/menu/ImageSelector";
import { cn } from "@/lib/utils";

// Form Schemas
const menuItemSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.coerce.number().min(0, "El precio debe ser mayor a 0"),
  category_id: z.coerce.number().min(1, "La categoría es requerida"),
  image_path: z.string().optional(),
  allergens: z.array(z.coerce.number()).optional(),
});

const wineSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  bottle_price: z.coerce.number().min(0, "El precio de botella debe ser mayor a 0"),
  glass_price: z.coerce.number().min(0, "El precio de copa debe ser mayor a 0"),
  category_id: z.coerce.number().min(1, "La categoría es requerida"),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;
type WineFormValues = z.infer<typeof wineSchema>;

const MenuEditor: React.FC<MenuEditorProps> = ({
  item,
  type,
  onSave,
  onCancel,
  categories,
  allergens = []
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelectingImage, setIsSelectingImage] = useState(false);
  const [openAllergens, setOpenAllergens] = useState(false);

  const isMenuItem = (item: MenuItem | Wine): item is MenuItem => {
    return 'allergens' in item;
  };

  const isWine = (item: MenuItem | Wine): item is Wine => {
    return 'bottle_price' in item;
  };

  const defaultAllergens = type === 'menu' && isMenuItem(item) 
    ? item.allergens
    : [];

  const form = useForm<MenuItemFormValues | WineFormValues>({
    resolver: zodResolver(type === 'menu' ? menuItemSchema : wineSchema),
    defaultValues: type === 'menu' ? {
      name: item.name,
      description: item.description,
      price: isMenuItem(item) ? item.price : 0,
      category_id: item.category_id,
      image_path: isMenuItem(item) && item.image_path ? item.image_path : undefined,
      allergens: defaultAllergens,
    } : {
      name: item.name,
      description: item.description,
      bottle_price: isWine(item) ? item.bottle_price : 0,
      glass_price: isWine(item) ? item.glass_price : 0,
      category_id: item.category_id,
    }
  });

  const selectedAllergens = type === 'menu' ? (form.watch('allergens') || []) : [];

  const handleSubmit = async (data: MenuItemFormValues | WineFormValues) => {
    try {
      setIsSubmitting(true);
      if (type === 'menu') {
        const menuData: MenuItemFormData = {
          ...data as MenuItemFormValues,
          category_id: Number(data.category_id),
          allergens: (data as MenuItemFormValues).allergens?.map(Number) || [],
          image_path: (data as MenuItemFormValues).image_path || ''
        };
        await onSave(menuData);
      } else {
        const wineData: WineFormData = {
          ...data as WineFormValues,
          category_id: Number(data.category_id)
        };
        await onSave(wineData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (imagePath: string) => {
    if (type === 'menu') {
      form.setValue('image_path', imagePath);
    }
    setIsSelectingImage(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
        {/* Image Selection - Only for menu items */}
        {type === 'menu' && (
          <FormField
            control={form.control}
            name="image_path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <div className="flex gap-4 items-center">
                  {field.value ? (
                    <div className="relative w-20 h-20 rounded overflow-hidden">
                      <Image
                        src={field.value}
                        alt="Selected"
                        fill
                        className="object-cover"
                        sizes="80px"
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
                    onClick={() => setIsSelectingImage(true)}
                  >
                    Seleccionar Imagen
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del item" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === 'menu' ? (
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="bottle_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Botella</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="glass_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Copa</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        {/* Category Selection */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción del item"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Allergens Multi-select - Only for menu items */}
        {type === 'menu' && (
          <FormField
            control={form.control}
            name="allergens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alérgenos</FormLabel>
                <Popover open={openAllergens} onOpenChange={setOpenAllergens}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value?.length && "text-muted-foreground"
                      )}
                    >
                      {field.value?.length
                        ? `${field.value.length} seleccionados`
                        : "Seleccionar alérgenos"}
                      <X
                        className={cn(
                          "ml-2 h-4 w-4 shrink-0 opacity-50",
                          openAllergens && "rotate-90"
                        )}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar alérgenos..." />
                      <CommandEmpty>No se encontraron alérgenos.</CommandEmpty>
                      <CommandGroup>
                        {allergens.map((allergen) => (
                          <CommandItem
                            key={allergen.id}
                            onSelect={() => {
                              const values = field.value || [];
                              const newValues = values.includes(allergen.id)
                                ? values.filter(id => id !== allergen.id)
                                : [...values, allergen.id];
                              field.onChange(newValues);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                (field.value || []).includes(allergen.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {allergen.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAllergens.map((allergenId) => {
                    const allergen = allergens.find(a => a.id === allergenId);
                    return allergen && (
                      <Badge
                        key={allergen.id}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => {
                          const values = field.value || [];
                          field.onChange(values.filter(id => id !== allergen.id));
                        }}
                      >
                        {allergen.name}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
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

      {/* Image Selector Modal */}
      {isSelectingImage && type === 'menu' && (
        <ImageSelector 
          onSelect={handleImageSelect}
          onClose={() => setIsSelectingImage(false)}
          categoryId={form.watch('category_id').toString()}
        />
      )}
    </Form>
  );
};

export default MenuEditor;