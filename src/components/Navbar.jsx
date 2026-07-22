import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="whitespace-nowrap text-lg font-semibold text-slate-800">Mini CRM</span>
        {user && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
            <Link to="/dashboard" className="whitespace-nowrap hover:text-slate-900">
              Contacts
            </Link>
            <Link to="/activity" className="whitespace-nowrap hover:text-slate-900">
              Activity Log
            </Link>
          </div>
        )}
      </div>
      {user && (
        <div className="flex items-center gap-3 text-sm">
          <span className="whitespace-nowrap text-slate-500">{user.name}</span>
          <button
            onClick={handleLogout}
            className="whitespace-nowrap rounded bg-slate-100 px-3 py-1.5 text-slate-700 hover:bg-slate-200"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
