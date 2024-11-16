# Documentation for Selected Directories

Generated on: 2024-11-16 19:18:33

## Documented Directories:
- app/
- src/
- middleware.ts
- public/

## Directory Structure

```
app/
    ├── app/
        ├── (auth)/
            ├── invite/
            │   ├── page.tsx
            ├── login/
            │   ├── page.tsx
            ├── signup/
            │   ├── page.tsx
        │   
        │   ├── layout.tsx
        ├── api/
            ├── auth/
                ├── callback/
                │   ├── route.ts
                ├── signout/
                │   ├── route.ts
        ├── dashboard/
            ├── daily-menu/
            │   ├── page.tsx
            ├── images/
            │   ├── page.tsx
            ├── menu/
            │   ├── page.tsx
            ├── users/
            │   ├── page.tsx
        │   
        │   ├── layout.tsx
        │   ├── page.tsx
        ├── fonts/
        │   ├── GeistMonoVF.woff
        │   ├── GeistVF.woff
    │   
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx

src/
    ├── src/
        ├── components/
            ├── auth/
            │   ├── invite-form.tsx
            │   ├── login-form.tsx
            │   ├── signup-form.tsx
            ├── daily-menu/
            │   ├── CurrentMenuList.tsx
            │   ├── DailyMenuEditor.tsx
            │   ├── MenuDateSelection.tsx
            │   ├── MenuHeader.tsx
            │   ├── MenuList.tsx
            │   ├── MenuTemplateSelection.tsx
            ├── data/
            │   ├── data-entry.tsx
            │   ├── data-management.tsx
            │   ├── data-table.tsx
            │   ├── edit-form.tsx
            │   ├── table-actions.tsx
            ├── image/
            │   ├── ImageGallery.tsx
            │   ├── ImageUpload.tsx
            │   ├── types.ts
            │   ├── utils.ts
            ├── menu/
            │   ├── ImageSelector.tsx
            │   ├── MenuCard.tsx
            │   ├── MenuEditor.tsx
            │   ├── MenuNav.tsx
            │   ├── MenuSearch.tsx
            ├── ui/
            │   ├── alert-dialog.tsx
            │   ├── badge.tsx
            │   ├── button.tsx
            │   ├── calendar.tsx
            │   ├── card.tsx
            │   ├── command.tsx
            │   ├── dialog.tsx
            │   ├── dropdown-menu.tsx
            │   ├── form.tsx
            │   ├── input.tsx
            │   ├── label.tsx
            │   ├── popover.tsx
            │   ├── select.tsx
            │   ├── switch.tsx
            │   ├── table.tsx
            │   ├── tabs.tsx
            │   ├── textarea.tsx
            │   ├── toast.tsx
            │   ├── toaster.tsx
            │   ├── tooltip.tsx
            │   ├── use-toast.tsx
            ├── users/
            │   ├── invite-user.tsx
            │   ├── users-table.tsx
        ├── lib/
            ├── supabase/
            │   ├── client.ts
            │   ├── menu.ts
            │   ├── server.ts
            │   ├── types.ts
        │   
        │   ├── utils.ts
        ├── types/
        │   ├── menu.ts

middleware.ts/
    ├── middleware.ts/

public/
    ├── public/
        ├── images/
        │   ├── placeholder-menu-item.jpg
        │   ├── placeholder-wine.jpg
    │   
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── vercel.svg
    │   ├── window.svg

```

## File Contents

### app/(auth)/invite/page.tsx

```typescript
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { InviteForm } from "@/components/auth/invite-form";

export const metadata: Metadata = {
  title: "Accept Invitation | Data Management App",
  description: "Accept your invitation and create an account",
};

export default async function InvitePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  if (!searchParams.token) {
    redirect("/login");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to the team
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete your account setup to get started
          </p>
        </div>
        <InviteForm token={searchParams.token} />
      </div>
    </div>
  );
}
```

### app/(auth)/login/page.tsx

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Data Management App",
  description: "Login to your account",
};

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Data Management App
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform has transformed how we handle our data operations, making it both efficient and secure.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/signup"
              className="hover:text-brand underline underline-offset-4"
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### app/(auth)/signup/page.tsx

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | Data Management App",
  description: "Create a new account",
};

export default async function SignUpPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Data Management App
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Join our platform to streamline your data management process with powerful tools and intuitive interfaces.&rdquo;
            </p>
            <footer className="text-sm">Alex Thompson</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <SignUpForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="hover:text-brand underline underline-offset-4"
            >
              Already have an account? Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### app/(auth)/layout.tsx

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
```

### app/api/auth/callback/route.ts

```typescript
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", request.url));
}

export const dynamic = "force-dynamic";
```

### app/api/auth/signout/route.ts

```typescript
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to login page
  return NextResponse.redirect(new URL("/login", request.url));
}
```

### app/dashboard/daily-menu/page.tsx

```typescript
'use client';

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2, CalendarDays, ListTodo } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DateSelection } from "@/components/daily-menu/MenuDateSelection";
import { MenuTemplateSelection } from "@/components/daily-menu/MenuTemplateSelection";
import { Button } from "@/components/ui/button";
import { CurrentMenuList } from "@/components/daily-menu/CurrentMenuList";

/**
 * Interface representing a base menu item.
 */
interface BaseMenuItem {
  id: number;
  daily_menu_id: number;
  name: string;
  display_order: number;
}

/**
 * Interface representing a daily menu.
 */
interface DailyMenu {
  id: number;
  date: string;
  price: number;
  active: boolean;
  created_at: string;
  first_courses: BaseMenuItem[];
  second_courses: BaseMenuItem[];
}

/**
 * Interface representing a template menu item.
 */
interface TemplateMenuItem {
  id: number;
  name: string;
  display_order: number;
}

/**
 * Interface representing a menu template.
 */
interface MenuTemplate {
  id: string;
  name: string;
  first_courses: TemplateMenuItem[];
  second_courses: TemplateMenuItem[];
  is_default?: boolean;
  created_at?: string;
}

/**
 * Type representing the current step in the scheduling process.
 */
type ScheduleStep = 'select-date' | 'select-menu' | 'customize' | 'confirm';

/**
 * The main component for managing daily menus.
 */
