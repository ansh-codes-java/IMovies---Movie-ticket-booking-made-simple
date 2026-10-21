import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated && !isAdmin) {
      toast.warning('Administrative privileges required. Please log in with an administrator account.');
    }
  }, [loading, isAuthenticated, isAdmin]);

  if (loading) {
    return <LoadingSpinner message="Verifying administrative credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?admin=true" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/login?admin=true" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default AdminRoute;
