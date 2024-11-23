import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소'
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="w-[calc(100%-6rem)] max-w-md fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className=" bg-gray-900 rounded-lg shadow-lg border border-purple-500/20"
            >
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
                  <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-lg">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                {description && (
                  <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">{description}</p>
                )}
                <div className="flex justify-end gap-2 sm:gap-3">
                  <button
                    onClick={onClose}
                    className="px-3 sm:px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-3 sm:px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
} 