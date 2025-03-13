
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
  company?: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
  company?: string;
  position?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: string;
}
