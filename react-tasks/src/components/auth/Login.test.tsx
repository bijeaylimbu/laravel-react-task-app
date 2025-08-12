
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { api, } from '../../api/client';
import Login from './login';
import '@testing-library/jest-dom';
jest.mock('../../api/client', () => ({
  api: {
    login: jest.fn(),
  },
  setToken: jest.fn(),
}));

describe('Login component', () => {
  const onLoginMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders inputs and button', () => {
    render(<Login onLogin={onLoginMock} />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });



 test('calls api.login and onLogin on success', async () => {
  api.login.mockResolvedValue({ data: { token: 'token123' } });
  const onLogin = jest.fn();

  render(<Login onLogin={onLogin} />);

  await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@gmail.com');
  await userEvent.type(screen.getByPlaceholderText(/password/i), '123456');

  userEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(api.login).toHaveBeenCalledWith({
      email: 'test@gmail.com',
      password: '123456',
    });
    expect(onLogin).toHaveBeenCalled();
  });
});


});
