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
        setIsVerified(true); // Mark admin password as verified
      } else {
        setError('Incorrect admin password');
      }
    } catch (err) {
      setError('An error occurred during password verification.');
    }

    setIsVerifying(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    onChangePassword(newPassword);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Change User Password</h2>
        {error && <p className="text-red-600">{error}</p>}

        {/* Admin password verification form */}
        {!isVerified && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="adminPassword" className="block mb-1">Admin Password</label>
              <input
                type="password"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="border rounded w-full py-2 px-3"
                required
                disabled={isVerifying} // Disable input during verification
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 text-white py-1 px-4 rounded"
                disabled={isVerifying} // Disable button during verification
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-1 px-4 rounded"
                disabled={isVerifying} // Disable button during verification
              >
                {isVerifying ? 'Verifying...' : 'Verify Admin Password'}
              </button>
            </div>
          </form>
        )}

        {/* New password field, visible only after admin password is verified */}
        {isVerified && (
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block mb-1">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border rounded w-full py-2 px-3"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 text-white py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-1 px-4 rounded"
              >
                Change Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
