# D2A · Design System v0 (Tier M)

> 레퍼런스를 4개 축(레이아웃 · 톤앤매너 · 디자인시스템 · 가독성)으로 나누어 축별로 픽하고, 그 결과를 CSS 토큰 + 프리미티브 컴포넌트로 컴파일한 결과물.

## 축별 원본 (Provenance)

| 축 | 채택 카드 | 원본 URL |
|---|---|---|
| 레이아웃 | L-3 Apple TV+ | https://tv.apple.com/ |
| 톤앤매너 | T-5* Custom Warm Light Modern | (재해석 팔레트) |
| 디자인시스템 | S-4 Apple HIG | https://developer.apple.com/design/human-interface-guidelines/ |
| 가독성 | R-1 Pretendard 표준 | https://cactus.tistory.com/306 |

## 구조

```
src/design-system/
├── tokens.css              ← CSS 변수 (SSOT)
├── tokens.ts               ← TS 상수 (미러)
├── index.ts                ← 배럴 export
└── components/
    ├── index.tsx           ← 프리미티브 12개
    └── components.css      ← 컴포넌트 스타일 (모두 var(--*) 참조)
```

## 컴포넌트 목록 (12개)

Button · Card · Input · Text · Stack · Grid · Divider · Tag · Icon · Toast · Dialog · Table

## 사용

```tsx
import { Button, Card, Text, Stack, Tag } from '@/design-system';

<Card elevation={1} padding="md">
  <Stack gap={3}>
    <Text variant="h3">방송 제목</Text>
    <Stack direction="row" gap={2}>
      <Tag tone="live">LIVE</Tag>
      <Tag tone="warn">이벤트</Tag>
      <Tag tone="sage">보상 지급</Tag>
    </Stack>
    <Button variant="primary" size="md">지금 시청</Button>
  </Stack>
</Card>
```

## 미리보기

- 로컬: `npm run dev` → http://localhost:5173/design-system
- 배포: https://sooyachoco.github.io/D2A_designsystem/design-system

## 컨벤션

- 모든 컴포넌트 스타일은 `var(--*)` 토큰만 참조 (hex/px 하드코딩 금지)
- 다크모드는 `:root[data-theme="dark"]` 로 오버라이드 (라이트가 SSOT)
- 반응형 브레이크포인트: 720px · 1080px
