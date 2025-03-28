import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useStore';

interface UserPreferences {
  font_size: string;
  theme: string;
  last_read_chapter: number;
  last_read_sub_chapter: number;
  reading_progress: Record<string, any>;
}

export const useUserPreferences = () => {
  const { user } = useAuthStore();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setPreferences(data);
      } catch (err: any) {
        console.error('Error fetching preferences:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      setError(null);
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
    } catch (err: any) {
      console.error('Error updating preferences:', err);
      setError(err.message);
    }
  };

  const updateReadingProgress = async (chapterIndex: number, subChapterIndex: number) => {
    if (!user) return;

    try {
      setError(null);
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          last_read_chapter: chapterIndex,
          last_read_sub_chapter: subChapterIndex,
          reading_progress: {
            ...preferences?.reading_progress,
            [`${chapterIndex}-${subChapterIndex}`]: Date.now(),
          },
        })
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
    } catch (err: any) {
      console.error('Error updating reading progress:', err);
      setError(err.message);
    }
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    updateReadingProgress,
  };
}; 