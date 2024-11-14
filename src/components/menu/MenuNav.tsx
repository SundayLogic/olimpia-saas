"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MenuNavProps } from "@/types/menu";

// Typography system
const typography = {
  nav: {
    category: "font-garamond text-lg tracking-tight",
    label: "text-xs uppercase tracking-[0.25em] font-light"
  },
  number: "text-xs tracking-[0.25em] text-olimpia-text-light uppercase font-light"
};

// Animation variants
const motionVariants = {
  nav: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  }
};

const MenuNav: React.FC<MenuNavProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  type
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const NavContent = () => (
    <>
      {/* Section Label */}
      <div className="mb-4">
        <span className={typography.nav.label}>
          {type === 'menu' ? 'Secciones del menú' : 'Tipos de vino'}
        </span>
      </div>

      {/* Categories Grid */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-6`}>
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            {...motionVariants.item}
            transition={{
              ...motionVariants.item.transition,
              delay: index * 0.1
            }}
            className="group text-left"
          >
            {/* Category Number */}
            <span className={typography.number}>
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Category Name */}
            <span className={`
              block ${typography.nav.category}
              transition-colors duration-300
              ${activeCategory === category.id 
                ? 'text-olimpia-primary' 
                : 'text-olimpia-text-secondary'
              }
            `}>
              {category.name}
            </span>

            {/* Active Indicator */}
            <div className={`
              mt-3 h-[1px] w-full transform 
              transition-all duration-500 ease-out origin-left
              ${activeCategory === category.id
                ? 'scale-x-100 bg-olimpia-primary'
                : 'scale-x-0 bg-olimpia-text-light/20 group-hover:scale-x-100'
              }
            `} />
          </motion.button>
        ))}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <motion.nav 
        {...motionVariants.nav}
        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md"
      >
        <div className="absolute inset-0 bg-white/95" />
        <div className="container mx-auto px-6 py-6 pb-safe relative">
          <NavContent />
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-olimpia-primary/10" />
      </motion.nav>
    );
  }

  return (
    <motion.nav 
      {...motionVariants.nav}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-olimpia-primary/10"
    >
      <div className="container mx-auto px-6 py-6">
        <NavContent />
      </div>
    </motion.nav>
  );
};

export default MenuNav;