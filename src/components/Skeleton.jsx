export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded ${className}`} />;
}

export function ContactsTableSkeleton({ rows = 6 }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-slate-600">Name</th>
            <th className="px-4 py-2 text-left font-medium text-slate-600">Email</th>
            <th className="px-4 py-2 text-left font-medium text-slate-600">Phone</th>
            <th className="px-4 py-2 text-left font-medium text-slate-600">Company</th>
            <th className="px-4 py-2 text-left font-medium text-slate-600">Status</th>
            <th className="px-4 py-2 text-right font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-28" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-40" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-28" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-16 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-3">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ActivityLogSkeleton({ rows = 6 }) {
  return (
    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-3 w-24" />
        </li>
      ))}
    </ul>
  );
}
