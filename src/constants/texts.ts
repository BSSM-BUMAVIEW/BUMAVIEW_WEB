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
        activate: ''
      },
      knowledgeExploration: {
        title: '지식 탐색',
        description: '전략적으로 질문을 분석하고 학습하세요'
      },
      soloTraining: {
        title: '모의 면접',
        description: '집중적인 면접 연습으로 실력을 향상시키세요'
      },
      hallOfFame: {
        title: '면접 랭킹',
        description: '면접 랭킹을 확인해보세요'
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
    timeUpVictory: '시간 초과! 승리!',
    timeUpDefeat: '시간 초과! 패배!',
    
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

  // 질문 검색 및 답변
  questionSearch: {
    title: 'Q 지식 탐색',
    subtitle: '면접 질문과 답변을 탐색하고 학습하세요',
    searchPlaceholder: '카테고리, 회사명, 키워드로 검색...',
    filterByCategory: '카테고리별 필터',
    filterByCompany: '회사별 필터',
    filterByYear: '연도별 필터',
    noResults: '검색 결과가 없습니다.',
    loadMore: '더 보기',
    resultsCount: '개의 전략을 발견했습니다',
    
    // 답변 모달
    answerModal: {
      title: '답변 작성',
      answerLabel: '답변',
      placeholder: '질문에 대한 답변을 작성해주세요...',
      shortcut: 'Ctrl + Enter로 빠른 등록',
      submitButton: '답변 등록'
    },

    // 질문 등록 모달
    questionModal: {
      title: '질문 등록',
      companyLabel: '회사명',
      companyPlaceholder: '예: 삼성전자, 네이버, 카카오...',
      categoryLabel: '카테고리',
      dateLabel: '면접 날짜',
      contentLabel: '질문 내용',
      contentPlaceholder: '면접에서 받은 질문을 자세히 작성해주세요...',
      contentHint: '구체적인 질문 내용과 상황을 설명해주세요',
      submitButton: '질문 등록'
    },
    
    // 답변 목록
    answersList: {
      title: '다른 사람들의 답변',
      emptyTitle: '아직 답변이 없습니다',
      emptyMessage: '첫 번째 답변을 작성해보세요!'
    }
  }

} as const;

// 타입 정의
export type AppTexts = typeof APP_TEXTS;
