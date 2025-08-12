
import React, { useState } from 'react';
import { api, setToken } from '../../api/client';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';

export default function Register({ onRegister }: { onRegister: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!form.passwordConfirmation) newErrors.passwordConfirmation = "Confirm your password";
    else if (form.passwordConfirmation !== form.password)
      newErrors.passwordConfirmation = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.register({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.passwordConfirmation,
      });

      setToken(res.data.token);
      onRegister();
    } catch (e: any) {
      if (e?.errors) {
        const firstKey = Object.keys(e.errors)[0];
        setServerError(e.errors[firstKey][0]);
      } else {
        setServerError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
      <p className="text-center text-gray-500">Join us today! It only takes a few steps.</p>

      {serverError && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{serverError}</div>
      )}

      <div>
        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Full Name"
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none ${errors.name ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <input
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Email Address"
          type="email"
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none ${errors.email ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Password"
          className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none ${errors.password ? "border-red-500" : "border-gray-300"
            }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div className="relative">
        <input
          type={showPasswordConfirm ? "text" : "password"}
          value={form.passwordConfirmation}
          onChange={(e) => handleChange("passwordConfirmation", e.target.value)}
          placeholder="Confirm Password"
          className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none ${errors.passwordConfirmation ? "border-red-500" : "border-gray-300"
            }`}
        />
        <button
          type="button"
          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          aria-label={showPasswordConfirm ? "Hide password confirmation" : "Show password confirmation"}
        >
          {showPasswordConfirm ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
        {errors.passwordConfirmation && (
          <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white font-semibold py-3 rounded-md transition-colors duration-200 ${loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}