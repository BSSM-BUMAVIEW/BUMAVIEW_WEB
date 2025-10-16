'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Target, 
  Play, 
  Pause, 
  RotateCcw, 
  Send, 
  Clock,
  CheckCircle,
  Settings,
  BookOpen,
  Brain,
  Lightbulb,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { apiClient, Question } from '../lib/api';

export function MockInterview() {
  const [interviewState, setInterviewState] = useState<'setup' | 'active' | 'completed'>('setup');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('백엔드');
  const [selectedDifficulty, setSelectedDifficulty] = useState('중급');
  const [questionCount, setQuestionCount] = useState(5);

  // 선택 가능한 카테고리 (표시는 한글, API 파라미터는 영문 약어)
  const categories = ['백엔드', '프론트엔드', 'AI', 'DevOps'];

  const mapCategoryForApi = (label: string): string => {
    const map: Record<string, string> = {
      '백엔드': 'back',
      '프론트엔드': 'front',
      'AI': 'ai',
      'DevOps': 'devops',
      'backend': 'back',
      'frontend': 'front'
    };
    return map[label] || label;
  };
  const difficulties = ['초급', '중급', '고급', '혼합'];

  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API에서 질문 가져오기
  const fetchQuestions = async (category: string = '백엔드', count: number = 5) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let apiQuestions: Question[] = [];
      if (category && category !== '전체') {
        const apiCategory = mapCategoryForApi(category);
        apiQuestions = await apiClient.getQuestionsByCategory(apiCategory);
      } else {
        apiQuestions = await apiClient.getAllQuestions();
      }
      
      // API 질문을 MockInterview 형식으로 변환
      let source = apiQuestions;
      // API에서 데이터가 없을 때 안전한 폴백 생성
      if (!source || source.length === 0) {
        source = Array.from({ length: count }).map((_, i) => ({
          id: i + 1,
          content: '예시 질문입니다. 자기소개를 간단히 해주세요.',
          category: category || '일반',
          questionAt: String(new Date().getFullYear())
        })) as any;
      }

      const mockQuestions = source.slice(0, count).map((apiQ: any, index: number) => ({
        id: apiQ.id,
        question: apiQ.content,
        category: category || apiQ.category,
        difficulty: getRandomDifficulty(),
        hints: getDefaultHints(category || apiQ.category),
        timeLimit: 300
      }));

      setQuestions(mockQuestions);
    } catch (error) {
      console.error('질문 로드 실패:', error);
      setError('질문을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      
      // API 실패 시 빈 배열로 설정
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 랜덤 난이도 생성
  const getRandomDifficulty = (): string => {
    const difficulties = ['초급', '중급', '고급'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  // 카테고리별 기본 힌트 생성
  const getDefaultHints = (category: string): string[] => {
    const hintMap: { [key: string]: string[] } = {
      'frontend': ["기본 개념", "실제 사용 예시", "성능 최적화"],
      'backend': ["아키텍처 관점", "보안과 성능", "실제 구현 경험"],
      'react': ["핵심 개념", "Hook과 클래스 컴포넌트", "실제 프로젝트 경험"],
      'database': ["설계 원칙", "성능과 정규화", "실제 쿼리 예시"]
    };
    return hintMap[category] || ["기본 개념", "실제 사용 예시", "개선 방안"];
  };


  // 컴포넌트 마운트 시 질문 로드
  useEffect(() => {
    fetchQuestions(selectedCategory);
  }, [selectedCategory]);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      // Auto move to next question when time runs out
      handleNextQuestion();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case '중급': return 'bg-amber-100 text-amber-700 border-amber-200';
      case '고급': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const startInterview = async () => {
    // 질문이 없으면 먼저 로드
    if (!questions || questions.length === 0) {
      await fetchQuestions(selectedCategory, questionCount);
    }
    setInterviewState('active');
    setCurrentQuestionIndex(0);
    setTimeLeft(300);
    setIsTimerActive(true);
    setAnswers([]);
    setCurrentAnswer('');
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestionIndex < questionCount - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(300);
      setIsTimerActive(true);
    } else {
      setInterviewState('completed');
      setIsTimerActive(false);
    }
  };

  const resetInterview = () => {
    setInterviewState('setup');
    setCurrentQuestionIndex(0);
    setTimeLeft(300);
    setIsTimerActive(false);
    setAnswers([]);
    setCurrentAnswer('');
  };

  if (interviewState === 'completed') {
    const totalTime = questionCount * 300 - timeLeft;
    const avgTimePerQuestion = Math.floor(totalTime / questionCount);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Victory atmosphere */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full animate-pulse"
            style={{
              background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)'
            }}
          />
        </div>

        {/* Success particles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-40 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-60 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-500"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Card className="mb-8 bg-white border border-blue-200 shadow-2xl">
              <CardContent className="p-12">
                {/* Epic Completion Symbol */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse">
                    <span className="text-white text-6xl">♔</span>
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/30 animate-pulse"></div>
                </div>
                
                <h1 className="text-6xl font-bold mb-4 text-blue-600">
                  훈련 완주!
                </h1>
                
                <p className="text-xl mb-8 text-blue-500">
                  전략적 사고력이 한층 더 발전했습니다!
                </p>

                {/* Training Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-white border border-emerald-200 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">♞</span>
                      </div>
                      <p className="text-emerald-600 mb-2">완주한 문제</p>
                      <p className="text-4xl font-bold text-emerald-700">{questionCount}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border border-amber-200 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">♗</span>
                      </div>
                      <p className="text-amber-600 mb-2">평균 사고 시간</p>
                      <p className="text-4xl font-bold text-amber-700">{formatTime(avgTimePerQuestion)}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-purple-200 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">♕</span>
                      </div>
                      <p className="text-purple-600 mb-2">전략 점수</p>
                      <p className="text-4xl font-bold text-purple-700">85%</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center mb-8">
                  <Button 
                    onClick={resetInterview}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 px-8 py-3 text-lg shadow-lg"
                  >
                    <span className="mr-2">♖</span>
                    재훈련 시작
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="border-slate-300 text-slate-600 hover:bg-slate-50 px-8 py-3 text-lg"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    마스터 해설 보기
                  </Button>
                </div>

                {/* Training Review */}
                <Card className="text-left bg-white border border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-800 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <span>훈련 복기</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {questions.slice(0, questionCount).map((question, index) => (
                        <Card key={question.id} className="bg-slate-50 border border-slate-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
                                  <span className="text-white text-sm">{index + 1}</span>
                                </div>
                                <h3 className="font-semibold text-slate-800">수 {index + 1}</h3>
                              </div>
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                              </Badge>
                            </div>
                            <p className="text-slate-600 mb-3 text-sm">{question.question}</p>
                            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                              <p className="text-sm text-slate-700">
                                {answers[index] || '답변이 기록되지 않았습니다.'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Achievement Unlocked */}
            <Card className="bg-white border border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-3xl animate-bounce">🏆</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">업적 달성!</h3>
                    <p className="text-blue-600">&quot;전략적 마스터&quot; - {questionCount}문제 훈련을 성공적으로 완주했습니다</p>
                  </div>
                  <span className="text-3xl animate-bounce delay-200">⭐</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (interviewState === 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Strategic training atmosphere */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full animate-pulse"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 25%, rgba(59,130,246,0.08) 25%, rgba(59,130,246,0.08) 50%, transparent 50%, transparent 75%, rgba(59,130,246,0.08) 75%),
                linear-gradient(45deg, transparent 25%, rgba(59,130,246,0.08) 25%, rgba(59,130,246,0.08) 50%, transparent 50%, transparent 75%, rgba(59,130,246,0.08) 75%)
              `,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 30px 30px'
            }}
          />
        </div>

        {/* Floating strategic elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Strategic Training Header */}
            <div className="mb-8 text-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-spin-slow flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">♖</span>
                </div>
                <div className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full animate-spin-slow-reverse flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">♖</span>
                </div>
                <Card className="bg-white border border-blue-200 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-2xl">♔</span>
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold text-slate-800 mb-1">전략적 단독 훈련</h1>
                          <div className="flex items-center space-x-3">
                            <span className="text-blue-600">라운드 {currentQuestionIndex + 1}</span>
                            <span className="text-slate-600">of</span>
                            <span className="text-purple-600">{questionCount}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Epic Timer */}
                      <div className="text-center">
                        <div className="relative">
                          <div className="w-28 h-28 rounded-full border-4 border-blue-200 flex items-center justify-center bg-white shadow-inner">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-blue-600 mb-1">
                                {formatTime(timeLeft)}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-300 text-blue-600 hover:bg-blue-50 px-2 py-1 h-6 text-xs"
                                onClick={() => setIsTimerActive(!isTimerActive)}
                              >
                                {isTimerActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                              </Button>
                            </div>
                          </div>
                          <div 
                            className="absolute inset-0 rounded-full border-4 border-transparent"
                            style={{
                              background: `conic-gradient(from 0deg, #3b82f6 ${((300 - timeLeft) / 300) * 360}deg, transparent ${((300 - timeLeft) / 300) * 360}deg)`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Training Progress */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="bg-white border border-emerald-200 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-xl mb-2">♞</div>
                  <div className="text-emerald-600 font-bold">{Math.round(((currentQuestionIndex) / questionCount) * 100)}%</div>
                  <div className="text-emerald-500 text-sm">완주율</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-purple-200 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-xl mb-2">⚡</div>
                  <div className="text-purple-600 font-bold">집중 모드</div>
                  <div className="text-purple-500 text-sm">전략적 사고</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-amber-200 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-xl mb-2">🎯</div>
                  <div className="text-amber-600 font-bold">{questionCount - currentQuestionIndex}</div>
                  <div className="text-amber-500 text-sm">남은 수</div>
                </CardContent>
              </Card>
            </div>

            {/* Strategic Question */}
            <Card className="mb-8 bg-white border border-blue-200 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">♗</span>
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-slate-800">전략적 문제</CardTitle>
                      <p className="text-slate-600">당신의 전문성을 검증하는 순간</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Badge className={getDifficultyColor(currentQuestion?.difficulty || 'medium')}>
                      {currentQuestion?.difficulty || '중급'}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                      {currentQuestion?.category || '일반'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 mb-6">
                  <p className="text-xl leading-relaxed text-slate-800 font-medium">
                    {currentQuestion?.question || '질문을 불러오는 중...'}
                  </p>
                </div>
                
                {/* Strategic Hints */}
                <div className="mb-4">
                  <h4 className="font-medium mb-3 flex items-center text-slate-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    전략적 힌트
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {(currentQuestion?.hints || []).map((hint: string, index: number) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-amber-100 border border-amber-200 text-amber-700 text-sm rounded-full"
                      >
                        {hint}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress visualization */}
                <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                    style={{ width: `${((currentQuestionIndex) / questionCount) * 100}%` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
                </div>
              </CardContent>
            </Card>

            {/* Master Answer Input */}
            <Card className="bg-white border border-blue-200 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-slate-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl">마스터의 해답</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="전략적 사고를 펼쳐보세요... 구체적인 예시와 논리적 근거를 제시하면 더욱 강력한 답변이 됩니다."
                    className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder:text-slate-500 text-lg"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                    {currentAnswer.length}/1000
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300 text-slate-600 hover:bg-slate-50"
                      onClick={() => setIsTimerActive(!isTimerActive)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {isTimerActive ? '일시정지' : '시작'}
                    </Button>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button 
                      variant="outline"
                      className="border-slate-300 text-slate-600 hover:bg-slate-50"
                      onClick={resetInterview}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      포기
                    </Button>
                    <Button 
                      onClick={handleNextQuestion}
                      disabled={!currentAnswer.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 px-8 py-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="mr-2">♚</span>
                      {currentQuestionIndex === questionCount - 1 ? '훈련 완료' : '다음 수'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Chess Training Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">♖</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800">단독 훈련</h1>
            <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">♖</span>
            </div>
          </div>
          <p className="text-slate-600 text-lg">집중적인 개인 연습으로 마스터리를 완성하세요</p>
        </div>

        {/* Chess Training Setup */}
        <Card className="mb-6 bg-white border border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <span className="text-blue-500">♙</span>
              <span>훈련 설정</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              전략적 훈련 조건을 설정하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">전문 분야</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-white">{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">훈련 강도</label>
                <select 
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {difficulties.map((diff, index) => {
                    const pieces = ['♙ 폰 (초급)', '♗ 비숍 (중급)', '♕ 퀸 (고급)', '♔ 킹 (혼합)'];
                    return (
                      <option key={diff} value={diff} className="bg-white">
                        {pieces[index] || diff}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">문제 수</label>
                <select 
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value={3} className="bg-white">3문제 (빠른 훈련)</option>
                  <option value={5} className="bg-white">5문제 (표준 훈련)</option>
                  <option value={10} className="bg-white">10문제 (심화 훈련)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Button 
                onClick={startInterview}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 py-3 shadow-lg"
              >
                <span className="mr-2">♔</span>
                전략적 훈련 시작
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Training Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <span className="text-emerald-600">♞</span>
                <span>훈련 가이드</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-xs">1</span>
                </div>
                <p className="text-slate-600 text-sm">각 문제당 5분의 사고 시간이 주어집니다</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-xs">2</span>
                </div>
                <p className="text-slate-600 text-sm">힌트를 참고하여 논리적으로 답변하세요</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-xs">3</span>
                </div>
                <p className="text-slate-600 text-sm">시간이 부족하면 타이머를 일시정지할 수 있습니다</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <span className="text-purple-600">♗</span>
                <span>전략적 팁</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-3 h-3 text-purple-600" />
                </div>
                <p className="text-slate-600 text-sm">구체적인 예시를 들어 설명하세요</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Target className="w-3 h-3 text-purple-600" />
                </div>
                <p className="text-slate-600 text-sm">핵심 개념부터 차근차근 설명하세요</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-purple-600" />
                </div>
                <p className="text-slate-600 text-sm">장단점을 균형있게 서술하세요</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}