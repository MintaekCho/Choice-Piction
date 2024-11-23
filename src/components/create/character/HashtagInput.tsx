'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface HashtagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export function HashtagInput({ tags, onChange, maxTags = 5 }: HashtagInputProps) {
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing && input.trim()) {
      e.preventDefault();
      if (tags.length >= maxTags) {
        alert(`최대 ${maxTags}개까지만 입력할 수 있습니다.`);
        return;
      }
      const newTag = input.trim().replace(/^#/, '');
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input) {
      e.preventDefault();
      const newTags = [...tags];
      newTags.pop();
      onChange(newTags);
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
          >
            #{tag}
            <button
              onClick={() => removeTag(index)}
              className="hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={tags.length >= maxTags ? "최대 개수에 도달했습니다" : "#해시태그 입력"}
          className="w-full bg-gray-700/50 text-white px-3 py-2 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          disabled={tags.length >= maxTags}
        />
        <div className="absolute right-3 top-2 text-xs text-gray-500">
          {tags.length}/{maxTags}
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Enter를 눌러 해시태그를 추가하세요
      </p>
    </div>
  );
} 