'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { ChessAI } from '../../lib/chessAI';
import styled from 'styled-components';
import { APP_TEXTS } from '../../constants/texts';

interface ChessBoardProps {
  aiLevel: number;
  playerAiLevel: number; // 플레이어를 대신하는 AI 레벨
  onGameEnd?: (result: 'win' | 'lose' | 'draw', fen?: string) => void;
  isPlayerTurn: boolean;
  onMoveComplete?: () => void;
  triggerMove?: boolean; // 면접 답변 후 체스 수를 트리거하는 플래그
  initialFEN?: string; // 초기 체스 상태 (게임 종료 시 최종 상태 유지용)
  isGameOver?: boolean; // 게임 종료 상태인지 여부
}

const BoardContainer = styled.div`
  width: 100%;
  min-width: 500px;
  max-width: 700px;
  aspect-ratio: 1;
  border: 2px solid #e5e7eb;
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
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 100%;
  height: 100%;
`;

const Square = styled.div<{ $isLight: boolean; $isSelected: boolean; $isLastMove: boolean; $isCheckmate: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$isLight ? '#f8fafc' : '#475569'};
  border: ${props => props.$isSelected ? '3px solid #ff6b6b' : 'none'};
  position: relative;
  cursor: default;
  transition: all 0.3s ease;
  min-height: 60px;
  
  /* 클릭 이벤트 완전 차단 */
  pointer-events: none;
  user-select: none;
  
  ${props => props.$isLastMove && `
    background-color: #fbbf24 !important;
    box-shadow: inset 0 0 0 2px #f59e0b;
    animation: highlight 1s ease-in-out;
  `}
  
  ${props => props.$isCheckmate && `
    background: linear-gradient(45deg, #3b82f6, #60a5fa, #3b82f6) !important;
    background-size: 200% 200%;
    animation: checkmateGlow 2s ease-in-out infinite, checkmatePulse 1.5s ease-in-out infinite;
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
      animation: checkmateRipple 2s ease-in-out infinite;
    }
  `}
  
  @keyframes highlight {
    0% { 
      background-color: #fbbf24;
      box-shadow: inset 0 0 0 2px #f59e0b;
    }
    50% { 
      background-color: #fcd34d;
      box-shadow: inset 0 0 0 3px #f59e0b;
    }
    100% { 
      background-color: #fbbf24;
      box-shadow: inset 0 0 0 2px #f59e0b;
    }
  }
  
  @keyframes checkmateGlow {
    0%, 100% { 
      background-position: 0% 50%;
    }
    50% { 
      background-position: 100% 50%;
    }
  }
  
  @keyframes checkmatePulse {
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
  
  @keyframes checkmateRipple {
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

const Piece = styled.div<{ $isMoving: boolean }>`
  font-size: 4rem;
  user-select: none;
  transition: all 0.3s ease;
  transform: ${props => props.$isMoving ? 'scale(1.1)' : 'scale(1)'};
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
  cursor: default;
  pointer-events: none;
`;

const MoveIndicator = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: rgba(0, 255, 0, 0.4);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(0, 255, 0, 0.8);
  animation: pulse 1s infinite;
  
  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
  }
`;

const GameInfo = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  width: 100%;
  max-width: 600px;
`;

const StatusText = styled.div<{ $isPlayerTurn: boolean; $isCheckmate?: boolean }>`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${props => props.$isCheckmate ? '#ffffff' : props.$isPlayerTurn ? '#059669' : '#dc2626'};
  margin-bottom: 0.75rem;
  text-align: center;
  padding: 0.75rem;
  background: ${props => props.$isCheckmate ? 
    'linear-gradient(45deg, #3b82f6, #60a5fa, #3b82f6)' : 
    props.$isPlayerTurn ? '#f0fdf4' : '#fef2f2'};
  border-radius: 8px;
  border: 1px solid ${props => props.$isCheckmate ? '#2563eb' : props.$isPlayerTurn ? '#bbf7d0' : '#fecaca'};
  animation: ${props => props.$isCheckmate ? 'checkmateStatus 2s ease-in-out infinite' : 'none'};
  position: relative;
  overflow: hidden;
  
  ${props => props.$isCheckmate && `
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
  
  @keyframes checkmateStatus {
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

const AILevel = styled.div`
  color: #6b7280;
  font-size: 1rem;
  text-align: center;
  font-weight: 500;
`;

const AIThinking = styled.div`
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

const TimerDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  gap: 1rem;
`;

const Timer = styled.div<{ $isActive: boolean; $isLow: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  background: ${props => props.$isActive ? 
    (props.$isLow ? '#fef2f2' : '#eff6ff') : '#f9fafb'};
  border: 2px solid ${props => props.$isActive ? 
    (props.$isLow ? '#fca5a5' : '#93c5fd') : '#e5e7eb'};
  transition: all 0.3s ease;
`;

const TimerLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const TimerValue = styled.div<{ $isLow: boolean }>`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${props => props.$isLow ? '#dc2626' : '#1f2937'};
  font-family: 'Courier New', monospace;
`;

export const ChessBoard: React.FC<ChessBoardProps> = ({
  aiLevel,
  playerAiLevel,
  onGameEnd,
  isPlayerTurn,
  onMoveComplete,
  triggerMove,
  initialFEN,
  isGameOver = false
}) => {
  const chess = useMemo(() => {
    const chessInstance = new Chess();
    if (initialFEN) {
      chessInstance.load(initialFEN);
    }
    return chessInstance;
  }, [initialFEN]); // initialFEN이 변경될 때만 새로 생성
  const [board, setBoard] = useState(chess.board());
  const [lastMove, setLastMove] = useState<string | null>(null);
  const [isAIMoving, setIsAIMoving] = useState(false);
  const [isPlayerAIMoving, setIsPlayerAIMoving] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>(APP_TEXTS.chess.gameStart);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [playerTime, setPlayerTime] = useState(600); // 10분 (초 단위)
  const [aiTime, setAiTime] = useState(600);
  const [isPlayerTimer, setIsPlayerTimer] = useState(true);
  const [checkmateSquare, setCheckmateSquare] = useState<string | null>(null);
  const aiConfig = ChessAI.getConfigForLevel(aiLevel);
  const playerAiConfig = ChessAI.getConfigForLevel(playerAiLevel);

  // 타이머 효과
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlayerTimer && playerTime > 0) {
        setPlayerTime(prev => prev - 1);
      } else if (!isPlayerTimer && aiTime > 0) {
        setAiTime(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlayerTimer, playerTime, aiTime]);

  // 시간 초과 체크
  useEffect(() => {
    if (playerTime === 0) {
      setGameStatus(APP_TEXTS.chess.timeUpDefeat);
      onGameEnd?.('lose');
    } else if (aiTime === 0) {
      setGameStatus(APP_TEXTS.chess.timeUpVictory);
      onGameEnd?.('win');
    }
  }, [playerTime, aiTime, onGameEnd]);

  // 보드 업데이트 - 더 안정적으로
  const updateBoard = useCallback(() => {
    try {
      setBoard(chess.board());
      setCanUndo(chess.history().length > 0);
      
          if (chess.isGameOver()) {
            if (chess.isCheckmate()) {
              const winner = chess.turn() === 'w' ? APP_TEXTS.chess.opponentTurn : APP_TEXTS.chess.yourTurn;
              setGameStatus(`${APP_TEXTS.chess.checkmate} ${winner} ${APP_TEXTS.interviewBattle.victory}!`);
              
              // 체크메이트된 킹의 위치 찾기
              const checkmateKingSquare = findCheckmateKing();
              setCheckmateSquare(checkmateKingSquare);
              
              onGameEnd?.(winner === APP_TEXTS.chess.yourTurn ? 'win' : 'lose', chess.fen());
            } else if (chess.isDraw()) {
              setGameStatus(APP_TEXTS.interviewBattle.draw);
              setCheckmateSquare(null);
              onGameEnd?.('draw', chess.fen());
            }
          } else if (chess.isCheck()) {
        setGameStatus(`${chess.turn() === 'w' ? APP_TEXTS.chess.yourTurn : APP_TEXTS.chess.opponentTurn} ${APP_TEXTS.chess.check}`);
      } else {
        setGameStatus(`${chess.turn() === 'w' ? APP_TEXTS.chess.yourTurn : APP_TEXTS.chess.opponentTurn} 차례`);
      }
    } catch (error) {
      console.error('보드 업데이트 오류:', error);
      setGameStatus('게임 상태 오류');
    }
  }, [chess, onGameEnd]);

  // 되돌리기 기능
  const handleUndo = useCallback(() => {
    if (chess.history().length > 0 && !isAIMoving) {
      chess.undo();
      chess.undo(); // 플레이어와 AI의 수를 모두 되돌림
      setLastMove(null);
      setIsPlayerTimer(true); // 플레이어 턴으로 되돌림
      updateBoard();
    }
  }, [chess, isAIMoving, updateBoard]);

  // 플레이어 AI 이동 (면접 답변 품질에 따라)
  const makePlayerAIMove = useCallback(async () => {
    if (chess.turn() === 'w' && !chess.isGameOver()) {
      setIsPlayerAIMoving(true);
      
      try {
        const playerAI = new ChessAI(chess, playerAiConfig);
        const move = await playerAI.getBestMove();
        
        if (move) {
          const result = chess.move(move);
          if (result) {
            setLastMove(result.from + result.to);
            setIsPlayerTimer(false); // AI 타이머로 전환
            updateBoard();
            onMoveComplete?.();
            
            // 상대 AI 차례로 전환
            setTimeout(() => {
              makeAIMove();
            }, 800);
          } else {
            // 플레이어 AI가 제안한 수가 유효하지 않은 경우 랜덤 수 선택
            const moves = chess.moves({ verbose: true });
            if (moves.length > 0) {
              const seed = Date.now() + chess.history().length;
              const randomIndex = Math.floor((Math.sin(seed) * 10000) % 1 * moves.length);
              const randomMove = moves[Math.abs(randomIndex)];
              const result = chess.move(randomMove);
              if (result) {
                setLastMove(result.from + result.to);
                setIsPlayerTimer(false);
                updateBoard();
                onMoveComplete?.();
                
                setTimeout(() => {
                  makeAIMove();
                }, 800);
              }
            }
          }
        } else {
          // 플레이어 AI가 수를 찾지 못한 경우 랜덤 수 선택
          const moves = chess.moves({ verbose: true });
          if (moves.length > 0) {
            const seed = Date.now() + chess.history().length;
            const randomIndex = Math.floor((Math.sin(seed) * 10000) % 1 * moves.length);
            const randomMove = moves[Math.abs(randomIndex)];
            const result = chess.move(randomMove);
            if (result) {
              setLastMove(result.from + result.to);
              setIsPlayerTimer(false);
              updateBoard();
              onMoveComplete?.();
              
              setTimeout(() => {
                makeAIMove();
              }, 800);
            }
          }
        }
      } catch (error) {
        console.error('Player AI move error:', error);
        // 플레이어 AI가 유효하지 않은 수를 두려고 할 때 랜덤 수 선택
        const moves = chess.moves({ verbose: true });
        if (moves.length > 0) {
          const seed = Date.now() + chess.history().length;
          const randomIndex = Math.floor((Math.sin(seed) * 10000) % 1 * moves.length);
          const randomMove = moves[Math.abs(randomIndex)];
          const result = chess.move(randomMove);
          if (result) {
            setLastMove(result.from + result.to);
            setIsPlayerTimer(false);
            updateBoard();
            onMoveComplete?.();
            
            setTimeout(() => {
              makeAIMove();
            }, 800);
          }
        }
      } finally {
        setIsPlayerAIMoving(false);
      }
    }
  }, [chess, playerAiConfig, updateBoard, onMoveComplete]);

  // 상대 AI 이동
  const makeAIMove = useCallback(async () => {
    if (chess.turn() === 'b' && !chess.isGameOver()) {
      setIsAIMoving(true);
      
      try {
        const ai = new ChessAI(chess, aiConfig);
        const move = await ai.getBestMove();
        
        if (move) {
          const result = chess.move(move);
          if (result) {
            setLastMove(result.from + result.to);
            setIsPlayerTimer(true); // 플레이어 타이머로 전환
            updateBoard();
            onMoveComplete?.();
          } else {
            // AI가 제안한 수가 유효하지 않은 경우 랜덤 수 선택
            const moves = chess.moves({ verbose: true });
            if (moves.length > 0) {
              const seed = Date.now() + chess.history().length;
              const randomIndex = Math.floor((Math.sin(seed) * 10000) % 1 * moves.length);
              const randomMove = moves[Math.abs(randomIndex)];
              const result = chess.move(randomMove);
              if (result) {
                setLastMove(result.from + result.to);
                setIsPlayerTimer(true);
                updateBoard();
                onMoveComplete?.();
              }
            }
          }
        } else {
          // AI가 수를 찾지 못한 경우 랜덤 수 선택
          const moves = chess.moves({ verbose: true });
          if (moves.length > 0) {
            const seed = Date.now() + chess.history().length;
            const randomIndex = Math.floor((Math.sin(seed) * 10000) % 1 * moves.length);
            const randomMove = moves[Math.abs(randomIndex)];
            const result = chess.move(randomMove);
            if (result) {
              setLastMove(result.from + result.to);
              setIsPlayerTimer(true);
              updateBoard();
              onMoveComplete?.();
            }
          }
        }
      } catch (error) {
        console.error('AI move error:', error);
        // AI가 유효하지 않은 수를 두려고 할 때 랜덤 수 선택
        const moves = chess.moves({ verbose: true });
        if (moves.length > 0) {
          const seed = Date.now() + chess.history().length;
          const randomIndex = Math.floor((Math.sin(seed) * 10000) % 1 * moves.length);
          const randomMove = moves[Math.abs(randomIndex)];
          const result = chess.move(randomMove);
          if (result) {
            setLastMove(result.from + result.to);
            setIsPlayerTimer(true);
            updateBoard();
            onMoveComplete?.();
          }
        }
      } finally {
        setIsAIMoving(false);
      }
    }
  }, [chess, aiConfig, updateBoard, onMoveComplete]);

  // 면접 답변 후 플레이어 AI가 자동으로 플레이
  const triggerPlayerAIMove = useCallback(() => {
    if (chess.turn() === 'w' && !chess.isGameOver() && !isPlayerAIMoving && !isAIMoving && !isGameOver) {
      makePlayerAIMove();
    }
  }, [chess, isPlayerAIMoving, isAIMoving, isGameOver, makePlayerAIMove]);

  // 체크메이트된 킹의 위치 찾기
  const findCheckmateKing = useCallback(() => {
    const board = chess.board();
    const currentTurn = chess.turn(); // 체크메이트된 플레이어의 턴
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'k' && piece.color === currentTurn) {
          const square = String.fromCharCode(97 + col) + (8 - row);
          return square;
        }
      }
    }
    return null;
  }, [chess]);

  // 체스 말 유니코드 매핑
  const getPieceSymbol = (piece: { color: string; type: string } | null) => {
    if (!piece) return '';
    
    const symbols: { [key: string]: { [key: string]: string } } = {
      w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
      b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
    };
    
    return symbols[piece.color]?.[piece.type] || '';
  };

  // 보드 렌더링
  const renderBoard = () => {
    const squares = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = String.fromCharCode(97 + col) + (8 - row);
        const piece = board[row][col];
        const isLight = (row + col) % 2 === 0;
        const isLastMove = lastMove?.includes(square) || false;
        const isCheckmate = checkmateSquare === square;
        
        squares.push(
          <Square
            key={square}
            $isLight={isLight}
            $isSelected={false}
            $isLastMove={isLastMove}
            $isCheckmate={isCheckmate}
          >
            {piece && (
              <Piece $isMoving={(isAIMoving && piece.color === 'b') || (isPlayerAIMoving && piece.color === 'w')}>
                {getPieceSymbol(piece)}
              </Piece>
            )}
          </Square>
        );
      }
    }
    
    return squares;
  };

  useEffect(() => {
    updateBoard();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 면접 답변 후 플레이어 AI 이동 트리거
  useEffect(() => {
    if (triggerMove) {
      triggerPlayerAIMove();
    }
  }, [triggerMove, triggerPlayerAIMove]);


  return (
    <div>
      <BoardContainer>
        <BoardGrid>
          {renderBoard()}
        </BoardGrid>
      </BoardContainer>
      
          <GameInfo>
            <StatusText $isPlayerTurn={isPlayerTurn} $isCheckmate={!!checkmateSquare}>
              {gameStatus}
            </StatusText>
        <AILevel>
          {APP_TEXTS.interviewBattle.chess.yourAI}: {playerAiLevel} ({ChessAI.getLevelName(playerAiLevel)}) | {APP_TEXTS.interviewBattle.chess.opponentAI}: {aiLevel} ({ChessAI.getLevelName(aiLevel)})
        </AILevel>
        {isPlayerAIMoving && <AIThinking>🤖 {APP_TEXTS.interviewBattle.chess.yourAI}가 생각 중...</AIThinking>}
        {isAIMoving && <AIThinking>🤖 {APP_TEXTS.interviewBattle.chess.opponentAI}가 생각 중...</AIThinking>}
        
        <TimerDisplay>
          <Timer $isActive={isPlayerTimer} $isLow={playerTime < 60}>
            <TimerLabel>플레이어</TimerLabel>
            <TimerValue $isLow={playerTime < 60}>
              {Math.floor(playerTime / 60)}:{(playerTime % 60).toString().padStart(2, '0')}
            </TimerValue>
          </Timer>
          <Timer $isActive={!isPlayerTimer} $isLow={aiTime < 60}>
            <TimerLabel>AI</TimerLabel>
            <TimerValue $isLow={aiTime < 60}>
              {Math.floor(aiTime / 60)}:{(aiTime % 60).toString().padStart(2, '0')}
            </TimerValue>
          </Timer>
        </TimerDisplay>
        
        <ControlButtons>
          <ControlButton 
            onClick={handleUndo} 
            $disabled={!canUndo || isAIMoving}
          >
            ↶ {APP_TEXTS.interviewBattle.chess.undo}
          </ControlButton>
              <ControlButton 
                onClick={() => {
                  chess.reset();
                  setLastMove(null);
                  setCheckmateSquare(null);
                  setPlayerTime(600);
                  setAiTime(600);
                  setIsPlayerTimer(true);
                  updateBoard();
                }}
                $disabled={isAIMoving}
              >
            🔄 {APP_TEXTS.interviewBattle.chess.newGameButton}
          </ControlButton>
        </ControlButtons>
      </GameInfo>
    </div>
  );
};
