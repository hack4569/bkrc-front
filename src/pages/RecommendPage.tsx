import { useReducer } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBookRecommendation, searchBooks } from '../api/books'
import { getErrorMessage } from '../api/error'
import { Button } from '../components/Button'
import { GlobalNav } from '../components/GlobalNav'
import { SubHeader } from '../components/SubHeader'
import type { BookSearchItem } from '../types'

const MAX_RECOMMENDATION_LENGTH = 100

export function RecommendPage() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(
    (current: { navOpen: boolean; query: string; books: BookSearchItem[]; selectedItemId?: number; recommendation: string; hasSearched: boolean; isSearching: boolean; isSubmitting: boolean; error?: string }, action: { type: string; value?: string | number | boolean; books?: BookSearchItem[]; error?: string }) => {
      switch (action.type) {
        case 'navChanged': return { ...current, navOpen: Boolean(action.value) }
        case 'queryChanged': return { ...current, query: String(action.value ?? '') }
        case 'searchStarted': return { ...current, error: undefined, isSearching: true, hasSearched: true, selectedItemId: undefined }
        case 'searchSucceeded': return { ...current, books: action.books ?? [], isSearching: false }
        case 'searchFailed': return { ...current, books: [], error: action.error, isSearching: false }
        case 'bookSelected': return { ...current, selectedItemId: Number(action.value) }
        case 'recommendationChanged': return { ...current, recommendation: String(action.value ?? '') }
        case 'submitStarted': return { ...current, error: undefined, isSubmitting: true }
        case 'submitFailed': return { ...current, error: action.error, isSubmitting: false }
        case 'validationFailed': return { ...current, error: action.error }
        default: return current
      }
    },
    { navOpen: false, query: '', books: [], recommendation: '', hasSearched: false, isSearching: false, isSubmitting: false },
  )
  const { navOpen, query, books, selectedItemId, recommendation, hasSearched, isSearching, isSubmitting, error } = state
  const selectedBook = books.find((book) => book.itemId === selectedItemId)

  async function handleSearch(event: FormEvent) {
    event.preventDefault()
    const keyword = query.trim()
    if (!keyword || isSearching) return

    dispatch({ type: 'searchStarted' })
    try {
      dispatch({ type: 'searchSucceeded', books: await searchBooks(keyword) })
    } catch (searchError) {
      dispatch({ type: 'searchFailed', error: getErrorMessage(searchError, '책을 검색하지 못했습니다. 잠시 후 다시 시도해주세요.') })
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!selectedBook) {
      dispatch({ type: 'validationFailed', error: '추천할 책을 선택해주세요.' })
      return
    }
    if (!recommendation.trim()) {
      dispatch({ type: 'validationFailed', error: '책 추천 내용을 입력해주세요.' })
      return
    }

    dispatch({ type: 'submitStarted' })
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
      dispatch({ type: 'submitFailed', error: getErrorMessage(submitError, '책 추천을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.') })
    }
  }

  return (
    <main className={`app${navOpen ? ' app--dimmed app--global-nav-open' : ''}`}>
      <SubHeader
        title="책 추천하기"
        menuOpen={navOpen}
        onMenuOpen={() => dispatch({ type: 'navChanged', value: !navOpen })}
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
                onChange={(event) => dispatch({ type: 'queryChanged', value: event.target.value })}
              />
              <Button
                variant="primary"
                className="book-search-form__button"
                type="submit"
                disabled={!query.trim() || isSearching}
                loading={isSearching}
              >
                {isSearching ? '검색 중' : '검색'}
              </Button>
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
                          onChange={() => dispatch({ type: 'bookSelected', value: book.itemId })}
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
              <label className="text-field__label" htmlFor="recommendation">왜 이 책을 추천하시나요?</label>
              <span aria-live="polite">{recommendation.length}/{MAX_RECOMMENDATION_LENGTH}</span>
            </div>
            <textarea
              id="recommendation"
              className="text-field__area recommendation-content-form__textarea"
              value={recommendation}
              maxLength={MAX_RECOMMENDATION_LENGTH}
              placeholder="내용을 입력해주세요."
              onChange={(event) => dispatch({ type: 'recommendationChanged', value: event.target.value })}
            />
            {error && <p className="text-field__error" role="alert">{error}</p>}
            <Button
              variant="primary"
              className="recommendation-content-form__submit"
              type="submit"
              disabled={!selectedBook || !recommendation.trim() || isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? '제출 중' : '등록하기'}
            </Button>
          </form>
        </section>
      </main>
      <GlobalNav isOpen={navOpen} onClose={() => dispatch({ type: 'navChanged', value: false })} />
    </main>
  )
}
