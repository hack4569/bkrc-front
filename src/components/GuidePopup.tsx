import { useRef, useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

type Slide = {
  icon: string
  content: React.ReactNode
}

const SLIDES: Slide[] = [
  {
    icon: '/img/icon_swipe2.png',
    content: <>상하좌우로 스와이핑을 해보세요!<br />다양한 책이 준비되어 있습니다.</>,
  },
  {
    icon: '/img/intro-2.png',
    content: <>하루 총 4권을 추천해 드립니다.</>,
  },
  {
    icon: '/img/intro-3.png',
    content: <>로그인하면 오늘 본 책을 기록하여, 다음 날에는 중복 없이 새로운 책을 추천해 드립니다.</>,
  },
]

export function GuidePopup({ isOpen, onClose }: Props) {
  const [slideIdx, setSlideIdx] = useState(0)
  const touchStartX = useRef(0)

  if (!isOpen) return null

  function handleDismissForever() {
    localStorage.setItem('guideDismissed', 'true')
    onClose()
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (dx > 40 && slideIdx < SLIDES.length - 1) {
      setSlideIdx((i) => i + 1)
    } else if (dx < -40 && slideIdx > 0) {
      setSlideIdx((i) => i - 1)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
      }}
    >
      <div
        className="guide-dialog"
        style={{
          position: 'relative',
          top: 'auto',
          height: 'auto',
          padding: '28px 0 20px',
        }}
      >
        <button
          type="button"
          className="close-button guide-dialog__close-button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        />

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ width: '100%', overflow: 'hidden' }}
        >
          <div
            style={{
              display: 'flex',
              transform: `translateX(-${slideIdx * 100}%)`,
              transition: 'transform 0.35s ease',
            }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                style={{
                  flex: '0 0 100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0 24px',
                }}
              >
                <img className="guide-dialog__icon" src={slide.icon} alt="" />
                <p className="guide-dialog__content" style={{ marginTop: 14, textAlign: 'center', lineHeight: 1.6 }}>
                  {slide.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
          {SLIDES.map((_, i) => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: i === slideIdx ? '#333' : '#e0e0e0',
                transition: 'background-color 0.35s ease',
              }}
            />
          ))}
        </div>

        {slideIdx === SLIDES.length - 1 && (
          <button
            type="button"
            onClick={handleDismissForever}
            style={{
              marginTop: 14,
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '0.75rem',
              color: '#b8b8b8',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            더 이상 보지 않기
          </button>
        )}
      </div>
    </div>
  )
}
