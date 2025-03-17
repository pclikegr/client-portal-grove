
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
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } />
              <Route path="/clients/add" element={
                <ProtectedRoute>
                  <AddClient />
                </ProtectedRoute>
              } />
              <Route path="/clients/:id" element={
                <ProtectedRoute>
                  <ViewClient />
                </ProtectedRoute>
              } />
              <Route path="/clients/:id/edit" element={
                <ProtectedRoute>
                  <EditClient />
                </ProtectedRoute>
              } />
              
              <Route path="/devices" element={
                <ProtectedRoute>
                  <Devices />
                </ProtectedRoute>
              } />
              <Route path="/devices/add" element={
                <ProtectedRoute>
                  <AddDevice />
                </ProtectedRoute>
              } />
              <Route path="/devices/:id" element={
                <ProtectedRoute>
                  <ViewDevice />
                </ProtectedRoute>
              } />
              <Route path="/devices/:id/edit" element={
                <ProtectedRoute>
                  <EditDevice />
                </ProtectedRoute>
              } />
              <Route path="/clients/:clientId/devices/add" element={
                <ProtectedRoute>
                  <AddDevice />
                </ProtectedRoute>
              } />
              
              <Route path="/technical-reports" element={
                <ProtectedRoute>
                  <TechnicalReports />
                </ProtectedRoute>
              } />
              <Route path="/technical-reports/:id" element={
                <ProtectedRoute>
                  <ViewTechnicalReport />
                </ProtectedRoute>
              } />
              <Route path="/technical-reports/:id/edit" element={
                <ProtectedRoute>
                  <EditTechnicalReport />
                </ProtectedRoute>
              } />
              <Route path="/devices/:deviceId/technical-report/add" element={
                <ProtectedRoute>
                  <AddTechnicalReport />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
