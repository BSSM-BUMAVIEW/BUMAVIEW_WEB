'use client';

import styled from 'styled-components';
import { Button } from '../ui/button';

export const HeroContainer = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  background: linear-gradient(to bottom right, #ffffff, #dbeafe, #e9d5ff);
  color: #1e293b;
  padding: 2rem;
  border: 1px solid #bfdbfe;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideInDown 0.5s ease-out;
`;

export const ChessPatternOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: 
    linear-gradient(45deg, transparent 25%, rgba(59, 130, 246, 0.1) 25%, rgba(59, 130, 246, 0.1) 50%, transparent 50%, transparent 75%, rgba(59, 130, 246, 0.1) 75%),
    linear-gradient(45deg, transparent 25%, rgba(59, 130, 246, 0.1) 25%, rgba(59, 130, 246, 0.1) 50%, transparent 50%, transparent 75%, rgba(59, 130, 246, 0.1) 75%);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
`;

export const FloatingOrb = styled.div<{ 
  $top?: string; 
  $left?: string; 
  $bottom?: string; 
  $right?: string; 
  $size: string;
  $delay?: string;
}>`
  position: absolute;
  width: ${props => props.$size};
  height: ${props => props.$size};
  background: rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  filter: blur(2rem);
  animation: float 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
  top: ${props => props.$top || 'auto'};
  left: ${props => props.$left || 'auto'};
  bottom: ${props => props.$bottom || 'auto'};
  right: ${props => props.$right || 'auto'};
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  max-width: 32rem;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  animation: slideInLeft 0.5s ease-out;
`;

export const TitleIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(to bottom right, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
`;

export const TitleText = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(to right, #1e293b, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: typewriter 2s steps(40, end);
`;

export const Description = styled.p`
  font-size: 1.25rem;
  color: #475569;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  animation: slideInLeft 0.5s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  animation: slideInLeft 0.5s ease-out;
  animation-delay: 0.6s;
  animation-fill-mode: both;
`;

export const PrimaryButton = styled(Button)`
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.25);
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: linear-gradient(to right, #2563eb, #7c3aed);
    transform: scale(1.05);
  }
`;

export const SecondaryButton = styled(Button)`
  background: white;
  border: 1px solid #e2e8f0;
  color: #374151;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: #f8fafc;
    transform: scale(1.05);
  }
`;

export const ChessBoardPreview = styled.div`
  position: absolute;
  right: 2rem;
  top: 2rem;
  width: 8rem;
  height: 8rem;
  opacity: 0.3;
  transition: opacity 0.3s ease-in-out;
  
  &:hover {
    opacity: 0.6;
  }
`;

export const ChessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 100%;
  height: 100%;
`;

export const ChessSquare = styled.div<{ $isDark: boolean }>`
  transition: all 0.3s ease-in-out;
  background-color: ${props => props.$isDark ? 'rgba(148, 163, 184, 0.3)' : 'transparent'};
  
  &:hover {
    background-color: rgba(59, 130, 246, 0.4);
  }
`;

export const ChessPiece = styled.span<{ $color: string }>`
  color: ${props => props.$color};
  font-size: 1.125rem;
  animation: chessHover 0.3s ease-in-out;
`;

export const AnimatedBorder = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  background: linear-gradient(to right, transparent, rgba(59, 130, 246, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  pointer-events: none;
  
  ${HeroContainer}:hover & {
    opacity: 1;
  }
`;
