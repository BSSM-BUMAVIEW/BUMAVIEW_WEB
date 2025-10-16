import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API 관련 타입 정의
export interface Question {
  id: number;
  content: string;
  category: string;
  questionAt: string;
  companyName?: string;
}

export interface Answer {
  id: number;
  questionId: number;
  content: string;
  likes: number;
  createdAt: string;
}

export interface Company {
  id: number;
  name: string;
  logoUrl: string | null;
}

export interface Like {
  id: number;
  answerId: number;
  userId: number;
  createdAt: string;
}

export interface Subscription {
  id: number;
  category: string;
  userId: number;
  createdAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface ScoringResponse {
  question: Question;
  scores: {
    logic_score: number;
    time_score: number;
    accuracy_score: number;
    model_similarity_score: number;
    total_score: number;
    response_time: number;
  };
  chess_move: string;
  chess_fen: string;
}

export interface ScoringRequest {
  question_id: number;
  answer: string;
  response_time: number;
}

// API 클라이언트 클래스
class APIClient {
  private questionsClient: AxiosInstance;
  private scoringClient: AxiosInstance;

  constructor() {
    // 질문 전체 조회용 (사용자가 제공한 주소)
    const questionsBaseURL = process.env.NEXT_PUBLIC_QUESTIONS_API_URL || 'http://10.129.59.97:8080';
    // 랜덤 질문, 체스 이동, 점수 측정용
    const scoringBaseURL = process.env.NEXT_PUBLIC_SCORING_API_URL || 'http://127.0.0.1:8000';

    this.questionsClient = axios.create({
      baseURL: questionsBaseURL,
      timeout: 90000, // 90초로 증가
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.scoringClient = axios.create({
      baseURL: scoringBaseURL,
      timeout: 90000, // 90초로 증가
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터 추가 - 토큰 자동 포함
    this.setupInterceptors();
  }

  private setupInterceptors() {
    const addAuthToken = (config: any) => {
      const token = this.getAuthToken();
      // 토큰이 비어있거나 'undefined' / 'null' 문자열이면 붙이지 않는다
      if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };

    this.questionsClient.interceptors.request.use(addAuthToken);
    this.scoringClient.interceptors.request.use(addAuthToken);
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    data?: any,
    useScoringAPI: boolean = false,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
  ): Promise<T> {
    const client = useScoringAPI ? this.scoringClient : this.questionsClient;
    const apiType = useScoringAPI ? 'Scoring' : 'Questions';
    const fullUrl = `${client.defaults.baseURL}${endpoint}`;

      console.log(`🚀 ${apiType} API Request:`, {
        method: method,
        url: fullUrl,
        timeout: client.defaults.timeout,
        headers: client.defaults.headers,
        hasAuthToken: !!client.defaults.headers?.Authorization,
        data: data
      });

    try {
      let response: AxiosResponse<T>;
      
      switch (method) {
        case 'POST':
          response = await client.post(endpoint, data);
          break;
        case 'PUT':
          response = await client.put(endpoint, data);
          break;
        case 'DELETE':
          response = await client.delete(endpoint, { data });
          break;
        case 'GET':
        default:
          response = await client.get(endpoint);
          break;
      }
      
      console.log(`✅ ${apiType} API Success:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ${apiType} API Request failed:`, {
        url: fullUrl,
        method: method,
        error: error
      });
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
          throw new Error(`네트워크 오류: ${fullUrl}에 연결할 수 없습니다. API 서버가 실행 중인지 확인해주세요.`);
        }

        if (error.response) {
          // 서버가 응답했지만 에러 상태 - 원본 AxiosError를 그대로 전달 (status 참조 가능)
          (error as any).status = error.response.status;
          throw error;
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못함
          throw new Error(`서버 응답 없음: ${fullUrl}`);
        }
      }
      
      throw new Error(`알 수 없는 오류: ${error}`);
    }
  }

  // 랜덤 질문 하나 조회 (scoring API 사용)
  async getRandomQuestion(): Promise<Question> {
    const endpoint = process.env.NEXT_PUBLIC_API_QUESTIONS_ENDPOINT || '/api/questions/random/one';
    return this.request<Question>(endpoint, undefined, true); // scoring API 사용
  }

  // 면접 질문 전체 조회 (questions API 사용)
  async getAllQuestions(): Promise<Question[]> {
    const endpoint = process.env.NEXT_PUBLIC_API_ALL_QUESTIONS_ENDPOINT || '/question';
    return this.request<Question[]>(endpoint, undefined, false); // questions API 사용
  }

  // 질문 단건 조회
  async getQuestionById(id: number): Promise<Question> {
    return this.request<Question>(`/question/${id}`, undefined, false);
  }

  // 카테고리별 질문 검색 (questions API 사용)
  async getQuestionsByCategory(category: string): Promise<Question[]> {
    const endpoint = `/question/category-search?category=${encodeURIComponent(category)}`;
    return this.request<Question[]>(endpoint, undefined, false); // questions API 사용
  }

  // 면접 질문 전체 조회 (폴백용)
  async getQuestions(): Promise<Question[]> {
    try {
      // 전체 질문 조회 시도
      return await this.getAllQuestions();
    } catch (error) {
      console.error('전체 질문 조회 실패:', error);
      // API 실패 시 빈 배열 반환
      return [];
    }
  }

  // 면접 답변 채점 및 체스 수 생성 (scoring API 사용)
  async scoreAnswer(request: ScoringRequest): Promise<ScoringResponse> {
    const endpoint = process.env.NEXT_PUBLIC_API_SCORING_ENDPOINT || '/api/scoring/question-answer';
    return this.request<ScoringResponse>(endpoint, request, true, 'POST'); // scoring API 사용
  }


  // ===== QUESTION API =====
  
  // 질문 등록
  async createQuestion(data: {
    companyName: string;
    content: string;
    category: string;
    questionAt: string;
  }): Promise<Question> {
    return this.request<Question>('/question', data, false, 'POST');
  }

  // 질문 수정
  async updateQuestion(id: number, data: {
    content?: string;
    category?: string;
    questionAt?: string;
  }): Promise<Question> {
    return this.request<Question>(`/question/${id}`, data, false, 'PUT');
  }

  // 질문 삭제
  async deleteQuestion(id: number): Promise<void> {
    return this.request<void>(`/question/${id}`, undefined, false, 'DELETE');
  }

  // 연도별 검색
  async getQuestionsByYear(year: string): Promise<Question[]> {
    return this.request<Question[]>(`/question/question-at-search?questionAt=${year}`, undefined, false);
  }

  // 회사 ID로 검색
  async getQuestionsByCompany(companyId: number): Promise<Question[]> {
    return this.request<Question[]>(`/question/company-search?companyId=${companyId}`, undefined, false);
  }

  // 질문 샘플 CSV 다운로드
  async downloadQuestionSample(): Promise<Blob> {
    const response = await this.questionsClient.get('/question/sample', {
      responseType: 'blob'
    });
    return response.data;
  }

  // 질문 업로드 (CSV 파일 업로드)
  async uploadQuestions(file: File, userId: number): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', String(userId));

    await this.questionsClient.post('/question/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // 전체 질문 수 조회
  async getQuestionCount(): Promise<number> {
    return this.request<number>('/question/count', undefined, false);
  }

  // 카테고리별 질문 수 조회
  async getQuestionCountByCategory(category: string): Promise<number> {
    return this.request<number>(`/question/count/category?category=${encodeURIComponent(category)}`, undefined, false);
  }

  // 연도별 질문 수 조회
  async getQuestionCountByYear(year: string): Promise<number> {
    return this.request<number>(`/question/count/question-at?questionAt=${year}`, undefined, false);
  }

  // 회사별 질문 수 조회
  async getQuestionCountByCompany(companyId: number): Promise<number> {
    return this.request<number>(`/question/count/company?companyId=${companyId}`, undefined, false);
  }

  // ===== ANSWER API =====

  // 답변 등록
  async createAnswer(data: {
    questionId: number;
    content: string;
  }): Promise<Answer> {
    return this.request<Answer>('/answers', data, false, 'POST');
  }

  // 특정 질문의 답변들 조회
  async getAnswersByQuestion(questionId: number): Promise<Answer[]> {
    return this.request<Answer[]>(`/answers?questionId=${questionId}`, undefined, false);
  }

  // 좋아요 순으로 답변 조회
  async getAnswersByLikes(): Promise<Answer[]> {
    return this.request<Answer[]>('/answers/top', undefined, false);
  }

  // 좋아요 가장 높은 답변 1개 조회
  async getMostLikedAnswer(): Promise<Answer> {
    return this.request<Answer>('/answers/most-like', undefined, false);
  }

  // ===== COMPANY API =====

  // 회사 등록
  async createCompany(data: {
    name: string;
    logoUrl?: string;
  }): Promise<Company> {
    return this.request<Company>('/company', data, false, 'POST');
  }

  // 회사 목록 조회
  async getCompanies(): Promise<Company[]> {
    return this.request<Company[]>('/company', undefined, false);
  }

  // ===== LIKE API =====

  // 답변에 좋아요 등록
  async likeAnswer(answerId: number): Promise<Like> {
    return this.request<Like>(`/likes/${answerId}`, undefined, false, 'POST');
  }

  // 좋아요 취소
  async unlikeAnswer(answerId: number): Promise<void> {
    return this.request<void>(`/likes/${answerId}`, undefined, false, 'DELETE');
  }

  // ===== SUBSCRIPTION API =====

  // 카테고리 구독하기
  async subscribeToCategory(category: string): Promise<Subscription> {
    return this.request<Subscription>('/subscriptions', { category }, false, 'POST');
  }

  // 카테고리 구독 취소하기
  async unsubscribeFromCategory(category: string): Promise<void> {
    return this.request<void>(`/subscriptions?category=${encodeURIComponent(category)}`, undefined, false, 'DELETE');
  }

  // 내가 구독한 카테고리 목록 조회
  async getMySubscriptions(): Promise<Subscription[]> {
    return this.request<Subscription[]>('/subscriptions/me', undefined, false);
  }

  // 즉시 메일 받기
  async sendEmailNow(): Promise<void> {
    return this.request<void>('/subscriptions/send-now', undefined, false, 'POST');
  }

  // ===== AUTH API =====

  // 회원가입
  async signup(data: AuthRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', data, false, 'POST');
  }

  // 로그인
  async login(data: Omit<AuthRequest, 'name'>): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', data, false, 'POST');
  }

  // 토큰 검증 제거 - 로그인만 사용

  // ===== GAME AI METHODS =====

  // 체스 AI 관련 API
  async getChessMove(fen: string, aiLevel: number = 5) {
    try {
      const response = await this.scoringClient.post('/api/chess/move', {
        fen,
        score: aiLevel, // AI 레벨을 점수로 사용
        is_white: true
      });
      return response.data;
    } catch (error) {
      console.error('체스 AI API 오류:', error);
      throw error;
    }
  }

  // 틱택토 AI 관련 API
  async getTicTacToeMove(board: string, score: number = 5.0, isPlayerTurn: boolean = false) {
    try {
      const response = await this.scoringClient.post('/api/tictactoe/move', {
        board,
        score,
        is_player_turn: isPlayerTurn
      });
      return response.data;
    } catch (error) {
      console.error('틱택토 AI API 오류:', error);
      throw error;
    }
  }

  async createNewTicTacToeGame() {
    try {
      const response = await this.scoringClient.get('/api/tictactoe/new-game');
      return response.data;
    } catch (error) {
      console.error('새 틱택토 게임 생성 오류:', error);
      throw error;
    }
  }

  async checkTicTacToeGameState(board: string) {
    try {
      const response = await this.scoringClient.post('/api/tictactoe/check-game-state', {
        board
      });
      return response.data;
    } catch (error) {
      console.error('틱택토 게임 상태 확인 오류:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  // API 연결 테스트
  async testConnections(): Promise<void> {
    console.log('🔍 API 연결 테스트 시작...');
    
    // Questions API 테스트
    try {
      console.log('📡 Questions API 테스트 중...');
      await this.getAllQuestions();
      console.log('✅ Questions API 연결 성공');
    } catch (error) {
      console.error('❌ Questions API 연결 실패:', error);
    }

    // Companies API 테스트
    try {
      console.log('📡 Companies API 테스트 중...');
      await this.getCompanies();
      console.log('✅ Companies API 연결 성공');
    } catch (error) {
      console.error('❌ Companies API 연결 실패:', error);
    }

    // Scoring API 테스트
    try {
      console.log('📡 Scoring API 테스트 중...');
      await this.getRandomQuestion();
      console.log('✅ Scoring API 연결 성공');
    } catch (error) {
      console.error('❌ Scoring API 연결 실패:', error);
    }
  }
}

// 싱글톤 인스턴스
export const apiClient = new APIClient();
