export interface Chapter {
  title: string;
  content: string;
  subChapters?: SubChapter[];
}

export interface SubChapter {
  title: string;
  content: string;
}

export interface Story {
  title: string;
  prologue?: string;
  chapters: Chapter[];
}

export interface Bookmark {
  id: string;
  user_id: string;
  chapter_index: number;
  sub_chapter_index: number;
  created_at: string;
  updated_at: string;
}