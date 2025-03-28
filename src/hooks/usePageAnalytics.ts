import { useEffect, useRef, useCallback } from 'react';
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
  const updateTimeout = useRef<NodeJS.Timeout>();

  const recordPageView = useCallback(async () => {
    try {
      console.log('Recording page view:', {
        chapterIndex,
        subChapterIndex,
        userId: user?.id,
        isLoggedIn: !!user
      });

      if (user) {
        // Record in page_views table for logged-in users
        const { data, error } = await supabase
          .from('page_views')
          .insert({
            user_id: user.id,
            chapter_index: chapterIndex,
            sub_chapter_index: subChapterIndex,
            is_logged_in: true,
            time_spent: 0
          })
          .select()
          .single();

        if (error) {
          console.error('Error recording page view:', error);
          return;
        }

        pageViewId.current = data.id;
      } else {
        // Record in anonymous_page_views table for non-logged-in users
        const { data, error } = await supabase
          .from('anonymous_page_views')
          .insert({
            chapter_index: chapterIndex,
            sub_chapter_index: subChapterIndex,
            time_spent: 0
          })
          .select()
          .single();

        if (error) {
          console.error('Error recording anonymous page view:', error);
          return;
        }

        pageViewId.current = data.id;
      }
    } catch (error) {
      console.error('Error recording page view:', error);
    }
  }, [chapterIndex, subChapterIndex, user]);

  const updateTimeSpent = useCallback(async () => {
    if (!pageViewId.current) return;

    const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
    const table = user ? 'page_views' : 'anonymous_page_views';
    
    try {
      const { error } = await supabase
        .from(table)
        .update({ time_spent: timeSpent })
        .eq('id', pageViewId.current);

      if (error) {
        console.error('Error updating time spent:', error);
      }
    } catch (error) {
      console.error('Error updating time spent:', error);
    }
  }, [user]);

  useEffect(() => {
    recordPageView();

    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
      updateTimeSpent();
    };
  }, [recordPageView, updateTimeSpent]);

  // Update time spent every 30 seconds while the page is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (pageViewId.current) {
        updateTimeSpent();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [updateTimeSpent]);
}; 