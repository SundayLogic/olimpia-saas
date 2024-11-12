# Documentation for Selected Directories

Generated on: 2024-11-12 11:04:39

## Documented Directories:
- app/
- src/
- middleware.ts

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
            ├── ui/
            │   ├── alert-dialog.tsx
            │   ├── button.tsx
            │   ├── calendar.tsx
            │   ├── card.tsx
            │   ├── dialog.tsx
            │   ├── dropdown-menu.tsx
            │   ├── form.tsx
            │   ├── input.tsx
            │   ├── label.tsx
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
            │   ├── server.ts
            │   ├── types.ts
        │   
        │   ├── utils.ts

middleware.ts/
    ├── middleware.ts/

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
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  /**
   * Function to verify the integrity and completeness of the menu template data.
   * @param template - The menu template to validate.
   * @returns An array of error messages. If empty, the template is valid.
   */
  const verifyTemplateData = (template: MenuTemplate): string[] => {
    const errors: string[] = [];
    
    if (!template.id) errors.push('Template ID is missing');
    if (!template.name) errors.push('Template name is missing');
    
    // Verify first courses
    if (!Array.isArray(template.first_courses)) {
      errors.push('First courses must be an array');
    } else {
      template.first_courses.forEach((course, index) => {
        if (!course.name) errors.push(`First course ${index + 1} is missing a name`);
        if (typeof course.display_order !== 'number') {
          console.log('Missing display order for first course, will use index');
        }
      });
    }

    // Verify second courses
    if (!Array.isArray(template.second_courses)) {
      errors.push('Second courses must be an array');
    } else {
      template.second_courses.forEach((course, index) => {
        if (!course.name) errors.push(`Second course ${index + 1} is missing a name`);
        if (typeof course.display_order !== 'number') {
          console.log('Missing display order for second course, will use index');
        }
      });
    }

    return errors;
  };

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
   * Validates the template, checks date ranges against server time, creates menus and their courses with error handling.
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
      setIsLoading(true);

      // First get server timestamp to ensure we're using server time
      const { data: serverTimeData, error: serverTimeError } = await supabase
        .rpc('get_server_time');

      if (serverTimeError || !serverTimeData) {
        console.error('Error fetching server time:', serverTimeError);
        toast({
          title: "Error",
          description: "Failed to fetch server time",
          variant: "destructive",
        });
        return;
      }

      const serverDate = new Date(serverTimeData);
      serverDate.setUTCHours(0, 0, 0, 0);

      const start = new Date(selectedDates.from);
      const end = new Date(selectedDates.to);

      // Set time to midnight UTC
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(0, 0, 0, 0);

      // Calculate max date based on server time
      const maxDate = new Date(serverDate);
      maxDate.setUTCDate(maxDate.getUTCDate() + 7);

      console.log('Date validation:', {
        serverDate: serverDate.toISOString(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        maxAllowedDate: maxDate.toISOString()
      });

      // Validate date range against server time
      if (start < serverDate || end > maxDate) {
        toast({
          title: "Error",
          description: "Menus can only be created for dates between today and 7 days from now",
          variant: "destructive",
        });
        return;
      }

      let processDate = new Date(start);
      let successCount = 0;

      while (processDate <= end) {
        const dateStr = processDate.toISOString().split('T')[0];
        console.log('Processing date:', dateStr);

        try {
          // First check if menu exists
          const { data: existingMenu, error: checkError } = await supabase
            .from('daily_menus')
            .select('id')
            .eq('date', dateStr)
            .single();

          if (checkError && checkError.code !== 'PGRST116') { // Assuming PGRST116 is 'no data found'
            console.error('Menu check error:', checkError);
            throw new Error(checkError.message);
          }

          if (existingMenu) {
            console.log(`Menu already exists for ${dateStr}, skipping...`);
            processDate.setUTCDate(processDate.getUTCDate() + 1);
            continue;
          }

          // Create menu with explicit data
          const menuData = {
            date: dateStr,
            price: 13.0,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          console.log('Creating menu with data:', menuData);

          const { data: newMenu, error: menuError } = await supabase
            .from('daily_menus')
            .insert([menuData])
            .select()
            .single();

          if (menuError) {
            console.error('Menu creation error:', menuError);
            throw new Error(menuError.message);
          }

          if (!newMenu) {
            throw new Error('Menu created but no data returned');
          }

          console.log('Menu created:', newMenu);

          // Create courses in a transaction-like sequence
          const firstCoursesData = selectedTemplate.first_courses.map((course, index) => ({
            daily_menu_id: newMenu.id,
            name: course.name.trim(),
            display_order: course.display_order || index + 1,
            created_at: new Date().toISOString()
          }));

          const secondCoursesData = selectedTemplate.second_courses.map((course, index) => ({
            daily_menu_id: newMenu.id,
            name: course.name.trim(),
            display_order: course.display_order || index + 1,
            created_at: new Date().toISOString()
          }));

          // Insert courses
          const [firstCoursesResult, secondCoursesResult] = await Promise.all([
            supabase.from('daily_menu_first_courses').insert(firstCoursesData),
            supabase.from('daily_menu_second_courses').insert(secondCoursesData)
          ]);

          if (firstCoursesResult.error || secondCoursesResult.error) {
            // Rollback if either fails
            await supabase.from('daily_menus').delete().eq('id', newMenu.id);
            console.error('Courses insertion error:', {
              firstCoursesError: firstCoursesResult.error,
              secondCoursesError: secondCoursesResult.error
            });
            throw new Error('Failed to create courses');
          }

          console.log(`Successfully created menu for ${dateStr}`);
          successCount++;

        } catch (error) {
          console.error(`Error processing date ${dateStr}:`, error);
          throw new Error(`Failed to create menu for ${dateStr}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        processDate.setUTCDate(processDate.getUTCDate() + 1);
      }

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
      const errorMessage = error instanceof Error ? error.message : "Failed to schedule menu";
      console.error('Schedule error:', error);
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
                <Button onClick={handleScheduleComplete}>Schedule Menu</Button>
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
  if (isLoading) {
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
  MenuSquare, // Add this import for the menu icon
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
            <h1 className="text-lg font-semibold">Your App Name</h1>
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
            <Link href="/dashboard/users">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/dashboard/images">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Images
              </Button>
            </Link>
            {/* Add Daily Menu Link */}
            <Link href="/dashboard/daily-menu">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <MenuSquare className="mr-2 h-4 w-4" />
                Daily Menu
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
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  DragDropContext, 
  Draggable, 
  Droppable, 
  DropResult 
} from '@hello-pangea/dnd';
import { 
  createClientComponentClient 
} from '@supabase/auth-helpers-nextjs';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  GripVertical, 
  X 
} from 'lucide-react';

import { 
  Button 
} from "@/components/ui/button";
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
import { 
  Input 
} from "@/components/ui/input";
import { 
  Label 
} from "@/components/ui/label";
import { 
  Switch 
} from "@/components/ui/switch";
import { 
  useToast 
} from "@/components/ui/use-toast";
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
  const [isEditing, setIsEditing] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<number | null>(null);
  const [editedMenu, setEditedMenu] = useState<DailyMenu | null>(null);
  const [newFirstCourse, setNewFirstCourse] = useState('');
  const [newSecondCourse, setNewSecondCourse] = useState('');
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleEditMenu = (menu: DailyMenu) => {
    setEditedMenu({
      ...menu,
      first_courses: [...menu.first_courses],
      second_courses: [...menu.second_courses]
    });
    setIsEditing(true);
  };

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
    <div className="space-y-4">
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
          {menus.map((menu) => (
            <TableRow key={menu.id}>
              <TableCell>{format(new Date(menu.date), 'PP')}</TableCell>
              <TableCell>{menu.price.toFixed(2)}€</TableCell>
              <TableCell>
                <Switch
                  checked={menu.active}
                  onCheckedChange={async (checked) => {
                    const { error } = await supabase
                      .from('daily_menus')
                      .update({ active: checked })
                      .eq('id', menu.id);

                    if (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update menu status",
                        variant: "destructive",
                      });
                    } else {
                      onMenuUpdate();
                    }
                  }}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditMenu(menu)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMenuToDelete(menu.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Menu Dialog */}
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

      {/* Delete Menu Alert Dialog */}
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
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { format, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ArrowRight,
  X,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateSelectionProps {
  onDateSelect: (dates: { from: Date; to: Date } | null) => void;
  onNext: () => void;
  existingMenus?: { date: string; active: boolean }[];
}

type SelectionMode = 'single' | 'range';

export function DateSelection({ onDateSelect, onNext, existingMenus = [] }: DateSelectionProps) {
  const [mode, setMode] = useState<SelectionMode>('single');
  const [selected, setSelected] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Convert existingMenus dates to Date objects for calendar
  const existingMenuDates = existingMenus.map(menu => ({
    date: new Date(menu.date),
    active: menu.active
  }));

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    setError(null);

    if (range?.from) {
      // For single day selection, set the 'to' date same as 'from'
      const effectiveRange = {
        from: range.from,
        to: mode === 'single' ? range.from : range.to || range.from
      };
      
      // Validate if selected dates already have menus
      const conflictingDates = existingMenuDates.filter(menuDate => 
        isAfter(menuDate.date, effectiveRange.from) && 
        isBefore(menuDate.date, effectiveRange.to)
      );

      if (conflictingDates.length > 0) {
        setError('Some selected dates already have menus scheduled');
      }

      onDateSelect(effectiveRange);
    } else {
      onDateSelect(null);
    }
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

  const footer = (
    <div className="flex items-center gap-4 text-sm pt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#86efac]" />
        <span>Active Menu</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
        <span>Inactive Menu</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-primary/20" />
        <span>Selected</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Date(s)</CardTitle>
              <CardDescription>
                Choose when you want to schedule the menu
              </CardDescription>
            </div>
            <Select
              value={mode}
              onValueChange={(value: SelectionMode) => {
                setMode(value);
                handleClearSelection();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selection mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Day</SelectItem>
                <SelectItem value="range">Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected dates display */}
            {selected?.from && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {format(selected.from, 'PPP', { locale: es })}
                  {selected.to && mode === 'range' && (
                    <>
                      <ArrowRight className="inline mx-2 h-4 w-4" />
                      {format(selected.to, 'PPP', { locale: es })}
                    </>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Calendar */}
            <div className="border rounded-lg p-4">
              {mode === 'single' ? (
                <Calendar
                  mode="single"
                  selected={selected?.from}
                  onSelect={date => handleSelect(date ? { from: date } : undefined)}
                  numberOfMonths={2}
                  disabled={{ before: new Date() }}
                  modifiers={{
                    booked: existingMenuDates.map(m => m.date),
                    active: existingMenuDates.filter(m => m.active).map(m => m.date),
                  }}
                  modifiersStyles={{
                    booked: { backgroundColor: '#cbd5e1' },
                    active: { backgroundColor: '#86efac' },
                  }}
                  locale={es}
                  showOutsideDays={false}
                  className="rounded-md border"
                  footer={footer}
                />
              ) : (
                <Calendar
                  mode="range"
                  selected={selected}
                  onSelect={handleSelect}
                  numberOfMonths={2}
                  disabled={{ before: new Date() }}
                  modifiers={{
                    booked: existingMenuDates.map(m => m.date),
                    active: existingMenuDates.filter(m => m.active).map(m => m.date),
                  }}
                  modifiersStyles={{
                    booked: { backgroundColor: '#cbd5e1' },
                    active: { backgroundColor: '#86efac' },
                  }}
                  locale={es}
                  showOutsideDays={false}
                  className="rounded-md border"
                  footer={footer}
                />
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={handleClearSelection}
                disabled={!selected?.from}
              >
                Clear
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handleNext}
                        disabled={!selected?.from}
                      >
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!selected?.from ? 'Please select a date first' : 'Proceed to menu selection'}
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

export type DbUser = TableRow<'users'>;
export type DbProfile = TableRow<'profiles'>;
export type DbDataEntry = TableRow<'data_entries'>;

export interface DbDataEntryWithUser extends DbDataEntry {
  user: DbUser;
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

