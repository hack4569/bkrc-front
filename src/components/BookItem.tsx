import { Link } from 'react-router-dom'
import type { Book } from '../types'

type BookItemProps = {
  book: Book
  white?: boolean
  showNav?: boolean
  className?: string
}

export function BookItem({ book, white = false, showNav = false, className = '' }: BookItemProps) {
  const classes = ['book-item', white ? 'book-item--white' : '', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <img className="book-item__thumbnail" src={book.cover} alt={book.title} />
      <div className="book-item__content">
        <div className="book-item__text">
          <h3 className="book-item__title">{book.title}</h3>
          <p className="book-item__publisher">출판사 : {book.publisher}</p>
          <p className="book-item__author">저자 : {book.author}</p>
        </div>
        {showNav && (
          <nav className="book-item__nav">
            <Link className="circle-button circle-button--back book-item__show-button" to={`/books/${book.id}/intro`} />
          </nav>
        )}
      </div>
    </div>
  )
}
