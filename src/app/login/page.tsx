'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { ChoiceFictionLogo } from '@/components/brand/ChoiceFictionLogo';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '로그인에 실패했습니다.');
      }

      const { user, token } = await response.json();
      login(user, token);

      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <ChoiceFictionLogo />
      </div>

      <LoginForm onSubmit={handleLogin} />

      <div className="mt-8 w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">또는</span>
          </div>
        </div>

        <div className="mt-6">
          <OAuthButtons />
        </div>
      </div>
    </div>
  );
}
