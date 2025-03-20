
import { Device, CreateDeviceData, UpdateDeviceData, DeviceType } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";

// Helper function to convert Supabase response to Device type
const mapToDevice = (data: any): Device => {
  return {
    id: data.id,
    clientId: data.client_id,
    type: data.type as DeviceType,
    brand: data.brand,
    model: data.model,
    serialNumber: data.serial_number || '',
    problem: data.problem,
    status: data.status,
    technicalReportId: data.technical_report_id || undefined,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    receivedAt: data.received_at ? new Date(data.received_at) : undefined,
    returnedAt: data.returned_at ? new Date(data.returned_at) : undefined
  };
};

export const getDevices = async (): Promise<Device[]> => {
  const { data, error } = await supabase
    .from('devices')
    .select('*');
  
  if (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
  
  return Array.isArray(data) ? data.map(mapToDevice) : [];
};

export const getDevicesByClientId = async (clientId: string): Promise<Device[]> => {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('client_id', clientId);
  
  if (error) {
    console.error(`Error fetching devices for client ${clientId}:`, error);
    throw error;
  }
  
  return Array.isArray(data) ? data.map(mapToDevice) : [];
};

export const getDeviceById = async (id: string): Promise<Device | undefined> => {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching device ${id}:`, error);
    return undefined;
  }
  
  return data ? mapToDevice(data) : undefined;
};

export const addDevice = async (device: CreateDeviceData): Promise<Device> => {
  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("You must be logged in to add a device");
  }
  
  // Convert camelCase to snake_case for Supabase
  const formattedDevice = {
    client_id: device.clientId,
    type: device.type,
    brand: device.brand,
    model: device.model,
    serial_number: device.serialNumber,
    problem: device.problem,
    received_at: device.receivedAt ? device.receivedAt.toISOString() : new Date().toISOString(),
    status: 'pending',
    user_id: session.user.id
  };
  
  const { data, error } = await supabase
    .from('devices')
    .insert([formattedDevice])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding device:", error);
    throw error;
  }
  
  return mapToDevice(data);
};

export const updateDevice = async (id: string, updates: Partial<UpdateDeviceData>): Promise<Device | undefined> => {
  // Convert camelCase to snake_case for Supabase
  const formattedUpdates: any = {};
  
  if (updates.clientId) formattedUpdates.client_id = updates.clientId;
  if (updates.type) formattedUpdates.type = updates.type;
  if (updates.brand) formattedUpdates.brand = updates.brand;
  if (updates.model) formattedUpdates.model = updates.model;
  if (updates.serialNumber) formattedUpdates.serial_number = updates.serialNumber;
  if (updates.problem) formattedUpdates.problem = updates.problem;
  if (updates.status) formattedUpdates.status = updates.status;
  if (updates.receivedAt) formattedUpdates.received_at = updates.receivedAt.toISOString();
  if (updates.returnedAt) formattedUpdates.returned_at = updates.returnedAt.toISOString();
  if (updates.technicalReportId) formattedUpdates.technical_report_id = updates.technicalReportId;
  
  const { data, error } = await supabase
    .from('devices')
    .update(formattedUpdates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating device ${id}:`, error);
    return undefined;
  }
  
  return mapToDevice(data);
};

export const deleteDevice = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting device ${id}:`, error);
    return false;
  }
  
  return true;
};

export const searchDevices = async (query: string): Promise<Device[]> => {
  if (!query || query.trim() === '') {
    return getDevices();
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .or(`brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%,serial_number.ilike.%${searchTerm}%,problem.ilike.%${searchTerm}%`);
  
  if (error) {
    console.error(`Error searching devices with query "${query}":`, error);
    throw error;
  }
  
  return Array.isArray(data) ? data.map(mapToDevice) : [];
};
