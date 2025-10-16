'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '../../lib/api';
import styled from 'styled-components';
import { APP_TEXTS } from '../../constants/texts';

interface TicTacToeBoardProps {
  onGameEnd?: (result: 'win' | 'lose' | 'draw', board?: string) => void;
  isPlayerTurn: boolean;
  onMoveComplete?: () => void;
  triggerMove?: boolean; // 면접 답변 후 틱택토 수를 트리거하는 플래그
  initialBoard?: string; // 초기 보드 상태
  isGameOver?: boolean; // 게임 종료 상태인지 여부
}

type GameState = 'playing' | 'player_win' | 'ai_win' | 'draw';

const BoardContainer = styled.div`
  width: 100%;
  min-width: 300px;
  max-width: 400px;
  aspect-ratio: 1;
  border: 3px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 4px 6px rgba(0, 0, 0, 0.05);
  background: #ffffff;
  cursor: default;
  user-select: none;
  position: relative;
`;

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  gap: 2px;
  padding: 4px;
  background: #374151;
`;

const Square = styled.div<{ 
  $isLastMove: boolean; 
  $isWinner: boolean;
  $isGameOver: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 8px;
  position: relative;
  cursor: default;
  transition: all 0.3s ease;
  min-height: 80px;
  
  /* 클릭 이벤트 완전 차단 */
  pointer-events: none;
  user-select: none;
  
  ${props => props.$isLastMove && `
    background-color: #fbbf24 !important;
    box-shadow: inset 0 0 0 3px #f59e0b;
    animation: highlight 1s ease-in-out;
  `}
  
  ${props => props.$isWinner && `
    background: linear-gradient(45deg, #3b82f6, #60a5fa, #3b82f6) !important;
    background-size: 200% 200%;
    animation: winnerGlow 2s ease-in-out infinite, winnerPulse 1.5s ease-in-out infinite;
    box-shadow: 
      0 0 20px rgba(59, 130, 246, 0.8),
      inset 0 0 0 3px #2563eb;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
      animation: winnerRipple 2s ease-in-out infinite;
      border-radius: 8px;
    }
  `}
  
  @keyframes highlight {
    0% { 
      background-color: #fbbf24;
      box-shadow: inset 0 0 0 3px #f59e0b;
    }
    50% { 
      background-color: #fcd34d;
      box-shadow: inset 0 0 0 4px #f59e0b;
    }
    100% { 
      background-color: #fbbf24;
      box-shadow: inset 0 0 0 3px #f59e0b;
    }
  }
  
  @keyframes winnerGlow {
    0%, 100% { 
      background-position: 0% 50%;
    }
    50% { 
      background-position: 100% 50%;
    }
  }
  
  @keyframes winnerPulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 
        0 0 20px rgba(59, 130, 246, 0.8),
        inset 0 0 0 3px #2563eb;
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 
        0 0 30px rgba(59, 130, 246, 1),
        inset 0 0 0 4px #2563eb;
    }
  }
  
  @keyframes winnerRipple {
    0% { 
      opacity: 0.8;
      transform: scale(0.8);
    }
    50% { 
      opacity: 0.4;
      transform: scale(1.2);
    }
    100% { 
      opacity: 0.8;
      transform: scale(0.8);
    }
  }
`;

const Symbol = styled.div<{ $isMoving: boolean }>`
  font-size: 3rem;
  font-weight: bold;
  user-select: none;
  transition: all 0.3s ease;
  transform: ${props => props.$isMoving ? 'scale(1.2)' : 'scale(1)'};
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
  cursor: default;
  pointer-events: none;
  color: #1f2937;
`;

const GameInfo = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  width: 100%;
  max-width: 400px;
`;

const StatusText = styled.div<{ $isPlayerTurn: boolean; $isGameOver?: boolean; $gameState?: GameState }>`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${props => {
    if (props.$isGameOver) {
      if (props.$gameState === 'player_win') return '#059669';
      if (props.$gameState === 'ai_win') return '#dc2626';
      return '#6b7280';
    }
    return props.$isPlayerTurn ? '#059669' : '#dc2626';
  }};
  margin-bottom: 0.75rem;
  text-align: center;
  padding: 0.75rem;
  background: ${props => {
    if (props.$isGameOver) {
      if (props.$gameState === 'player_win') return '#f0fdf4';
      if (props.$gameState === 'ai_win') return '#fef2f2';
      return '#f9fafb';
    }
    return props.$isPlayerTurn ? '#f0fdf4' : '#fef2f2';
  }};
  border-radius: 8px;
  border: 1px solid ${props => {
    if (props.$isGameOver) {
      if (props.$gameState === 'player_win') return '#bbf7d0';
      if (props.$gameState === 'ai_win') return '#fecaca';
      return '#e5e7eb';
    }
    return props.$isPlayerTurn ? '#bbf7d0' : '#fecaca';
  }};
  animation: ${props => props.$isGameOver && props.$gameState !== 'draw' ? 'gameOverStatus 2s ease-in-out infinite' : 'none'};
  position: relative;
  overflow: hidden;
  
  ${props => props.$isGameOver && props.$gameState !== 'draw' && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 2s ease-in-out infinite;
    }
  `}
  
  @keyframes gameOverStatus {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }
    50% { 
      transform: scale(1.02);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
    }
  }
  
  @keyframes shimmer {
    0% { 
      left: -100%;
    }
    100% { 
      left: 100%;
    }
  }
`;

const AITurnIndicator = styled.div`
  color: #3b82f6;
  font-size: 0.9rem;
  text-align: center;
  font-style: italic;
  margin-top: 0.5rem;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
`;

