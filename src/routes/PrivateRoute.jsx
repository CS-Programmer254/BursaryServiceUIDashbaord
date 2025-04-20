import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const user = sessionStorage.getItem("user");
  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
