import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChevronRight } from 'lucide-react';
import type { DashboardProps } from '../types';
import { HeroSection } from './dashboard/HeroSection';
import { StatsSection } from './dashboard/StatsSection';
import { ActionsSection } from './dashboard/ActionsSection';

export function Dashboard({ onNavigate }: DashboardProps) {
  const quickStats = [
    { label: '전체 질문', value: '1,247', icon: '♖', piece: 'Rook', color: 'from-slate-500 to-slate-700', delay: '0s' },
    { label: '승리한 게임', value: '23', icon: '♘', piece: 'Knight', color: 'from-blue-500 to-blue-700', delay: '0.1s' },
    { label: '승률', value: '67%', icon: '♗', piece: 'Bishop', color: 'from-purple-500 to-purple-700', delay: '0.2s' },
    { label: 'ELO 레이팅', value: '2,187', icon: '♕', piece: 'Queen', color: 'from-emerald-500 to-emerald-700', delay: '0.3s' },
  ];

  const quickActions = [
    {
      title: '체스 듀얼',
      description: '실시간 면접 대결로 실력을 겨루세요',
      piece: '♞',
      pieceName: 'Knight',
      color: 'from-red-500 to-red-700',
      action: () => onNavigate('battle'),
      highlight: true,
      position: 'a1'
    },
    {
      title: '지식 탐색',
      description: '전략적으로 질문을 분석하고 학습하세요',
      piece: '♗',
      pieceName: 'Bishop',
      color: 'from-blue-500 to-blue-700',
      action: () => onNavigate('search'),
      position: 'b8'
    },
    {
      title: '단독 훈련',
      description: '집중적인 개인 연습으로 실력을 향상시키세요',
      piece: '♖',
      pieceName: 'Rook',
      color: 'from-emerald-500 to-emerald-700',
      action: () => onNavigate('mock'),
      position: 'h1'
    },
    {
      title: '명예의 전당',
      description: '최고 수준의 마스터들과 견주어보세요',
      piece: '♕',
      pieceName: 'Queen',
      color: 'from-amber-500 to-amber-700',
      action: () => onNavigate('rankings'),
      position: 'd8'
    }
  ];

  const recentActivities = [
    { type: '배틀 승리', opponent: '세진님', time: '2시간 전', score: '+15 점' },
    { type: '답변 등록', question: 'React Hook에 대해 설명해주세요', time: '1일 전', likes: '3 좋아요' },
    { type: '질문 추가', question: 'TypeScript의 장점은?', time: '2일 전', status: '승인됨' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <HeroSection onNavigate={onNavigate} />
      <StatsSection stats={quickStats} />
      <ActionsSection actions={quickActions} />

      {/* Recent Activities & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game History */}
        <Card className="bg-white border border-slate-200 shadow-lg hover:border-blue-300 transition-all duration-500 animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <span className="text-blue-500 animate-chess-hover">♚</span>
              <span>최근 경기</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              최근 체스 듀얼과 훈련 기록입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 cursor-pointer interactive-scale group animate-slide-in-right"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-chess-hover shadow-sm">
                    <span className="text-white text-sm">
                      {activity.type === '배틀 승리' ? '♞' : activity.type === '답변 등록' ? '♗' : '♖'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{activity.type}</span>
                      <span className="text-xs text-blue-500 group-hover:text-blue-600 transition-colors">{activity.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                      {'opponent' in activity && `vs ${activity.opponent}`}
                      {'question' in activity && activity.question}
                    </p>
                    <p className="text-xs text-blue-500 mt-1 group-hover:text-blue-600 transition-colors">
                      {'score' in activity && activity.score}
                      {'likes' in activity && activity.likes}
                      {'status' in activity && activity.status}
                    </p>
                  </div>
                  
                  {/* Activity type indicator */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mastery Progress */}
        <Card className="bg-white border border-slate-200 shadow-lg hover:border-blue-300 transition-all duration-500 animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <span className="text-blue-500 animate-chess-hover">♕</span>
              <span>마스터리 진행도</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              체스 마스터로 가는 여정입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="group cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 group-hover:text-slate-700 transition-colors">일일 훈련 (5수)</span>
                <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">3/5</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/5 transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-blue-500/30" />
              </div>
            </div>
            
            <div className="group cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 group-hover:text-slate-700 transition-colors">주간 도전 (30수)</span>
                <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">18/30</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/5 transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-blue-500/30" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 group cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">연속 플레이</p>
                  <p className="text-sm text-blue-500 group-hover:text-blue-600 transition-colors animate-pulse">7일째 연속 승부 중!</p>
                </div>
                <div className="text-2xl animate-chess-hover interactive-glow group-hover:scale-125 transition-transform duration-300">♔</div>
              </div>
            </div>

            {/* Achievement badges */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">최근 달성 업적</p>
              <div className="flex space-x-2">
                <div className="px-3 py-1 bg-blue-100 border border-blue-200 rounded-full text-xs text-blue-700 animate-scale-in cursor-pointer hover:bg-blue-200 transition-colors">
                  🏆 연승 달성
                </div>
                <div className="px-3 py-1 bg-purple-100 border border-purple-200 rounded-full text-xs text-purple-700 animate-scale-in cursor-pointer hover:bg-purple-200 transition-colors" style={{animationDelay: '0.2s'}}>
                  ⚡ 빠른 승부
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}