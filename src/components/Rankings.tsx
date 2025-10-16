'use client';

import React, { useState, useEffect } from 'react';
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
  Award,
  Loader2
} from 'lucide-react';
import { apiClient, Answer } from '../lib/api';

interface UserRanking {
  rank: number;
  name: string;
  avatar: string;
  totalLikes: number;
  totalAnswers: number;
  avgLikes: number;
  badge: string;
  school: string;
  tier: string;
}

export function Rankings() {
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [answerRankings, setAnswerRankings] = useState<UserRanking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API에서 답변 데이터 가져오기
  const fetchAnswerRankings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 좋아요 순으로 답변 조회
      const answers = await apiClient.getAnswersByLikes();
      
      // 답변 데이터를 랭킹 형식으로 변환
      const rankings: UserRanking[] = answers.map((answer, index) => ({
        rank: index + 1,
        name: `사용자 ${answer.id}`, // 실제로는 사용자 이름이 필요
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${answer.id}`,
        totalLikes: answer.likes,
        totalAnswers: 1, // 개별 답변이므로 1
        avgLikes: answer.likes,
        badge: getBadgeByLikes(answer.likes),
        school: "API 사용자", // 하드코딩된 학교명 제거
        tier: getTierByLikes(answer.likes)
      }));

      setAnswerRankings(rankings);
    } catch (error) {
      console.error('답변 랭킹 로드 실패:', error);
      setError('랭킹 데이터를 불러오는데 실패했습니다.');
      
      // API 실패 시 빈 배열로 설정
      setAnswerRankings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 좋아요 수에 따른 배지 결정
  const getBadgeByLikes = (likes: number): string => {
    if (likes >= 1000) return "Expert";
    if (likes >= 800) return "Master";
    if (likes >= 600) return "Pro";
    if (likes >= 400) return "Advanced";
    if (likes >= 200) return "Intermediate";
    return "Beginner";
  };

  // 좋아요 수에 따른 티어 결정
  const getTierByLikes = (likes: number): string => {
    if (likes >= 1000) return "Diamond";
    if (likes >= 800) return "Platinum";
    if (likes >= 600) return "Gold";
    if (likes >= 400) return "Silver";
    return "Bronze";
  };


  // 강제로 비워둔 상태 유지
  useEffect(() => {
    setIsLoading(false);
    setAnswerRankings([]);
  }, []);

  const battleRankings: any[] = []; // 더미 데이터 제거됨 - API에서 실제 배틀 랭킹을 가져와야 함

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
              <span>면접 답변 랭킹</span>
            </TabsTrigger>
            <TabsTrigger 
              value="battles" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-600"
            >
              <span>♞</span>
              <span>면접 체스 랭킹</span>
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
                  {answerRankings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-slate-500 mb-4">아직 답변 데이터가 없습니다.</div>
                      <div className="text-sm text-slate-400">첫 번째 답변을 작성해보세요!</div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-end space-x-8">
                      {/* 2nd Place */}
                      {answerRankings[1] && (
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
                      )}

                      {/* 1st Place */}
                      {answerRankings[0] && (
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
                      )}

                      {/* 3rd Place */}
                      {answerRankings[2] && (
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
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Full Rankings */}
              <Card className="lg:col-span-3 bg-white border border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800">전체 답변 랭킹</CardTitle>
                  <CardDescription className="text-slate-600">좋아요를 많이 받은 답변자 순위입니다</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      <span className="ml-2 text-slate-600">랭킹 데이터를 불러오는 중...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <div className="text-red-500 mb-4">{error}</div>
                      <Button onClick={fetchAnswerRankings} variant="outline">
                        다시 시도
                      </Button>
                    </div>
                  ) : answerRankings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-slate-500 mb-4">아직 답변 데이터가 없습니다.</div>
                      <div className="text-sm text-slate-400 mb-4">첫 번째 답변을 작성해보세요!</div>
                      <Button onClick={fetchAnswerRankings} variant="outline">
                        새로고침
                      </Button>
                    </div>
                  ) : (
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
                  )}
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
                  {battleRankings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-slate-500 mb-4">아직 배틀 데이터가 없습니다.</div>
                      <div className="text-sm text-slate-400">첫 번째 배틀을 시작해보세요!</div>
                    </div>
                  ) : (
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
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}