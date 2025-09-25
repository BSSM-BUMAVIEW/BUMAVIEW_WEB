import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChevronRight } from 'lucide-react';
import type { DashboardProps } from '../types';
import { HeroSection } from './dashboard/HeroSection';
import { StatsSection } from './dashboard/StatsSection';
import { ActionsSection } from './dashboard/ActionsSection';
import { APP_TEXTS } from '../constants/texts';

export function Dashboard({ onNavigate }: DashboardProps) {
  const quickStats = [
    { label: APP_TEXTS.dashboard.stats.totalQuestions, value: '1,247', icon: '♖', piece: 'Rook', color: 'from-slate-500 to-slate-700', delay: '0s' },
    { label: APP_TEXTS.dashboard.stats.gamesWon, value: '23', icon: '♘', piece: 'Knight', color: 'from-blue-500 to-blue-700', delay: '0.1s' },
    { label: APP_TEXTS.dashboard.stats.winRate, value: '67%', icon: '♗', piece: 'Bishop', color: 'from-purple-500 to-purple-700', delay: '0.2s' },
    { label: APP_TEXTS.dashboard.stats.eloRating, value: '2,187', icon: '♕', piece: 'Queen', color: 'from-emerald-500 to-emerald-700', delay: '0.3s' },
  ];

  const quickActions = [
    {
      title: APP_TEXTS.dashboard.actions.chessDuel.title,
      description: APP_TEXTS.dashboard.actions.chessDuel.description,
      piece: '♞',
      pieceName: APP_TEXTS.dashboard.actions.chessDuel.pieceName,
      color: 'from-red-500 to-red-700',
      action: () => onNavigate('battle'),
      href: '/battle',
      position: 'a1'
    },
    {
      title: APP_TEXTS.dashboard.actions.knowledgeExploration.title,
      description: APP_TEXTS.dashboard.actions.knowledgeExploration.description,
      piece: '♗',
      pieceName: APP_TEXTS.dashboard.actions.knowledgeExploration.pieceName,
      color: 'from-blue-500 to-blue-700',
      action: () => onNavigate('search'),
      href: '/search',
      position: 'b8'
    },
    {
      title: APP_TEXTS.dashboard.actions.soloTraining.title,
      description: APP_TEXTS.dashboard.actions.soloTraining.description,
      piece: '♖',
      pieceName: APP_TEXTS.dashboard.actions.soloTraining.pieceName,
      color: 'from-emerald-500 to-emerald-700',
      action: () => onNavigate('mock'),
      href: '/mock',
      position: 'h1'
    },
    {
      title: APP_TEXTS.dashboard.actions.hallOfFame.title,
      description: APP_TEXTS.dashboard.actions.hallOfFame.description,
      piece: '♕',
      pieceName: APP_TEXTS.dashboard.actions.hallOfFame.pieceName,
      color: 'from-amber-500 to-amber-700',
      action: () => onNavigate('rankings'),
      href: '/rankings',
      position: 'd8'
    }
  ];

  const recentActivities = [
    { type: APP_TEXTS.dashboard.recentGames.battleVictory, opponent: APP_TEXTS.sampleData.opponents[3].name, time: `2${APP_TEXTS.dashboard.recentGames.hoursAgo}`, score: '+15 점' },
    { type: APP_TEXTS.dashboard.recentGames.answerRegistration, question: 'React Hook에 대해 설명해주세요', time: `1${APP_TEXTS.dashboard.recentGames.daysAgo}`, likes: `3 ${APP_TEXTS.dashboard.recentGames.likes}` },
    { type: APP_TEXTS.dashboard.recentGames.questionAdded, question: 'TypeScript의 장점은?', time: `2${APP_TEXTS.dashboard.recentGames.daysAgo}`, status: APP_TEXTS.dashboard.recentGames.approved },
  ];

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
              <span>{APP_TEXTS.dashboard.masteryProgress.title}</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              {APP_TEXTS.dashboard.masteryProgress.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="group cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 group-hover:text-slate-700 transition-colors">{APP_TEXTS.dashboard.masteryProgress.dailyTraining} (5수)</span>
                <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">3/5</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/5 transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-blue-500/30" />
              </div>
            </div>
            
            <div className="group cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 group-hover:text-slate-700 transition-colors">{APP_TEXTS.dashboard.masteryProgress.weeklyChallenge} (30수)</span>
                <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">18/30</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/5 transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-blue-500/30" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 group cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{APP_TEXTS.dashboard.masteryProgress.consecutivePlay}</p>
                  <p className="text-sm text-blue-500 group-hover:text-blue-600 transition-colors animate-pulse">7일째 {APP_TEXTS.dashboard.masteryProgress.consecutiveWinning}</p>
                </div>
                <div className="text-2xl animate-chess-hover interactive-glow group-hover:scale-125 transition-transform duration-300">♔</div>
              </div>
            </div>

            {/* Achievement badges */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">{APP_TEXTS.dashboard.masteryProgress.recentAchievements}</p>
              <div className="flex space-x-2">
                <div className="px-3 py-1 bg-blue-100 border border-blue-200 rounded-full text-xs text-blue-700 animate-scale-in cursor-pointer hover:bg-blue-200 transition-colors">
                  🏆 {APP_TEXTS.dashboard.masteryProgress.winningStreak}
                </div>
                <div className="px-3 py-1 bg-purple-100 border border-purple-200 rounded-full text-xs text-purple-700 animate-scale-in cursor-pointer hover:bg-purple-200 transition-colors" style={{animationDelay: '0.2s'}}>
                  ⚡ {APP_TEXTS.dashboard.masteryProgress.quickVictory}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}