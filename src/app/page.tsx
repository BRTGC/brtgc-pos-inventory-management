// src/app/page.tsx
"use client"; // This component uses client-side features

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Redirect to the dashboard if the user is authenticated
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Welcome to the App!
        </h1>
        <p className="mb-4 text-gray-600 text-center">
          Please log in to access your dashboard.
        </p>
        <div className="flex justify-center">
          <Link href="/login">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200">
              Login
            </button>
          </Link>
          <Link href="/signup" className="ml-4">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
