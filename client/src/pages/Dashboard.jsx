import React from 'react';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Zustand se token delete
    navigate('/login'); // Wapas login screen par
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold text-[#38BDF8] mb-4">
        Welcome to Dashboard!
      </h1>
      {/* Agar backend ne username bheja hai toh dikhayega */}
      <p className="text-xl mb-8 text-[#94A3B8]">
        Hello, {user?.username || 'User'} 👋
      </p>
      
      <button 
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;