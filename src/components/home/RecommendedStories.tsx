'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, Eye } from 'lucide-react';
import Image from 'next/image';

// 임시 데이터 - 실제로는 API에서 받아올 예정
const recommendedStories = [
  {
    id: '1',
    title: '마법사의 귀환',
    author: '별빛작가',
    thumbnail: '/images/stories/magic-return.jpg',
    description: '천재 마법사의 귀환 그리고 새로운 모험',
    likes: 1200,
    views: 5000,
    tags: ['판타지', '액션', '성장'],
    matchRate: 98
  },
  // ... 더 많은 추천 스토리
];

export function RecommendedStories() {
  return (
    <section className="px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold text-white">맞춤 추천</h3>
        <Sparkles className="text-amber-400" size={18} />
      </div>

      <div className="space-y-4">
        {recommendedStories.map((story) => (
          <motion.div
            key={story.id}
            className="bg-gray-800/30 backdrop-blur rounded-lg overflow-hidden border border-purple-500/20"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex">
              <div className="relative w-24 h-24">
                <Image
                  src={story.thumbnail}
                  alt={story.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-amber-500 text-xs text-white px-2 py-1 rounded-full">
                  {story.matchRate}% 매치
                </div>
              </div>

              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-semibold">{story.title}</h4>
                    <p className="text-gray-400 text-sm">{story.author}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="text-pink-500" />
                      {story.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} className="text-blue-400" />
                      {story.views.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                  {story.description}
                </p>

                <div className="flex gap-2 mt-3">
                  {story.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 