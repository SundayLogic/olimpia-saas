'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Copy, Pencil } from "lucide-react";

interface BaseMenuItem {
  id: number;
  daily_menu_id: number;
  name: string;
  display_order: number;
}

interface TemplateMenuItem {
  id: number;
  name: string;
  display_order: number;
}

interface MenuTemplate {
  id: string;
  name: string;
  first_courses: TemplateMenuItem[];
  second_courses: TemplateMenuItem[];
  is_default?: boolean;
  created_at?: string;
}

interface MenuTemplateSelectionProps {
  selectedDates: { from: Date; to: Date } | null;
  onNext: () => void;
  onEdit: (template: MenuTemplate) => void;
}

export function MenuTemplateSelection({ selectedDates, onNext, onEdit }: MenuTemplateSelectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<MenuTemplate[]>([]);
  const [defaultTemplate, setDefaultTemplate] = useState<MenuTemplate | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const convertToTemplateItem = (item: BaseMenuItem): TemplateMenuItem => ({
    id: item.id,
    name: item.name,
    display_order: item.display_order
  });

  const loadTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading templates for dates:', selectedDates);

      const { data: latestMenu, error: menuError } = await supabase
        .from('daily_menus')
        .select('id, date')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (menuError) throw menuError;

      if (latestMenu) {
        const [firstCoursesResponse, secondCoursesResponse] = await Promise.all([
          supabase
            .from('daily_menu_first_courses')
            .select('*')
            .eq('daily_menu_id', latestMenu.id)
            .order('display_order'),
          supabase
            .from('daily_menu_second_courses')
            .select('*')
            .eq('daily_menu_id', latestMenu.id)
            .order('display_order')
        ]);

        if (firstCoursesResponse.error) throw firstCoursesResponse.error;
        if (secondCoursesResponse.error) throw secondCoursesResponse.error;

        const defaultTemplate: MenuTemplate = {
          id: 'default',
          name: `Current Menu Template (${new Date(latestMenu.date).toLocaleDateString()})`,
          first_courses: (firstCoursesResponse.data || []).map(convertToTemplateItem),
          second_courses: (secondCoursesResponse.data || []).map(convertToTemplateItem),
          is_default: true,
          created_at: latestMenu.date
        };

        setDefaultTemplate(defaultTemplate);
        setTemplates([defaultTemplate]);
      }

    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load menu templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast, selectedDates]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleUseTemplate = (template: MenuTemplate) => {
    console.log('Using template for dates:', selectedDates);
    onEdit(template);
    onNext();
  };

  const handleCreateNew = () => {
    const emptyTemplate: MenuTemplate = {
      id: 'new',
      name: `New Template (${selectedDates?.from.toLocaleDateString()})`,
      first_courses: [],
      second_courses: []
    };
    onEdit(emptyTemplate);
    onNext();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Select Menu Template</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {selectedDates && (
                <>
                  Scheduling for: {selectedDates.from.toLocaleDateString()}
                  {selectedDates.to !== selectedDates.from && 
                    ` - ${selectedDates.to.toLocaleDateString()}`
                  }
                </>
              )}
            </p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {defaultTemplate && (
            <Card className="border-2 border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {defaultTemplate.name}
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Default
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-2">First Courses</h3>
                    <ul className="space-y-1">
                      {defaultTemplate.first_courses.map((course) => (
                        <li key={course.id} className="text-sm">
                          {course.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Second Courses</h3>
                    <ul className="space-y-1">
                      {defaultTemplate.second_courses.map((course) => (
                        <li key={course.id} className="text-sm">
                          {course.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => onEdit(defaultTemplate)}
                    className="flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleUseTemplate(defaultTemplate)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {templates.filter(t => !t.is_default).map((template) => (
            <Card key={template.id}>
              {/* Similar structure to default template */}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}