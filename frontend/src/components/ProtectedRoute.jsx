import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
