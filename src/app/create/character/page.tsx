'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CharacterCreationForm } from '@/components/create/character/CharacterCreationForm';
import { CharacterPreview } from '@/components/create/character/CharacterPreview';
import { BackButton } from '@/components/common/BackButton';
import { useCharacterStore } from '@/store/characterStore';
import { Modal } from '@/components/ui/Modal';

interface Character {
  name: string;
  gender: string;
  age: number;
  stats: {
    appearance: number;
    charisma: number;
    speech: number;
    luck: number;
    wit: number;
  } | string;
}

export default function CreateCharacterPage() {
  const [showExitModal, setShowExitModal] = useState(false);
  const { character, setInitialCharacter, setCharacter } = useCharacterStore();
  const router = useRouter();

  const handleCharacterUpdate = (newCharacter: Character) => {
    setCharacter(newCharacter);
  };

  const handleBack = () => {
    setInitialCharacter();
    router.back();
  };

  return (
    character && (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <BackButton onClick={() => setShowExitModal(true)} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">주인공 만들기</h1>
          <p className="text-gray-400 mb-8">나만의 주인공을 만들어보세요</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CharacterCreationForm
              character={character}
              onUpdate={handleCharacterUpdate}
              setInitialCharacter={setInitialCharacter}
            />

            <div className="sticky top-8">
              <CharacterPreview character={character} />
            </div>
          </div>
        </div>
        <Modal
          isOpen={showExitModal}
          onClose={() => setShowExitModal(false)}
          onConfirm={handleBack}
          title="캐릭터 생성 취소"
          description="작성 중인 데이터가 모두 삭제됩니다."
          confirmText="나가기"
          cancelText="취소"
        />
      </div>
    )
  );
}
