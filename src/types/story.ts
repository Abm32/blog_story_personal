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