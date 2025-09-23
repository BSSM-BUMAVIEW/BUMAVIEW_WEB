import React from 'react';
import { HeroSection } from '../../../components/dashboard/HeroSection';
import { StatsSection } from '../../../components/dashboard/StatsSection';
import { ActionsSection } from '../../../components/dashboard/ActionsSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
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
      href: '/battle',
      highlight: true,
      position: 'a1'
    },
    {
      title: '지식 탐색',
      description: '전략적으로 질문을 분석하고 학습하세요',
      piece: '♗',
      pieceName: 'Bishop',
      color: 'from-blue-500 to-blue-700',
      href: '/search',
      position: 'b8'
    },
    {
      title: '단독 훈련',
      description: '집중적인 개인 연습으로 실력을 향상시키세요',
      piece: '♖',
      pieceName: 'Rook',
      color: 'from-emerald-500 to-emerald-700',
      href: '/mock',
      position: 'h1'
    },
    {
      title: '명예의 전당',
      description: '최고 수준의 마스터들과 견주어보세요',
      piece: '♕',
      pieceName: 'Queen',
      color: 'from-amber-500 to-amber-700',
      href: '/rankings',
      position: 'd8'
    }
  ];

  const recentActivities = [
    { type: '배틀 승리', opponent: '세진님', time: '2시간 전', score: '+15 점' },
    { type: '답변 등록', question: 'React Hook에 대해 설명해주세요', time: '1일 전', likes: '3 좋아요' },
    { type: '질문 추가', question: 'TypeScript의 장점은?', time: '2일 전', status: '승인됨' },
  ];

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
      <ActionsSection actions={quickActions} />

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
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
              cursor: 'pointer', 
              padding: '0.5rem', 
              borderRadius: '0.5rem',
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '14px', 
                marginBottom: '0.5rem' 
              }}>
                <span style={{ color: '#64748b' }}>일일 훈련 (5수)</span>
                <span style={{ fontWeight: '500', color: '#1e293b' }}>3/5</span>
              </div>
              <div style={{ 
                backgroundColor: '#e2e8f0', 
                borderRadius: '9999px', 
                height: '8px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
                  height: '100%', 
                  width: '60%',
                  borderRadius: '9999px',
                  transition: 'all 1s ease'
                }} />
              </div>
            </div>
            
            <div style={{ 
              cursor: 'pointer', 
              padding: '0.5rem', 
              borderRadius: '0.5rem',
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '14px', 
                marginBottom: '0.5rem' 
              }}>
                <span style={{ color: '#64748b' }}>주간 도전 (30수)</span>
                <span style={{ fontWeight: '500', color: '#1e293b' }}>18/30</span>
              </div>
              <div style={{ 
                backgroundColor: '#e2e8f0', 
                borderRadius: '9999px', 
                height: '8px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
                  height: '100%', 
                  width: '60%',
                  borderRadius: '9999px',
                  transition: 'all 1s ease'
                }} />
              </div>
            </div>

            <div style={{ 
              paddingTop: '1rem', 
              borderTop: '1px solid #e2e8f0', 
              cursor: 'pointer', 
              padding: '0.75rem', 
              borderRadius: '0.5rem',
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: '500', color: '#1e293b', margin: 0 }}>연속 플레이</p>
                  <p style={{ fontSize: '14px', color: '#3b82f6', margin: 0 }}>7일째 연속 승부 중!</p>
                </div>
                <div style={{ fontSize: '24px' }}>♔</div>
              </div>
            </div>

            {/* Achievement badges */}
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '0.75rem', margin: 0 }}>최근 달성 업적</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#dbeafe',
                  border: '1px solid #bfdbfe',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  color: '#1d4ed8',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}>
                  🏆 연승 달성
                </div>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#e9d5ff',
                  border: '1px solid #d8b4fe',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  color: '#7c3aed',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}>
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
