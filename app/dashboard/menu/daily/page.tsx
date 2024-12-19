"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, ToggleLeft, Edit, Copy, Search, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, addMonths, addDays, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import dynamic from "next/dynamic";

// Dynamic Imports for heavy components
const Dialog = dynamic(() => import("@/components/ui/dialog").then((mod) => mod.Dialog));
const DialogContent = dynamic(() => import("@/components/ui/dialog").then((mod) => mod.DialogContent));
const DialogDescription = dynamic(() => import("@/components/ui/dialog").then((mod) => mod.DialogDescription));
const DialogFooter = dynamic(() => import("@/components/ui/dialog").then((mod) => mod.DialogFooter));
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then((mod) => mod.DialogHeader));
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then((mod) => mod.DialogTitle));

const Popover = dynamic(() => import("@/components/ui/popover").then((mod) => mod.Popover));
const PopoverTrigger = dynamic(() => import("@/components/ui/popover").then((mod) => mod.PopoverTrigger));
const PopoverContent = dynamic(() => import("@/components/ui/popover").then((mod) => mod.PopoverContent));

const Select = dynamic(() => import("@/components/ui/select").then((mod) => mod.Select));
const SelectContent = dynamic(() => import("@/components/ui/select").then((mod) => mod.SelectContent));
const SelectItem = dynamic(() => import("@/components/ui/select").then((mod) => mod.SelectItem));
const SelectTrigger = dynamic(() => import("@/components/ui/select").then((mod) => mod.SelectTrigger));
const SelectValue = dynamic(() => import("@/components/ui/select").then((mod) => mod.SelectValue));

const Calendar = dynamic(() => import("@/components/ui/calendar").then((mod) => mod.Calendar));

// Dynamically import Switch
const Switch = dynamic(() => import("@/components/ui/switch").then((mod) => mod.Switch));

interface DailyMenuItem {
  id: string;
  course_name: string;
  course_type: "first" | "second";
  display_order: number;
}
interface DailyMenu {
  id: string;
  date: string;
  repeat_pattern: "none" | "weekly" | "monthly";
  active: boolean;
  scheduled_for: string;
  created_at: string;
  daily_menu_items: DailyMenuItem[];
}
interface FilterOptions { search: string; pattern: "all"|"none"|"weekly"|"monthly"; status: "all"|"active"|"inactive" }
interface AdvancedFilterOptions extends FilterOptions { dateRange: DateRange|undefined; courseSearch: string; }
interface NewMenu { dateRange: DateRange; repeat_pattern: "none"|"weekly"|"monthly"; active: boolean; firstCourse: string; secondCourse: string; }
interface GroupedMenus { [key: string]: DailyMenu[] }

function groupMenusByWeek(menus: DailyMenu[]): GroupedMenus {
  return menus.reduce((acc, menu) => {
    const w = format(startOfWeek(new Date(menu.date), { locale: es }), 'yyyy-MM-dd');
    acc[w] = (acc[w] || []).concat(menu);
    return acc;
  }, {} as GroupedMenus);
}

const getThisWeekRange = (): DateRange => ({ from: startOfWeek(new Date(), { locale: es }), to: endOfWeek(new Date(), { locale: es }) });
const getNextWeekRange = (): DateRange => ({ from: startOfWeek(addWeeks(new Date(), 1), { locale: es }), to: endOfWeek(addWeeks(new Date(), 1), { locale: es }) });
const getThisMonthRange = (): DateRange => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });

async function fetchDailyMenus(supabase: ReturnType<typeof createClientComponentClient<Database>>) {
  const { data, error } = await supabase
    .from("daily_menus")
    .select(`id,date,repeat_pattern,active,scheduled_for,created_at,daily_menu_items (id,course_name,course_type,display_order)`)
    .order("date", { ascending: false });
  if (error) throw error;
  return data as DailyMenu[];
}

