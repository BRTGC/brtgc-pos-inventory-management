// src/app/page.tsx
"use client"; // This component uses client-side features

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Import useSession to manage session
import Link from 'next/link';

const Home = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Use useSession to get session data

  useEffect(() => {
    // Redirect to the dashboard if the user is authenticated
    if (status === "authenticated") {
      router.push('/dashboard');
    }
  }, [router, status]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-md w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
          Welcome to BRTGC Inventory Management System
        </h1>
        <p className="mb-4 text-gray-600 text-center text-sm md:text-base">
          Our platform helps businesses manage their inventory efficiently, streamline operations, and optimize stock levels.
        </p>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 text-center mb-4">
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-600 mb-6 text-sm md:text-base">
          <li>Real-time inventory tracking</li>
          <li>User-friendly dashboard</li>
          <li>Advanced reporting tools</li>
          <li>Role-based access control</li>
          <li>Seamless integration with existing systems</li>
        </ul>
        <p className="text-gray-600 text-center mb-4 text-sm md:text-base">
          Log in to access your inventory management tools and get started!
        </p>
        <div className="flex justify-center mb-6">
          <Link href="/login">
            <button className="bg-blue-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-blue-600 transition duration-200">
              Login
            </button>
          </Link>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 text-center mb-4">
          What Our Users Say
        </h2>
        <blockquote className="border-l-4 border-blue-500 pl-3 md:pl-4 italic text-gray-600 mb-6 text-sm md:text-base">
          "The BRTGC Inventory Management System has transformed our operations! We can track our inventory in real-time and make better decisions."
        </blockquote>
        <p className="text-gray-600 text-center mb-4 text-sm md:text-base">
          Need assistance? Contact our support team at{' '}
          <a href="mailto:support@brtgc.com" className="text-blue-500">support@brtgc.com</a>.
        </p>
      </div>
    </main>
  );  
};

export default Home;
