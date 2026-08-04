import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBookRecommendation, updateBookRecommendation } from '../api/books'
import { getErrorMessage } from '../api/error'
import { SubHeader } from '../components/SubHeader'
import type { MyRecommendation } from '../types'

const MAX_RECOMMENDATION_LENGTH = 100

export function MyRecommendationPage() {
  const navigate = useNavigate()
  const { itemId } = useParams()
  const [book, setBook] = useState<MyRecommendation>()
  const [recommendation, setRecommendation] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    async function load() {
      try {
        const selected = await getBookRecommendation(Number(itemId))
        setBook(selected)
        setRecommendation(selected.recommendation)
      } catch (loadError) {
        setError(getErrorMessage(loadError, '추천 정보를 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [itemId])

  async function handleSave() {
    const content = recommendation.trim()
    if (!book || book.approved !== 'N' || !content || isSaving) return

    setError(undefined)
    setIsSaving(true)
    try {
      await updateBookRecommendation(book.itemId, content)
      navigate('/my?tab=recommendations', { replace: true })
    } catch (saveError) {
      setError(getErrorMessage(saveError, '추천 내용을 수정하지 못했습니다.'))
    } finally {
      setIsSaving(false)
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
                  onChange={(event) => setRecommendation(event.target.value)}
                />
              </div>
              {error && <p className="text-field__error" role="alert">{error}</p>}
              <div className="my-recommendation-detail__actions">
                <button className="button" type="button" onClick={() => navigate(-1)}>
                  취소
                </button>
                <button
                  className="button button--black"
                  type="button"
                  disabled={!recommendation.trim() || isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? '저장 중' : '저장'}
                </button>
              </div>
            </>
          ) : book ? (
            <>
              <p className="my-book-lists__empty">
                {book.approved === 'W' ? '승인대기 중인 추천은 수정할 수 없습니다.' : '승인된 추천은 수정할 수 없습니다.'}
              </p>
              <button className="button my-recommendation-detail__back" type="button" onClick={() => navigate(-1)}>
                확인
              </button>
            </>
          ) : (
            <>
              <p className="my-book-lists__empty">추천 정보를 찾을 수 없습니다.</p>
              <button className="button my-recommendation-detail__back" type="button" onClick={() => navigate(-1)}>
                확인
              </button>
            </>
          )}
        </section>
      </main>
    </main>
  )
}
