// 앱 전체에서 사용되는 텍스트 상수들
export const APP_TEXTS = {
  // 앱 기본 정보
  appName: '부마뷰',
  appNameEnglish: 'Bumaview',
  appDescription: '면접 학습과 경쟁을 위한 종합 플랫폼',

  // 네비게이션
  navigation: {
    dashboard: '대시보드',
    interviewBattle: '면접 체스',
    strategySearch: 'Q 지식 탐색',
    masterRanking: '면접 랭킹',
    soloTraining: '◎ 모의 면접',
    login: '로그인'
  },

  // 대시보드
  dashboard: {
    hero: {
      title: '면접 배틀로 배우는 부마뷰',
      subtitle: '실시간 대결로 면접 실력을 한 단계 업그레이드하세요',
      startButton: '지금 시작하기',
      learnMoreButton: '더 알아보기'
    },
    
    stats: {
      totalQuestions: '전체 질문',
      gamesWon: '승리한 게임',
      winRate: '승률',
      eloRating: 'ELO 레이팅'
    },

    actions: {
      title: '면접 모드',
      chessDuel: {
        title: '면접 체스',
        description: '실시간 면접 대결로 실력을 겨루세요',
        pieceName: 'Knight Move',
        activate: ''
      },
      knowledgeExploration: {
        title: '지식 탐색',
        description: '전략적으로 질문을 분석하고 학습하세요',
        pieceName: 'Bishop Move'
      },
      soloTraining: {
        title: '모의 면접',
        description: '집중적인 면접 연습으로 실력을 향상시키세요',
        pieceName: 'Rook Move'
      },
      hallOfFame: {
        title: '면접 랭킹',
        description: '면접 랭킹을 확인해보세요',
        pieceName: 'Queen Move'
      }
    },

    recentGames: {
      title: '최근 경기',
      subtitle: '최근 체스 듀얼과 훈련 기록입니다',
      battleVictory: '배틀 승리',
      answerRegistration: '답변 등록',
      questionAdded: '질문 추가',
      hoursAgo: '시간 전',
      daysAgo: '일 전',
      likes: '좋아요',
      approved: '승인됨'
    },

    masteryProgress: {
      title: '도전과제 진행도',
      subtitle: '면접 마스터로 가는 여정입니다',
      dailyTraining: '일일 도전',
      weeklyChallenge: '주간 도전',
      consecutivePlay: '연속 도전 중!',
      consecutiveWinning: '연속 도전 중!',
      recentAchievements: '최근 달성 업적',
      winningStreak: '연승 달성',
      quickVictory: '빠른 승부'
    }
  },

  // 면접 배틀
  interviewBattle: {
    title: '면접 배틀',
    gameOver: '게임 종료!',
    checkmate: '체크메이트!',
    victory: '승리!',
    defeat: '패배',
    draw: '무승부',
    
    opponent: {
      level: '레벨',
      elo: 'ELO'
    },

    question: {
      category: '카테고리',
      difficulty: '난이도',
      timeLimit: '제한시간',
      seconds: '초',
      placeholder: '여기에 답변을 작성해주세요...',
      submit: '답변 제출',
      submitted: '답변 제출됨',
      answerSubmitted: '답변이 제출되었습니다! 체스 AI의 성능이 조정됩니다.'
    },

    chess: {
      title: '체스 대결',
      subtitle: '당신의 답변으로 AI의 실력이 결정됩니다',
      gameEnded: '게임이 종료되었습니다',
      yourAI: '당신의 AI',
      opponentAI: '상대 AI',
      yourTurn: '차례',
      thinking: '생각 중...',
      newGame: '새 게임 시작',
      undo: '되돌리기',
      newGameButton: '새 게임'
    },

    review: {
      title: '답변한 질문들',
      totalQuestions: '총',
      totalScore: '점',
      questionNumber: '질문',
      points: '점',
      newGameStart: '새 게임 시작'
    }
  },

  // 체스 관련
  chess: {
    gameStart: '게임 시작',
    yourTurn: '나의 AI 차례',
    opponentTurn: '상대의 AI 차례',
    check: '체크!',
    checkmate: '체크메이트!',
    victory: '승리!',
    defeat: '패배',
    draw: '무승부',
    timeUp: '시간 초과!',
    timeUpVictory: '시간 초과! 나의 승리!',
    timeUpDefeat: '시간 초과! 상대의 승리!',
    
    aiLevels: {
      beginner: 'Lv. 1',
      learner: 'Lv. 2',
      developer: 'Lv. 3',
      grower: 'Lv. 4',
      skilled: 'Lv. 5',
      expert: 'Lv. 6',
      master: 'Lv. 7',
      grandmaster: 'Lv. 8',
      legend: 'Lv. 9',
      elite: 'Lv. 10',
      champion: 'Lv. 11',
      legendary: 'Lv. 12',
      mister: 'Lv. 13',
      grandmasterPro: 'Lv. 14',
      superMaster: 'Lv. 15',
      ultraMaster: 'Lv. 16',
      megaMaster: 'Lv. 17',
      gigaMaster: 'Lv. 18',
      teraMaster: 'Lv. 19',
      petaMaster: 'Lv. 20',
      exaMaster: 'Lv. 21',
      zettaMaster: 'Lv. 22',
      yottaMaster: 'Lv. 23',
      ultimate: 'Lv. 24'
    }
  },

  // 공통
  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    retry: '다시 시도',
    cancel: '취소',
    confirm: '확인',
    save: '저장',
    delete: '삭제',
    edit: '편집',
    back: '뒤로',
    next: '다음',
    previous: '이전',
    close: '닫기',
    open: '열기',
    search: '검색',
    filter: '필터',
    sort: '정렬',
    refresh: '새로고침'
  },

  // 샘플 데이터
  sampleData: {
    opponents: [
      { name: '서정현', avatar: '👨‍💻' },
      { name: '허세진', avatar: '👩‍💻' },
      { name: '권민재', avatar: '🧑‍💻' },
      { name: '오주현', avatar: '👨‍💻' }
    ],

    questions: [
      {
        text: 'React에서 useEffect의 의존성 배열이 비어있을 때와 의존성이 있을 때의 차이점을 설명해주세요.',
        category: 'React',
        difficulty: 'medium' as const
      },
      {
        text: 'JavaScript의 클로저(Closure) 개념과 실제 사용 사례를 설명해주세요.',
        category: 'JavaScript',
        difficulty: 'hard' as const
      },
      {
        text: 'TypeScript의 제네릭(Generic)이 무엇이고, 언제 사용하는지 설명해주세요.',
        category: 'TypeScript',
        difficulty: 'medium' as const
      }
    ]
  }
} as const;

// 타입 정의
export type AppTexts = typeof APP_TEXTS;
