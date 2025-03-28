import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface ReadingState {
  currentChapterIndex: number;
  currentSubChapterIndex: number;
  setCurrentChapterIndex: (index: number) => void;
  setCurrentSubChapterIndex: (index: number) => void;
}

interface NavigationState {
  isNavigationOpen: boolean;
  setIsNavigationOpen: (isOpen: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useReadingStore = create<ReadingState>((set) => ({
  currentChapterIndex: 0,
  currentSubChapterIndex: -1,
  setCurrentChapterIndex: (index) => set({ currentChapterIndex: index }),
  setCurrentSubChapterIndex: (index) => set({ currentSubChapterIndex: index }),
}));

export const useNavigationStore = create<NavigationState>((set) => ({
  isNavigationOpen: false,
  setIsNavigationOpen: (isOpen) => set({ isNavigationOpen: isOpen }),
})); 