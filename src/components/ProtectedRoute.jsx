import { Navigate } from 'react-router-dom';

/**
 * A wrapper component that protects routes requiring authentication
 * Redirects to the landing page if the user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated by looking for uid in localStorage
  const isAuthenticated = localStorage.getItem('uid') !== null;
  
  // If not authenticated, redirect to landing page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute; 