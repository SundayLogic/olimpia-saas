"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { MenuSearchProps } from "@/types/menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MenuSearch: React.FC<MenuSearchProps> = ({
  onSearch,
  onCategoryFilter,
  categories
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Convert to number for API call, but handle "all" case
    if (value === "all") {
      onCategoryFilter(null);
    } else {
      onCategoryFilter(parseInt(value, 10));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
      
      <Select
        value={selectedCategory}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-full sm:w-[200px] bg-white">
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
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
    </div>
  );
};

export default MenuSearch;