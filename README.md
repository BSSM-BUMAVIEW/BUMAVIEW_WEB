# 부마뷰

부마뷰는 부산소프트웨어마이스터고등학교에서 모은 면접 질문들을 재미있게 면접 연습을 할 수 있도록 제작된 서비스입니다!

## 기술 스택

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