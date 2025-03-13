
import { Client } from "@/types/client";

export const clients: Client[] = [
  {
    id: "1",
    firstName: "Γιώργος",
    lastName: "Παπαδόπουλος",
    email: "gpapadopoulos@example.com",
    phone: "69XXXXXXXX",
    company: "Τεχνολογίες ΑΕ",
    position: "Διευθυντής Ανάπτυξης",
    address: "Λεωφόρος Αθηνών 123",
    city: "Αθήνα",
    zipCode: "11743",
    country: "Ελλάδα",
    notes: "Σημαντικός πελάτης με μεγάλα έργα",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
  },
  {
    id: "2",
    firstName: "Μαρία",
    lastName: "Κωνσταντίνου",
    email: "mkonstantinou@example.com",
    phone: "69XXXXXXXX",
    company: "Δίκτυα ΑΕ",
    position: "Οικονομική Διευθύντρια",
    address: "Λεωφόρος Κηφισίας 45",
    city: "Αθήνα",
    zipCode: "11523",
    country: "Ελλάδα",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-02-15"),
  },
  {
    id: "3",
    firstName: "Ανδρέας",
    lastName: "Αντωνίου",
    email: "aantoniou@example.com",
    phone: "69XXXXXXXX",
    company: "Λογισμικό ΕΠΕ",
    position: "Τεχνικός Διευθυντής",
    address: "Ερμού 18",
    city: "Θεσσαλονίκη",
    zipCode: "54624",
    country: "Ελλάδα",
    notes: "Ενδιαφέρεται για νέα προϊόντα",
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-05"),
  },
  {
    id: "4",
    firstName: "Ελένη",
    lastName: "Παππά",
    email: "epappa@example.com",
    phone: "69XXXXXXXX",
    company: "Σχεδιασμός ΑΕ",
    position: "Υπεύθυνη Μάρκετινγκ",
    address: "Εγνατία 102",
    city: "Θεσσαλονίκη",
    zipCode: "54622",
    country: "Ελλάδα",
    createdAt: new Date("2023-03-18"),
    updatedAt: new Date("2023-03-18"),
  },
  {
    id: "5",
    firstName: "Κώστας",
    lastName: "Δημητρίου",
    email: "kdimitriou@example.com",
    phone: "69XXXXXXXX",
    company: "Κατασκευές ΑΕ",
    position: "Γενικός Διευθυντής",
    address: "Αριστοτέλους 25",
    city: "Πάτρα",
    zipCode: "26221",
    country: "Ελλάδα",
    notes: "Συνεργαζόμαστε από το 2020",
    createdAt: new Date("2023-04-07"),
    updatedAt: new Date("2023-04-07"),
  },
];

// Λειτουργίες για χειρισμό των δεδομένων
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
      client.firstName.toLowerCase().includes(term) ||
      client.lastName.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.company?.toLowerCase().includes(term) ||
      client.position?.toLowerCase().includes(term) ||
      client.city?.toLowerCase().includes(term)
    );
  });
};
