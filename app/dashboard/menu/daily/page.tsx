"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format, addDays } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* --------------------------------------------------------------------------------------
   1) Database & Local Types
-------------------------------------------------------------------------------------- */
interface Database {
  public: {
    Tables: {
      daily_menus: {
        Row: {
          id: string;
          date: string;
          active: boolean;
          created_at: string;
          carried_forward: boolean;       // NEW
          carried_from_id: string | null;// NEW
        };
      };
      daily_menu_items: {
        Row: {
          id: string;
          daily_menu_id: string;
          course_name: string;
          course_type: "first" | "second";
          display_order: number;
        };
      };
    };
  };
}

interface DailyMenuItem {
  id: string;
  daily_menu_id: string;
  course_name: string;
  course_type: "first" | "second";
  display_order: number;
}

interface DailyMenu {
  id: string;
  date: string;
  active: boolean;
  created_at: string;
  carried_forward: boolean;       
  carried_from_id: string | null; 
  daily_menu_items: DailyMenuItem[];
}

type MenusTodayTomorrow = {
  today: DailyMenu | null;
  tomorrow: DailyMenu | null;
};

interface EditableCourseItem {
  id?: string;
  name: string;
}

/* --------------------------------------------------------------------------------------
   2) fetchMenus => returns today & tomorrow in one shot
-------------------------------------------------------------------------------------- */
async function fetchMenus(
  supabase: ReturnType<typeof createClientComponentClient<Database>>
): Promise<MenusTodayTomorrow> {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("daily_menus")
    .select(`
      id,
      date,
      active,
      created_at,
      carried_forward,
      carried_from_id,
      daily_menu_items (
        id,
        daily_menu_id,
        course_name,
        course_type,
        display_order
      )
    `)
    .in("date", [todayStr, tomorrowStr]);

  if (error) throw new Error(error.message);

  let t: DailyMenu | null = null;
  let tm: DailyMenu | null = null;
  data?.forEach((row) => {
    if (row.date === todayStr) t = row as DailyMenu;
    else if (row.date === tomorrowStr) tm = row as DailyMenu;
  });
  return { today: t, tomorrow: tm };
}

/* --------------------------------------------------------------------------------------
   3) carryForwardMenu => duplicates one daily_menu into tomorrow
-------------------------------------------------------------------------------------- */
async function carryForwardMenu(
  supabase: ReturnType<typeof createClientComponentClient<Database>>,
  fromMenu: DailyMenu
): Promise<void> {
  const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");

  // Insert a new tomorrow record referencing old
  const { data: newRec, error: newErr } = await supabase
    .from("daily_menus")
    .insert({
      date: tomorrowStr,
      active: true,
      carried_forward: true,
      carried_from_id: fromMenu.id,
    })
    .select()
    .single();

  if (newErr) throw new Error(newErr.message);

  // Copy items
  const cloneItems = fromMenu.daily_menu_items.map((item) => ({
    daily_menu_id: newRec.id,
    course_name: item.course_name,
    course_type: item.course_type,
    display_order: item.display_order,
  }));
  const { error: itemsErr } = await supabase
    .from("daily_menu_items")
    .insert(cloneItems);
  if (itemsErr) throw new Error(itemsErr.message);
}

