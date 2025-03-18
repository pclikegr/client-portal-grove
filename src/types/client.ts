
export interface Client {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zip_code?: string;
  country?: string;
  notes?: string;
  company?: string;
  position?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateClientData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zip_code?: string;
  country?: string;
  notes?: string;
  company?: string;
  position?: string;
}

export interface UpdateClientData extends Partial<Omit<CreateClientData, 'first_name' | 'last_name' | 'email' | 'phone'>> {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

// Νέοι τύποι για συσκευές
export enum DeviceType {
  LAPTOP = 'laptop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  OTHER = 'other'
}

export interface Device {
  id: string;
  clientId: string;
  type: DeviceType;
  brand: string;
  model: string;
  serialNumber?: string;
  problem: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  technicalReportId?: string;
  createdAt: Date;
  updatedAt: Date;
  receivedAt?: Date; // Ημερομηνία εισαγωγής/παραλαβής της συσκευής
}

export interface CreateDeviceData {
  clientId: string;
  type: DeviceType;
  brand: string;
  model: string;
  serialNumber?: string;
  problem: string;
  receivedAt?: Date; // Προσθήκη ημερομηνίας εισαγωγής
}

export interface UpdateDeviceData extends Partial<CreateDeviceData> {
  id: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  technicalReportId?: string;
}

// Τύποι για τεχνικές εκθέσεις
export interface TechnicalReport {
  id: string;
  deviceId: string;
  clientId: string;
  diagnosis: string;
  solution?: string;
  cost?: number;
  timeSpent?: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTechnicalReportData {
  deviceId: string;
  clientId: string;
  diagnosis: string;
  solution?: string;
  cost?: number;
  timeSpent?: number;
  completed?: boolean;
}

export interface UpdateTechnicalReportData extends Partial<CreateTechnicalReportData> {
  id: string;
}
