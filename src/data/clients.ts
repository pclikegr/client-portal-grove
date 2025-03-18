
import { Client, CreateClientData, UpdateClientData } from "@/types/client";

// Mock client data
const initialClients: Client[] = [
  {
    id: "1",
    user_id: "user-1", // Added the required user_id property
    first_name: "Γιώργος",
    last_name: "Παπαδόπουλος",
    email: "g.papadopoulos@example.com",
    phone: "6977777777",
    address: "Λεωφ. Αλεξάνδρας 74",
    city: "Αθήνα",
    country: "Ελλάδα", // Changed 'state' to 'country' to match the Client type
    zip_code: "11634", // Changed 'zip' to 'zip_code' to match the Client type
    company: "Τεχνική Υποστήριξη ΑΕ",
    position: "Τεχνικός", // Added position field
    notes: "Τακτικός πελάτης με πολλές συσκευές",
    created_at: new Date("2023-05-10"),
    updated_at: new Date("2023-05-12")
  },
  {
    id: "2",
    user_id: "user-1", // Added the required user_id property
    first_name: "Μαρία",
    last_name: "Αντωνίου",
    email: "m.antoniou@example.com",
    phone: "6988888888",
    address: "Τσιμισκή 41",
    city: "Θεσσαλονίκη",
    country: "Ελλάδα", // Changed 'state' to 'country' to match the Client type
    zip_code: "54623", // Changed 'zip' to 'zip_code' to match the Client type
    company: "",
    position: "", // Added position field
    notes: "Προτιμά επικοινωνία μέσω email",
    created_at: new Date("2023-05-15"),
    updated_at: new Date("2023-05-15")
  },
  {
    id: "3",
    user_id: "user-1", // Added the required user_id property
    first_name: "Δημήτρης",
    last_name: "Κωνσταντίνου",
    email: "d.konstantinou@example.com",
    phone: "6999999999",
    address: "Κορίνθου 45",
    city: "Πάτρα",
    country: "Ελλάδα", // Changed 'state' to 'country' to match the Client type
    zip_code: "26223", // Changed 'zip' to 'zip_code' to match the Client type
    company: "Δημήτρης Κωνσταντίνου & ΣΙΑ ΟΕ",
    position: "Ιδιοκτήτης", // Added position field
    notes: "",
    created_at: new Date("2023-05-18"),
    updated_at: new Date("2023-05-18")
  }
];

// Keep track of clients in memory
let clients = [...initialClients];

export const getClients = async (): Promise<Client[]> => {
  console.log("Fetching clients from data/clients.ts");
  return [...clients];
};

export const getClientById = async (id: string): Promise<Client | null> => {
  console.log(`Fetching client with id ${id} from data/clients.ts`);
  const client = clients.find(client => client.id === id);
  return client || null;
};

export const addClient = async (clientData: CreateClientData): Promise<Client> => {
  console.log("Adding client from data/clients.ts:", clientData);
  
  const newClient: Client = {
    ...clientData,
    id: Date.now().toString(),
    user_id: "user-1", // Added the required user_id property
    created_at: new Date(),
    updated_at: new Date()
  };
  
  clients.push(newClient);
  console.log("Client added successfully:", newClient);
  return newClient;
};

export const updateClient = async (id: string, updates: UpdateClientData): Promise<Client> => {
  console.log(`Updating client ${id} with:`, updates);
  
  const index = clients.findIndex(client => client.id === id);
  
  if (index === -1) {
    throw new Error(`Client with id ${id} not found`);
  }
  
  const updatedClient: Client = {
    ...clients[index],
    ...updates,
    updated_at: new Date()
  };
  
  clients[index] = updatedClient;
  console.log(`Client ${id} updated successfully`);
  
  return updatedClient;
};

export const deleteClient = async (id: string): Promise<boolean> => {
  console.log(`Deleting client ${id}`);
  
  const initialLength = clients.length;
  clients = clients.filter(client => client.id !== id);
  const deleted = clients.length !== initialLength;
  
  if (deleted) {
    console.log(`Client ${id} deleted successfully`);
  } else {
    console.log(`Client ${id} not found for deletion`);
  }
  
  return deleted;
};

export const searchClients = async (query: string): Promise<Client[]> => {
  console.log(`Searching clients with query: ${query}`);
  
  if (!query || query.trim() === '') {
    return getClients();
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  const results = clients.filter(client => 
    client.first_name.toLowerCase().includes(searchTerm) ||
    client.last_name.toLowerCase().includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm) ||
    client.company.toLowerCase().includes(searchTerm)
  );
  
  console.log(`Search found ${results.length} clients matching "${query}"`);
  return [...results];
};
