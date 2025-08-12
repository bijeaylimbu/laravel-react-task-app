
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
jest.mock('../../api/client', () => ({
  api: {
    getTasks: jest.fn(),
    updateTask: jest.fn(),
    createTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

import { api } from '../../api/client';
import TaskList from './taskList';

describe('TaskList', () => {
  const sampleTasks = [
    { id: 1, title: 'Task 1', description: 'Desc 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading tasks and empty state', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue({ data: { tasks: sampleTasks } });

    render(<TaskList />);


    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });


    expect(screen.getByText('Desc 1')).toBeInTheDocument();


    expect(screen.queryByText(/No tasks found/i)).toBeNull();
  });

  test('renders empty state if no tasks', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue({ data: { tasks: [] } });

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    });
  });

  test('delete task after confirmation', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue({ data: { tasks: sampleTasks } });
    (api.deleteTask as jest.Mock).mockResolvedValue({});
    
    render(<TaskList />);
    await waitFor(() => screen.getByText('Task 1'));


    jest.spyOn(window, 'confirm').mockReturnValueOnce(true);

    fireEvent.click(screen.getByLabelText('Delete task: Task 1'));

    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalledWith(1);
    
      expect(screen.queryByText('Task 1')).toBeNull();
    });
  });

  test('does not delete task if confirmation cancelled', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue({ data: { tasks: sampleTasks } });
    render(<TaskList />);
    await waitFor(() => screen.getByText('Task 1'));

    jest.spyOn(window, 'confirm').mockReturnValueOnce(false);

    fireEvent.click(screen.getByLabelText('Delete task: Task 1'));

    expect(api.deleteTask).not.toHaveBeenCalled();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  test('clicking edit button sets the editing task', async () => {
    (api.getTasks as jest.Mock).mockResolvedValue({ data: { tasks: sampleTasks } });

    render(<TaskList />);
    await waitFor(() => screen.getByText('Task 1'));

    fireEvent.click(screen.getByLabelText('Edit task: Task 1'));

    expect(screen.getByPlaceholderText(/title/i)).toHaveValue('Task 1');
  });
});
