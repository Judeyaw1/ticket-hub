import { Navigate, Outlet } from 'react-router';
import { isCurrentUserOrganizer, isUserAuthenticated } from '../lib/auth';

export function OrganizerGuard() {
  if (!isUserAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isCurrentUserOrganizer()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
