import { createContext, useContext } from 'react'

export type BookFeedContextValue = {
  sectionIdx: number
  direction: 'next' | 'prev'
  allowVerticalLoop: boolean
  onNext: () => void
  onPrev: () => void
  onBookClick: (link: string) => void
  onHorizontalPrev: () => void
  onHorizontalNext: () => void
}

export const BookFeedContext = createContext<BookFeedContextValue | undefined>(undefined)

export function useBookFeedContext() {
  const context = useContext(BookFeedContext)
  if (!context) throw new Error('useBookFeedContext must be used within BookFeedContext.Provider')
  return context
}
