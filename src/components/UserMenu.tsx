import React, { useState } from 'react';
import { User, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { SignUpModal } from './SignUpModal';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUpClick = () => {
    setIsLogin(false);
    setIsModalOpen(true);
    setError(null);
  };

  const handleLoginClick = () => {
    setIsLogin(true);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {user ? (
        <>
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
              {error && (
                <div className="px-4 py-2 text-sm text-red-500">
                  {error}
                </div>
              )}
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/70 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} />
                )}
                <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </>
      ) : (
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