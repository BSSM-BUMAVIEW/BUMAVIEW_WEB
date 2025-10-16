"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Clock, Send, Loader2 } from 'lucide-react';

interface Question {
  id: number;
  content: string;
  category: string;
}

interface InterviewQuestionProps {
  question: Question;
  onSubmitAnswer: (questionId: number, answer: string, responseTime: number) => void;
  isSubmitting: boolean;
  timeLimit?: number; // 초 단위
  isMyTurn: boolean;
  currentPlayerName?: string;
}

export function InterviewQuestion({ 
  question, 
  onSubmitAnswer, 
  isSubmitting, 
  timeLimit = 300, // 기본 5분
  isMyTurn,
  currentPlayerName = "상대방"
}: InterviewQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setStartTime(Date.now());
    setTimeLeft(timeLimit);
    setIsTimerRunning(true);
    setAnswer('');

    // 타이머 시작
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          // 시간 초과 시 자동 제출
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [question.id, timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 30) return 'text-red-500';
    if (timeLeft <= 60) return 'text-orange-500';
    return 'text-blue-500';
  };

  const handleSubmit = () => {
    if (isSubmitting || answer.trim().length === 0) return;

    const responseTime = (Date.now() - startTime) / 1000; // 초 단위
    onSubmitAnswer(question.id, answer.trim(), responseTime);
    
    // 타이머 정지
    setIsTimerRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isAnswerValid = answer.trim().length >= 10; // 최소 10자 이상

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <span>📝</span>
            <span>면접 질문</span>
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            {/* 턴 표시 */}
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isMyTurn 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-orange-100 text-orange-800 border border-orange-200'
            }`}>
              {isMyTurn ? '내 차례' : `${currentPlayerName} 차례`}
            </div>
            
            {/* 타이머 */}
            <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
        
        {/* 카테고리 태그 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-500">카테고리:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {question.category}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 질문 내용 */}
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            질문 #{question.id}
          </h3>
          <p className="text-slate-700 leading-relaxed text-base">
            {question.content}
          </p>
        </div>

        {/* 답변 입력 영역 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              답변 작성
            </label>
            <span className={`text-xs ${isAnswerValid ? 'text-green-600' : 'text-slate-400'}`}>
              {answer.length}자 (최소 10자 이상)
            </span>
          </div>
          
          <Textarea
            value={answer}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="질문에 대한 답변을 작성해주세요..."
            className="min-h-[200px] resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting || !isTimerRunning || !isMyTurn}
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            <p>💡 팁: Ctrl+Enter로 빠른 제출이 가능합니다</p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={!isAnswerValid || isSubmitting || !isTimerRunning || !isMyTurn}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  제출 중...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  답변 제출
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 진행 상황 표시 */}
        {!isTimerRunning && timeLeft === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              ⏰ 시간이 초과되어 답변이 자동으로 제출됩니다.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
