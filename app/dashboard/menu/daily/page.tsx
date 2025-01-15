"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { Pencil } from "lucide-react";

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

// ----- DropdownMenu from shadcn/ui -----
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/* -------------------------------------------------------------------------
   1) Database & Local Types
------------------------------------------------------------------------- */
interface Database {
  public: {
    Tables: {
      daily_menus: {
        Row: {
          id: string;
          date: string;
          active: boolean;
          created_at: string;
          carried_forward: boolean;
          carried_from_id: string | null;
          price: number;
          scheduled_for: string;
          is_draft: boolean;
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
  price: number;
  scheduled_for: string;
  is_draft: boolean;
  daily_menu_items: DailyMenuItem[];
}

type MenusTodayTomorrow = {
  today: DailyMenu | null;
  tomorrow: DailyMenu | null;
};

/* -------------------------------------------------------------------------
   2) fetchMenus => returns "today" and "tomorrow"
------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------
   3) carryForwardMenu => duplicates today's record for tomorrow
------------------------------------------------------------------------- */
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
      price: fromMenu.price,
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
  const { error: itemsErr } = await supabase.from("daily_menu_items").insert(cloneItems);
  if (itemsErr) throw new Error(itemsErr.message);
}

/* -------------------------------------------------------------------------
   4) "Edit Tomorrow" Dialog => create/update tomorrow's entire menu
------------------------------------------------------------------------- */
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

  const [first, setFirst] = useState<{ id?: string; name: string }[]>([]);
  const [second, setSecond] = useState<{ id?: string; name: string }[]>([]);
  const [price, setPrice] = useState<number>(15);

  useEffect(() => {
    if (!menu) {
      setFirst([{ name: "" }]);
      setSecond([{ name: "" }]);
      setPrice(15);
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
      setPrice(menu.price ?? 15);
    }
  }, [menu]);

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

        // also update the menu's price
        const { error: upErr } = await supabase
          .from("daily_menus")
          .update({ price })
          .eq("id", menu.id);
        if (upErr) throw new Error(upErr.message);

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
        const { error: insErr } = await supabase.from("daily_menu_items").insert(items);
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
            scheduled_for: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            is_draft: false,
          })
          .select()
          .single();
        if (newErr) throw new Error(newErr.message);

        const newItems = [
          ...first.map((fc, i) => ({
            daily_menu_id: newRec.id,
            course_name: fc.name,
            course_type: "first" as const,
            display_order: i + 1,
          })),
          ...second.map((sc, i) => ({
            daily_menu_id: newRec.id,
            course_name: sc.name,
            course_type: "second" as const,
            display_order: i + 1,
          })),
        ];
        const { error: itmErr } = await supabase.from("daily_menu_items").insert(newItems);
        if (itmErr) throw new Error(itmErr.message);
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["todayAndTomorrowMenus"] });
      onClose();
    },
  });

  const saving = saveMutation.isPending;
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{menu ? "Edit Tomorrow" : "Create Tomorrow"}</DialogTitle>
          <DialogDescription>
            {menu
              ? "Adjust tomorrow’s items and price."
              : "Add new menu for tomorrow (default price = 15)."}
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

          {/* First */}
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

          {/* Second */}
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
          <Button disabled={saving} onClick={() => saveMutation.mutate()}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------
   5) The "MenuItemsList" with a DropdownMenu for each course
