'use client';
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="px-4 py-8">
      <div className="bg-gradient-to-r from-purple-900/50 to-amber-900/50 p-6 rounded-xl border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-3">
          나만의 이야기를 선택하세요
        </h2>
        <p className="text-purple-200 text-sm mb-4">
          AI와 함께 만드는 당신만의 이야기
        </p>
        <button onClick={() => router.push('/create')} className="bg-gradient-to-r from-purple-600 to-amber-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg">
          시작하기
        </button>
      </div>
    </section>
  );
} 