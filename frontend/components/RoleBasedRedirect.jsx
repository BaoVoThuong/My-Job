import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RoleBasedRedirect Component
 * Redirects users to their appropriate dashboard based on their role
 */
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect based on user role
  if (user?.role === 'employer') {
    return <Navigate to="/employer/dashboard" replace />;
  }

  // Default to candidate dashboard
  return <Navigate to="/candidate/dashboard" replace />;
};

export default RoleBasedRedirect;
