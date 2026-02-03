import { Navigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';

const ProtectedCustomerRoute = ({ children }) => {
  const { isAuthenticated, loading } = useCustomer();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/mon-compte" replace />;
  }

  return children;
};

export default ProtectedCustomerRoute;

