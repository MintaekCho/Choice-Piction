'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';

export function OAuthButtons() {
  return (
    <div className="space-y-3">
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 px-4 py-2.5 rounded-lg font-medium border hover:bg-gray-50 transition-colors"
      >
        <FcGoogle size={20} />
        <span>Google로 계속하기</span>
      </button>
      <button
        onClick={() => signIn('kakao', { callbackUrl: '/' })}
        className="w-full flex items-center justify-center gap-2 bg-[#FEE500] text-[#391B1B] px-4 py-2.5 rounded-lg font-medium hover:bg-[#FDD800] transition-colors"
      >
        <RiKakaoTalkFill size={20} />
        <span>Kakao로 계속하기</span>
      </button>
    </div>
  );
} 