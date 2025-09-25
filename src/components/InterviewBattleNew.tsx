'use client';

import React, { useState, useEffect } from 'react';
import { ChessBoard } from './chess/ChessBoard';
import { ChessAI } from '../lib/chessAI';
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
    text: APP_TEXTS.sampleData.questions[0].text,
    category: APP_TEXTS.sampleData.questions[0].category,
    difficulty: APP_TEXTS.sampleData.questions[0].difficulty,
    timeLimit: 300
  });
  
  const [opponent, setOpponent] = useState<Opponent>({
    name: APP_TEXTS.sampleData.opponents[1].name, // 허세진
    avatar: APP_TEXTS.sampleData.opponents[1].avatar,
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
  }[]>([]);

  // 샘플 질문들
  const sampleQuestions: Question[] = APP_TEXTS.sampleData.questions.map((q, index) => ({
    id: (index + 1).toString(),
    text: q.text,
    category: q.category,
    difficulty: q.difficulty,
    timeLimit: 300
  }));

  // 샘플 상대방들
  const sampleOpponents: Opponent[] = APP_TEXTS.sampleData.opponents.map((opponent, index) => ({
    name: opponent.name,
    avatar: opponent.avatar,
    level: 12 + index * 2,
    rating: 1650 + index * 150
  }));


  // 게임 초기화는 이제 useState 초기값에서 처리됨

  // 답변 제출
  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;

    setIsAnswered(true);
    
    // 답변 품질 평가 (간단한 예시)
    const answerLength = answer.length;
    const hasKeywords = currentQuestion?.text.toLowerCase().includes('react') ? 
      answer.toLowerCase().includes('effect') || answer.toLowerCase().includes('dependency') : true;
    
    let answerScore = 0;
    if (answerLength > 100) answerScore += 30;
    if (answerLength > 200) answerScore += 20;
    if (hasKeywords) answerScore += 30;
    if (answer.includes('예시') || answer.includes('예를 들어')) answerScore += 20;
    
    answerScore = Math.min(answerScore, 100);
    
    // 답변 품질에 따른 플레이어 AI 레벨 조정
    const newPlayerAiLevel = Math.max(1, Math.min(25, playerAiLevel + Math.floor((answerScore - 50) / 10)));
    setPlayerAiLevel(newPlayerAiLevel);
    setScore(prev => prev + answerScore);
    
    // 답변한 질문 저장
    setAnsweredQuestions(prev => [...prev, {
      question: currentQuestion,
      answer: answer,
      score: answerScore,
      timestamp: new Date()
    }]);
    
    // 체스 수 트리거
    setTriggerChessMove(true);
    
    // 다음 질문으로
    setTimeout(() => {
      const seed = Date.now() + Math.random() * 1000;
      const nextIndex = Math.floor((Math.sin(seed) * 10000) % 1 * sampleQuestions.length);
      const nextQuestion = sampleQuestions[Math.abs(nextIndex)] || sampleQuestions[0];
      setCurrentQuestion(nextQuestion);
      setAnswer('');
      setIsAnswered(false);
    }, 2000);
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
                  // 게임 재시작
                  const seed = Date.now();
                  const questionIndex = Math.floor((Math.sin(seed) * 10000) % 1 * sampleQuestions.length);
                  const opponentIndex = Math.floor((Math.sin(seed * 2) * 10000) % 1 * sampleOpponents.length);
                  setCurrentQuestion(sampleQuestions[Math.abs(questionIndex)] || sampleQuestions[0]);
                  setOpponent(sampleOpponents[Math.abs(opponentIndex)] || sampleOpponents[0]);
                  setAiLevel((sampleOpponents[Math.abs(opponentIndex)] || sampleOpponents[0]).level);
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
            disabled={isAnswered || !answer.trim()}
          >
            {isAnswered ? APP_TEXTS.interviewBattle.question.submitted : APP_TEXTS.interviewBattle.question.submit}
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
            당신의 AI 레벨: {playerAiLevel} ({ChessAI.getLevelName(playerAiLevel)})
          </AILabel>
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
