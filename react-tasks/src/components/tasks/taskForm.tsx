import React, { useEffect, useState } from 'react';

export default function TaskForm({ onSubmit, initial }: { onSubmit: (p: any) => Promise<void>, initial?: any }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [completed, setCompleted] = useState(!!initial?.completed);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setCompleted(!!initial?.completed);
  }, [initial]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, description, completed });
      setTitle("");
      setDescription("");
      setCompleted(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mb-4 border p-3 rounded">
      <input
        className="w-full p-2 mb-2 border rounded"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        required
        disabled={loading} />
      <textarea
        className="w-full p-2 mb-2 border rounded"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        required
        disabled={loading}
      />
      <label className="flex items-center gap-2 mb-2">
        <input type="checkbox" checked={completed} onChange={e => setCompleted(e.target.checked)} disabled={loading} />
        Completed
      </label>
      <button className="bg-blue-600 text-white px-3 py-1 rounded" disabled={loading}>    {loading ? "saving..." : "Save"}</button>
    </form>
  );
}
