import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Book, BookPage } from '../types'
import { QuoteIcon } from './QuoteIcon'

type Props = {
  book: Book
  active: boolean
  sectionIdx: number
  dir: 'next' | 'prev'
  onNext: () => void
  onPrev: () => void
  allowVerticalLoop?: boolean
  onBookClick?: (link: string) => void
  onHorizontalPrev?: () => void
  onHorizontalNext?: () => void
}

const SECTION_CLASS: Record<BookPage['kind'], string> = {
  quote: 'summary-content-section--quote',
  text: 'summary-content-section--introduction',
  review: 'summary-content-section--review',
  toc: 'summary-content-section--introduction',
}

const ellipsis: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flexShrink: 0,
}


const PITCH_COLORS: [string, string][] = [
  ['rgba(110,60,210,1)',  'rgba(230,80,170,0.85)'],  // 딥 퍼플 + 핑크
  ['rgba(70,50,210,1)',   'rgba(40,190,150,0.85)'],  // 인디고 + 에메랄드
  ['rgba(130,50,220,1)', 'rgba(240,160,30,0.85)'],   // 바이올렛 + 앰버
  ['rgba(60,40,180,1)',  'rgba(230,80,80,0.85)'],    // 미드나잇 블루 + 코랄
]

// pitch 외 애니메이션 색상들은 색상당 고유 톤 하나씩만 사용 (이름이 곧 색을 나타내므로)
const ANIMATED_PALETTES: Partial<Record<Book['color'], [string, string]>> = {
  coral:     ['rgba(255,122,89,1)',  'rgba(255,196,120,0.85)'],
  mint:      ['rgba(62,207,142,1)',  'rgba(120,220,235,0.85)'],
  lemon:     ['rgba(255,210,63,1)',  'rgba(255,150,90,0.85)'],
  peach:     ['rgba(255,157,92,1)',  'rgba(255,200,140,0.85)'],
  sky:       ['rgba(92,200,236,1)',  'rgba(150,140,240,0.85)'],
  rose:      ['rgba(247,106,154,1)', 'rgba(255,170,190,0.85)'],
  lavender:  ['rgba(176,131,224,1)', 'rgba(140,190,240,0.85)'],
  sunrise:   ['rgba(255,111,145,1)', 'rgba(255,180,84,0.85)'],
  aqua:      ['rgba(51,214,194,1)',  'rgba(120,230,220,0.85)'],
  cherry:    ['rgba(238,63,102,1)',  'rgba(255,140,160,0.85)'],
  honey:     ['rgba(232,165,61,1)',  'rgba(255,210,120,0.85)'],
  seafoam:   ['rgba(110,203,176,1)', 'rgba(160,230,210,0.85)'],
  blossom:   ['rgba(229,135,200,1)', 'rgba(240,180,220,0.85)'],
  citrus:    ['rgba(184,221,63,1)',  'rgba(230,230,120,0.85)'],
  tangerine: ['rgba(255,145,48,1)',  'rgba(255,195,110,0.85)'],
  berry:     ['rgba(184,85,217,1)',  'rgba(220,150,235,0.85)'],
  daybreak:  ['rgba(159,208,234,1)', 'rgba(220,235,250,0.85)'],
}

// 애니메이션 배경을 쓰는 색상 목록 — pitch(4가지 변형) + 위 팔레트 보유 색상들
const ANIMATED_COLORS = new Set<Book['color']>(['pitch', ...(Object.keys(ANIMATED_PALETTES) as Book['color'][])])

type PitchParams = {
  bigColor: string
  smallColor: string
  bigX: number    // 기준 x (0 or 100)
  bigY: number    // 기준 y (100)
  smallX: number  // 기준 x (반대편)
  smallY: number  // 기준 y (100)
  phase: number   // 카드별 위상 오프셋
}

function getPitchParams(color: Book['color'], id: string | number): PitchParams {
  const h = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0)
  const [bigColor, smallColor] = color === 'pitch' ? PITCH_COLORS[h % 4] : ANIMATED_PALETTES[color]!
  const bigOnRight = (h >> 2) % 2 === 0
  return {
    bigColor,
    smallColor,
    bigX:   bigOnRight ? 100 : 0,
    bigY:   100,
    smallX: bigOnRight ? 0 : 100,
    smallY: 100,
    phase: (h % 628) / 100,  // 0~6.28
  }
}

