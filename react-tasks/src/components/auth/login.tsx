import React, { useState } from 'react';
import { api, setToken } from '../../api/client';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.login({ email, password });
      setToken(res.data.token);
      onLogin();
    } catch (e: any) {
      setErr(e?.email?.[0] || 'Login failed');
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {err && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-300">
          {err}
        </div>
      )}
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors duration-200"
      >
        Login
      </button>
    </form>

  );
}
