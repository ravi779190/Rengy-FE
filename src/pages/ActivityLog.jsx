import { useEffect, useState } from 'react';
import api from '../api/axios';
import Pagination from '../components/Pagination';
import { ActivityLogSkeleton } from '../components/Skeleton';

const LIMIT = 10;

const ACTION_STYLES = {
  created: 'bg-green-100 text-green-800',
  updated: 'bg-blue-100 text-blue-800',
  deleted: 'bg-red-100 text-red-800',
};

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get('/api/activity', { params: { page, limit: LIMIT } })
      .then(({ data }) => {
        if (cancelled) return;
        setLogs(data.logs);
        setTotalPages(data.totalPages);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-slate-800">Activity Log</h1>

      {loading ? (
        <ActivityLogSkeleton rows={LIMIT} />
      ) : logs.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">No activity yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
          {logs.map((log) => (
            <li key={log._id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_STYLES[log.action] || ''}`}
                >
                  {log.action}
                </span>
                <span className="text-slate-700">{log.contactName}</span>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
