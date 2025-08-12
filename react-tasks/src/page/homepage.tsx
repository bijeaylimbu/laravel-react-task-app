
import React, { useState } from 'react';
import { api, clearToken, getToken } from '../api/client';
import Register from '../components/auth/register';
import Login from '../components/auth/login';
import TaskList from '../components/tasks/taskList';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [showRegister, setShowRegister] = useState(false);

  async function logout() {
    try {
      await api.logout();
    } catch {
    }
    clearToken();
    setIsLoggedIn(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-5 flex justify-between items-center shadow-xl rounded-b-2xl">
        <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-md flex items-center gap-2">
          Tasks App
        </h1>

        {isLoggedIn && (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all duration-200 px-6 py-2 rounded-full shadow-lg font-semibold flex items-center gap-2 hover:shadow-red-500/50"
            aria-label="Logout"
          >
            <span>Logout</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m-4 14H5a2 2 0 01-2-2V7a2 2 0 012-2h4"
              />
            </svg>
          </button>
        )}
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        {!isLoggedIn ? (
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md transform transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
            {showRegister ? (
              <>

                <Register onRegister={() => setIsLoggedIn(true)} />
                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    className="text-blue-600 font-semibold hover:text-blue-800 transition"
                    onClick={() => setShowRegister(false)}
                  >
                    Login here
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>
                <Login onLogin={() => setIsLoggedIn(true)} />
                <p className="mt-6 text-center text-sm text-gray-600 flex justify-center items-center gap-1">
                  Don’t have an account?{' '}
                  <button
                    className="text-blue-600 font-semibold hover:text-blue-800 "
                    onClick={() => setShowRegister(true)}
                  >
                    Register here
                  </button>
                </p>
              </>
            )}
          </div>
        ) : (
          <TaskList />
        )}
      </main>
    </div>
  );
}
