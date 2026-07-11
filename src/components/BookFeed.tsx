import { useEffect, useRef, useState } from 'react'
import { MainHeader } from './MainHeader'
import { GlobalNav } from './GlobalNav'
import { RecommendModal } from './RecommendModal'
import { SummaryCard } from './SummaryCard'
import { GuidePopup } from './GuidePopup'
import type { Book } from '../types'

type BookFeedProps = {
  books: Book[]
  favoriteIds: number[]
  onToggleFavorite: (bookId: number, isCurrentlyLiked: boolean) => void
  // 책을 넘겨 볼 때마다 호출 (예: 열람 기록 저장). 안 넘기면 호출 안 함.
  onViewBook?: (itemId: number) => void
  allowVerticalLoop?: boolean
  allowHorizontalLoop?: boolean
  enableGuide?: boolean
}

// 좌우=책 전환 / 상하=섹션 전환 스와이프 피드. 데이터 소스를 모르고 books를 받기만 한다.
export function BookFeed({
  books,
  favoriteIds,
  onToggleFavorite,
  onViewBook,
  allowVerticalLoop = true,
  allowHorizontalLoop = false,
  enableGuide = true,
}: BookFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [sectionIdx, setSectionIdx] = useState(0)
  const [sectionDir, setSectionDir] = useState<'next' | 'prev'>('next')
  const [navOpen, setNavOpen] = useState(false)
  const [modalBook, setModalBook] = useState<Book>()
  const [showGuide, setShowGuide] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const programmaticScroll = useRef(false)
  const viewedIds = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!enableGuide) return
    if (localStorage.getItem('guideDismissed') !== 'true') {
      setShowGuide(true)
    }
  }, [enableGuide])

  useEffect(() => {
    const fb = books[activeIndex] ?? books[0]
    if (fb && !viewedIds.current.has(fb.id)) {
      viewedIds.current.add(fb.id)
      try { onViewBook?.(fb.id) } catch { /* ignore */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books])

  const currentBook = books[activeIndex] ?? books[0]
  const isFavorite = currentBook ? favoriteIds.includes(currentBook.id) : false

  function handleSectionNext() {
    const lastSection = currentBook.pages.length - 1
    setSectionDir('next')
    if (sectionIdx < lastSection) {
      setSectionIdx((s) => s + 1)
    } else {
      setSectionIdx(0)
    }
  }

  function handleSectionPrev() {
    const lastSection = currentBook.pages.length - 1
    setSectionDir('prev')
    if (sectionIdx > 0) {
      setSectionIdx((s) => s - 1)
    } else {
      setSectionIdx(lastSection)
    }
  }

  function handleScroll() {
    if (programmaticScroll.current) return
    const el = listRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    if (idx !== activeIndex) {
      setActiveIndex(idx)
      setSectionIdx(0)
      setSectionDir('next')
      const id = books[idx].id
      if (!viewedIds.current.has(id)) {
        viewedIds.current.add(id)
        try { onViewBook?.(id) } catch { /* ignore */ }
      }
    }
  }

  function handleHorizontalPrev() {
    if (!allowHorizontalLoop || activeIndex === 0) return
    const el = listRef.current
    if (!el) return
    programmaticScroll.current = true
    el.scrollTo({ left: (books.length - 1) * el.clientWidth, behavior: 'smooth' })
    window.setTimeout(() => { programmaticScroll.current = false }, 500)
  }

  function handleHorizontalNext() {
    if (!allowHorizontalLoop || activeIndex < books.length - 1) return
    const el = listRef.current
    if (!el) return
    programmaticScroll.current = true
    el.scrollTo({ left: 0, behavior: 'smooth' })
    window.setTimeout(() => { programmaticScroll.current = false }, 500)
  }

  function handleBookClick(link: string) {
    window.open(link, '_blank')
  }

  return (
    <main className={`app${navOpen ? ' app--dimmed app--global-nav-open' : ''}`}>
      <MainHeader
        isFavorite={isFavorite}
        title={currentBook?.category ?? ''}
        menuOpen={navOpen}
        onFavoriteToggle={() => currentBook && onToggleFavorite(currentBook.id, isFavorite)}
        onMenuOpen={() => setNavOpen((v) => !v)}
      />

      <main className="app-main">
        <ul
          ref={listRef}
          className="book-summaries book-summaries--load-json"
          onScroll={handleScroll}
        >
          {books.map((book, index) => (
            <SummaryCard
              key={book.id}
              book={book}
              active={index === activeIndex}
              sectionIdx={sectionIdx}
              dir={sectionDir}
              allowVerticalLoop={allowVerticalLoop}
              onNext={handleSectionNext}
              onPrev={handleSectionPrev}
              onBookClick={handleBookClick}
              onHorizontalPrev={handleHorizontalPrev}
              onHorizontalNext={handleHorizontalNext}
            />
          ))}
        </ul>
      </main>

      <RecommendModal book={modalBook} isOpen={Boolean(modalBook)} onClose={() => setModalBook(undefined)} />
      <GlobalNav isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {showGuide && (
        <GuidePopup
          isOpen={showGuide}
          onClose={() => setShowGuide(false)}
        />
      )}
    </main>
  )
}
