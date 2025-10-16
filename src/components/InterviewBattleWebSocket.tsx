"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { WebSocketManager, WebSocketMessage } from '../lib/websocket';
import { MatchingScreen } from './MatchingScreen';
import { InterviewQuestion } from './InterviewQuestion';
import { ChessMoveDisplay } from './ChessMoveDisplay';
import { GameOverScreen } from './GameOverScreen';
import { ChessBoard } from './chess/ChessBoard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';

interface Question {
  id: number;
  content: string;
  category: string;
}

interface GameState {
  phase: 'matching' | 'waiting' | 'playing' | 'round_result' | 'game_over';
  roomId?: string;
  fen?: string;
  players?: number[];
  currentPlayer?: number; // 현재 턴인 플레이어 ID
  currentQuestion?: Question;
  lastMove?: string;
  lastScores?: {
    logic_score: number;
    time_score: number;
    accuracy_score: number;
    model_similarity_score: number;
    total_score: number;
    response_time: number;
  };
  gameResult?: {
    result: 'checkmate' | 'stalemate' | 'draw';
    final_fen: string;
    scores: {
      logic_score: number;
      time_score: number;
      accuracy_score: number;
      model_similarity_score: number;
      total_score: number;
      response_time: number;
    };
  };
  isSubmittingAnswer: boolean;
}

interface InterviewBattleWebSocketProps {
  userId: number;
  onBack: () => void;
}

