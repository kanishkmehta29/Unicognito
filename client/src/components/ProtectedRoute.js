import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = sessionStorage.getItem("user");
  
  if (!user) {
    // Redirect to signin if no user is found
    return <Navigate to="/signin" />;
  }
  
  // If user exists, render the protected component
  return children;
};

export default ProtectedRoute;