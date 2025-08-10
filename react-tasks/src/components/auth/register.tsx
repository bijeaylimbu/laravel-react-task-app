
import React, { useState } from 'react';
import { api, setToken } from '../../api/client';

export default function Register({ onRegister }: { onRegister: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const res = await api.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setToken(res.token);
      onRegister();
    } catch (e: any) {
      if (e?.errors) {
     
        const firstKey = Object.keys(e.errors)[0];
        setErr(e.errors[firstKey][0]);
      } else {
        setErr('Registration failed');
      }
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-4">
      {err && <div className="text-red-600 mb-2">{err}</div>}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full p-2 mb-2 border rounded"
        required
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="w-full p-2 mb-2 border rounded"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-2 border rounded"
        required
      />

      <input
        type="password"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        placeholder="Confirm Password"
        className="w-full p-2 mb-2 border rounded"
        required
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Register
      </button>
    </form>
  );
}
