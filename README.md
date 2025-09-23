# 체스 아카데미 (Chess Academy)

체스 학습과 연습을 위한 종합 플랫폼입니다.

## 🚀 기술 스택

- **Frontend**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Build Tool**: Turbopack

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── dashboard/        # 대시보드 관련 컴포넌트
│   ├── figma/           # 피그마 관련 컴포넌트
│   ├── Background.tsx    # 배경 컴포넌트
│   ├── ContentRenderer.tsx # 콘텐츠 렌더러
│   ├── Header.tsx        # 헤더 컴포넌트
│   ├── Loading.tsx       # 로딩 컴포넌트
│   └── ...              # 기타 컴포넌트들
├── hooks/                # 커스텀 훅
│   ├── useAuth.ts       # 인증 관련 훅
│   ├── useNavigation.ts # 네비게이션 훅
│   └── useParticles.ts  # 파티클 훅
├── lib/                  # 유틸리티 함수
│   └── utils.ts         # 공통 유틸리티
├── types/                # TypeScript 타입 정의
│   └── index.ts         # 타입 정의
├── constants/            # 상수 정의
│   └── index.ts         # 앱 상수
├── styles/               # 스타일 파일
│   └── globals.css      # 글로벌 스타일
└── guidelines/           # 가이드라인
    └── Guidelines.md    # 개발 가이드라인
```

## 🎯 주요 기능

### 1. 대시보드 (Dashboard)
- 체스 아카데미 메인 화면
- 통계 및 진행률 표시
- 빠른 액션 버튼들

### 2. 체스 듀얼 (Interview Battle)
- 실시간 면접 대결
- 상대방과의 실력 겨루기

### 3. 전략 탐색 (Question Search)
- 전략적 질문 분석
- 학습 자료 탐색

### 4. 마스터 랭킹 (Rankings)
- 사용자 랭킹 시스템
- 성과 비교

### 5. 단독 훈련 (Mock Interview)
- 개인 연습 모드
- 집중적인 실력 향상

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install --legacy-peer-deps

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Background**: White/Slate
- **Text**: Slate-800

### 컴포넌트
- shadcn/ui 기반 컴포넌트 시스템
- Tailwind CSS를 활용한 반응형 디자인
- 체스 테마의 일관된 디자인

## 📱 반응형 디자인

- **Mobile**: 320px 이상
- **Tablet**: 768px 이상
- **Desktop**: 1024px 이상
- **Large Desktop**: 1280px 이상

## 🔧 개발 도구

- **TypeScript**: 타입 안전성
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Turbopack**: 빠른 빌드

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request