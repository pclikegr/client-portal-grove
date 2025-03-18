
import { Client, CreateClientData, UpdateClientData } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";

// Convert database timestamp strings to Date objects
const convertDatesToClient = (data: any): Client => ({
  ...data,
  created_at: new Date(data.created_at),
  updated_at: new Date(data.updated_at)
});

export const getClients = async (): Promise<Client[]> => {
  console.log("Fetching clients from data/clients.ts");
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} clients`);
    return (data || []).map(convertDatesToClient);
  } catch (err) {
    console.error("Exception in getClients:", err);
    throw err;
  }
};

export const getClientById = async (id: string): Promise<Client | null> => {
  console.log(`Fetching client with id ${id} from data/clients.ts`);
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
    
    console.log(`Client data fetch result:`, data ? "found" : "not found");
    return data ? convertDatesToClient(data) : null;
  } catch (err) {
    console.error(`Exception in getClientById(${id}):`, err);
    throw err;
  }
};

export const addClient = async (clientData: CreateClientData): Promise<Client> => {
  console.log("Adding client from data/clients.ts:", clientData);
  
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting current user:', userError);
      throw userError;
    }
    
    if (!userData || !userData.user) {
      console.error('No authenticated user found');
      throw new Error('No authenticated user');
    }
    
    const userId = userData.user.id;
    console.log('Adding client for user:', userId);
    
    // Insert client with user_id
    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...clientData, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('Error adding client:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Failed to create client - no data returned');
    }

    console.log("Client added successfully:", data);
    return convertDatesToClient(data);
  } catch (error) {
    console.error("Error in addClient:", error);
    throw error;
  }
};

export const updateClient = async (id: string, updates: UpdateClientData): Promise<Client> => {
  console.log(`Updating client ${id} with:`, updates);
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
    
    console.log(`Client ${id} updated successfully`);
    return convertDatesToClient(data);
  } catch (err) {
    console.error(`Exception in updateClient(${id}):`, err);
    throw err;
  }
};

export const deleteClient = async (id: string): Promise<boolean> => {
  console.log(`Deleting client ${id}`);
  
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
    
    console.log(`Client ${id} deleted successfully`);
    return true;
  } catch (err) {
    console.error(`Exception in deleteClient(${id}):`, err);
    throw err;
  }
};

export const searchClients = async (query: string): Promise<Client[]> => {
  console.log(`Searching clients with query: ${query}`);
  
  try {
    if (!query || query.trim() === '') {
      return getClients();
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);

    if (error) {
      console.error("Error searching clients:", error);
      throw error;
    }
    
    console.log(`Search found ${data?.length || 0} clients matching "${query}"`);
    return (data || []).map(convertDatesToClient);
  } catch (err) {
    console.error("Exception in searchClients:", err);
    throw err;
  }
};
