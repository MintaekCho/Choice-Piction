'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CreateStoryButton() {
  const router = useRouter();

  return (
    <button 
      className="fixed right-4 bottom-20 bg-gradient-to-r from-purple-600 to-amber-500 text-white p-3 rounded-full shadow-lg"
      onClick={() => router.push('/story/create')}
    >
      <Plus size={24} />
    </button>
  );
} 