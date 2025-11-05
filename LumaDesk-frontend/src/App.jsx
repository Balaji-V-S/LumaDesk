// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- Layout Imports ---
import AppLayout from './layouts/AppLayout';

// --- Route Imports ---
import PrivateRoute from './components/routes/PrivateRoute';
// import RoleBasedAccess from './components/routes/RoleBasedAccess'; // We'll use this later

// --- Page Imports ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import DashboardPage from './pages/DashboardPage'; // The smart dashboard
import MyTicketsPage from './pages/MyTicketsPage';
import ProfilePage from './pages/ProfilePage'; // 
import NewTicketPage from './pages/NewTicketPage';
import FeedbackPage from './pages/FeedbackPage'; // <-- Import the new page

// --- Stubbed Pages (for example) ---
const AllTicketsPage = () => <div className="p-4"><h1 className="text-xl">All Tickets</h1></div>;
// ...etc.

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* === 1. PUBLIC ROUTES === */}
          {/* (These don't use a layout) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* === 2. PRIVATE "APP" ROUTES === */}
          {/* These routes are protected and use the AppLayout */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}> {/* <-- The magic is here */}
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Add all other private routes here, and the layout will apply */}
              <Route path="/tickets/new" element={<NewTicketPage />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />
              <Route path="/feedbacks" element={<FeedbackPage />} /> {/* <-- ADD THIS ROUTE */}
              <Route path="/profile" element={<ProfilePage />} /> {/* <-- ADD THIS ROUTE */}
              {/* <Route 
                path="/reports" 
                element={
                  <RoleBasedAccess allowedRoles={['ROLE_MANAGER']}>
                    <ReportsPage />
                  </RoleBasedAccess>
                } 
              />
              */}
            </Route>
          </Route>
          
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;