// App Types
export type AppSection = 'dashboard' | 'battle' | 'search' | 'rankings' | 'mock';

export interface Particle {
  id: number;
  x: number;
  y: number;
}

export interface NavigationProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export interface DashboardProps {
  onNavigate: (section: AppSection) => void;
}

// Chess Types
export interface ChessPiece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: 'white' | 'black';
  position: string;
}

export interface ChessGame {
  id: string;
  players: {
    white: string;
    black: string;
  };
  currentTurn: 'white' | 'black';
  board: ChessPiece[];
  status: 'active' | 'finished' | 'paused';
}

// Interview Types
export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

export interface InterviewSession {
  id: string;
  questions: InterviewQuestion[];
  currentQuestion: number;
  answers: string[];
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'paused';
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  experience: number;
  achievements: string[];
}

// Ranking Types
export interface RankingEntry {
  rank: number;
  user: User;
  score: number;
  gamesPlayed: number;
  winRate: number;
}