const ControlButton = styled.button<{ $disabled?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: ${props => props.$disabled ? '#e5e7eb' : '#3b82f6'};
  color: ${props => props.$disabled ? '#9ca3af' : 'white'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
  }
`;

export const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({
  onGameEnd,
  isPlayerTurn,
  onMoveComplete,
  triggerMove,
  initialBoard,
  isGameOver = false
}) => {
  const [board, setBoard] = useState<string[]>(() => {
    if (initialBoard) {
      return initialBoard.split('');
    }
    return new Array(9).fill(' ');
  });
  
  const [gameState, setGameState] = useState<GameState>('playing');
  const [lastMove, setLastMove] = useState<number | null>(null);
  const [isAIMoving, setIsAIMoving] = useState(false);
  const [winnerSquares, setWinnerSquares] = useState<number[]>([]);

  // 보드 업데이트
  const updateBoard = useCallback((newBoard: string[]) => {
    setBoard(newBoard);
    
    // 게임 상태 확인
    const boardStr = newBoard.join('');
    checkGameState(boardStr);
  }, []);

  // 게임 상태 확인
  const checkGameState = useCallback(async (boardStr: string) => {
    try {
      const response = await apiClient.checkTicTacToeGameState(boardStr);
      setGameState(response.game_state as GameState);
      
      if (response.is_game_over) {
        if (response.game_state === 'player_win') {
          setWinnerSquares(findWinningLine(board));
          onGameEnd?.('win', boardStr);
        } else if (response.game_state === 'ai_win') {
          setWinnerSquares(findWinningLine(board));
          onGameEnd?.('lose', boardStr);
        } else if (response.game_state === 'draw') {
          onGameEnd?.('draw', boardStr);
        }
      }
    } catch (error) {
      console.error('게임 상태 확인 오류:', error);
    }
  }, [board, onGameEnd]);

  // 승리 라인 찾기
  const findWinningLine = useCallback((board: string[]): number[] => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로
      [0, 4, 8], [2, 4, 6] // 대각선
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return line;
      }
    }
    return [];
  }, []);

  // AI 수 두기
  const makeAIMove = useCallback(async () => {
    if (!isPlayerTurn && gameState === 'playing' && !isAIMoving && !isGameOver) {
      setIsAIMoving(true);
      
      try {
        const boardStr = board.join('');
        const response = await apiClient.getTicTacToeMove(boardStr, 5.0, false); // 기본 점수 5.0
        
        if (response.move) {
          const { row, col } = response.move;
          const index = row * 3 + col;
          const newBoard = [...board];
          newBoard[index] = 'O';
          
          setLastMove(index);
          updateBoard(newBoard);
          onMoveComplete?.();
        }
      } catch (error) {
        console.error('틱택토 AI 오류:', error);
      } finally {
        setIsAIMoving(false);
      }
    }
  }, [board, isPlayerTurn, gameState, isAIMoving, isGameOver, updateBoard, onMoveComplete]);

  // 면접 답변 후 AI 수 트리거
  const triggerAIMove = useCallback(() => {
    if (!isPlayerTurn && gameState === 'playing' && !isAIMoving && !isGameOver) {
      makeAIMove();
    }
  }, [isPlayerTurn, gameState, isAIMoving, isGameOver, makeAIMove]);

  // 보드 렌더링
  const renderBoard = () => {
    const squares = [];
    
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const symbol = board[i];
      const isLastMove = lastMove === i;
      const isWinner = winnerSquares.includes(i);
      
      squares.push(
        <Square
          key={i}
          $isLastMove={isLastMove}
          $isWinner={isWinner}
          $isGameOver={gameState !== 'playing'}
        >
          {symbol !== ' ' && (
            <Symbol $isMoving={isAIMoving && symbol === 'O'}>
              {symbol}
            </Symbol>
          )}
        </Square>
      );
    }
    
    return squares;
  };

  // 게임 상태 텍스트
  const getGameStatusText = () => {
    if (gameState === 'player_win') return '🎉 당신이 승리했습니다!';
    if (gameState === 'ai_win') return '😔 AI가 승리했습니다!';
    if (gameState === 'draw') return '🤝 무승부입니다!';
    if (isPlayerTurn) return '👤 당신의 차례입니다';
    return '🤖 AI가 생각 중...';
  };

  // 새 게임 시작
  const startNewGame = useCallback(async () => {
    try {
      const response = await apiClient.createNewTicTacToeGame();
      setBoard(response.board.split(''));
      setGameState('playing');
      setLastMove(null);
      setWinnerSquares([]);
    } catch (error) {
      console.error('새 게임 시작 오류:', error);
    }
  }, []);

  // 면접 답변 후 AI 이동 트리거
  useEffect(() => {
    if (triggerMove) {
      triggerAIMove();
    }
  }, [triggerMove, triggerAIMove]);

  // 초기 보드 설정
  useEffect(() => {
    if (initialBoard) {
      setBoard(initialBoard.split(''));
    }
  }, [initialBoard]);

  return (
    <div>
      <BoardContainer>
        <BoardGrid>
          {renderBoard()}
        </BoardGrid>
      </BoardContainer>
      
      <GameInfo>
        <StatusText 
          $isPlayerTurn={isPlayerTurn} 
          $isGameOver={gameState !== 'playing'}
          $gameState={gameState}
        >
          {getGameStatusText()}
        </StatusText>
        
        {isAIMoving && <AITurnIndicator>🤖 AI가 생각 중...</AITurnIndicator>}
        
        <ControlButtons>
          <ControlButton 
            onClick={startNewGame}
            $disabled={isAIMoving}
          >
            🔄 새 게임
          </ControlButton>
        </ControlButtons>
      </GameInfo>
    </div>
  );
};
