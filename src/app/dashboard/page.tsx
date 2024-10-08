// src/app/dashboard/page.tsx
"use client";

import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withLayout from "@/components/withLayout";
import { User } from "@/types/User"; // Import the User type

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null); // Use the User type
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login"); // Redirect to sign in if not authenticated
      } else {
        const userFromSession: User = {
          id: session.user.id,
          username: session.user.username || "", // Provide a default if username is missing
          role: session.user.role,
        };

        setUser(userFromSession); // Set user data from session
      }
    };

    fetchSession();
  }, [router]);

  if (!user) {
    return <p>Loading...</p>; // Show loading state
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Username: {user.username}</p>
      <p>Role: {user.role}</p>
      <button
        onClick={() => router.push("/profile")} // Redirect to profile page
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Profile
      </button>
      <button
        onClick={() => signOut()} // Logout function
        className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default withLayout(Dashboard);
