import { Navigate, Outlet, useLocation } from 'react-router';
import { isUserAuthenticated } from '../lib/auth';

export function AuthGuard() {
  const location = useLocation();

  if (!isUserAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
