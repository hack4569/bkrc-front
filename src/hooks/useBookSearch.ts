import { useRef, useState } from 'react'
import { searchBooks } from '../api/books'
import { getErrorMessage } from '../api/error'
import type { BookSearchItem } from '../types'

export function useBookSearch() {
  const latestRequestId = useRef(0)
  const [books, setBooks] = useState<BookSearchItem[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string>()

  async function search(keyword: string) {
    const requestId = ++latestRequestId.current

    setError(undefined)
    setIsSearching(true)
    setHasSearched(true)

    try {``````
      const results = await searchBooks(keyword)
      if (requestId === latestRequestId.current) {
        setBooks(results)
      }
    } catch (searchError) {
      if (requestId === latestRequestId.current) {
        setBooks([])
        setError(getErrorMessage(searchError, '책을 검색하지 못했습니다. 잠시 후 다시 시도해주세요.'))
      }
    } finally {
      if (requestId === latestRequestId.current) {
        setIsSearching(false)
      }
    }
  }

  return { books, hasSearched, isSearching, error, search }
}
