
import React, { useState } from 'react';
import { getToken, clearToken, api } from './api/client';
import Register from './components/auth/register';
import Login from './components/auth/login';
import TaskList from './components/tasks/taskList';

export default function App() {
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-extrabold tracking-wide">Tasks App</h1>
        {isLoggedIn && (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 transition-colors duration-300 px-4 py-2 rounded shadow"
            aria-label="Logout"
          >
            Logout
          </button>
        )}
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        {!isLoggedIn ? (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            {showRegister ? (
              <>
                <Register onRegister={() => setIsLoggedIn(true)} />
                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    className="text-blue-600 underline hover:text-blue-800 transition"
                    onClick={() => setShowRegister(false)}
                  >
                    Login here
                  </button>
                </p>
              </>
            ) : (
              <>
                <Login onLogin={() => setIsLoggedIn(true)} />
                <p className="mt-6 text-center text-sm text-gray-600 flex justify-center items-center gap-1">
                  Don't have an account?{' '}
                  <button
                    className="text-blue-600 underline hover:text-blue-800 transition"
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
