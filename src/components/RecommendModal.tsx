import type { Book } from '../types'
import { BookItem } from './BookItem'
import { QuoteIcon } from './QuoteIcon'

type RecommendModalProps = {
  book?: Book
  isOpen: boolean
  onClose: () => void
}

export function RecommendModal({ book, isOpen, onClose }: RecommendModalProps) {
  return (
    <section
      className={`recommendation-modal recommendation-modal--${book?.color ?? 'violet'}${isOpen ? ' recommendation-modal--show' : ''}`}
    >
      <a
        href="#"
        className="close-button recommendation-modal__close-button"
        onClick={(event) => {
          event.preventDefault()
          onClose()
        }}
      ></a>
      <main className="recommendation-modal__container">
        <QuoteIcon className="recommendation-modal__icon" />
        <h1 className="recommendation-modal__title">{book?.recommendTitle}</h1>
        <p className="recommendation-modal__content">{book?.recommendBody}</p>
        {book && <BookItem book={book} white className="recommendation-modal__book-item" />}
        <a href="#" className="button recommendation-modal__edit-button">
          수정하기
        </a>
      </main>
    </section>
  )
}
