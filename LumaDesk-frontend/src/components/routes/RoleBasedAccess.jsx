// src/components/routes/RoleBasedAccess.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react'; // For a loading state

/**
 * This component checks if a logged-in user has the correct role
 * to access a specific page.
 *
 * @param {object} props
 * @param {string[]} props.allowedRoles - Array of roles allowed, e.g., ["ROLE_MANAGER", "ROLE_NOC_ADMIN"]
 * @param {React.ReactNode} props.children - The page component to render if authorized
 */
const RoleBasedAccess = ({ allowedRoles, children }) => {
  const { user, isLoading } = useAuth();

  // Show a spinner if the user data is still being loaded
  // (e.g., from a 'validate token' call on app load)
  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Check if the user's role is in the allowed list
  const hasAccess = allowedRoles.includes(user.role);

  if (hasAccess) {
    return children; // Render the page
  }

  // User is logged in, but not authorized for this specific page.
  // Send them to a "Forbidden" page.
  return <Navigate to="/unauthorized" replace />;
};

export default RoleBasedAccess;