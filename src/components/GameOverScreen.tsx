"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Crown, Trophy, Target, RotateCcw, Home, BarChart3 } from 'lucide-react';

interface GameResult {
  result: 'checkmate' | 'stalemate' | 'draw';
  final_fen: string;
  scores: {
    logic_score: number;
    time_score: number;
    accuracy_score: number;
    model_similarity_score: number;
    total_score: number;
    response_time: number;
  };
}

interface GameOverScreenProps {
  result: GameResult;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onViewStats: () => void;
}

export function GameOverScreen({ result, onPlayAgain, onGoHome, onViewStats }: GameOverScreenProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // 결과 애니메이션 시작
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const getResultInfo = () => {
    switch (result.result) {
      case 'checkmate':
        return {
          title: '체크메이트!',
          subtitle: '게임이 끝났습니다',
          icon: <Crown className="w-16 h-16 text-yellow-500" />,
          color: 'from-yellow-400 to-orange-500',
          bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
          borderColor: 'border-yellow-200'
        };
      case 'stalemate':
        return {
          title: '스테일메이트',
          subtitle: '무승부입니다',
          icon: <Target className="w-16 h-16 text-blue-500" />,
          color: 'from-blue-400 to-indigo-500',
          bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200'
        };
      case 'draw':
        return {
          title: '무승부',
          subtitle: '비겼습니다',
          icon: <Trophy className="w-16 h-16 text-gray-500" />,
          color: 'from-gray-400 to-slate-500',
          bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
          borderColor: 'border-gray-200'
        };
      default:
        return {
          title: '게임 종료',
          subtitle: '게임이 끝났습니다',
          icon: <Trophy className="w-16 h-16 text-blue-500" />,
          color: 'from-blue-400 to-indigo-500',
          bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200'
        };
    }
  };

  const resultInfo = getResultInfo();

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return '우수';
    if (score >= 6) return '양호';
    if (score >= 4) return '보통';
    return '개선 필요';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* 게임 결과 카드 */}
        <Card className={`${resultInfo.bgColor} ${resultInfo.borderColor} border-2 shadow-xl transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 transition-all duration-1000 delay-300">
              {resultInfo.icon}
            </div>
            <CardTitle className={`text-4xl font-bold bg-gradient-to-r ${resultInfo.color} bg-clip-text text-transparent transition-all duration-1000 delay-500`}>
              {resultInfo.title}
            </CardTitle>
            <p className="text-slate-600 text-lg mt-2 transition-all duration-1000 delay-700">
              {resultInfo.subtitle}
            </p>
          </CardHeader>
        </Card>

        {/* 점수 요약 */}
        <Card className="bg-white shadow-lg border-0 transition-all duration-1000 delay-1000">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <span>최종 점수</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">논리성</div>
                <div className={`text-2xl font-bold ${getScoreColor(result.scores.logic_score)}`}>
                  {result.scores.logic_score.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">{getScoreLabel(result.scores.logic_score)}</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">응답속도</div>
                <div className={`text-2xl font-bold ${getScoreColor(result.scores.time_score)}`}>
                  {result.scores.time_score.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">{getScoreLabel(result.scores.time_score)}</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">정확도</div>
                <div className={`text-2xl font-bold ${getScoreColor(result.scores.accuracy_score)}`}>
                  {result.scores.accuracy_score.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">{getScoreLabel(result.scores.accuracy_score)}</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">모델 유사도</div>
                <div className={`text-2xl font-bold ${getScoreColor(result.scores.model_similarity_score)}`}>
                  {result.scores.model_similarity_score.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">{getScoreLabel(result.scores.model_similarity_score)}</div>
              </div>
            </div>

            {/* 총점 */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-center">
              <div className="text-white text-sm mb-2">총점</div>
              <div className="text-white text-4xl font-bold mb-2">
                {result.scores.total_score.toFixed(1)}점
              </div>
              <div className="text-blue-100 text-sm">
                응답 시간: {result.scores.response_time.toFixed(1)}초
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onPlayAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>다시 플레이</span>
          </Button>
          
          <Button
            onClick={onViewStats}
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg flex items-center space-x-2"
          >
            <BarChart3 className="w-5 h-5" />
            <span>통계 보기</span>
          </Button>
          
          <Button
            onClick={onGoHome}
            variant="outline"
            className="border-slate-300 text-slate-600 hover:bg-slate-50 px-8 py-3 text-lg flex items-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>홈으로</span>
          </Button>
        </div>

        {/* 게임 정보 */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">🎮 게임 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">게임 결과:</span>
                <span className="ml-2 font-medium text-slate-800">
                  {result.result === 'checkmate' ? '체크메이트' : 
                   result.result === 'stalemate' ? '스테일메이트' : '무승부'}
                </span>
              </div>
              <div>
                <span className="text-slate-600">총 응답 시간:</span>
                <span className="ml-2 font-medium text-slate-800">
                  {result.scores.response_time.toFixed(1)}초
                </span>
              </div>
              <div>
                <span className="text-slate-600">평균 점수:</span>
                <span className="ml-2 font-medium text-slate-800">
                  {result.scores.total_score.toFixed(1)}점
                </span>
              </div>
              <div>
                <span className="text-slate-600">성능 등급:</span>
                <span className={`ml-2 font-medium ${getScoreColor(result.scores.total_score)}`}>
                  {getScoreLabel(result.scores.total_score)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