function buildPitchBackground(
  p: PitchParams,
  bigR: number, smallR: number,
  bigX: number, bigY: number,
  smallX: number, smallY: number,
): string {
  return [
    `radial-gradient(circle ${smallR.toFixed(1)}vw at ${smallX.toFixed(1)}% ${smallY.toFixed(1)}%, ${p.smallColor} 0%, transparent 100%)`,
    `radial-gradient(circle ${bigR.toFixed(1)}vw at ${bigX.toFixed(1)}% ${bigY.toFixed(1)}%, ${p.bigColor} 0%, transparent 100%)`,
    '#ffffff',
  ].join(', ')
}

// 스와이프/휠 방향으로 스크롤 여유가 있는 내부 요소가 있는지 확인.
// 있으면 네이티브 스크롤에 맡기고 섹션 전환을 막는다.
function canScrollInDirection(el: EventTarget | null, dir: 'down' | 'up'): boolean {
  if (!(el instanceof Element)) return false
  let cur: Element | null = el
  while (cur && !cur.classList.contains('summary-content') && !cur.classList.contains('book-summary')) {
    const ov = window.getComputedStyle(cur).overflowY
    if (ov === 'auto' || ov === 'scroll') {
      if (dir === 'down' && cur.scrollTop + cur.clientHeight < cur.scrollHeight - 5) return true
      if (dir === 'up' && cur.scrollTop > 5) return true
    }
    cur = cur.parentElement
  }
  return false
}

const TOC_ITEM_STYLE: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
  fontSize: '0.85rem',
  lineHeight: 1.35,
  margin: 0,
}

// summary-about: bottom:50px, cover height:110px
const COVER_BOTTOM = 50
const COVER_HEIGHT = 110

const FADE_MASK: React.CSSProperties = {
  WebkitMaskImage: 'linear-gradient(to bottom, black 45%, transparent 88%)',
  maskImage: 'linear-gradient(to bottom, black 45%, transparent 88%)',
}

