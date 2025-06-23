import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, role, allowedRoles, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;