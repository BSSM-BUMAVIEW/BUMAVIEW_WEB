'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  TrendingUp, 
  Users,
  Heart,
  MessageSquare,
  Swords,
  Target,
  Calendar,
  Award
} from 'lucide-react';

export function Rankings() {
  const [selectedPeriod, setSelectedPeriod] = useState('전체');

  const answerRankings = [
    {
      rank: 1,
      name: "김개발",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      totalLikes: 1247,
      totalAnswers: 89,
      avgLikes: 14.0,
      badge: "Expert",
      school: "부산소프트웨어마이스터고",
      tier: "Diamond"
    },
    {
      rank: 2,
      name: "박프론트",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      totalLikes: 986,
      totalAnswers: 67,
      avgLikes: 14.7,
      badge: "Master",
      school: "부산소프트웨어마이스터고",
      tier: "Platinum"
    },
    {
      rank: 3,
      name: "이디비",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      totalLikes: 834,
      totalAnswers: 52,
      avgLikes: 16.0,
      badge: "Pro",
      school: "부산소프트웨어마이스터고",
      tier: "Gold"
    },
    {
      rank: 4,
      name: "최백엔드",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
      totalLikes: 756,
      totalAnswers: 48,
      avgLikes: 15.8,
      badge: "Advanced",
      school: "부산소프트웨어마이스터고",
      tier: "Gold"
    },
    {
      rank: 5,
      name: "정타입",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
      totalLikes: 689,
      totalAnswers: 43,
      avgLikes: 16.0,
      badge: "Skilled",
      school: "부산소프트웨어마이스터고",
      tier: "Silver"
    }
  ];

  const battleRankings = [
    {
      rank: 1,
      name: "배틀킹",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
      rating: 2187,
      wins: 47,
      losses: 8,
      winRate: 85.5,
      streak: 12,
      tier: "Grandmaster"
    },
    {
      rank: 2,
      name: "면접마스터",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
      rating: 1943,
      wins: 39,
      losses: 12,
      winRate: 76.5,
      streak: 5,
      tier: "Master"
    },
    {
      rank: 3,
      name: "승부사",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
      rating: 1756,
      wins: 34,
      losses: 16,
      winRate: 68.0,
      streak: 3,
      tier: "Diamond"
    },
    {
      rank: 4,
      name: "도전자",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=9",
      rating: 1624,
      wins: 28,
      losses: 15,
      winRate: 65.1,
      streak: 1,
      tier: "Platinum"
    },
    {
      rank: 5,
      name: "신입생",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=10",
      rating: 1487,
      wins: 23,
      losses: 19,
      winRate: 54.8,
      streak: 0,
      tier: "Gold"
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Grandmaster': return 'from-purple-400 to-purple-600';
      case 'Master': return 'from-red-400 to-red-600';
      case 'Diamond': return 'from-blue-400 to-blue-600';
      case 'Platinum': return 'from-teal-400 to-teal-600';
      case 'Gold': return 'from-amber-400 to-yellow-600';
      case 'Silver': return 'from-slate-400 to-slate-600';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">♔</span>;
      case 2: return <span className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">♕</span>;
      case 3: return <span className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white text-lg shadow-lg">♗</span>;
      default: return <span className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">{rank}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Grand Master Hall */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">♔</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800">명예의 전당</h1>
            <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">♚</span>
            </div>
          </div>
          <p className="text-slate-600 text-lg">체스 마스터들의 영광스러운 순위</p>
        </div>

        {/* Tournament Period */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {['전체', '이번 주', '이번 달'].map((period) => (
              <Button
                key={period}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 ${
                  selectedPeriod === period 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="answers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 border border-slate-200">
            <TabsTrigger 
              value="answers" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-600"
            >
              <span>♛</span>
              <span>지식 명인</span>
            </TabsTrigger>
            <TabsTrigger 
              value="battles" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-600"
            >
              <span>♞</span>
              <span>배틀 마스터</span>
            </TabsTrigger>
          </TabsList>

          {/* Answer Rankings */}
          <TabsContent value="answers">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top 3 Podium */}
              <Card className="lg:col-span-3 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center flex items-center justify-center space-x-2 text-slate-800">
                    <Trophy className="w-6 h-6 text-blue-600" />
                    <span>TOP 3 답변왕</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-end space-x-8">
                    {/* 2nd Place */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 relative">
                        <Avatar className="w-full h-full border-4 border-slate-300 shadow-lg">
                          <AvatarImage src={answerRankings[1].avatar} />
                          <AvatarFallback>{answerRankings[1].name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-800">{answerRankings[1].name}</h3>
                      <p className="text-sm text-slate-600">{answerRankings[1].totalLikes} 좋아요</p>
                    </div>

                    {/* 1st Place */}
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-3 relative">
                        <Avatar className="w-full h-full border-4 border-blue-400 shadow-lg">
                          <AvatarImage src={answerRankings[0].avatar} />
                          <AvatarFallback>{answerRankings[0].name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-slate-800">{answerRankings[0].name}</h3>
                      <p className="text-slate-600">{answerRankings[0].totalLikes} 좋아요</p>
                      <Badge className="mt-1 bg-blue-500 text-white">{answerRankings[0].badge}</Badge>
                    </div>

                    {/* 3rd Place */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 relative">
                        <Avatar className="w-full h-full border-4 border-amber-500 shadow-lg">
                          <AvatarImage src={answerRankings[2].avatar} />
                          <AvatarFallback>{answerRankings[2].name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-800">{answerRankings[2].name}</h3>
                      <p className="text-sm text-slate-600">{answerRankings[2].totalLikes} 좋아요</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Full Rankings */}
              <Card className="lg:col-span-3 bg-white border border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800">전체 답변 랭킹</CardTitle>
                  <CardDescription className="text-slate-600">좋아요를 많이 받은 답변자 순위입니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {answerRankings.map((user) => (
                      <div key={user.rank} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(user.rank)}
                        </div>
                        
                        <Avatar className="w-12 h-12 shadow-lg">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-slate-800">{user.name}</h3>
                            <Badge className={`bg-gradient-to-r ${getTierColor(user.tier)} text-white`}>
                              {user.tier}
                            </Badge>
                            <Badge variant="outline" className="border-slate-300 text-slate-600">{user.badge}</Badge>
                          </div>
                          <p className="text-sm text-slate-600">{user.school}</p>
                        </div>

                        <div className="flex space-x-6 text-center">
                          <div>
                            <div className="flex items-center space-x-1 text-sm">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span className="font-bold text-slate-800">{user.totalLikes}</span>
                            </div>
                            <p className="text-xs text-slate-500">총 좋아요</p>
                          </div>
                          <div>
                            <div className="flex items-center space-x-1 text-sm">
                              <MessageSquare className="w-4 h-4 text-blue-500" />
                              <span className="font-bold text-slate-800">{user.totalAnswers}</span>
                            </div>
                            <p className="text-xs text-slate-500">답변 수</p>
                          </div>
                          <div>
                            <div className="flex items-center space-x-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-bold text-slate-800">{user.avgLikes}</span>
                            </div>
                            <p className="text-xs text-slate-500">평균 좋아요</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Battle Rankings */}
          <TabsContent value="battles">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Battle Stats */}
              <Card className="lg:col-span-1 bg-white border border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-slate-800">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span>배틀 통계</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-slate-600">오늘 진행된 배틀</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">1,247</div>
                    <div className="text-sm text-slate-600">총 참가자 수</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-600">89%</div>
                    <div className="text-sm text-slate-600">평균 만족도</div>
                  </div>
                </CardContent>
              </Card>

              {/* Battle Rankings */}
              <Card className="lg:col-span-2 bg-white border border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800">배틀 랭킹</CardTitle>
                  <CardDescription className="text-slate-600">배틀에서 가장 뛰어난 성과를 보인 사용자들입니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {battleRankings.map((user) => (
                      <div key={user.rank} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(user.rank)}
                        </div>
                        
                        <Avatar className="w-12 h-12 shadow-lg">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-slate-800">{user.name}</h3>
                            <Badge className={`bg-gradient-to-r ${getTierColor(user.tier)} text-white`}>
                              {user.tier}
                            </Badge>
                            {user.streak > 0 && (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                🔥 {user.streak}연승
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">레이팅: {user.rating}</p>
                        </div>

                        <div className="flex space-x-4 text-center">
                          <div>
                            <div className="text-sm font-bold text-emerald-600">{user.wins}승</div>
                            <p className="text-xs text-slate-500">승리</p>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-red-600">{user.losses}패</div>
                            <p className="text-xs text-slate-500">패배</p>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-blue-600">{user.winRate}%</div>
                            <p className="text-xs text-slate-500">승률</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}