function useFadeHeight(deps: React.DependencyList) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [maxH, setMaxH] = useState(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    function measure() {
      if (!container) return
      const vvh = window.visualViewport?.height ?? window.innerHeight
      const containerTop = Math.max(0, container.getBoundingClientRect().top)
      const sa = container.closest('.book-summary')?.querySelector('.summary-about') as HTMLElement | null
      const saRect = sa?.getBoundingClientRect()
      const coverTop = (saRect && saRect.top > 0 && saRect.top < vvh)
        ? saRect.top
        : vvh - COVER_BOTTOM - COVER_HEIGHT
      setMaxH(Math.max(0, coverTop - containerTop))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    window.visualViewport?.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.visualViewport?.removeEventListener('resize', measure)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const fadeContainerStyle: React.CSSProperties = {
    overflow: 'hidden',
    width: '100%',
    ...(maxH > 0 ? { minHeight: maxH, maxHeight: maxH, ...FADE_MASK } : {}),
  }

  return { containerRef, fadeContainerStyle }
}

// ── 타입별 라벨 디자인 (소개/AI/MD/목차) ──────────────────────
// 타입별 아이콘 + 컬러 라벨 + 액센트선으로 구분.
type BadgeVariant = 'description' | 'ai' | 'md' | 'toc'

// 모든 타입 라벨·아이콘·액센트선을 인용 아이콘과 동일한 보라색으로 통일.
// 타입 구분은 아이콘 모양 + 라벨 텍스트로만.
const BADGE_COLOR = '#6b35b0'

const TYPE_CONFIG: Record<BadgeVariant, { label: string; color: string; accent: string; icon: 'book' | 'spark' | 'pen' | 'list' }> = {
  description: { label: '소개',    color: BADGE_COLOR, accent: BADGE_COLOR, icon: 'book' },
  ai:          { label: 'Essence', color: BADGE_COLOR, accent: BADGE_COLOR, icon: 'spark' },
  md:          { label: 'MD 추천', color: BADGE_COLOR, accent: BADGE_COLOR, icon: 'pen' },
  toc:         { label: '목차',    color: BADGE_COLOR, accent: BADGE_COLOR, icon: 'list' },
}

function TypeIcon({ name, color }: { name: 'book' | 'spark' | 'pen' | 'list'; color: string }) {
  const common = { width: 14, height: 14, viewBox: '0 0 14 14', style: { flexShrink: 0 } } as const
  if (name === 'spark') return <svg {...common} fill={color}><path d="M7 0l1.6 5.4L14 7l-5.4 1.6L7 14l-1.6-5.4L0 7l5.4-1.6z" /></svg>
  if (name === 'pen') return <svg {...common} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 1.5l3 3L5 12 1.5 12.5 2 9z" /><path d="M8 3l3 3" /></svg>
  if (name === 'book') return <svg {...common} fill="none" stroke={color} strokeWidth={1.4}><path d="M2 2.5h4.5a1.5 1.5 0 011.5 1.5v8a1.2 1.2 0 00-1.2-1.2H2z" /><path d="M12 2.5H7.5A1.5 1.5 0 006 4v8a1.2 1.2 0 011.2-1.2H12z" /></svg>
  return <svg {...common} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round"><path d="M2 3.5h10M2 7h10M2 10.5h10" /></svg>
}

function TypeBadge({ variant }: { variant: BadgeVariant }) {
  const c = TYPE_CONFIG[variant]
  return (
    <div style={{ flexShrink: 0 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.4px', color: c.color }}>
        <TypeIcon name={c.icon} color={c.color} />{c.label}
      </span>
      <div style={{ height: 2, width: 26, marginTop: 6, borderRadius: 2, background: c.accent }} />
    </div>
  )
}

function TocPageContent({ items }: { items: string[] }) {
  const { containerRef, fadeContainerStyle } = useFadeHeight([items.length])
  return (
    <>
      <TypeBadge variant="toc" />
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, ...fadeContainerStyle }}>
        <ul style={{ margin: '28px 0 0', padding: 0, listStyle: 'none', WebkitTapHighlightColor: 'transparent' }}>
          {items.map((item, i) => (
            <li key={i} style={TOC_ITEM_STYLE}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

function TextWithLineBreaks({ text }: { text: string }) {
  return (
    <>
      {text.split(/<br\s*\/?>/i).map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

function PageContent({ page }: { page: BookPage }) {
  const { containerRef, fadeContainerStyle } = useFadeHeight([])

  if (page.kind === 'quote') {
    return (
      <>
        <QuoteIcon className="summary-content-section__icon" style={{ flexShrink: 0 }} />
        <div ref={containerRef} style={{ flex: 1, minHeight: 0, ...fadeContainerStyle }}>
          <p className="summary-content-section__content"><TextWithLineBreaks text={page.content} /></p>
        </div>
      </>
    )
  }
  if (page.kind === 'toc') {
    return <TocPageContent items={page.items} />
  }
  if (page.kind === 'text') {
    return (
      <>
        <TypeBadge variant={page.variant} />
        <div ref={containerRef} style={{ flex: 1, minHeight: 0, ...fadeContainerStyle }}>
          <p className="summary-content-section__content"><TextWithLineBreaks text={page.content} /></p>
        </div>
      </>
    )
  }
  // review
  return (
    <>
      <h1 className="summary-content-section__title" style={ellipsis}>{page.label}</h1>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, ...fadeContainerStyle }}>
        <p className="summary-content-section__content"><TextWithLineBreaks text={page.content} /></p>
      </div>
      <div className="summary-content-section__avatar">
        <img className="summary-content-section__avatar-image" src="/img/avatar.png" alt="" />
        <span className="summary-content-section__avatar-name">{page.reviewer}</span>
      </div>
    </>
  )
}

export function SummaryCard({
  book,
  active,
  sectionIdx,
  dir,
  onNext,
  onPrev,
  allowVerticalLoop = false,
  onBookClick,
  onHorizontalPrev,
  onHorizontalNext,
}: Props) {
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const wheelLock = useRef(false)
  const liRef = useRef<HTMLLIElement>(null)

  const pitchParams = useMemo(
    () => ANIMATED_COLORS.has(book.color) ? getPitchParams(book.color, book.id) : null,
    [book.id, book.color],
  )

  useEffect(() => {
    if (!pitchParams) return
    const params = pitchParams
    let raf: number
    const t0 = performance.now()
    function tick(now: number) {
      const t = (now - t0) / 1000
      const bigR   = 125 + 5  * Math.sin(t * 0.4 + params.phase)
      const smallR = 65  + 15 * Math.sin(t * 0.5 + params.phase + 1.3)
      // 각 축 독립 sin으로 ±5% 범위 내 부드럽게 이동
      const bigX   = params.bigX   + 5 * Math.sin(t * 0.68 + params.phase + 0.5)
      const bigY   = params.bigY   + 5 * Math.sin(t * 0.52 + params.phase + 1.1)
      const smallX = params.smallX + 5 * Math.sin(t * 0.84 + params.phase + 2.3)
      const smallY = params.smallY + 5 * Math.sin(t * 0.76 + params.phase + 0.8)
      if (liRef.current) {
        liRef.current.style.background = buildPitchBackground(params, bigR, smallR, bigX, bigY, smallX, smallY)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pitchParams])

  const pages = book.pages
  const shownIdx = active ? sectionIdx : 0

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY
    touchStartX.current = e.touches[0].clientX
  }

  function handleWheel(e: React.WheelEvent) {
    if (!active) return
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
    if (wheelLock.current || Math.abs(e.deltaY) < 10) return
    const scrollDir = e.deltaY > 0 ? 'down' : 'up'
    if (canScrollInDirection(e.target, scrollDir)) return
    wheelLock.current = true
    if (e.deltaY > 0) {
      const isLastSection = shownIdx >= pages.length - 1
      if (isLastSection && allowVerticalLoop) onNext()
      else if (!isLastSection) onNext()
    } else {
      onPrev()
    }
    window.setTimeout(() => { wheelLock.current = false }, 700)
  }

  function handleTouchEndWithHorizontal(e: React.TouchEvent) {
    const dy = touchStartY.current - e.changedTouches[0].clientY
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (!active) return
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 50) onHorizontalNext?.()
      else if (dx < -50) onHorizontalPrev?.()
      return
    }
    if (dy > 50) {
      if (canScrollInDirection(e.target, 'down')) return
      const isLastSection = shownIdx >= pages.length - 1
      if (isLastSection && allowVerticalLoop) onNext()
      else if (!isLastSection) onNext()
    } else if (dy < -50) {
      if (canScrollInDirection(e.target, 'up')) return
      onPrev()
    }
  }

  function handleBookClick(e: React.MouseEvent) {
    e.preventDefault()
    if (onBookClick) onBookClick(book.link)
  }

  const pitchInitialStyle = pitchParams
    ? { background: buildPitchBackground(pitchParams, 125, 65, pitchParams.bigX, pitchParams.bigY, pitchParams.smallX, pitchParams.smallY) }
    : undefined

  return (
    <li
      ref={liRef}
      className={`book-summary book-summary--${book.color} book-summary--active`}
      style={pitchInitialStyle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEndWithHorizontal}
      onWheel={handleWheel}
    >
      <div
        className={`summary-content summary-content--${dir}`}
        style={{ flex: 1, minWidth: 0 }}
      >
        {pages.map((page, idx) => (
          <section
            key={idx}
            className={`summary-content-section ${SECTION_CLASS[page.kind]}${
              idx === shownIdx ? ' summary-content-section--active' : ''
            }`}
            style={{ display: idx === shownIdx ? 'flex' : 'none', flexDirection: 'column' }}
          >
            <PageContent page={page} />
          </section>
        ))}
      </div>

      <section className="summary-about">
        <a
          href={book.link}
          onClick={handleBookClick}
          style={{ display: 'contents', cursor: 'pointer' }}
        >
          <img
            className="summary-about__cover"
            src={book.cover}
            alt={book.title}
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          />
          <p
            className="summary-about__name"
            style={{ ...ellipsis, cursor: 'pointer', pointerEvents: 'auto' }}
          >
            {book.title}
          </p>
        </a>
      </section>


    </li>
  )
}
