/**
 * /design-system 미리보기 페이지
 * 자동 생성 — 편집 지양. 컴포넌트 추가 시 이 파일에 섹션을 추가하세요.
 */
import { useState } from 'react';
import {
  Button, Card, Input, Text, Stack, Grid, Divider, Tag, Icon, Toast, Dialog, Table,
} from '../design-system';
import { ThemeTuner } from './ThemeTuner';
import './DesignSystemPreview.css';

const swatches = [
  { name: 'bg',            token: '--color-bg' },
  { name: 'surface',       token: '--color-surface' },
  { name: 'surface-alt',   token: '--color-surface-alt' },
  { name: 'border',        token: '--color-border' },
  { name: 'text-strong',   token: '--color-text-strong' },
  { name: 'text',          token: '--color-text' },
  { name: 'text-muted',    token: '--color-text-muted' },
  { name: 'primary',       token: '--color-primary' },
  { name: 'primary-soft',  token: '--color-primary-soft' },
  { name: 'sage',          token: '--color-sage' },
  { name: 'sage-soft',     token: '--color-sage-soft' },
  { name: 'live',          token: '--color-live' },
  { name: 'live-soft',     token: '--color-live-soft' },
  { name: 'warn',          token: '--color-warn' },
  { name: 'warn-soft',     token: '--color-warn-soft' },
  { name: 'danger',        token: '--color-danger' },
  { name: 'info',          token: '--color-info' },
];

