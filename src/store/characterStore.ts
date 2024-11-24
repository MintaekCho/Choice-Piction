import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Character } from '@/types';

interface CharacterStore {
  character: Character | null;
  setCharacter: (character: Character) => void;
  setInitialCharacter: () => void;
  resetCharacter: () => void;
}

const initialCharacter: Character = {
  name: '',
  gender: '',
  appearance: '',
  personality: '',
  background: '',
  profileImage: '',
  age: 20,
  stats: {
    appearance: 0,
    charisma: 0,
    speech: 0,
    luck: 0,
    wit: 0
  }
};

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      character: initialCharacter,
      setCharacter: (character) => set({ character }),
      setInitialCharacter: () => set({ character: initialCharacter }),
      resetCharacter: () => set({ character: initialCharacter })
    }),
    {
      name: 'character-storage',
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
        character: state.character,
      }),
    }
  )
); 