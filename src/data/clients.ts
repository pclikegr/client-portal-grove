import { Client } from "@/types/client";

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

export const getClients = (): Client[] => {
  return [...clientsData];
};

export const getClientById = (id: string): Client | undefined => {
  return clientsData.find(client => client.id === id);
};

export const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  clientsData = [...clientsData, newClient];
  return newClient;
};

export const updateClient = (id: string, updates: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>): Client | undefined => {
  const index = clientsData.findIndex(client => client.id === id);
  
  if (index === -1) return undefined;
  
  const updatedClient: Client = {
    ...clientsData[index],
    ...updates,
    updatedAt: new Date()
  };
  
  clientsData[index] = updatedClient;
  return updatedClient;
};

export const deleteClient = (id: string): boolean => {
  const initialLength = clientsData.length;
  clientsData = clientsData.filter(client => client.id !== id);
  return clientsData.length !== initialLength;
};

export const searchClients = (query: string): Client[] => {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term);
  
  if (!searchTerms.length) return getClients();
  
  return clientsData.filter(client => {
    return searchTerms.some(term => 
      client.first_name.toLowerCase().includes(term) ||
      client.last_name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.company?.toLowerCase().includes(term) ||
      client.position?.toLowerCase().includes(term) ||
      client.city?.toLowerCase().includes(term)
    );
  });
};
