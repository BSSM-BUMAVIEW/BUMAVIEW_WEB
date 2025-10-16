'use client';

import styled from 'styled-components';

export const BackgroundContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

export const ChessPatternOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.05;
  background-image: 
    linear-gradient(45deg, transparent 25%, rgba(59, 130, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 50%, transparent 50%, transparent 75%, rgba(59, 130, 246, 0.05) 75%);
  background-size: 60px 60px;
`;

export const Particle = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  width: 1rem;
  height: 1rem;
  color: rgba(148, 163, 184, 0.2);
  pointer-events: none;
  animation: float 3s ease-in-out infinite;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
`;

export const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom right, #f8fafc, #dbeafe, #e9d5ff);
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent, transparent);
  }
`;

export const AmbientOrb = styled.div<{ 
  $top?: string; 
  $left?: string; 
  $bottom?: string; 
  $right?: string; 
  $size: string;
  $color: string;
  $delay?: string;
}>`
  position: absolute;
  width: ${props => props.$size};
  height: ${props => props.$size};
  background: ${props => props.$color};
  border-radius: 50%;
  filter: blur(2rem);
  animation: float 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
  top: ${props => props.$top || 'auto'};
  left: ${props => props.$left || 'auto'};
  bottom: ${props => props.$bottom || 'auto'};
  right: ${props => props.$right || 'auto'};
`;
