'use client';

import { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';

interface CharacterImageUploadProps {
  currentImage?: string | null;
  onImageChange: (imageUrl: string) => void;
}

export function CharacterImageUpload({ currentImage, onImageChange }: CharacterImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    setIsUploading(true);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);

      // 이미지 업로드 API 호출
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const data = await response.json();
      setPreviewUrl(data.url);
      onImageChange(data.url);
    } catch (error) {
      console.error('이미지 업로드 에러:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setPreviewUrl(null);
    onImageChange('');
    setShowDeleteModal(false);
  };

  return (
    <div className="relative">
      {previewUrl ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden group">
          <Image
            src={previewUrl}
            alt="Character profile"
            fill
            className="object-cover"
          />
          {/* 호버 시 나타나는 삭제 오버레이 */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <Trash2 className="text-red-400" size={24} />
            <span className="text-xs text-gray-200">이미지 삭제</span>
          </div>
          {/* 클릭 영역 */}
          <button
            onClick={handleRemoveImage}
            className="absolute inset-0"
            aria-label="이미지 삭제"
          />
        </div>
      ) : (
        <label className="block w-32 h-32 border-2 border-dashed border-purple-500/50 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <div className="h-full flex flex-col items-center justify-center text-purple-500">
            <Upload size={24} />
            <span className="text-sm mt-2">
              {isUploading ? '업로드 중...' : '이미지 업로드'}
            </span>
          </div>
        </label>
      )}

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="이미지 삭제"
        description="프로필 이미지를 삭제하시겠습니까?"
      />
    </div>
  );
} 