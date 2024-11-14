import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { 
  MenuItem, 
  Wine, 
  Category, 
  Allergen, 
  MenuItemFormData, 
  WineFormData 
} from "@/types/menu";

const supabase = createClientComponentClient();

// Types for real-time subscriptions
interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: {
    id: string;
  };
}

// Menu Items Operations
export const getMenuItems = async () => {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      allergens (id, name)
    `);

  if (error) throw error;
  return data as MenuItem[];
};

export const createMenuItem = async (data: MenuItemFormData) => {
  const { data: item, error } = await supabase
    .from('menu_items')
    .insert([{
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return item as MenuItem;
};

export const updateMenuItem = async (id: string, data: Partial<MenuItemFormData>) => {
  const { data: item, error } = await supabase
    .from('menu_items')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return item as MenuItem;
};

export const deleteMenuItem = async (id: string) => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Wine Operations
export const getWines = async () => {
  const { data, error } = await supabase
    .from('wines')
    .select('*');

  if (error) throw error;
  return data as Wine[];
};

export const createWine = async (data: WineFormData) => {
  const { data: wine, error } = await supabase
    .from('wines')
    .insert([{
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return wine as Wine;
};

export const updateWine = async (id: string, data: Partial<WineFormData>) => {
  const { data: wine, error } = await supabase
    .from('wines')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return wine as Wine;
};

export const deleteWine = async (id: string) => {
  const { error } = await supabase
    .from('wines')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Category Operations
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Category[];
};

// Allergen Operations
export const getAllergens = async () => {
  const { data, error } = await supabase
    .from('allergens')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Allergen[];
};

// Real-time subscriptions
export const subscribeToMenuChanges = (
  callback: (payload: RealtimePayload<MenuItem>) => void
): (() => void) => {
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
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToWineChanges = (
  callback: (payload: RealtimePayload<Wine>) => void
): (() => void) => {
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
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};