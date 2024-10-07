// src/app/components/LogoutButton.tsx

"use client"; // Mark this file as a Client Component

import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    
    if (response.ok) {
      signOut({ redirect: true, callbackUrl: '/login' }); // Redirect to login after signing out
    } else {
      const data = await response.json();
      alert(data.error || 'Logout failed.');
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout
    </button>
  );
};

export default LogoutButton;