const AdvancedFilters = ({ filters, onFilterChange }: { filters: AdvancedFilterOptions; onFilterChange: (f: AdvancedFilterOptions) => void; }) => (
  <div className="space-y-4">
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
        <Input placeholder="Search menus..." value={filters.search} onChange={e=>onFilterChange({...filters,search:e.target.value})} className="pl-9"/>
      </div>
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
        <Input placeholder="Search courses..." value={filters.courseSearch} onChange={e=>onFilterChange({...filters,courseSearch:e.target.value})} className="pl-9"/>
      </div>
      <Select value={filters.pattern} onValueChange={(value: FilterOptions["pattern"])=>onFilterChange({...filters,pattern:value})}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by pattern"/></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Patterns</SelectItem>
          <SelectItem value="none">Single</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[200px] justify-start">
            <CalendarIcon className="mr-2 h-4 w-4"/>
            {filters.dateRange?.from
              ? filters.dateRange.to
                ? `${format(filters.dateRange.from, "PPP", { locale: es })} - ${format(filters.dateRange.to, "PPP", { locale: es })}`
                : format(filters.dateRange.from, "PPP", { locale: es })
              : "Pick a date range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="range" selected={filters.dateRange} onSelect={range=>onFilterChange({...filters,dateRange:range})}/>
        </PopoverContent>
      </Popover>
      <Select value={filters.status} onValueChange={(value:FilterOptions["status"])=>onFilterChange({...filters,status:value})}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status"/></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const QuickActions = ({ onSelectDateRange, onCreateMenu }: { onSelectDateRange: (r: DateRange) => void; onCreateMenu: () => void; }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={()=>onSelectDateRange(getThisWeekRange())}>This Week</Button>
      <Button variant="outline" size="sm" onClick={()=>onSelectDateRange(getNextWeekRange())}>Next Week</Button>
      <Button variant="outline" size="sm" onClick={()=>onSelectDateRange(getThisMonthRange())}>This Month</Button>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={()=>onSelectDateRange({from:new Date(),to:new Date()})}>
        <CalendarIcon className="mr-2 h-4 w-4"/>
        Today
      </Button>
      <Button onClick={onCreateMenu}>
        <Plus className="mr-2 h-4 w-4"/>
        Schedule Menu
      </Button>
    </div>
  </div>
);

type MenuCardProps = {
  menu: DailyMenu;
  onStatusToggle: (id: string, status: boolean) => void;
  onEdit: (m: DailyMenu) => void;
  onDuplicate: (m: DailyMenu) => void;
};

const MenuCard = ({ menu, onStatusToggle, onEdit, onDuplicate }: MenuCardProps) => (
  <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 rounded-sm relative group">
    <div className="flex justify-between items-start mb-6">
      <div>
        <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide">DATE</div>
        <div className="text-lg mt-1">{format(new Date(menu.date), "PPP", { locale: es })}</div>
      </div>
      <Switch
        checked={menu.active}
        onCheckedChange={(checked: boolean) => onStatusToggle(menu.id, checked)}
        aria-label={`Toggle ${format(new Date(menu.date), "PPP", { locale: es })} menu status`}
        className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none", menu.active ? "bg-black" : "bg-gray-200")}
      >
        <span className="sr-only">Toggle menu status</span>
        <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", menu.active ? "translate-x-6" : "translate-x-1")}/>
      </Switch>
    </div>
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide">PATTERN</div>
        <div className="mt-1 capitalize">{menu.repeat_pattern}</div>
      </div>
      <div>
        <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide">COURSES</div>
        <div className="grid gap-2 mt-2">
          {menu.daily_menu_items?.sort((a,b)=>a.display_order-b.display_order).map(item =>
            <div key={item.id} className="text-sm">
              <span className="font-medium capitalize">{item.course_type}:</span> {item.course_name}
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button size="sm" variant="ghost" onClick={()=>onEdit(menu)} className="hover:bg-black hover:text-white" aria-label="Edit menu">
          <Edit className="h-4 w-4"/>
        </Button>
        <Button size="sm" variant="ghost" onClick={()=>onDuplicate(menu)} className="hover:bg-black hover:text-white" aria-label="Duplicate menu">
          <Copy className="h-4 w-4"/>
        </Button>
        <Button size="sm" variant="ghost" onClick={()=>onStatusToggle(menu.id, menu.active)} className="hover:bg-black hover:text-white" aria-label="Toggle menu status">
          <ToggleLeft className="h-4 w-4"/>
        </Button>
      </div>
    </div>
  </div>
);

const MenuListSection = ({ filteredMenus, toggleMenuStatus, handleEditMenu, handleDuplicateMenu }: {
  filteredMenus: DailyMenu[];
  toggleMenuStatus: (id: string, status: boolean) => void;
  handleEditMenu: (m: DailyMenu) => void;
  handleDuplicateMenu: (m: DailyMenu) => void;
}) => {
  const groupedMenus = useMemo(() => groupMenusByWeek(filteredMenus), [filteredMenus]);
  if (!filteredMenus.length) return <div className="text-center py-12"><p className="text-muted-foreground">No menus found.</p></div>;
  return (
    <div className="space-y-8">
      {Object.entries(groupedMenus).map(([week, menus]) => (
        <div key={week} className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-white z-10 py-2">
            Week of {format(new Date(week), "PPP", { locale: es })}
          </h3>
          <div className="space-y-4">
            {menus.map(menu =>
              <MenuCard
                key={menu.id}
                menu={menu}
                onStatusToggle={toggleMenuStatus}
                onEdit={handleEditMenu}
                onDuplicate={handleDuplicateMenu}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function DailyMenuPage() {
  const supabase = createClientComponentClient<Database>(), { toast } = useToast(), queryClient = useQueryClient();
  
  // Local states for debouncing search and courseSearch
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilterOptions>({ search: "", pattern: "all", status: "all", dateRange: undefined, courseSearch: "" });
  const [localSearch, setLocalSearch] = useState(advancedFilter.search);
  const [localCourseSearch, setLocalCourseSearch] = useState(advancedFilter.courseSearch);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setAdvancedFilter(f => ({ ...f, search: localSearch }));
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setAdvancedFilter(f => ({ ...f, courseSearch: localCourseSearch }));
    }, 300);
    return () => clearTimeout(handler);
  }, [localCourseSearch]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<DailyMenu|null>(null);
  const [newMenu, setNewMenu] = useState<NewMenu>({dateRange:{from:new Date(),to:new Date()},repeat_pattern:"none",active:true,firstCourse:"",secondCourse:""});

  const { data: dailyMenus = [], isLoading, error } = useQuery<DailyMenu[], Error>({
    queryKey: ["dailyMenus"],
    queryFn: () => fetchDailyMenus(supabase)
  });

  const queryInvalidate = () => queryClient.invalidateQueries({ queryKey: ["dailyMenus"] });

  const toggleStatusMutation = useMutation({
    mutationFn: async({id,status}:{id:string;status:boolean})=>{
      const{error:toggleError}=await supabase.from("daily_menus").update({active:status}).eq("id",id);
      if(toggleError)throw toggleError;
    },
    onSuccess:()=>{
      queryInvalidate();
      toast({title:"Success",description:"Menu status updated successfully"});
    },
    onError:()=>{
      toast({title:"Error",description:"Failed to update menu status",variant:"destructive"});
    },
  });

  type InsertedMenu = Pick<DailyMenu,'id'|'date'|'repeat_pattern'|'active'|'scheduled_for'|'created_at'>;
  const createMenuMutation = useMutation({
    mutationFn: async()=>{
      const{dateRange,firstCourse,secondCourse,repeat_pattern,active}=newMenu;
      if(!dateRange.from||!firstCourse||!secondCourse)throw new Error("Please fill in all required fields and select dates");
      const datesToSchedule:Date[]=[];
      let currentDate=new Date(dateRange.from);
      const endDate=dateRange.to?new Date(dateRange.to):new Date(dateRange.from);
      while(currentDate<=endDate){
        datesToSchedule.push(new Date(currentDate));
        currentDate=repeat_pattern==="weekly"?addWeeks(currentDate,1):repeat_pattern==="monthly"?addMonths(currentDate,1):addDays(currentDate,1);
      }
      const menusToInsert=datesToSchedule.filter(date=>!dailyMenus.some(m=>isSameDay(new Date(m.date),date))).map(date=>({
        date:format(date,"yyyy-MM-dd"),
        repeat_pattern,
        active,
        scheduled_for:format(date,"yyyy-MM-dd'T'11:00:00.000'Z'"),
      }));
      if(!menusToInsert.length)throw new Error("No new menus to schedule.");
      const{data:insertedMenus,error:insertError}=await supabase.from("daily_menus").insert(menusToInsert).select();
      if(insertError)throw insertError;
      const allMenuItems=(insertedMenus as InsertedMenu[]).flatMap(menu=>[
        {daily_menu_id:menu.id,course_name:firstCourse,course_type:"first" as const,display_order:1},
        {daily_menu_id:menu.id,course_name:secondCourse,course_type:"second" as const,display_order:2},
      ]);
      const{error:itemsError}=await supabase.from("daily_menu_items").insert(allMenuItems);
      if(itemsError)throw itemsError;
    },
    onSuccess:()=>{
      queryInvalidate();setIsDialogOpen(false);resetNewMenu();
      toast({title:"Success",description:"Menus scheduled successfully"});
    },
    onError:(err)=>{
      const message=err instanceof Error?err.message:"Failed to schedule menus";
      toast({title:"Error",description:message,variant:"destructive"});
    },
  });

  const handleDuplicateMenu=(menu:DailyMenu)=>{
    setNewMenu({
      dateRange:{from:new Date(),to:new Date()},
      repeat_pattern:"none",
      active:true,
      firstCourse:menu.daily_menu_items.find(i=>i.course_type==="first")?.course_name||"",
      secondCourse:menu.daily_menu_items.find(i=>i.course_type==="second")?.course_name||"",
    });
    setIsDialogOpen(true);
  };

  const handleEditMenu=(menu:DailyMenu)=>{
    setEditingMenu(menu);
    setNewMenu({
      dateRange:{from:new Date(menu.date),to:new Date(menu.date)},
      repeat_pattern:menu.repeat_pattern,
      active:menu.active,
      firstCourse:menu.daily_menu_items.find(i=>i.course_type==="first")?.course_name||"",
      secondCourse:menu.daily_menu_items.find(i=>i.course_type==="second")?.course_name||"",
    });
    setIsDialogOpen(true);
  };

  const resetNewMenu=()=>{setEditingMenu(null);setNewMenu({dateRange:{from:new Date(),to:new Date()},repeat_pattern:"none",active:true,firstCourse:"",secondCourse:""});};

  const filteredMenus = useMemo(()=>{
    let menus=[...dailyMenus];
    if(advancedFilter.search.trim()){
      const s=advancedFilter.search.toLowerCase();
      menus=menus.filter(m=>m.daily_menu_items.some(i=>i.course_name.toLowerCase().includes(s)));
    }
    if(advancedFilter.courseSearch.trim()){
      const c=advancedFilter.courseSearch.toLowerCase();
      menus=menus.filter(m=>m.daily_menu_items.some(i=>i.course_name.toLowerCase().includes(c)));
    }
    if(advancedFilter.pattern!=="all")menus=menus.filter(m=>m.repeat_pattern===advancedFilter.pattern);
    if(advancedFilter.status!=="all"){
      const isActive=advancedFilter.status==="active";
      menus=menus.filter(m=>m.active===isActive);
    }
    if(advancedFilter.dateRange?.from&&advancedFilter.dateRange?.to){
      const{from,to}=advancedFilter.dateRange;
      menus=menus.filter(m=>{const d=new Date(m.date);return d>=from&&d<=to;});
    }
    return menus.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());
  },[dailyMenus,advancedFilter]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium mb-1">Daily Menus</h1>
            <p className="text-sm uppercase text-muted-foreground tracking-wide">Menu Schedule Management</p>
          </div>
          <Button onClick={()=>{resetNewMenu();setIsDialogOpen(true);}} className="bg-black hover:bg-gray-800 text-white rounded-none">
            <Plus className="mr-2 h-4 w-4"/>Schedule Menu
          </Button>
        </div>

        {error && <Alert variant="destructive"><AlertDescription>{String(error)}</AlertDescription></Alert>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Calendar View</h2>
              <p className="text-sm text-gray-500 mt-1">SELECT DATES TO VIEW OR SCHEDULE MENUS</p>
            </div>
            <QuickActions onSelectDateRange={r=>setNewMenu({...newMenu,dateRange:r})} onCreateMenu={()=>{resetNewMenu();setIsDialogOpen(true);}}/>
            {isLoading
              ?<div className="flex h-[200px] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"/></div>
              :<Calendar mode="range" selected={newMenu.dateRange} onSelect={range=>setNewMenu({...newMenu,dateRange:range||{from:undefined,to:undefined}})} numberOfMonths={1} locale={es}/>
            }
            <div className="mt-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-black rounded-sm"/><span className="text-sm text-gray-600">Single</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#2563eb] rounded-sm"/><span className="text-sm text-gray-600">Weekly</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#7c3aed] rounded-sm"/><span className="text-sm text-gray-600">Monthly</span></div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-medium mb-1">Scheduled Menus</h2>
              <p className="text-sm uppercase text-muted-foreground tracking-wide">View and manage your daily menus</p>
            </div>
            <AdvancedFilters
              filters={advancedFilter}
              onFilterChange={f=>{
                // Update local states for debouncing
                setLocalSearch(f.search);
                setLocalCourseSearch(f.courseSearch);
                setAdvancedFilter({...f, search: f.search, courseSearch: f.courseSearch});
              }}
            />
            {isLoading
              ?<div className="flex h-[200px] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"/></div>
              :<MenuListSection
                filteredMenus={filteredMenus}
                toggleMenuStatus={(id,status)=>toggleStatusMutation.mutate({id,status:!status})}
                handleEditMenu={handleEditMenu}
                handleDuplicateMenu={handleDuplicateMenu}
              />
            }
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={open=>{if(!open)resetNewMenu();setIsDialogOpen(open);}}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingMenu?"Edit Menu":"Schedule Menu"}</DialogTitle>
              <DialogDescription>{editingMenu?"Modify the menu details":"Create a new menu by selecting dates and entering courses"}</DialogDescription>
            </DialogHeader>

            <form onSubmit={e=>{e.preventDefault();createMenuMutation.mutate();}} className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground font-medium tracking-wide">Selected Dates</Label>
                <div className="text-sm">
                  {newMenu.dateRange.from && format(newMenu.dateRange.from,"PPP",{locale:es})}
                  {newMenu.dateRange.to && newMenu.dateRange.from!==newMenu.dateRange.to && ` - ${format(newMenu.dateRange.to,"PPP",{locale:es})}`}
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground font-medium tracking-wide">Repeat Pattern</Label>
                <Select value={newMenu.repeat_pattern} onValueChange={value=>setNewMenu({...newMenu,repeat_pattern:value as NewMenu["repeat_pattern"]})}>
                  <SelectTrigger><SelectValue placeholder="Select repeat pattern"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground font-medium tracking-wide">First Course</Label>
                <Input value={newMenu.firstCourse} onChange={e=>setNewMenu({...newMenu,firstCourse:e.target.value})} placeholder="Enter first course" required/>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground font-medium tracking-wide">Second Course</Label>
                <Input value={newMenu.secondCourse} onChange={e=>setNewMenu({...newMenu,secondCourse:e.target.value})} placeholder="Enter second course" required/>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={()=>{resetNewMenu();setIsDialogOpen(false);}}>Cancel</Button>
                <Button type="submit">{editingMenu?"Update Menu":"Schedule Menu"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
