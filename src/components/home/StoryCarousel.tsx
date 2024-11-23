'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Story {
  title: string;
  author: string;
  thumbnail: string;
  tags: string[];
}

export function StoryCarousel({ stories }: { stories: Story[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      
      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative px-4 py-6">
      <h3 className="text-lg font-semibold text-white mb-4">트렌딩 스토리</h3>
      
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/50 p-2 rounded-full
                     opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="text-white" />
        </button>

        <div 
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4"
        >
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              className="min-w-[280px] bg-gray-800/50 rounded-lg overflow-hidden snap-start"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative h-40">
                <Image
                  src={story.thumbnail}
                  alt={story.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="text-white font-semibold">{story.title}</h4>
                <p className="text-gray-400 text-sm">{story.author}</p>
                <div className="flex gap-2 mt-2">
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
            </motion.div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/50 p-2 rounded-full
                     opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>
    </section>
  );
} 