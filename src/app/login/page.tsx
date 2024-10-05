// src/app/login/page.tsx

'use client'; // This file will be a client component

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-200 p-8 rounded-lg shadow-lg max-w-sm mx-auto mt-20 space-y-6 backdrop-filter backdrop-blur-md bg-opacity-70">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Login</h2>

      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-600 text-gray-900 shadow-sm"
        />
      </div>

      <div className="relative">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-600 text-gray-900 shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gray-700 text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-all focus:ring-2 focus:ring-gray-500"
      >
        Login
      </button>

      {error && (
        <p className="text-red-500 text-center bg-red-100 p-2 rounded-md">{error}</p>
      )}

      <p className="text-gray-600 text-center">
        Don't have an account? <a href="/signup" className="text-gray-800 hover:underline">Sign up</a>
      </p>
    </form>
  );
};

export default Login;
