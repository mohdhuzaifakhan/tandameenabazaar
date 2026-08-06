import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Guards routes based on authentication status and allowed roles.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while auth state initializes
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-semibold text-xs tracking-wider uppercase animate-pulse">
          Authenticating Meena Bazaar account...
        </p>
      </div>
    );
  }

  // If not logged in, redirect to login page with return URL
  if (!currentUser && !userProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, verify user's role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = userProfile?.role || 'customer';

    if (!allowedRoles.includes(userRole)) {
      // Redirect based on actual role
      if (userRole === 'admin') {
        return <Navigate to="/dashboard/admin" replace />;
      } else if (userRole === 'shop_owner') {
        return <Navigate to="/dashboard/shop" replace />;
      } else {
        return <Navigate to="/dashboard/customer" replace />;
      }
    }
  }

  return children;
}
