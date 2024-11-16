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