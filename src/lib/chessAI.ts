import { Chess, Square, Move } from 'chess.js';

export interface ChessAIConfig {
  level: number; // 1-25 단계
  depth: number;
  timeLimit: number; // ms
}

export class ChessAI {
  private chess: Chess;
  private config: ChessAIConfig;

  constructor(chess: Chess, config: ChessAIConfig) {
    this.chess = chess;
    this.config = config;
  }

  // AI 레벨에 따른 설정 매핑 - 최적화된 버전
  static getConfigForLevel(level: number): ChessAIConfig {
    // 더 가벼운 설정으로 변경
    if (level <= 5) {
      return { level, depth: 1, timeLimit: 50 };
    } else if (level <= 10) {
      return { level, depth: 2, timeLimit: 100 };
    } else if (level <= 15) {
      return { level, depth: 2, timeLimit: 150 };
    } else if (level <= 20) {
      return { level, depth: 3, timeLimit: 200 };
    } else {
      return { level, depth: 3, timeLimit: 300 };
    }
  }

  // AI가 최적의 수를 찾는 메인 함수 - 체크 상황 우선 처리
  async getBestMove(): Promise<Move | null> {
    const moves = this.chess.moves({ verbose: true });
    if (moves.length === 0) return null;

    // 체크 상황에서는 항상 유효한 수를 찾아야 함
    if (this.chess.isCheck()) {
      // 체크 상황에서는 랜덤 수 선택하지 않고 항상 최적 수 찾기
      if (this.config.depth <= 2) {
        return this.getQuickBestMove(moves);
      } else {
        const result = this.minimax(this.config.depth, -Infinity, Infinity, false);
        return result.move || moves[0]; // 최악의 경우 첫 번째 수라도 반환
      }
    }

    // 일반 상황에서의 랜덤 수 선택
    const seed = Date.now() + this.chess.history().length;
    const randomThreshold = this.config.level <= 10 ? 0.5 : 0.3;
    const randomFactor = (Math.sin(seed) * 10000) % 1;
    
    if (randomFactor > randomThreshold) {
      // 랜덤 수 선택 (빠름)
      const randomIndex = Math.floor((Math.sin(seed * 2) * 10000) % 1 * moves.length);
      return moves[Math.abs(randomIndex)];
    }

    // 간단한 평가로 빠른 수 찾기
    if (this.config.depth <= 2) {
      return this.getQuickBestMove(moves);
    }

    // 미니맥스 알고리즘 (깊이가 3 이상일 때만)
    const result = this.minimax(this.config.depth, -Infinity, Infinity, false);
    return result.move || moves[0]; // 최악의 경우 첫 번째 수라도 반환
  }

  // 빠른 수 찾기 (depth 1-2용)
  private getQuickBestMove(moves: Move[]): Move {
    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves) {
      this.chess.move(move);
      const score = this.quickEvaluate();
      this.chess.undo();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // 빠른 평가 함수
  private quickEvaluate(): number {
    if (this.chess.isCheckmate()) {
      return this.chess.turn() === 'w' ? -1000 : 1000;
    }
    if (this.chess.isDraw()) return 0;

    let score = 0;
    const board = this.chess.board();
    const pieceValues: { [key: string]: number } = {
      'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
    };

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const value = pieceValues[piece.type] || 0;
          score += piece.color === 'w' ? value : -value;
        }
      }
    }

    return score;
  }

  // 미니맥스 알고리즘 with 알파-베타 프루닝
  private minimax(depth: number, alpha: number, beta: number, maximizingPlayer: boolean): { move: Move | null, score: number } {
    if (depth === 0 || this.chess.isGameOver()) {
      return { move: null, score: this.evaluatePosition() };
    }

    const moves = this.chess.moves({ verbose: true });
    let bestMove: Move | null = null;

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of moves) {
        this.chess.move(move);
        const evaluation = this.minimax(depth - 1, alpha, beta, false);
        this.chess.undo();

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, evaluation.score);
        if (beta <= alpha) break;
      }
      return { move: bestMove, score: maxEval };
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        this.chess.move(move);
        const evaluation = this.minimax(depth - 1, alpha, beta, true);
        this.chess.undo();

        if (evaluation.score < minEval) {
          minEval = evaluation.score;
          bestMove = move;
        }
        beta = Math.min(beta, evaluation.score);
        if (beta <= alpha) break;
      }
      return { move: bestMove, score: minEval };
    }
  }

  // 체스 포지션 평가 함수 - 간소화된 버전
  private evaluatePosition(): number {
    if (this.chess.isCheckmate()) {
      return this.chess.turn() === 'w' ? -1000 : 1000;
    }
    if (this.chess.isDraw()) {
      return 0;
    }

    let score = 0;
    const board = this.chess.board();

    // 체스 말의 가치만 사용 (포지션 보너스 제거로 성능 향상)
    const pieceValues: { [key: string]: number } = {
      'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
    };

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const value = pieceValues[piece.type] || 0;
          score += piece.color === 'w' ? value : -value;
        }
      }
    }

    return score;
  }

  // AI 레벨 이름 반환
  static getLevelName(level: number): string {
    const names = [
      '초보자', '입문자', '학습자', '개발자', '성장자',
      '숙련자', '전문가', '고수', '달인', '마스터',
      '엘리트', '챔피언', '레전드', '미스터', '그랜드마스터',
      '슈퍼마스터', '울트라마스터', '메가마스터', '기가마스터', '테라마스터',
      '페타마스터', '엑사마스터', '제타마스터', '요타마스터', '최고수'
    ];
    return names[level - 1] || '초보자';
  }
}
