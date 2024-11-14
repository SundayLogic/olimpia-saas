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

// Menu Items Operations
export const getMenuItems = async (categoryId?: string) => {
  let query = supabase
    .from('menu_items')
    .select(`
      *,
      allergens (id, name)
    `);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

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
  return item;
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
  return item;
};

export const deleteMenuItem = async (id: string) => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Wine Operations
export const getWines = async (categoryId?: string) => {
  let query = supabase.from('wines').select('*');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

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
  return wine;
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
  return wine;
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
export const subscribeToMenuChanges = (callback: (payload: any) => void) => {
  const channel = supabase.channel('menu_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'menu_items' },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToWineChanges = (callback: (payload: any) => void) => {
  const channel = supabase.channel('wine_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'wines' },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};