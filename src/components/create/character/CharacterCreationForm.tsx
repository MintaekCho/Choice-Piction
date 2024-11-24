'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, User, MessageCircle, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {  CharacterCreationFormProps } from '@/types';
import { CharacterImageUpload } from './CharacterImageUpload';
import { HashtagInput } from './HashtagInput';
import { Modal } from '@/components/ui/Modal';
import { useSession } from 'next-auth/react';
import { SuccessAnimation } from './SuccessAnimation';
import { debounce } from 'lodash';

const STAT_CONFIGS = {
  appearance: {
    icon: User,
    color: 'pink',
    label: '외모',
    description: '첫인상, 패션센스'
  },
  charisma: {
    icon: Crown,
    color: 'amber',
    label: '카리스마',
    description: '리더십, 영향력'
  },
  speech: {
    icon: MessageCircle,
    color: 'blue',
    label: '말빨',
    description: '설득력, 협상능력'
  },
  luck: {
    icon: Sparkles,
    color: 'purple',
    label: '운',
    description: '우연한 기회, 위기탈출'
  },
  wit: {
    icon: Zap,
    color: 'green',
    label: '재치',
    description: '순발력, 기지'
  }
} as const;

export function CharacterCreationForm({ character, onUpdate, setInitialCharacter }: CharacterCreationFormProps) {
  const [step, setStep] = useState(1);
  const [totalStats, setTotalStats] = useState(100);
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [nameError, setNameError] = useState<string>('');
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState(false);

  useEffect(() => {
    const total = Object.values(character.stats).reduce((a, b) => a + b, 0);
    setTotalStats(total);
    setIsOverLimit(total > 100);
  }, [character.stats]);

  useEffect(() => {
    // URL 파라미터에서 장르와 캐릭터 정보 가져오기
    const characterParam = searchParams?.get('character');

    if (characterParam) {
      try {
        onUpdate(JSON.parse(decodeURIComponent(characterParam)));
      } catch (e) {
        console.error('캐릭터 정보 파싱 실패:', e);
      }
    }
  }, [searchParams, onUpdate]);

  const handleStatChange = (stat: keyof typeof character.stats, value: number) => {
    const otherStatsTotal = Object.entries(character.stats)
      .filter(([key]) => key !== stat)
      .reduce((sum, [_, val]) => sum + val, 0);
    if(typeof character.stats === 'string') {
      return;
    }

    if (otherStatsTotal + value <= 100) {
      onUpdate({
        ...character,
        stats: { ...character.stats, [stat]: value },
      });
    }
  };

  const handleComplete = () => {
    setShowConfirmModal(true);
  };

  const createCharacter = async () => {
    if (!session?.user?.id) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...character,
          userId: session.user.id
        }),
      });

      if (!response.ok) {
        throw new Error('캐릭터 생성에 실패했습니다.');
      }

      setShowSuccess(true);
      
    } catch (error) {
      console.error('캐릭터 생성 에러:', error);
      alert('캐릭터 생성에 실패했습니다.');
    } finally {
      setIsCreating(false);
      setShowConfirmModal(false);
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setInitialCharacter();
    router.push('/');
  };

  // 이름 중복 검사 함수
  const checkCharacterName = debounce(async (name: string) => {
    if (name.length < 2) {
      setNameError('이름은 2자 이상이어야 합니다.');
      setIsNameAvailable(false);
      return;
    }

    setIsCheckingName(true);
    try {
      const response = await fetch('/api/characters/check-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      
      if (data.isAvailable) {
        setNameError('');
        setIsNameAvailable(true);
      } else {
        setNameError(data.message);
        setIsNameAvailable(false);
      }
    } catch (error) {
      setNameError('이름 검사 중 오류가 발생했습니다.');
      setIsNameAvailable(false);
    } finally {
      setIsCheckingName(false);
    }
  }, 1000);

  // 이름 입력 핸들러
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    onUpdate({ ...character, name: newName });
    
    if (newName.trim()) {
      checkCharacterName(newName);
    } else {
      setNameError('');
      setIsNameAvailable(false);
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20">
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-semibold text-white mb-4">기본 정보</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">프로필 이미지</label>
              <CharacterImageUpload
                currentImage={character.profileImage}
                onImageChange={(imageUrl) => onUpdate({ ...character, profileImage: imageUrl })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">이름</label>
              <div className="relative">
                <input
                  type="text"
                  value={character.name}
                  onChange={handleNameChange}
                  className={`w-full bg-gray-700/50 text-white px-3 py-2 rounded-lg ${
                    nameError ? 'border-red-500' : isNameAvailable ? 'border-green-500' : ''
                  }`}
                />
                {isCheckingName && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                  </div>
                )}
                {!isCheckingName && isNameAvailable && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    ✓
                  </div>
                )}
              </div>
              {nameError && (
                <p className="mt-1 text-sm text-red-400">{nameError}</p>
              )}
              {isNameAvailable && (
                <p className="mt-1 text-sm text-green-400">사용 가능한 이름입니다.</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-300">성별</label>
              <div className="flex gap-4 mt-1">
                <button
                  onClick={() => onUpdate({ ...character, gender: '남성' })}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    character.gender === '남성'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                  }`}
                >
                  남성
                </button>
                <button
                  onClick={() => onUpdate({ ...character, gender: '여성' })}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    character.gender === '여성'
                      ? 'bg-gradient-to-r from-pink-600 to-pink-400 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                  }`}
                >
                  여성
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-300">나이</label>
              <input
                type="number"
                min="1"
                max="100"
                value={character.age === 0 ? '' : character.age}
                onChange={(e) => onUpdate({ ...character, age: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded-lg"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!isNameAvailable || !character.gender || !character.age}
              className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-semibold text-white mb-4">능력치 설정</h3>
          <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">남은 포인트</span>
              <span className={`text-lg font-bold ${
                totalStats > 100 ? 'text-red-400' : 'text-purple-400'
              }`}>
                {Math.max(0, 100 - totalStats)}
              </span>
            </div>
            <div className="w-full bg-gray-800/50 rounded-full h-2">
              <div
                className={`h-full rounded-full transition-all ${
                  totalStats > 100 ? 'bg-red-400' : 'bg-purple-400'
                }`}
                style={{ width: `${Math.min(100, totalStats)}%` }}
              />
            </div>
          </div>

          {isOverLimit && (
            <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
              ⚠️ 능력치 총합이 100을 초과했습니다!
            </div>
          )}

          <div className="space-y-6">
            {Object.entries(STAT_CONFIGS).map(([statKey, config]) => (
              <div key={statKey} className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-300 flex items-center gap-2">
                    <config.icon className={`text-${config.color}-400`} size={16} />
                    {config.label}
                    <span className="text-xs text-gray-500">({config.description})</span>
                  </label>
                  <span className="text-sm text-white">
                    {character.stats[statKey as keyof typeof character.stats]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatChange(statKey as keyof typeof character.stats, Math.max(0, character.stats[statKey as keyof typeof character.stats] - 5))}
                    className="w-8 h-8 bg-gray-800/50 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-center"
                    disabled={character.stats[statKey as keyof typeof character.stats] <= 0}
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={character.stats[statKey as keyof typeof character.stats]}
                    onChange={(e) => handleStatChange(statKey as keyof typeof character.stats, parseInt(e.target.value))}
                    className={`flex-1 accent-${config.color}-400`}
                  />
                  <button
                    onClick={() => handleStatChange(statKey as keyof typeof character.stats, Math.min(100, character.stats[statKey as keyof typeof character.stats] + 5))}
                    className="w-8 h-8 bg-gray-800/50 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-center"
                    disabled={totalStats >= 100}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-700/50 text-white px-6 py-2 rounded-lg font-medium border border-purple-500/20"
            >
              이전
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-amber-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
              disabled={isOverLimit || totalStats > 100}
            >
              다음
            </button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-semibold text-white mb-4">캐릭 확인</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">외모 설명</label>
              <textarea
                value={character.appearance || ''}
                onChange={(e) => onUpdate({
                  ...character,
                  appearance: e.target.value
                })}
                placeholder="캐릭터의 외모를 간단히 설명해주세요..."
                className="w-full h-24 bg-gray-700/50 text-white px-3 py-2 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                maxLength={200}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  키, 체형, 헤어스타일, 특징적인 외모 등을 자유롭게 작성해주세요
                </p>
                <span className="text-xs text-gray-500">
                  {character.appearance?.length || 0}/200
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">성격 태그</label>
              <HashtagInput
                tags={character.personality ? character.personality.split(',') : []}
                onChange={(tags) => onUpdate({ 
                  ...character, 
                  personality: tags.join(',')
                })}
                maxTags={5}
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">배경 서사</label>
              <div className="relative">
                <textarea
                  value={character.background || ''}
                  onChange={(e) => onUpdate({
                    ...character,
                    background: e.target.value
                  })}
                  placeholder="캐릭터의 배경 이야기를 입력해주세요..."
                  className="w-full h-32 bg-gray-700/50 text-white px-3 py-2 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  maxLength={500}
                />
                <div className="absolute right-3 bottom-2 text-xs text-gray-500">
                  {character.background?.length || 0}/500
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                캐릭터의 과거, 가족관계, 특별한 사건 등을 자유롭게 작성해주세요
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-700/50 text-white px-6 py-2 rounded-lg font-medium border border-purple-500/20"
              >
                이전
              </button>
              <button
                onClick={handleComplete}
                disabled={!character.background?.trim() || !character.appearance?.trim() || isCreating}
                className="flex-1 bg-gradient-to-r from-purple-600 to-amber-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? '생성 중...' : '완료'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={createCharacter}
        title="캐릭터 생성"
        description="캐릭터를 생성하시겠습니까?"
        confirmText={isCreating ? "생성 중..." : "생성하기"}
        cancelText="취소"
      />

      {showSuccess && (
        <SuccessAnimation
          characterName={character.name}
          onComplete={handleSuccessComplete}
        />
      )}
    </div>
  );
}
