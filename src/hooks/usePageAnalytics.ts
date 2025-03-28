import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useStore';

interface PageAnalyticsProps {
  chapterIndex: number;
  subChapterIndex: number;
}

export const usePageAnalytics = ({ chapterIndex, subChapterIndex }: PageAnalyticsProps) => {
  const user = useAuthStore((state) => state.user);
  const startTimeRef = useRef<number>(Date.now());
  const pageViewIdRef = useRef<string | null>(null);

  // Record page view when component mounts
  useEffect(() => {
    const recordPageView = async () => {
      const { data, error } = await supabase
        .from('page_views')
        .insert([
          {
            user_id: user?.id || null,
            chapter_index: chapterIndex,
            sub_chapter_index: subChapterIndex,
            is_logged_in: !!user,
            time_spent: 0,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error recording page view:', error);
        return;
      }

      pageViewIdRef.current = data.id;
    };

    recordPageView();

    // Record time spent when component unmounts
    return () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000); // Convert to seconds

      if (pageViewIdRef.current) {
        supabase
          .from('page_views')
          .update({ time_spent: timeSpent })
          .eq('id', pageViewIdRef.current)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating time spent:', error);
            }
          });
      }
    };
  }, [chapterIndex, subChapterIndex, user?.id]);
}; 