const spaceTokens = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const radiusTokens = ['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const;
const shadowTokens = [0, 1, 2, 3] as const;

export function DesignSystemPreview() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="ds-preview">
      <header className="ds-preview__header">
        <Text variant="display" as="h1">D2A · Design System v0</Text>
        <Text variant="body-lg" color="muted">
          Tier M · Apple TV+ 벤토 + Warm Light Modern + Apple HIG + Pretendard
        </Text>
        <Text variant="caption" color="subtle">
          우측 하단 🎛 테마 조정으로 토큰을 직접 바꿔볼 수 있습니다 (T·S·R 축). 조정한 값은 CSS 블록으로 복사해 가져갈 수 있습니다.
        </Text>
      </header>

      <ThemeTuner />

      {/* ═══ 1. 토큰 ═══ */}
      <section id="tokens" className="ds-preview__section">
        <Text variant="h2" as="h2">1. 토큰</Text>

        {/* 컬러 스와치 */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">컬러</Text>
          <Grid cols={4} gap={3}>
            {swatches.map((sw) => (
              <div key={sw.token} className="ds-swatch">
                <div className="ds-swatch__box" style={{ background: `var(${sw.token})` }} />
                <Text variant="caption" num>{sw.name}</Text>
                <Text variant="caption" color="subtle" num>{sw.token}</Text>
              </div>
            ))}
          </Grid>
        </div>

        {/* 타이포 */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">타이포그래피</Text>
          <Stack gap={3}>
            <Text variant="display" as="div">Display · 52px · Pretendard 700</Text>
            <Text variant="h1" as="div">Heading 1 · 34px</Text>
            <Text variant="h2" as="div">Heading 2 · 26px</Text>
            <Text variant="h3" as="div">Heading 3 · 20px</Text>
            <Text variant="body-lg">Body Large · 17px — 오늘 방송 중인 라이브를 확인해 보세요.</Text>
            <Text variant="body">Body · 15px — 기본 본문 크기. line-height 1.6.</Text>
            <Text variant="caption">Caption · 12px — 보조 텍스트.</Text>
          </Stack>
        </div>

        {/* 여백·radius·shadow */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">여백 (--sp-*)</Text>
          <Stack direction="row" gap={2} align="end">
            {spaceTokens.map((n) => (
              <div key={n} className="ds-space-demo">
                <div className="ds-space-demo__bar" style={{ width: `var(--sp-${n})`, height: `var(--sp-${n})` }} />
                <Text variant="caption" num>sp-{n}</Text>
              </div>
            ))}
          </Stack>
        </div>

        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Radius</Text>
          <Stack direction="row" gap={4}>
            {radiusTokens.map((r) => (
              <div key={r} className="ds-radius-demo">
                <div className="ds-radius-demo__box" style={{ borderRadius: `var(--radius-${r})` }} />
                <Text variant="caption" num>{r}</Text>
              </div>
            ))}
          </Stack>
        </div>

        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Shadow (Elevation)</Text>
          <Stack direction="row" gap={4}>
            {shadowTokens.map((s) => (
              <div key={s} className="ds-shadow-demo">
                <div className="ds-shadow-demo__box" style={{ boxShadow: `var(--shadow-${s})` }} />
                <Text variant="caption" num>shadow-{s}</Text>
              </div>
            ))}
          </Stack>
        </div>
      </section>

      {/* ═══ 2. 컴포넌트 ═══ */}
      <section id="components" className="ds-preview__section">
        <Text variant="h2" as="h2">2. 프리미티브 컴포넌트</Text>

        {/* Button */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Button</Text>
          <Stack direction="row" gap={3} wrap>
            <Button variant="primary" size="sm">Primary sm</Button>
            <Button variant="primary" size="md">Primary md</Button>
            <Button variant="primary" size="lg">Primary lg</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
            <Button variant="primary" leadingIcon={<Icon name="play" size="sm" />}>지금 시청</Button>
            <Button variant="secondary" trailingIcon={<Icon name="chevron-right" size="sm" />}>더보기</Button>
          </Stack>
        </div>

        {/* Card */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Card</Text>
          <Grid cols={3} gap={4}>
            <Card elevation={0} padding="md">
              <Text variant="h3" as="h4">elevation 0</Text>
              <Text variant="body" color="muted">테두리만, 그림자 없음</Text>
            </Card>
            <Card elevation={1} padding="md">
              <Text variant="h3" as="h4">elevation 1</Text>
              <Text variant="body" color="muted">기본 카드 · subtle</Text>
            </Card>
            <Card elevation={2} padding="md" interactive>
              <Text variant="h3" as="h4">elevation 2 · interactive</Text>
              <Text variant="body" color="muted">호버 시 부유감</Text>
            </Card>
          </Grid>
        </div>

        {/* Input */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Input</Text>
          <Grid cols={3} gap={3}>
            <Input size="sm" placeholder="Small input" />
            <Input size="md" placeholder="Medium input" defaultValue="D2A Design System" />
            <Input size="lg" placeholder="Large input" />
            <Input error placeholder="Error 상태" />
            <Input disabled placeholder="Disabled" />
          </Grid>
        </div>

        {/* Tag */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Tag</Text>
          <Stack direction="row" gap={2} wrap>
            <Tag tone="neutral">neutral</Tag>
            <Tag tone="primary">primary</Tag>
            <Tag tone="sage">보상 지급</Tag>
            <Tag tone="live">LIVE</Tag>
            <Tag tone="warn">OX 퀴즈</Tag>
            <Tag tone="danger">차단</Tag>
            <Tag tone="info">공지</Tag>
          </Stack>
        </div>

        {/* Icon */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Icon</Text>
          <Stack direction="row" gap={4} align="center">
            <Stack direction="row" gap={2} align="center"><Icon name="home" size="md" /><Text variant="caption" num>home</Text></Stack>
            <Stack direction="row" gap={2} align="center"><Icon name="bell" size="md" /><Text variant="caption" num>bell</Text></Stack>
            <Stack direction="row" gap={2} align="center"><Icon name="play" size="md" /><Text variant="caption" num>play</Text></Stack>
            <Stack direction="row" gap={2} align="center"><Icon name="live" size="md" /><Text variant="caption" num>live</Text></Stack>
            <Stack direction="row" gap={2} align="center"><Icon name="user" size="md" /><Text variant="caption" num>user</Text></Stack>
            <Stack direction="row" gap={2} align="center"><Icon name="gift" size="md" /><Text variant="caption" num>gift</Text></Stack>
            <Stack direction="row" gap={2} align="center"><Icon name="search" size="md" /><Text variant="caption" num>search</Text></Stack>
            <Stack direction="row" gap={2} align="center"><Icon name="chevron-right" size="md" /><Text variant="caption" num>chevron-right</Text></Stack>
          </Stack>
        </div>

        {/* Toast */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Toast</Text>
          <Stack gap={2}>
            <Toast tone="success" icon={<Icon name="gift" size="sm" />}>보상이 지급되었습니다.</Toast>
            <Toast tone="warning">알림 신청 대기 중입니다.</Toast>
            <Toast tone="error">잠시 후 다시 시도해 주세요. (NXL-SVR500)</Toast>
            <Toast tone="info">방송이 곧 시작됩니다.</Toast>
          </Stack>
        </div>

        {/* Dialog */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Dialog</Text>
          <Button variant="primary" onClick={() => setDialogOpen(true)}>Dialog 열기</Button>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="공식친구 등록 동의"
            actions={
              <>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>취소</Button>
                <Button variant="primary" onClick={() => setDialogOpen(false)}>동의하고 신청</Button>
              </>
            }
          >
            이 채널을 구독하면 방송 시작 시 모바일 앱으로 알림이 발송됩니다.
          </Dialog>
        </div>

        {/* Divider */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Divider</Text>
          <Text variant="body" color="muted">기본 (hairline)</Text>
          <Divider />
          <div style={{ height: 'var(--sp-3)' }} />
          <Text variant="body" color="muted">Strong</Text>
          <Divider strong />
        </div>

        {/* Table */}
        <div className="ds-preview__block">
          <Text variant="h3" as="h3">Table</Text>
          <Card elevation={0} padding="sm">
            <Table>
              <thead>
                <tr><th>방송</th><th>게임</th><th>상태</th><th>시청자</th></tr>
              </thead>
              <tbody>
                <tr><td>도미네이터 3라운드 결승</td><td>Sports Channel A</td><td><Tag tone="live">LIVE</Tag></td><td>8,241</td></tr>
                <tr><td>시즌 3 팀 배틀</td><td>Sports Channel B</td><td><Tag tone="live">LIVE</Tag></td><td>3,120</td></tr>
                <tr><td>신규 각성 시연회</td><td>Culture Channel</td><td><Tag tone="warn">21:00 예정</Tag></td><td>—</td></tr>
              </tbody>
            </Table>
          </Card>
        </div>
      </section>

      {/* ═══ 3. Provenance ═══ */}
      <section id="provenance" className="ds-preview__section">
        <Text variant="h2" as="h2">3. 축별 원본 (Provenance)</Text>
        <Card elevation={0} padding="md">
          <Table>
            <thead>
              <tr><th>축</th><th>채택</th><th>원본</th></tr>
            </thead>
            <tbody>
              <tr><td>레이아웃</td><td>L-3 Apple TV+</td><td><a href="https://tv.apple.com/" target="_blank" rel="noopener noreferrer">tv.apple.com</a></td></tr>
              <tr><td>톤앤매너</td><td>T-5* 커스텀 라이트 모던</td><td>(재해석)</td></tr>
              <tr><td>디자인시스템</td><td>S-4 Apple HIG</td><td><a href="https://developer.apple.com/design/human-interface-guidelines/" target="_blank" rel="noopener noreferrer">Apple HIG</a></td></tr>
              <tr><td>가독성</td><td>R-1 Pretendard</td><td><a href="https://cactus.tistory.com/306" target="_blank" rel="noopener noreferrer">Pretendard 문서</a></td></tr>
            </tbody>
          </Table>
        </Card>
      </section>
    </div>
  );
}
