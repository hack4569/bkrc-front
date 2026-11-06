import { useEffect, useReducer } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBookRecommendation, updateBookRecommendation } from '../api/books'
import { getErrorMessage } from '../api/error'
import { Button } from '../components/Button'
import { SubHeader } from '../components/SubHeader'
import type { MyRecommendation } from '../types'

const MAX_RECOMMENDATION_LENGTH = 100

export function MyRecommendationPage() {
  const navigate = useNavigate()
  const { itemId } = useParams()
  const [state, dispatch] = useReducer(
    (current: { book?: MyRecommendation; recommendation: string; isLoading: boolean; isSaving: boolean; error?: string }, action:
      | { type: 'loaded'; book: MyRecommendation }
      | { type: 'loadFailed'; error: string }
      | { type: 'recommendationChanged'; value: string }
      | { type: 'saveStarted' }
      | { type: 'saveFinished'; error?: string }) => {
      switch (action.type) {
        case 'loaded': return { ...current, book: action.book, recommendation: action.book.recommendation, isLoading: false }
        case 'loadFailed': return { ...current, error: action.error, isLoading: false }
        case 'recommendationChanged': return { ...current, recommendation: action.value }
        case 'saveStarted': return { ...current, error: undefined, isSaving: true }
        case 'saveFinished': return { ...current, error: action.error, isSaving: false }
      }
    },
    { recommendation: '', isLoading: true, isSaving: false },
  )
  const { book, recommendation, isLoading, isSaving, error } = state

  useEffect(() => {
    async function load() {
      try {
        const selected = await getBookRecommendation(Number(itemId))
        dispatch({ type: 'loaded', book: selected })
      } catch (loadError) {
        dispatch({ type: 'loadFailed', error: getErrorMessage(loadError, '추천 정보를 불러오지 못했습니다.') })
      }
    }
    load()
  }, [itemId])

  async function handleSave() {
    const content = recommendation.trim()
    if (!book || book.approved !== 'N' || !content || isSaving) return

    dispatch({ type: 'saveStarted' })
    try {
      await updateBookRecommendation(book.itemId, content)
      navigate('/my?tab=recommendations', { replace: true })
    } catch (saveError) {
      dispatch({ type: 'saveFinished', error: getErrorMessage(saveError, '추천 내용을 수정하지 못했습니다.') })
    }
  }

  return (
    <main className="app">
      <SubHeader title="추천 내용 편집" showMenu={false} />
      <main className="app-main">
        <section className="my-recommendation-detail">
          {isLoading ? (
            <p className="my-book-lists__empty">불러오는 중입니다.</p>
          ) : book?.approved === 'N' ? (
            <>
              <img className="my-recommendation-detail__cover" src={book.cover} alt={`${book.title} 표지`} />
              <h1 className="my-recommendation-detail__title">{book.title}</h1>
              <div className="my-recommendation-detail__content">
                <div className="recommendation-content-form__heading">
                  <span>책 추천 내용</span>
                  <span>{recommendation.length}/{MAX_RECOMMENDATION_LENGTH}</span>
                </div>
                <textarea
                  className="text-field__area my-recommendation-detail__textarea"
                  value={recommendation}
                  maxLength={MAX_RECOMMENDATION_LENGTH}
                  autoFocus
                  onChange={(event) => dispatch({ type: 'recommendationChanged', value: event.target.value })}
                />
              </div>
              {error && <p className="text-field__error" role="alert">{error}</p>}
              <div className="my-recommendation-detail__actions">
                <Button onClick={() => navigate(-1)}>
                  취소
                </Button>
                <Button
                  variant="primary"
                  disabled={!recommendation.trim() || isSaving}
                  loading={isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? '저장 중' : '저장'}
                </Button>
              </div>
            </>
          ) : book ? (
            <>
              <p className="my-book-lists__empty">
                {book.approved === 'W' ? '승인대기 중인 추천은 수정할 수 없습니다.' : '승인된 추천은 수정할 수 없습니다.'}
              </p>
              <Button fullWidth className="my-recommendation-detail__back" onClick={() => navigate(-1)}>
                확인
              </Button>
            </>
          ) : (
            <>
              <p className="my-book-lists__empty">추천 정보를 찾을 수 없습니다.</p>
              <Button fullWidth className="my-recommendation-detail__back" onClick={() => navigate(-1)}>
                확인
              </Button>
            </>
          )}
        </section>
      </main>
    </main>
  )
}
