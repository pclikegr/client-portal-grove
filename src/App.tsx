
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import AddClient from "./pages/AddClient";
import EditClient from "./pages/EditClient";
import ViewClient from "./pages/ViewClient";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Devices from "./pages/Devices";
import AddDevice from "./pages/AddDevice";
import ViewDevice from "./pages/ViewDevice";
import EditDevice from "./pages/EditDevice";
import TechnicalReports from "./pages/TechnicalReports";
import AddTechnicalReport from "./pages/AddTechnicalReport";
import ViewTechnicalReport from "./pages/ViewTechnicalReport";
import EditTechnicalReport from "./pages/EditTechnicalReport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/add" element={<AddClient />} />
            <Route path="/clients/:id" element={<ViewClient />} />
            <Route path="/clients/:id/edit" element={<EditClient />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/devices/add" element={<AddDevice />} />
            <Route path="/devices/:id" element={<ViewDevice />} />
            <Route path="/devices/:id/edit" element={<EditDevice />} />
            <Route path="/clients/:clientId/devices/add" element={<AddDevice />} />
            <Route path="/technical-reports" element={<TechnicalReports />} />
            <Route path="/technical-reports/:id" element={<ViewTechnicalReport />} />
            <Route path="/technical-reports/:id/edit" element={<EditTechnicalReport />} />
            <Route path="/devices/:deviceId/technical-report/add" element={<AddTechnicalReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
