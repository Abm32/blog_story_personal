import React, { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { SignUpModal } from './SignUpModal';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleSignUpClick = () => {
    setIsLogin(false);
    setIsModalOpen(true);
  };

  const handleLoginClick = () => {
    setIsLogin(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleLoginClick}
          className="px-4 py-2 rounded-full bg-gray-800/70 hover:bg-gray-700/70 text-gray-300 transition-colors"
        >
          Login
        </button>
        <button
          onClick={handleSignUpClick}
          className="px-4 py-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
        >
          Sign Up
        </button>

        <SignUpModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isLogin={isLogin}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800/70 transition-colors"
      >
        <User size={24} />
        <span className="text-sm">{user.user_metadata?.full_name || user.email}</span>
        <ChevronDown size={16} className={`transform transition-transform ${isModalOpen ? 'rotate-180' : ''}`} />
      </button>

      {isModalOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-lg py-1 z-[100]">
          <button
            onClick={signOut}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/70 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      <SignUpModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLogin={isLogin}
      />
    </div>
  );
}; 