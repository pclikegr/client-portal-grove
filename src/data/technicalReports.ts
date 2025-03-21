
import { TechnicalReport, CreateTechnicalReportData, UpdateTechnicalReportData } from "@/types/client";
import { updateDevice, getDeviceById } from "./devices";
import { supabase } from "@/integrations/supabase/client";

// Helper function to convert Supabase response to TechnicalReport type
const mapToTechnicalReport = (data: any): TechnicalReport => {
  return {
    id: data.id,
    deviceId: data.device_id,
    clientId: data.client_id,
    diagnosis: data.diagnosis,
    solution: data.solution || '',
    cost: data.cost || 0,
    timeSpent: data.time_spent || 0,
    completed: data.completed || false,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
};

export const getTechnicalReports = async (): Promise<TechnicalReport[]> => {
  const { data, error } = await supabase
    .from('technical_reports')
    .select('*');
  
  if (error) {
    console.error("Error fetching technical reports:", error);
    throw error;
  }
  
  return Array.isArray(data) ? data.map(mapToTechnicalReport) : [];
};

export const getTechnicalReportById = async (id: string): Promise<TechnicalReport | undefined> => {
  const { data, error } = await supabase
    .from('technical_reports')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching technical report ${id}:`, error);
    return undefined;
  }
  
  return data ? mapToTechnicalReport(data) : undefined;
};

export const getTechnicalReportByDeviceId = async (deviceId: string): Promise<TechnicalReport | undefined> => {
  const { data, error } = await supabase
    .from('technical_reports')
    .select('*')
    .eq('device_id', deviceId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
    console.error(`Error fetching technical report for device ${deviceId}:`, error);
    return undefined;
  }
  
  return data ? mapToTechnicalReport(data) : undefined;
};

export const addTechnicalReport = async (report: CreateTechnicalReportData): Promise<TechnicalReport> => {
  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("You must be logged in to add a technical report");
  }
  
  // Convert camelCase to snake_case for Supabase
  const formattedReport = {
    device_id: report.deviceId,
    client_id: report.clientId,
    diagnosis: report.diagnosis,
    solution: report.solution || '',
    cost: report.cost || 0,
    time_spent: report.timeSpent || 0,
    completed: report.completed || false,
    user_id: session.user.id
  };
  
  const { data, error } = await supabase
    .from('technical_reports')
    .insert([formattedReport])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding technical report:", error);
    throw error;
  }

  // Update the device status
  try {
    await updateDevice(report.deviceId, {
      id: report.deviceId,
      status: report.completed ? 'completed' : 'in_progress',
      technicalReportId: data.id
    });
  } catch (error) {
    console.error("Error updating device after adding technical report:", error);
  }
  
  return mapToTechnicalReport(data);
};

export const updateTechnicalReport = async (id: string, updates: Partial<UpdateTechnicalReportData>): Promise<TechnicalReport | undefined> => {
  // Get the existing report first
  const existingReport = await getTechnicalReportById(id);
  
  if (!existingReport) {
    return undefined;
  }
  
  // Convert camelCase to snake_case for Supabase
  const formattedUpdates: any = {};
  
  if (updates.deviceId) formattedUpdates.device_id = updates.deviceId;
  if (updates.clientId) formattedUpdates.client_id = updates.clientId;
  if (updates.diagnosis) formattedUpdates.diagnosis = updates.diagnosis;
  if (updates.solution !== undefined) formattedUpdates.solution = updates.solution;
  if (updates.cost !== undefined) formattedUpdates.cost = updates.cost;
  if (updates.timeSpent !== undefined) formattedUpdates.time_spent = updates.timeSpent;
  if (updates.completed !== undefined) formattedUpdates.completed = updates.completed;
  
  const { data, error } = await supabase
    .from('technical_reports')
    .update(formattedUpdates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating technical report ${id}:`, error);
    return undefined;
  }
  
  // Update the device status if completion status changed
  if (updates.completed !== undefined) {
    try {
      await updateDevice(existingReport.deviceId, {
        id: existingReport.deviceId,
        status: updates.completed ? 'completed' : 'in_progress'
      });
    } catch (error) {
      console.error("Error updating device after updating technical report:", error);
    }
  }
  
  return mapToTechnicalReport(data);
};

export const deleteTechnicalReport = async (id: string): Promise<boolean> => {
  // Get the report before deleting to know which device to update
  const report = await getTechnicalReportById(id);
  
  if (!report) {
    return false;
  }
  
  const { error } = await supabase
    .from('technical_reports')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting technical report ${id}:`, error);
    return false;
  }
  
  // Update the device status
  try {
    await updateDevice(report.deviceId, {
      id: report.deviceId,
      status: 'pending',
      technicalReportId: undefined
    });
  } catch (error) {
    console.error("Error updating device after deleting technical report:", error);
  }
  
  return true;
};
