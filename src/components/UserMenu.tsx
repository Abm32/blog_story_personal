import React, { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { SignUpModal } from './SignUpModal';

export const UserMenu: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const handleAuthClick = (login: boolean) => {
    console.log('Auth button clicked:', { login, currentModalState: isModalOpen });
    setIsLogin(login);
    setIsModalOpen(true);
    console.log('Modal state updated:', { isLogin: login, isModalOpen: true });
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleAuthClick(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => handleAuthClick(false)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
      <div className="flex items-center gap-4">
        <span className="text-gray-300">{user.email}</span>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      <SignUpModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLogin={isLogin}
      />
    </div>
  );
}; 