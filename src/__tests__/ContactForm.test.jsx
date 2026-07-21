import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import ContactForm from '../components/ContactForm';

describe('ContactForm', () => {
  test('shows validation errors for empty required fields', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<ContactForm onSubmit={onSubmit} submitLabel="Add Contact" />);

    await user.click(screen.getByRole('button', { name: /add contact/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('shows an error for an invalid email format', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<ContactForm onSubmit={onSubmit} submitLabel="Add Contact" />);

    await user.type(screen.getByLabelText(/name/i), 'Alice Smith');
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /add contact/i }));

    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('submits valid values', async () => {
    const onSubmit = vi.fn().mockResolvedValue();
    const user = userEvent.setup();

    render(<ContactForm onSubmit={onSubmit} submitLabel="Add Contact" />);

    await user.type(screen.getByLabelText(/name/i), 'Alice Smith');
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.click(screen.getByRole('button', { name: /add contact/i }));

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({ name: 'Alice Smith', email: 'alice@example.com', status: 'Lead' })
    );
  });
});
