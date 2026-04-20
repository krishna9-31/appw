import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;
