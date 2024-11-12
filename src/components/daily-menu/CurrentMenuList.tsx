// components/daily-menu/CurrentMenuList.tsx
"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  DragDropContext, 
  Draggable, 
  Droppable, 
  DropResult 
} from "@hello-pangea/dnd";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  GripVertical, 
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MenuHeader } from "./MenuHeader"; // Ensure this path is correct

interface MenuItem {
  id: number;
  daily_menu_id: number;
  name: string;
  display_order: number;
}

interface DailyMenu {
  id: number;
  date: string;
  price: number;
  active: boolean;
  created_at: string;
  first_courses: MenuItem[];
  second_courses: MenuItem[];
}

interface CurrentMenuListProps {
  menus: DailyMenu[];
  onMenuUpdate: () => void;
}

export function CurrentMenuList({ menus, onMenuUpdate }: CurrentMenuListProps) {
  // Existing state
  const [isEditing, setIsEditing] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<number | null>(null);
  const [editedMenu, setEditedMenu] = useState<DailyMenu | null>(null);
  const [newFirstCourse, setNewFirstCourse] = useState("");
  const [newSecondCourse, setNewSecondCourse] = useState("");

  // New state for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const { toast } = useToast();
  const supabase = createClientComponentClient();

  /**
   * **Filtering Logic**
   * Filters the menus based on search term and status filter.
   */
  const filteredMenus = useMemo(() => {
    return menus.filter(menu => {
      // Search Filter (search by date)
      const matchesSearch = searchTerm === "" || 
        format(new Date(menu.date), 'PP', { locale: es })
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      
      // Status Filter
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" ? menu.active : !menu.active);
      
      return matchesSearch && matchesStatus;
    });
  }, [menus, searchTerm, statusFilter]);

  /**
   * Handler to toggle the active status of a menu.
   */
  const handleStatusChange = async (menu: DailyMenu, checked: boolean) => {
    try {
      const { error } = await supabase
        .from('daily_menus')
        .update({ active: checked })
        .eq('id', menu.id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Menu for ${format(new Date(menu.date), 'PP', { locale: es })} is now ${checked ? 'active' : 'inactive'}`,
      });

      onMenuUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update menu status",
        variant: "destructive",
      });
    }
  };

  /**
   * Handler for editing a menu.
   */
  const handleEditMenu = (menu: DailyMenu) => {
    setEditedMenu({
      ...menu,
      first_courses: [...menu.first_courses],
      second_courses: [...menu.second_courses]
    });
    setIsEditing(true);
  };

  /**
   * Function to handle drag and drop reordering of courses.
   */
  const handleDragEnd = async (result: DropResult) => {
    if (!editedMenu) return;
    
    const { source, destination } = result;
    if (!destination) return;

    const courseType = source.droppableId.includes('first') ? 'first_courses' : 'second_courses';
    
    const newCourses = Array.from(editedMenu[courseType]);
    const [removed] = newCourses.splice(source.index, 1);
    newCourses.splice(destination.index, 0, removed);

    // Update display orders
    const updatedCourses = newCourses.map((course, index) => ({
      ...course,
      display_order: index + 1
    }));

    setEditedMenu({
      ...editedMenu,
      [courseType]: updatedCourses
    });
  };

  /**
   * Function to handle saving edited menu details.
   */
  const handleSaveMenu = async () => {
    if (!editedMenu) return;

    try {
      // Update menu details
      const { error: menuError } = await supabase
        .from('daily_menus')
        .update({
          date: editedMenu.date,
          price: editedMenu.price,
          active: editedMenu.active
        })
        .eq('id', editedMenu.id);

      if (menuError) throw menuError;

      // Update first courses
      for (const course of editedMenu.first_courses) {
        const { error } = await supabase
          .from('daily_menu_first_courses')
          .update({
            name: course.name,
            display_order: course.display_order
          })
          .eq('id', course.id);

        if (error) throw error;
      }

      // Update second courses
      for (const course of editedMenu.second_courses) {
        const { error } = await supabase
          .from('daily_menu_second_courses')
          .update({
            name: course.name,
            display_order: course.display_order
          })
          .eq('id', course.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Menu updated successfully",
      });

      setIsEditing(false);
      setEditedMenu(null);
      onMenuUpdate();
    } catch (error) {
      console.error('Error updating menu:', error);
      toast({
        title: "Error",
        description: "Failed to update menu",
        variant: "destructive",
      });
    }
  };

  /**
   * Function to handle deleting a menu.
   */
  const handleDeleteMenu = async () => {
    if (!menuToDelete) return;

    try {
      // Delete first courses
      const { error: firstCoursesError } = await supabase
        .from('daily_menu_first_courses')
        .delete()
        .eq('daily_menu_id', menuToDelete);

      if (firstCoursesError) throw firstCoursesError;

      // Delete second courses
      const { error: secondCoursesError } = await supabase
        .from('daily_menu_second_courses')
        .delete()
        .eq('daily_menu_id', menuToDelete);

      if (secondCoursesError) throw secondCoursesError;

      // Delete menu
      const { error: menuError } = await supabase
        .from('daily_menus')
        .delete()
        .eq('id', menuToDelete);

      if (menuError) throw menuError;

      toast({
        title: "Success",
        description: "Menu deleted successfully",
      });

      setMenuToDelete(null);
      onMenuUpdate();
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu",
        variant: "destructive",
      });
    }
  };

  /**
   * Function to handle adding a new course.
   */
  const handleAddCourse = async (type: 'first' | 'second') => {
    if (!editedMenu) return;

    const newName = type === 'first' ? newFirstCourse : newSecondCourse;
    if (!newName.trim()) return;

    const courses = type === 'first' ? editedMenu.first_courses : editedMenu.second_courses;
    const newOrder = courses.length + 1;

    try {
      const { data, error } = await supabase
        .from(type === 'first' ? 'daily_menu_first_courses' : 'daily_menu_second_courses')
        .insert({
          daily_menu_id: editedMenu.id,
          name: newName,
          display_order: newOrder
        })
        .select()
        .single();

      if (error) throw error;

      const courseType = type === 'first' ? 'first_courses' : 'second_courses';
      setEditedMenu({
        ...editedMenu,
        [courseType]: [...courses, data]
      });

      if (type === 'first') {
        setNewFirstCourse('');
      } else {
        setNewSecondCourse('');
      }

      toast({
        title: "Success",
        description: "Course added successfully",
      });
    } catch (error) {
      console.error('Error adding course:', error);
      toast({
        title: "Error",
        description: "Failed to add course",
        variant: "destructive",
      });
    }
  };

  /**
   * Function to handle deleting a course.
   */
  const handleDeleteCourse = async (courseId: number, type: 'first' | 'second') => {
    if (!editedMenu) return;

    try {
      const { error } = await supabase
        .from(type === 'first' ? 'daily_menu_first_courses' : 'daily_menu_second_courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      const courseType = type === 'first' ? 'first_courses' : 'second_courses';
      setEditedMenu({
        ...editedMenu,
        [courseType]: editedMenu[courseType].filter(course => course.id !== courseId)
      });

      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* **Menu Header for Search and Filter** */}
      <MenuHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalMenus={filteredMenus.length}
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMenus.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={4} 
                  className="h-32 text-center text-muted-foreground"
                >
                  No menus found
                </TableCell>
              </TableRow>
            ) : (
              filteredMenus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(menu.date), 'PP', { locale: es })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {menu.first_courses.length + menu.second_courses.length} courses
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{menu.price.toFixed(2)}€</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant={menu.active ? "success" : "secondary"} // Using 'success' variant
                            className="cursor-pointer"
                            onClick={() => handleStatusChange(menu, !menu.active)}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${
                                menu.active ? "bg-green-500" : "bg-gray-400"
                              }`} />
                              {menu.active ? "Active" : "Inactive"}
                            </span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Click to toggle status</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMenu(menu)}
                        aria-label={`Edit menu for ${format(new Date(menu.date), 'PP', { locale: es })}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMenuToDelete(menu.id)}
                        aria-label={`Delete menu for ${format(new Date(menu.date), 'PP', { locale: es })}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* **Edit Menu Dialog** */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
          </DialogHeader>
          {editedMenu && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editedMenu.date}
                    onChange={(e) => setEditedMenu({
                      ...editedMenu,
                      date: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={editedMenu.price}
                    onChange={(e) => setEditedMenu({
                      ...editedMenu,
                      price: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-2 gap-8">
                  {/* First Courses */}
                  <div>
                    <h3 className="font-semibold mb-4">First Courses</h3>
                    <Droppable droppableId="first-courses">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {editedMenu.first_courses.map((course, index) => (
                            <Draggable
                              key={course.id}
                              draggableId={`first-${course.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center gap-2 bg-muted p-2 rounded-md"
                                >
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                  <Input
                                    value={course.name}
                                    onChange={(e) => {
                                      const newCourses = [...editedMenu.first_courses];
                                      newCourses[index] = {
                                        ...course,
                                        name: e.target.value
                                      };
                                      setEditedMenu({
                                        ...editedMenu,
                                        first_courses: newCourses
                                      });
                                    }}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCourse(course.id, 'first')}
                                    aria-label={`Delete course ${course.name}`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="New first course"
                        value={newFirstCourse}
                        onChange={(e) => setNewFirstCourse(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddCourse('first')}
                        aria-label="Add new first course"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Second Courses */}
                  <div>
                    <h3 className="font-semibold mb-4">Second Courses</h3>
                    <Droppable droppableId="second-courses">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {editedMenu.second_courses.map((course, index) => (
                            <Draggable
                              key={course.id}
                              draggableId={`second-${course.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center gap-2 bg-muted p-2 rounded-md"
                                >
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                  <Input
                                    value={course.name}
                                    onChange={(e) => {
                                      const newCourses = [...editedMenu.second_courses];
                                      newCourses[index] = {
                                        ...course,
                                        name: e.target.value
                                      };
                                      setEditedMenu({
                                        ...editedMenu,
                                        second_courses: newCourses
                                      });
                                    }}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCourse(course.id, 'second')}
                                    aria-label={`Delete course ${course.name}`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="New second course"
                        value={newSecondCourse}
                        onChange={(e) => setNewSecondCourse(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddCourse('second')}
                        aria-label="Add new second course"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DragDropContext>
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editedMenu.active}
                    onCheckedChange={(checked) => setEditedMenu({
                      ...editedMenu,
                      active: checked
                    })}
                    aria-label="Toggle menu active status"
                  />
                  <Label>Active</Label>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveMenu}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* **Delete Menu Alert Dialog** */}
      <AlertDialog open={!!menuToDelete} onOpenChange={() => setMenuToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the menu and all its courses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMenu}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
