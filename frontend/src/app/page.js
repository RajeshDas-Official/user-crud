"use client";


import { useState } from 'react';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import OTPVerification from '../components/OTPVerification';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleVerifyUser = (user) => {
    setSelectedUser(user);
    setShowOTPModal(true);
  };

  const handleFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleVerificationSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">Manage users with OTP verification</p>
            </div>
            <button
              onClick={handleCreateUser}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create User
            </button>
          </div>
        </div>

        <UserList
          onEditUser={handleEditUser}
          onVerifyUser={handleVerifyUser}
          refreshTrigger={refreshTrigger}
        />

        {showForm && (
          <UserForm
            user={selectedUser}
            onClose={() => setShowForm(false)}
            onSuccess={handleFormSuccess}
          />
        )}

        {showOTPModal && (
          <OTPVerification
            user={selectedUser}
            onClose={() => setShowOTPModal(false)}
            onSuccess={handleVerificationSuccess}
          />
        )}
      </div>
    </div>
  );
}