import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }) => {
  const isAdmin = sessionStorage.getItem("synerix_admin_auth") === "true";

  if (!isAdmin) {
    return <Navigate to="/__altranz_admin_login" replace />;
  }

  return children;
};

export default AdminGuard;
