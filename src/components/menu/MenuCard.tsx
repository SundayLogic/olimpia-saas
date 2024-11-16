"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Edit2, Trash2, Euro } from "lucide-react";
import type { MenuCardProps, MenuItem, Wine } from "@/types/menu";
import MenuEditor from "./MenuEditor";

// Typography System
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

  // Type guard to check if item is a MenuItem
  const isMenuItem = (item: MenuItem | Wine): item is MenuItem => {
    return 'allergens' in item;
  };

  // Type guard to check if item is a Wine
  const isWine = (item: MenuItem | Wine): item is Wine => {
    return 'bottle_price' in item;
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(item.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDisplayImage = () => {
    if (isMenuItem(item)) {
      return item.image_path || '/placeholder-menu-item.jpg';
    }
    // For wines, always return placeholder since they don't have images
    return '/placeholder-wine.jpg';
  };

  const getDisplayPrice = () => {
    if (isMenuItem(item)) {
      return item.price.toFixed(2);
    }
    if (isWine(item)) {
      return `${item.bottle_price.toFixed(2)}`;
    }
    return '0.00';
  };

  const getCategory = () => {
    const category = categories.find(c => c.id === item.category_id);
    return category?.name || 'Sin categoría';
  };

  return (
    <motion.div
      layout
      variants={motionVariants.card}
      initial="initial"
      animate="animate"
      exit="exit"
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {isEditing ? (
        <MenuEditor
          item={item}
          type={type}
          onSave={async (data) => {
            await onEdit(item.id, data);
            onEditToggle(null);
          }}
          onCancel={() => onEditToggle(null)}
          categories={categories}
          allergens={allergens}
        />
      ) : (
        <>
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={getDisplayImage()}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Category Label */}
            <span className={`${typography.label} text-muted-foreground`}>
              {getCategory()}
            </span>

            {/* Title and Price */}
            <div className="flex justify-between items-start mt-2 mb-4">
              <h3 className={typography.display.title}>{item.name}</h3>
              <span className="flex items-center text-xl font-light">
                <Euro className="h-4 w-4 mr-1" />
                {getDisplayPrice()}
              </span>
            </div>

            {/* Description */}
            <p className={`${typography.body.base} text-muted-foreground`}>
              {item.description}
            </p>

            {/* Allergens (Only for menu items) */}
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

            {/* Additional Wine Info */}
            {isWine(item) && (
              <div className="mt-4">
                <span className="text-sm font-medium">
                  Copa: €{item.glass_price.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEditToggle(item.id)}
              className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors duration-200"
              aria-label="Edit item"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 rounded-full bg-white/90 hover:bg-red-500 hover:text-white shadow-sm transition-colors duration-200"
              aria-label="Delete item"
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
        </>
      )}
    </motion.div>
  );
};

export default MenuCard;