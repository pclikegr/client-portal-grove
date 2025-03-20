
import { TechnicalReport, CreateTechnicalReportData, UpdateTechnicalReportData } from "@/types/client";
import { updateDevice, getDeviceById } from "./devices";
import { supabase } from "@/integrations/supabase/client";

export const getTechnicalReports = async (): Promise<TechnicalReport[]> => {
  const { data, error } = await supabase
    .from('technical_reports')
    .select('*');
  
  if (error) {
    console.error("Error fetching technical reports:", error);
    throw error;
  }
  
  return data as TechnicalReport[];
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
  
  return data as TechnicalReport;
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
  
  return data as TechnicalReport;
};

export const addTechnicalReport = async (report: CreateTechnicalReportData): Promise<TechnicalReport> => {
  // Convert camelCase to snake_case for Supabase
  const formattedReport = {
    device_id: report.deviceId,
    client_id: report.clientId,
    diagnosis: report.diagnosis,
    solution: report.solution,
    cost: report.cost,
    time_spent: report.timeSpent,
    completed: report.completed || false
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
      status: report.completed ? 'completed' : 'in_progress',
      technicalReportId: data.id
    });
  } catch (error) {
    console.error("Error updating device after adding technical report:", error);
  }
  
  return data as TechnicalReport;
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
  if (updates.solution) formattedUpdates.solution = updates.solution;
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
        status: updates.completed ? 'completed' : 'in_progress'
      });
    } catch (error) {
      console.error("Error updating device after updating technical report:", error);
    }
  }
  
  return data as TechnicalReport;
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
      status: 'pending',
      technicalReportId: null
    });
  } catch (error) {
    console.error("Error updating device after deleting technical report:", error);
  }
  
  return true;
};
