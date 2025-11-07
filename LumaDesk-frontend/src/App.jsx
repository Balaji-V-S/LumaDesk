// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- Layout Imports ---
import AppLayout from './layouts/AppLayout';

// --- Route Imports ---
import PrivateRoute from './components/routes/PrivateRoute';
import RoleBasedAccess from './components/routes/RoleBasedAccess'; // We'll use this later

// --- Page Imports (Public) ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// --- Page Imports (Private - All Roles) ---
import DashboardPage from './pages/DashboardPage';
import MyTicketsPage from './pages/MyTicketsPage';
import NewTicketPage from './pages/NewTicketPage';
import ProfilePage from './pages/ProfilePage';
import FeedbackPage from './pages/FeedbackPage';
import AiChatPage from './pages/AiChatPage';
import AllTicketsPage from './pages/AllTicketsPage';
import TriageTicketsPage from './pages/TriageTicketsPage';

// --- Engineer-Only Import ---
import ResolveTicketsPage from './pages/ResolveTicketsPage'; // <-- 1. IMPORT IT

// --- Manager-Only Imports ---
import SlaPage from './pages/SlaPage';
import IssueCategoryPage from './pages/IssueCategoryPage';
import UserRolesPage from './pages/UserRolesPage';
import ManageEmployeePage from './pages/ManageEmployeePage';


// --- STUBBED DUMMY PAGES (for now) ---
const AnalyticsPage = () => <div className="p-4"><h1 className="text-xl">Analytics</h1><p>Charts and graphs will go here.</p></div>;
const EscalationsPage = () => <div className="p-4"><h1 className="text-xl">Escalated Tickets</h1><p>A list of all SLA-breached tickets.</p></div>;
// --- END STUBS ---


// --- ROLE GROUPINGS ---
const MANAGER_ROLES = ['ROLE_MANAGER', 'ROLE_CXO', 'ROLE_NOC_ADMIN'];

const ENGINEER_ROLES = [
  'ROLE_TECH_SUPPORT_ENGINEER',
  'ROLE_NOC_ENGINEER',
  'ROLE_FIELD_ENGINEER',
];

const AGENT_STAFF_ROLES = [ // All non-customer, non-engineer staff
  'ROLE_SUPPORT_AGENT',
  'ROLE_TRIAGE_OFFICER',
  ...MANAGER_ROLES,
];

const ALL_STAFF_ROLES = [ // Everyone except customers
  ...AGENT_STAFF_ROLES,
  ...ENGINEER_ROLES,
];

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* === 1. PUBLIC ROUTES === */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* === 2. PRIVATE "APP" ROUTES === */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              {/* Common Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tickets/new" element={<NewTicketPage />} />
              <Route path="/ai-agent" element={<AiChatPage />} />
              <Route path="/feedbacks" element={<FeedbackPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Customer-Only */}
              <Route path="/my-tickets" element={<MyTicketsPage />} />
              
              {/* All Staff Routes */}
              <Route path="/tickets/all" element={<RoleBasedAccess allowedRoles={ALL_STAFF_ROLES}><AllTicketsPage /></RoleBasedAccess>} />
              
              {/* Triage-Only Route */}
              <Route path="/tickets/triage" element={<RoleBasedAccess allowedRoles={['ROLE_TRIAGE_OFFICER']}><TriageTicketsPage /></RoleBasedAccess>} />
              
              {/* --- 3. ADD THE NEW ROUTE --- */}
              <Route path="/tickets/resolve" element={<RoleBasedAccess allowedRoles={ENGINEER_ROLES}><ResolveTicketsPage /></RoleBasedAccess>} />
              
              {/* Manager-Only Routes */}
              <Route path="/analytics" element={<RoleBasedAccess allowedRoles={MANAGER_ROLES}><AnalyticsPage /></RoleBasedAccess>} />
              <Route path="/tickets/escalated" element={<RoleBasedAccess allowedRoles={MANAGER_ROLES}><EscalationsPage /></RoleBasedAccess>} />
              <Route path="/admin/employees" element={<RoleBasedAccess allowedRoles={MANAGER_ROLES}><ManageEmployeePage /></RoleBasedAccess>} /> {/* <-- ADDED */}
              <Route path="/admin/sla" element={<RoleBasedAccess allowedRoles={MANAGER_ROLES}><SlaPage /></RoleBasedAccess>} />
              <Route path="/admin/categories" element={<RoleBasedAccess allowedRoles={MANAGER_ROLES}><IssueCategoryPage /></RoleBasedAccess>} />
              <Route path="/admin/roles" element={<RoleBasedAccess allowedRoles={MANAGER_ROLES}><UserRolesPage /></RoleBasedAccess>} />
            </Route>
          </Route>
          
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;