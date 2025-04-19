
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";

// Pages
import Home from "./pages/Home";
import Play from "./pages/Play";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Exchange from "./pages/Exchange";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import GameRoom from "./pages/GameRoom";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1A1F2C]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useUser();
  
  // Show loading state when checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1A1F2C]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Login and Register routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/create-room" element={
        <ProtectedRoute>
          <CreateRoom />
        </ProtectedRoute>
      } />
      
      <Route path="/join-room" element={
        <ProtectedRoute>
          <JoinRoom />
        </ProtectedRoute>
      } />
      
      <Route path="/room/:roomId" element={
        <ProtectedRoute>
          <GameRoom />
        </ProtectedRoute>
      } />
      
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <Leaderboard />
        </ProtectedRoute>
      } />
      
      <Route path="/exchange" element={
        <ProtectedRoute>
          <Exchange />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // تفعيل الوضع الداكن افتراضيًا
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <Toaster />
          <Sonner toastOptions={{
            style: { 
              background: 'rgba(0,0,0,0.8)', 
              color: 'white',
              border: '1px solid rgba(155,135,245,0.3)'
            }
          }} />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
