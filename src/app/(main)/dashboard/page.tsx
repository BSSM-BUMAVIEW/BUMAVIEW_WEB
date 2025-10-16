'use client';
import React, { useState } from 'react';
import { HeroSection } from '../../../components/dashboard/HeroSection';
import { StatsSection } from '../../../components/dashboard/StatsSection';
import { ActionsSection } from '../../../components/dashboard/ActionsSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const quickStats: Array<{ label: string; value: string; icon: string; color: string; delay: string }> = []; // 가짜 통계 데이터 제거됨 - API에서 실제 통계를 가져와야 함

  const quickActions = [
    {
      title: '체스 듀얼',
      description: '실시간 면접 대결로 실력을 겨루세요',
      piece: '♞',
      color: 'from-red-500 to-red-700',
      href: '/battle',
      highlight: true,
      position: 'a1'
    },
    {
      title: '지식 탐색',
      description: '전략적으로 질문을 분석하고 학습하세요',
      piece: '♗',
      color: 'from-blue-500 to-blue-700',
      href: '/search',
      position: 'b8'
    },
    {
      title: '단독 훈련',
      description: '집중적인 개인 연습으로 실력을 향상시키세요',
      piece: '♖',
      color: 'from-emerald-500 to-emerald-700',
      href: '/mock',
      position: 'h1'
    },
    {
      title: '명예의 전당',
      description: '최고 수준의 마스터들과 견주어보세요',
      piece: '♕',
      color: 'from-amber-500 to-amber-700',
      href: '/rankings',
      position: 'd8'
    }
  ];

  const recentActivities: Array<{ type: string; opponent?: string; time: string; score?: string; question?: string; likes?: string; status?: string }> = []; // 가짜 최근 경기 데이터 제거됨 - API에서 실제 활동을 가져와야 함

  return (
    <div style={{ 
      maxWidth: '1280px', 
      margin: '0 auto', 
      padding: '2rem 1rem', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2rem' 
    }}>
      <HeroSection />
      <StatsSection stats={quickStats} />
      <ActionsSection onNavigate={() => {}} />

      {/* Recent Activities & Progress */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Game History */}
        <Card style={{ 
          backgroundColor: 'white', 
          border: '1px solid #e2e8f0', 
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          <CardHeader>
            <CardTitle style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: '#1e293b' 
            }}>
              <span style={{ color: '#3b82f6' }}>♚</span>
              <span>최근 경기</span>
            </CardTitle>
            <CardDescription style={{ color: '#64748b' }}>
              최근 체스 듀얼과 훈련 기록입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ color: '#64748b', marginBottom: '1rem' }}>아직 활동 기록이 없습니다.</div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>첫 번째 면접 배틀을 시작해보세요!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                  }}>
                    <span style={{ color: 'white', fontSize: '14px' }}>
                      {activity.type === '배틀 승리' ? '♞' : activity.type === '답변 등록' ? '♗' : '♖'}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      marginBottom: '0.25rem' 
                    }}>
                      <span style={{ fontWeight: '500', color: '#1e293b' }}>{activity.type}</span>
                      <span style={{ fontSize: '12px', color: '#3b82f6' }}>{activity.time}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                      {'opponent' in activity && `vs ${activity.opponent}`}
                      {'question' in activity && activity.question}
                    </p>
                    <p style={{ fontSize: '12px', color: '#3b82f6', margin: '0.25rem 0 0 0' }}>
                      {'score' in activity && activity.score}
                      {'likes' in activity && activity.likes}
                      {'status' in activity && activity.status}
                    </p>
                  </div>
                </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      {/* Question Upload & Sample Download */}
      <Card style={{ 
        backgroundColor: 'white', 
        border: '1px solid #e2e8f0', 
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <CardHeader>
          <CardTitle style={{ color: '#1e293b' }}>
           질문 업로드 (CSV)
          </CardTitle>
          <CardDescription style={{ color: '#64748b' }}>
            샘플 파일을 내려받아 형식에 맞게 작성 후 업로드하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={async () => {
                try {
                  const blob = await apiClient.downloadQuestionSample();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sample_questions.csv';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                } catch (err) {
                  console.error('샘플 다운로드 실패:', err);
                  alert('샘플 다운로드에 실패했습니다.');
                }
              }}
              style={{
                padding: '0.6rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                background: 'white',
                color: '#1e293b'
              }}
            >
              샘플 다운로드
            </button>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const fd = new FormData(form);
                const file = fd.get('file') as File;
                if (!file || file.size === 0) return alert('CSV 파일을 선택해주세요.');
                if (!isAuthenticated || !user?.id) return alert('로그인이 필요합니다.');
                try {
                  await apiClient.uploadQuestions(file, Number(user.id));
                  alert('질문 업로드가 완료되었습니다.');
                  form.reset();
                } catch (err) {
                  console.error('업로드 실패:', err);
                  alert('업로드에 실패했습니다. 로그인/권한 및 파일 형식을 확인해주세요.');
                }
              }}
              style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}
            >
              <input
                type="file"
                name="file"
                accept=".csv"
                style={{
                  padding: '0.6rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.6rem 1rem',
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                  color: 'white',
                  borderRadius: '0.5rem'
                }}
              >
                업로드
              </button>
            </form>

            <div style={{ marginTop: '0.5rem', fontSize: '12px', color: '#94a3b8' }}>
              엔드포인트: GET /question/sample, POST /question/upload (file, userId)
            </div>
          </div>
        </CardContent>
      </Card>
        {/* Mastery Progress */}
        <Card style={{ 
          backgroundColor: 'white', 
          border: '1px solid #e2e8f0', 
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          <CardHeader>
            <CardTitle style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: '#1e293b' 
            }}>
              <span style={{ color: '#3b82f6' }}>♕</span>
              <span>마스터리 진행도</span>
            </CardTitle>
            <CardDescription style={{ color: '#64748b' }}>
              체스 마스터로 가는 여정입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ color: '#64748b', marginBottom: '1rem' }}>아직 진행도 데이터가 없습니다.</div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>면접 배틀을 통해 진행도를 쌓아보세요!</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Section */}
      <Card style={{ 
        backgroundColor: 'white', 
        border: '1px solid #e2e8f0', 
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <CardHeader>
          <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
            <span style={{ color: '#3b82f6' }}>♟</span>
            <span>카테고리 구독</span>
          </CardTitle>
          <CardDescription style={{ color: '#64748b' }}>
            관심 카테고리를 구독하고 새 질문을 메일로 받아보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const formData = new FormData(form);
              const category = (formData.get('category') as string || '').trim();
              if (!category) return;
              try {
                await apiClient.subscribeToCategory(category);
                alert(`'${category}' 구독이 완료되었습니다.`);
                form.reset();
              } catch (err) {
                console.error('구독 실패:', err);
                alert('구독에 실패했습니다. 로그인 여부와 네트워크를 확인해주세요.');
              }
            }}
            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          >
            <input
              name="category"
              placeholder="예: 백엔드, 프론트, AI, devops"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.75rem 1rem',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                color: 'white',
                borderRadius: '0.5rem'
              }}
            >
              구독하기
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await apiClient.sendEmailNow();
                  alert('즉시 메일 발송을 요청했습니다.');
                } catch (err) {
                  console.error('즉시 메일 실패:', err);
                  alert('즉시 메일 요청에 실패했습니다.');
                }
              }}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                background: 'white',
                color: '#1e293b'
              }}
            >
              즉시 메일 받기
            </button>
          </form>

          <div style={{ marginTop: '1rem', fontSize: '12px', color: '#94a3b8' }}>
            예: {`{ "category": "백엔드" }`} 로 POST /subscriptions, 그리고 POST /subscriptions/send-now 지원
          </div>
        </CardContent>
      </Card>

      {/* Year Search removed - moved to Search page */}
    </div>
  );
