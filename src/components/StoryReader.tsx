import React from 'react';
import { Star, ChevronLeft, ChevronRight, BookOpen, Bookmark, Menu, X } from 'lucide-react';
import { Story, Chapter, SubChapter } from '../types/story';
import { SignUpModal } from './SignUpModal';
import { supabase } from '../lib/supabase';
import { useAuthStore, useReadingStore, useNavigationStore } from '../store/useStore';
import { useBookmarks } from '../hooks/useBookmarks';
import { UserMenu } from './UserMenu';
import { SpaceBackground } from './SpaceBackground';
import { usePageAnalytics } from '../hooks/usePageAnalytics';

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

  const isCurrentPageBookmarked = React.useMemo(() => {
    if (!bookmark) return false;
    return bookmark.chapter_index === currentChapterIndex && 
           bookmark.sub_chapter_index === currentSubChapterIndex;
  }, [bookmark, currentChapterIndex, currentSubChapterIndex]);

  const handleSaveBookmark = () => {
    if (!user) {
      setShowSignUpModal(true);
      return;
    }

    // If current page is bookmarked, remove the bookmark
    if (isCurrentPageBookmarked) {
      saveBookmark({
        chapterIndex: -1, // Reset to prologue
        subChapterIndex: -1,
      });
      return;
    }

    // Save current page as bookmark
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

  // Add page analytics tracking with proper indices
  usePageAnalytics({
    chapterIndex: currentChapterIndex,
    subChapterIndex: currentSubChapterIndex,
  });

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-gray-200 relative">
      {/* Space Background */}
      <SpaceBackground />

      {/* Mobile Navigation Toggle */}
      <button
        onClick={() => setIsNavigationOpen(!isNavigationOpen)}
        className={`fixed top-4 left-4 z-[100] p-2 rounded-full bg-gray-800/70 hover:bg-gray-700/70 transition-colors md:hidden ${
          isNavigationOpen ? 'z-[200]' : ''
        }`}
        title={isNavigationOpen ? "Close book index" : "Open book index"}
      >
        {isNavigationOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation Toggle */}
      <button
        onClick={() => setIsNavigationOpen(!isNavigationOpen)}
        className="fixed top-4 left-4 z-[100] p-2 rounded-full bg-gray-800/70 hover:bg-gray-700/70 transition-colors hidden md:block"
        title={isNavigationOpen ? "Close book index" : "Open book index"}
      >
        <BookOpen size={24} />
      </button>

      {/* Top Right Controls */}
      <div className={`fixed top-4 right-4 z-[100] flex items-center space-x-4 ${
        isNavigationOpen ? 'z-[150]' : ''
      }`}>
        {/* Bookmark Button */}
        <button
          onClick={handleSaveBookmark}
          disabled={isSaving}
          className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isCurrentPageBookmarked
              ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
              : 'bg-gray-800/70 hover:bg-gray-700/70 text-gray-400'
          }`}
          title={isCurrentPageBookmarked ? "Remove bookmark" : "Save your reading progress"}
        >
          <Bookmark size={24} className={isCurrentPageBookmarked ? 'fill-current' : ''} />
        </button>

        {/* User Menu */}
        <UserMenu />
      </div>

      {/* Navigation Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-full md:w-72 bg-gray-900/95 backdrop-blur-sm transform transition-transform duration-300 z-[200] overflow-y-auto ${
          isNavigationOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{story.title}</h2>
            <button
              onClick={() => setIsNavigationOpen(false)}
              className="p-2 rounded-full hover:bg-gray-800/70 transition-colors"
              title="Close book index"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => {
                setCurrentChapterIndex(0);
                setCurrentSubChapterIndex(-1);
                setIsNavigationOpen(false);
              }}
              className={`w-full text-left p-2 rounded hover:bg-gray-800/70 transition-colors ${
                currentSubChapterIndex === -1 ? 'bg-gray-800/70' : ''
              } ${bookmark?.chapter_index === 0 && bookmark?.sub_chapter_index === -1 ? 'text-blue-400' : 'text-gray-100'}`}
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
                  className={`w-full text-left p-2 rounded hover:bg-gray-800/70 transition-colors font-semibold ${
                    bookmark?.chapter_index === chapterIdx && bookmark?.sub_chapter_index === 0 ? 'text-blue-400' : 'text-gray-100'
                  }`}
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
                    className={`w-full text-left p-2 pl-6 rounded hover:bg-gray-800/70 transition-colors ${
                      currentChapterIndex === chapterIdx && currentSubChapterIndex === subIdx
                        ? 'bg-gray-800/70'
                        : ''
                    } ${bookmark?.chapter_index === chapterIdx && bookmark?.sub_chapter_index === subIdx ? 'text-blue-400' : 'text-gray-100'}`}
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
        {/* Content Background */}
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm rounded-2xl -z-10"></div>
        
        <div className="mb-8 space-y-2">
          {currentSubChapterIndex !== -1 && (
            <div className="text-sm text-gray-300 tracking-wider uppercase text-center">
              {story.chapters[currentChapterIndex].title}
            </div>
          )}
          <h1 className="text-3xl font-bold text-center text-white">{getCurrentTitle()}</h1>
        </div>
        
        <div className="prose prose-invert mx-auto">
          {getCurrentContent()?.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 leading-relaxed text-gray-100">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => handleNavigation('prev')}
            disabled={currentChapterIndex === 0 && currentSubChapterIndex === -1}
            className="p-2 rounded-full bg-gray-800/70 hover:bg-gray-700/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="p-2 rounded-full bg-gray-800/70 hover:bg-gray-700/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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