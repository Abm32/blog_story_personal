import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useStore';

interface PageAnalyticsProps {
  chapterIndex: number;
  subChapterIndex: number;
}

export const usePageAnalytics = ({ chapterIndex, subChapterIndex }: PageAnalyticsProps) => {
  const startTimeRef = useRef<number>(Date.now());
  const pageViewIdRef = useRef<string | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const recordPageView = async () => {
      try {
        console.log('Recording page view:', { chapterIndex, subChapterIndex, userId: user?.id });
        
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

        console.log('Page view recorded successfully:', data);
        pageViewIdRef.current = data.id;
      } catch (error) {
        console.error('Error in recordPageView:', error);
      }
    };

    recordPageView();

    return () => {
      const updateTimeSpent = async () => {
        if (!pageViewIdRef.current) return;

        try {
          const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
          console.log('Updating time spent:', { pageViewId: pageViewIdRef.current, timeSpent });

          const { error } = await supabase
            .from('page_views')
            .update({ time_spent: timeSpent })
            .eq('id', pageViewIdRef.current);

          if (error) {
            console.error('Error updating time spent:', error);
          } else {
            console.log('Time spent updated successfully');
          }
        } catch (error) {
          console.error('Error in updateTimeSpent:', error);
        }
      };

      updateTimeSpent();
    };
  }, [chapterIndex, subChapterIndex, user?.id]);
}; 