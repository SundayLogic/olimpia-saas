// components/daily-menu/MenuHeader.tsx
import { Search } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface MenuHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
  totalMenus: number;
}

export function MenuHeader({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  totalMenus 
}: MenuHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Current Menus</h2>
          <p className="text-sm text-muted-foreground">
            {totalMenus} {totalMenus === 1 ? 'menu' : 'menus'} available
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative col-span-3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by date..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        
        <Select
          value={statusFilter}
          onValueChange={(value: "all" | "active" | "inactive") => 
            onStatusFilterChange(value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Menus</SelectItem>
            <SelectItem value="active">Active Menus</SelectItem>
            <SelectItem value="inactive">Inactive Menus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {searchTerm && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Found {totalMenus} {totalMenus === 1 ? 'result' : 'results'} for &quot;<span className="font-medium">{searchTerm}</span>&quot;
          </span>
          {totalMenus > 0 && statusFilter !== 'all' && (
            <span>with status &quot;<span className="font-medium">{statusFilter}</span>&quot;</span>
          )}
        </div>
      )}
    </div>
  );
}