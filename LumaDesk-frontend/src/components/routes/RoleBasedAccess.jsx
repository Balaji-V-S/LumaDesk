// src/components/routes/RoleBasedAccess.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const MANAGER_ROLES = ['ROLE_MANAGER', 'ROLE_CXO', 'ROLE_NOC_ADMIN'];

const RoleBasedAccess = ({ allowedRoles, children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  // 1. Check if user is logged in AND has an allowed role
  const hasAccess =
    user && allowedRoles?.includes(user.role);

  if (hasAccess) {
    return children; // The user is authorized, show the page
  }

  // 2. User is logged in but NOT authorized
  if (user && !hasAccess) {
    // Redirect to an 'Unauthorized' page, passing them the location
    // they tried to access, in case they want to log in as someone else.
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // 3. User is not logged in at all
  // (This shouldn't happen if wrapped in PrivateRoute, but good to have)
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RoleBasedAccess;