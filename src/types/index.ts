// 캐릭터 관련 타입
export interface Character {
  id?: string;
  name: string;
  gender: string;
  age: number;
  profileImage?: string;
  personality?: string;
  appearance?: string;
  background?: string;
  stats: CharacterStats | string;
}

// 캐릭터 능력치 타입
export interface CharacterStats {
  appearance: number;    // 외모: 첫인상, 패션센스
  charisma: number;     // 카리스마: 리더십, 영향력
  speech: number;       // 말빨: 설득력, 협상능력
  luck: number;         // 운: 우연한 기회, 위기탈출
  wit: number;          // 재치: 순발력, 기지
}

// 스토리 관련 타입
export interface Story {
  id?: string;
  title: string;
  description: string;
  genre: string[];
  status: StoryStatus;
  mainCharacterId: string;
  chapters?: Chapter[];
}

// 챕터 타입
export interface Chapter {
  id?: string;
  title: string;
  content: string;
  sequence: number;
  summary?: string;
  keyEvents?: string[];
  choices?: Choice[];
}

// 선택지 타입
export interface Choice {
  id?: string;
  content: string;
  nextChapterId?: string;
  votes?: number;
}

// AI 관련 타입
export interface StoryPrompt {
  title: string;
  description: string;
  preview: string;
}

// 챕터 컨텍스트 타입
export interface ChapterContext {
  currentChapter: {
    content: string;
    sequence: number;
  };
  previousChapter?: {
    content: string;
    sequence: number;
  };
  characterState: {
    name: string;
    stats: Record<string, number>;
    currentStatus?: string[];
  };
  storySummary?: {
    title: string;
    genre: string;
    mainEvents: string[];
    worldSettings?: string[];
  };
}

export interface EditorState {
  character: Character | null;
  genre: string;
  title: string;
  preview: string;
  content: string;
  suggestions: string[];
  isGenerating: boolean;
  selectedSuggestion: string | null;
  chapterContext: ChapterContext | null;
  storyId?: string;
}

// 투표 관련 타입
export interface Vote {
  id?: string;
  storyId: string;
  choiceId: string;
  userId: string;
  createdAt?: Date;
}

export interface VoteOption {
  id: string;
  content: string;
  votes: number;
}

// 유틸리티 타입
export type StoryStatus = 'DRAFT' | 'ONGOING' | 'COMPLETED';
export type UserRole = 'FREE' | 'PREMIUM';

// 컴포넌트 Props 타입
export interface CharacterCreationFormProps {
  character: Character;
  onUpdate: (character: Character) => void;
  setInitialCharacter: () => void;
}

export interface CharacterPreviewProps {
  character?: Character;
}

export interface GenreSelectionProps {
  genres: {
    id: string;
    title: string;
    description: string;
    icon: string;
    examples: string[];
  }[];
}

export interface CharacterModel {
  id: string;
  name: string;
  gender: string;
  age: number;
  stats: CharacterStats | string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  profileImage: string;
  personality: string;
  background: string;
  appearance: string;
}
