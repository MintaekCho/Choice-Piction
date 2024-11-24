import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Character, StoryPrompt, ChapterContext } from '@/types';

interface StoryState {
  selectedCharacter: Character | null;
  selectedGenre: string;
  selectedStoryPrompt: StoryPrompt | null;
  chapterContext: ChapterContext | null;
  setCharacter: (character: Character | null) => void;
  setGenre: (genre: string) => void;
  setStoryPrompt: (storyPrompt: StoryPrompt | null) => void;
  setChapterContext: (chapterContext: ChapterContext | null) => void;
  reset: () => void;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      selectedCharacter: null,
      selectedGenre: '',
      selectedStoryPrompt: null,
      chapterContext: null,
      setCharacter: (character) => set({ selectedCharacter: character }),
      setGenre: (genre) => set({ selectedGenre: genre }),
      setStoryPrompt: (storyPrompt) => set({ selectedStoryPrompt: storyPrompt }),
      setChapterContext: (chapterContext) => set({ chapterContext }),
      reset: () => set({
        selectedCharacter: null,
        selectedGenre: '',
        selectedStoryPrompt: null,
        chapterContext: null
      })
    }),
    {
      name: 'story-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => null,
          removeItem: () => null,
        };
      }),
      partialize: (state) => ({
        selectedCharacter: state.selectedCharacter,
        selectedGenre: state.selectedGenre,
        selectedStoryPrompt: state.selectedStoryPrompt,
        chapterContext: state.chapterContext,
      }),
    }
  )
); 