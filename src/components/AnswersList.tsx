'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageSquare, User, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { apiClient, type Answer } from '../lib/api';
import { APP_TEXTS } from '../constants/texts';

interface AnswersListProps {
  questionId: number;
  questionContent: string;
  onBack: () => void;
}

export const AnswersList: React.FC<AnswersListProps> = ({
  questionId,
  questionContent,
  onBack
}) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnswers();
  }, [questionId]);

  const fetchAnswers = async () => {
    setLoading(true);
    setError(null);

    try {
      const answersData = await apiClient.getAnswersByQuestion(questionId);
      setAnswers(answersData);
    } catch (error: any) {
      console.error('답변 조회 실패:', error);
      // 404면 답변 없음으로 처리 (에러가 아닌 빈 상태)
      const isAxios = (error && error.response && error.response.status) || (error?.status);
      const status = error?.response?.status ?? error?.status;
      if (status === 404) {
        setAnswers([]);
        setError(null);
      } else {
        setAnswers([]);
        setError('답변을 불러오는데 실패했습니다. API 서버를 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-gray-600">답변을 불러오는 중...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchAnswers}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로 가기</span>
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {APP_TEXTS.questionSearch.answersList.title}
            </h1>
            <div className="text-gray-600 mb-4">
              <p className="text-lg font-medium mb-2">질문:</p>
              <p className="leading-relaxed">{questionContent}</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>{answers.length}개의 답변</span>
              </div>
            </div>
          </div>
        </div>

        {/* 답변 목록 */}
        {answers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {APP_TEXTS.questionSearch.answersList.emptyTitle}
            </h3>
            <p className="text-gray-600">
              {APP_TEXTS.questionSearch.answersList.emptyMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {answers.map((answer) => (
              <div key={answer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* 답변 내용 */}
                  <div className="mb-4">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {answer.content}
                    </p>
                  </div>

                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <User className="w-4 h-4" />
                        <span className="text-sm">익명</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(answer.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{answer.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
