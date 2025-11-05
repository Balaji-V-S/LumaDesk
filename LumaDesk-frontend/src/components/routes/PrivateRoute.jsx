import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// This component protects routes.
// If the user is logged in (has a token), it shows the <Outlet /> (the child route).
// If not, it boots them back to the /login page.
const PrivateRoute = () => {
  const { token } = useAuth();

  // You might also add role-based logic here later
  // e.g., if (token && user.role === 'ROLE_CUSTOMER') ...

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;