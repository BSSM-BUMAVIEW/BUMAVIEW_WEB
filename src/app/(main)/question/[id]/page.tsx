'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient, type Question } from '../../../../lib/api';
import { AnswersList } from '../../../../components/AnswersList';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id as string;
  const id = Number(idParam);

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setLoading(true);
        const q = await apiClient.getQuestionById(id);
        setQuestion(q);
      } catch (err) {
        console.error('질문 조회 실패:', err);
        setError('질문을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-600">질문을 불러오는 중...</div>;
  }

  if (error || !question) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <button onClick={() => router.back()} className="text-blue-600 mb-4">← 뒤로</button>
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-600">
          {error ?? '질문을 찾을 수 없습니다.'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">질문 상세</h1>
          <div className="text-gray-700">
            <p className="mb-1"><span className="font-medium">회사:</span> {question.companyName ?? ''}</p>
            <p className="mb-1"><span className="font-medium">카테고리:</span> {question.category}</p>
            <p className="mb-3"><span className="font-medium">연도:</span> {question.questionAt}</p>
            <p className="leading-relaxed whitespace-pre-wrap">{question.content}</p>
          </div>
        </div>

        {/* 답변 목록 (404면 내부에서 빈상태 처리됨) */}
        <AnswersList
          questionId={question.id}
          questionContent={question.content}
          onBack={() => router.back()}
        />
      </div>
    </div>
  );
}


