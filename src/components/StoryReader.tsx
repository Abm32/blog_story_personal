import React from 'react';
import { Star, ChevronLeft, ChevronRight, BookOpen, Bookmark } from 'lucide-react';
import { Story, Chapter, SubChapter } from '../types/story';
import { SignUpModal } from './SignUpModal';
import { supabase } from '../lib/supabase';
import { useAuthStore, useReadingStore, useNavigationStore } from '../store/useStore';
import { useBookmarks } from '../hooks/useBookmarks';
import { UserMenu } from './UserMenu';

interface StoryReaderProps {
  story: Story;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story }) => {
  const user = useAuthStore((state) => state.user);
  const { currentChapterIndex, currentSubChapterIndex, setCurrentChapterIndex, setCurrentSubChapterIndex } = useReadingStore();
  const { isNavigationOpen, setIsNavigationOpen } = useNavigationStore();
  const [showSignUpModal, setShowSignUpModal] = React.useState(false);
  const { bookmark, saveBookmark, isSaving } = useBookmarks();

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      useAuthStore.getState().setUser(session?.user ?? null);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSaveBookmark = () => {
    if (!user) {
      setShowSignUpModal(true);
      return;
    }

    saveBookmark({
      chapterIndex: currentChapterIndex,
      subChapterIndex: currentSubChapterIndex,
    });
  };

  const getCurrentContent = () => {
    if (currentSubChapterIndex === -1) {
      return story.prologue;
    }
    
    const chapter = story.chapters[currentChapterIndex];
    if (!chapter.subChapters || currentSubChapterIndex >= chapter.subChapters.length) {
      return chapter.content;
    }
    
    return chapter.subChapters[currentSubChapterIndex].content;
  };

  const getCurrentTitle = () => {
    if (currentSubChapterIndex === -1) {
      return "Prologue";
    }
    
    const chapter = story.chapters[currentChapterIndex];
    if (!chapter.subChapters || currentSubChapterIndex >= chapter.subChapters.length) {
      return chapter.title;
    }
    
    return chapter.subChapters[currentSubChapterIndex].title;
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      const currentChapter = story.chapters[currentChapterIndex];
      
      if (currentSubChapterIndex === 2 && !user) {
        setShowSignUpModal(true);
        return;
      }

      if (
        currentSubChapterIndex === -1 ||
        (currentChapter.subChapters &&
          currentSubChapterIndex < currentChapter.subChapters.length - 1)
      ) {
        setCurrentSubChapterIndex(currentSubChapterIndex + 1);
      } else if (currentChapterIndex < story.chapters.length - 1) {
        setCurrentChapterIndex(currentChapterIndex + 1);
        setCurrentSubChapterIndex(0);
      }
    } else {
      if (currentSubChapterIndex > -1) {
        setCurrentSubChapterIndex(currentSubChapterIndex - 1);
      } else if (currentChapterIndex > 0) {
        setCurrentChapterIndex(currentChapterIndex - 1);
        setCurrentSubChapterIndex(
          story.chapters[currentChapterIndex - 1].subChapters?.length ?? 0 - 1
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-gray-200 relative">
      {/* Animated stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <Star
            key={i}
            className="absolute animate-pulse text-white/20"
            size={Math.random() * 4 + 2}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation Toggle */}
      <button
        onClick={() => setIsNavigationOpen(!isNavigationOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
      >
        <BookOpen size={24} />
      </button>

      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
        {/* Bookmark Button */}
        <button
          onClick={handleSaveBookmark}
          disabled={isSaving}
          className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            bookmark
              ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
              : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400'
          }`}
          title={bookmark ? "Remove bookmark" : "Save your reading progress"}
        >
          <Bookmark size={24} className={bookmark ? 'fill-current' : ''} />
        </button>

        {/* User Menu */}
        <UserMenu />
      </div>

      {/* Navigation Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-gray-900/95 transform transition-transform duration-300 z-40 overflow-y-auto ${
          isNavigationOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{story.title}</h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                setCurrentChapterIndex(0);
                setCurrentSubChapterIndex(-1);
                setIsNavigationOpen(false);
              }}
              className={`w-full text-left p-2 rounded hover:bg-gray-800/50 transition-colors ${
                currentSubChapterIndex === -1 ? 'bg-gray-800/50' : ''
              }`}
            >
              Prologue
            </button>
            
            {story.chapters.map((chapter, chapterIdx) => (
              <div key={chapterIdx} className="space-y-2">
                <button
                  onClick={() => {
                    setCurrentChapterIndex(chapterIdx);
                    setCurrentSubChapterIndex(0);
                    setIsNavigationOpen(false);
                  }}
                  className="w-full text-left p-2 rounded hover:bg-gray-800/50 transition-colors font-semibold"
                >
                  {chapter.title}
                </button>
                
                {chapter.subChapters?.map((subChapter, subIdx) => (
                  <button
                    key={subIdx}
                    onClick={() => {
                      if (subIdx > 2 && !user) {
                        setShowSignUpModal(true);
                        return;
                      }
                      setCurrentChapterIndex(chapterIdx);
                      setCurrentSubChapterIndex(subIdx);
                      setIsNavigationOpen(false);
                    }}
                    className={`w-full text-left p-2 pl-6 rounded hover:bg-gray-800/50 transition-colors ${
                      currentChapterIndex === chapterIdx && currentSubChapterIndex === subIdx
                        ? 'bg-gray-800/50'
                        : ''
                    }`}
                  >
                    {subChapter.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="container mx-auto px-4 py-16 max-w-3xl relative z-10"
        onClick={() => setIsNavigationOpen(false)}
      >
        <div className="mb-8 space-y-2">
          {currentSubChapterIndex !== -1 && (
            <div className="text-sm text-gray-400 tracking-wider uppercase text-center">
              {story.chapters[currentChapterIndex].title}
            </div>
          )}
          <h1 className="text-3xl font-bold text-center">{getCurrentTitle()}</h1>
        </div>
        
        <div className="prose prose-invert mx-auto">
          {getCurrentContent()?.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => handleNavigation('prev')}
            disabled={currentChapterIndex === 0 && currentSubChapterIndex === -1}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={() => handleNavigation('next')}
            disabled={
              currentChapterIndex === story.chapters.length - 1 &&
              currentSubChapterIndex ===
                (story.chapters[currentChapterIndex].subChapters?.length ?? 0) - 1
            }
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <SignUpModal
          onClose={() => setShowSignUpModal(false)}
          onSignUp={() => {
            setShowSignUpModal(false);
            // User will be automatically authenticated through Supabase's auth state change
          }}
        />
      )}
    </div>
  );
};