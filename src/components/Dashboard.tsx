import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChevronRight, Building2, Loader2 } from 'lucide-react';
import type { DashboardProps } from '../types';
import { HeroSection } from './dashboard/HeroSection';
import { StatsSection } from './dashboard/StatsSection';
import { ActionsSection } from './dashboard/ActionsSection';
import { APP_TEXTS } from '../constants/texts';
import { apiClient, Company } from '../lib/api';

export function Dashboard({ onNavigate }: DashboardProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  // 회사 목록 가져오기
  const fetchCompanies = async () => {
    try {
      setIsLoadingCompanies(true);
      const companiesData = await apiClient.getCompanies();
      setCompanies(companiesData.slice(0, 6)); // 최대 6개만 표시
    } catch (error) {
      console.error('회사 목록 로드 실패:', error);
      // API 실패 시 빈 배열로 설정
      setCompanies([]);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const quickStats: Array<{ label: string; value: string; icon: string; color: string; delay: string }> = []; // 가짜 통계 데이터 제거됨 - API에서 실제 통계를 가져와야 함

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const quickActions = [
    {
      title: APP_TEXTS.dashboard.actions.chessDuel.title,
      description: APP_TEXTS.dashboard.actions.chessDuel.description,
      piece: '♞',
      color: 'from-red-500 to-red-700',
      action: () => onNavigate('battle'),
      href: '/battle',
      position: 'a1'
    },
    {
      title: APP_TEXTS.dashboard.actions.knowledgeExploration.title,
      description: APP_TEXTS.dashboard.actions.knowledgeExploration.description,
      piece: '♗',
      color: 'from-blue-500 to-blue-700',
      action: () => onNavigate('search'),
      href: '/search',
      position: 'b8'
    },
    {
      title: APP_TEXTS.dashboard.actions.soloTraining.title,
      description: APP_TEXTS.dashboard.actions.soloTraining.description,
      piece: '♖',
      color: 'from-emerald-500 to-emerald-700',
      action: () => onNavigate('mock'),
      href: '/mock',
      position: 'h1'
    },
    {
      title: APP_TEXTS.dashboard.actions.hallOfFame.title,
      description: APP_TEXTS.dashboard.actions.hallOfFame.description,
      piece: '♕',
      color: 'from-amber-500 to-amber-700',
      action: () => onNavigate('rankings'),
      href: '/rankings',
      position: 'd8'
    }
  ];

  const recentActivities: Array<{ type: string; opponent?: string; time: string; score?: string; question?: string; likes?: string; status?: string }> = []; // 가짜 최근 경기 데이터 제거됨 - API에서 실제 활동을 가져와야 함

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <HeroSection />
      <StatsSection stats={quickStats} />
      <ActionsSection onNavigate={onNavigate} />

      {/* Recent Activities & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game History */}
        <Card className="bg-white border border-slate-200 shadow-lg hover:border-blue-300 transition-all duration-500 animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <span className="text-blue-500 animate-chess-hover">♚</span>
              <span>{APP_TEXTS.dashboard.recentGames.title}</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              {APP_TEXTS.dashboard.recentGames.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-slate-500 mb-4">아직 활동 기록이 없습니다.</div>
                <div className="text-sm text-slate-400">첫 번째 면접 배틀을 시작해보세요!</div>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        {/* Mastery Progress */}
        <Card className="bg-white border border-slate-200 shadow-lg hover:border-blue-300 transition-all duration-500 animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <span className="text-blue-500 animate-chess-hover">♕</span>
              <span>{APP_TEXTS.dashboard.masteryProgress.title}</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              {APP_TEXTS.dashboard.masteryProgress.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-slate-500 mb-4">아직 진행도 데이터가 없습니다.</div>
              <div className="text-sm text-slate-400">면접 배틀을 통해 진행도를 쌓아보세요!</div>
            </div>
          </CardContent>
        </Card>

        {/* Company List */}
        <Card className="bg-white border border-slate-200 shadow-lg hover:border-blue-300 transition-all duration-500 animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <Building2 className="w-5 h-5 text-blue-500" />
              <span>주요 회사</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              면접 질문이 있는 주요 회사들입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCompanies ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-slate-600">회사 목록을 불러오는 중...</span>
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-slate-500 mb-2">아직 회사 데이터가 없습니다.</div>
                <div className="text-sm text-slate-400">곧 다양한 회사의 면접 질문을 만나보세요!</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {companies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                    onClick={() => onNavigate('search')}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform">
                      {company.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </p>
                      <p className="text-xs text-slate-500">면접 질문</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}