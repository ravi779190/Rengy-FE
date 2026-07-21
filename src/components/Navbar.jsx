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
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-6">
        <span className="text-lg font-semibold text-slate-800">Mini CRM</span>
        {user && (
          <div className="flex gap-4 text-sm text-slate-600">
            <Link to="/dashboard" className="hover:text-slate-900">
              Contacts
            </Link>
            <Link to="/activity" className="hover:text-slate-900">
              Activity Log
            </Link>
          </div>
        )}
      </div>
      {user && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500">{user.name}</span>
          <button
            onClick={handleLogout}
            className="rounded bg-slate-100 px-3 py-1.5 text-slate-700 hover:bg-slate-200"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