export default function DailyMenuPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'schedule'>('current');
  const [currentStep, setCurrentStep] = useState<ScheduleStep>('select-date');
  const [selectedDates, setSelectedDates] = useState<{ from: Date; to: Date } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MenuTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  /**
   * Function to verify the integrity and completeness of the menu template data.
   * @param template - The menu template to validate.
   * @returns An array of error messages. If empty, the template is valid.
   */
  

  /**
   * Function to load existing menus from Supabase.
   */
  const loadMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: dailyMenus, error: menusError } = await supabase
        .from('daily_menus')
        .select('*')
        .order('date', { ascending: false });

      if (menusError) throw menusError;

      const fullMenus = await Promise.all(dailyMenus.map(async (menu) => {
        const [firstCoursesResponse, secondCoursesResponse] = await Promise.all([
          supabase
            .from('daily_menu_first_courses')
            .select('*')
            .eq('daily_menu_id', menu.id)
            .order('display_order'),
          supabase
            .from('daily_menu_second_courses')
            .select('*')
            .eq('daily_menu_id', menu.id)
            .order('display_order')
        ]);

        if (firstCoursesResponse.error) throw firstCoursesResponse.error;
        if (secondCoursesResponse.error) throw secondCoursesResponse.error;

        return {
          ...menu,
          first_courses: firstCoursesResponse.data || [],
          second_courses: secondCoursesResponse.data || [],
        };
      }));

      setMenus(fullMenus);
    } catch (error) {
      console.error('Error loading menus:', error);
      toast({
        title: "Error",
        description: "Failed to load menus",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  /**
   * Handler for date selection.
   * @param dates - The selected date range.
   */
  const handleDateSelect = (dates: { from: Date; to: Date } | null) => {
    if (dates) {
      // Ensure the dates are set to midnight for consistent comparison
      const from = new Date(dates.from);
      const to = new Date(dates.to || dates.from); // If no 'to' date, use 'from' date
      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);
      
      setSelectedDates({ from, to });
    } else {
      setSelectedDates(null);
    }
  };

  /**
   * Handler for template selection.
   * @param template - The selected menu template.
   */
  const handleTemplateSelect = (template: MenuTemplate) => {
    setSelectedTemplate(template);
  };

  /**
   * Validates the selected menu template to ensure it meets required criteria.
   * @param template - The menu template to validate.
   */
  const validateTemplate = (template: MenuTemplate) => {
    if (!template.first_courses.length) {
      throw new Error('Template must have at least one first course');
    }
    if (!template.second_courses.length) {
      throw new Error('Template must have at least one second course');
    }
  };

  /**
   * Handler to navigate to the next step in the scheduling process.
   */
  const handleNextStep = () => {
    try {
      switch (currentStep) {
        case 'select-date':
          if (!selectedDates) {
            throw new Error('Please select dates first');
          }
          setCurrentStep('select-menu');
          break;
        case 'select-menu':
          if (!selectedTemplate) {
            throw new Error('Please select a menu template');
          }
          validateTemplate(selectedTemplate);
          setCurrentStep('customize');
          break;
        case 'customize':
          if (!selectedTemplate) {
            throw new Error('Please select a menu template');
          }
          validateTemplate(selectedTemplate);
          setCurrentStep('confirm');
          break;
        case 'confirm':
          handleScheduleComplete();
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    }
  };

  /**
   * Function to handle the completion of the scheduling process.
   * Validates the template, checks date ranges in Spain's timezone, creates menus and their courses with error handling.
   */
  const handleScheduleComplete = async () => {
    if (!selectedDates || !selectedTemplate) {
      toast({
        title: "Error",
        description: "Missing dates or template",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Starting schedule process...");
      setIsLoading(true);

      const spainTimeFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      // Get current date in Spain
      const serverDate = new Date();
      const spainCurrentDate = new Date(spainTimeFormatter.format(serverDate));
      spainCurrentDate.setHours(0, 0, 0, 0);

      // Create new Date objects for start and end
      const start = new Date(selectedDates.from);
      const end = new Date(selectedDates.to);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      console.log("Date Range:", {
        start: start.toISOString(),
        end: end.toISOString(),
        isRange: start.getTime() !== end.getTime()
      });

      let currentDate = new Date(start);
      let successCount = 0;
      const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      console.log(`Processing ${totalDays} days...`);

      // Process each date
      while (currentDate.getTime() <= end.getTime()) {
        const dateStr = spainTimeFormatter.format(currentDate);
        console.log(`Processing day ${successCount + 1} of ${totalDays}: ${dateStr}`);

        try {
          // Check for existing menu
          console.log("Checking for existing menu...");
          const { data: existingMenu, error: checkError } = await supabase
            .from("daily_menus")
            .select("id")
            .eq("date", dateStr)
            .single();

          if (checkError && checkError.code !== "PGRST116") { // Not found error code
            console.error("Menu check error:", checkError);
            throw new Error(checkError.message);
          }

          if (existingMenu) {
            console.log(`Menu already exists for ${dateStr}, skipping...`);
          } else {
            console.log("Creating new menu...");
            // Create menu
            const menuData = {
              date: dateStr,
              price: 13.0,
              active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            const { data: newMenu, error: menuError } = await supabase
              .from("daily_menus")
              .insert([menuData])
              .select()
              .single();

            if (menuError) {
              console.error("Menu creation error:", menuError);
              throw new Error(menuError.message);
            }

            console.log("Creating courses...");
            // Create courses data
            const firstCoursesData = selectedTemplate.first_courses.map((course, index) => ({
              daily_menu_id: newMenu.id,
              name: course.name.trim(),
              display_order: course.display_order || index + 1,
              created_at: new Date().toISOString(),
            }));

            const secondCoursesData = selectedTemplate.second_courses.map((course, index) => ({
              daily_menu_id: newMenu.id,
              name: course.name.trim(),
              display_order: course.display_order || index + 1,
              created_at: new Date().toISOString(),
            }));

            // Insert courses
            const coursesPromises = await Promise.all([
              supabase.from("daily_menu_first_courses").insert(firstCoursesData),
              supabase.from("daily_menu_second_courses").insert(secondCoursesData),
            ]);

            const hasErrors = coursesPromises.some(result => result.error);
            if (hasErrors) {
              console.error("Course creation errors:", coursesPromises);
              // Cleanup the menu if course creation failed
              await supabase.from("daily_menus").delete().eq("id", newMenu.id);
              throw new Error("Failed to create courses");
            }

            successCount++;
            console.log(`Successfully created menu ${successCount} of ${totalDays}`);
          }

        } catch (error) {
          console.error("Error in menu creation loop:", error);
          throw error;
        }

        // Move to next date - IMPORTANT: Create a new date object
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        currentDate = nextDate;
      }

      console.log(`Completed processing ${successCount} menus`);
      toast({
        title: "Success",
        description: `Successfully created ${successCount} menu(s)`,
      });

      // Reset state and refresh
      setSelectedDates(null);
      setSelectedTemplate(null);
      setCurrentStep("select-date");
      setActiveTab("current");
      await loadMenus();

    } catch (error) {
      console.error("Final error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to schedule menu";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Function to render the content of the scheduling tab based on the current step.
   * @returns JSX element representing the current step's UI.
   */
  const renderScheduleContent = () => {
    switch (currentStep) {
      case 'select-date':
        return (
          <DateSelection
            onDateSelect={handleDateSelect}
            onNext={handleNextStep}
            existingMenus={menus.map(menu => ({
              date: menu.date,
              active: menu.active,
            }))}
          />
        );
      case 'select-menu':
        return (
          <MenuTemplateSelection
            selectedDates={selectedDates}
            onNext={handleNextStep}
            onEdit={handleTemplateSelect}
          />
        );
      case 'customize':
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Customize Menu</h2>
                  <p className="text-muted-foreground">
                    Selected dates: {selectedDates?.from.toLocaleDateString()} - {selectedDates?.to.toLocaleDateString()}
                  </p>
                </div>
                <Button onClick={handleNextStep}>Continue</Button>
              </div>
              {selectedTemplate && (
                <div>
                  <p className="mb-4 font-medium">Template: {selectedTemplate.name}</p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-2">First Courses</h3>
                      <ul className="space-y-1">
                        {selectedTemplate.first_courses.map(course => (
                          <li key={course.id} className="p-2 rounded-md hover:bg-muted">
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Second Courses</h3>
                      <ul className="space-y-1">
                        {selectedTemplate.second_courses.map(course => (
                          <li key={course.id} className="p-2 rounded-md hover:bg-muted">
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'confirm':
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Confirm Schedule</h2>
                  <p className="text-muted-foreground">
                    Selected dates: {selectedDates?.from.toLocaleDateString()} - {selectedDates?.to.toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  onClick={handleScheduleComplete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Menu"
                  )}
                </Button>
              </div>
              {selectedTemplate && (
                <div>
                  <p className="font-medium mb-4">Selected Template: {selectedTemplate.name}</p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-2">First Courses</h3>
                      <ul className="space-y-1 text-sm">
                        {selectedTemplate.first_courses.map(course => (
                          <li key={course.id} className="p-2 rounded-md hover:bg-muted">
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Second Courses</h3>
                      <ul className="space-y-1 text-sm">
                        {selectedTemplate.second_courses.map(course => (
                          <li key={course.id} className="p-2 rounded-md hover:bg-muted">
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  /**
   * Renders a loading spinner while data is being fetched or operations are in progress.
   */
  if (isLoading && currentStep !== 'confirm') { // Avoid hiding loader during scheduling
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  /**
   * Main render of the component, displaying navigation tabs and corresponding content.
   */
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Daily Menu Management</h1>
        <p className="text-muted-foreground">
          Manage and schedule your restaurant&apos;s daily menus
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'current' | 'schedule')}>
        <TabsList className="mb-4">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Current Menus
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Schedule Menu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {menus.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32">
                <p className="text-muted-foreground">No menus found</p>
              </CardContent>
            </Card>
          ) : (
            <CurrentMenuList menus={menus} onMenuUpdate={loadMenus} />
          )}
        </TabsContent>

        <TabsContent value="schedule">
          {renderScheduleContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

```

### app/dashboard/images/page.tsx

```typescript
"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/image/ImageUpload";
import { ImageGallery } from "@/components/image/ImageGallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { MenuCategory } from '@/components/image/types';

const MENU_CATEGORIES = [
  { value: 'arroces', label: 'Arroces' },
  { value: 'carnes', label: 'Carnes' },
  { value: 'del-huerto', label: 'Del Huerto' },
  { value: 'del-mar', label: 'Del Mar' },
  { value: 'para-compartir', label: 'Para Compartir' },
  { value: 'para-peques', label: 'Para Peques' },
  { value: 'para-veganos', label: 'Para Veganos' },
  { value: 'postres', label: 'Postres' }
] as const;

export default function ImagesPage() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('arroces');
  const [itemName, setItemName] = useState('');
  const [refreshGallery, setRefreshGallery] = useState(0); // Counter to trigger gallery refresh
  const { toast } = useToast();
  
  const handleUploadComplete = (url: string) => {
    setItemName('');
  };

  const handleUploadError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  };

  // Callback to refresh gallery
  const handleImageUploaded = useCallback(() => {
    setRefreshGallery(prev => prev + 1); // Increment counter to trigger refresh
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Image Management</h1>
        <p className="text-muted-foreground">
          Upload and manage images for menu items
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value as MenuCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MENU_CATEGORIES.map((category) => (
                        <SelectItem 
                          key={category.value} 
                          value={category.value}
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Item Name</label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <ImageUpload
                category={selectedCategory}
                itemName={itemName}
                onUploadComplete={handleUploadComplete}
                onError={handleUploadError}
                onItemNameChange={setItemName}
                onImageUploaded={handleImageUploaded}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as MenuCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {MENU_CATEGORIES.map((category) => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ImageGallery 
              category={selectedCategory} 
              refreshTrigger={refreshGallery} // Pass refresh trigger to gallery
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### app/dashboard/menu/page.tsx

```typescript
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import MenuNav from "@/components/menu/MenuNav";
import MenuSearch from "@/components/menu/MenuSearch";
import MenuCard from "@/components/menu/MenuCard";
import {
  getCategories,
  getAllergens,
  getMenuItems,
  getWines,
  createMenuItem,
  createWine,
  updateMenuItem,
  updateWine,
  deleteMenuItem,
  deleteWine,
  subscribeToMenuChanges,
  subscribeToWineChanges,
} from "@/lib/supabase/menu";
import type {
  MenuItem,
  Wine,
  Category,
  Allergen,
  MenuItemFormData,
  WineFormData,
  RealtimePayload,
} from "@/types/menu";

type TabType = "menu" | "wine";

type EditFormData = {
  menu: MenuItemFormData;
  wine: WineFormData;
}[TabType];

interface LoadingState {
  auth: boolean;
  categories: boolean;
  allergens: boolean;
  menuItems: boolean;
  wines: boolean;
}

interface ErrorState {
  auth?: string;
  categories?: string;
  allergens?: string;
  menuItems?: string;
  wines?: string;
}

export default function MenuPage() {
  // State management with correct types
  const [activeTab, setActiveTab] = useState<TabType>("menu");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loadingState, setLoadingState] = useState<LoadingState>({
    auth: true,
    categories: true,
    allergens: true,
    menuItems: true,
    wines: true,
  });
  const [errorState, setErrorState] = useState<ErrorState>({});

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);

  const { toast } = useToast();
  const supabase = createClientComponentClient();

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError) throw authError;
        if (!session) throw new Error("No authenticated session");

        console.log("Auth successful:", session.user.email);
        setLoadingState((prev) => ({ ...prev, auth: false }));
      } catch (error) {
        console.error("Auth error:", error);
        setErrorState((prev) => ({
          ...prev,
          auth:
            error instanceof Error ? error.message : "Authentication failed",
        }));
        setLoadingState((prev) => ({ ...prev, auth: false }));
      }
    };

    checkAuth();
  }, [supabase.auth]);

  // Data fetching
  useEffect(() => {
    const loadData = async () => {
      if (errorState.auth) return;

      const fetchData = async <T,>(
        key: keyof LoadingState,
        fetcher: () => Promise<T>,
        setter: (data: T) => void
      ) => {
        try {
          setLoadingState((prev) => ({ ...prev, [key]: true }));
          const data = await fetcher();
          setter(data);
          setLoadingState((prev) => ({ ...prev, [key]: false }));
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
          setErrorState((prev) => ({
            ...prev,
            [key]:
              error instanceof Error ? error.message : `Failed to load ${key}`,
          }));
          setLoadingState((prev) => ({ ...prev, [key]: false }));
        }
      };

      await Promise.all([
        fetchData("categories", getCategories, setCategories),
        fetchData("allergens", getAllergens, setAllergens),
        fetchData("menuItems", getMenuItems, setMenuItems),
        fetchData("wines", getWines, setWines),
      ]);
    };

    loadData();
  }, [errorState.auth]);

  // Real-time subscriptions
  useEffect(() => {
    if (Object.keys(errorState).length > 0) return;

    const menuUnsubscribe = subscribeToMenuChanges(
      (payload: RealtimePayload<MenuItem>) => {
        const { eventType, new: newRecord, old } = payload;

        setMenuItems((current) => {
          switch (eventType) {
            case "INSERT":
              return [...current, newRecord];
            case "UPDATE":
              return current.map((item) =>
                item.id === old.id ? newRecord : item
              );
            case "DELETE":
              return current.filter((item) => item.id !== old.id);
            default:
              return current;
          }
        });
      }
    );

    const wineUnsubscribe = subscribeToWineChanges(
      (payload: RealtimePayload<Wine>) => {
        const { eventType, new: newRecord, old } = payload;

        setWines((current) => {
          switch (eventType) {
            case "INSERT":
              return [...current, newRecord];
            case "UPDATE":
              return current.map((wine) =>
                wine.id === old.id ? newRecord : wine
              );
            case "DELETE":
              return current.filter((wine) => wine.id !== old.id);
            default:
              return current;
          }
        });
      }
    );

    return () => {
      menuUnsubscribe();
      wineUnsubscribe();
    };
  }, [errorState]);

  // Filtered items
  const filteredItems = useMemo(() => {
    const items = activeTab === "menu" ? menuItems : wines;
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !activeCategory || item.category_id === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeTab, menuItems, wines, searchQuery, activeCategory]);

  // CRUD handlers
  const handleCreate = async () => {
    try {
      if (activeTab === "menu") {
        const newItem = await createMenuItem({
          name: "Nuevo plato",
          description: "Descripción del plato",
          price: 0,
          category_id: activeCategory || categories[0]?.id || 0,
          image_path: "",
          allergens: [],
          active: true,
        });
        setEditingId(newItem.id);
      } else {
        const newWine = await createWine({
          name: "Nuevo vino",
          description: "Descripción del vino",
          bottle_price: 0,
          glass_price: 0,
          category_id: activeCategory || categories[0]?.id || 0,
          active: true,
        });
        setEditingId(newWine.id);
      }
    } catch (error) {
      console.error("Error creating item:", error);
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (id: number, data: EditFormData) => {
    try {
      if (activeTab === "menu") {
        await updateMenuItem(id, data as MenuItemFormData);
      } else {
        await updateWine(id, data as WineFormData);
      }
      setEditingId(null);
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (activeTab === "menu") {
        await deleteMenuItem(id);
      } else {
        await deleteWine(id);
      }
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  if (errorState.auth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Authentication Error</p>
          <p className="text-gray-600 mb-4">{errorState.auth}</p>
          <Button onClick={() => (window.location.href = "/login")}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  const isLoading = Object.values(loadingState).some(Boolean);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading menu data...</p>
        </div>
      </div>
    );
  }

  const hasErrors = Object.keys(errorState).length > 0;
  if (hasErrors) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Error Loading Data</p>
          <p className="text-gray-600 mb-4">
            {Object.values(errorState).filter(Boolean).join(", ")}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value as TabType)}
      >
        <div className="sticky top-0 z-50 bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="menu">Carta</TabsTrigger>
                <TabsTrigger value="wine">Vinos</TabsTrigger>
              </TabsList>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                {activeTab === "menu" ? "Nuevo plato" : "Nuevo vino"}
              </Button>
            </div>
            <MenuSearch
              onSearch={setSearchQuery}
              onCategoryFilter={setActiveCategory}
              categories={categories.filter((cat) =>
                activeTab === "menu"
                  ? !cat.name.toLowerCase().includes("vino")
                  : cat.name.toLowerCase().includes("vino")
              )}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <MenuNav
            categories={categories.filter((cat) =>
              activeTab === "menu"
                ? !cat.name.toLowerCase().includes("vino")
                : cat.name.toLowerCase().includes("vino")
            )}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            type={activeTab}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  type={activeTab}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  categories={categories}
                  allergens={activeTab === "menu" ? allergens : undefined}
                  isEditing={item.id === editingId}
                  onEditToggle={setEditingId}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No items found
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}

```

### app/dashboard/users/page.tsx

```typescript

import { createServerClient } from "@/lib/supabase/server";
import { UsersTable } from "@/components/users/users-table";
import InviteUser from "@/components/users/invite-user";

export default async function UsersPage() {
  const supabase = createServerClient();

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error:", error);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage your users here.</p>
        </div>
        <InviteUser />
      </div>
      <UsersTable initialData={users || []} />
    </div>
  );
}
```

### app/dashboard/layout.tsx

```typescript
"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Loader2,
  ImageIcon,
  MenuSquare,
  ClipboardList, // Added for menu link
  Wine // Added for wine menu
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Database } from "@/lib/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else if (session.user?.email) {
        setUserEmail(session.user.email);
      }
    };

    checkSession();
  }, [supabase, router]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });

      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userEmail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-4">
            <h1 className="text-lg font-semibold">Restaurant Dashboard</h1>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            {/* Menu Management Section */}
            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
                MENU MANAGEMENT
              </h2>
              <Link href="/dashboard/menu">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Menu Items
                </Button>
              </Link>
              <Link href="/dashboard/daily-menu">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <MenuSquare className="mr-2 h-4 w-4" />
                  Daily Menu
                </Button>
              </Link>
              <Link href="/dashboard/wine">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Wine className="mr-2 h-4 w-4" />
                  Wine List
                </Button>
              </Link>
            </div>

            {/* Assets Management Section */}
            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
                ASSETS
              </h2>
              <Link href="/dashboard/images">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Images
                </Button>
              </Link>
            </div>

            {/* Admin Section */}
            <div className="pt-4">
              <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
                ADMIN
              </h2>
              <Link href="/dashboard/users">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {userEmail}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="icon"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <main className="pl-64">
        <div className="h-full py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### app/dashboard/page.tsx

```typescript
import { createServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createServerClient();

  // Fetch user stats
  const { data: users } = await supabase
    .from('users')
    .select('*');

  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(user => user.active)?.length || 0;
  const inactiveUsers = totalUsers - activeUsers;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "Total registered users",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      description: "Users with active accounts",
    },
    {
      title: "Inactive Users",
      value: inactiveUsers,
      icon: UserX,
      description: "Users with inactive accounts",
    },
  ];

  return (
    <div className="container">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity or Additional Content */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### app/fonts/GeistMonoVF.woff

```woff
Error reading file: 'utf-8' codec can't decode byte 0xee in position 18: invalid continuation byte
```

### app/fonts/GeistVF.woff

```woff
Error reading file: 'utf-8' codec can't decode byte 0xdc in position 11: invalid continuation byte
```

### app/favicon.ico

```ico
Error reading file: 'utf-8' codec can't decode byte 0x96 in position 50: invalid start byte
```

### app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
@layer components {
  .menu-group-header {
    @apply transition-colors hover:bg-muted/80;
  }
  
  .badge-success {
    @apply bg-green-100 text-green-800 hover:bg-green-200;
  }
}
@layer components {
  .badge-success {
    @apply bg-green-100 text-green-800 hover:bg-green-200;
  }
}
@layer components {
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
  }

  .calendar-day {
    @apply relative aspect-square flex items-center justify-center text-sm transition-all;
  }

  .calendar-day:hover:not(:disabled) {
    @apply bg-primary/10;
  }

  .calendar-day[aria-selected="true"] {
    @apply bg-primary text-primary-foreground;
  }

  .calendar-day.day-range-start {
    @apply rounded-l-md;
  }

  .calendar-day.day-range-end {
    @apply rounded-r-md;
  }

  .calendar-day.day-range-middle {
    @apply bg-accent/50;
  }

  .calendar-navigation {
    @apply flex items-center justify-between mb-4;
  }

  .calendar-month-title {
    @apply text-lg font-semibold;
  }
}
```

### app/layout.tsx

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
```

### app/page.tsx

```typescript
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DataManagement } from "@/components/data/data-management";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: entries, error } = await supabase
    .from("data_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching entries:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
          <p className="text-muted-foreground">
            View and manage your data entries.
          </p>
        </div>

        <DataManagement initialData={entries || []} />
      </div>
    </div>
  );
}
```

### src/components/auth/invite-form.tsx

```typescript
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface InviteFormProps {
  token: string;
}

export function InviteForm({ token }: InviteFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [isVerifying, setIsVerifying] = React.useState(true);

  // Verify the invite token when component mounts
  React.useEffect(() => {
    async function verifyInviteToken() {
      try {
        // Verify the token with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'invite',
        });

        if (error) {
          throw error;
        }

        setIsVerifying(false);
      } catch (error) {
        console.error('Error verifying invite:', error);
        toast({
          title: "Invalid Invitation",
          description: "This invitation link is invalid or has expired.",
          variant: "destructive",
        });
        router.push('/login');
      }
    }

    verifyInviteToken();
  }, [token, router, supabase.auth, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Accept the invitation and set the password
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your account has been set up successfully.",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p>Verifying invitation...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Create a password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirm your password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up account...
            </>
          ) : (
            "Complete setup"
          )}
        </Button>
      </form>
    </Form>
  );
}
```

### src/components/auth/login-form.tsx

```typescript
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });

      router.refresh();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}
```

### src/components/auth/signup-form.tsx

```typescript
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Please check your email to confirm your account.",
      });

      router.push("/login");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Create a password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirm your password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </Form>
  );
}
```

### src/components/daily-menu/CurrentMenuList.tsx

```typescript
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

```

### src/components/daily-menu/DailyMenuEditor.tsx

```typescript
// components/daily-menu/DailyMenuEditor.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

interface DailyMenuEditorProps {
  item?: MenuItem | null;
  onSave: (item: Partial<MenuItem>) => void;
  onCancel: () => void;
}

const MENU_CATEGORIES = [
  { value: 'arroces', label: 'Arroces' },
  { value: 'carnes', label: 'Carnes' },
  { value: 'del-huerto', label: 'Del Huerto' },
  { value: 'del-mar', label: 'Del Mar' },
  { value: 'para-compartir', label: 'Para Compartir' },
  { value: 'para-peques', label: 'Para Peques' },
  { value: 'para-veganos', label: 'Para Veganos' },
  { value: 'postres', label: 'Postres' }
] as const;

export function DailyMenuEditor({ item, onSave, onCancel }: DailyMenuEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'arroces',
    is_available: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        is_available: item.is_available,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      is_available: formData.is_available,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {MENU_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (€)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="is_available" className="block mb-2">Availability</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_available"
              checked={formData.is_available}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: checked }))}
            />
            <Label htmlFor="is_available">Available</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {item ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
}
```

### src/components/daily-menu/MenuDateSelection.tsx

```typescript
// components/daily-menu/DateSelection.tsx
'use client';

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ArrowRight,
  X,
  AlertCircle,
  Info,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Calendar Styles
const calendarStyles = {
  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
  month: "space-y-4",
  caption: "flex justify-center pt-1 relative items-center gap-2",
  caption_label: "text-sm font-medium",
  nav: "flex items-center gap-1",
  nav_button: cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium shadow-sm transition-colors",
    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted",
    "disabled:pointer-events-none disabled:opacity-30"
  ),
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-y-1",
  head_row: "flex",
  head_cell: cn(
    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] capitalize"
  ),
  row: "flex w-full mt-2",
  cell: cn(
    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
    "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
    "[&:has([aria-selected].day-outside)]:bg-accent/50",
    "[&:has([aria-selected].day-range-end)]:rounded-r-md"
  ),
  day: cn(
    "inline-flex items-center justify-center rounded-md text-sm transition-colors",
    "h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground",
    "aria-selected:opacity-100 hover:bg-primary/10",
    "disabled:pointer-events-none disabled:opacity-30",
    "focus:bg-primary focus:text-primary-foreground focus:outline-none"
  ),
  day_range_start: "day-range-start",
  day_range_end: "day-range-end",
  day_selected: cn(
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
    "focus:bg-primary focus:text-primary-foreground"
  ),
  day_today: "bg-accent/50 text-accent-foreground",
  day_outside: cn(
    "day-outside text-muted-foreground opacity-50",
    "aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30"
  ),
  day_disabled: "text-muted-foreground opacity-30",
  day_range_middle: cn(
    "aria-selected:bg-accent aria-selected:text-accent-foreground",
    "hover:bg-accent/50 hover:text-accent-foreground"
  ),
  day_hidden: "invisible",
};

interface DateSelectionProps {
  onDateSelect: (dates: { from: Date; to: Date } | null) => void;
  onNext: () => void;
  existingMenus?: { date: string; active: boolean }[];
  isLoading?: boolean;
}

type SelectionMode = 'single' | 'range';

type CalendarComponentProps = {
  mode: "single" | "range";
};
export function DateSelection({ 
  onDateSelect, 
  onNext, 
  existingMenus = [],
  isLoading = false 
}: DateSelectionProps) {
  const [mode, setMode] = useState<SelectionMode>('single');
  const [selected, setSelected] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);

  const existingMenuDates = existingMenus.map(menu => ({
    date: new Date(menu.date),
    active: menu.active
  }));

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    setError(null);

    if (!range?.from) {
      onDateSelect(null);
      return;
    }

    const effectiveRange = {
      from: range.from,
      to: mode === 'single' ? range.from : range.to || range.from
    };
    
    const conflictingDates = existingMenuDates.filter(menuDate => 
      menuDate.date.toDateString() === effectiveRange.from.toDateString() ||
      (effectiveRange.to && 
       menuDate.date.toDateString() === effectiveRange.to.toDateString())
    );

    if (conflictingDates.length > 0) {
      setError('Selected dates already have menus scheduled');
      return;
    }

    onDateSelect(effectiveRange);
  };

  const handleQuickSelect = (date: Date, days: number = 0) => {
    const from = date;
    const to = days > 0 ? addDays(date, days) : date;

    const conflictingDates = existingMenuDates.filter(menuDate => 
      isAfter(menuDate.date, from) && isBefore(menuDate.date, to)
    );

    if (conflictingDates.length > 0) {
      setError('Some selected dates already have menus scheduled');
      return;
    }

    const newRange = { from, to };
    setSelected(newRange);
    onDateSelect(newRange);
  };

  const handleClearSelection = () => {
    setSelected(undefined);
    setError(null);
    onDateSelect(null);
  };

  const handleNext = () => {
    if (!selected?.from) {
      setError('Please select a date');
      return;
    }
    onNext();
  };

  const CalendarComponent = ({ mode }: CalendarComponentProps) => {
    if (mode === "single") {
      return (
        <Calendar
          mode="single"
          selected={selected?.from}
          onSelect={(date: Date | undefined) => 
            handleSelect(date ? { from: date } : undefined)
          }
          numberOfMonths={2}
          disabled={{ before: new Date() }}
          modifiers={{
            booked: existingMenuDates.map(m => m.date),
            active: existingMenuDates.filter(m => m.active).map(m => m.date),
            today: new Date(),
          }}
          modifiersStyles={{
            booked: { 
              backgroundColor: '#cbd5e1',
              color: '#1e293b',
              transform: 'scale(0.95)',
              transition: 'all 0.2s ease'
            },
            active: { 
              backgroundColor: '#86efac',
              color: '#065f46',
              transform: 'scale(0.95)',
              transition: 'all 0.2s ease'
            },
            today: {
              fontWeight: 'bold',
              border: '2px solid currentColor'
            }
          }}
          locale={es}
          showOutsideDays={false}
          className="rounded-md border-none"
          classNames={{
            ...calendarStyles,
            day_today: cn(
              calendarStyles.day_today,
              "font-semibold border-2 border-primary"
            ),
            day_selected: cn(
              calendarStyles.day_selected,
              "hover:bg-primary/90 transition-all duration-200"
            )
          }}
          components={{
            IconLeft: ({ ...props }) => (
              <ChevronLeft className="h-4 w-4 stroke-2" {...props} />
            ),
            IconRight: ({ ...props }) => (
              <ChevronRight className="h-4 w-4 stroke-2" {...props} />
            ),
            DayContent: ({ date }: { date: Date }) => (
              <div
                className={cn(
                  "relative h-9 w-9 flex items-center justify-center",
                  "hover:bg-accent/20 rounded-md transition-colors",
                  existingMenuDates.some(m => 
                    m.date.toDateString() === date.toDateString()
                  ) && "cursor-not-allowed"
                )}
              >
                {date.getDate()}
                {existingMenuDates.some(m => 
                  m.date.toDateString() === date.toDateString() && m.active
                ) && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                )}
              </div>
            ),
          }}
        />
      );
    }

    return (
      <Calendar
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        numberOfMonths={2}
        disabled={{ before: new Date() }}
        modifiers={{
          booked: existingMenuDates.map(m => m.date),
          active: existingMenuDates.filter(m => m.active).map(m => m.date),
          today: new Date(),
        }}
        modifiersStyles={{
          booked: { 
            backgroundColor: '#cbd5e1',
            color: '#1e293b',
            transform: 'scale(0.95)',
            transition: 'all 0.2s ease'
          },
          active: { 
            backgroundColor: '#86efac',
            color: '#065f46',
            transform: 'scale(0.95)',
            transition: 'all 0.2s ease'
          },
          today: {
            fontWeight: 'bold',
            border: '2px solid currentColor'
          }
        }}
        locale={es}
        showOutsideDays={false}
        className="rounded-md border-none"
        classNames={{
          ...calendarStyles,
          day_today: cn(
            calendarStyles.day_today,
            "font-semibold border-2 border-primary"
          ),
          day_selected: cn(
            calendarStyles.day_selected,
            "hover:bg-primary/90 transition-all duration-200"
          )
        }}
        components={{
          IconLeft: ({ ...props }) => (
            <ChevronLeft className="h-4 w-4 stroke-2" {...props} />
          ),
          IconRight: ({ ...props }) => (
            <ChevronRight className="h-4 w-4 stroke-2" {...props} />
          ),
          DayContent: ({ date }: { date: Date }) => (
            <div
              className={cn(
                "relative h-9 w-9 flex items-center justify-center",
                "hover:bg-accent/20 rounded-md transition-colors",
                existingMenuDates.some(m => 
                  m.date.toDateString() === date.toDateString()
                ) && "cursor-not-allowed"
              )}
            >
              {date.getDate()}
              {existingMenuDates.some(m => 
                m.date.toDateString() === date.toDateString() && m.active
              ) && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
              )}
            </div>
          ),
        }}
      />
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Date(s)</CardTitle>
              <CardDescription>
                Choose when you want to schedule the menu
              </CardDescription>
            </div>
            <Badge
              variant={mode === "single" ? "default" : "secondary"}
              className="px-4 py-1 text-sm cursor-pointer hover:bg-primary/90"
              onClick={() => {
                setMode(mode === "single" ? "range" : "single");
                handleClearSelection();
              }}
            >
              {mode === "single" ? "Single Day" : "Date Range"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(new Date())}
              disabled={isLoading}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(addDays(new Date(), 1))}
              disabled={isLoading}
            >
              Tomorrow
            </Button>
            {mode === "range" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(new Date(), 6)}
                disabled={isLoading}
              >
                Next 7 Days
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {selected?.from && (
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {format(selected.from, "PPP", { locale: es })}
                    {selected.to && mode === "range" && (
                      <>
                        <ArrowRight className="inline mx-2 h-4 w-4" />
                        {format(selected.to, "PPP", { locale: es })}
                      </>
                    )}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-start gap-4 mb-6">
                <Info className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Select {mode === "single" ? "a date" : "a date range"} to
                  schedule the menu. Green dates indicate active menus, and gray
                  dates indicate inactive menus.
                </p>
              </div>

              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}

                <CalendarComponent mode={mode} />

                <div className="flex flex-wrap items-center gap-4 text-sm mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#86efac]" />
                    <span className="text-muted-foreground">Active Menu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
                    <span className="text-muted-foreground">Inactive Menu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary/20" />
                    <span className="text-muted-foreground">Selected</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-2">
              {selected?.from && (
                <Button
                  variant="outline"
                  onClick={handleClearSelection}
                  disabled={isLoading}
                >
                  Clear Selection
                </Button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handleNext}
                        disabled={!selected?.from || isLoading}
                        className="min-w-[120px]"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : !selected?.from ? (
                          "Select Date"
                        ) : (
                          <>
                            Next Step
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!selected?.from
                      ? "Please select a date first"
                      : "Proceed to menu selection"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### src/components/daily-menu/MenuHeader.tsx

```typescript
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
```

### src/components/daily-menu/MenuList.tsx

```typescript
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

interface MenuListProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

export function MenuList({ items, onEdit, onDelete }: MenuListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const getCategoryLabel = (value: string) => {
    return MENU_CATEGORIES.find(cat => cat.value === value)?.label || value;
  };

  const MENU_CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'arroces', label: 'Arroces' },
    { value: 'carnes', label: 'Carnes' },
    { value: 'del-huerto', label: 'Del Huerto' },
    { value: 'del-mar', label: 'Del Mar' },
    { value: 'para-compartir', label: 'Para Compartir' },
    { value: 'para-peques', label: 'Para Peques' },
    { value: 'para-veganos', label: 'Para Veganos' },
    { value: 'postres', label: 'Postres' }
  ] as const;

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {MENU_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                  No menu items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{getCategoryLabel(item.category)}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {item.description || '-'}
                  </TableCell>
                  <TableCell>{item.price.toFixed(2)}€</TableCell>
                  <TableCell>
                    <Switch
                      checked={item.is_available}
                      disabled
                      className="cursor-not-allowed"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="hover:bg-primary/5"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(item.id)}
                        className="hover:bg-destructive/5 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the menu item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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
```

### src/components/daily-menu/MenuTemplateSelection.tsx

```typescript
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
```

### src/components/data/data-entry.tsx

```typescript
import type { DbDataEntryWithUser } from '@/lib/supabase/client';

interface DataEntryListProps {
  entries: DbDataEntryWithUser[];
}

export function DataEntryList({ entries }: DataEntryListProps) {
  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <div key={entry.id} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">{entry.title}</h3>
          <p className="mt-2 text-gray-600">{entry.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            Created by: {entry.user.name} ({entry.user.email})
          </div>
        </div>
      ))}
    </div>
  );
}
```

### src/components/data/data-management.tsx

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data/data-table";
import { EditForm } from "@/components/data/edit-form";
import { useToast } from "../ui/use-toast";
import { Plus } from "lucide-react";

type DataEntry = {
  id: string;
  name: string;
  random_number: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
};

interface DataManagementProps {
  initialData: DataEntry[];
}

export function DataManagement({ initialData }: DataManagementProps) {
  const [data, setData] = useState<DataEntry[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleEdit = (entry: DataEntry) => {
    setEditingEntry(entry);
    setIsEditFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("data_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setData((prev) => prev.filter((entry) => entry.id !== id));
      toast({
        title: "Entry deleted",
        description: "The entry has been successfully deleted.",
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete the entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: { name: string; random_number: number }) => {
    try {
      setIsLoading(true);
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from("data_entries")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingEntry.id);

        if (error) throw error;

        toast({
          title: "Entry updated",
          description: "The entry has been successfully updated.",
        });
      } else {
        // Create new entry
        const { error } = await supabase
          .from("data_entries")
          .insert([
            {
              ...formData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (error) throw error;

        toast({
          title: "Entry created",
          description: "The new entry has been successfully created.",
        });
      }
      
      router.refresh();
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save the entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsEditFormOpen(false);
      setEditingEntry(null);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            setEditingEntry(null);
            setIsEditFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Entry
        </Button>
      </div>

      <DataTable
        data={data}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingEntry || undefined}
        isLoading={isLoading}
      />
    </>
  );
}
```

### src/components/data/data-table.tsx

```typescript
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { TableActions } from "./table-actions";

interface DataEntry {
  id: string;
  name: string;
  random_number: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

interface DataTableProps {
  data: DataEntry[];
  isLoading: boolean;
  onEdit: (entry: DataEntry) => void;
  onDelete: (id: string) => void;
}

export function DataTable({ data, isLoading, onEdit, onDelete }: DataTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Random Number</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.random_number}</TableCell>
              <TableCell>
                {new Date(entry.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <TableActions 
                  onEdit={() => onEdit(entry)}
                  onDelete={() => onDelete(entry.id)}
                />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

### src/components/data/edit-form.tsx

```typescript
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  random_number: z.coerce
    .number()
    .min(0, {
      message: "Number must be positive.",
    })
    .max(1000000, {
      message: "Number must be less than 1,000,000.",
    }),
});

type FormData = z.infer<typeof formSchema>;

interface EditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: {
    name: string;
    random_number: number;
  };
  isLoading?: boolean;
}

export function EditForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: EditFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      random_number: 0,
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Entry" : "Create New Entry"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter name" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="random_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Random Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      placeholder="Enter number"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### src/components/data/table-actions.tsx

```typescript
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function TableActions({ onEdit, onDelete }: TableActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the data
              entry from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

### src/components/image/ImageGallery.tsx

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MenuCategory } from './types';

interface ImageGalleryProps {
  category: MenuCategory;
  refreshTrigger: number;
}

interface ImageItem {
  name: string;
  url: string;
  updatedAt: string;
}

export function ImageGallery({ category, refreshTrigger }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const loadImages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: files, error: listError } = await supabase
        .storage
        .from('menu-images')
        .list(category);

      if (listError) throw listError;

      if (!files) {
        setImages([]);
        return;
      }

      // Filter for image files
      const imageFiles = files.filter(file => 
        !file.name.startsWith('.') && 
        file.name.match(/\.(jpg|jpeg|png|webp)$/i)
      );

      // Create signed URLs for each image
      const imageItems = await Promise.all(
        imageFiles.map(async (file) => {
          // Get a signed URL that's valid for 1 hour
          const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('menu-images')
            .createSignedUrl(`${category}/${file.name}`, 3600);

          if (signedUrlError) throw signedUrlError;

          return {
            name: file.name,
            url: signedUrlData.signedUrl,
            updatedAt: file.updated_at,
          };
        })
      );

      console.log('Loaded images:', imageItems); // Debug log
      setImages(imageItems);
    } catch (err) {
      console.error('Error loading images:', err);
      setError(err instanceof Error ? err.message : 'Error loading images');
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [category, refreshTrigger]);

  const handleDelete = async (imageName: string) => {
    try {
      const { error: deleteError } = await supabase
        .storage
        .from('menu-images')
        .remove([`${category}/${imageName}`]);

      if (deleteError) throw deleteError;

      setImages(current => current.filter(img => img.name !== imageName));
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No images found in {category}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div 
          key={image.name}
          className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
        >
          {/* Regular img tag with error handling */}
          <img
            src={image.url}
            alt={image.name.split('-')[0]} // Use the first part of the filename as alt text
            className="absolute inset-0 w-full h-full object-cover transition-all group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.error(`Failed to load image: ${image.url}`);
              // Set a fallback image or placeholder
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
            }}
          />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
            <p className="text-white text-sm text-center break-all">
              {image.name.split('-')[0]} {/* Display the first part of the filename */}
            </p>
            <button
              onClick={() => handleDelete(image.name)}
              className="flex items-center gap-1 text-white bg-red-500 px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### src/components/image/ImageUpload.tsx

```typescript
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { StorageError } from '@supabase/storage-js';
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  category: string;
  itemName: string;
  onUploadComplete: (url: string) => void;
  onError: (error: string) => void;
  onItemNameChange: (name: string) => void;
  onImageUploaded: () => void;
}

export function ImageUpload({ 
  category,
  itemName,
  onUploadComplete,
  onError,
  onItemNameChange,
  onImageUploaded
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file');
      return;
    }

    // File size validation (2MB)
    if (file.size > 2 * 1024 * 1024) {
      onError('Image size should be less than 2MB');
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setSelectedFile(file);

    // Set item name from file name
    const fileName = file.name.split('.')[0]
      .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
      .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
    onItemNameChange(fileName);

    return () => URL.revokeObjectURL(objectUrl);
  }, [onError, onItemNameChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile || !itemName) {
      onError('Please select an image and enter an item name');
      return;
    }

    setIsUploading(true);

    try {
      // Generate file name
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${itemName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      // Upload to Supabase
      const { data, error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      setIsUploading(false);
      setPreview(null);
      setSelectedFile(null);
      onItemNameChange(''); // Clear item name after successful upload
      onUploadComplete(publicUrl);
      onImageUploaded(); // Trigger refresh of gallery
      
      // Show success toast
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
        duration: 3000,
      });

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof StorageError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Failed to upload image';
      onError(errorMessage);
      
      // Show error toast
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    onItemNameChange(''); // Clear item name when clearing image
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out cursor-pointer",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-gray-300 hover:border-primary",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          {preview ? (
            <div className="relative w-40 h-40 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-40 h-40 rounded-lg bg-gray-50 flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
              ) : (
                <ImageIcon className="h-10 w-10 text-gray-400" />
              )}
            </div>
          )}

          <div className="text-center">
            {isUploading ? (
              <div className="text-sm text-gray-600">Uploading...</div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1">
                  <Upload className="h-4 w-4" />
                  <span className="font-medium">Drop image here or click to select</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG, PNG, WEBP (max 2MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {selectedFile && itemName && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isUploading}
          >
            Clear
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
```

### src/components/image/types.ts

```typescript
// src/components/image/types.ts
export type MenuCategory = 
  | 'arroces' 
  | 'carnes' 
  | 'del-huerto' 
  | 'del-mar' 
  | 'para-compartir' 
  | 'para-peques' 
  | 'para-veganos' 
  | 'postres';

export interface ImageUploadProps {
  category: MenuCategory;
  itemName: string;
  onUploadComplete: (url: string) => void;
  onError: (error: string) => void;
}

export interface FilePreview {
  file: File;
  preview: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
```

### src/components/image/utils.ts

```typescript
// components/image/utils.ts
import { ValidationResult } from './types';

export const validateFile = (file: File): ValidationResult => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPG, PNG or WebP files are allowed'
    };
  }

  // Check file size (2MB max)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File is too large. Maximum size is 2MB'
    };
  }

  return { isValid: true };
};

export const generateFileName = (itemName: string, originalName: string): string => {
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = itemName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')     // Remove special characters
    .trim()
    .replace(/\s+/g, '-');            // Replace spaces with hyphens

  const timestamp = Date.now();
  return `${cleanName}-${timestamp}.${extension}`;
};
```

### src/components/menu/ImageSelector.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Image {
  name: string;
  url: string;
  updatedAt: string;
}
// components/menu/ImageSelector.tsx
interface ImageSelectorProps {
  onSelect: (imagePath: string) => void;
  onClose: () => void;
  categoryId: string; // This needs to be string for SelectItem compatibility
}

const ImageSelector = ({ onSelect, onClose, categoryId }: ImageSelectorProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);

        // Get category info to get the folder name
        const { data: category, error: categoryError } = await supabase
          .from("categories")
          .select("name")
          .eq("id", categoryId)
          .single();

        if (categoryError) throw categoryError;

        // Convert category name to folder name format
        const folderName = category.name.toLowerCase().replace(/\s+/g, "-");

        // List files from the specific category folder
        const { data: files, error: listError } = await supabase
          .storage
          .from("menu-images")
          .list(folderName);

        if (listError) throw listError;

        if (!files) {
          setImages([]);
          return;
        }

        // Filter for image files and get signed URLs
        const imageFiles = await Promise.all(
          files
            .filter(file => 
              !file.name.startsWith(".") && 
              file.name.match(/\.(jpg|jpeg|png|webp)$/i)
            )
            .map(async (file) => {
              const { data: signedUrl } = await supabase
                .storage
                .from("menu-images")
                .createSignedUrl(`${folderName}/${file.name}`, 3600);

              return {
                name: file.name,
                url: signedUrl?.signedUrl || "",
                updatedAt: file.updated_at
              };
            })
        );

        setImages(imageFiles.filter(img => img.url));
      } catch (error) {
        console.error("Error loading images:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las imágenes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      loadImages();
    }
  }, [categoryId, supabase, toast]);

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
    }
  };

  const imageMotion = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Seleccionar imagen</DialogTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar imágenes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No se encontraron imágenes</p>
            {searchQuery && (
              <Button
                variant="ghost"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 -mx-6 px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
              {filteredImages.map((image) => (
                <motion.div
                  key={image.url}
                  {...imageMotion}
                  className={`
                    relative aspect-square rounded-lg overflow-hidden cursor-pointer
                    border-2 transition-colors
                    ${selectedImage === image.url 
                      ? "border-primary" 
                      : "border-transparent hover:border-muted"}
                  `}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {selectedImage === image.url && (
                    <div className="absolute inset-0 bg-primary/20" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedImage}
          >
            Seleccionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelector;
```

### src/components/menu/MenuCard.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Edit2, Trash2, Euro } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { MenuCardProps, MenuItem, Wine } from "@/types/menu";
import MenuEditor from "./MenuEditor";

// Constants for placeholder images
const PLACEHOLDER_MENU_ITEM = '/images/placeholder-menu-item.jpg';
const PLACEHOLDER_WINE = '/images/placeholder-wine.jpg';

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
  const [imageUrl, setImageUrl] = useState<string>(PLACEHOLDER_MENU_ITEM);
  const supabase = createClientComponentClient();

  const isMenuItem = (item: MenuItem | Wine): item is MenuItem => {
    return 'allergens' in item;
  };

  const isWine = (item: MenuItem | Wine): item is Wine => {
    return 'bottle_price' in item;
  };

  // Create and use layout effect to prevent initial image flash
  useEffect(() => {
    if (isEditing) {
      return;
    }

    const loadImage = async () => {
      if (!isMenuItem(item)) {
        setImageUrl(PLACEHOLDER_WINE);
        return;
      }

      try {
        const category = categories.find(c => c.id === item.category_id);
        if (!category) {
          setImageUrl(PLACEHOLDER_MENU_ITEM);
          return;
        }

        const folderName = category.name.toLowerCase().replace(/\s+/g, '-');
        
        const { data: files, error: listError } = await supabase
          .storage
          .from('menu-images')
          .list(folderName);

        if (listError || !files || files.length === 0) {
          setImageUrl(PLACEHOLDER_MENU_ITEM);
          return;
        }

        const matchingFile = files.find(file => {
          const fileName = file.name.split('.')[0].toLowerCase();
          const itemName = item.name.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '-');
          
          return fileName.includes(itemName) || itemName.includes(fileName);
        });

        if (!matchingFile) {
          setImageUrl(PLACEHOLDER_MENU_ITEM);
          return;
        }

        const { data } = await supabase
          .storage
          .from('menu-images')
          .createSignedUrl(`${folderName}/${matchingFile.name}`, 3600);

        if (data?.signedUrl) {
          setImageUrl(data.signedUrl);
          
          await supabase
            .from('menu_items')
            .update({ image_path: matchingFile.name })
            .eq('id', item.id);
        } else {
          setImageUrl(PLACEHOLDER_MENU_ITEM);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setImageUrl(PLACEHOLDER_MENU_ITEM);
      }
    };

    loadImage();
  }, [item, categories, supabase, isEditing]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(item.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategory = () => {
    const category = categories.find(c => c.id === item.category_id);
    return category?.name || 'Sin categoría';
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

  // Render MenuEditor separately to avoid image loading issues
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
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
      </div>
    );
  }

  return (
    <motion.div
      layout
      variants={motionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          priority
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageUrl(PLACEHOLDER_MENU_ITEM)}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

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
    </motion.div>
  );
};

export default MenuCard;
```

### src/components/menu/MenuEditor.tsx

```typescript
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
```

### src/components/menu/MenuNav.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion} from "framer-motion";
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
```

### src/components/menu/MenuSearch.tsx

```typescript
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
```

### src/components/ui/alert-dialog.tsx

```typescript
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

### src/components/ui/badge.tsx

```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-emerald-100 text-emerald-800 shadow hover:bg-emerald-100/80", // Added success variant
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

### src/components/ui/button.tsx

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

### src/components/ui/calendar.tsx

```typescript
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

```

### src/components/ui/card.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

### src/components/ui/command.tsx

```typescript
import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}

```

### src/components/ui/dialog.tsx

```typescript
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

```

### src/components/ui/dropdown-menu.tsx

```typescript
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

```

### src/components/ui/form.tsx

```typescript
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

### src/components/ui/input.tsx

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
export type { InputProps }
```

### src/components/ui/label.tsx

```typescript
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

### src/components/ui/popover.tsx

```typescript
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }

```

### src/components/ui/select.tsx

```typescript
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  className?: string;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 gap-2",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  className?: string;
  position?: "popper" | "item-aligned";
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {
  className?: string;
}

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Label
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
      {...props}
    />
  )
);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {
  className?: string;
}

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  )
);
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
```

### src/components/ui/switch.tsx

```typescript
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

```

### src/components/ui/table.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

```

### src/components/ui/tabs.tsx

```typescript
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

```

### src/components/ui/textarea.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

```

### src/components/ui/toast.tsx

```typescript
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

```

### src/components/ui/toaster.tsx

```typescript
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"  // Changed this import

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
```

### src/components/ui/tooltip.tsx

```typescript
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

```

### src/components/ui/use-toast.tsx

```typescript
import * as React from "react"
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Changed from const to type
type ActionTypes = {
  ADD_TOAST: "ADD_TOAST"
  UPDATE_TOAST: "UPDATE_TOAST"
  DISMISS_TOAST: "DISMISS_TOAST"
  REMOVE_TOAST: "REMOVE_TOAST"
}

const ACTION_TYPES: ActionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Action =
  | {
      type: ActionTypes["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionTypes["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionTypes["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionTypes["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: ACTION_TYPES.REMOVE_TOAST,
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)
  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case ACTION_TYPES.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case ACTION_TYPES.DISMISS_TOAST: {
      const { toastId } = action
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case ACTION_TYPES.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: ACTION_TYPES.UPDATE_TOAST,
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId: id })

  dispatch({
    type: ACTION_TYPES.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId }),
  }
}

export { useToast, toast }
```

### src/components/users/invite-user.tsx

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Loader2, UserPlus } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["user", "admin"]).default("user"),
});

type FormData = z.infer<typeof formSchema>;

export default function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const supabase = getSupabaseClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "user",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setIsOpen(false);
      
      // First, check if the user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', values.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError;
      }

      if (existingUser) {
        toast({
          title: "Error",
          description: "This email is already registered.",
          variant: "destructive",
        });
        return;
      }

      // Send the invitation
      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(values.email, {
        data: {
          role: values.role,
        },
      });

      if (inviteError) throw inviteError;

      // Create user record
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          email: values.email,
          role: values.role,
          name: values.email.split('@')[0], // Temporary name from email
          active: false, // Will be activated when user accepts invitation
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Invitation sent successfully.",
      });
      
      form.reset();
    } catch (error: unknown) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation.",
        variant: "destructive",
      });
      
      // Reopen the dialog if there was an error
      setIsOpen(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter email address" 
                      type="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      {...field}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### src/components/users/users-table.tsx

```typescript
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database, DbUser } from "@/lib/supabase/client";

interface UsersTableProps {
  initialData: DbUser[];
}

export function UsersTable({ initialData }: UsersTableProps) {
  const [users, setUsers] = useState<DbUser[]>(initialData);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const channel = supabase.channel('users_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users'
      }, (payload) => {
        console.log('Change received:', payload);
        
        if (payload.eventType === 'UPDATE') {
          const updatedUser = payload.new as DbUser;
          setUsers(currentUsers => 
            currentUsers.map(user => 
              user.id === updatedUser.id ? updatedUser : user
            )
          );
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleStatusChange = async (userId: string, active: boolean) => {
    try {
      setIsLoading(userId);

      const { error } = await supabase
        .from('users')
        .update({ 
          active,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Optimistic update
      setUsers(currentUsers => 
        currentUsers.map(user => 
          user.id === userId ? { ...user, active } : user
        )
      );

      toast({
        title: "Success",
        description: `User ${active ? 'activated' : 'deactivated'} successfully.`,
      });

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
      
      // Revert optimistic update on error
      setUsers(currentUsers => [...currentUsers]);
    } finally {
      setIsLoading(null);
    }
  };

  // Rest of your component remains the same...

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      {isLoading === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(user.id, !user.active)}
                      disabled={isLoading === user.id}
                    >
                      Mark as {user.active ? "Inactive" : "Active"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### src/lib/supabase/client.ts

```typescript

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          email: string;
          role?: string;
          active?: boolean;
        };
        Update: {
          name?: string;
          email?: string;
          role?: string;
          active?: boolean;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      data_entries: {
        Row: {
          id: string;
          title: string;
          content: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          content: string;
          user_id: string;
        };
        Update: {
          title?: string;
          content?: string;
          user_id?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_path: string;
          category_id: string;
          is_daily_menu: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          category_id: string;
          image_path?: string;
          is_daily_menu?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          category_id?: string;
          image_path?: string;
          is_daily_menu?: boolean;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string;
        };
        Update: {
          name?: string;
          description?: string;
          updated_at?: string;
        };
      };
      allergens: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
          updated_at?: string;
        };
      };
      menu_item_allergens: {
        Row: {
          id: string;
          menu_item_id: string;
          allergen_id: string;
          created_at: string;
        };
        Insert: {
          menu_item_id: string;
          allergen_id: string;
        };
        Update: {
          menu_item_id?: string;
          allergen_id?: string;
        };
      };
      daily_menus: {
        Row: {
          id: number;
          date: string;
          price: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          date: string;
          price: number;
          active?: boolean;
        };
        Update: {
          date?: string;
          price?: number;
          active?: boolean;
          updated_at?: string;
        };
      };
      daily_menu_first_courses: {
        Row: {
          id: number;
          daily_menu_id: number;
          name: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          daily_menu_id: number;
          name: string;
          display_order: number;
        };
        Update: {
          name?: string;
          display_order?: number;
        };
      };
      daily_menu_second_courses: {
        Row: {
          id: number;
          daily_menu_id: number;
          name: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          daily_menu_id: number;
          name: string;
          display_order: number;
        };
        Update: {
          name?: string;
          display_order?: number;
        };
      };
      wines: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category_id: string;
          grape_varieties: string;
          aging_info: string;
          denomination: string;
          image_path: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          category_id: string;
          grape_varieties?: string;
          aging_info?: string;
          denomination?: string;
          image_path?: string;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          category_id?: string;
          grape_varieties?: string;
          aging_info?: string;
          denomination?: string;
          image_path?: string;
          updated_at?: string;
        };
      };
      wine_categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string;
        };
        Update: {
          name?: string;
          description?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Helper Types
export type Tables = Database['public']['Tables'];
export type TableRow<T extends keyof Tables> = Tables[T]['Row'];

// Entity Types
export type DbUser = TableRow<'users'>;
export type DbProfile = TableRow<'profiles'>;
export type DbDataEntry = TableRow<'data_entries'>;
export type DbMenuItem = TableRow<'menu_items'>;
export type DbCategory = TableRow<'categories'>;
export type DbAllergen = TableRow<'allergens'>;
export type DbMenuItemAllergen = TableRow<'menu_item_allergens'>;
export type DbDailyMenu = TableRow<'daily_menus'>;
export type DbDailyMenuFirstCourse = TableRow<'daily_menu_first_courses'>;
export type DbDailyMenuSecondCourse = TableRow<'daily_menu_second_courses'>;
export type DbWine = TableRow<'wines'>;
export type DbWineCategory = TableRow<'wine_categories'>;

// Extended Types
export interface DbDataEntryWithUser extends DbDataEntry {
  user: DbUser;
}

export interface DbMenuItemWithRelations extends DbMenuItem {
  category: DbCategory;
  allergens: DbAllergen[];
}

export interface DbWineWithRelations extends DbWine {
  category: DbWineCategory;
}

// Create a singleton instance
let client: ReturnType<typeof createClientComponentClient<Database>>;

export const getSupabaseClient = () => {
  if (!client) {
    client = createClientComponentClient<Database>();
  }
  return client;
};
```

### src/lib/supabase/menu.ts

```typescript
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError} from "@supabase/supabase-js";
import type { 
  MenuItem, 
  Wine, 
  Category, 
  Allergen, 
  MenuItemFormData, 
  WineFormData,
  RealtimePayload
} from "@/types/menu";
import type { Database } from "@/lib/supabase/types";

// Define more specific types for the database responses
interface MenuItemWithRelations {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string | null;
  image_path: string | null;
  image_alt: string | null;
  image_thumbnail_path: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  menu_item_allergens: {
    allergen: {
      id: number;
      name: string;
    };
  }[];
}

interface WineWithRelations {
  id: number;
  name: string;
  description: string;
  bottle_price: number;
  glass_price: number;
  category_id: number;
  active: boolean;
  created_at: string;
  wine_categories: {
    id: number;
    name: string;
    display_order: number;
  } | null;
}

const supabase = createClientComponentClient<Database>();

// Helper function to check auth
const checkAuth = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw new Error(`Authentication error: ${error.message}`);
  if (!session) throw new Error('No authenticated session');
  return session;
};

// Helper to handle Supabase errors
const handleSupabaseError = (error: PostgrestError, operation: string): never => {
  console.error(`Error in ${operation}:`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint
  });
  throw new Error(`${operation} failed: ${error.message}`);
};

// Menu Items Operations
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    await checkAuth();
    console.log('Fetching menu items...');

    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_item_allergens!inner(
          allergen:allergens(*)
        )
      `)
      .order('name');

    if (error) handleSupabaseError(error, 'getMenuItems');
    if (!data) return [];

    const transformedData = data.map((item: MenuItemWithRelations) => ({
      ...item,
      allergens: item.menu_item_allergens.map(relation => relation.allergen.id)
    }));

    console.log(`Successfully fetched ${transformedData.length} menu items`);
    return transformedData;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in getMenuItems:', error.message);
      throw new Error(`Failed to get menu items: ${error.message}`);
    }
    throw new Error('An unknown error occurred while getting menu items');
  }
};

export const createMenuItem = async (data: MenuItemFormData): Promise<MenuItem> => {
  try {
    await checkAuth();
    console.log('Creating menu item:', data);

    const { data: item, error: itemError } = await supabase
      .from('menu_items')
      .insert([{
        name: data.name,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        image_url: data.image_url || null,
        image_path: data.image_path || null,
        image_alt: data.image_alt || null,
        image_thumbnail_path: data.image_thumbnail_path || null,
        active: data.active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (itemError) handleSupabaseError(itemError, 'createMenuItem');
    if (!item) throw new Error('Failed to create menu item');

    if (data.allergens?.length) {
      const allergenRelations = data.allergens.map(allergenId => ({
        menu_item_id: item.id,
        allergen_id: allergenId
      }));

      const { error: allergenError } = await supabase
        .from('menu_item_allergens')
        .insert(allergenRelations);

      if (allergenError) {
        await supabase.from('menu_items').delete().eq('id', item.id);
        handleSupabaseError(allergenError, 'createMenuItem allergens');
      }
    }

    return {
      ...item,
      allergens: data.allergens || []
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in createMenuItem:', error.message);
      throw new Error(`Failed to create menu item: ${error.message}`);
    }
    throw new Error('An unknown error occurred while creating menu item');
  }
};

export const updateMenuItem = async (id: number, data: Partial<MenuItemFormData>): Promise<MenuItem> => {
  try {
    await checkAuth();
    
    const updateData = {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.price && { price: data.price }),
      ...(data.category_id && { category_id: data.category_id }),
      ...(data.image_path && { image_path: data.image_path }),
      ...(typeof data.active !== 'undefined' && { active: data.active }),
      updated_at: new Date().toISOString()
    };

    const { data: item, error: itemError } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (itemError) handleSupabaseError(itemError, 'updateMenuItem');
    if (!item) throw new Error('Menu item not found');

    if (data.allergens) {
      const { error: deleteError } = await supabase
        .from('menu_item_allergens')
        .delete()
        .eq('menu_item_id', id);

      if (deleteError) handleSupabaseError(deleteError, 'updateMenuItem delete allergens');

      if (data.allergens.length > 0) {
        const allergenRelations = data.allergens.map(allergenId => ({
          menu_item_id: id,
          allergen_id: allergenId
        }));

        const { error: insertError } = await supabase
          .from('menu_item_allergens')
          .insert(allergenRelations);

        if (insertError) handleSupabaseError(insertError, 'updateMenuItem insert allergens');
      }
    }

    return {
      ...item,
      allergens: data.allergens || []
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in updateMenuItem:', error.message);
      throw new Error(`Failed to update menu item: ${error.message}`);
    }
    throw new Error('An unknown error occurred while updating menu item');
  }
};

export const deleteMenuItem = async (id: number): Promise<void> => {
  try {
    await checkAuth();
    
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error, 'deleteMenuItem');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in deleteMenuItem:', error.message);
      throw new Error(`Failed to delete menu item: ${error.message}`);
    }
    throw new Error('An unknown error occurred while deleting menu item');
  }
};

// Wine Operations
export const getWines = async (): Promise<Wine[]> => {
  try {
    await checkAuth();

    const { data, error } = await supabase
      .from('wines')
      .select(`
        *,
        wine_categories(*)
      `)
      .order('name');

    if (error) handleSupabaseError(error, 'getWines');
    if (!data) return [];

    const transformedData = data.map((wine: WineWithRelations) => ({
      ...wine,
      category: wine.wine_categories
    }));

    return transformedData;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in getWines:', error.message);
      throw new Error(`Failed to get wines: ${error.message}`);
    }
    throw new Error('An unknown error occurred while getting wines');
  }
};

export const createWine = async (data: WineFormData): Promise<Wine> => {
  try {
    await checkAuth();

    const { data: wine, error } = await supabase
      .from('wines')
      .insert([{
        name: data.name,
        description: data.description,
        bottle_price: data.bottle_price,
        glass_price: data.glass_price,
        category_id: data.category_id,
        active: data.active ?? true,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) handleSupabaseError(error, 'createWine');
    if (!wine) throw new Error('Failed to create wine');

    return wine;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in createWine:', error.message);
      throw new Error(`Failed to create wine: ${error.message}`);
    }
    throw new Error('An unknown error occurred while creating wine');
  }
};

export const updateWine = async (id: number, data: Partial<WineFormData>): Promise<Wine> => {
  try {
    await checkAuth();

    const { data: wine, error } = await supabase
      .from('wines')
      .update({
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.bottle_price && { bottle_price: data.bottle_price }),
        ...(data.glass_price && { glass_price: data.glass_price }),
        ...(data.category_id && { category_id: data.category_id }),
        ...(typeof data.active !== 'undefined' && { active: data.active })
      })
      .eq('id', id)
      .select()
      .single();

    if (error) handleSupabaseError(error, 'updateWine');
    if (!wine) throw new Error('Wine not found');

    return wine;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in updateWine:', error.message);
      throw new Error(`Failed to update wine: ${error.message}`);
    }
    throw new Error('An unknown error occurred while updating wine');
  }
};

export const deleteWine = async (id: number): Promise<void> => {
  try {
    await checkAuth();

    const { error } = await supabase
      .from('wines')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error, 'deleteWine');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in deleteWine:', error.message);
      throw new Error(`Failed to delete wine: ${error.message}`);
    }
    throw new Error('An unknown error occurred while deleting wine');
  }
};

// Category Operations
export const getCategories = async (): Promise<Category[]> => {
  try {
    await checkAuth();

    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) handleSupabaseError(error, 'getCategories');
    if (!data) return [];

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in getCategories:', error.message);
      throw new Error(`Failed to get categories: ${error.message}`);
    }
    throw new Error('An unknown error occurred while getting categories');
  }
};

// Allergen Operations
export const getAllergens = async (): Promise<Allergen[]> => {
  try {
    await checkAuth();

    const { data, error } = await supabase
      .from('allergens')
      .select('*')
      .order('name');

    if (error) handleSupabaseError(error, 'getAllergens');
    if (!data) return [];

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in getAllergens:', error.message);
      throw new Error(`Failed to get allergens: ${error.message}`);
    }
    throw new Error('An unknown error occurred while getting allergens');
  }
};

// Real-time subscriptions
export const subscribeToMenuChanges = (
  callback: (payload: RealtimePayload<MenuItem>) => void
): (() => void) => {
  try {
    const channel = supabase.channel('menu_changes')
      .on<MenuItem>(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'menu_items' 
        },
        (payload) => callback(payload as RealtimePayload<MenuItem>)
      )
      .subscribe((status: 'SUBSCRIBED' | 'CLOSED' | 'TIMED_OUT' | 'CHANNEL_ERROR', err?: Error) => {
        if (err) {
          console.error('Menu subscription error:', err);
        } else {
          console.log('Menu subscription status:', status);
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in subscribeToMenuChanges:', error.message);
      throw new Error(`Failed to subscribe to menu changes: ${error.message}`);
    }
    throw new Error('An unknown error occurred in menu subscription');
  }
};

export const subscribeToWineChanges = (
  callback: (payload: RealtimePayload<Wine>) => void
): (() => void) => {
  try {
    const channel = supabase.channel('wine_changes')
      .on<Wine>(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'wines' 
        },
        (payload) => callback(payload as RealtimePayload<Wine>)
      )
      .subscribe((status: 'SUBSCRIBED' | 'CLOSED' | 'TIMED_OUT' | 'CHANNEL_ERROR', err?: Error) => {
        if (err) {
          console.error('Wine subscription error:', err);
        } else {
          console.log('Wine subscription status:', status);
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in subscribeToWineChanges:', error.message);
      throw new Error(`Failed to subscribe to wine changes: ${error.message}`);
    }
    throw new Error('An unknown error occurred in wine subscription');
  }
};
```

### src/lib/supabase/server.ts

```typescript
import { createServerComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Database, DbDataEntryWithUser } from "./client";

// Cached server component client
export const createServerClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});

// Server action client (for use in Server Actions)
export const createActionClient = () => {
  const cookieStore = cookies();
  return createServerActionClient<Database>({ cookies: () => cookieStore });
};

// Cached session getter
export const getSession = cache(async () => {
  const supabase = createServerClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
});

// User profile getter with error handling
export const getUserProfile = cache(async () => {
  const session = await getSession();
  if (!session?.user.id) return null;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', session.user.id)
    .single();

  if (error) {
    console.error("Error:", error);
    return null;
  }

  return data;
});

// Data entries getter with pagination and error handling
export async function getDataEntries(page = 1, limit = 10) {
  const supabase = createServerClient();
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    const { data, error, count } = await supabase
      .from('data_entries')
      .select(`
        *,
        user:users!inner(*)
      `)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    return {
      data: data as unknown as DbDataEntryWithUser[],
      count: count || 0
    };
  } catch (error) {
    console.error("Error:", error);
    return { data: [], count: 0 };
  }
}

// Protected route session checker
export async function checkSession() {
  const session = await getSession();
  return !!session;
}
```

### src/lib/supabase/types.ts

```typescript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          email: string;
          role?: string;
          active?: boolean;
        };
        Update: {
          name?: string;
          email?: string;
          role?: string;
          active?: boolean;
          updated_at?: string;
        };
      };
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type User = Tables<'users'>;
```

### src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### src/types/menu.ts

```typescript
// src/types/menu.ts

// Basic Types
export interface MenuItem {
  id: number;              // Changed to number since it's bigint in DB
  name: string;
  description: string;
  price: number;
  image_url: string | null;     // Added from DB structure
  image_path: string | null;    // Made nullable
  image_alt: string | null;     // Added from DB structure
  image_thumbnail_path: string | null;  // Added from DB structure
  category_id: number;    // Changed to number
  active: boolean;       // Added from DB structure
  allergens: number[];   // Changed to number array
  created_at: string;
  updated_at: string;
}

export interface Wine {
  id: number;
  name: string;
  description: string;
  bottle_price: number;
  glass_price: number;
  category_id: number;
  active: boolean;
  created_at: string;
}


export interface Category {
  id: number;          // Changed to number
  name: string;
  display_order: number; // Added from DB structure
}

export interface Allergen {
  id: number;         // Changed to number
  name: string;
}

// Form Types
export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category_id: number;    // Changed to number
  image_url?: string;     // Made optional
  image_path?: string;    // Made optional
  image_alt?: string;     // Added
  image_thumbnail_path?: string;  // Added
  active?: boolean;       // Added
  allergens: number[];    // Changed to number array
}

export interface WineFormData {
  name: string;
  description: string;
  bottle_price: number;   // Changed to match DB
  glass_price: number;    // Changed to match DB
  category_id: number;    // Changed to number
  active?: boolean;       // Added
}

// Response Types
export interface MenuItemResponse {
  data: MenuItem | null;
  error: Error | null;
}

export interface WineResponse {
  data: Wine | null;
  error: Error | null;
}

// Props Types (keeping the same but updating types)
export interface MenuCardProps {
  item: MenuItem | Wine;
  type: 'menu' | 'wine';
  onEdit: (id: number, data: MenuItemFormData | WineFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  categories: Category[];
  allergens?: Allergen[];
  isEditing: boolean;
  onEditToggle: (id: number | null) => void;
}

export interface MenuNavProps {
  categories: Category[];
  activeCategory: number | null;  // Changed to number | null
  onCategoryChange: (id: number | null) => void;  // Changed to number | null
  type: 'menu' | 'wine';
}

export interface MenuSearchProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categoryId: number | null) => void;  // Changed to number | null
  categories: Category[];
}

export interface MenuEditorProps {
  item: MenuItem | Wine;
  type: 'menu' | 'wine';
  onSave: (data: MenuItemFormData | WineFormData) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  allergens?: Allergen[];
}

// Supabase Realtime Types
export interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: {
    id: number;  // Changed to number
  };
}
```

### public/images/placeholder-menu-item.jpg

```jpg
Error reading file: 'utf-8' codec can't decode byte 0xff in position 0: invalid start byte
```

### public/images/placeholder-wine.jpg

```jpg
Error reading file: 'utf-8' codec can't decode byte 0xff in position 0: invalid start byte
```

### public/file.svg

```svg
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
```

### public/globe.svg

```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
```

### public/next.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
```

### public/vercel.svg

```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
```

### public/window.svg

```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
```

