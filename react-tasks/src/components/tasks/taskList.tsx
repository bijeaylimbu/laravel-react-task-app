import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import TaskForm from './taskForm';


type Task = { id:number, title:string, description?:string, completed:boolean };

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState<Task | null>(null);

  async function load() {
    const data = await api.getTasks();
    setTasks(data.data.tasks || []);
  }

  useEffect(()=>{ load(); }, []);

  async function createOrUpdate(payload:any) {
    if (editing) {
      const updated = await api.updateTask(editing.id, payload);
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
      setEditing(null);
    } else {
      const created = await api.createTask(payload);
      setTasks([created, ...tasks]);
    }
  }

  async function remove(id:number) {
    await api.deleteTask(id);
    setTasks(tasks.filter(t => t.id !== id));
  }

  return (
    <div className="p-4">
      <TaskForm onSubmit={createOrUpdate} initial={editing} />
      <ul>
        {tasks.map(t => (
          <li key={t.id} className="p-2 border rounded my-2 flex justify-between">
            <div>
              <div className={`font-medium ${t.completed ? 'line-through' : ''}`}>{t.title}</div>
              {t.description && <div className="text-sm text-gray-600">{t.description}</div>}
            </div>
            <div className="space-x-2">
              <button onClick={()=>setEditing(t)} className="px-2 py-1 border rounded">Edit</button>
              <button onClick={()=>remove(t.id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
