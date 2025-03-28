import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useStore';

interface PageAnalyticsProps {
  chapterIndex: number;
  subChapterIndex: number;
}

export const usePageAnalytics = ({ chapterIndex, subChapterIndex }: PageAnalyticsProps) => {
  const startTime = useRef<number>(Date.now());
  const pageViewId = useRef<string | null>(null);
  const { user } = useAuthStore();

  const recordPageView = async () => {
    try {
      console.log('Recording page view:', {
        chapterIndex,
        subChapterIndex,
        userId: user?.id,
        isLoggedIn: !!user
      });

      const { data, error } = await supabase
        .from('page_views')
        .insert({
          user_id: user?.id || null,
          chapter_index: chapterIndex,
          sub_chapter_index: subChapterIndex,
          is_logged_in: !!user,
          time_spent: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording page view:', error);
        return;
      }

      pageViewId.current = data.id;
    } catch (error) {
      console.error('Error recording page view:', error);
    }
  };

  useEffect(() => {
    recordPageView();

    return () => {
      if (pageViewId.current) {
        const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
        supabase
          .from('page_views')
          .update({ time_spent: timeSpent })
          .eq('id', pageViewId.current)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating time spent:', error);
            }
          });
      }
    };
  }, [chapterIndex, subChapterIndex]);
}; 