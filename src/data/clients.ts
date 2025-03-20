
import { Client, CreateClientData, UpdateClientData } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/use-toast';

// Helper function to convert Supabase response to Client type
const mapToClient = (data: any): Client => {
  return {
    id: data.id,
    user_id: data.user_id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    company: data.company || '',
    position: data.position || '',
    address: data.address || '',
    city: data.city || '',
    zip_code: data.zip_code || '',
    country: data.country || '',
    notes: data.notes || '',
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at)
  };
};

export const getClients = async (): Promise<Client[]> => {
  console.log("Fetching clients from Supabase");
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
    
    return Array.isArray(data) ? data.map(mapToClient) : [];
  } catch (error) {
    console.error("Error in getClients:", error);
    throw error;
  }
};

export const getClientById = async (id: string): Promise<Client | null> => {
  console.log(`Fetching client with id ${id} from Supabase`);
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching client by id:", error);
      return null;
    }
    
    return data ? mapToClient(data) : null;
  } catch (error) {
    console.error(`Error in getClientById for id ${id}:`, error);
    return null;
  }
};

export const addClient = async (clientData: CreateClientData): Promise<Client> => {
  console.log("Adding client to Supabase:", clientData);
  
  try {
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("You must be logged in to add a client");
    }
    
    const dataWithUserId = {
      ...clientData,
      user_id: session.user.id
    };
    
    const { data, error } = await supabase
      .from('clients')
      .insert([dataWithUserId])
      .select()
      .single();
    
    if (error) {
      console.error("Error adding client:", error);
      throw error;
    }
    
    console.log("Client added successfully:", data);
    return mapToClient(data);
  } catch (error) {
    console.error("Error in addClient:", error);
    throw error;
  }
};

export const updateClient = async (id: string, updates: UpdateClientData): Promise<Client> => {
  console.log(`Updating client ${id} in Supabase with:`, updates);
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating client:", error);
      throw error;
    }
    
    console.log(`Client ${id} updated successfully:`, data);
    return mapToClient(data);
  } catch (error) {
    console.error(`Error in updateClient for id ${id}:`, error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<boolean> => {
  console.log(`Deleting client ${id} from Supabase`);
  
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting client:", error);
      return false;
    }
    
    console.log(`Client ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error in deleteClient for id ${id}:`, error);
    return false;
  }
};

export const searchClients = async (query: string): Promise<Client[]> => {
  console.log(`Searching clients in Supabase with query: ${query}`);
  
  if (!query || query.trim() === '') {
    return getClients();
  }
  
  try {
    const searchTerm = query.toLowerCase().trim();
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
    
    if (error) {
      console.error("Error searching clients:", error);
      throw error;
    }
    
    console.log(`Search found ${data.length} clients matching "${query}"`);
    return Array.isArray(data) ? data.map(mapToClient) : [];
  } catch (error) {
    console.error(`Error in searchClients for query "${query}":`, error);
    return [];
  }
};
