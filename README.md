# D2A · Design System

> 4축 큐레이션 기반 프로젝트 디자인시스템 v0 (Tier M — 토큰 + 프리미티브 컴포넌트)

**미리보기**: https://sooyachoco.github.io/D2A_designsystem/

## 특징

- **4축 큐레이션**: 레이아웃 · 톤앤매너 · 디자인시스템 · 가독성 각 축에서 레퍼런스를 픽하고 조합
- **CSS 변수 SSOT**: `tokens.css` 하나가 모든 색·공간·radius·shadow·타이포·레이아웃의 원천
- **12개 프리미티브 컴포넌트**: 하드코딩 없이 CSS 변수만 참조
- **다크 모드 자동 파생**: `:root[data-theme="dark"]` 로 오버라이드

## 축별 원본

| 축 | 채택 | 원본 |
|---|---|---|
| 레이아웃 | L-3 Apple TV+ 벤토 | https://tv.apple.com/ |
| 톤앤매너 | T-5* Warm Light Modern | (커스텀 팔레트) |
| 디자인시스템 | S-4 Apple HIG | https://developer.apple.com/design/human-interface-guidelines/ |
| 가독성 | R-1 Pretendard | body 15px · H1 34px · 1:1.25 · lh 1.6 |

## 빠른 시작

```bash
npm install
npm run dev     # http://localhost:5173
```

## 라우트

- `/` — 소개 홈
- `/design-system` — 컴포넌트 · 토큰 · Provenance 미리보기

## 스택

- Vite 8 + React 19 + TypeScript
- react-router-dom (v7)
- Pretendard (Google Fonts) + Space Grotesk

## 배포

- GitHub Actions 워크플로가 `main` push 시 자동 빌드
- GitHub Pages 로 정적 배포 (`base: /D2A_designsystem/`)
- Settings → Pages → Source: **GitHub Actions**

## 라이선스

MIT
