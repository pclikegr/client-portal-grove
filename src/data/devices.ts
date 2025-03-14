
import { Device, CreateDeviceData, UpdateDeviceData, DeviceType } from "@/types/client";

// Αρχικά δεδομένα συσκευών
export const devices: Device[] = [
  {
    id: "1",
    clientId: "1",
    type: DeviceType.LAPTOP,
    brand: "Dell",
    model: "XPS 15",
    serialNumber: "DL789456123",
    problem: "Δεν ανάβει η οθόνη",
    status: "in_progress",
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15")
  },
  {
    id: "2",
    clientId: "1",
    type: DeviceType.MOBILE,
    brand: "Samsung",
    model: "Galaxy S21",
    serialNumber: "SM45678912",
    problem: "Σπασμένη οθόνη",
    status: "completed",
    technicalReportId: "1",
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-12")
  },
  {
    id: "3",
    clientId: "2",
    type: DeviceType.LAPTOP,
    brand: "Apple",
    model: "MacBook Pro",
    serialNumber: "AP98765432",
    problem: "Αργή λειτουργία και υπερθέρμανση",
    status: "pending",
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-05-20")
  },
  {
    id: "4",
    clientId: "3",
    type: DeviceType.TABLET,
    brand: "Apple",
    model: "iPad Pro",
    serialNumber: "IP12345678",
    problem: "Δεν φορτίζει",
    status: "in_progress",
    createdAt: new Date("2023-05-18"),
    updatedAt: new Date("2023-05-18")
  }
];

// Λειτουργίες για χειρισμό των δεδομένων
let devicesData = [...devices];

export const getDevices = (): Device[] => {
  return [...devicesData];
};

export const getDevicesByClientId = (clientId: string): Device[] => {
  return devicesData.filter(device => device.clientId === clientId);
};

export const getDeviceById = (id: string): Device | undefined => {
  return devicesData.find(device => device.id === id);
};

export const addDevice = (device: CreateDeviceData): Device => {
  const newDevice: Device = {
    ...device,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    receivedAt: device.receivedAt || new Date() // Χρήση της παρεχόμενης ημερομηνίας ή της τρέχουσας
  };
  
  devicesData = [...devicesData, newDevice];
  return newDevice;
};

export const updateDevice = (id: string, updates: Partial<UpdateDeviceData>): Device | undefined => {
  const index = devicesData.findIndex(device => device.id === id);
  
  if (index === -1) return undefined;
  
  const updatedDevice: Device = {
    ...devicesData[index],
    ...updates,
    updatedAt: new Date()
  };
  
  devicesData[index] = updatedDevice;
  return updatedDevice;
};

export const deleteDevice = (id: string): boolean => {
  const initialLength = devicesData.length;
  devicesData = devicesData.filter(device => device.id !== id);
  return devicesData.length !== initialLength;
};

export const searchDevices = (query: string): Device[] => {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term);
  
  if (!searchTerms.length) return getDevices();
  
  return devicesData.filter(device => {
    return searchTerms.some(term => 
      device.brand.toLowerCase().includes(term) ||
      device.model.toLowerCase().includes(term) ||
      device.serialNumber?.toLowerCase().includes(term) ||
      device.problem.toLowerCase().includes(term)
    );
  });
};
