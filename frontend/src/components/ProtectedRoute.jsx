import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate replace to={`/${user.role.toLowerCase()}`} />;
  }

  return children;
}
