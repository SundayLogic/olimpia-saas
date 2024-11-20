"use client";

import { useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Euro } from "lucide-react";
import Image from "next/image";
import type { 
  MenuCardProps, 
  MenuItem, 
  Wine, 
  MenuItemFormData, 
  WineFormData, 
  ValidImageSource, 
  DEFAULT_IMAGE_PLACEHOLDER 
} from "@/types/menu";
import MenuEditor from "./MenuEditor";

const LoadingEditor = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse h-[400px]" />
);

const typography = {
  display: {
    title: "font-garamond text-2xl sm:text-3xl leading-tight tracking-tight",
    subtitle: "font-garamond text-xl leading-snug",
  },
  body: {
    large: "text-lg leading-relaxed",
    base: "text-base leading-relaxed",
    small: "text-sm leading-relaxed"
  },
  label: "text-xs uppercase tracking-[0.25em] font-light"
};

const motionVariants = {
  card: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  }
};

// Image Helper Utility
const getValidImagePath = (path: string | null): ValidImageSource => {
  if (!path) return DEFAULT_IMAGE_PLACEHOLDER;
  if (path.startsWith('http')) return path as ValidImageSource;
  if (path.startsWith('/images/')) return path as ValidImageSource;
  return `/images/${path}` as ValidImageSource;
};

const MenuCard: React.FC<MenuCardProps> = ({
  item,
  type,
  onEdit,
  onDelete,
  categories,
  allergens,
  isEditing,
  onEditToggle
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Image Error State
  const [imageError, setImageError] = useState(false);

  const isMenuItem = (item: MenuItem | Wine): item is MenuItem => {
    return 'allergens' in item;
  };

  const isWine = (item: MenuItem | Wine): item is Wine => {
    return 'bottle_price' in item;
  };

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await onDelete(item.id);
    } finally {
      setIsDeleting(false);
    }
  }, [item.id, onDelete]);

  const handleEditSave = useCallback(async (data: MenuItemFormData | WineFormData) => {
    await onEdit(item.id, data);
    onEditToggle(null);
  }, [item.id, onEdit, onEditToggle]);

  const handleEditCancel = useCallback(() => {
    onEditToggle(null);
  }, [onEditToggle]);

  const getCategory = useCallback(() => {
    const category = categories.find(c => c.id === item.category_id);
    return category?.name || 'Sin categoría';
  }, [categories, item.category_id]);

  const getDisplayPrice = useCallback(() => {
    if (isMenuItem(item)) {
      return item.price.toFixed(2);
    }
    if (isWine(item)) {
      return `${item.bottle_price.toFixed(2)}`;
    }
    return '0.00';
  }, [item]);

  // Image Render Function
  const renderImage = useCallback(() => {
    if (!isMenuItem(item)) return null;

    const imagePath = getValidImagePath(item.image_path);
    
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={imageError ? DEFAULT_IMAGE_PLACEHOLDER : imagePath}
          alt={item.name}
          fill
          className="object-cover transition-all duration-200"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }, [item, imageError]);

  return (
    <AnimatePresence mode="wait">
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <Suspense fallback={<LoadingEditor />}>
            <MenuEditor
              key={`editor-${item.id}`}
              item={item}
              type={type}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
              categories={categories}
              allergens={allergens}
            />
          </Suspense>
        </motion.div>
      ) : (
        <motion.div
          layout
          variants={motionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Replaced Current Image Section with renderImage() */}
          {renderImage()}

          <div className="p-6">
            <span className={`${typography.label} text-muted-foreground`}>
              {getCategory()}
            </span>

            <div className="flex justify-between items-start mt-2 mb-4">
              <h3 className={typography.display.title}>{item.name}</h3>
              <span className="flex items-center text-xl font-light">
                <Euro className="h-4 w-4 mr-1" />
                {getDisplayPrice()}
              </span>
            </div>

            <p className={`${typography.body.base} text-muted-foreground`}>
              {item.description}
            </p>

            {type === 'menu' && allergens && isMenuItem(item) && item.allergens && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.allergens.map((allergenId) => {
                  const allergen = allergens.find(a => a.id === allergenId);
                  return allergen && (
                    <span
                      key={allergen.id}
                      className="px-2 py-1 text-xs bg-secondary/10 rounded-full"
                    >
                      {allergen.name}
                    </span>
                  );
                })}
              </div>
            )}

            {isWine(item) && (
              <div className="mt-4">
                <span className="text-sm font-medium">
                  Copa: €{item.glass_price.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Button Accessibility */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEditToggle(item.id)}
              type="button"
              className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Editar ${item.name}`}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              type="button"
              className="p-2 rounded-full bg-white/90 hover:bg-red-500 hover:text-white shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Eliminar ${item.name}`}
            >
              {isDeleting ? (
                <span className="animate-spin">
                  <Trash2 className="h-4 w-4" />
                </span>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuCard;