/* --------------------------------------------------------------------------------------
   4) Dialog for editing tomorrow (either existing or new)
-------------------------------------------------------------------------------------- */
function EditTomorrowDialog({
  isOpen,
  menu,
  onClose,
}: {
  isOpen: boolean;
  menu: DailyMenu | null;
  onClose: () => void;
}) {
  const supabase = createClientComponentClient<Database>();
  const qc = useQueryClient();
  const [first, setFirst] = useState<EditableCourseItem[]>([]);
  const [second, setSecond] = useState<EditableCourseItem[]>([]);

  // Init local arrays from the fetched menu
  useEffect(() => {
    if (!menu) {
      setFirst([{ name: "" }]);
      setSecond([{ name: "" }]);
    } else {
      const f = menu.daily_menu_items
        .filter((x) => x.course_type === "first")
        .sort((a, b) => a.display_order - b.display_order)
        .map((c) => ({ id: c.id, name: c.course_name }));
      const s = menu.daily_menu_items
        .filter((x) => x.course_type === "second")
        .sort((a, b) => a.display_order - b.display_order)
        .map((c) => ({ id: c.id, name: c.course_name }));
      setFirst(f.length ? f : [{ name: "" }]);
      setSecond(s.length ? s : [{ name: "" }]);
    }
  }, [menu]);

  // Insert or update tomorrow's menu
  const saveMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");
      if (menu) {
        // update existing tomorrow
        // clear old items
        const { error: delErr } = await supabase
          .from("daily_menu_items")
          .delete()
          .eq("daily_menu_id", menu.id);
        if (delErr) throw new Error(delErr.message);

        const newItems = [
          ...first.map((c, i) => ({
            daily_menu_id: menu.id,
            course_name: c.name,
            course_type: "first" as const,
            display_order: i + 1,
          })),
          ...second.map((c, i) => ({
            daily_menu_id: menu.id,
            course_name: c.name,
            course_type: "second" as const,
            display_order: i + 1,
          })),
        ];
        const { error: insErr } = await supabase
          .from("daily_menu_items")
          .insert(newItems);
        if (insErr) throw new Error(insErr.message);
      } else {
        // create brand-new tomorrow
        const { data: inserted, error: newErr } = await supabase
          .from("daily_menus")
          .insert({
            date: tomorrowStr,
            active: true,
            carried_forward: false,
            carried_from_id: null,
          })
          .select()
          .single();
        if (newErr) throw new Error(newErr.message);

        const tomorrowId = inserted.id as string;
        const newItems = [
          ...first.map((c, i) => ({
            daily_menu_id: tomorrowId,
            course_name: c.name,
            course_type: "first" as const,
            display_order: i + 1,
          })),
          ...second.map((c, i) => ({
            daily_menu_id: tomorrowId,
            course_name: c.name,
            course_type: "second" as const,
            display_order: i + 1,
          })),
        ];
        const { error: itemsErr } = await supabase
          .from("daily_menu_items")
          .insert(newItems);
        if (itemsErr) throw new Error(itemsErr.message);
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["todayAndTomorrowMenus"] });
      onClose();
    },
  });

  if (!isOpen) return null;
  const saving = saveMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{menu ? "Edit Tomorrow" : "Create Tomorrow"}</DialogTitle>
          <DialogDescription>
            {menu
              ? "Modify tomorrow’s items."
              : "Add brand-new items for tomorrow."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label>First Courses</Label>
            {first.map((fc, i) => (
              <div key={fc.id ?? `f-${i}`} className="flex gap-2 mt-2">
                <Input
                  value={fc.name}
                  onChange={(e) => {
                    const arr = [...first];
                    arr[i].name = e.target.value;
                    setFirst(arr);
                  }}
                />
                {first.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const arr = [...first];
                      arr.splice(i, 1);
                      setFirst(arr);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setFirst((arr) => [...arr, { name: "" }])}
            >
              + Add Another First
            </Button>
          </div>
          <div>
            <Label>Second Courses</Label>
            {second.map((sc, i) => (
              <div key={sc.id ?? `s-${i}`} className="flex gap-2 mt-2">
                <Input
                  value={sc.name}
                  onChange={(e) => {
                    const arr = [...second];
                    arr[i].name = e.target.value;
                    setSecond(arr);
                  }}
                />
                {second.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const arr = [...second];
                      arr.splice(i, 1);
                      setSecond(arr);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setSecond((arr) => [...arr, { name: "" }])}
            >
              + Add Another Second
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => saveMutation.mutate()} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------------------------------------------------------------
   5) Main Export => Page that references everything
-------------------------------------------------------------------------------------- */
export default function DailyMenusPage() {
  const supabase = createClientComponentClient<Database>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data = { today: null, tomorrow: null },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todayAndTomorrowMenus"],
    queryFn: () => fetchMenus(supabase),
    staleTime: 30000,
  });

  const carryForwardMut = useMutation<void, Error, DailyMenu>({
    mutationFn: async (fromMenu) => {
      await carryForwardMenu(supabase, fromMenu);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todayAndTomorrowMenus"] });
    },
  });

  if (isLoading) return <p>Loading menus...</p>;
  if (error) return <p className="text-red-500">Error: {(error as Error).message}</p>;

  const { today, tomorrow } = data;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Daily Menus (Carry-Forward)</h1>

      {/* TODAY */}
      <section className="border p-3 rounded">
        <h2 className="text-xl font-semibold">Today&apos;s Menu</h2>
        {today ? (
          <div className="mt-2">
            <strong>{today.date}</strong>, active={today.active ? "Yes" : "No"}
            {today.daily_menu_items?.length === 0 && (
              <p className="mt-1 text-gray-500 italic text-sm">No items</p>
            )}
            <div className="mt-2 flex gap-4">
              <div>
                <b>First:</b>
                <ul className="list-disc ml-4">
                  {today.daily_menu_items
                    .filter((it) => it.course_type === "first")
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((x) => <li key={x.id}>{x.course_name}</li>)}
                </ul>
              </div>
              <div>
                <b>Second:</b>
                <ul className="list-disc ml-4">
                  {today.daily_menu_items
                    .filter((it) => it.course_type === "second")
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((x) => <li key={x.id}>{x.course_name}</li>)}
                </ul>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => carryForwardMut.mutate(today)}
              disabled={carryForwardMut.isPending || tomorrow !== null}
            >
              {carryForwardMut.isPending ? "Carrying..." : "Carry forward to tomorrow"}
            </Button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">No menu defined for today</p>
        )}
      </section>

      {/* TOMORROW */}
      <section className="border p-3 rounded">
        <h2 className="text-xl font-semibold">Tomorrow&apos;s Menu</h2>
        {tomorrow ? (
          <div className="mt-2">
            <strong>{tomorrow.date}</strong>, active={tomorrow.active ? "Yes" : "No"}
            {tomorrow.carried_forward && (
              <p className="italic text-gray-500 text-sm">
                Carried forward from: {tomorrow.carried_from_id}
              </p>
            )}
            {tomorrow.daily_menu_items?.length === 0 && (
              <p className="mt-1 text-gray-500 italic text-sm">No items</p>
            )}
            <div className="mt-2 flex gap-4">
              <div>
                <b>First:</b>
                <ul className="list-disc ml-4">
                  {tomorrow.daily_menu_items
                    .filter((it) => it.course_type === "first")
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((x) => <li key={x.id}>{x.course_name}</li>)}
                </ul>
              </div>
              <div>
                <b>Second:</b>
                <ul className="list-disc ml-4">
                  {tomorrow.daily_menu_items
                    .filter((it) => it.course_type === "second")
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((x) => <li key={x.id}>{x.course_name}</li>)}
                </ul>
              </div>
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
              Edit Tomorrow&apos;s Menu
            </Button>
          </div>
        ) : (
          <div className="mt-2 text-sm text-gray-500">
            <p>
              No menu set for tomorrow. If you do nothing, we reuse today&apos;s menu.
              Or create tomorrow&apos;s menu now:
            </p>
            <Button variant="outline" className="mt-2" onClick={() => setDialogOpen(true)}>
              Create Tomorrow&apos;s Menu
            </Button>
          </div>
        )}
      </section>

      {/* The EditTomorrowDialog */}
      <EditTomorrowDialog isOpen={dialogOpen} menu={tomorrow} onClose={() => setDialogOpen(false)} />
    </main>
  );
}

/* --------------------------------------------------------------------------------------
   6) OPTIONAL: Edge Function + Cron in the SAME file (commented out)

   // Edge Function (Deno)
   // Just for reference, won't run in Next.js environment
   // supabase/functions/midnight-rollover/index.ts (INLINED as comment)
   // 
   // import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   // import { createClient } from "@supabase/supabase-js";
   // import { format, addDays } from "https://deno.land/std@0.168.0/datetime/mod.ts";
   // 
   // serve(async (_req) => {
   //   const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
   //   const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
   //   const supabase = createClient(supabaseUrl, supabaseKey);
   //   const todayStr = format(new Date(), "yyyy-MM-dd");
   //   const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");
   // 
   //   const { data: tomorrowMenu } = await supabase
   //     .from("daily_menus")
   //     .select("*")
   //     .eq("date", tomorrowStr)
   //     .single();
   //   
   //   if (!tomorrowMenu) {
   //     const { data: todayMenu } = await supabase
   //       .from("daily_menus")
   //       .select("*, daily_menu_items(*)")
   //       .eq("date", todayStr)
   //       .single();
   //     if (todayMenu) {
   //       await carryForwardMenu(supabase, todayMenu); // same carryForwardMenu logic
   //     }
   //   }
   // 
   //   return new Response(JSON.stringify({ success: true }), {
   //     headers: { "Content-Type": "application/json" },
   //   });
   // });

   // Cron Setup:
   // select
   //   cron.schedule(
   //     'carry-forward-daily-menu',
   //     '0 0 * * *', -- midnight
   //     $$
   //       select net.http_post(
   //         'https://YOUR-PROJECT.functions.supabase.co/midnight-rollover',
   //         '{}'::jsonb,
   //         'application/json'
   //       );
   //     $$
   //   );
-------------------------------------------------------------------------------------- */
