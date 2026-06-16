# BookerT FE

도서 추천 서비스 프론트엔드 (React + Vite + TypeScript).

## 요구 사항
- Node.js 18+ , npm

## 설치
```bash
npm install
```

## 개발 서버
```bash
npm run dev
```

## 빌드
```bash
npm run build      # 결과물: dist/
npm run preview    # 빌드 미리보기
```

## 환경 변수
- `VITE_API_BASE_URL` — 백엔드 API 주소
  - 개발(`.env`): 백엔드 호스트 직접 지정
  - 운영(`.env.production`): `/api` (Cloudflare Pages Functions 프록시 사용)
- `.env.example` 참고해 `.env` 생성

## 배포 (Cloudflare Pages)
- 빌드 명령: `npm run build`, 출력 디렉토리: `dist`
- `functions/api/[[path]].js` — `/api/*` 요청을 백엔드로 프록시 (BACKEND 상수에 백엔드 주소 설정)

## 구조
- `src/` — 페이지·컴포넌트·훅·API 클라이언트
- `public/css/app.css` — 퍼블리싱 스타일
- `functions/` — Cloudflare Pages Functions (API 프록시)
