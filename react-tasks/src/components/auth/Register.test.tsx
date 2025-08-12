
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { api } from '../../api/client';
import Register from './register';
import '@testing-library/jest-dom';
jest.mock('../../api/client', () => ({
  api: {
    register: jest.fn(),
  },
  setToken: jest.fn(),
}));

describe('Register component', () => {
  const mockRegister = api.register as jest.Mock;
  const mockSetToken = require('../../api/client').setToken as jest.Mock;

  const onRegister = jest.fn();

  beforeEach(() => {
    mockRegister.mockReset();
    mockSetToken.mockReset();
    onRegister.mockReset();
  });

  test('renders all inputs and button', () => {
    render(<Register onRegister={onRegister} />);

    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('shows validation errors on empty submit', async () => {
    render(<Register onRegister={onRegister} />);
    userEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm your password/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test('shows validation error on invalid email and password mismatch', async () => {
    render(<Register onRegister={onRegister} />);

    await userEvent.type(screen.getByPlaceholderText(/full name/i), 'Jo');
    await userEvent.type(screen.getByPlaceholderText(/email address/i), 'invalid-email');
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), '12345');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), '123456');

    userEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test('toggles show/hide password and confirm password', () => {
    render(<Register onRegister={onRegister} />);

    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmInput = screen.getByPlaceholderText(/confirm password/i);

    const toggleButtons = screen.getAllByRole('button', { hidden: true }).filter(
      (btn) => btn.getAttribute('aria-label')?.toLowerCase().includes('password')
    );

    // Initially type=password
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('type', 'password');

    // Toggle password
    fireEvent.click(toggleButtons[0]);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Toggle confirm password
    fireEvent.click(toggleButtons[1]);
    expect(confirmInput).toHaveAttribute('type', 'text');

    // Toggle back
    fireEvent.click(toggleButtons[0]);
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButtons[1]);
    expect(confirmInput).toHaveAttribute('type', 'password');
  });

  test('calls api.register and onRegister on successful submit', async () => {
    mockRegister.mockResolvedValue({ data: { token: 'abc123' } });

    render(<Register onRegister={onRegister} />);

    await userEvent.type(screen.getByPlaceholderText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByPlaceholderText(/email address/i), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), '123456');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), '123456');

    userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        password_confirmation: '123456',
      });
      expect(mockSetToken).toHaveBeenCalledWith('abc123');
      expect(onRegister).toHaveBeenCalled();
    });
  });

  test('displays server error message on failure', async () => {
    mockRegister.mockRejectedValue({
      errors: {
        email: ['Email already exists'],
      },
    });

    render(<Register onRegister={onRegister} />);

    await userEvent.type(screen.getByPlaceholderText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByPlaceholderText(/email address/i), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), '123456');
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), '123456');

    userEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
  });
});
