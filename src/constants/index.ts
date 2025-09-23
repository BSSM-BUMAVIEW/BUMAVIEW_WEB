import type { AppSection } from '../types';

// App Configuration
export const APP_CONFIG = {
  name: '체스 아카데미',
  description: '체스 학습과 연습을 위한 종합 플랫폼',
  version: '1.0.0',
} as const;

// Navigation Configuration
export const NAVIGATION_ITEMS: Record<AppSection, { title: string; icon: string; description: string }> = {
  dashboard: {
    title: '체스 아카데미',
    icon: '♔',
    description: '메인 대시보드',
  },
  battle: {
    title: '체스 듀얼',
    icon: '⚔️',
    description: '실시간 대전',
  },
  search: {
    title: '전략 탐색',
    icon: '🔍',
    description: '전략 분석 및 학습',
  },
  rankings: {
    title: '마스터 랭킹',
    icon: '🏆',
    description: '랭킹 시스템',
  },
  mock: {
    title: '단독 훈련',
    icon: '🎯',
    description: '개인 연습 모드',
  },
};

// Chess Configuration
export const CHESS_PIECES = ['♔', '♕', '♖', '♗', '♘', '♙'] as const;

export const CHESS_CONFIG = {
  boardSize: 8,
  pieceCount: 6,
  animationDuration: 300,
} as const;

// UI Configuration
export const UI_CONFIG = {
  transitionDuration: 300,
  particleCount: 6,
  loadingDelay: 300,
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
} as const;
