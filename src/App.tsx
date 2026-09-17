import { useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Button, Card, Stack, Tag, Text } from './design-system'
import { DesignSystemPreview } from './pages/DesignSystemPreview'
import './App.css'

/** 시안(정적 HTML)의 배포 경로 — Vite base 를 그대로 따른다 */
const PREVIEW_URL = `${import.meta.env.BASE_URL}composition-preview.html`

/**
 * `/design-system` → 조합 시안으로 보낸다.
 *
 * 토큰을 판단하는 자리는 스와치가 아니라 실제 콘텐츠 위다. 기존에 공유된 링크
 * (`?tuner=open&tab=content`)가 그대로 살아있도록 쿼리를 시안 쪽 이름으로 옮겨준다.
 * 컴포넌트 카탈로그 자체는 없애지 않고 `/catalog` 로 남긴다.
 */
function RedirectToPreview() {
  useEffect(() => {
    const from = new URLSearchParams(window.location.search)
    const to = new URLSearchParams()
    // 조정기는 `tuner=open`, 시안은 `panel=open` — 같은 의도라 이름만 바꿔 넘긴다
    if (from.get('tuner') === 'open') to.set('panel', 'open')
    if (from.get('panel') === 'open') to.set('panel', 'open')
    const tab = from.get('tab')
    if (tab) to.set('tab', tab)
    const qs = to.toString()
    window.location.replace(qs ? `${PREVIEW_URL}?${qs}` : PREVIEW_URL)
  }, [])

  return (
    <main className="home">
      <section className="home__hero">
        <Text variant="body-lg" color="muted">조합 시안으로 이동 중…</Text>
        <Text variant="body" color="subtle" style={{ marginTop: 'var(--sp-3)' }}>
          자동으로 넘어가지 않으면 <a href={PREVIEW_URL}>여기를 누르세요</a>.
        </Text>
      </section>
    </main>
  )
}

function Home() {
  return (
    <main className="home">
      <section className="home__hero">
        <Text variant="caption" color="muted">D2A · Design System</Text>
        <Text variant="display" as="h1" style={{ marginTop: 'var(--sp-2)' }}>
          Design System <span style={{ color: 'var(--color-primary)' }}>v0</span>
        </Text>
        <Text variant="body-lg" color="muted" style={{ marginTop: 'var(--sp-3)', maxWidth: 640 }}>
          레퍼런스를 4개 축(레이아웃 · 톤 · 시스템 · 가독성)으로 나눠 축별로 픽하고, 그 결과를 CSS 토큰 + 프리미티브 컴포넌트로 컴파일한 결과물입니다.
        </Text>

        <Stack direction="row" gap={3} style={{ marginTop: 'var(--sp-6)' }}>
          <a href={`${PREVIEW_URL}?panel=open`}>
            <Button variant="primary" size="lg">조합 시안 열기 (조정 패널) →</Button>
          </a>
          <Link to="/catalog">
            <Button variant="secondary" size="lg">컴포넌트 카탈로그</Button>
          </Link>
          <a href="https://github.com/sooyachoco/D2A_designsystem" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="lg">GitHub 저장소</Button>
          </a>
        </Stack>
      </section>

      <section className="home__meta">
        <Card elevation={1} padding="md">
          <Stack gap={2}>
            <Tag tone="primary">축별 채택</Tag>
            <Text variant="h3" as="h3">L-3 · T-5* · S-4 · R-1</Text>
            <Text variant="body" color="muted">
              Apple TV+ 벤토 · Warm Light Modern · Apple HIG · Pretendard
            </Text>
          </Stack>
        </Card>
        <Card elevation={1} padding="md">
          <Stack gap={2}>
            <Tag tone="sage">Tier M</Tag>
            <Text variant="h3" as="h3">12개 프리미티브 컴포넌트</Text>
            <Text variant="body" color="muted">
              Button · Card · Input · Text · Stack · Grid · Divider · Tag · Icon · Toast · Dialog · Table
            </Text>
          </Stack>
        </Card>
        <Card elevation={1} padding="md">
          <Stack gap={2}>
            <Tag tone="warn">SSOT</Tag>
            <Text variant="h3" as="h3">tokens.css</Text>
            <Text variant="body" color="muted">
              모든 컴포넌트는 CSS 변수만 참조. hex/px 하드코딩 없음.
            </Text>
          </Stack>
        </Card>
      </section>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/design-system" element={<RedirectToPreview />} />
      <Route path="/catalog" element={<DesignSystemPreview />} />
    </Routes>
  )
}

export default App
