import React, { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useStore';
import { useProfile } from '../hooks/useProfile';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { profile } = useProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
      >
        <User size={20} />
        <span className="text-sm font-medium">{profile?.username || user.email}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2">
          <div className="px-4 py-2 border-b border-gray-800">
            <p className="text-sm font-medium">{profile?.full_name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800/50 transition-colors flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}; 