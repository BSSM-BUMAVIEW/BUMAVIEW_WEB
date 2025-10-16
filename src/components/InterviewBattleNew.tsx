'use client';

import React, { useState, useEffect } from 'react';
import { ChessBoard } from './chess/ChessBoard';
import { ChessAI } from '../lib/chessAI';
import { apiClient, type Question as APIQuestion, type ScoringResponse } from '../lib/api';
import {
  BattleContainer,
  QuestionPanel,
  ChessPanel,
  QuestionHeader,
  OpponentInfo,
  OpponentAvatar,
  OpponentDetails,
  QuestionContent,
  QuestionText,
  QuestionMeta,
  AnswerSection,
  AnswerTextarea,
  SubmitButton,
  ChessHeader,
  ChessTitle,
  ChessSubtitle,
  AIControls,
  AILabel,
  AIRange,
  AILevelDisplay
} from './styled/BattleLayout.styled';
import { APP_TEXTS } from '../constants/texts';

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

interface Opponent {
  name: string;
  avatar: string;
  level: number;
  rating: number;
}

export const InterviewBattleNew: React.FC = () => {
  // 고정된 초기값으로 하이드레이션 문제 해결 - null 타입 제거
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '1',
    text: '질문을 불러오는 중입니다...',
    category: 'loading',
    difficulty: 'medium' as const,
    timeLimit: 300
  });
  
  const [opponent, setOpponent] = useState<Opponent>({
    name: 'AI 상대',
    avatar: '🤖',
    level: 12,
    rating: 1750
  });
  
  const [answer, setAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [aiLevel, setAiLevel] = useState(12);
  const [playerAiLevel, setPlayerAiLevel] = useState(10);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [score, setScore] = useState(0);
  const [triggerChessMove, setTriggerChessMove] = useState(false);
  const [finalChessFEN, setFinalChessFEN] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<{
    question: Question;
    answer: string;
    score: number;
    timestamp: Date;
    scoringResponse?: ScoringResponse;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiQuestions, setApiQuestions] = useState<APIQuestion[]>([]);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<number>(Date.now());
  const [currentApiScore, setCurrentApiScore] = useState<number>(0);

  // 더미 데이터 제거됨 - API 데이터만 사용


  // API에서 랜덤 질문 가져오기
  const fetchRandomQuestion = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 랜덤 질문 요청 시작...');
      const question = await apiClient.getRandomQuestion();
      console.log('✅ 랜덤 질문 받음:', question);
      
      setCurrentQuestion({
        id: question.id.toString(),
        text: question.content,
        category: question.category,
        difficulty: 'medium' as const,
        timeLimit: 300
      });
      setCurrentQuestionStartTime(Date.now());
    } catch (error) {
      console.error('❌ 질문을 가져오는데 실패했습니다:', error);
      // API 실패 시 기본 질문 사용
      setCurrentQuestion({
        id: '1',
        text: 'API 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
        category: 'system',
        difficulty: 'medium' as const,
        timeLimit: 300
      });
      setCurrentQuestionStartTime(Date.now());
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 API 테스트 및 질문 가져오기
  useEffect(() => {
    const initializeAPI = async () => {
      // API 연결 테스트
      await apiClient.testConnections();
      
      // 질문 가져오기
      await fetchRandomQuestion();
    };
    
    initializeAPI();
  }, []);

  // 답변 제출
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    setIsAnswered(true);
    setIsLoading(true);
    
    try {
      // 응답 시간 계산
      const responseTime = (Date.now() - currentQuestionStartTime) / 1000;
      
      // API로 답변 채점 요청
      const scoringResponse = await apiClient.scoreAnswer({
        question_id: parseInt(currentQuestion.id),
        answer: answer,
        response_time: responseTime
      });

      // API 응답에서 점수 추출
      const answerScore = Math.round(scoringResponse.scores.total_score * 10); // 0-100 스케일로 변환
      
      // API 점수를 현재 점수로 설정
      setCurrentApiScore(scoringResponse.scores.total_score);
      
      // 답변 품질에 따른 플레이어 AI 레벨 조정 (API 점수 기반)
      const newPlayerAiLevel = Math.max(1, Math.min(25, Math.round(scoringResponse.scores.total_score * 25 / 10))); // 0-10 스케일을 1-25로 변환
      setPlayerAiLevel(newPlayerAiLevel);
      setScore(prev => prev + answerScore);
      
      // 답변한 질문 저장 (API 응답 포함)
      setAnsweredQuestions(prev => [...prev, {
        question: currentQuestion,
        answer: answer,
        score: answerScore,
        timestamp: new Date(),
        scoringResponse: scoringResponse
      }]);
      
      // 체스 수 트리거 (API에서 받은 FEN 사용)
      setTriggerChessMove(true);
      
      // 다음 질문으로 (새로운 랜덤 질문 가져오기)
      setTimeout(() => {
        fetchRandomQuestion();
        setAnswer('');
        setIsAnswered(false);
      }, 2000);
      
    } catch (error) {
      console.error('답변 채점에 실패했습니다:', error);
      
      // API 실패 시 로컬 점수 계산
      const answerLength = answer.length;
      const answerScore = Math.min(answerLength * 0.5, 100);
      const localApiScore = answerScore / 10; // 0-10 스케일로 변환
      
      // 로컬 점수를 현재 점수로 설정
      setCurrentApiScore(localApiScore);
      
      const newPlayerAiLevel = Math.max(1, Math.min(25, Math.round(localApiScore * 25 / 10))); // 0-10 스케일을 1-25로 변환
      setPlayerAiLevel(newPlayerAiLevel);
      setScore(prev => prev + answerScore);
      
      setAnsweredQuestions(prev => [...prev, {
        question: currentQuestion,
        answer: answer,
        score: answerScore,
        timestamp: new Date()
      }]);
      
      setTriggerChessMove(true);
      
      // 다음 질문으로 (새로운 랜덤 질문 가져오기)
      setTimeout(() => {
        fetchRandomQuestion();
        setAnswer('');
        setIsAnswered(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // 체스 게임 종료 처리
  const handleGameEnd = (result: 'win' | 'lose' | 'draw', fen?: string) => {
    setGameResult(result);
    setIsPlayerTurn(false);
    if (fen) {
      setFinalChessFEN(fen);
    }
  };

  // 체스 이동 완료 처리
  const handleMoveComplete = () => {
    setIsPlayerTurn(prev => !prev);
    setTriggerChessMove(false); // 트리거 리셋
  };

  // 게임 종료 상태 표시
  if (gameResult) {
    return (
      <BattleContainer>
        <QuestionPanel>
          <QuestionHeader>
            <h1>{APP_TEXTS.interviewBattle.review.title}</h1>
          </QuestionHeader>
          
          <div style={{ padding: '1.5rem' }}>
            {/* 최종 결과 */}
            <div style={{ 
              textAlign: 'center', 
              padding: '1.5rem',
              background: gameResult === 'win' ? '#f0f9ff' : gameResult === 'lose' ? '#fef2f2' : '#f9fafb',
              borderRadius: '0.75rem',
              border: `2px solid ${gameResult === 'win' ? '#0ea5e9' : gameResult === 'lose' ? '#ef4444' : '#6b7280'}`,
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ 
                color: gameResult === 'win' ? '#059669' : gameResult === 'lose' ? '#dc2626' : '#6b7280',
                margin: '0 0 0.5rem 0'
              }}>
                {gameResult === 'win' ? APP_TEXTS.interviewBattle.checkmate : gameResult === 'lose' ? APP_TEXTS.interviewBattle.checkmate : APP_TEXTS.interviewBattle.draw}
              </h2>
              <p style={{ margin: 0, color: '#6b7280' }}>
                {APP_TEXTS.interviewBattle.review.totalQuestions} {answeredQuestions.length}문제 • {APP_TEXTS.interviewBattle.review.totalScore} {score}점
              </p>
            </div>

            {/* 답변한 질문들 */}
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {answeredQuestions.map((item, index) => (
                <div key={index} style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: '#64748b',
                      fontWeight: '500'
                    }}>
                      {APP_TEXTS.interviewBattle.review.questionNumber} {index + 1} • {item.question.category} • {item.question.difficulty}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      background: item.score >= 70 ? '#f0fdf4' : item.score >= 50 ? '#fefce8' : '#fef2f2',
                      color: item.score >= 70 ? '#166534' : item.score >= 50 ? '#a16207' : '#991b1b',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {item.score}{APP_TEXTS.interviewBattle.review.points}
                    </span>
                  </div>
                  
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: '#1e293b',
                    fontSize: '1rem',
                    lineHeight: '1.4'
                  }}>
                    {item.question.text}
                  </h4>
                  
                  <div style={{
                    padding: '0.75rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    color: '#475569',
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}>
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>

            {/* 새 게임 버튼 */}
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => {
                  setGameResult(null);
                  setScore(0);
                  setPlayerAiLevel(10);
                  setIsPlayerTurn(true);
                  setFinalChessFEN(null);
                  setAnsweredQuestions([]);
                  // 게임 재시작 - API에서 새 질문 가져오기
                  fetchRandomQuestion();
                  setOpponent({
                    name: 'AI 상대',
                    avatar: '🤖',
                    level: 12,
                    rating: 1650
                  });
                  setAiLevel(12);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {APP_TEXTS.interviewBattle.review.newGameStart}
              </button>
            </div>
          </div>
        </QuestionPanel>
        <ChessPanel>
          <ChessHeader>
            <ChessTitle>{APP_TEXTS.interviewBattle.chess.title}</ChessTitle>
            <ChessSubtitle>
              {APP_TEXTS.interviewBattle.chess.gameEnded}
            </ChessSubtitle>
          </ChessHeader>
          
          <ChessBoard
            key="chess-board-final" // 게임 종료 상태의 체스판
            aiLevel={aiLevel}
            playerAiLevel={playerAiLevel}
            onGameEnd={() => {}} // 게임 종료 상태에서는 콜백 비활성화
            isPlayerTurn={false} // 게임 종료 상태에서는 턴 비활성화
            onMoveComplete={() => {}} // 게임 종료 상태에서는 이동 비활성화
            triggerMove={false} // 게임 종료 상태에서는 트리거 비활성화
            initialFEN={finalChessFEN || undefined} // 최종 체스 상태 사용
            isGameOver={true} // 게임 종료 상태임을 명시
          />
          
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem',
            background: gameResult === 'win' ? '#f0f9ff' : gameResult === 'lose' ? '#fef2f2' : '#f9fafb',
            borderRadius: '0.5rem',
            border: `1px solid ${gameResult === 'win' ? '#0ea5e9' : gameResult === 'lose' ? '#ef4444' : '#6b7280'}`,
            marginTop: '1rem'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {gameResult === 'win' ? '체크메이트!' : gameResult === 'lose' ? '체크메이트!' : '무승부'}
            </div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
              최종 점수: {score}점
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.8rem' }}>
              새 게임을 시작하려면 왼쪽 버튼을 클릭하세요
            </p>
          </div>
        </ChessPanel>
      </BattleContainer>
    );
  }
  return (
    <BattleContainer>
      <QuestionPanel>
        <QuestionHeader>
          <h1>{APP_TEXTS.interviewBattle.title}</h1>
        </QuestionHeader>
        
        <OpponentInfo>
          <OpponentAvatar>{opponent.avatar}</OpponentAvatar>
          <OpponentDetails>
            <h3>{opponent.name}</h3>
            <p>{APP_TEXTS.interviewBattle.opponent.level} {opponent.level} • {opponent.rating} {APP_TEXTS.interviewBattle.opponent.elo}</p>
          </OpponentDetails>
        </OpponentInfo>

        <QuestionContent>
          <QuestionText>{currentQuestion.text}</QuestionText>
          <QuestionMeta>
            <span>{APP_TEXTS.interviewBattle.question.category}: {currentQuestion.category}</span>
            <span>{APP_TEXTS.interviewBattle.question.difficulty}: {currentQuestion.difficulty}</span>
            <span>{APP_TEXTS.interviewBattle.question.timeLimit}: {currentQuestion.timeLimit}{APP_TEXTS.interviewBattle.question.seconds}</span>
          </QuestionMeta>
        </QuestionContent>

        <AnswerSection>
          <AnswerTextarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={APP_TEXTS.interviewBattle.question.placeholder}
            disabled={isAnswered}
          />
              <SubmitButton
                onClick={handleSubmitAnswer}
                disabled={isAnswered || !answer.trim() || isLoading}
              >
                {isLoading ? '채점 중...' : isAnswered ? APP_TEXTS.interviewBattle.question.submitted : APP_TEXTS.interviewBattle.question.submit}
              </SubmitButton>
        </AnswerSection>

        {isAnswered && (
          <div style={{ 
            padding: '1rem', 
            background: '#f0f9ff', 
            borderRadius: '0.5rem',
            border: '1px solid #0ea5e9'
          }}>
            <p style={{ margin: 0, color: '#0369a1' }}>
              {APP_TEXTS.interviewBattle.question.answerSubmitted}
            </p>
          </div>
        )}
      </QuestionPanel>

      <ChessPanel>
        <ChessHeader>
          <ChessTitle>{APP_TEXTS.interviewBattle.chess.title}</ChessTitle>
          <ChessSubtitle>
            {APP_TEXTS.interviewBattle.chess.subtitle}
          </ChessSubtitle>
        </ChessHeader>

        <ChessBoard
          key="chess-board" // 안정적인 key로 리마운트 방지
          aiLevel={aiLevel}
          playerAiLevel={playerAiLevel}
          onGameEnd={handleGameEnd}
          isPlayerTurn={isPlayerTurn}
          onMoveComplete={handleMoveComplete}
          triggerMove={triggerChessMove}
        />

        <AIControls>
          <AILabel>
            당신의 AI: {playerAiLevel} ({ChessAI.getLevelName(playerAiLevel)}) | 상대 AI: {aiLevel} ({ChessAI.getLevelName(aiLevel)})
          </AILabel>
          {currentApiScore > 0 && (
            <div style={{ 
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: '#f0fdf4',
              border: '1px solid #22c55e',
              borderRadius: '0.375rem',
              textAlign: 'center'
            }}>
              <span style={{ 
                color: '#16a34a', 
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                최근 답변 점수: {currentApiScore.toFixed(1)}/10
              </span>
            </div>
          )}
          <div style={{ 
            padding: '1rem', 
            background: '#f0f9ff', 
            borderRadius: '0.5rem',
            border: '1px solid #0ea5e9',
            textAlign: 'center',
            marginTop: '1rem'
          }}>
            <p style={{ margin: 0, color: '#0369a1', fontSize: '0.9rem' }}>
              면접 질문에 답변하면 당신의 AI가 자동으로 체스를 플레이합니다!
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#0369a1', fontSize: '0.8rem' }}>
              좋은 답변 → 강한 AI | 나쁜 답변 → 약한 AI
            </p>
          </div>
        </AIControls>

        {gameResult && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: gameResult === 'win' ? '#f0f9ff' : gameResult === 'lose' ? '#fef2f2' : '#f9fafb',
            borderRadius: '0.5rem',
            border: `1px solid ${gameResult === 'win' ? '#0ea5e9' : gameResult === 'lose' ? '#ef4444' : '#6b7280'}`,
            textAlign: 'center'
          }}>
            <h3 style={{ 
              margin: 0, 
              color: gameResult === 'win' ? '#0369a1' : gameResult === 'lose' ? '#dc2626' : '#374151' 
            }}>
              {gameResult === 'win' ? '🎉 승리!' : gameResult === 'lose' ? '😞 패배' : '🤝 무승부'}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
              총 점수: {score}점
            </p>
          </div>
        )}
      </ChessPanel>
    </BattleContainer>
  );
};
