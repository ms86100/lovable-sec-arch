import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Products from "./pages/Products";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <Layout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <Layout>
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/projects/:id" 
              element={
                <Layout>
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/products" 
              element={
                <Layout>
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/templates" 
              element={
                <Layout>
                  <ProtectedRoute>
                    <Templates />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
