'use client';

import styled from 'styled-components';

export const BattleContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr; // Chess panel is much wider
  gap: 1.5rem;
  max-width: 1800px; // Increased max-width
  margin: 0 auto;
  padding: 1.5rem;
  min-height: calc(100vh - 5rem);

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
`;

export const QuestionPanel = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ChessPanel = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 700px;
`;

export const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
`;

export const OpponentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
`;

export const OpponentAvatar = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(to bottom right, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
`;

export const OpponentDetails = styled.div`
  flex: 1;
  
  h3 {
    margin: 0;
    color: #1e293b;
    font-size: 1.125rem;
  }
  
  p {
    margin: 0;
    color: #64748b;
    font-size: 0.875rem;
  }
`;

export const QuestionContent = styled.div`
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border-left: 4px solid #3b82f6;
`;

export const QuestionText = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: #1e293b;
  margin: 0 0 1rem 0;
`;

export const QuestionMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #64748b;
`;

export const AnswerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AnswerTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ChessHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const ChessTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.5rem;
`;

export const ChessSubtitle = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
`;

export const AIControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
`;

export const AILabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const AIRange = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const AILevelDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
`;
