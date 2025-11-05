// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

// Import the actual dashboard components
import { ManagerDashboard } from './dashboards/ManagerDashboard';
import { AgentDashboard } from './dashboards/AgentDashboard';
import { CustomerDashboard } from './dashboards/CustomerDashboard';

// A fallback for unhandled roles
const DefaultDashboard = () => (
   <div className="p-4">
    <h1 className="text-3xl font-bold text-stone-800">Welcome to LumaDesk</h1>
    <p className="mt-2 text-stone-600">Your information at a glance.</p>
  </div>
);


const DashboardPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // This is the conditional rendering logic
  switch (user.role) {
    case 'ROLE_MANAGER':
    case 'ROLE_CXO':
    case 'ROLE_TEAM_LEAD':
      return <ManagerDashboard />;
    
    case 'ROLE_SUPPORT_AGENT':
    case 'ROLE_TRIAGE_OFFICER':
    case 'ROLE_TECH_SUPPORT_ENGINEER':
    case 'ROLE_NOC_ENGINEER':
    case 'ROLE_FIELD_ENGINEER':
    case 'ROLE_NOC_ADMIN':
      return <AgentDashboard />;

    case 'ROLE_CUSTOMER':
      return <CustomerDashboard />;
    
    default:
      return <DefaultDashboard />;
  }
};

export default DashboardPage;