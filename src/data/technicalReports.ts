
import { TechnicalReport, CreateTechnicalReportData, UpdateTechnicalReportData } from "@/types/client";
import { updateDevice, getDeviceById } from "./devices";

// Αρχικά δεδομένα τεχνικών εκθέσεων
export const technicalReports: TechnicalReport[] = [
  {
    id: "1",
    deviceId: "2",
    clientId: "1",
    diagnosis: "Σπασμένη οθόνη και ζημιά στο digitizer",
    solution: "Αντικατάσταση οθόνης και digitizer",
    cost: 120,
    timeSpent: 1.5,
    completed: true,
    createdAt: new Date("2023-04-11"),
    updatedAt: new Date("2023-04-12")
  }
];

// Λειτουργίες για χειρισμό των δεδομένων
let technicalReportsData = [...technicalReports];

export const getTechnicalReports = (): TechnicalReport[] => {
  return [...technicalReportsData];
};

export const getTechnicalReportById = (id: string): TechnicalReport | undefined => {
  return technicalReportsData.find(report => report.id === id);
};

export const getTechnicalReportByDeviceId = (deviceId: string): TechnicalReport | undefined => {
  return technicalReportsData.find(report => report.deviceId === deviceId);
};

export const addTechnicalReport = (report: CreateTechnicalReportData): TechnicalReport => {
  const newReport: TechnicalReport = {
    ...report,
    id: Date.now().toString(),
    completed: report.completed || false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  technicalReportsData = [...technicalReportsData, newReport];
  
  // Ενημέρωση της συσκευής με το technicalReportId
  const device = getDeviceById(report.deviceId);
  if (device) {
    updateDevice(report.deviceId, { 
      status: report.completed ? 'completed' : 'in_progress'
    });
    
    // Update the device object directly (outside the type system)
    const deviceAny = getDeviceById(report.deviceId) as any;
    if (deviceAny) {
      deviceAny.technicalReportId = newReport.id;
    }
  }
  
  return newReport;
};

export const updateTechnicalReport = (id: string, updates: Partial<UpdateTechnicalReportData>): TechnicalReport | undefined => {
  const index = technicalReportsData.findIndex(report => report.id === id);
  
  if (index === -1) return undefined;
  
  const updatedReport: TechnicalReport = {
    ...technicalReportsData[index],
    ...updates,
    updatedAt: new Date()
  };
  
  technicalReportsData[index] = updatedReport;
  
  // Αν η έκθεση έχει ολοκληρωθεί, ενημερώνουμε και την κατάσταση της συσκευής
  if (updates.completed !== undefined) {
    updateDevice(updatedReport.deviceId, { 
      status: updates.completed ? 'completed' : 'in_progress'
    });
  }
  
  return updatedReport;
};

export const deleteTechnicalReport = (id: string): boolean => {
  const report = getTechnicalReportById(id);
  if (!report) return false;
  
  // Ενημέρωση της συσκευής για την αφαίρεση του technicalReportId
  updateDevice(report.deviceId, { 
    status: 'pending'
  });
  
  // Update the device object directly (outside the type system)
  const deviceAny = getDeviceById(report.deviceId) as any;
  if (deviceAny) {
    deviceAny.technicalReportId = undefined;
  }
  
  const initialLength = technicalReportsData.length;
  technicalReportsData = technicalReportsData.filter(report => report.id !== id);
  return technicalReportsData.length !== initialLength;
};
