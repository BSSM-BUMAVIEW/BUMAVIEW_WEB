'use client';

import React, { useState } from 'react';
import { X, Send, Loader2, Building2, Tag, Calendar, FileText } from 'lucide-react';
import { apiClient } from '../lib/api';
import { APP_TEXTS } from '../constants/texts';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionSubmitted: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onQuestionSubmitted
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    content: '',
    category: '',
    questionAt: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['front', 'back', 'ai', 'devops', 'mobile', 'design', 'data', 'security'];

  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.companyName.trim()) {
      setError('회사명을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      setError('질문 내용을 입력해주세요.');
      return;
    }
    if (!formData.category) {
      setError('카테고리를 선택해주세요.');
      return;
    }
    if (!formData.questionAt) {
      setError('면접 날짜를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.createQuestion({
        companyName: formData.companyName.trim(),
        content: formData.content.trim(),
        category: formData.category,
        questionAt: formData.questionAt
      });

      // 성공 시 상태 초기화
      setFormData({
        companyName: '',
        content: '',
        category: '',
        questionAt: ''
      });
      onQuestionSubmitted();
      onClose();
      
      // 성공 메시지
      alert('질문이 성공적으로 등록되었습니다! 🎉');
      
    } catch (error) {
      console.error('질문 등록 실패:', error);
      setError(error instanceof Error ? error.message : '질문 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-500" />
            {APP_TEXTS.questionSearch.questionModal.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 폼 내용 */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* 회사명 */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              {APP_TEXTS.questionSearch.questionModal.companyLabel}
            </label>
            <input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder={APP_TEXTS.questionSearch.questionModal.companyPlaceholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              {APP_TEXTS.questionSearch.questionModal.categoryLabel}
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isSubmitting}
            >
              <option value="">카테고리를 선택해주세요</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 면접 날짜 */}
          <div>
            <label htmlFor="questionAt" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              {APP_TEXTS.questionSearch.questionModal.dateLabel}
            </label>
            <input
              id="questionAt"
              type="date"
              value={formData.questionAt}
              onChange={(e) => handleInputChange('questionAt', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* 질문 내용 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              {APP_TEXTS.questionSearch.questionModal.contentLabel}
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder={APP_TEXTS.questionSearch.questionModal.contentPlaceholder}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                {APP_TEXTS.questionSearch.questionModal.contentHint}
              </p>
              <span className="text-sm text-gray-500">{formData.content.length}자</span>
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
            disabled={isSubmitting || !formData.companyName.trim() || !formData.content.trim() || !formData.category || !formData.questionAt}
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
                <span>{APP_TEXTS.questionSearch.questionModal.submitButton}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
