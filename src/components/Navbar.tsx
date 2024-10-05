// components/Navbar.tsx
"use client"
import { useState } from 'react';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <button onClick={toggleSidebar} className="lg:hidden">
          <FaBars className="text-2xl" />
        </button>
        <Link href="/" className="text-2xl font-bold">
          Inventory System
        </Link>
      </div>

      <div className="hidden lg:flex space-x-6">
        <Link className="hover:text-gray-300" href="/dashboard">
          Dashboard
        </Link>
        <Link className="hover:text-gray-300" href="/inventory">
          Inventory
        </Link>
        <Link className="hover:text-gray-300" href="/profile">
          Profile
        </Link>
      </div>

      <div>
        <Link href="/logout" className="hover:text-gray-300">
          Logout
        </Link>
      </div>
    </nav>
  );
}
