import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import Login from '../pages/Login';
import * as AuthContext from '../context/AuthContext';

describe('Login page', () => {
  test('shows validation errors when submitted empty', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ login: vi.fn() });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('calls login with entered credentials on submit', async () => {
    const login = vi.fn().mockResolvedValue();
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ login });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/password/i), 'supersecret1');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('jane@example.com', 'supersecret1');
    });
  });

  test('shows a server error message when login fails', async () => {
    const login = vi.fn().mockRejectedValue({ response: { data: { message: 'Invalid email or password' } } });
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ login });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid email or password/i);
  });
});
