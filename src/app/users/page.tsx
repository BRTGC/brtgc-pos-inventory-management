"use client";

import { useEffect, useState } from "react";
import { PublicUser } from "@/types/User";
import withLayout from "@/components/withLayout";
import { getSession } from "next-auth/react";
import ChangePasswordModal from "@/components/Modal";
import Loading from "@/components/Loading";
import useCheckSessionData from "@/libs/useCheckSessionData";

const UsersPage = () => {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Check session data before fetching users
  const sessionLoading = useCheckSessionData();

  // Cache expiration time in milliseconds (10 minutes)
  const cacheExpiration = 1000 * 60 * 10;

  // Fetch users data with caching and session check
  const fetchUsers = async (page: number) => {
    if (sessionLoading) return; // Return early if session check is still loading

    setLoading(true); // Set loading before API request
    const cacheKey = `users-page-${page}`;

    // Check if users data for the current page is already cached
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const { users, totalPages, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < cacheExpiration) {
        setUsers(users);
        setTotalPages(totalPages);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`/api/users?page=${page}`);
      const data = await response.json();
      if (data.status === "success") {
        setUsers(data.data.users);
        setTotalPages(data.data.totalPages);

        // Cache the fetched data along with a timestamp
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            users: data.data.users,
            totalPages: data.data.totalPages,
            timestamp: Date.now(),
          })
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false); // Stop loading after API request
    }
  };

  // Fetch users on page load and when currentPage changes
  useEffect(() => {
    if (!sessionLoading) {
      fetchUsers(currentPage);
    }
  }, [currentPage, sessionLoading]);

  // Fetch the session data to get user role
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) setUserRole(session.user?.role as string);
    };
    fetchSession();
  }, []);

  // Handle pagination (next and previous page)
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });
    if (response.ok) {
      alert("User deleted successfully");
      localStorage.removeItem(`users-page-${currentPage}`); // Invalidate the cache for the current page
      fetchUsers(currentPage); // Re-fetch users after deletion
    } else {
      alert("Failed to delete user");
    }
  };

  // Handle password change for a selected user
  const handleChangePassword = async (newPassword: string) => {
    if (!selectedUser) return;

    const response = await fetch(`/api/users/${selectedUser}/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    if (response.ok) {
      alert("Password changed successfully");
      fetchUsers(currentPage); // Re-fetch users after password change
    } else {
      alert("Failed to change password");
    }
  };

  // Open the modal to change the password
  const openChangePasswordModal = (userId: string) => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-center md:text-left mb-4 md:mb-0">
          User Directory
        </h1>
        {userRole === "ADMIN" && (
          <a
            href="/users/new-users"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 hover:bg-blue-700"
          >
            Add New User
          </a>
        )}
      </div>

      {loading || sessionLoading ? (
        <Loading /> // Use the loading component when data is being fetched
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.length === 0 ? (
            <div className="col-span-1 text-center">
              <p className="text-lg">No users found.</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4"
              >
                <h2 className="text-xl font-semibold text-blue-600">{user.name}</h2>
                <p className="text-gray-700">{user.username}</p>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-gray-400 text-sm">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => openChangePasswordModal(user.id)}
                    className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded hover:bg-yellow-600"
                  >
                    Change Password
                  </button>
                  {userRole === "ADMIN" && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 text-white font-semibold py-1 px-3 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePreviousPage}
          className="bg-gray-400 text-white font-semibold py-2 px-4 rounded hover:bg-gray-500 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="bg-gray-400 text-white font-semibold py-2 px-4 rounded hover:bg-gray-500 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <ChangePasswordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onChangePassword={handleChangePassword}
        />
      )}
    </div>
  );
};

export default withLayout(UsersPage);
