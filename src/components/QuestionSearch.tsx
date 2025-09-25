'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
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
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['전체', '프론트엔드', '백엔드', 'React', 'Node.js', 'Database', '알고리즘', '기타'];
  const difficulties = ['전체', '초급', '중급', '고급'];

  const questions = [
    {
      id: 1,
      question: "React Hook의 개념과 useState의 동작 원리에 대해 설명해주세요.",
      category: "React",
      difficulty: "중급",
      likes: 24,
      answers: 8,
      author: "김개발",
      createdAt: "2일 전",
      tags: ["React", "Hook", "State"],
      company: "네이버"
    },
    {
      id: 2,
      question: "JavaScript의 호이스팅(Hoisting)에 대해 설명하고 예시를 들어주세요.",
      category: "프론트엔드",
      difficulty: "중급",
      likes: 18,
      answers: 12,
      author: "박프론트",
      createdAt: "3일 전",
      tags: ["JavaScript", "Hoisting"],
      company: "카카오"
    },
    {
      id: 3,
      question: "데이터베이스의 정규화가 무엇인지 설명하고, 1NF, 2NF, 3NF의 차이점을 말해주세요.",
      category: "Database",
      difficulty: "고급",
      likes: 31,
      answers: 6,
      author: "이디비",
      createdAt: "1주 전",
      tags: ["Database", "정규화", "SQL"],
      company: "토스"
    },
    {
      id: 4,
      question: "RESTful API의 특징과 HTTP 메서드별 용도를 설명해주세요.",
      category: "백엔드",
      difficulty: "초급",
      likes: 15,
      answers: 9,
      author: "최백엔드",
      createdAt: "5일 전",
      tags: ["REST", "API", "HTTP"],
      company: "우아한형제들"
    },
    {
      id: 5,
      question: "TypeScript를 사용하는 이유와 장점에 대해 설명해주세요.",
      category: "프론트엔드",
      difficulty: "초급",
      likes: 22,
      answers: 14,
      author: "정타입",
      createdAt: "1일 전",
      tags: ["TypeScript", "JavaScript"],
      company: "라인"
    }
  ];

  const filteredQuestions = questions.filter(q => {
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
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-white">{cat}</option>
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
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 shadow-lg" size="lg">
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
              {filteredQuestions.map((question, index) => {
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
                          <Button size="sm" variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50">
                            <Eye className="w-4 h-4 mr-1" />
                            전략 보기
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 shadow-lg">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            참여하기
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
    </div>
  );
}