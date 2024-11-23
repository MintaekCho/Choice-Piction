'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChoiceFictionLogo } from '@/components/brand/ChoiceFictionLogo';

export default function RegisterUsernamePage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '필명 등록에 실패했습니다.');
      }

      // 세션 업데이트
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          username,
        },
      });

      // 홈으로 리다이렉트
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <ChoiceFictionLogo />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">필명 등록</h2>
          <p className="mt-2 text-gray-400">
            Choice Fiction에서 사용할 필명을 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              필명
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="2-20자 이내"
              minLength={2}
              maxLength={20}
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg disabled:opacity-50"
          >
            {isLoading ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
} 