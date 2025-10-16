export interface WebSocketMessage {
  type: 'join' | 'answer' | 'leave' | 'waiting' | 'matched' | 'round_result' | 'game_over' | 'peer_left' | 'turn_change';
  user_id?: number;
  your_user_id?: number; // 매칭 완료 시 받는 자신의 user_id
  room_id?: string;
  fen?: string;
  players?: number[];
  current_player?: number; // 현재 턴인 플레이어 ID
  question_id?: number;
  answer?: string;
  response_time?: number;
  move?: string;
  result?: 'checkmate' | 'stalemate' | 'draw';
  final_fen?: string;
  scores?: {
    logic_score: number;
    time_score: number;
    accuracy_score: number;
    model_similarity_score: number;
    total_score: number;
    response_time: number;
  };
}

export interface WebSocketCallbacks {
  onWaiting: (data: WebSocketMessage) => void;
  onMatched: (data: WebSocketMessage) => void;
  onRoundResult: (data: WebSocketMessage) => void;
  onGameOver: (data: WebSocketMessage) => void;
  onPeerLeft: (data: WebSocketMessage) => void;
  onTurnChange: (data: WebSocketMessage) => void;
  onError: (error: Event) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private callbacks: WebSocketCallbacks;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  constructor(callbacks: WebSocketCallbacks) {
    this.callbacks = callbacks;
  }

  connect(userId: number) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8000/ws';
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket 연결됨');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.callbacks.onConnect();
        
        // 연결 후 자동으로 매칭 요청
        this.joinMatch(userId);
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 WebSocket 메시지 수신:', data);
          this.handleMessage(data);
        } catch (error) {
          console.error('❌ WebSocket 메시지 파싱 오류:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket 연결 종료:', event.code, event.reason);
        this.isConnecting = false;
        this.callbacks.onDisconnect();
        
        // 자동 재연결 시도
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect(userId);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket 오류:', error);
        this.isConnecting = false;
        this.callbacks.onError(error);
      };

    } catch (error) {
      console.error('❌ WebSocket 연결 실패:', error);
      this.isConnecting = false;
      this.callbacks.onError(error as Event);
    }
  }

  private handleMessage(data: WebSocketMessage) {
    switch (data.type) {
      case 'waiting':
        this.callbacks.onWaiting(data);
        break;
      case 'matched':
        this.callbacks.onMatched(data);
        break;
      case 'round_result':
        this.callbacks.onRoundResult(data);
        break;
      case 'game_over':
        this.callbacks.onGameOver(data);
        break;
      case 'peer_left':
        this.callbacks.onPeerLeft(data);
        break;
      case 'turn_change':
        this.callbacks.onTurnChange(data);
        break;
      default:
        console.warn('⚠️ 알 수 없는 메시지 타입:', data.type);
    }
  }

  private scheduleReconnect(userId: number) {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 ${delay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(userId);
    }, delay);
  }

  joinMatch(userId: number) {
    if (!this.isConnected()) {
      console.warn('⚠️ WebSocket이 연결되지 않음');
      return;
    }

    const message: WebSocketMessage = {
      type: 'join',
      user_id: userId
    };

    this.send(message);
  }

  submitAnswer(questionId: number, answer: string, responseTime: number, userId: number) {
    if (!this.isConnected()) {
      console.warn('⚠️ WebSocket이 연결되지 않음');
      return;
    }

    const message: WebSocketMessage = {
      type: 'answer',
      question_id: questionId,
      answer: answer,
      response_time: responseTime,
      user_id: userId
    };

    this.send(message);
  }

  leaveMatch() {
    if (!this.isConnected()) {
      return;
    }

    const message: WebSocketMessage = {
      type: 'leave'
    };

    this.send(message);
  }

  private send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('📤 WebSocket 메시지 전송:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket이 연결되지 않아 메시지를 전송할 수 없음');
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // 재연결 중단
  }

  getConnectionState(): number {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  getConnectionStateText(): string {
    switch (this.getConnectionState()) {
      case WebSocket.CONNECTING:
        return '연결 중...';
      case WebSocket.OPEN:
        return '연결됨';
      case WebSocket.CLOSING:
        return '연결 종료 중...';
      case WebSocket.CLOSED:
        return '연결 끊김';
      default:
        return '알 수 없음';
    }
  }
}
