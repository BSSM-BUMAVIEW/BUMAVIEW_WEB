"use client";

import React, { useState } from 'react';
import { InterviewBattleWebSocket } from '../../../components/InterviewBattleWebSocket';
import { InterviewBattleNew } from '../../../components/InterviewBattleNew';

export default function BattlePage() {
  const [useWebSocket, setUseWebSocket] = useState(true);
  const [userId] = useState(Math.floor(Math.random() * 1000) + 100); // 랜덤 user_id로 테스트

  const handleBack = () => {
    // 홈으로 돌아가는 로직
    window.location.href = '/';
  };

  // 개발용 토글 버튼
  const toggleMode = () => {
    setUseWebSocket(!useWebSocket);
  };

  return (
    <div>
      {/* 개발용 토글 버튼 */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        zIndex: 1000,
        background: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #ddd'
      }}>
        <button 
          onClick={toggleMode}
          style={{
            padding: '8px 16px',
            backgroundColor: useWebSocket ? '#3b82f6' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {useWebSocket ? 'WebSocket 모드' : '기존 모드'}
        </button>
        <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
          현재: {useWebSocket ? 'WebSocket' : '기존'} 컴포넌트
        </div>
      </div>

      {useWebSocket ? (
        <InterviewBattleWebSocket
          userId={userId}
          onBack={handleBack}
        />
      ) : (
        <InterviewBattleNew />
      )}
    </div>
  );
}
