type Props = {
  isOpen: boolean
  onClose: () => void
}

export function GuidePopup({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  function handleHideToday() {
    const today = new Intl.DateTimeFormat('ko-KR').format(new Date())
    localStorage.setItem('guideHideDate', today)
    onClose()
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
          padding: '28px 24px 20px',
        }}
      >
        <button
          type="button"
          className="close-button guide-dialog__close-button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        />
        <img className="guide-dialog__icon" src="/img/icon_swipe.svg" alt="" />
        <p className="guide-dialog__content" style={{ marginTop: 14, textAlign: 'center', lineHeight: 1.6 }}>
          상하좌우로 스와이핑을 해보세요!<br />
          다양한 책이 준비되어 있습니다.
        </p>
        <button
          type="button"
          onClick={handleHideToday}
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
          오늘 하루 동안 보지 않기
        </button>
      </div>
    </div>
  )
}
