import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/** Requires the user to be logged in */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Requires the user to have the admin role */
export function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
