"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, Users, Clock, Wifi, WifiOff } from 'lucide-react';

interface MatchingScreenProps {
  userId: number;
  onMatchFound?: (roomId: string, fen: string, players: number[]) => void;
  onCancel: () => void;
  connectionState: string;
  isConnected: boolean;
}

export function MatchingScreen({ userId, onMatchFound, onCancel, connectionState, isConnected }: MatchingScreenProps) {
  const [waitingTime, setWaitingTime] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWaiting) {
      interval = setInterval(() => {
        setWaitingTime(prev => prev + 1);
      }, 1000);
    } else {
      setWaitingTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isWaiting]);

  useEffect(() => {
    if (isConnected) {
      setIsWaiting(true);
    } else {
      setIsWaiting(false);
    }
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            매칭 대기 중
          </CardTitle>
          <p className="text-slate-600 mt-2">
            상대방을 찾고 있습니다...
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 연결 상태 */}
          <div className="flex items-center justify-center space-x-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {connectionState}
            </span>
          </div>

          {/* 대기 시간 표시 */}
          {isWaiting && (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-mono text-slate-700">
                  {formatTime(waitingTime)}
                </span>
              </div>
              <p className="text-sm text-slate-500">
                대기 시간: {formatTime(waitingTime)}
              </p>
            </div>
          )}

          {/* 로딩 애니메이션 */}
          {isWaiting && (
            <div className="flex justify-center">
              <div className="relative">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <div className="absolute inset-0 w-8 h-8 border-2 border-blue-200 rounded-full animate-ping"></div>
              </div>
            </div>
          )}

          {/* 매칭 정보 */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">사용자 ID:</span>
              <span className="text-sm font-medium text-slate-800">#{userId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">상태:</span>
              <span className="text-sm font-medium text-blue-600">
                {isWaiting ? '매칭 대기 중' : '연결 대기 중'}
              </span>
            </div>
          </div>

          {/* 취소 버튼 */}
          <div className="flex space-x-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              disabled={!isWaiting}
            >
              취소
            </Button>
          </div>

          {/* 매칭 팁 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 매칭 팁</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 평균 매칭 시간: 10-30초</li>
              <li>• 상대방이 없으면 자동으로 AI와 매칭됩니다</li>
              <li>• 매칭 중에는 페이지를 새로고침하지 마세요</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
