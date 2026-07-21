import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ContactsTableSkeleton, Skeleton } from '../components/Skeleton';

export default function ProtectedRoute() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6" data-testid="protected-route-skeleton">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
        <ContactsTableSkeleton rows={5} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