export function InterviewBattleWebSocket({ userId, onBack }: InterviewBattleWebSocketProps) {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'matching',
    isSubmittingAnswer: false
  });
  // 틱택토 제거: 체스만 지원
  
  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null);
  const [connectionState, setConnectionState] = useState('연결 중...');
  const [isConnected, setIsConnected] = useState(false);
  const [actualUserId, setActualUserId] = useState<number>(userId); // 실제 user_id 저장

  // WebSocket 콜백 함수들
  const handleWaiting = useCallback((data: WebSocketMessage) => {
    console.log('⏳ 매칭 대기 중:', data);
    setGameState(prev => ({
      ...prev,
      phase: 'waiting'
    }));
  }, []);

  const handleMatched = useCallback((data: WebSocketMessage) => {
    console.log('🎯 매칭 완료:', data);
    console.log('📝 받은 your_user_id:', data.your_user_id);
    console.log('👥 players:', data.players);
    console.log('🎯 current_player:', data.current_player);
    console.log('🏠 room_id:', data.room_id);
    
    // 실제 user_id 업데이트 (백엔드에서 받은 your_user_id 사용)
    if (data.your_user_id) {
      setActualUserId(data.your_user_id);
      console.log('✅ your_user_id 업데이트:', data.your_user_id);
    } else {
      console.warn('⚠️ 백엔드에서 your_user_id를 보내지 않음! 현재 user_id 유지:', actualUserId);
    }
    
    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      roomId: data.room_id,
      fen: data.fen,
      players: data.players,
      currentPlayer: data.current_player || data.players?.[0], // 첫 번째 플레이어가 시작
      currentQuestion: {
        id: 1,
        content: "면접 질문이 곧 시작됩니다...",
        category: "일반"
      }
    }));

    console.log('🎮 게임 상태 업데이트 완료 - currentPlayer:', data.current_player || data.players?.[0]);
    console.log('👤 내 actualUserId:', data.your_user_id);

    // 매칭 완료 후 첫 번째 질문 로드
    loadRandomQuestion();
  }, [actualUserId]);

  const handleRoundResult = useCallback((data: WebSocketMessage) => {
    console.log('📊 라운드 결과:', data);
    setGameState(prev => ({
      ...prev,
      phase: 'round_result',
      lastMove: data.move,
      lastScores: data.scores,
      fen: data.fen,
      isSubmittingAnswer: false
    }));

    // 3초 후 다음 질문으로 진행
    setTimeout(() => {
      loadRandomQuestion();
      setGameState(prev => ({
        ...prev,
        phase: 'playing'
      }));
    }, 3000);
  }, []);

  const handleGameOver = useCallback((data: WebSocketMessage) => {
    console.log('🏁 게임 종료:', data);
    setGameState(prev => ({
      ...prev,
      phase: 'game_over',
      gameResult: {
        result: data.result || 'draw',
        final_fen: data.final_fen || '',
        scores: data.scores || {
          logic_score: 0,
          time_score: 0,
          accuracy_score: 0,
          model_similarity_score: 0,
          total_score: 0,
          response_time: 0
        }
      },
      isSubmittingAnswer: false
    }));
  }, []);

  const handlePeerLeft = useCallback((data: WebSocketMessage) => {
    console.log('👋 상대방이 나갔습니다:', data);
    alert('상대방이 게임을 떠났습니다.');
    handleBack();
  }, []);

  const handleTurnChange = useCallback((data: WebSocketMessage) => {
    console.log('🔄 턴 변경:', data);
    console.log('🎯 새로운 current_player:', data.current_player);
    console.log('👤 내 actualUserId:', actualUserId);
    console.log('✅ 내 차례인가?', data.current_player === actualUserId);
    
    setGameState(prev => ({
      ...prev,
      currentPlayer: data.current_player,
      isSubmittingAnswer: false
    }));
  }, [actualUserId]);

  const handleError = useCallback((error: Event) => {
    console.error('❌ WebSocket 오류:', error);
    setConnectionState('연결 오류 - 백엔드 서버가 실행 중인지 확인하세요');
    setIsConnected(false);
  }, []);

  const handleConnect = useCallback(() => {
    console.log('✅ WebSocket 연결됨');
    setConnectionState('연결됨');
    setIsConnected(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log('🔌 WebSocket 연결 끊김');
    setConnectionState('연결 끊김');
    setIsConnected(false);
  }, []);

  // 랜덤 질문 로드
  const loadRandomQuestion = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/questions/random/one');
      if (response.ok) {
        const question = await response.json();
        setGameState(prev => ({
          ...prev,
          currentQuestion: question
        }));
      }
    } catch (error) {
      console.error('질문 로드 실패:', error);
      // 폴백 질문
      setGameState(prev => ({
        ...prev,
        currentQuestion: {
          id: 1,
          content: "자기소개를 해주세요.",
          category: "일반"
        }
      }));
    }
  }, []);

  // WebSocket 연결 초기화
  useEffect(() => {
    const callbacks = {
      onWaiting: handleWaiting,
      onMatched: handleMatched,
      onRoundResult: handleRoundResult,
      onGameOver: handleGameOver,
      onPeerLeft: handlePeerLeft,
      onTurnChange: handleTurnChange,
      onError: handleError,
      onConnect: handleConnect,
      onDisconnect: handleDisconnect
    };

    const manager = new WebSocketManager(callbacks);
    setWsManager(manager);
    manager.connect(actualUserId);

    return () => {
      manager.disconnect();
    };
  }, [actualUserId, handleWaiting, handleMatched, handleRoundResult, handleGameOver, handlePeerLeft, handleError, handleConnect, handleDisconnect]);

  // 답변 제출
  const handleSubmitAnswer = useCallback((questionId: number, answer: string, responseTime: number) => {
    if (wsManager && wsManager.isConnected()) {
      setGameState(prev => ({ ...prev, isSubmittingAnswer: true }));
      console.log('📤 답변 제출 - user_id:', actualUserId);
      wsManager.submitAnswer(questionId, answer, responseTime, actualUserId);
    }
  }, [wsManager, actualUserId]);

  // 게임 취소
  const handleCancel = useCallback(() => {
    if (wsManager) {
      wsManager.leaveMatch();
    }
    handleBack();
  }, [wsManager]);

  // 뒤로가기
  const handleBack = useCallback(() => {
    if (wsManager) {
      wsManager.disconnect();
    }
    onBack();
  }, [wsManager, onBack]);

  // 다시 플레이
  const handlePlayAgain = useCallback(() => {
    setGameState({
      phase: 'matching',
      isSubmittingAnswer: false
    });
    if (wsManager) {
      wsManager.joinMatch(userId);
    }
  }, [wsManager, userId]);

  // 홈으로
  const handleGoHome = useCallback(() => {
    handleBack();
  }, [handleBack]);

  // 통계 보기
  const handleViewStats = useCallback(() => {
    // 통계 페이지로 이동하는 로직
    console.log('통계 보기');
  }, []);

  // 게임 상태에 따른 렌더링
  const renderGameContent = () => {
    switch (gameState.phase) {
      case 'matching':
      case 'waiting':
        return (
          <MatchingScreen
            userId={userId}
            onMatchFound={() => {}}
            onCancel={handleCancel}
            connectionState={connectionState}
            isConnected={isConnected}
          />
        );

      case 'playing':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-7xl mx-auto">
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>나가기</span>
                </Button>
                
                <div className="flex items-center space-x-3">
                  {isConnected ? (
                    <Wifi className="w-5 h-5 text-green-500" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm text-slate-600">{connectionState}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 면접 질문 영역 */}
                <div>
                  {gameState.currentQuestion && (
                    <InterviewQuestion
                      question={gameState.currentQuestion}
                      onSubmitAnswer={handleSubmitAnswer}
                      isSubmitting={gameState.isSubmittingAnswer}
                      isMyTurn={gameState.currentPlayer === actualUserId}
                      currentPlayerName={gameState.currentPlayer === actualUserId ? "나" : "상대방"}
                    />
                  )}
                </div>

                {/* 보드 영역 */}
                <div>
                  <Card className="bg-white shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-slate-800">체스 게임</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {gameState.fen && (
                        <ChessBoard
                          initialFEN={gameState.fen}
                          isGameOver={false}
                          onGameEnd={() => {}}
                          aiLevel={10}
                          playerAiLevel={10}
                          isPlayerTurn={true}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );

      case 'round_result':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
              {gameState.lastMove && gameState.lastScores && gameState.fen && (
                <ChessMoveDisplay
                  move={gameState.lastMove}
                  fen={gameState.fen}
                  scores={gameState.lastScores}
                  isAnimating={true}
                />
              )}
            </div>
          </div>
        );

      case 'game_over':
        return gameState.gameResult ? (
          <GameOverScreen
            result={gameState.gameResult}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
            onViewStats={handleViewStats}
          />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">게임 결과를 불러오는 중...</h2>
              <Button onClick={handleBack}>홈으로 돌아가기</Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">알 수 없는 게임 상태</h2>
              <Button onClick={handleBack}>홈으로 돌아가기</Button>
            </div>
          </div>
        );
    }
  };

  return renderGameContent();
}
