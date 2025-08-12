import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './taskForm';
import '@testing-library/jest-dom';
describe('TaskForm', () => {
  const mockSubmit = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  test('renders inputs and button', () => {
    render(<TaskForm onSubmit={mockSubmit} />);

    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/completed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  test('calls onSubmit with form data', async () => {
    render(<TaskForm onSubmit={mockSubmit} />);

    await userEvent.type(screen.getByPlaceholderText(/title/i), 'Test Task');
    await userEvent.type(screen.getByPlaceholderText(/description/i), 'Test Description');
    await userEvent.click(screen.getByLabelText(/completed/i));
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description',
      completed: true,
    });
  });
});
