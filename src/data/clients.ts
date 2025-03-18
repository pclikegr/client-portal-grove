import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";

export const clients: Client[] = [
  {
    id: "1",
    user_id: "1",
    first_name: "Γιώργος",
    last_name: "Παπαδόπουλος",
    email: "gpapadopoulos@example.com",
    phone: "69XXXXXXXX",
    company: "Τεχνολογίες ΑΕ",
    position: "Διευθυντής Ανάπτυξης",
    address: "Λεωφόρος Αθηνών 123",
    city: "Αθήνα",
    zip_code: "11743",
    country: "Ελλάδα",
    notes: "Σημαντικός πελάτης με μεγάλα έργα",
    created_at: new Date("2023-01-10"),
    updated_at: new Date("2023-01-10"),
  },
  {
    id: "2",
    user_id: "2",
    first_name: "Μαρία",
    last_name: "Κωνσταντίνου",
    email: "mkonstantinou@example.com",
    phone: "69XXXXXXXX",
    company: "Δίκτυα ΑΕ",
    position: "Οικονομική Διευθύντρια",
    address: "Λεωφόρος Κηφισίας 45",
    city: "Αθήνα",
    zip_code: "11523",
    country: "Ελλάδα",
    created_at: new Date("2023-02-15"),
    updated_at: new Date("2023-02-15"),
  },
  {
    id: "3",
    user_id: "3",
    first_name: "Ανδρέας",
    last_name: "Αντωνίου",
    email: "aantoniou@example.com",
    phone: "69XXXXXXXX",
    company: "Λογισμικό ΕΠΕ",
    position: "Τεχνικός Διευθυντής",
    address: "Ερμού 18",
    city: "Θεσσαλονίκη",
    zip_code: "54624",
    country: "Ελλάδα",
    created_at: new Date("2023-03-05"),
    updated_at: new Date("2023-03-05"),
  },
  {
    id: "4",
    user_id: "4",
    first_name: "Ελένη",
    last_name: "Παππά",
    email: "epappa@example.com",
    phone: "69XXXXXXXX",
    company: "Σχεδιασμός ΑΕ",
    position: "Υπεύθυνη Μάρκετινγκ",
    address: "Εγνατία 102",
    city: "Θεσσαλονίκη",
    zip_code: "54622",
    country: "Ελλάδα",
    created_at: new Date("2023-03-18"),
    updated_at: new Date("2023-03-18"),
  },
  {
    id: "5",
    user_id: "5",
    first_name: "Κώστας",
    last_name: "Δημητρίου",
    email: "kdimitriou@example.com",
    phone: "69XXXXXXXX",
    company: "Κατασκευές ΑΕ",
    position: "Γενικός Διευθυντής",
    address: "Αριστοτέλους 25",
    city: "Πάτρα",
    zip_code: "26221",
    country: "Ελλάδα",
    created_at: new Date("2023-04-07"),
    updated_at: new Date("2023-04-07"),
  },
];

let clientsData = [...clients];

export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
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

  return data;
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
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
  return data || [];
};