------------------------------------------------------------------------- */
function MenuItemsList({
  items,
  type,
  onEditItem,
}: {
  items: DailyMenuItem[];
  type: "first" | "second";
  onEditItem: (item: DailyMenuItem) => void;
}) {
  // If no items, no dropdown (the pencil won't show)
  return (
    <div>
      <div className="flex items-center gap-2">
        <b>{type === "first" ? "First" : "Second"}:</b>
        {items.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {items
                .sort((a, b) => a.display_order - b.display_order)
                .map((item) => (
                  <DropdownMenuItem key={item.id} onClick={() => onEditItem(item)}>
                    Edit: {item.course_name}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <ul className="list-disc ml-4">
        {items
          .sort((a, b) => a.display_order - b.display_order)
          .map((x) => (
            <li key={x.id}>{x.course_name}</li>
          ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------
   6) Single-Item Editor => rename or switch course type
------------------------------------------------------------------------- */
function EditSingleItemDialog({
  isOpen,
  item,
  onClose,
}: {
  isOpen: boolean;
  item: DailyMenuItem | null;
  onClose: () => void;
}) {
  const supabase = createClientComponentClient<Database>();
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [type, setType] = useState<"first" | "second">("first");

  useEffect(() => {
    if (item) {
      setName(item.course_name);
      setType(item.course_type);
    } else {
      setName("");
      setType("first");
    }
  }, [item]);

  const updateItemMut = useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!item) return;
      const { error } = await supabase
        .from("daily_menu_items")
        .update({ course_name: name, course_type: type })
        .eq("id", item.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["todayAndTomorrowMenus"] });
      onClose();
    },
  });

  const saving = updateItemMut.isPending;
  if (!isOpen) return null;

  // If we have no "item" to edit, just close
  if (!item) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit an Item</DialogTitle>
            <DialogDescription>No item selected.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit an Item</DialogTitle>
          <DialogDescription>Rename or switch the course type.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Label>Course Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Course Type</Label>
            <div className="flex gap-3 mt-1">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="type"
                  value="first"
                  checked={type === "first"}
                  onChange={() => setType("first")}
                />
                First
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="type"
                  value="second"
                  checked={type === "second"}
                  onChange={() => setType("second")}
                />
                Second
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => updateItemMut.mutate()}
            disabled={!name.trim() || saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------
   7) Main Page => merges everything
------------------------------------------------------------------------- */
export default function DailyMenusPage() {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();

  const [editTomorrowOpen, setEditTomorrowOpen] = useState(false);

  // For single-item editing
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DailyMenuItem | null>(null);

  // Query: fetch "today" & "tomorrow"
  const {
    data: { today, tomorrow } = { today: null, tomorrow: null },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todayAndTomorrowMenus"],
    queryFn: () => fetchMenus(supabase),
    staleTime: 30000,
  });

  // carry-forward
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

  // Called when user picks "Edit: X" in the dropdown
  function handleEditItem(item: DailyMenuItem) {
    setEditingItem(item);
    setEditItemOpen(true);
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Daily Menus (Dropdown Icon Edit)</h1>

      {/* ----- TODAY ----- */}
      <section className="border p-3 rounded">
        <h2 className="text-xl font-semibold">Today&apos;s Menu</h2>
        {today ? (
          <div className="mt-2">
            <strong>{today.date}</strong> (Active? {today.active ? "Yes" : "No"})
            <div className="text-sm mt-1 text-gray-600">Price: {today.price}€</div>
            {today.daily_menu_items?.length === 0 && (
              <p className="mt-1 text-gray-500 italic">No items</p>
            )}
            <div className="mt-3 flex gap-6">
              {/* First */}
              <MenuItemsList
                items={today.daily_menu_items.filter((i) => i.course_type === "first")}
                type="first"
                onEditItem={handleEditItem}
              />
              {/* Second */}
              <MenuItemsList
                items={today.daily_menu_items.filter((i) => i.course_type === "second")}
                type="second"
                onEditItem={handleEditItem}
              />
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => carryForwardMut.mutate(today)}
              disabled={carryForwardMut.isPending || !!tomorrow}
            >
              {carryForwardMut.isPending ? "Carrying..." : "Carry forward to Tomorrow"}
            </Button>
          </div>
        ) : (
          <p className="mt-2 text-gray-500 text-sm">No menu for today.</p>
        )}
      </section>

      {/* ----- TOMORROW ----- */}
      <section className="border p-3 rounded">
        <h2 className="text-xl font-semibold">Tomorrow&apos;s Menu</h2>
        {tomorrow ? (
          <div className="mt-2">
            <strong>{tomorrow.date}</strong> (Active? {tomorrow.active ? "Yes" : "No"})
            <div className="text-sm mt-1 text-gray-600">Price: {tomorrow.price}€</div>
            {tomorrow.carried_forward && (
              <p className="italic text-gray-500 text-sm">
                Carried from: {tomorrow.carried_from_id}
              </p>
            )}
            {tomorrow.daily_menu_items?.length === 0 && (
              <p className="mt-1 text-gray-500 italic">No items</p>
            )}
            <div className="mt-3 flex gap-6">
              {/* First */}
              <MenuItemsList
                items={tomorrow.daily_menu_items.filter((i) => i.course_type === "first")}
                type="first"
                onEditItem={handleEditItem}
              />
              {/* Second */}
              <MenuItemsList
                items={tomorrow.daily_menu_items.filter((i) => i.course_type === "second")}
                type="second"
                onEditItem={handleEditItem}
              />
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setEditTomorrowOpen(true)}>
              {today ? "Edit Tomorrow’s Menu" : "Create Tomorrow’s Menu"}
            </Button>
          </div>
        ) : (
          <div className="mt-2 text-sm text-gray-500">
            <p>
              No menu set for tomorrow. We&apos;ll reuse today&apos;s if you do nothing,
              or you can explicitly create it now:
            </p>
            <Button variant="outline" className="mt-2" onClick={() => setEditTomorrowOpen(true)}>
              Create Tomorrow&apos;s Menu
            </Button>
          </div>
        )}
      </section>

      {/* ----- EditTomorrowDialog ----- */}
      <EditTomorrowDialog
        isOpen={editTomorrowOpen}
        menu={tomorrow}
        onClose={() => setEditTomorrowOpen(false)}
      />

      {/* ----- Single-Item Editor Dialog ----- */}
      <EditSingleItemDialog
        isOpen={editItemOpen}
        item={editingItem}
        onClose={() => {
          setEditItemOpen(false);
          setEditingItem(null);
        }}
      />
    </main>
  );
}
