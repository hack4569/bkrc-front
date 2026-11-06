import { useState } from 'react'
import type { FormEvent } from 'react'
import { getErrorMessage } from '../api/error'
import { useBookSearch } from '../hooks/useBookSearch'
import type { BookSearchItem, CreateBookRecommendation } from '../types'

const MAX_RECOMMENDATION_LENGTH = 100

type Props = {
  onSubmit: (recommendation: CreateBookRecommendation) => Promise<void>
}

type SearchResultsProps = {
  books: BookSearchItem[]
  selectedItemId?: number
  onSelect: (itemId: number) => void
}

function SearchResults({ books, selectedItemId, onSelect }: SearchResultsProps) {
  return (
    <fieldset className="book-search-results">
      <legend className="book-search-results__title">검색 결과</legend>
      {books.length ? (
        <ul className="book-search-results__list">
          {books.map((book) => {
            const isSelected = selectedItemId === book.itemId

            return (
              <li key={book.itemId}>
                <label className={`book-search-result${isSelected ? ' book-search-result--selected' : ''}`}>
                  <input
                    className="book-search-result__radio"
                    type="radio"
                    name="book"
                    value={book.itemId}
                    checked={isSelected}
                    onChange={() => onSelect(book.itemId)}
                  />
                  <img className="book-search-result__cover" src={book.cover} alt={`${book.title} 표지`} />
                  <span className="book-search-result__info">
                    <strong className="book-search-result__title">{book.title}</strong>
                    <span className="book-search-result__author">{book.author}</span>
                  </span>
                  <span className="book-search-result__check" aria-hidden="true" />
                </label>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="book-search-results__empty">검색 결과가 없습니다.</p>
      )}
    </fieldset>
  )
}

export function RecommendationEditor({ onSubmit }: Props) {
  const { books, hasSearched, isSearching, error: searchError, search } = useBookSearch()
  const [query, setQuery] = useState('')
  const [selectedItemId, setSelectedItemId] = useState<number>()
  const [recommendation, setRecommendation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>()
  const selectedBook = books.find((book) => book.itemId === selectedItemId)

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const keyword = query.trim()
    if (!keyword || isSearching) return

    setSelectedItemId(undefined)
    setSubmitError(undefined)
    void search(keyword)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = recommendation.trim()
    if (!selectedBook || !content || isSubmitting) return

    setSubmitError(undefined)
    setIsSubmitting(true)
    try {
      await onSubmit({
        itemId: selectedBook.itemId,
        link: selectedBook.link,
        cover: selectedBook.cover,
        title: selectedBook.title,
        recommendation: content,
      })
    } catch (error) {
      setSubmitError(getErrorMessage(error, '책 추천을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
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

      {searchError && <p className="text-field__error" role="alert">{searchError}</p>}
      {hasSearched && !isSearching && !searchError && (
        <SearchResults books={books} selectedItemId={selectedItemId} onSelect={setSelectedItemId} />
      )}

      <form className="recommendation-content-form" onSubmit={handleSubmit}>
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
          onChange={(event) => setRecommendation(event.target.value)}
        />
        {submitError && <p className="text-field__error" role="alert">{submitError}</p>}
        <button
          className="button button--black recommendation-content-form__submit"
          type="submit"
          disabled={!selectedBook || !recommendation.trim() || isSubmitting}
        >
          {isSubmitting ? '제출 중' : '등록하기'}
        </button>
      </form>
    </>
  )
}
