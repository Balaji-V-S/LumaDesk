import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Optional: Add a Loading spinner component
const FullPageSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-indigo-600 border-slate-200"></div>
  </div>
);

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // 1. Show loading spinner while context is initializing
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // 2. If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. (Role-Based Access) Check if allowedRoles is provided and if user has one
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to an "Unauthorized" page or back to dashboard
    return <Navigate to="/unauthorized" replace />; 
  }

  // 4. If authenticated (and authorized), render the child component
  return <Outlet/>;
}