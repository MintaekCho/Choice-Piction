'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onSubmit(email, password);
      router.push('/'); // 로그인 성공 시 홈으로 이동
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            이메일
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800/50 text-white px-4 py-2 pl-10 rounded-lg border border-purple-500/20 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="이메일을 입력하세요"
              required
            />
            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            비밀번호
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800/50 text-white px-4 py-2 pl-10 rounded-lg border border-purple-500/20 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="비밀번호를 입력하세요"
              required
            />
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white py-2 rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>로그인 중...</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>로그인</span>
            </>
          )}
        </button>

        {/* 추가 링크 */}
        <div className="flex items-center justify-between text-sm">
          <Link
            href="/auth/register"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            회원가입
          </Link>
          <Link
            href="/auth/forgot-password"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            비밀번호 찾기
          </Link>
        </div>
      </form>
    </motion.div>
  );
} 