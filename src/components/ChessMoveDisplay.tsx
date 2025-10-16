"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Crown, Trophy, Target, Zap } from 'lucide-react';

interface ScoreData {
  logic_score: number;
  time_score: number;
  accuracy_score: number;
  model_similarity_score: number;
  total_score: number;
  response_time: number;
}

interface ChessMoveDisplayProps {
  move: string;
  fen: string;
  scores: ScoreData;
  isAnimating?: boolean;
}

export function ChessMoveDisplay({ move, fen, scores, isAnimating = false }: ChessMoveDisplayProps) {
  const [displayedScores, setDisplayedScores] = useState<ScoreData>({
    logic_score: 0,
    time_score: 0,
    accuracy_score: 0,
    model_similarity_score: 0,
    total_score: 0,
    response_time: 0
  });

  useEffect(() => {
    // 점수 애니메이션 효과
    const duration = 1000; // 1초
    const steps = 30;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setDisplayedScores({
        logic_score: Math.round(scores.logic_score * progress * 10) / 10,
        time_score: Math.round(scores.time_score * progress * 10) / 10,
        accuracy_score: Math.round(scores.accuracy_score * progress * 10) / 10,
        model_similarity_score: Math.round(scores.model_similarity_score * progress * 10) / 10,
        total_score: Math.round(scores.total_score * progress * 10) / 10,
        response_time: Math.round(scores.response_time * progress * 10) / 10
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayedScores(scores);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [scores]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 4) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Crown className="w-4 h-4" />;
    if (score >= 6) return <Trophy className="w-4 h-4" />;
    if (score >= 4) return <Target className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  const formatMove = (moveString: string) => {
    // 체스 수를 더 읽기 쉽게 포맷팅
    if (moveString.length >= 4) {
      const from = moveString.substring(0, 2);
      const to = moveString.substring(2, 4);
      return `${from} → ${to}`;
    }
    return moveString;
  };

  return (
    <Card className={`w-full bg-white shadow-lg border-0 transition-all duration-500 ${isAnimating ? 'animate-pulse' : ''}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* 체스 수 정보 */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-100 rounded-lg px-4 py-2">
              <span className="text-2xl">♟️</span>
              <span className="text-lg font-bold text-slate-800">
                {formatMove(move)}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              답변 점수에 따른 체스 수
            </p>
          </div>

          {/* 점수 표시 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 논리 점수 */}
            <div className={`p-4 rounded-lg border ${getScoreColor(displayedScores.logic_score)}`}>
              <div className="flex items-center space-x-2 mb-2">
                {getScoreIcon(displayedScores.logic_score)}
                <span className="text-sm font-medium">논리성</span>
              </div>
              <div className="text-2xl font-bold">
                {displayedScores.logic_score.toFixed(1)}
              </div>
              <div className="text-xs opacity-75">/ 10점</div>
            </div>

            {/* 시간 점수 */}
            <div className={`p-4 rounded-lg border ${getScoreColor(displayedScores.time_score)}`}>
              <div className="flex items-center space-x-2 mb-2">
                {getScoreIcon(displayedScores.time_score)}
                <span className="text-sm font-medium">응답속도</span>
              </div>
              <div className="text-2xl font-bold">
                {displayedScores.time_score.toFixed(1)}
              </div>
              <div className="text-xs opacity-75">/ 10점</div>
            </div>

            {/* 정확도 점수 */}
            <div className={`p-4 rounded-lg border ${getScoreColor(displayedScores.accuracy_score)}`}>
              <div className="flex items-center space-x-2 mb-2">
                {getScoreIcon(displayedScores.accuracy_score)}
                <span className="text-sm font-medium">정확도</span>
              </div>
              <div className="text-2xl font-bold">
                {displayedScores.accuracy_score.toFixed(1)}
              </div>
              <div className="text-xs opacity-75">/ 10점</div>
            </div>

            {/* 유사도 점수 */}
            <div className={`p-4 rounded-lg border ${getScoreColor(displayedScores.model_similarity_score)}`}>
              <div className="flex items-center space-x-2 mb-2">
                {getScoreIcon(displayedScores.model_similarity_score)}
                <span className="text-sm font-medium">모델 유사도</span>
              </div>
              <div className="text-2xl font-bold">
                {displayedScores.model_similarity_score.toFixed(1)}
              </div>
              <div className="text-xs opacity-75">/ 10점</div>
            </div>
          </div>

          {/* 총점 및 응답 시간 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Crown className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold text-blue-800">총점</span>
                </div>
                <div className="text-3xl font-bold text-blue-900">
                  {displayedScores.total_score.toFixed(1)}
                </div>
                <div className="text-sm text-blue-600">/ 10점</div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg font-semibold text-slate-700">응답 시간</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {displayedScores.response_time.toFixed(1)}초
                </div>
                <div className="text-sm text-slate-600">
                  {displayedScores.response_time < 30 ? '빠름' : 
                   displayedScores.response_time < 60 ? '보통' : '느림'}
                </div>
              </div>
            </div>
          </div>

          {/* FEN 정보 (개발용) */}
          <details className="text-xs text-slate-500">
            <summary className="cursor-pointer hover:text-slate-700">
              체스판 상태 (FEN)
            </summary>
            <div className="mt-2 p-2 bg-slate-100 rounded font-mono text-xs break-all">
              {fen}
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
