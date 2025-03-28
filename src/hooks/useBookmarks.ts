import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Bookmark } from '../types/story';
import { useAuthStore } from '../store/useStore';

export const useBookmarks = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: bookmark, isLoading, error } = useQuery({
    queryKey: ['bookmark', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id, user_id, chapter_index, sub_chapter_index, created_at, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Bookmark;
    },
    enabled: !!user,
  });

  const saveBookmarkMutation = useMutation({
    mutationFn: async ({ chapterIndex, subChapterIndex }: { chapterIndex: number; subChapterIndex: number }) => {
      if (!user) throw new Error('User not authenticated');
      
      const bookmarkData = {
        user_id: user.id,
        chapter_index: chapterIndex,
        sub_chapter_index: subChapterIndex,
      };

      // Try to insert first, if it fails due to unique constraint, update
      const { data, error: insertError } = await supabase
        .from('bookmarks')
        .insert(bookmarkData)
        .select('id, user_id, chapter_index, sub_chapter_index, created_at, updated_at')
        .single();

      if (insertError && insertError.code === '23505') { // Unique violation
        // If insert failed due to unique constraint, update the existing record
        const { data: updateData, error: updateError } = await supabase
          .from('bookmarks')
          .update({
            chapter_index: chapterIndex,
            sub_chapter_index: subChapterIndex,
          })
          .eq('user_id', user.id)
          .select('id, user_id, chapter_index, sub_chapter_index, created_at, updated_at')
          .single();

        if (updateError) throw updateError;
        return updateData as Bookmark;
      }

      if (insertError) throw insertError;
      return data as Bookmark;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['bookmark', user?.id], data);
    },
  });

  return {
    bookmark,
    isLoading,
    error,
    saveBookmark: saveBookmarkMutation.mutate,
    isSaving: saveBookmarkMutation.isPending,
  };
}; 