import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import TaskForm from './taskForm';


type Task = { id: number; title: string; description?: string; completed: boolean };

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState<Task | null>(null);

  async function load() {
    const data = await api.getTasks();
    setTasks(data.data.tasks || []);
  }

  useEffect(() => {
    load();
  }, []);

async function createOrUpdate(payload: any) {
  if (editing) {
    const updated = await api.updateTask(editing.id, payload);
    setTasks(tasks.map((t) => (t.id === updated.data.task.id ? updated.data.task : t)));
    setEditing(null);
  } else {
    const created = await api.createTask(payload);
    setTasks([created.data.task, ...tasks]);
  }
}


  async function remove(id: number, title: string) {
    const confirmed = window.confirm(`Are you sure you want to delete the task "${title}"?`);
    if (!confirmed) return;

    await api.deleteTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
  }


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <TaskForm onSubmit={createOrUpdate} initial={editing} />

      <ul className="mt-8 space-y-4">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div>
              <h3
                className={`text-lg font-semibold ${t.completed ? "line-through text-gray-400" : "text-gray-900"
                  }`}
              >
                {t.title}
              </h3>
              {t.description && (
                <p className="text-sm text-gray-500 mt-1">{t.description}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setEditing(t)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                aria-label={`Edit task: ${t.title}`}
              >
                Edit
              </button>
              <button
               onClick={() => remove(t.id, t.title)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                aria-label={`Delete task: ${t.title}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}

        {tasks.length === 0 && (
          <li className="text-center text-gray-500 py-10 italic">
            No tasks found. Add a new task above.
          </li>
        )}
      </ul>
    </div>
  );
}