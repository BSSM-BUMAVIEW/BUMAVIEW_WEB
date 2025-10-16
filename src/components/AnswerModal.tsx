'use client';

import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { apiClient } from '../lib/api';
import { APP_TEXTS } from '../constants/texts';

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number;
  questionContent: string;
  onAnswerSubmitted: () => void;
}

export const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
  onClose,
  questionId,
  questionContent,
  onAnswerSubmitted
}) => {
  console.log('📝 AnswerModal 받은 questionId:', questionId, typeof questionId);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError('답변을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('📤 답변 등록 요청:', {
        questionId,
        content: answer.trim()
      });
      
      await apiClient.createAnswer({
        questionId,
        content: answer.trim()
      });

      // 성공 시 상태 초기화
      setAnswer('');
      onAnswerSubmitted();
      onClose();
      
      // 성공 메시지 (선택사항)
      alert('답변이 성공적으로 등록되었습니다! 🎉');
      
    } catch (error) {
      console.error('답변 등록 실패:', error);
      setError(error instanceof Error ? error.message : '답변 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {APP_TEXTS.questionSearch.answerModal.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 질문 내용 */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-600 mb-2">질문</h3>
          <p className="text-gray-900 leading-relaxed">{questionContent}</p>
        </div>

        {/* 답변 입력 */}
        <div className="p-6">
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
            {APP_TEXTS.questionSearch.answerModal.answerLabel}
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={APP_TEXTS.questionSearch.answerModal.placeholder}
            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              {APP_TEXTS.questionSearch.answerModal.shortcut}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{answer.length}자</span>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>등록 중...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{APP_TEXTS.questionSearch.answerModal.submitButton}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
