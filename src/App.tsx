import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Cases from "./pages/Cases";
import Evidence from "./pages/Evidence";
import Reports from "./pages/Reports";
import Incidents from "./pages/Incidents";
import Admin from "./pages/Admin";
import AuditTrail from "./pages/AuditTrail";
import DesignSystem from "./pages/DesignSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cases" 
              element={
                <ProtectedRoute>
                  <Cases />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/evidence" 
              element={
                <ProtectedRoute requiredRole="investigator">
                  <Evidence />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/incidents" 
              element={
                <ProtectedRoute>
                  <Incidents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/audit" 
              element={
                <ProtectedRoute requiredRole="supervisor">
                  <AuditTrail />
                </ProtectedRoute>
              } 
            />
            <Route path="/design-system" element={<DesignSystem />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
