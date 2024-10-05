// src/app/components/LogoutButton.tsx

"use client"; // Mark this file as a Client Component

import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      router.push('/login'); // Redirect to login page after logout
    } else {
      const error = await res.json();
      console.error(error); // Handle error accordingly
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="mt-4 p-2 bg-red-500 text-white rounded">
      Logout
    </button>
  );
};

export default LogoutButton;
