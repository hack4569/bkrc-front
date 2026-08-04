import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBookRecommendation, searchBooks } from '../api/books'
import { getErrorMessage } from '../api/error'
import { GlobalNav } from '../components/GlobalNav'
import { SubHeader } from '../components/SubHeader'
import type { BookSearchItem } from '../types'

const MAX_RECOMMENDATION_LENGTH = 100

export function RecommendPage() {
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState<BookSearchItem[]>([])
  const [selectedItemId, setSelectedItemId] = useState<number>()
  const [recommendation, setRecommendation] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>()
  const selectedBook = books.find((book) => book.itemId === selectedItemId)

  async function handleSearch(event: FormEvent) {
    event.preventDefault()
    const keyword = query.trim()
    if (!keyword || isSearching) return

    setError(undefined)
    setIsSearching(true)
    setHasSearched(true)
    setSelectedItemId(undefined)
    try {
      setBooks(await searchBooks(keyword))
    } catch (searchError) {
      setBooks([])
      setError(getErrorMessage(searchError, '책을 검색하지 못했습니다. 잠시 후 다시 시도해주세요.'))
    } finally {
      setIsSearching(false)
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!selectedBook) {
      setError('추천할 책을 선택해주세요.')
      return
    }
    if (!recommendation.trim()) {
      setError('책 추천 내용을 입력해주세요.')
      return
    }

    setError(undefined)
    setIsSubmitting(true)
    try {
      await createBookRecommendation({
        itemId: selectedBook.itemId,
        link: selectedBook.link,
        cover: selectedBook.cover,
        title: selectedBook.title,
        recommendation: recommendation.trim(),
      })
      window.alert('책 추천이 등록되었습니다.')
      navigate('/my?tab=recommendations')
    } catch (submitError) {
      setError(getErrorMessage(submitError, '책 추천을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={`app${navOpen ? ' app--dimmed app--global-nav-open' : ''}`}>
      <SubHeader
        title="책 추천하기"
        menuOpen={navOpen}
        onMenuOpen={() => setNavOpen((open) => !open)}
      />
      <main className="app-main">
        <section className="create-recommendation-page">
          <form className="book-search-form" onSubmit={handleSearch}>
            <label className="text-field__label" htmlFor="book-query">책 제목 또는 저자</label>
            <div className="book-search-form__row">
              <input
                id="book-query"
                className="text-field__input book-search-form__input"
                type="search"
                value={query}
                placeholder="책 제목 또는 저자를 입력해주세요"
                autoComplete="off"
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                className="button button--black book-search-form__button"
                type="submit"
                disabled={!query.trim() || isSearching}
              >
                {isSearching ? '검색 중' : '검색'}
              </button>
            </div>
          </form>

          {hasSearched && !isSearching && (
            <fieldset className="book-search-results">
              <legend className="book-search-results__title">검색 결과</legend>
              {books.length ? (
                <ul className="book-search-results__list">
                  {books.map((book) => (
                    <li key={book.itemId}>
                      <label
                        className={`book-search-result${selectedItemId === book.itemId ? ' book-search-result--selected' : ''}`}
                      >
                        <input
                          className="book-search-result__radio"
                          type="radio"
                          name="book"
                          value={book.itemId}
                          checked={selectedItemId === book.itemId}
                          onChange={() => setSelectedItemId(book.itemId)}
                        />
                        <img
                          className="book-search-result__cover"
                          src={book.cover}
                          alt={`${book.title} 표지`}
                        />
                        <span className="book-search-result__info">
                          <strong className="book-search-result__title">{book.title}</strong>
                          <span className="book-search-result__author">{book.author}</span>
                        </span>
                        <span className="book-search-result__check" aria-hidden="true" />
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="book-search-results__empty">검색 결과가 없습니다.</p>
              )}
            </fieldset>
          )}

          <form className="recommendation-content-form" onSubmit={handleSubmit}>
            <input type="hidden" name="itemId" value={selectedBook?.itemId ?? ''} />
            <input type="hidden" name="link" value={selectedBook?.link ?? ''} />
            <input type="hidden" name="cover" value={selectedBook?.cover ?? ''} />
            <input type="hidden" name="title" value={selectedBook?.title ?? ''} />
            <div className="recommendation-content-form__heading">
              <label className="text-field__label" htmlFor="recommendation">책 추천 내용</label>
              <span aria-live="polite">{recommendation.length}/{MAX_RECOMMENDATION_LENGTH}</span>
            </div>
            <textarea
              id="recommendation"
              className="text-field__area recommendation-content-form__textarea"
              value={recommendation}
              maxLength={MAX_RECOMMENDATION_LENGTH}
              placeholder="이 책을 추천하는 이유를 입력해주세요"
              onChange={(event) => setRecommendation(event.target.value)}
            />
            {error && <p className="text-field__error" role="alert">{error}</p>}
            <button
              className="button button--black recommendation-content-form__submit"
              type="submit"
              disabled={!selectedBook || !recommendation.trim() || isSubmitting}
            >
              {isSubmitting ? '제출 중' : '제출'}
            </button>
          </form>
        </section>
      </main>
      <GlobalNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
    </main>
  )
}
