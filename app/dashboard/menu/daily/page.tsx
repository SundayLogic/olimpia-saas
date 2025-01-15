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

/* -------------------------------------------------------------------------
   1) Database & Local Types
---------------------------------------------------------------------------- */
interface Database {
  public: {
    Tables: {
      daily_menus: {
        Row: {
          id: string;
          date: string;                   // e.g. "YYYY-MM-DD"
          active: boolean;
          created_at: string;
          carried_forward: boolean;       // new
          carried_from_id: string | null; // new
          price: number;                  // new
          scheduled_for: string;          // new
          is_draft: boolean;             // new
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
  price: number;               // added
  scheduled_for: string;       // added
  is_draft: boolean;           // added
  daily_menu_items: DailyMenuItem[];
}

interface EditableCourseItem {
  id?: string;
  name: string;
}

type MenusTodayTomorrow = {
  today: DailyMenu | null;
  tomorrow: DailyMenu | null;
};

/* -------------------------------------------------------------------------
   2) fetchMenus => returns "today" and "tomorrow" from DB
---------------------------------------------------------------------------- */
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
      price,
      scheduled_for,
      is_draft,
      daily_menu_items(
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

/* -------------------------------------------------------------------------
   3) carryForwardMenu => duplicates a daily_menus record (incl. price)
---------------------------------------------------------------------------- */
async function carryForwardMenu(
  supabase: ReturnType<typeof createClientComponentClient<Database>>,
  fromMenu: DailyMenu
): Promise<void> {
  const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const { data: newRec, error: newErr } = await supabase
    .from("daily_menus")
    .insert({
      date: tomorrowStr,
      active: true,
      carried_forward: true,
      carried_from_id: fromMenu.id,
      price: fromMenu.price, // copy price
      scheduled_for: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      is_draft: false,
    })
    .select()
    .single();

  if (newErr) throw new Error(newErr.message);

  // replicate items
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

/* -------------------------------------------------------------------------
   4) EditTomorrowDialog => create or update tomorrow's menu (incl. price)
---------------------------------------------------------------------------- */
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

  // Local state for courses & price
  const [first, setFirst] = useState<EditableCourseItem[]>([]);
  const [second, setSecond] = useState<EditableCourseItem[]>([]);
  const [price, setPrice] = useState<number>(15);

  // On open => fill from existing menu or defaults
  useEffect(() => {
    if (!menu) {
      setFirst([{ name: "" }]);
      setSecond([{ name: "" }]);
      setPrice(15); // default
    } else {
      // handle items
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

      // handle price
      setPrice(menu.price ?? 15);
    }
  }, [menu]);

  // Mutation => either create or update tomorrow
  const saveMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");

      if (menu) {
        // update existing tomorrow => clear items, re-insert
        const { error: delErr } = await supabase
          .from("daily_menu_items")
          .delete()
          .eq("daily_menu_id", menu.id);
        if (delErr) throw new Error(delErr.message);

        // update price & other fields
        const { error: upErr } = await supabase
          .from("daily_menus")
          .update({ price })
          .eq("id", menu.id);
        if (upErr) throw new Error(upErr.message);

        // insert items
        const items = [
          ...first.map((fc, i) => ({
            daily_menu_id: menu.id,
            course_name: fc.name,
            course_type: "first" as const,
            display_order: i + 1,
          })),
          ...second.map((sc, i) => ({
            daily_menu_id: menu.id,
            course_name: sc.name,
            course_type: "second" as const,
            display_order: i + 1,
          })),
        ];
        const { error: insErr } = await supabase
          .from("daily_menu_items")
          .insert(items);
        if (insErr) throw new Error(insErr.message);
      } else {
        // create brand-new tomorrow row
        const { data: newRec, error: newErr } = await supabase
          .from("daily_menus")
          .insert({
            date: tomorrowStr,
            active: true,
            carried_forward: false,
            carried_from_id: null,
            price,
            scheduled_for: format(
              addDays(new Date(), 1),
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
            ),
            is_draft: false,
          })
          .select()
          .single();
        if (newErr) throw new Error(newErr.message);

        // insert items
        const tomorrowId = newRec.id;
        const newItems = [
          ...first.map((fc, i) => ({
            daily_menu_id: tomorrowId,
            course_name: fc.name,
            course_type: "first" as const,
            display_order: i + 1,
          })),
          ...second.map((sc, i) => ({
            daily_menu_id: tomorrowId,
            course_name: sc.name,
            course_type: "second" as const,
            display_order: i + 1,
          })),
        ];
        const { error: itmErr } = await supabase
          .from("daily_menu_items")
          .insert(newItems);
        if (itmErr) throw new Error(itmErr.message);
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["todayAndTomorrowMenus"] });
      onClose();
    },
  });

  const saving = saveMutation.isPending;

  return isOpen ? (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {menu ? "Edit Tomorrow" : "Create Tomorrow"}
          </DialogTitle>
          <DialogDescription>
            {menu
              ? "Adjust tomorrow’s items and price."
              : "Add new menu for tomorrow with default price 15."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Price */}
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          {/* First courses */}
          <div>
            <Label>First Courses</Label>
            {first.map((fc, idx) => (
              <div key={fc.id ?? `f-${idx}`} className="flex gap-2 mt-2">
                <Input
                  value={fc.name}
                  onChange={(e) => {
                    const arr = [...first];
                    arr[idx].name = e.target.value;
                    setFirst(arr);
                  }}
                />
                {first.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const arr = [...first];
                      arr.splice(idx, 1);
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

          {/* Second courses */}
          <div>
            <Label>Second Courses</Label>
            {second.map((sc, idx) => (
              <div key={sc.id ?? `s-${idx}`} className="flex gap-2 mt-2">
                <Input
                  value={sc.name}
                  onChange={(e) => {
                    const arr = [...second];
                    arr[idx].name = e.target.value;
                    setSecond(arr);
                  }}
                />
                {second.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const arr = [...second];
                      arr.splice(idx, 1);
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
  ) : null;
}

/* -------------------------------------------------------------------------
   5) Main Export => Page
---------------------------------------------------------------------------- */
export default function DailyMenusPage() {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  // load "today" & "tomorrow" from supabase
  const {
    data = { today: null, tomorrow: null },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todayAndTomorrowMenus"],
    queryFn: () => fetchMenus(supabase),
    staleTime: 30000,
  });

  // For the carry-forward button
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
      <h1 className="text-2xl font-bold">Daily Menus (Price = 15 by default)</h1>

      {/* TODAY */}
      <section className="border p-3 rounded">
        <h2 className="text-xl font-semibold">Today&apos;s Menu</h2>
        {today ? (
          <div className="mt-2">
            <strong>{today.date}</strong>, active={today.active ? "Yes" : "No"}
            <div className="text-sm font-medium mt-1 text-gray-600">
              Price: {today.price}€
            </div>
            {today.daily_menu_items?.length === 0 && (
              <p className="mt-1 text-gray-500 italic text-sm">No items</p>
            )}
            {/* Display items */}
            <div className="mt-2 flex gap-4">
              <div>
                <b>First:</b>
                <ul className="list-disc ml-4">
                  {today.daily_menu_items
                    .filter((it) => it.course_type === "first")
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((x) => (
                      <li key={x.id}>{x.course_name}</li>
                    ))}
                </ul>
              </div>
              <div>
                <b>Second:</b>
                <ul className="list-disc ml-4">
                  {today.daily_menu_items
                    .filter((it) => it.course_type === "second")
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((x) => (
                      <li key={x.id}>{x.course_name}</li>
                    ))}
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
          <p className="mt-2 text-sm text-gray-500">No menu found for today.</p>
        )}
      </section>

      {/* TOMORROW */}
      <section className="border p-3 rounded">
        <h2 className="text-xl font-semibold">Tomorrow&apos;s Menu</h2>
        {tomorrow ? (
          <div className="mt-2">
            <strong>{tomorrow.date}</strong>, active={tomorrow.active ? "Yes" : "No"}
            <div className="text-sm font-medium mt-1 text-gray-600">
              Price: {tomorrow.price}€
            </div>
            {tomorrow.carried_forward && (
              <p className="italic text-gray-500 text-sm">
                Carried forward from: {tomorrow.carried_from_id}
              </p>
            )}
            {tomorrow.daily_menu_items?.length === 0 && (
              <p className="mt-1 text-gray-500 italic text-sm">No items</p>
            )}
            {/* Display items */}
            <div className="mt-2 flex gap-4">
              <div>
                <b>First:</b>
                <ul className="list-disc ml-4">
                  {tomorrow.daily_menu_items
                    .filter((it) => it.course_type === "first")
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((x) => (
                      <li key={x.id}>{x.course_name}</li>
                    ))}
                </ul>
              </div>
              <div>
                <b>Second:</b>
                <ul className="list-disc ml-4">
                  {tomorrow.daily_menu_items
                    .filter((it) => it.course_type === "second")
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((x) => (
                      <li key={x.id}>{x.course_name}</li>
                    ))}
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
              No menu set for tomorrow. We&apos;ll reuse today&apos;s if you do nothing, or
              create now:
            </p>
            <Button variant="outline" className="mt-2" onClick={() => setDialogOpen(true)}>
              Create Tomorrow&apos;s Menu
            </Button>
          </div>
        )}
      </section>

      <EditTomorrowDialog
        isOpen={dialogOpen}
        menu={tomorrow}
        onClose={() => setDialogOpen(false)}
      />
    </main>
  );
}
