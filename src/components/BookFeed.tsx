import { useEffect, useReducer, useRef } from 'react'
import { MainHeader } from './MainHeader'
import { GlobalNav } from './GlobalNav'
import { RecommendModal } from './RecommendModal'
import { SummaryCard } from './SummaryCard'
import { GuidePopup } from './GuidePopup'
import type { Book } from '../types'
import { BookFeedContext } from '../contexts/BookFeedContext'

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

type BookFeedState = {
  activeIndex: number
  sectionIdx: number
  sectionDir: 'next' | 'prev'
  navOpen: boolean
  modalBook?: Book
  showGuide: boolean
}

type BookFeedAction =
  | { type: 'sectionNext'; lastSection: number }
  | { type: 'sectionPrev'; lastSection: number }
  | { type: 'bookChanged'; index: number }
  | { type: 'navToggled' }
  | { type: 'navClosed' }
  | { type: 'modalClosed' }
  | { type: 'guideClosed' }

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
  const [state, dispatch] = useReducer(
    (current: BookFeedState, action: BookFeedAction): BookFeedState => {
      switch (action.type) {
        case 'sectionNext': return { ...current, sectionDir: 'next', sectionIdx: current.sectionIdx < action.lastSection ? current.sectionIdx + 1 : 0 }
        case 'sectionPrev': return { ...current, sectionDir: 'prev', sectionIdx: current.sectionIdx > 0 ? current.sectionIdx - 1 : action.lastSection }
        case 'bookChanged': return { ...current, activeIndex: action.index, sectionIdx: 0, sectionDir: 'next' }
        case 'navToggled': return { ...current, navOpen: !current.navOpen }
        case 'navClosed': return { ...current, navOpen: false }
        case 'modalClosed': return { ...current, modalBook: undefined }
        case 'guideClosed': return { ...current, showGuide: false }
      }
    },
    {
      activeIndex: 0,
      sectionIdx: 0,
      sectionDir: 'next',
      navOpen: false,
      showGuide: enableGuide && localStorage.getItem('guideDismissed') !== 'true',
    },
  )
  const { activeIndex, sectionIdx, sectionDir, navOpen, modalBook, showGuide } = state
  const listRef = useRef<HTMLUListElement>(null)
  const programmaticScroll = useRef(false)
  const viewedIds = useRef<Set<number>>(new Set())


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
    dispatch({ type: 'sectionNext', lastSection })
  }

  function handleSectionPrev() {
    const lastSection = currentBook.pages.length - 1
    dispatch({ type: 'sectionPrev', lastSection })
  }

  function handleScroll() {
    if (programmaticScroll.current) return
    const el = listRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    if (idx !== activeIndex) {
      dispatch({ type: 'bookChanged', index: idx })
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
    <BookFeedContext.Provider value={{
      sectionIdx,
      direction: sectionDir,
      allowVerticalLoop,
      onNext: handleSectionNext,
      onPrev: handleSectionPrev,
      onBookClick: handleBookClick,
      onHorizontalPrev: handleHorizontalPrev,
      onHorizontalNext: handleHorizontalNext,
    }}>
    <main className={`app${navOpen ? ' app--dimmed app--global-nav-open' : ''}`}>
      <MainHeader
        isFavorite={isFavorite}
        title={currentBook?.category ?? ''}
        menuOpen={navOpen}
        onFavoriteToggle={() => currentBook && onToggleFavorite(currentBook.id, isFavorite)}
        onMenuOpen={() => dispatch({ type: 'navToggled' })}
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
            />
          ))}
        </ul>
      </main>

      <RecommendModal book={modalBook} isOpen={Boolean(modalBook)} onClose={() => dispatch({ type: 'modalClosed' })} />
      <GlobalNav isOpen={navOpen} onClose={() => dispatch({ type: 'navClosed' })} />

      {showGuide && (
        <GuidePopup
          isOpen={showGuide}
          onClose={() => dispatch({ type: 'guideClosed' })}
        />
      )}
    </main>
    </BookFeedContext.Provider>
  )
}
