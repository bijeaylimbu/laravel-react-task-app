import React, { useState } from 'react';
import { api, setToken } from '../../api/client';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordValid = password.trim().length >= 6; 

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!isEmailValid) {
      setErr('Please enter a valid email address.');
      return;
    }
    if (!isPasswordValid) {
      setErr('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login({ email, password });
      setToken(res.data.token);
      onLogin();
    } catch (error: any) {
      setErr(error?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
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
      <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 pr-12 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
      <button
        type="submit"
        disabled={loading || !isEmailValid || !isPasswordValid}
        className={`w-full text-white font-semibold py-3 rounded-md transition-colors duration-200 ${
          loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
