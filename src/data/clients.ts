
import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";

// Convert database timestamp strings to Date objects
const convertDatesToClient = (data: any): Client => ({
  ...data,
  created_at: new Date(data.created_at),
  updated_at: new Date(data.updated_at)
});

export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(convertDatesToClient);
};

export const getClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data ? convertDatesToClient(data) : null;
};

export const addClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Client> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('No authenticated user');
  }

  const { data, error } = await supabase
    .from('clients')
    .insert([{ ...clientData, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error adding client:', error);
    throw error;
  }

  return convertDatesToClient(data);
};

export const updateClient = async (id: string, updates: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>>): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return convertDatesToClient(data);
};

export const deleteClient = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const searchClients = async (query: string): Promise<Client[]> => {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term);
  
  if (!searchTerms.length) return getClients();
  
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`);

  if (error) throw error;
  return (data || []).map(convertDatesToClient);
};
