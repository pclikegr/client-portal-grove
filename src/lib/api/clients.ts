
import { supabase } from "@/integrations/supabase/client";
import { Client, CreateClientData, UpdateClientData } from "@/types/client";

const mapClient = (data: any): Client => ({
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
  return (data || []).map(mapClient);
};

export const getClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data ? mapClient(data) : null;
};

export const addClient = async (clientData: CreateClientData): Promise<Client> => {
  const { data: { user: { id: userId } } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('clients')
    .insert([{ ...clientData, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return mapClient(data);
};

export const updateClient = async (id: string, updates: UpdateClientData): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update({ ...updates })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapClient(data);
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
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`);

  if (error) throw error;
  return (data || []).map(mapClient);
};
