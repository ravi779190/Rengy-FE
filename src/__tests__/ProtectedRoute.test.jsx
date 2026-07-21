import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import ProtectedRoute from '../routes/ProtectedRoute';
import * as AuthContext from '../context/AuthContext';

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  test('shows a skeleton placeholder while auth is initializing', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null, initializing: true });
    renderProtected();
    expect(screen.getByTestId('protected-route-skeleton')).toBeInTheDocument();
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/dashboard page/i)).not.toBeInTheDocument();
  });

  test('redirects to /login when there is no authenticated user', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null, initializing: false });
    renderProtected();
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('renders the protected content when a user is authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: '1', email: 'jane@example.com' },
      initializing: false,
    });
    renderProtected();
    expect(screen.getByText(/dashboard page/i)).toBeInTheDocument();
  });
});
