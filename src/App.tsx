import { Link, Route, Routes } from 'react-router-dom'
import { Button, Card, Stack, Tag, Text } from './design-system'
import { DesignSystemPreview } from './pages/DesignSystemPreview'
import './App.css'

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
          <Link to="/design-system">
            <Button variant="primary" size="lg">디자인시스템 미리보기 →</Button>
          </Link>
          <a href="https://github.com/sooyachoco/D2A_designsystem" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="lg">GitHub 저장소</Button>
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
      <Route path="/design-system" element={<DesignSystemPreview />} />
    </Routes>
  )
}

export default App
