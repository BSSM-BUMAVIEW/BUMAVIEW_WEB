'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { apiClient, type Question as APIQuestion } from '../lib/api';
import { AnswerModal } from './AnswerModal';
import { QuestionModal } from './QuestionModal';
import { 
  Search, 
  Filter, 
  Heart, 
  MessageSquare, 
  BookOpen, 
  Plus,
  Eye,
  ChevronDown,
  Star,
  Download,
  Upload
} from 'lucide-react';

export function QuestionSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedDifficulty, setSelectedDifficulty] = useState('전체');
  const [selectedYear, setSelectedYear] = useState<string>('전체');
  const [showFilters, setShowFilters] = useState(false);
  const [apiQuestions, setApiQuestions] = useState<APIQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>('전체');
  const [currentYear, setCurrentYear] = useState<string>('전체');
  
  // 답변 관련 상태
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
  // 질문 수정 상태
  const [editQuestionId, setEditQuestionId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');
  const [editYear, setEditYear] = useState<string>('');
  
  // 질문 등록 관련 상태
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const categories = ['전체', 'front', 'back', 'ai', 'devops'];
  const years = ['전체', ...Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i))];
  const difficulties = ['전체', '초급', '중급', '고급'];

  // 카테고리 표시명 제거됨 - 영어 카테고리명 그대로 사용

  // 인라인 답변 목록 컴포넌트
  function InlineAnswers({ questionId }: { questionId: number }) {
    const [answers, setAnswers] = React.useState<any[] | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
      let mounted = true;
      const load = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await apiClient.getAnswersByQuestion(questionId);
          if (!mounted) return;
          setAnswers(data);
        } catch (e: any) {
          // 404는 답변 없음으로 처리
          const status = e?.response?.status ?? e?.status;
          if (status === 404) {
            setAnswers([]);
            setError(null);
          } else {
            setError('답변을 불러오지 못했습니다.');
            setAnswers([]);
          }
        } finally {
          setLoading(false);
        }
      };
      load();
      return () => { mounted = false; };
    }, [questionId]);

    if (loading) {
      return <div className="text-sm text-slate-500">답변을 불러오는 중...</div>;
    }
    if (error) {
      return <div className="text-sm text-red-500">{error}</div>;
    }
    if (!answers || answers.length === 0) {
      return (
        <div className="text-sm text-slate-500 border border-slate-200 rounded-lg p-4 bg-slate-50">
          아직 등록된 답변이 없습니다.
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {answers.map((a, idx) => (
          <div key={idx} className="p-4 bg-white border border-slate-200 rounded-lg">
            <div className="text-slate-800 whitespace-pre-wrap">{a.content}</div>
            <div className="mt-2 text-xs text-slate-500">좋아요 {a.likes} · {new Date(a.createdAt).toLocaleString('ko-KR')}</div>
          </div>
        ))}
      </div>
    );
  }
  // 답변 관련 핸들러
  const handleParticipateClick = (question: any) => {
    console.log('🎯 선택된 질문:', question);
    setSelectedQuestion(question);
    setShowAnswerModal(true);
  };

  const handleViewAnswersClick = (question: any) => {
    setSelectedQuestion(question);
    setExpandedQuestionId(prev => (prev === question.id ? null : question.id));
  };

  const handleCloseAnswerModal = () => {
    setShowAnswerModal(false);
    setSelectedQuestion(null);
  };

  const handleBackFromAnswersList = () => {
    setExpandedQuestionId(null);
    setSelectedQuestion(null);
  };

  const handleAnswerSubmitted = () => {
    // 답변 등록 후 필요한 작업 (예: 목록 새로고침)
    console.log('답변이 등록되었습니다!');
  };

  // ===== 질문 수정/삭제 =====
  const handleStartEdit = (q: any) => {
    setEditQuestionId(q.id);
    setEditContent(q.question || q.content || '');
    setEditCategory(q.category || '');
    setEditYear(q.questionAt || '');
  };

  const handleSaveEdit = async () => {
    if (!editQuestionId) return;
    try {
      await apiClient.updateQuestion(editQuestionId, {
        content: editContent,
        category: editCategory,
        questionAt: editYear
      });
      setEditQuestionId(null);
      await fetchQuestions(currentCategory, currentYear);
    } catch (e) {
      console.error('질문 수정 실패:', e);
      alert('질문 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await apiClient.deleteQuestion(id);
      await fetchQuestions(currentCategory, currentYear);
    } catch (e) {
      console.error('질문 삭제 실패:', e);
      alert('질문 삭제에 실패했습니다.');
    }
  };

  // 질문 등록 관련 핸들러
  const handleQuestionSubmitted = () => {
    // 질문 등록 후 목록 새로고침
    fetchQuestions(currentCategory);
    console.log('질문이 등록되었습니다!');
  };

  const handleOpenQuestionModal = () => {
    setShowQuestionModal(true);
  };

  const handleCloseQuestionModal = () => {
    setShowQuestionModal(false);
  };

  // API에서 질문 가져오기 (전체 또는 카테고리별)
  const fetchQuestions = async (category: string = '전체', year: string = '전체') => {
    try {
      setIsLoading(true);
      setError(null);
      
      let questions: APIQuestion[] = [];
      // 연도 필터 우선 적용 (백엔드 연도 검색 API 사용)
      if (year !== '전체') {
        questions = await apiClient.getQuestionsByYear(year);
        console.log(`${year} 연도 질문 로드 완료:`, questions.length, '개');
      } else if (category === '전체') {
        questions = await apiClient.getAllQuestions();
        console.log('전체 질문 로드 완료:', questions.length, '개');
      } else {
        questions = await apiClient.getQuestionsByCategory(category);
        console.log(`${category} 카테고리 질문 로드 완료:`, questions.length, '개');
      }
      
      setApiQuestions(questions);
      setCurrentCategory(category);
      setCurrentYear(year);
    } catch (error) {
      console.error('질문 로드 실패:', error);
      setError('질문을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 질문 가져오기
  useEffect(() => {
    fetchQuestions('전체', '전체');
  }, []);

  // API 질문을 UI 형식으로 변환
  const convertedApiQuestions = apiQuestions.map((apiQ, index) => ({
    id: apiQ.id,
    question: apiQ.content,
    category: apiQ.category,
    difficulty: "중급", // API에서 difficulty 정보가 없으므로 기본값
    likes: 0, // API에서 실제 좋아요 수를 가져올 때까지 0
    answers: 0, // API에서 실제 답변 수를 가져올 때까지 0
    author: "API",
    createdAt: "방금 전",
    tags: [apiQ.category],
    company: "부마뷰"
  }));

  // API에서 받은 실제 카테고리들을 추출
  const actualCategories = ['전체', ...Array.from(new Set(apiQuestions.map(q => q.category))).sort()];
  
  // 실제 카테고리와 기본 카테고리를 합치기
  const allAvailableCategories = Array.from(new Set([...categories, ...actualCategories]));

  // 더미 데이터 제거됨 - API 데이터만 사용

  // API 질문만 사용 (더미 데이터 제거됨)
  const allQuestions = convertedApiQuestions;
  
  const filteredQuestions = allQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === '전체' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === '전체' || q.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case '중급': return 'bg-amber-100 text-amber-700 border-amber-200';
      case '고급': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Chess Knowledge Archive Header */}
        

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Strategic Filters */}
          <Card className="lg:col-span-1 bg-white border border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <span className="text-blue-500">♝</span>
                <span>전략 필터</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">전문 분야</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    // 카테고리 변경 시 API 호출
                    fetchQuestions(e.target.value, selectedYear);
                  }}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                >
                  {allAvailableCategories.map(cat => (
                    <option key={cat} value={cat} className="bg-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">연도</label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    fetchQuestions(selectedCategory, e.target.value);
                  }}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                >
                  {years.map(y => (
                    <option key={y} value={y} className="bg-white">{y}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">마스터리 레벨</label>
                <select 
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                >
                  {difficulties.map((diff, index) => {
                    const pieces = ['전체', '♙ 폰 (초급)', '♗ 비숍 (중급)', '♕ 퀸 (고급)'];
                    return (
                      <option key={diff} value={diff} className="bg-white">
                        {index === 0 ? diff : pieces[index] || diff}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Strategic Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <Button 
                  onClick={handleOpenQuestionModal}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 shadow-lg" 
                  size="lg"
                >
                  <span className="mr-2">♔</span>
                  질문 등록
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Strategic Search */}
            <Card className="mb-6 bg-white border border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="전략적 지식을 탐색하세요..."
                    className="pl-12 h-14 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-500 text-lg"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-blue-500">♕</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chess Board Results */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                발견된 <span className="font-semibold text-blue-600">{filteredQuestions.length}</span>개의 전략
              </p>
              <select className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-800">
                <option className="bg-white">최신 전략</option>
                <option className="bg-white">마스터 추천</option>
                <option className="bg-white">답변 풍부</option>
              </select>
            </div>

            {/* Strategic Questions Archive */}
            <div className="space-y-4">
              {/* 로딩 상태 */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-slate-600">질문을 불러오는 중...</p>
                </div>
              )}

              {/* 에러 상태 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700">{error}</p>
                  <Button 
                    onClick={() => fetchQuestions(currentCategory)}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white"
                    size="sm"
                  >
                    다시 시도
                  </Button>
                </div>
              )}

              {/* 질문 목록 */}
              {!isLoading && !error && filteredQuestions.map((question, index) => {
                const chessPieces = ['♜', '♞', '♝', '♛', '♚'];
                return (
                  <Card key={question.id} className="hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-white border border-slate-200 hover:border-blue-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white text-xl">{chessPieces[index % chessPieces.length]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                            <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                              {question.category}
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                              {question.company}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-3 cursor-pointer hover:text-blue-600 transition-colors">
                            {question.question}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {question.tags.map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span>{question.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                            <span>{question.answers}개 전략</span>
                          </span>
                          <span>마스터 {question.author}</span>
                          <span>{question.createdAt}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-300 text-slate-600 hover:bg-slate-50"
                            onClick={() => handleViewAnswersClick(question)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            전략 보기
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-300 text-slate-600 hover:bg-slate-50"
                            onClick={() => handleStartEdit(question)}
                          >
                            수정
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(question.id)}
                          >
                            삭제
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 shadow-lg"
                            onClick={() => handleParticipateClick(question)}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            참여하기
                          </Button>
                        </div>
                      </div>
                  </CardContent>
                  {expandedQuestionId === question.id && (
                    <div className="px-6 pb-6">
                      <InlineAnswers questionId={question.id} />
                    </div>
                  )}
                  {editQuestionId === question.id && (
                    <div className="px-6 pb-6 space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg"
                        placeholder="질문 내용"
                      />
                      <div className="flex gap-2">
                        <input
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="flex-1 p-3 border border-slate-300 rounded-lg"
                          placeholder="카테고리"
                        />
                        <input
                          value={editYear}
                          onChange={(e) => setEditYear(e.target.value)}
                          className="w-40 p-3 border border-slate-300 rounded-lg"
                          placeholder="연도"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit} className="bg-blue-600 text-white">저장</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditQuestionId(null)}>취소</Button>
                      </div>
                    </div>
                  )}
                  </Card>
                );
              })}

              {/* 질문 개수 표시 */}
              {!isLoading && !error && (
                <div className="text-center py-4 text-slate-600">
                  <p>
                    {currentCategory === '전체' ? '전체' : `${currentCategory} 카테고리`}에서 
                    <span className="font-semibold text-blue-600"> {filteredQuestions.length}</span>개의 질문이 있습니다
                    {apiQuestions.length > 0 && (
                      <span className="ml-2 text-sm">
                        (API: {convertedApiQuestions.length}개)
                      </span>
                    )}
                  </p>
                  {currentCategory !== '전체' && (
                    <p className="text-sm text-slate-500 mt-1">
                      💡 다른 카테고리도 확인해보세요!
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Chess Board Navigation */}
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50" size="sm">
                  ← 이전 수
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" size="sm">
                  1
                </Button>
                <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50" size="sm">
                  2
                </Button>
                <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50" size="sm">
                  3
                </Button>
                <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50" size="sm">
                  다음 수 →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 답변 모달 */}
      {showAnswerModal && selectedQuestion && (
        <AnswerModal
          isOpen={showAnswerModal}
          onClose={handleCloseAnswerModal}
          questionId={selectedQuestion.id}
          questionContent={selectedQuestion.question || selectedQuestion.content}
          onAnswerSubmitted={handleAnswerSubmitted}
        />
      )}

      {/* 질문 등록 모달 */}
      <QuestionModal
        isOpen={showQuestionModal}
        onClose={handleCloseQuestionModal}
        onQuestionSubmitted={handleQuestionSubmitted}
      />
    </div>
  );
}