import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRecommendBooks } from '../api/books'
import { MainHeader } from '../components/MainHeader'
import { GlobalNav } from '../components/GlobalNav'
import { QuoteIcon } from '../components/QuoteIcon'
import { mapRecommendViewToBook } from '../hooks/useBooksWithFavorites'
import type { Book, BookCategory } from '../types'

type CategoryFilter = BookCategory | '전체'

export function IntroPage() {
  const { id } = useParams()
  const [book, setBook] = useState<Book>()
  const [navOpen, setNavOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(true)

  useEffect(() => {
    if (!id) return
    getRecommendBooks().then((views) => {
      const found = views.find((v) => String(v.itemId) === id)
      if (found) setBook(mapRecommendViewToBook(found))
    })
  }, [id])

  // IntroPage은 카테고리 변경 없이 현재 책의 카테고리를 표시만 한다
  const category: CategoryFilter = book?.category ?? '전체'

  return (
    <main className={`app${navOpen || guideOpen ? ' app--dimmed' : ''}${navOpen ? ' app--global-nav-open' : ''}`}>
      <MainHeader
        isFavorite
        title={category}
        menuOpen={navOpen}
        onFavoriteToggle={() => {}}
        onMenuOpen={() => setNavOpen((v) => !v)}
      />

      <main className="app-main">
        {book && (
          <ul className="book-summaries">
            <li className={`book-summary book-summary--${book.color} book-summary--active`}>
              <div className="summary-content">
                <section className="summary-content-section summary-content-section--quote summary-content-section--active">
                  <QuoteIcon className="summary-content-section__icon" />
                  <p className="summary-content-section__content">
                    {book.pages.find((p) => p.kind === 'quote')?.content}
                  </p>
                </section>
              </div>

              <section className="summary-about">
                <img className="summary-about__cover" src={book.cover} alt={book.title} />
                <p className="summary-about__name">{book.title}</p>
              </section>

              <nav className="summary-nav">
                <ul className="summary-nav-list">
                  <li className="summary-nav-item">
                    <Link to="/" className="circle-button circle-button--to-info">
                      <img className="summary-nav-link__icon" src="/img/icon_info.png" alt="" />
                    </Link>
                  </li>
                  <li className="summary-nav-item">
                    <Link to="/" className="circle-button circle-button--back" />
                  </li>
                </ul>
              </nav>
            </li>
          </ul>
        )}
      </main>

      <GlobalNav isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {guideOpen && (
        <dialog className="guide-dialog" open>
          <a
            href="#"
            className="close-button guide-dialog__close-button"
            onClick={(e) => { e.preventDefault(); setGuideOpen(false) }}
          />
          <img className="guide-dialog__icon" src="/img/icon_book.svg" alt="" />
          <p className="guide-dialog__content">
            상하좌우로 스와이핑을 해보세요!<br />
            다양한 책이 준비되어 있습니다.
          </p>
        </dialog>
      )}
    </main>
  )
}
