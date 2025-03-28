import React, { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { SignUpModal } from './SignUpModal';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!user) {
    return (
      <>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 rounded-full bg-gray-800/70 hover:bg-gray-700/70 text-gray-300 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => setShowSignUpModal(true)}
            className="px-4 py-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
          >
            Sign Up
          </button>
        </div>
        {showSignUpModal && (
          <SignUpModal
            onClose={() => setShowSignUpModal(false)}
            onSignUp={() => {
              setShowSignUpModal(false);
              // User will be automatically authenticated through Supabase's auth state change
            }}
          />
        )}
        {showLoginModal && (
          <SignUpModal
            onClose={() => setShowLoginModal(false)}
            onSignUp={() => {
              setShowLoginModal(false);
              // User will be automatically authenticated through Supabase's auth state change
            }}
            isLogin={true}
          />
        )}
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800/70 transition-colors"
      >
        <User size={24} />
        <span className="text-sm">{user.user_metadata?.full_name || user.email}</span>
        <ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-lg py-1 z-[100]">
          <button
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/70 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}; 