"use client";

import { useState } from 'react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (newPassword: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onChangePassword }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Track if admin password is verified

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      // Verify the admin password before changing the user password
      const response = await fetch('/api/verify-admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }), // Send the admin password to backend
      });

      const data = await response.json();

      if (data.status === 'success') {
        setIsVerified(true); // Admin password verified
        onChangePassword(newPassword); // Proceed to change password
        onClose(); // Close the modal
      } else {
        setError(data.message); // Show error message
      }
    } catch (error) {
      setError('Failed to verify password. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null; // Return null if the modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded-lg p-6 shadow-lg z-10 w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">Change User Password</h2>
        <form onSubmit={handleSubmit}>
          {!isVerified && (
            <div>
              <label className="block mb-1" htmlFor="admin-password">Admin Password</label>
              <input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded mb-4"
                placeholder="Enter admin password"
                title="Enter your admin password"
                required
              />
            </div>
          )}
          <div>
            <label className="block mb-1" htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded mb-4"
              placeholder="Enter new password"
              title="Enter your new password"
              required
            />
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
